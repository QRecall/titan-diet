"use strict";
/* =========================================================================
   13. DATOS
   ========================================================================= */
function renderStoreStatus(){
  $("#storeStatus").innerHTML = storageOK
    ? `<div class="note ok small">Guardado local funcionando. Última escritura automática tras cada cambio.</div>`
    : `<div class="note bad small"><b>Este navegador no me deja guardar.</b> Suele pasar en modo incógnito o con las cookies/datos de sitio bloqueados. Puedes usar la página igual, pero al cerrarla pierdes lo escrito: exporta la copia antes de salir.</div>`;
}
const SOURCES=[
  ["Datos nutricionales de productos Mercadona","Fichas con foto de etiqueta en Open Food Facts (pollo entero, carne picada vacuno 99 %, lomo, arroz, macarrones, queso batido, huevos, tortillas, cheddar, havarti, maíz, AOVE, chía, salsas, fruta congelada). tienda.mercadona.es no permite consulta automática, así que ninguna cifra viene de su web oficial.","es.openfoodfacts.org"],
  ["Carne picada 99 %","La ficha da 204 kcal, 19 g proteína, 0,5 g HC y 14 g grasa por 100 g: <b>coincide exactamente</b> con la entrada provisional que tenías. Aun así, «99 % carne» no significa magra — 14 g de grasa por 100 g. Comprueba el envase que compres.","es.openfoodfacts.org/producto/8436569263174"],
  ["Verduras, patata y alimentos a granel","USDA FoodData Central (no tienen etiqueta propia en Mercadona). Marcados como ESTIMACIÓN.","fdc.nal.usda.gov"],
  ["Rendimiento del pollo entero","No hay una cifra oficial única. Las fuentes consultadas dan ~50-65 % de carne aprovechable con piel, ~45-50 % sin piel, ~25-30 % de hueso. Aquí se usa un factor de 2,1 g de pollo entero por 1 g de carne limpia, editable. Pesa tu carne limpia el domingo y tendrás tu número real.",""],
  ["Arroz cocido y Bacillus cereus","Food Standards Agency (Reino Unido): enfriar rápido, máximo 1 día en nevera, congelar dentro de la primera hora, recalentar una sola vez.","www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker"],
  ["Regla de las 2 horas y zona de peligro","USDA FSIS: no más de 2 h fuera de la nevera (1 h si hace más de 32 °C); zona de peligro 4-60 °C.","www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f"],
  ["Días en nevera y meses en congelador","FoodSafety.gov / FDA Cold Food Storage Chart y USDA FSIS «Leftovers and Food Safety»: carne y aves cocinadas 3-4 días en nevera y 2-6 meses congeladas; sopas y guisos 2-3 meses; cazuelas con huevo 2-3 meses; huevo duro 1 semana en nevera y <b>«no congelar»</b>.","www.foodsafety.gov/food-safety-charts/cold-food-storage-charts"],
  ["Recalentar desde congelado y a qué temperatura","USDA FSIS: es seguro recalentar sobras congeladas sin descongelar; objetivo 74 °C (165 °F) medido con termómetro; en microondas, tapar, remover y dejar reposar.","www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety"],
  ["Llevar comida en la mochila","USDA FSIS «Keeping Bag Lunches Safe»: bolsa isotérmica y <b>al menos dos</b> fuentes de frío; sigue aplicando el máximo de 2 horas sin frío.","www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/keeping-bag-lunches-safe"],
  ["Tomate cortado y hoja verde cortada","FDA: tomate ya cortado, máximo 4 h a temperatura ambiente; hoja verde cortada a ≤5 °C y máximo 7 días. Son guías para restauración, pero es el criterio técnico de fondo.","www.fda.gov/food/retail-food-industryregulatory-assistance-training/time-public-health-control-cut-tomatoes"],
  ["Etiquetar y rotar","AESAN: anotar la fecha de congelación en los envases y consumir primero lo más antiguo.","www.aesan.gob.es/AECOSAN/web/para_el_consumidor/ampliacion/colocar_segura.htm"],
  ["MacroFactor — recetas y peso cocinado","Help Center oficial: crear receta desde cero con número de porciones, y casilla <b>«Total Weight»</b> para el peso del plato cocinado, que permite registrar por unidades de masa. Compartir por enlace. Quick Add. Todo confirmado en su documentación.","help.macrofactorapp.com/en/articles/6-create-and-add-a-custom-recipe"],
  ["MacroFactor — objetivos adaptativos","Documentación oficial: objetivos nuevos al principio de cada semana; el algoritmo suaviza y no reacciona con fuerza a 1-5 días de peso anómalo.","help.macrofactorapp.com/en/articles/222-how-does-macrofactor-make-adjustments-for-a-weight-gain-or-weight-loss-goal"],
  ["Creatina","ISSN Position Stand (Kreider et al., 2017), Journal of the International Society of Sports Nutrition.","jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z"],
  ["Cafeína","EFSA, Scientific Opinion on the safety of caffeine (2015).","efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2015.4102"]
];
function renderDatos(){
  renderStoreStatus();
  $("#sourcesList").innerHTML = SOURCES.map(([t,d,u])=>
    `<details><summary>${esc(t)}</summary><p class="small">${d}</p>${u?`<p class="small"><a href="https://${u.replace(/^https?:\/\//,"")}" target="_blank" rel="noopener">${esc(u)}</a></p>`:""}</details>`).join("")
    + `<div class="note warn small"><b>Vacíos que no he rellenado a ojo:</b> ninguna agencia oficial (AESAN, FSA, USDA, FDA, EFSA) dice nada sobre <b>congelar patata cocida</b>; tampoco hay cifra oficial de meses para arroz o pasta cocidos congelados; ni una línea separada para «huevo duro pelado» en nevera. El nº de tortillas por paquete y el peso escurrido del maíz son estimaciones del peso total. La ficha del pan de chapata no trae fibra: la que ves es estimada.</div>`;
}
$("#btnExport").onclick=()=>{
  const blob=new Blob([JSON.stringify(S,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`titan-diet-copia-${todayISO()}.json`;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast("Copia descargada");
};
$("#importFile").onchange=e=>{
  const f=e.target.files[0]; if(!f) return;
  const rd=new FileReader();
  rd.onload=()=>{ try{
      const o=JSON.parse(rd.result);
      if(!o || typeof o!=="object") throw 0;
      S=Object.assign(defaultState(),o); save(); renderAll(); toast("Copia importada");
    }catch(err){ alert("Ese archivo no es una copia válida."); } };
  rd.readAsText(f); e.target.value="";
};
$("#btnPrint").onclick=()=>window.print();
$("#btnReset").onclick=()=>{
  if(confirm("¿Seguro? Se borra todo lo que has escrito: objetivos, plan, inventario y ajustes de recetas. Exporta antes si quieres conservarlo.")){
    try{localStorage.removeItem(STORE_KEY);}catch(e){}
    S=defaultState(); save(); renderAll(); toast("Todo a cero");
  }
};


/* =========================================================================
   13b. PIRÁMIDE DE LA ALIMENTACIÓN (SENC)
   ========================================================================= */
const PYR = [
  {k:"ocasional", sh:"Ocasional", shf:"carne roja · dulces · procesados", n:"Consumo ocasional y moderado", f:"Cuanto menos, mejor",
   col:"#c0392b",
   senc:"Carnes rojas y procesadas, embutidos, azúcares y bollería, snacks salados y grasas que no sean el aceite de oliva. La SENC no las prohíbe: las sitúa arriba del todo, en «consumo opcional, ocasional y moderado».",
   tuyo:"Aquí está el punto flojo de tu plan, y prefiero decírtelo: <b>dos de tus tres recetas principales llevan carne picada de vacuno</b>, y los burritos llevan lomo. Eso no las convierte en malas —te dan la proteína que buscas— pero conviene saber dónde las coloca la guía. Las variantes con pollo o pavo ya están escritas en cada receta si un día quieres bajar la frecuencia."},
  {k:"proteico", sh:"Proteicos", shf:"1-3 al día, alternando", n:"Alimentos proteicos", f:"1-3 raciones al día, alternando",
   col:"#d97706",
   senc:"Pescados, huevos, carnes blancas, legumbres y frutos secos. La idea de la SENC es <b>ir alternando</b> entre ellos, no repetir siempre el mismo.",
   tuyo:"Tu plan cubre huevo y pollo. <b>No hay pescado ni legumbres</b> en ninguna de las tres recetas: es la ausencia más clara. Si quieres corregirlo sin tocar el sistema, la vía más barata es cambiar una de las 12 raciones por una receta con legumbre, o añadir una lata de atún o unas conservas a los almuerzos."},
  {k:"lacteo", sh:"Lácteos", shf:"2-3 al día", n:"Lácteos", f:"2-3 raciones al día",
   col:"#0891b2",
   senc:"Preferentemente bajos en grasa, sin azúcares añadidos.",
   tuyo:"El queso fresco batido del desayuno es exactamente esto, y además es la mitad de tu proteína del día. Aquí vas sobrado."},
  {k:"frutaverdura", sh:"Fruta y verdura", shf:"5 o más al día", n:"Frutas, verduras y aceite de oliva", f:"≥5 raciones al día entre fruta y verdura",
   col:"#16a34a",
   senc:"3-4 raciones de fruta y 2-3 de verdura al día, más aceite de oliva virgen extra como grasa principal. La OMS pone la referencia en <b>al menos 400 g al día</b> de frutas y verduras.",
   tuyo:"Cebolla, pimiento, tomate, lechuga, rúcula y la fruta congelada del desayuno. Abajo tienes el cálculo de lo que sale de tu plan actual."},
  {k:"cereal", sh:"Cereales y patata", shf:"a diario", n:"Cereales, patata y legumbre tierna", f:"Todos los días, según tu actividad",
   col:"#0e9f6e",
   senc:"Pan, pasta, arroz y patata, mejor de grano entero. La cantidad depende de lo que te muevas: la SENC no da un número fijo para todo el mundo.",
   tuyo:"Arroz, pasta y patata. Son los que te dan margen para ajustar calorías sin tocar la proteína: si un día necesitas recortar, es de aquí de donde conviene quitar, no del pollo."}
];
const PYR_BASE = {
  n:"Estilo de vida", 
  txt:"El primer escalón de la SENC no es comida: es <b>actividad física diaria</b> (referencia de ~60 min o ~10.000 pasos), <b>hidratación</b> (2-2,5 L al día contando todo), <b>equilibrio emocional</b>, <b>balance energético</b> y <b>técnicas culinarias sanas</b> (horno, plancha, vapor, air fryer — que es justo lo que usas el domingo)."
};
const PYR_MAP = {
  pollo_carne:"proteico", huevo:"proteico", proteina:"proteico",
  carne_picada:"ocasional", lomo_vacuno:"ocasional",
  q_batido_0:"lacteo", q_batido_prot:"lacteo", q_cheddar:"lacteo", q_havarti:"lacteo", leche:"lacteo",
  arroz:"cereal", pasta:"cereal", patata:"cereal", tortilla:"cereal", pan_chapata:"cereal", avena:"cereal", maiz:"cereal",
  tomate:"frutaverdura", lechuga:"frutaverdura", rucula:"frutaverdura", cebolla:"frutaverdura",
  cebolla_morada:"frutaverdura", pimiento:"frutaverdura", tomate_trit:"frutaverdura",
  fruta_fp:"frutaverdura", fruta_trop:"frutaverdura", lima:"frutaverdura", cilantro:"frutaverdura",
  aove:"frutaverdura", chia:"proteico",
  salsa_yogur:"ocasional", picante:"ocasional", especias:null
};
let pyrSel = null;

/** gramos por día de cada grupo, a partir del plan de la semana */
function pyrWeek(){
  const g = {}; PYR.forEach(l=>g[l.k]=0);
  let veg=0, fruta=0;
  const add = (rid, mult)=>{
    const base=RECIPES.find(x=>x.id===rid); if(!base) return;
    const r=recipe(rid), scale=(r.servings/base.servings);
    r.ing.forEach(it=>{
      const F=food(it.f); if(F.noWeight) return;
      const grp=PYR_MAP[it.f]; if(!grp) return;
      const grams = (it.g*scale/r.servings)*mult;
      g[grp]=(g[grp]||0)+grams;
      if(grp==="frutaverdura"){
        if(it.f==="fruta_fp"||it.f==="fruta_trop"||it.f==="lima") fruta+=grams;
        else if(it.f!=="aove") veg+=grams;
      }
    });
  };
  S.plan.forEach(p=>{ if(p.r) add(p.r, p.q); });
  S.extras.forEach(e=>{ if(e && e.desayuno) add(e.desayuno, 1); });
  for(const k in g) g[k]=g[k]/7;
  return {g, veg:veg/7, fruta:fruta/7, total:(veg+fruta)/7};
}

function pyramidSVG(){
  // 5 bandas trapezoidales + base
  const W=520, H=330, apexX=W/2, top=8, bot=272, bands=PYR.length;
  const halfAt = y => ( (y-top)/(bot-top) ) * (W*0.46);
  let out=`<svg class="pyr" viewBox="0 0 ${W} ${H}" role="img" aria-label="Pirámide de la alimentación">`;
  for(let i=0;i<bands;i++){
    const y1 = top + (bot-top)*(i/bands), y2 = top + (bot-top)*((i+1)/bands);
    const h1=halfAt(y1), h2=halfAt(y2);
    const L=PYR[i];
    const pts = i===0
      ? `${apexX},${y1} ${apexX+h2},${y2} ${apexX-h2},${y2}`
      : `${apexX-h1},${y1} ${apexX+h1},${y1} ${apexX+h2},${y2} ${apexX-h2},${y2}`;
    const cy=(y1+y2)/2;
    out+=`<g class="lvl" data-lvl="${L.k}" role="button" tabindex="0" aria-pressed="${pyrSel===L.k}" aria-label="${esc(L.n)}">
      <polygon points="${pts}" fill="${L.col}" stroke="var(--card)" stroke-width="2"/>
      ${i===0?`<text x="${apexX}" y="${y2-7}" text-anchor="middle" class="sm">${esc(L.sh)}</text>`
             :`<text x="${apexX}" y="${cy-1}" text-anchor="middle">${esc(L.sh)}</text>
               <text x="${apexX}" y="${cy+14}" text-anchor="middle" class="sm">${esc(L.shf)}</text>`}
    </g>`;
  }
  out+=`<g class="lvl" data-lvl="base" role="button" tabindex="0" aria-pressed="${pyrSel==="base"}" aria-label="Estilo de vida">
    <path d="M8 ${bot+10} h${W-16} a10 10 0 0 1 10 10 v26 a10 10 0 0 1 -10 10 h-${W-16} a10 10 0 0 1 -10 -10 v-26 a10 10 0 0 1 10 -10 z" fill="#6d4aff"/>
    <text x="${apexX}" y="${bot+30}" text-anchor="middle">Estilo de vida</text>
    <text x="${apexX}" y="${bot+45}" text-anchor="middle" class="sm">movimiento · agua · descanso · cómo cocinas</text>
  </g></svg>`;
  return out;
}

function renderPiramide(){
  $("#pyrSvg").innerHTML = pyramidSVG();
  const bind = el => {
    el.onclick = ()=>{ const k=el.dataset.lvl; pyrSel = (pyrSel===k? null : k); renderPiramide(); };
    el.onkeydown = e => { if(e.key==="Enter"||e.key===" "){ e.preventDefault(); el.click(); } };
  };
  $$("#pyrSvg .lvl").forEach(bind);

  const W = pyrWeek();
  $("#pyrLegend").innerHTML = PYR.slice().reverse().map(L=>
    `<button data-lvl="${L.k}" aria-pressed="${pyrSel===L.k}">
      <span class="dot" style="background:${L.col}"></span>
      <span class="t">${esc(L.n)}<br><span class="f">${esc(L.f)}</span></span>
      <span class="badge">${r0(W.g[L.k]||0)} g/día</span></button>`).join("")
    + `<button data-lvl="base" aria-pressed="${pyrSel==="base"}"><span class="dot" style="background:#6d4aff"></span>
       <span class="t">Estilo de vida<span class="f">la base de todo, y no se come</span></span></button>`;
  $$("#pyrLegend button").forEach(bind);

  if(!pyrSel){
    $("#pyrPanel").innerHTML = `<div class="card"><p class="small">Toca un escalón (en el dibujo o en la lista) para ver qué dice la SENC de ese grupo y qué alimentos tuyos caen ahí.</p></div>`;
  }else if(pyrSel==="base"){
    $("#pyrPanel").innerHTML = `<div class="card"><h3>${PYR_BASE.n}</h3><p>${PYR_BASE.txt}</p>
      <div class="note">Esto no lo gestiona esta app: lo llevas en tu sistema de arranque. Aquí solo queda dicho que la base de la pirámide no es comida.</div></div>`;
  }else{
    const L = PYR.find(x=>x.k===pyrSel);
    const foods = Object.keys(PYR_MAP).filter(f=>PYR_MAP[f]===pyrSel && FOODS[f]);
    $("#pyrPanel").innerHTML = `<div class="card">
      <div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(L.n)}</h3>
        <span class="badge" style="background:${L.col};color:#fff;border-color:transparent">${esc(L.f)}</span></div>
      <p style="margin-top:.6rem"><b>Qué dice la SENC.</b> ${L.senc}</p>
      <p><b>En tu plan.</b> ${L.tuyo}</p>
      <div class="hr"></div>
      <h4>Tus alimentos de este escalón</h4>
      <div class="row tight">${foods.map(f=>`<span class="badge">${esc(FOODS[f].n)}</span>`).join("")||"<span class='small'>ninguno</span>"}</div>
      <p class="small" style="margin-top:.6rem">Aporte medio de tu plan actual: <b>${r0(W.g[pyrSel]||0)} g al día</b> — calculado con las 14 comidas y los desayunos que tengas puestos en la pestaña «Semana». <span class="tag e">ESTIMACIÓN</span> es peso de ingrediente crudo, no raciones oficiales.</p>
    </div>`;
  }

  // auditoría
  const objetivo=400;
  const pct=Math.min(100, W.total/objetivo*100);
  const dias = S.plan.filter(p=>p.r).length;
  $("#pyrAudit").innerHTML = `
    <div class="kv"><span>Fruta + verdura al día (media del plan)</span><b>${r0(W.total)} g</b></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <p class="small">Referencia de la OMS: <b>al menos 400 g al día</b> entre frutas y verduras. Lo de arriba sale de tu plan de la semana (${dias} huecos con táper + los desayunos), contando peso crudo del ingrediente. Las salsas de tomate cuentan; el aceite de oliva no se cuenta aquí aunque comparta escalón.</p>
    ${W.total<objetivo?`<div class="note warn">Te quedan <b>${r0(objetivo-W.total)} g/día</b> para la referencia de la OMS. La forma barata de arreglarlo sin tocar las recetas: subir el pimiento y la cebolla en la boloñesa y en el pollo (está en las variantes de cada una), o una pieza de fruta en los almuerzos.</div>`
      :`<div class="note ok">Con este plan llegas a la referencia de 400 g/día.</div>`}
    <div class="grid g3" style="margin-top:.7rem">
      <div class="kv"><span>Proteicos</span><b>${r0(W.g.proteico)} g/día</b></div>
      <div class="kv"><span>Lácteos</span><b>${r0(W.g.lacteo)} g/día</b></div>
      <div class="kv"><span>Cereales y patata</span><b>${r0(W.g.cereal)} g/día</b></div>
      <div class="kv"><span>Carne roja y procesados</span><b>${r0(W.g.ocasional)} g/día</b></div>
    </div>
    <details style="margin-top:.7rem"><summary>De dónde sale esta pirámide</summary>
      <p class="small">Pirámide de la Alimentación Saludable de la <b>SENC</b> (Sociedad Española de Nutrición Comunitaria), versión 2015 actualizada en la <i>Guía de la Alimentación Saludable</i>. Estructura y frecuencias tomadas de la propia SENC y de resúmenes de la guía; la referencia de 400 g/día de frutas y verduras es de la <b>OMS</b>.</p>
      <p class="small"><b>Lo que no te voy a vender como exacto:</b> la SENC habla de <i>raciones</i>, y aquí se muestran <i>gramos de ingrediente crudo</i>, que no es lo mismo. Sirve para ver tendencias y huecos —si falta verdura, si sobra carne roja— no para puntuar la dieta. Y una pirámide es una guía de población general: tus objetivos de MacroFactor mandan sobre esto.</p>
    </details>`;
}

/* =========================================================================
   14. ARRANQUE
   ========================================================================= */
function renderAll(){
  renderTabs(); showView();
  renderHoy(); renderSemana(); renderRecetas(); renderCompra();
  renderDomingo(); renderCongelador(); renderEquipo(); renderDatos(); renderPiramide();
}
try{
  const t="__t"; localStorage.setItem(t,"1"); localStorage.removeItem(t);
}catch(e){ storageOK=false; }
S = load();
// accesos directos del icono de la app: ?v=compra, ?v=domingo, ?v=recetas
try{
  const qv=new URLSearchParams(location.search).get("v");
  if(qv && VIEWS.some(v=>v[0]===qv)) S.tab=qv;
}catch(e){}
renderAll();
