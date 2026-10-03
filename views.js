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
    <div class="row" style="margin-top:.5rem"><button class="btn sm" id="btnFromWeek">Calcular raciones desde la semana</button></div>
    <div class="note small">El botón pone aquí lo que has planificado en «Semana» (comidas, cenas y desayunos). Los <b>antojos</b> se cocinan en la cantidad que quieras y duran semanas en el congelador: ponlos a 0 las semanas que no toque.</div>`;
  $("#btnFromWeek").onclick=()=>{
    const need={};
    S.plan.forEach(p=>{ if(p.r) need[p.r]=(need[p.r]||0)+p.q; });
    S.extras.forEach(e=>{ if(e&&e.desayuno) need[e.desayuno]=(need[e.desayuno]||0)+1; });
    if(!Object.keys(need).length){ toast("La semana está vacía"); return; }
    RECIPES.forEach(r=>{ S.batches[r.id]=Math.ceil(need[r.id]||0); });
    save(); renderCompra(); renderDomingo(); toast("Raciones calculadas desde la semana");
  };
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
    if(!F.noWeight && !(gross>0)) return;   // ingredientes opcionales puestos a 0
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
        if(F.unitG) qty+= ` · ≈ ${Math.ceil(it.buy/F.unitG)} ${(F.unitName||"ud")+(Math.ceil(it.buy/F.unitG)>1&&!/s$/.test(F.unitName||"ud")?"s":"")}${F.unitG===63?` (${d1(Math.ceil(it.buy/F.unitG)/12)} docenas)`:""}`;
        if(F.packG) qty+= ` · ≈ ${Math.ceil(it.buy/F.packG)} × ${F.packName}`;
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
    return `<label class="fld"><span>${esc(F.n)}${F.buyFactor?" (g de carne limpia, no de pollo entero)":F.unitG?` (g; 1 ${F.unitName||"ud"} = ${F.unitG} g)`:" (g)"}</span>
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
/** gramos de un alimento en el lote que vas a cocinar (según «Compra») */
function gLote(id, fid){
  const n=S.batches[id]||0, base=RECIPES.find(x=>x.id===id); if(!n||!base) return 0;
  const r=recipe(id); let g=0; r.ing.forEach(it=>{ if(it.f===fid) g+=it.g; });
  return g*n/base.servings;
}
const kgTxt = g => g>=1000 ? d1(g/1000)+" kg" : r0(g)+" g";
const hm = m => `${Math.floor(m/60)}:${String(m%60).padStart(2,"0")}`;
function sundayTasks(){
  const b=S.batches, T=[];
  const on=id=>(b[id]||0)>0, n=id=>b[id]||0;
  const P=on("pastel_carne"), C=on("pollo_arroz"), B=on("bolonesa");
  const tapers = ["pollo_arroz","pastel_carne","bolonesa"].reduce((a,id)=>a+n(id),0);
  T.push({id:"inicio",m:0,t:"Antes de empezar",d:`Vacía el fregadero y saca ${tapers||"los"} táperes grandes, la báscula y el termómetro. ${P?"Enciende el horno a 210 °C.":C?"Enciende el horno a 200 °C.":""} Nada de aceite para cocinar: sartenes antiadherentes y un chorrito de agua si algo se pega.`});
  let polloStart = 5;
  if(P){
    T.push({id:"patatas_horno",m:5,t:"Patatas al horno",d:`${kgTxt(gLote("pastel_carne","patata"))} de patata en dados de 2 cm, muy secos, con sal, pimentón y ajo en polvo. DOS bandejas con papel de horno, sin amontonar, 210 °C, 35-40 min, vuelta a mitad.`});
    T.push({id:"huevos",m:10,t:"Huevos cocidos",d:`Cuece 2 huevos por cada ración de patatas que vayas a comer esta semana (como mucho ${Math.round(gLote("pastel_carne","huevo")/63)}): 10-11 min, agua fría y a la nevera CON cáscara. Los de las raciones que congeles se cuecen el día que las descongeles (el huevo duro no se congela y dura 7 días).`});
    polloStart = 50;
  }
  if(P||B) T.push({id:"carnes",m:15,t:P&&B?"Las dos carnes, en dos sartenes":"La carne picada",d:[
      P?`Sartén 1 (patatas): ${r0(gLote("pastel_carne","cebolla"))} g de cebolla con un poco de agua 5 min + ${kgTxt(gLote("pastel_carne","carne_picada"))} de carne, hasta que se dore y no quede rosa.`:"",
      B?`${P?"Sartén 2":"Cazuela"} (boloñesa): ${r0(gLote("bolonesa","cebolla"))} g de cebolla y ${r0(gLote("bolonesa","pimiento"))} g de pimiento muy picados 8 min + ${kgTxt(gLote("bolonesa","carne_picada"))} de carne + ${r0(gLote("bolonesa","tomate_trit"))} g de tomate; 15-20 min a fuego suave reduciendo.`:""].filter(Boolean).join(" ")});
  if(P) T.push({id:"patatas_montar",m:45,t:"Montar las patatas",d:`Sacar las bandejas, mezclar patata + carne y repartir en ${n("pastel_carne")} táperes. Huevo y cottage NO van al táper: se añaden al servir.${C?" Baja el horno a 200 °C para el pollo.":""}`});
  if(C){
    T.push({id:"pollo_horno",m:polloStart,t:"Pollo al horno, en mariposa",d:`Abre el pollo por el espinazo con tijeras, aplástalo, sal y especias, sin aceite. 200 °C, 45-55 min, hasta 74 °C en la parte más gruesa. Los ${r0(gLote("pollo_arroz","pechuga"))} g de pechuga extra, en la misma bandeja los últimos 20-25 min.`});
    T.push({id:"verduras_pollo",m:polloStart+10,t:"Verduras del pollo",d:`${r0(gLote("pollo_arroz","pimiento"))} g de pimiento rojo en tiras y ${r0(gLote("pollo_arroz","cebolla"))} g de cebolla en juliana en sartén antiadherente, sin aceite (en dos tandas si no caben), 12-15 min.`});
  }
  if(B) T.push({id:"pasta",m:40,t:"Pasta",d:`${r0(gLote("bolonesa","pasta"))} g en la olla grande, 2 min menos que el paquete. Escurre, agua fría 10 s, mezcla con la salsa y reparte en ${n("bolonesa")} táperes. Déjalos enfriar destapados.`});
  if(C){
    const am=Math.max(polloStart+25, B?55:0);
    T.push({id:"arroz",m:am,t:"Arroz",d:`${r0(gLote("pollo_arroz","arroz"))} g de arroz en mucha agua con sal${B?" (la misma olla de la pasta)":""}, 15-16 min. Escurre, extiéndelo en una bandeja y A LA NEVERA YA: el arroz tiene que estar frío en menos de 1 hora.`});
    T.push({id:"pollo_montar",m:Math.max(polloStart+55, am+25),t:"Deshuesar y montar el pollo",d:`Reposo 10 min, fuera piel y huesos, trozos gordos. Táperes con el arroz ya frío + verduras + pollo, y si quieres 5 g de AOVE en crudo por táper. Pesa el total y apúntalo en la receta. Deja 1 en la nevera como mucho; el resto, al congelador.`});
  }
  let m = Math.max(0,...T.map(x=>x.m)) + 15;
  if(on("burritos")){ T.push({id:"burritos",m,t:"Relleno de burritos",d:`Pechuga y lomo en tiras, por separado, en sartén sin aceite; verduras salteadas. Dos rellenos, pesados y divididos. Solo relleno, sin montar.`}); m+=25; }
  if(on("bocata_pollo")){ T.push({id:"bocatas",m,t:"Bocatas",d:`Plancha la pechuga especiada sin aceite, monta ${n("bocata_pollo")} bocatas SIN salsa y envuelve en papel de horno + aluminio. La salsa, en su bote.`}); m+=20; }
  if(on("quesadillas_chipotle")){ T.push({id:"quesadillas",m,t:"Quesadillas chipotle",d:`Pechuga tapada a fuego medio sin aceite hasta 74 °C, salsa en la batidora, desmenuza y mezcla con el queso. Monta ${n("quesadillas_chipotle")}, tuesta sin aceite, enfría en rejilla y envuelve una a una.`}); m+=45; }
  if(on("helado_prot")){ T.push({id:"helado",m,t:"Bolsas del helado",d:`${n("helado_prot")} bolsas zip con su fruta, chía y proteína pesadas, al congelador.`}); m+=10; }
  if(on("bol_desayuno")){ T.push({id:"bol",m,t:"Botes del bol",d:`Hasta 3 botes de queso batido + chía para los próximos días (aguantan 2-3 días en nevera).`}); m+=5; }
  T.push({id:"pesar",m,t:"Repartir y pesar",d:"Un táper por ración. Pesa cada uno y apunta el peso en la etiqueta: es lo que te deja registrar por gramos sin inventar nada."});
  T.push({id:"etiquetar",m:m+5,t:"Etiquetar",d:"Cinta de papel + rotulador en cada tapa: NOMBRE · FECHA DE HOY · GRAMOS. AESAN recomienda anotar la fecha y consumir primero lo más antiguo."});
  T.push({id:"enfriar",m:m+10,t:"Enfriar y guardar",d:"Destapados hasta que dejen de humear, y al frío antes de 2 horas (el arroz, antes de 1). En nevera solo lo de los próximos 2 días (del pollo con arroz, 1 día); el resto, al congelador."});
  T.push({id:"alta",m:m+20,t:"Dar de alta el stock",d:"Al marcar esta tarea se apunta solo en «Congelador» lo que has cocinado hoy (en nevera lo de los próximos días y el resto congelado). Luego puedes retocarlo allí."});
  T.push({id:"mf",m:m+25,t:"MacroFactor",d:"Crea o actualiza las recetas con el peso cocinado real de hoy (solo lo que va en el táper). Una vez hecho, el resto de la semana es registrar gramos."});
  const m0=Math.min(...T.map(x=>x.m));
  T.sort((a,c)=>a.m-c.m).forEach(x=>{ x.t = `${hm(x.m-m0)} · ${x.t}`; });
  return T;
}
function altaAutomatica(){
  const hoy=todayISO();
  if(S.altaHecha===hoy){ toast("Ya diste de alta lo de hoy"); return; }
  const add=(id,nev,con)=>{
    const mk=(n,where)=>{ if(n>0) S.freezer.push({id:"f"+Date.now()+Math.random().toString(36).slice(2,6),recipeId:id,portions:n,left:n,date:hoy,where,grams:null}); };
    mk(nev,"Nevera"); mk(con,"Congelador");
  };
  const done=[];
  RECIPES.forEach(r=>{
    const n=S.batches[r.id]||0; if(!n || r.tipo==="desayuno") return;
    const nev = r.id==="pollo_arroz" ? Math.min(1,n) : Math.min(2,n);
    add(r.id, nev, n-nev); done.push(`${r.n} (${n})`);
  });
  S.altaHecha=hoy; save();
  toast(done.length? "Dado de alta en Congelador" : "No había nada que dar de alta");
}
function renderDomingo(){
  const T=sundayTasks();
  const done=T.filter(t=>S.sunday[t.id]).length;
  const last=Math.max(...T.map(t=>{const [h,mm]=t.t.split(" · ")[0].split(":");return (+h)*60+(+mm);}));
  $("#sundayPlan").innerHTML=`<div class="card">
    <div class="row" style="justify-content:space-between"><h3 style="margin:0">Orden de trabajo</h3><span class="badge">${done}/${T.length}</span></div>
    <div class="bar"><i style="width:${T.length?done/T.length*100:0}%"></i></div>
    <ul class="checks" style="margin-top:.6rem">
    ${T.map(t=>`<li class="${S.sunday[t.id]?"done":""}">
      <input type="checkbox" id="sd_${t.id}" data-sd="${t.id}" ${S.sunday[t.id]?"checked":""}>
      <label for="sd_${t.id}"><b>${esc(t.t)}</b><br><small>${esc(t.d)}</small></label></li>`).join("")}
    </ul>
    <div class="note">Horas orientativas desde que empiezas. Las cantidades salen de lo que has puesto en «Compra». Con lo elegido ahora son unas <b>${hm(last+10).replace(":"," h ")} min</b> de cocina, con bastante rato en el que el horno trabaja solo.</div>
  </div>`;
  $$("input[data-sd]").forEach(c=>c.onchange=()=>{
    S.sunday[c.dataset.sd]=c.checked; save();
    if(c.dataset.sd==="alta" && c.checked) { altaAutomatica(); renderCongelador(); renderSemana(); }
    renderDomingo();
  });
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
