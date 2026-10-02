"use strict";
/* =========================================================================
   9. VISTA COMPRA
   ========================================================================= */
const CAT_ORDER=["Carnicería","Huevos y lácteos","Frutería","Congelados","Panadería","Despensa","Suplementos"];
function renderCompra(){
  $("#batchPicker").innerHTML = `<div class="scrollx"><table class="ingt">
    <thead><tr><th>Receta</th><th class="num">Raciones<br><small>a cocinar</small></th><th class="num">kcal<br><small>/rac.</small></th><th class="num">prot<br><small>/rac.</small></th></tr></thead><tbody>
    ${RECIPES.map(b=>{const r=recipe(b.id),sm=servingMacros(r);
      return `<tr><td>${esc(b.n)}<br><small>${b.tipo==="antojo"?"antojo — no descuenta comidas principales":b.tipo==="desayuno"?"desayuno/postre":"principal"}</small></td>
      <td class="num"><input type="number" data-bt="${b.id}" aria-label="Raciones a cocinar de ${esc(b.n)}" value="${S.batches[b.id]??0}" min="0" step="1" style="max-width:90px;text-align:right"></td>
      <td class="num">${r0(sm.kcal)}</td><td class="num">${d1(sm.p)}</td></tr>`;}).join("")}
    </tbody></table></div>
    <div class="note small">Los <b>burritos</b> y los <b>bocatas</b> se cocinan en la cantidad que quieras y duran semanas en el congelador. Ponlos a 0 las semanas que no toque.</div>`;
  $$("input[data-bt]").forEach(i=>i.onchange=()=>{
    S.batches[i.dataset.bt]=Math.max(0,Math.round(Number(i.value)||0)); save(); later(()=>{renderCompra(); renderDomingo();});
  });

  // agregación
  const need={};
  for(const id in S.batches){
    const n=S.batches[id]; if(!n) continue;
    const base=RECIPES.find(x=>x.id===id); if(!base) continue;
    const r=recipe(id); const scale=n/base.servings;
    r.ing.forEach(it=>{
      const F=food(it.f); if(F.noWeight) { need[it.f]=need[it.f]||{g:0,noWeight:true}; return; }
      need[it.f]=need[it.f]||{g:0};
      need[it.f].g += it.g*scale;
    });
  }
  const cats={}; let cost=0, anyUnverifiedPrice=false;
  Object.keys(need).sort().forEach(fid=>{
    const F=food(fid); const have=Number(S.pantry[fid]||0);
    const gross=need[fid].g; const buy=Math.max(0, gross-have);
    if(F.noWeight){ (cats[F.cat]=cats[F.cat]||[]).push({fid,F,gross:null,buy:null,have}); return; }
    if(buy<=0 && gross>0){ (cats[F.cat]=cats[F.cat]||[]).push({fid,F,gross,buy:0,have}); return; }
    let purchase=buy, purchaseNote="";
    if(F.buyFactor){ purchase=buy*F.buyFactor; purchaseNote=`≈ ${d1(purchase/1000)} kg de ${F.buyUnit}`; }
    const c = F.price? (purchase/1000)*F.price : 0;
    if(F.price){ cost+=c; if(F.priceQ) anyUnverifiedPrice=true; } else anyUnverifiedPrice=true;
    (cats[F.cat]=cats[F.cat]||[]).push({fid,F,gross,buy,have,purchase,purchaseNote,c});
  });

  let html="";
  CAT_ORDER.forEach(cat=>{
    const items=cats[cat]; if(!items||!items.length) return;
    html+=`<h3 style="margin-top:.8rem">${cat}</h3><ul class="checks">`;
    items.forEach(it=>{
      const done=!!S.checks[it.fid];
      const F=it.F;
      let qty;
      if(F.noWeight) qty="lo que tengas";
      else if(it.buy<=0) qty=`<span class="tag v">YA LO TIENES</span> (necesitas ${r0(it.gross)} g, tienes ${r0(it.have)} g)`;
      else{
        qty=`<b>${it.buy>=1000? d1(it.buy/1000)+" kg" : r0(it.buy)+" g"}</b>`;
        if(F.unitG) qty+= ` · ≈ ${Math.ceil(it.buy/F.unitG)} ${F.unitName||"ud"}`;
        if(it.purchaseNote) qty+= ` · comprar ${it.purchaseNote}`;
        if(it.have>0) qty+= ` <small>(descontados ${r0(it.have)} g que ya tienes)</small>`;
      }
      html+=`<li class="${done?"done":""}">
        <input type="checkbox" id="ck_${it.fid}" data-ck="${it.fid}" ${done?"checked":""}>
        <label for="ck_${it.fid}">${esc(F.n)} ${qTag(F.q)}<br><small>${qty}${it.c?` · ~${eur(it.c)} €`:""}</small></label></li>`;
    });
    html+="</ul>";
  });
  if(!html) html=`<p class="small">No has puesto ninguna ración a cocinar. Arriba, en «Qué voy a cocinar este domingo».</p>`;
  $("#shopList").innerHTML=html;
  $$("input[data-ck]").forEach(c=>c.onchange=()=>{S.checks[c.dataset.ck]=c.checked;save();renderCompra();});
  $("#shopCost").innerHTML = cost? `≈ ${eur(cost)} € ${anyUnverifiedPrice?'<span class="tag e">precios sin verificar</span>':''}` : "";

  // despensa
  const usedFoods=Object.keys(need).filter(f=>!food(f).noWeight).sort((a,b)=>food(a).n.localeCompare(food(b).n));
  $("#pantryList").innerHTML = usedFoods.length? `<div class="grid g3">${usedFoods.map(fid=>{
    const F=food(fid);
    return `<label class="fld"><span>${esc(F.n)}${F.unitG?` (g; 1 ${F.unitName||"ud"} = ${F.unitG} g)`:" (g)"}</span>
      <input type="number" data-pt="${fid}" value="${S.pantry[fid]||""}" min="0" step="10" placeholder="0"></label>`;}).join("")}</div>`
    : `<p class="small">Aparecerá aquí en cuanto elijas qué cocinar.</p>`;
  $$("input[data-pt]").forEach(i=>i.onchange=()=>{
    const v=Number(i.value)||0; if(v>0) S.pantry[i.dataset.pt]=v; else delete S.pantry[i.dataset.pt];
    save(); later(renderCompra);
  });
}
$("#btnClearChecks").onclick=()=>{S.checks={};save();renderCompra();};
$("#btnPrint2").onclick=()=>window.print();

/* =========================================================================
   10. VISTA DOMINGO
   ========================================================================= */
function sundayTasks(){
  const b=S.batches, T=[];
  const on=id=>(b[id]||0)>0;
  T.push({t:"00:00 · Antes de empezar",d:"No saques nada del congelador todavía. Vacía el fregadero, saca 4 táperes grandes por cada receta y la báscula. Enciende el horno a 190 °C."});
  if(on("pollo_arroz")) T.push({t:"00:05 · Pollo al horno",d:"Salpimienta y unta el pollo entero. Al horno, 190 °C, 75-85 min. A partir de aquí el horno trabaja solo."});
  if(on("pastel_carne")) T.push({t:"00:15 · Patata a la air fryer",d:"Dados de patata con aceite y sal, air fryer 190 °C 18-22 min agitando a mitad. Mientras, pica cebolla y pimiento de las dos recetas de carne a la vez: es el mismo corte."});
  if(on("pastel_carne")||on("bolonesa")) T.push({t:"00:25 · Las dos carnes, en dos sartenes",d:"Sartén 1: sofrito + carne del pastel. Sartén 2: sofrito + carne + tomate de la boloñesa (esta necesita 15-20 min de fuego suave, déjala reduciendo)."});
  if(on("pollo_arroz")) T.push({t:"00:35 · Arroz",d:"300 g de arroz con 600 ml de agua, 16-18 min. Déjalo firme. En cuanto esté, extiéndelo en una bandeja para que enfríe rápido: el arroz es el ingrediente con reloj."});
  if(on("bolonesa")) T.push({t:"00:45 · Pasta",d:"Cuécela 2 min menos que el paquete, escurre y pasa por agua fría 10 s."});
  if(on("pastel_carne")) T.push({t:"00:50 · Montar el pastel",d:"Carne + patata en la fuente, huevo batido por encima. Cuando salga el pollo, entra el pastel: 180 °C, 20-25 min."});
  if(on("burritos")) T.push({t:"01:00 · Burritos",d:"Saltea pollo y lomo por separado y las verduras. Monta los dos rellenos, pésalos y divide. NO montes burritos: solo relleno."});
  if(on("bocata_pollo")) T.push({t:"01:15 · Bocatas",d:"Plancha el pollo especiado, monta los bocatas SIN salsa, envuelve en papel de horno + aluminio. La salsa, en su bote."});
  if(on("pollo_arroz")) T.push({t:"01:30 · Deshuesar y montar",d:"Deshuesa el pollo (pesa la carne limpia y apúntala). Mezcla con arroz y verduras. PESA EL TOTAL y escríbelo en la ficha de la receta."});
  T.push({t:"01:45 · Repartir y pesar",d:"Un táper por ración. Pesa cada uno y apunta el peso en la etiqueta: es lo que te deja registrar por gramos sin inventar nada."});
  T.push({t:"01:50 · Etiquetar",d:"Cinta de papel + rotulador en cada tapa: NOMBRE · FECHA DE HOY · GRAMOS. AESAN recomienda anotar la fecha y consumir primero lo más antiguo."});
  T.push({t:"01:55 · Enfriar",d:"Sin tapar del todo, sobre la encimera, y al frío antes de 2 horas. El arroz, antes de 1 hora (FSA). Si hace calor, táper dentro de una bandeja con agua fría."});
  T.push({t:"02:05 · Al congelador",d:"Todo lo que no vayas a comer en 3 días, al congelador. De la receta de pollo con arroz, deja como mucho 1 ración en nevera (el arroz aguanta 1 día)."});
  T.push({t:"02:10 · Dar de alta el stock",d:"Pestaña «Congelador» de esta página: añade lo que acabas de guardar. Treinta segundos y sabes siempre lo que tienes."});
  T.push({t:"02:15 · MacroFactor",d:"Crea/actualiza las recetas con el peso cocinado real de hoy. Una vez hecho, el resto de la semana es solo registrar gramos."});
  return T;
}
function renderDomingo(){
  const T=sundayTasks();
  const done=T.filter((t,i)=>S.sunday[i]).length;
  $("#sundayPlan").innerHTML=`<div class="card">
    <div class="row" style="justify-content:space-between"><h3 style="margin:0">Orden de trabajo</h3><span class="badge">${done}/${T.length}</span></div>
    <div class="bar"><i style="width:${T.length?done/T.length*100:0}%"></i></div>
    <ul class="checks" style="margin-top:.6rem">
    ${T.map((t,i)=>`<li class="${S.sunday[i]?"done":""}">
      <input type="checkbox" id="sd_${i}" data-sd="${i}" ${S.sunday[i]?"checked":""}>
      <label for="sd_${i}"><b>${esc(t.t)}</b><br><small>${esc(t.d)}</small></label></li>`).join("")}
    </ul>
    <div class="note">Tiempos orientativos y solapados a propósito: el horno y la air fryer van solos mientras tú estás en los fogones. Con las tres recetas principales son unas <b>2 horas y cuarto</b> de domingo, de las cuales activas hay bastante menos.</div>
  </div>`;
  $$("input[data-sd]").forEach(c=>c.onchange=()=>{S.sunday[c.dataset.sd]=c.checked;save();renderDomingo();});
}
$("#btnResetSunday").onclick=()=>{S.sunday={};save();renderDomingo();};

/* =========================================================================
   11. VISTA CONGELADOR
   ========================================================================= */
function renderCongelador(){
  const sel=$("#frzRecipe");
  if(!sel.options.length){
    sel.innerHTML=RECIPES.map(r=>`<option value="${r.id}">${esc(r.n)}</option>`).join("");
    $("#frzDate").value=todayISO();
  }
  const items=[...S.freezer].sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  const totals={};
  items.forEach(f=>{ totals[f.recipeId]=(totals[f.recipeId]||0)+f.left; });
  $("#freezerList").innerHTML=`<div class="card">
    <h3>Lo que tienes ahora</h3>
    ${Object.keys(totals).length? `<div class="row">${Object.entries(totals).filter(([,n])=>n>0).map(([id,n])=>
      `<span class="badge">${esc((RECIPES.find(r=>r.id===id)||{}).n||id)}: <b>${d1(n)}</b></span>`).join("")}</div>`
      : `<p class="small">Vacío. Da de alta lo que guardes el domingo.</p>`}
    ${items.length?`<div class="scrollx" style="margin-top:.7rem"><table>
      <thead><tr><th>Receta</th><th>Cocinado</th><th>Dónde</th><th class="num">Quedan</th><th></th></tr></thead><tbody>
      ${items.map(f=>{
        const d=daysSince(f.date), alertN = f.where==="Nevera" && d!==null && d>3;
        const alertC = f.where==="Congelador" && d!==null && d>90;
        return `<tr${f.left<=0?' style="opacity:.4"':''}>
          <td>${esc((RECIPES.find(r=>r.id===f.recipeId)||{}).n||f.recipeId)}${f.grams?`<br><small>${f.grams} g/ración</small>`:""}</td>
          <td>${fmtDate(f.date)}<br><small>${d!==null?`hace ${d} d`:""}${alertN?' <span class="tag p">pasa de 3-4 días</span>':""}${alertC?' <span class="tag e">+3 meses</span>':""}</small></td>
          <td>${esc(f.where)}</td>
          <td class="num">${d1(f.left)} / ${d1(f.portions)}</td>
          <td class="num noprint">
            <button class="btn xs" data-fz-take="${f.id}" aria-label="Sacar una ración" ${f.left<=0?"disabled":""}>−1</button>
            <button class="btn xs" data-fz-half="${f.id}" aria-label="Sacar media ración" ${f.left<=0?"disabled":""}>−½</button>
            <button class="btn xs danger" data-fz-del="${f.id}" aria-label="Borrar esta entrada">✕</button></td></tr>`;}).join("")}
    </tbody></table></div>`:""}
    <div class="note small">Esto es solo stock. Lo que te comes se registra en MacroFactor: si sacas media ración, aquí bajas media y allí registras los gramos. Nunca cuentes una comida dos veces por tenerla en dos sitios.</div>
  </div>`;
  $$("[data-fz-take]").forEach(b=>b.onclick=()=>{const f=S.freezer.find(x=>x.id===b.dataset.fzTake);if(f){f.left=Math.max(0,f.left-1);save();renderCongelador();renderSemana();}});
  $$("[data-fz-half]").forEach(b=>b.onclick=()=>{const f=S.freezer.find(x=>x.id===b.dataset.fzHalf);if(f){f.left=Math.max(0,f.left-0.5);save();renderCongelador();renderSemana();}});
  $$("[data-fz-del]").forEach(b=>b.onclick=()=>{S.freezer=S.freezer.filter(x=>x.id!==b.dataset.fzDel);save();renderCongelador();renderSemana();});
}
$("#btnFrzAdd").onclick=()=>{
  const n=Math.max(1,Math.round(Number($("#frzPortions").value)||1));
  S.freezer.push({id:"f"+Date.now()+Math.random().toString(36).slice(2,6),
    recipeId:$("#frzRecipe").value, portions:n, left:n,
    date:$("#frzDate").value||todayISO(), where:$("#frzWhere").value,
    grams:Number($("#frzGrams").value)||null});
  save(); renderCongelador(); renderSemana(); toast("Dado de alta");
};
