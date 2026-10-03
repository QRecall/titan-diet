"use strict";
/* =========================================================================
   3. ESTADO
   ========================================================================= */
const STORE_KEY = "titan_diet_v1";
const OLD_KEY = "cocina_nacho_v1";
let storageOK = true;
const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const MACROS = [["kcal","Calorías","kcal"],["p","Proteína","g"],["c","Hidratos","g"],["f","Grasa","g"],["fib","Fibra","g"]];

/* Medición Tanita del 03/10/2026: 114,2 kg · 27,7 % grasa · masa libre de grasa 82,57 kg ·
   TMB según la báscula 2526 kcal · grasa visceral 9 */
const TANITA = {fecha:"2026-10-03", peso:114.2, grasa:27.7, mlg:82.57, tmbTanita:2526, visceral:9};
const TARGETS_V = 2;   // sube cuando cambia la forma de estimar: re-aplica la estimación a quien no tenga cifras de MacroFactor
function estimateTargets(){
  // TMB con Katch-McArdle (usa la masa libre de grasa de la Tanita): 370 + 21,6 × 82,57 ≈ 2154 kcal
  // (Mifflin-St Jeor con 114,2 kg da ≈ 2233; la TMB que imprime la báscula, 2526, sale de una fórmula propia no publicada)
  const tmb = 370 + 21.6*TANITA.mlg;
  const mant = Math.round(tmb*1.55/10)*10;                // gimnasio + grappling ≈ 3340
  const kcal = 2550;                                       // ≈ −790 kcal/día → ~0,7 kg/semana (~0,6 % del peso)
  const p = 190;                                           // ≈ 2,3 g/kg de masa libre de grasa
  const f = 80;
  const c = Math.round((kcal - p*4 - f*9)/4/5)*5;          // el resto, hidratos ≈ 270 g
  return {kcal, p, c, f, fib:30, mant, v:TARGETS_V};
}
function defaultState(){
  const est = estimateTargets();
  return {
    v:1,
    targets:{...est, source:"estimacion", updated:todayISO()},
    consumed:{kcal:0,p:0,c:0,f:0,fib:0},
    plan:Array.from({length:14},(_,i)=>({r:null,q:1})),
    extras:Array.from({length:7},()=>({desayuno:"bol_desayuno",otro:""})),
    batches:{pollo_arroz:4,pastel_carne:4,bolonesa:4,burritos:0,bocata_pollo:0,quesadillas_chipotle:0,bol_desayuno:0,helado_prot:0,fruta_dia:7},
    fruta:true,
    pantry:{},
    freezer:[],
    ov:{},          // overrides de recetas
    fov:{},         // overrides de alimentos
    checks:{},      // lista de compra
    sunday:{},      // tareas del domingo
    adj:{recipe:"pollo_arroz",q:1,g:null,ap:true},
    ovReset:[],
    tab:"hoy"
  };
}
/* Sanea el estado cargado: una copia vieja, editada a mano o con recetas que ya
   no existen no puede tumbar la app. Todo lo que no encaje vuelve a su valor por defecto. */
function saneaEstado(o){
  const d = defaultState();
  const esReceta = id => RECIPES.some(r=>r.id===id);
  const obj = (v,def) => (v && typeof v==="object" && !Array.isArray(v)) ? v : def;
  const S = Object.assign({}, d, obj(o,{}));

  S.plan = (Array.isArray(S.plan)? S.plan : d.plan).slice(0,14);
  while(S.plan.length<14) S.plan.push({r:null,q:1});
  S.plan = S.plan.map(p=>{ const x=obj(p,{}); const q=Number(x.q);
    return {r: esReceta(x.r)? x.r : null, q: (q>0&&isFinite(q))? q : 1}; });

  S.extras = (Array.isArray(S.extras)? S.extras : d.extras).slice(0,7);
  while(S.extras.length<7) S.extras.push({desayuno:"",otro:""});
  S.extras = S.extras.map(e=>{ const x=obj(e,{});
    return {desayuno: esReceta(x.desayuno)? x.desayuno : "", otro: typeof x.otro==="string"? x.otro : ""}; });

  S.freezer = (Array.isArray(S.freezer)? S.freezer : []).filter(f=>obj(f,null)&&esReceta(f.recipeId)).map(f=>({
    id: String(f.id || "f"+Date.now()+Math.random().toString(36).slice(2,6)),
    recipeId: f.recipeId,
    portions: Math.max(0, Number(f.portions)||0),
    left: Math.max(0, Number(f.left)||0),
    date: typeof f.date==="string"? f.date : todayISO(),
    where: f.where==="Nevera" ? "Nevera" : "Congelador",
    grams: Number(f.grams)>0 ? Number(f.grams) : null
  }));

  for(const k of ["targets","consumed","batches","pantry","ov","fov","checks","sunday","adj"]) S[k]=obj(S[k], d[k]);
  if(S.targets.source==="estimacion" && S.targets.v!==TARGETS_V){ const e=estimateTargets(); S.targets=Object.assign({}, e, {source:"estimacion", updated:todayISO()}); }
  for(const k of ["kcal","p","c","f","fib"]){
    S.targets[k] = Math.max(0, Number(S.targets[k])||0);
    S.consumed[k] = Math.max(0, Number(S.consumed[k])||0);
  }
  for(const k of Object.keys(S.batches)) if(!esReceta(k) || !(Number(S.batches[k])>=0)) delete S.batches[k];
  // ajustes de recetas: se descartan los que se hicieron sobre una versión anterior de la receta
  // (si no, los gramos viejos se aplicarían a ingredientes nuevos) y los valores imposibles
  const num = v => (v!==null && v!=="" && isFinite(Number(v))) ? Number(v) : NaN;
  S.ovReset = Array.isArray(S.ovReset)? S.ovReset.filter(x=>typeof x==="string") : [];
  for(const id of Object.keys(S.ov)){
    const b=RECIPES.find(r=>r.id===id), o=obj(S.ov[id],null);
    if(!b||!o){ delete S.ov[id]; continue; }
    if((Number(o.rev)||1)!==(b.rev||1)){ delete S.ov[id]; if(!S.ovReset.includes(id)) S.ovReset.push(id); continue; }
    if(o.servings!==undefined){ const v=Math.round(num(o.servings)); if(!(v>=1)) delete o.servings; else o.servings=v; }
    if(o.cookedWeight!==undefined && o.cookedWeight!==null){ const v=num(o.cookedWeight); if(!(v>0)){ delete o.cookedWeight; delete o.cwServings; } else o.cookedWeight=v; }
    if(o.cwServings!==undefined){ const v=Math.round(num(o.cwServings)); if(!(v>=1)) delete o.cwServings; else o.cwServings=v; }
    if(o.ing!==undefined){ o.ing=obj(o.ing,{}); for(const k of Object.keys(o.ing)){ const v=num(o.ing[k]); if(!(v>=0)) delete o.ing[k]; else o.ing[k]=v; } }
  }
  for(const id of Object.keys(S.fov)){
    const o=obj(S.fov[id],null); if(!o||!FOODS[id]){ delete S.fov[id]; continue; }
    for(const k of Object.keys(o)){ if(!["kcal","p","c","f","fib","price"].includes(k)){ delete o[k]; continue; } const v=num(o[k]); if(!(v>=0)) delete o[k]; else o[k]=v; }
    if(!Object.keys(o).length) delete S.fov[id];
  }
  const isoOK = s => typeof s==="string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s+"T12:00:00"));
  S.freezer.forEach(f=>{ if(!isoOK(f.date)) f.date=todayISO(); if(f.left>f.portions) f.left=f.portions; });
  for(const k of Object.keys(S.batches)) S.batches[k]=Math.round(Number(S.batches[k]));
  S.fruta = S.fruta!==false;
  if(S.batches.fruta_dia===undefined) S.batches.fruta_dia = 7;
  if(!esReceta(S.adj.recipe)) S.adj.recipe = d.adj.recipe;
  S.adj.ap = S.adj.ap!==false;
  if(!(Number(S.adj.q)>0)) S.adj.q = 1;
  if(!(Number(S.adj.g)>0)) S.adj.g = null;
  if(typeof S.tab!=="string") S.tab = "hoy";
  return S;
}
let S;
function load(){
  try{
    let raw = localStorage.getItem(STORE_KEY);
    if(!raw){ raw = localStorage.getItem(OLD_KEY); }   // datos de la versión anterior del archivo
    if(!raw) return defaultState();
    return saneaEstado(JSON.parse(raw));
  }catch(e){ return defaultState(); }
}
let saveTimer=null;
function saveNow(){ clearTimeout(saveTimer); try{ localStorage.setItem(STORE_KEY, JSON.stringify(S)); }catch(e){ storageOK=false; } }
window.addEventListener("pagehide", saveNow);
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="hidden") saveNow(); });
/** ajustes de una receta, marcados con la versión de la receta sobre la que se hicieron */
function ovFor(id){ const b=RECIPES.find(r=>r.id===id); S.ov[id]=S.ov[id]||{}; S.ov[id].rev=(b&&b.rev)||1; return S.ov[id]; }
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
  r.cwServings = ov.cwServings || base.servings;
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
function batchMacros(r, part){   // part: undefined = todo · "base" = lo que va en el táper · "aparte" = lo que se añade al servir
  const scale = r.servings / (RECIPES.find(x=>x.id===r.id).servings);
  const m = zero();
  r.ing.forEach(it=>{ if(part==="base" && it.aparte) return; if(part==="aparte" && !it.aparte) return; addTo(m, ingMacros(it), scale); });
  return m;
}
function hasAparte(r){ return r.ing.some(it=>it.aparte && it.g>0); }
function servingPart(r, part){
  const m = batchMacros(r, part), out = zero();
  for(const k in m) out[k] = m[k]/Math.max(1,r.servings);
  return out;
}
function servingMacros(r){
  const m = batchMacros(r), out = zero();
  for(const k in m) out[k] = m[k]/Math.max(1,r.servings);
  return out;
}
function per100(r){
  const cw = scaledCookedWeight(r);
  if(!cw) return null;
  const m = batchMacros(r, "base"), out = zero();   // el peso cocinado es solo lo que va en el táper
  for(const k in m) out[k] = m[k]*100/cw;
  return out;
}
function scaledCookedWeight(r){
  const base = RECIPES.find(x=>x.id===r.id);
  if(!r.cookedWeight) return base.useRaw ? rawWeight(r) : null;
  if(r.cookedWeightUser) return r.cookedWeight * (r.servings/(r.cwServings||base.servings)); // lo pesó para N raciones: escala si cambian
  return r.cookedWeight * (r.servings/base.servings); // estimación: escala con las raciones
}
function rawWeight(r){
  const scale = r.servings / (RECIPES.find(x=>x.id===r.id).servings);
  let g=0; r.ing.forEach(it=>{ if(!food(it.f).noWeight && !it.aparte) g+=it.g*scale; });
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
  if(!VIEWS.some(v=>v[0]===S.tab)) S.tab = "hoy";
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
    <div><b>${d1(m.p)}</b><span>prot</span></div>
    <div><b>${d1(m.c)}</b><span>hc</span></div>
    <div><b>${d1(m.f)}</b><span>grasa</span></div>
    <div><b>${d1(m.fib)}</b><span>fibra</span></div>
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
      <td class="num"><input type="number" data-t="${k}" aria-label="Objetivo de ${label}" value="${S.targets[k]??0}" step="1" min="0" style="max-width:110px;text-align:right"></td>
      <td class="num"><input type="number" data-c="${k}" aria-label="${label} consumida hoy" value="${S.consumed[k]??0}" step="1" min="0" style="max-width:110px;text-align:right"></td>
      <td class="num"><input type="number" data-r="${k}" aria-label="${label} que queda hoy" value="${r1(rem[k])}" step="1" style="max-width:110px;text-align:right"></td>
    </tr>`).join("");
  $$("#targetRows input[data-t]").forEach(i=>i.onchange=()=>{S.targets[i.dataset.t]=Number(i.value)||0;S.targets.source="macrofactor";S.targets.updated=todayISO();save();later(()=>{renderHoy();renderAdj();});});
  $$("#targetRows input[data-c]").forEach(i=>i.onchange=()=>{S.consumed[i.dataset.c]=Number(i.value)||0;save();later(()=>{renderHoy();renderAdj();});});
  $$("#targetRows input[data-r]").forEach(i=>i.onchange=()=>{
    const k=i.dataset.r; S.consumed[k]=Math.max(0,(S.targets[k]||0)-(Number(i.value)||0)); save(); later(()=>{renderHoy(); renderAdj();});});

  const est = estimateTargets();
  const isEst = S.targets.source==="estimacion";
  $("#targetSourceNote").className = isEst? "note warn":"note ok";
  $("#targetSourceNote").innerHTML = isEst
    ? `<b>Objetivos calculados con tu Tanita del ${fmtDate(TANITA.fecha)}</b> (${String(TANITA.peso).replace(".",",")} kg · ${String(TANITA.grasa).replace(".",",")} % de grasa · ${String(TANITA.mlg).replace(".",",")} kg de masa libre de grasa). Metabolismo basal con Katch-McArdle, que usa tu masa libre de grasa: ≈ 2.150 kcal. Con gimnasio + grappling (× 1,55), mantenimiento ≈ <b>${est.mant} kcal</b>. Objetivo <b>${est.kcal} kcal</b>: unas ${est.mant-est.kcal} kcal de déficit, para perder ~0,7 kg a la semana. Proteína ${est.p} g ≈ 2,3 g por kg de masa libre de grasa. Sigue siendo una estimación (± 10 %): <b>a las 2-3 semanas, pon aquí lo que te diga MacroFactor</b> con tu tendencia de peso. Si bajas más de 1 kg a la semana o rindes peor en el tatami, sube 150-250 kcal.`
    : `<b>Objetivos tuyos de MacroFactor</b>, actualizados el ${fmtDate(S.targets.updated)}. Si MacroFactor te los cambia el lunes, cámbialos aquí.`;
  renderToday();
  renderAdj();
}
/** Lo que toca hoy según el plan de la semana (lunes = 0) */
function todayIdx(){ return (new Date().getDay()+6)%7; }
function renderToday(){
  const el=$("#todayPlan"); if(!el) return;
  const d=todayIdx(), ex=S.extras[d]||{};
  const items=[];
  if(ex.desayuno) items.push({lbl:"Desayuno",id:ex.desayuno,q:1});
  [0,1].forEach(s=>{const p=S.plan[d*2+s]; if(p&&p.r) items.push({lbl:s===0?"Comida":"Cena",id:p.r,q:p.q});});
  if(S.fruta && items.length) items.push({lbl:"Fruta",id:"fruta_dia",q:1});
  if(!items.length){ el.innerHTML=`<p class="small">No tienes nada planificado para hoy (${DAYS[d].toLowerCase()}). En «Semana» puedes rellenarla con un toque.</p>`; return; }
  const tot=zero(); items.forEach(it=>{const r=recipe(it.id); if(r) addTo(tot, servingMacros(r), it.q);});
  el.innerHTML=`<div class="row" style="justify-content:space-between"><b>${DAYS[d]}</b><span class="badge">${r0(tot.kcal)} kcal · ${d1(tot.p)} g prot · ${d1(tot.f)} g grasa</span></div>
    <ul class="checks" style="margin-top:.4rem">${items.map(it=>{const r=recipe(it.id); if(!r) return "";
      const qtxt = r.servingsLabel? `${it.q} ${it.q===1? r.servingsLabel.replace(/s$/,""):r.servingsLabel}` : (it.q===1?"1 ración":`${String(it.q).replace(".",",")} ración`);
      return `<li><span style="flex:1"><b>${it.lbl}:</b> ${esc(r.n)} <small>(${qtxt})</small></span>
        <button class="btn xs" data-today="${it.id}" data-tq="${it.q}">Ver</button></li>`;}).join("")}</ul>`;
  $$("[data-today]").forEach(b=>b.onclick=()=>{S.adj.recipe=b.dataset.today; const q=Number(b.dataset.tq); S.adj.q=q>0?q:1; S.adj.g=null; save(); renderAdj(); $("#adjRecipe").scrollIntoView({behavior:"smooth",block:"center"});});
}
$("#btnResetConsumo").onclick=()=>{S.consumed=zero();save();renderHoy();};
$("#btnEstimar").onclick=()=>{
  const e=estimateTargets();
  if(confirm(`Poner la estimación de partida?\n\n${e.kcal} kcal · ${e.p} g proteína · ${e.c} g hidratos · ${e.f} g grasa · ${e.fib} g fibra\n\nSon una estimación, no tus objetivos reales.`)){
    S.targets=Object.assign({},e,{source:"estimacion",updated:todayISO()});save();renderHoy();}
};

const PORTIONS=[[0.25,"¼"],[0.5,"½"],[0.75,"¾"],[1,"1"],[1.5,"1½"],[2,"2"],[3,"3"]];
const UNIT_Q=[[1,"1"],[2,"2"],[3,"3"]];
function renderAdj(){
  const sel=$("#adjRecipe");
  if(sel.options.length===0){
    sel.innerHTML = RECIPES.map(r=>`<option value="${r.id}">${esc(r.n)}</option>`).join("");
    sel.value=S.adj.recipe;
    sel.onchange=()=>{S.adj.recipe=sel.value;S.adj.g=null;save();renderAdj();};
  }
  if(sel.value!==S.adj.recipe) sel.value=S.adj.recipe;
  const gi=$("#adjGrams"); if(document.activeElement!==gi) gi.value = S.adj.g||"";
  $("#adjChips").innerHTML = PORTIONS.map(([v,l])=>
    `<button class="chip" data-q="${v}" aria-pressed="${!S.adj.g && S.adj.q===v}">${l}</button>`).join("");
  $$("#adjChips .chip").forEach(b=>b.onclick=()=>{S.adj.q=Number(b.dataset.q);S.adj.g=null;$("#adjGrams").value="";save();renderAdj();});

  const r=recipe(S.adj.recipe); if(!r){$("#adjOut").innerHTML="";return;}
  const ap=hasAparte(r);
  const sm= ap ? servingPart(r,"base") : servingMacros(r), cw=scaledCookedWeight(r), p1=per100(r);
  const apM = ap ? servingPart(r,"aparte") : zero();
  const apTxt = ap ? r.ing.filter(it=>it.aparte).map(it=>{const F=food(it.f);const g=it.g/RECIPES.find(x=>x.id===r.id).servings;return F.unitG? `${d1(g/F.unitG)} ${(F.unitName||"ud")+(g/F.unitG>1?"s":"")}`:`${r0(g)} g de ${F.n.toLowerCase()}`;}).join(" + ") : "";
  let m, desc, gramsShown;
  if(S.adj.g && p1){
    m=zero(); for(const k in m) m[k]=p1[k]*S.adj.g/100;
    desc=`${S.adj.g} g del táper`; gramsShown=S.adj.g;
  }else if(S.adj.g && !p1){
    m=null; desc="";
  }else{
    m=zero(); for(const k in m) m[k]=sm[k]*S.adj.q;
    const lbl=PORTIONS.find(x=>x[0]===S.adj.q); desc=`${lbl?lbl[1]:S.adj.q} ración`;
    gramsShown = cw? Math.round(cw/r.servings*S.adj.q) : null;
  }
  if(m && ap && S.adj.ap){ addTo(m, apM, S.adj.g? 1 : S.adj.q); desc += ` + al servir: ${apTxt}${!S.adj.g&&S.adj.q!==1?` (×${S.adj.q})`:""}`; }
  if(!m){ $("#adjOut").innerHTML=`<div class="note warn">Esta receta no tiene peso cocinado definido, así que no puedo convertir gramos. Usa las porciones, o pesa el resultado y apúntalo en la ficha de la receta.</div>`; return; }

  const rem=remaining(), after=zero(); for(const k in after) after[k]=rem[k]-m[k];
  const rows = MACROS.map(([k,label,u])=>{
    const pct = S.targets[k]? Math.min(100, Math.max(0,(S.consumed[k]+m[k])/S.targets[k]*100)) : 0;
    const over = (S.consumed[k]+m[k]) > (S.targets[k]||Infinity);
    return `<div style="margin:.45rem 0">
      <div class="kv" style="border:none;padding:0"><span>${label}</span>
        <span><b>${d1(m[k])}</b> ${u} · quedarían <b style="color:${after[k]<0?'var(--bad)':'inherit'}">${d1(after[k])}</b> ${u}</span></div>
      <div class="bar"><i class="${over?'over':''}" style="width:${pct}%"></i></div>
    </div>`;
  }).join("");

  // aviso honesto sobre la proteína al reducir porción
  const protPct = rem.p>0 ? m.p/rem.p*100 : 0;
  let warn="";
  if(S.adj.q<1 || (S.adj.g && cw && S.adj.g < cw/r.servings)){
    warn = `<div class="note warn"><b>Ojo con la proteína.</b> Media ración no deja media necesidad: esta porción aporta <b>${d1(m.p)} g</b> y te seguirían faltando <b>${d1(after.p)} g</b> en lo que queda del día. Si vas a reducir el táper, mira de dónde va a salir esa proteína (queso batido, un bol, un bocata) antes de reducirlo, no después.</div>`;
  }
  if(after.p < 0) warn += `<div class="note ok">Con esta porción ya cubres la proteína del día.</div>`;

  const apCtl = ap ? `<label class="row tight small" style="margin:.2rem 0 .4rem"><input type="checkbox" id="adjAp" ${S.adj.ap?"checked":""}> Sumar lo que se añade al servir (${esc(apTxt)}) — en MacroFactor regístralo aparte</label>` : "";
  $("#adjOut").innerHTML = `${apCtl}
    <div class="note"><b>${esc(r.n)}</b> — ${desc}${gramsShown&&!S.adj.g?` · táper ≈ <b>${gramsShown} g</b>`:""}.
    ${cw? `<br><small>Basado en un peso cocinado de ${r0(cw)} g para ${r.servings} raciones ${r.cookedWeightUser?'(pesado por ti)':'(estimado — pésalo y afínalo)'}.</small>`:""}</div>
    ${macroBox(m,"lo que aporta esta porción")}
    <div class="hr"></div>
    <h4>Cómo queda el día</h4>
    ${rows}
    ${warn}
    <p class="small">Esto es información para que decidas tú. No es una orden de compensar nada, y desde luego no se ajusta por lo que marque la báscula un día suelto: el propio algoritmo de MacroFactor tampoco reacciona a 1-5 días de peso raro.</p>`;
  const apc=$("#adjAp"); if(apc) apc.onchange=()=>{S.adj.ap=apc.checked; save(); renderAdj();};
}
$("#adjGrams").oninput=()=>{const v=Number($("#adjGrams").value); S.adj.g = v>0? v:null; save(); renderAdj();};

/* =========================================================================
   7. VISTA SEMANA
   ========================================================================= */
/** ¿el día cuadra con los objetivos? kcal ±, proteína mínima, grasa máxima */
function dayCheck(s){
  const T=S.targets, out=[];
  if(T.kcal){ const dk=s.kcal-T.kcal; out.push([Math.abs(dk)<=150?"ok":Math.abs(dk)<=300?"meh":"bad", `${dk>=0?"+":""}${r0(dk)} kcal`]); }
  if(T.p){ const dp=s.p-T.p; out.push([dp>=-5?"ok":dp>=-20?"meh":"bad", dp>=-5?"proteína ✓":`faltan ${r0(-dp)} g prot`]); }
  if(T.f){ const df=s.f-T.f; out.push([df<=10?"ok":df<=25?"meh":"bad", df<=10?"grasa ✓":`+${r0(df)} g grasa`]); }
  return `<div class="daytot">${out.map(([c,t])=>`<span class="${c}">${t}</span>`).join("")}</div>`;
}
/* ---------- Planificador: combinaciones de día que cuadran ---------- */
function dayCombos(){
  const T=S.targets, R=RECIPES;
  const des=R.filter(r=>r.tipo==="desayuno"), pri=R.filter(r=>r.tipo==="principal"), ant=R.filter(r=>r.tipo==="antojo");
  const m=id=>servingMacros(recipe(id));
  const fr = (S.fruta && recipe("fruta_dia")) ? servingMacros(recipe("fruta_dia")) : null;
  const cenas=[...pri.map(r=>({id:r.id,q:1}))];
  ant.forEach(r=>UNIT_Q.forEach(([q])=>cenas.push({id:r.id,q})));
  const out=[];
  des.forEach(d=>pri.forEach(c=>[1,0.75].forEach(qc=>cenas.forEach(ce=>{
    const t=zero(); addTo(t,m(d.id)); addTo(t,m(c.id),qc); addTo(t,m(ce.id),ce.q); if(fr) addTo(t,fr);
    const ok = (!T.kcal || (t.kcal>=T.kcal-250 && t.kcal<=T.kcal+150)) && (!T.p || t.p>=T.p-5) && (!T.f || t.f<=T.f+15);
    if(!ok) return;
    const score = (T.kcal?Math.abs(t.kcal-T.kcal)/100:0) + (T.p?Math.max(0,T.p-t.p)/5:0) + (T.f?Math.max(0,t.f-T.f)/5:0) + (qc<1?2:0);
    out.push({d:d.id, c:c.id, qc, ce:ce.id, qe:ce.q, t, score});
  }))));
  // quita duplicados (pollo + patatas = patatas + pollo)
  const seen=new Set();
  return out.sort((a,b)=>a.score-b.score).filter(x=>{const k=x.d+"|"+[x.c+"×"+x.qc, x.ce+"×"+x.qe].sort().join("+"); if(seen.has(k)) return false; seen.add(k); return true;});
}
function comboTxt(x){
  const part=(id,q)=>{const r=RECIPES.find(z=>z.id===id); const nm=r.short||r.n;
    if(r.servingsLabel) return `${q} ${q===1? r.servingsLabel.replace(/s$/,"") : r.servingsLabel}`;
    return q===1? nm : `${nm} (${q===0.75?"¾":String(q).replace(".",",")})`;};
  return esc(`${part(x.d,1)} + ${part(x.c,x.qc)} + ${part(x.ce,x.qe)}`);
}
function proponerSemana(){
  const combos=dayCombos(); if(!combos.length){ toast("Con estos objetivos no sale ninguna combinación"); return null; }
  const stock={}; S.freezer.forEach(f=>{ stock[f.recipeId]=(stock[f.recipeId]||0)+f.left; });
  const avail={}; RECIPES.forEach(r=>{ avail[r.id]= (r.tipo==="desayuno"||r.tipo==="fruta") ? Infinity : Math.max(S.batches[r.id]||0, stock[r.id]||0); });
  const used={}, plan=[]; let prev=null;
  for(let d=0; d<7; d++){
    let best=null, bs=Infinity;
    combos.forEach(x=>{
      const needC={}; needC[x.c]=(needC[x.c]||0)+x.qc; needC[x.ce]=(needC[x.ce]||0)+x.qe;
      if(Object.entries(needC).some(([id,q])=>avail[id]<q)) return;
      let s=x.score + ((used[x.c]||0)+(used[x.ce]||0))*0.8 + (used[x.d]||0)*0.3;
      if(prev && (prev.c===x.c||prev.ce===x.ce)) s+=1.5;
      if(x.c===x.ce) s+=2;
      if(s<bs){ bs=s; best=x; }
    });
    plan.push(best);
    if(best){ avail[best.c]-=best.qc; avail[best.ce]-=best.qe; used[best.c]=(used[best.c]||0)+1; used[best.ce]=(used[best.ce]||0)+1; used[best.d]=(used[best.d]||0)+1; prev=best; }
  }
  return plan;
}
function renderPlanner(){
  const el=$("#weekPlanner"); if(!el) return;
  const combos=dayCombos();
  const T=S.targets;
  el.innerHTML=`<label class="row tight small" style="margin:0 0 .4rem"><input type="checkbox" id="planFruta" ${S.fruta?"checked":""}> Sumar 1 fruta al día (pera, ~103 kcal y ~5,6 g de fibra)</label><p class="small">Combinaciones de <b>desayuno + comida + cena${S.fruta?" + fruta":""}</b> con tus recetas que dan ${T.kcal?`${r0(T.kcal-250)}-${r0(T.kcal+150)} kcal`:""}, al menos ${r0((T.p||0)-5)} g de proteína y como mucho ${r0((T.f||0)+15)} g de grasa (según tus objetivos de «Hoy»).</p>
    ${combos.length?`<div class="scrollx"><table class="combos"><thead><tr><th>Día</th><th class="num">kcal</th><th class="num">prot</th><th class="num">grasa</th></tr></thead><tbody>
      ${combos.slice(0,12).map(x=>`<tr><td>${comboTxt(x)}</td><td class="num">${r0(x.t.kcal)}</td><td class="num">${r0(x.t.p)}</td><td class="num">${r0(x.t.f)}</td></tr>`).join("")}
    </tbody></table></div>`:`<div class="note warn">Con estos objetivos no sale ninguna combinación de un día. Revisa los objetivos o las raciones.</div>`}
    <div class="row" style="margin-top:.5rem"><button class="btn primary sm" id="btnPlanWeek">Rellenar la semana con esto</button></div>
    <p class="small">Reparte los 7 días con estas combinaciones, variando y sin pasarse de las raciones que vas a cocinar (pestaña «Compra») o que tienes en el congelador. Si una receta está a 0, no la usa. Sustituye lo que haya en comidas, cenas y desayunos.</p>`;
  $("#planFruta").onchange=e=>{S.fruta=e.target.checked; S.batches.fruta_dia=S.fruta?7:0; save(); renderSemana(); renderToday(); if(typeof renderCompra==="function") renderCompra();};
  $("#btnPlanWeek").onclick=()=>{
    const hasPlan=S.plan.some(p=>p.r);
    if(hasPlan && !confirm("Esto sustituye las comidas, cenas y desayunos que tengas en la semana. ¿Seguir?")) return;
    const plan=proponerSemana(); if(!plan) return;
    let vacios=0;
    plan.forEach((x,d)=>{
      if(!x){ S.plan[d*2]={r:null,q:1}; S.plan[d*2+1]={r:null,q:1}; vacios++; return; }
      S.plan[d*2]={r:x.c,q:x.qc}; S.plan[d*2+1]={r:x.ce,q:x.qe}; S.extras[d].desayuno=x.d;
    });
    save(); renderSemana(); renderToday();
    toast(vacios? `Semana rellenada; ${vacios} día(s) sin combinación con las raciones disponibles` : "Semana rellenada");
  };
}
function renderSemana(){
  const opts = id => `<option value="">— libre —</option>` + RECIPES.filter(r=>r.tipo!=="desayuno"&&r.tipo!=="fruta")
    .map(r=>`<option value="${r.id}" ${id===r.id?"selected":""}>${esc(r.n)}</option>`).join("");
  let html="";
  for(let d=0; d<7; d++){
    const sum=zero();
    [0,1].forEach(s=>{const p=S.plan[d*2+s]; if(p.r){const r=recipe(p.r); if(r) addTo(sum, servingMacros(r), p.q);}});
    const ex=S.extras[d]||{};
    if(ex.desayuno){const r=recipe(ex.desayuno); if(r) addTo(sum, servingMacros(r), 1);}
    if(S.fruta && sum.kcal>0){const r=recipe("fruta_dia"); if(r) addTo(sum, servingMacros(r), 1);}
    html+=`<div class="day"><h4><span>${DAYS[d]}</span><span class="badge">${r0(sum.kcal)} kcal · ${d1(sum.p)} g prot · ${d1(sum.f)} g grasa</span></h4>
      ${sum.kcal>0?dayCheck(sum):""}
      <div class="grid g2">
      ${[0,1].map(s=>{const i=d*2+s;const p=S.plan[i];
        return `<div class="slot ${p.r?"":"libre"}">
          <div class="small" style="font-weight:700;margin-bottom:.25rem">${s===0?"Comida":"Cena"}${p.r?"":" · LIBRE"}</div>
          <select data-slot="${i}" aria-label="${DAYS[d]}, ${s===0?"comida":"cena"}">${opts(p.r)}</select>
          ${p.r?`<div class="row tight" style="margin-top:.35rem">${(RECIPES.find(x=>x.id===p.r).tipo==="antojo"?UNIT_Q:PORTIONS.slice(0,5)).map(([v,l])=>
            `<button class="chip" style="min-height:34px;font-size:.8rem" data-slotq="${i}" data-q="${v}" aria-pressed="${p.q===v}">${l}</button>`).join("")}</div>`:""}
        </div>`;}).join("")}
      </div></div>`;
  }
  $("#weekDays").innerHTML=html;
  renderPlanner();
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
  const falta = Object.entries(need).filter(([id,q])=> (stock[id]||0) + (S.batches[id]||0) < q);
  $("#weekCount").innerHTML = `
    <div class="row">
      <span class="badge">${used} huecos con táper</span>
      <span class="badge">${d1(rac)} raciones planificadas</span>
      <span class="badge" style="${libres===2?'':'color:var(--warn)'}">${libres} libres ${libres===2?'✓':'(el plan base son 2)'}</span>
    </div>
    ${rac>12?`<div class="note warn">Has planificado ${d1(rac)} raciones y el lote base son 12. O cocinas más (pestaña Compra) o tiras de congelador.</div>`:""}
    ${falta.length?`<div class="note warn"><b>No te llega con lo que tienes y lo que vas a cocinar:</b> ${falta.map(([id,q])=>`${esc(recipe(id).short||recipe(id).n)} (necesitas ${d1(q)}; congelador ${d1(stock[id]||0)} + a cocinar ${d1(S.batches[id]||0)})`).join(" · ")}. Sube las raciones en «Compra» o usa su botón «Calcular raciones desde la semana».</div>`:""}`;

  // extras
  const desOpts = id=>`<option value="">—</option>`+RECIPES.filter(r=>r.tipo==="desayuno")
    .map(r=>`<option value="${r.id}" ${id===r.id?"selected":""}>${esc(r.n)}</option>`).join("");
  $("#weekExtras").innerHTML = `<div class="scrollx"><table>
    <thead><tr><th>Día</th><th>Desayuno</th><th>Almuerzo / merienda / postre</th></tr></thead><tbody>
    ${DAYS.map((d,i)=>`<tr><td>${d}</td>
      <td><select data-ex-d="${i}" aria-label="Desayuno del ${d.toLowerCase()}">${desOpts((S.extras[i]||{}).desayuno)}</select></td>
      <td><input data-ex-o="${i}" aria-label="Almuerzo, merienda o postre del ${d.toLowerCase()}" value="${esc((S.extras[i]||{}).otro||"")}" placeholder="bocata, burrito, fruta…"></td></tr>`).join("")}
    </tbody></table></div>
    <div class="note">Si un día almuerzas un bocata que no estaba previsto, no pasa nada: apúntalo aquí, regístralo en MacroFactor y por la tarde ajusta la porción del táper en la pestaña «Hoy». Ese es todo el sistema.</div>`;
  $$("#weekExtras select[data-ex-d]").forEach(s=>s.onchange=()=>{S.extras[+s.dataset.exD].desayuno=s.value;save();later(renderSemana);});
  $$("#weekExtras input[data-ex-o]").forEach(s=>s.onchange=()=>{S.extras[+s.dataset.exO].otro=s.value;save();});
}
