"use strict";
/* =========================================================================
   3. ESTADO
   ========================================================================= */
const STORE_KEY = "titan_diet_v1";
const OLD_KEY = "cocina_nacho_v1";
let storageOK = true;
const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const MACROS = [["kcal","Calorías","kcal"],["p","Proteína","g"],["c","Hidratos","g"],["f","Grasa","g"],["fib","Fibra","g"]];

function estimateTargets(){
  // Mifflin-St Jeor, hombre 24 a, 193 cm, 113 kg -> TMB
  const tmb = 10*113 + 6.25*193 - 5*24 + 5;              // ≈ 2221 kcal
  const mant = Math.round(tmb*1.4/10)*10;                 // gimnasio + poco movimiento fuera ≈ 3110
  const kcal = Math.round(mant*0.8/10)*10;                // déficit ~20 % ≈ 2490
  return {kcal, p:190, c:250, f:80, fib:28};
}
function defaultState(){
  const est = estimateTargets();
  return {
    v:1,
    targets:{...est, source:"estimacion", updated:todayISO()},
    consumed:{kcal:0,p:0,c:0,f:0,fib:0},
    plan:Array.from({length:14},(_,i)=>({r:null,q:1})),
    extras:Array.from({length:7},()=>({desayuno:"bol_desayuno",otro:""})),
    batches:{pollo_arroz:4,pastel_carne:4,bolonesa:4,burritos:0,bocata_pollo:0,bol_desayuno:0,helado_prot:0},
    pantry:{},
    freezer:[],
    ov:{},          // overrides de recetas
    fov:{},         // overrides de alimentos
    checks:{},      // lista de compra
    sunday:{},      // tareas del domingo
    adj:{recipe:"pollo_arroz",q:1,g:null},
    tab:"hoy"
  };
}
let S;
function load(){
  try{
    let raw = localStorage.getItem(STORE_KEY);
    if(!raw){ raw = localStorage.getItem(OLD_KEY); }   // datos de la versión anterior del archivo
    if(!raw) return defaultState();
    const o = JSON.parse(raw);
    return Object.assign(defaultState(), o);
  }catch(e){ storageOK=false; return defaultState(); }
}
let saveTimer=null;
function save(){
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>{
    try{ localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
    catch(e){ storageOK=false; renderStoreStatus(); }
  },150);
}

/* =========================================================================
   4. CÁLCULO
   ========================================================================= */
function food(id){ return Object.assign({}, FOODS[id], S.fov[id]||{}); }
function recipe(id){
  const base = RECIPES.find(r=>r.id===id);
  if(!base) return null;
  const ov = S.ov[id]||{};
  const r = Object.assign({}, base);
  r.servings = ov.servings ?? base.servings;
  r.cookedWeight = (ov.cookedWeight===undefined||ov.cookedWeight===null||ov.cookedWeight==="")
      ? base.cookedWeight : Number(ov.cookedWeight);
  r.cookedWeightUser = !(ov.cookedWeight===undefined||ov.cookedWeight===null||ov.cookedWeight==="");
  r.ing = base.ing.map((it,i)=>{
    const k = it.key || it.f;
    const g = ov.ing && ov.ing[i+"_"+k]!==undefined ? Number(ov.ing[i+"_"+k]) : it.g;
    return Object.assign({}, it, {g: isNaN(g)?0:g, idx:i});
  });
  return r;
}
function zero(){ return {kcal:0,p:0,c:0,f:0,fib:0}; }
function addTo(a,b,mult=1){ for(const k in a) a[k]+= (b[k]||0)*mult; return a; }
function ingMacros(it){
  const F = food(it.f); const m = zero();
  for(const k of ["kcal","p","c","f","fib"]) m[k] = (F[k]||0)*it.g/100;
  return m;
}
/** Macros del lote a la escala guardada (raciones actuales) */
function batchMacros(r){
  const scale = r.servings / (RECIPES.find(x=>x.id===r.id).servings);
  const m = zero();
  r.ing.forEach(it=> addTo(m, ingMacros(it), scale));
  return m;
}
function servingMacros(r){
  const m = batchMacros(r), out = zero();
  for(const k in m) out[k] = m[k]/Math.max(1,r.servings);
  return out;
}
function per100(r){
  const cw = scaledCookedWeight(r);
  if(!cw) return null;
  const m = batchMacros(r), out = zero();
  for(const k in m) out[k] = m[k]*100/cw;
  return out;
}
function scaledCookedWeight(r){
  const base = RECIPES.find(x=>x.id===r.id);
  if(!r.cookedWeight) return base.useRaw ? rawWeight(r) : null;
  if(r.cookedWeightUser) return r.cookedWeight;      // el usuario lo pesó: se respeta tal cual
  return r.cookedWeight * (r.servings/base.servings); // estimación: escala con las raciones
}
function rawWeight(r){
  const scale = r.servings / (RECIPES.find(x=>x.id===r.id).servings);
  let g=0; r.ing.forEach(it=>{ if(!food(it.f).noWeight) g+=it.g*scale; });
  return g;
}
function remaining(){
  const out = zero();
  for(const k in out) out[k] = (S.targets[k]||0) - (S.consumed[k]||0);
  return out;
}

/* =========================================================================
   5. RENDER — infraestructura
   ========================================================================= */
const VIEWS = [
  ["hoy","Hoy"],["semana","Semana"],["recetas","Recetas"],["piramide","Pirámide"],["compra","Compra"],
  ["domingo","Domingo"],["congelador","Congelador"],["equipo","Equipo"],["datos","Datos"]
];
function renderTabs(){
  $("#tabs").innerHTML = VIEWS.map(([id,label])=>
    `<button role="tab" data-v="${id}" aria-selected="${S.tab===id}">${label}</button>`).join("");
  $$("#tabs button").forEach(b=>b.onclick=()=>{ S.tab=b.dataset.v; save(); renderTabs(); showView(); });
}
function showView(){
  VIEWS.forEach(([id])=>{ const el=$("#v-"+id); if(el) el.hidden = (id!==S.tab); });
  // la pirámide y el domingo dependen del plan y de las recetas: se recalculan al entrar
  if(S.tab==="piramide" && typeof renderPiramide==="function") renderPiramide();
  if(S.tab==="domingo" && typeof renderDomingo==="function") renderDomingo();
  window.scrollTo({top:0,behavior:"instant"});
}
function qTag(q){
  if(q==="v") return `<span class="tag v" title="Verificado en la ficha/etiqueta del producto">VERIF.</span>`;
  if(q==="e") return `<span class="tag e" title="Estimación: base de datos genérica o producto equivalente">ESTIM.</span>`;
  if(q==="p") return `<span class="tag p" title="Provisional o pendiente de comprobar">PENDIENTE</span>`;
  return "";
}
function macroBox(m,label){
  return `<div class="macros">
    <div><b>${r0(m.kcal)}</b><span>kcal</span></div>
    <div><b>${r1(m.p)}</b><span>prot</span></div>
    <div><b>${r1(m.c)}</b><span>hc</span></div>
    <div><b>${r1(m.f)}</b><span>grasa</span></div>
    <div><b>${r1(m.fib)}</b><span>fibra</span></div>
  </div>${label?`<p class="small" style="text-align:center;margin:.3rem 0 0">${label}</p>`:""}`;
}

/* =========================================================================
   6. VISTA HOY
   ========================================================================= */
function renderHoy(){
  const rem = remaining();
  $("#targetRows").innerHTML = MACROS.map(([k,label,u])=>`
    <tr>
      <td>${label} <small>(${u})</small></td>
      <td class="num"><input type="number" data-t="${k}" value="${S.targets[k]??0}" step="1" min="0" style="max-width:110px;text-align:right"></td>
      <td class="num"><input type="number" data-c="${k}" value="${S.consumed[k]??0}" step="1" min="0" style="max-width:110px;text-align:right"></td>
      <td class="num"><input type="number" data-r="${k}" value="${r1(rem[k])}" step="1" style="max-width:110px;text-align:right"></td>
    </tr>`).join("");
  $$("#targetRows input[data-t]").forEach(i=>i.onchange=()=>{S.targets[i.dataset.t]=Number(i.value)||0;S.targets.source="macrofactor";S.targets.updated=todayISO();save();later(()=>{renderHoy();renderAdj();});});
  $$("#targetRows input[data-c]").forEach(i=>i.onchange=()=>{S.consumed[i.dataset.c]=Number(i.value)||0;save();later(()=>{renderHoy();renderAdj();});});
  $$("#targetRows input[data-r]").forEach(i=>i.onchange=()=>{
    const k=i.dataset.r; S.consumed[k]=(S.targets[k]||0)-(Number(i.value)||0); save(); later(()=>{renderHoy(); renderAdj();});});

  const est = estimateTargets();
  const isEst = S.targets.source==="estimacion";
  $("#targetSourceNote").className = isEst? "note warn":"note ok";
  $("#targetSourceNote").innerHTML = isEst
    ? `<b>Estos objetivos son una ESTIMACIÓN mía, no cifras confirmadas.</b> Salen de Mifflin-St Jeor para hombre de 24 años, 193 cm y 113 kg (TMB ≈ 2.220 kcal), un factor de actividad de 1,4 que cuenta el gimnasio pero <b>no</b> la MMA ni la carrera que aún no haces, y un déficit del 20 %: ≈ ${est.kcal} kcal. La proteína (190 g) es un valor de trabajo alto para conservar músculo en déficit; no es un dato verificado sobre ti. <b>En cuanto MacroFactor te dé los suyos, escríbelos aquí encima y esta nota desaparece.</b> Las viejas 2.900 kcal / 220 g no están puestas en ningún sitio.`
    : `<b>Objetivos tuyos de MacroFactor</b>, actualizados el ${fmtDate(S.targets.updated)}. Si MacroFactor te los cambia el lunes, cámbialos aquí.`;
  renderAdj();
}
$("#btnResetConsumo").onclick=()=>{S.consumed=zero();save();renderHoy();};
$("#btnEstimar").onclick=()=>{
  const e=estimateTargets();
  if(confirm(`Poner la estimación de partida?\n\n${e.kcal} kcal · ${e.p} g proteína · ${e.c} g hidratos · ${e.f} g grasa · ${e.fib} g fibra\n\nSon una estimación, no tus objetivos reales.`)){
    S.targets=Object.assign({},e,{source:"estimacion",updated:todayISO()});save();renderHoy();}
};

const PORTIONS=[[0.25,"¼"],[0.5,"½"],[0.75,"¾"],[1,"1"],[1.5,"1½"],[2,"2"]];
function renderAdj(){
  const sel=$("#adjRecipe");
  if(sel.options.length===0){
    sel.innerHTML = RECIPES.map(r=>`<option value="${r.id}">${esc(r.n)}</option>`).join("");
    sel.value=S.adj.recipe;
    sel.onchange=()=>{S.adj.recipe=sel.value;S.adj.g=null;$("#adjGrams").value="";save();renderAdj();};
  }
  $("#adjChips").innerHTML = PORTIONS.map(([v,l])=>
    `<button class="chip" data-q="${v}" aria-pressed="${!S.adj.g && S.adj.q===v}">${l}</button>`).join("");
  $$("#adjChips .chip").forEach(b=>b.onclick=()=>{S.adj.q=Number(b.dataset.q);S.adj.g=null;$("#adjGrams").value="";save();renderAdj();});

  const r=recipe(S.adj.recipe); if(!r){$("#adjOut").innerHTML="";return;}
  const sm=servingMacros(r), cw=scaledCookedWeight(r), p1=per100(r);
  let m, desc, gramsShown;
  if(S.adj.g && p1){
    m=zero(); for(const k in m) m[k]=p1[k]*S.adj.g/100;
    desc=`${S.adj.g} g del plato terminado`; gramsShown=S.adj.g;
  }else if(S.adj.g && !p1){
    m=null; desc="";
  }else{
    m=zero(); for(const k in m) m[k]=sm[k]*S.adj.q;
    const lbl=PORTIONS.find(x=>x[0]===S.adj.q); desc=`${lbl?lbl[1]:S.adj.q} ración`;
    gramsShown = cw? Math.round(cw/r.servings*S.adj.q) : null;
  }
  if(!m){ $("#adjOut").innerHTML=`<div class="note warn">Esta receta no tiene peso cocinado definido, así que no puedo convertir gramos. Usa las porciones, o pesa el resultado y apúntalo en la ficha de la receta.</div>`; return; }

  const rem=remaining(), after=zero(); for(const k in after) after[k]=rem[k]-m[k];
  const rows = MACROS.map(([k,label,u])=>{
    const pct = S.targets[k]? Math.min(100, Math.max(0,(S.consumed[k]+m[k])/S.targets[k]*100)) : 0;
    const over = (S.consumed[k]+m[k]) > (S.targets[k]||Infinity);
    return `<div style="margin:.45rem 0">
      <div class="kv" style="border:none;padding:0"><span>${label}</span>
        <span><b>${r1(m[k])}</b> ${u} · quedarían <b style="color:${after[k]<0?'var(--bad)':'inherit'}">${r1(after[k])}</b> ${u}</span></div>
      <div class="bar"><i class="${over?'over':''}" style="width:${pct}%"></i></div>
    </div>`;
  }).join("");

  // aviso honesto sobre la proteína al reducir porción
  const protPct = rem.p>0 ? m.p/rem.p*100 : 0;
  let warn="";
  if(S.adj.q<1 || (S.adj.g && cw && S.adj.g < cw/r.servings)){
    warn = `<div class="note warn"><b>Ojo con la proteína.</b> Media ración no deja media necesidad: esta porción aporta <b>${r1(m.p)} g</b> y te seguirían faltando <b>${r1(after.p)} g</b> en lo que queda del día. Si vas a reducir el táper, mira de dónde va a salir esa proteína (queso batido, un bol, un bocata) antes de reducirlo, no después.</div>`;
  }
  if(after.p < 0) warn += `<div class="note ok">Con esta porción ya cubres la proteína del día.</div>`;

  $("#adjOut").innerHTML = `
    <div class="note"><b>${esc(r.n)}</b> — ${desc}${gramsShown?` ≈ <b>${gramsShown} g</b> del plato terminado`:""}.
    ${cw? `<br><small>Basado en un peso cocinado de ${r0(cw)} g para ${r.servings} raciones ${r.cookedWeightUser?'(pesado por ti)':'(estimado — pésalo y afínalo)'}.</small>`:""}</div>
    ${macroBox(m,"lo que aporta esta porción")}
    <div class="hr"></div>
    <h4>Cómo queda el día</h4>
    ${rows}
    ${warn}
    <p class="small">Esto es información para que decidas tú. No es una orden de compensar nada, y desde luego no se ajusta por lo que marque la báscula un día suelto: el propio algoritmo de MacroFactor tampoco reacciona a 1-5 días de peso raro.</p>`;
}
$("#adjGrams").oninput=()=>{const v=Number($("#adjGrams").value); S.adj.g = v>0? v:null; save(); renderAdj();};

/* =========================================================================
   7. VISTA SEMANA
   ========================================================================= */
function renderSemana(){
  const opts = id => `<option value="">— libre —</option>` + RECIPES.filter(r=>r.tipo!=="desayuno")
    .map(r=>`<option value="${r.id}" ${id===r.id?"selected":""}>${esc(r.n)}</option>`).join("");
  let html="";
  for(let d=0; d<7; d++){
    const sum=zero();
    [0,1].forEach(s=>{const p=S.plan[d*2+s]; if(p.r){const r=recipe(p.r); if(r) addTo(sum, servingMacros(r), p.q);}});
    const ex=S.extras[d]||{};
    if(ex.desayuno){const r=recipe(ex.desayuno); if(r) addTo(sum, servingMacros(r), 1);}
    html+=`<div class="day"><h4><span>${DAYS[d]}</span><span class="badge">${r0(sum.kcal)} kcal · ${r1(sum.p)} g prot</span></h4>
      <div class="grid g2">
      ${[0,1].map(s=>{const i=d*2+s;const p=S.plan[i];
        return `<div class="slot ${p.r?"":"libre"}">
          <div class="small" style="font-weight:700;margin-bottom:.25rem">${s===0?"Comida":"Cena"}${p.r?"":" · LIBRE"}</div>
          <select data-slot="${i}">${opts(p.r)}</select>
          ${p.r?`<div class="row tight" style="margin-top:.35rem">${PORTIONS.slice(0,5).map(([v,l])=>
            `<button class="chip" style="min-height:34px;font-size:.8rem" data-slotq="${i}" data-q="${v}" aria-pressed="${p.q===v}">${l}</button>`).join("")}</div>`:""}
        </div>`;}).join("")}
      </div></div>`;
  }
  $("#weekDays").innerHTML=html;
  $$("#weekDays select[data-slot]").forEach(s=>s.onchange=()=>{S.plan[+s.dataset.slot].r=s.value||null;save();later(renderSemana);});
  $$("#weekDays .chip[data-slotq]").forEach(b=>b.onclick=()=>{S.plan[+b.dataset.slotq].q=Number(b.dataset.q);save();renderSemana();});

  // contadores
  const used = S.plan.filter(p=>p.r).length;
  const rac = S.plan.reduce((a,p)=>a+(p.r?p.q:0),0);
  const libres = 14-used;
  const stock = {};
  S.freezer.forEach(f=>{ stock[f.recipeId]=(stock[f.recipeId]||0)+f.left; });
  const need = {};
  S.plan.forEach(p=>{ if(p.r) need[p.r]=(need[p.r]||0)+p.q; });
  const falta = Object.entries(need).filter(([id,q])=> (stock[id]||0) < q);
  $("#weekCount").innerHTML = `
    <div class="row">
      <span class="badge">${used} huecos con táper</span>
      <span class="badge">${r1(rac)} raciones planificadas</span>
      <span class="badge" style="${libres===2?'':'color:var(--warn)'}">${libres} libres ${libres===2?'✓':'(el plan base son 2)'}</span>
    </div>
    ${rac>12?`<div class="note warn">Has planificado ${r1(rac)} raciones y el lote base son 12. O cocinas más (pestaña Compra) o tiras de congelador.</div>`:""}
    ${falta.length?`<div class="note warn"><b>Stock insuficiente según tu congelador:</b> ${falta.map(([id,q])=>`${esc(recipe(id).n)} (necesitas ${r1(q)}, tienes ${r1(stock[id]||0)})`).join(" · ")}. Esto solo mira el inventario, no te obliga a nada.</div>`:""}`;

  // extras
  const desOpts = id=>`<option value="">—</option>`+RECIPES.filter(r=>r.tipo==="desayuno")
    .map(r=>`<option value="${r.id}" ${id===r.id?"selected":""}>${esc(r.n)}</option>`).join("");
  $("#weekExtras").innerHTML = `<div class="scrollx"><table>
    <thead><tr><th>Día</th><th>Desayuno</th><th>Almuerzo / merienda / postre</th></tr></thead><tbody>
    ${DAYS.map((d,i)=>`<tr><td>${d}</td>
      <td><select data-ex-d="${i}">${desOpts((S.extras[i]||{}).desayuno)}</select></td>
      <td><input data-ex-o="${i}" value="${esc((S.extras[i]||{}).otro||"")}" placeholder="bocata, burrito, fruta…"></td></tr>`).join("")}
    </tbody></table></div>
    <div class="note">Si un día almuerzas un bocata que no estaba previsto, no pasa nada: apúntalo aquí, regístralo en MacroFactor y por la tarde ajusta la porción del táper en la pestaña «Hoy». Ese es todo el sistema.</div>`;
  $$("#weekExtras select[data-ex-d]").forEach(s=>s.onchange=()=>{S.extras[+s.dataset.exD].desayuno=s.value;save();later(renderSemana);});
  $$("#weekExtras input[data-ex-o]").forEach(s=>s.onchange=()=>{S.extras[+s.dataset.exO].otro=s.value;save();});
}
