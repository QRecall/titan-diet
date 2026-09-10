"use strict";
/* =========================================================================
   8. VISTA RECETAS
   ========================================================================= */
const FILTERS=[["todas","Todas"],["principal","Principales"],["antojo","Antojos"],["desayuno","Desayuno/postre"],["micro","Solo microondas"]];
let recFilter="todas";
function renderRecetas(){
  $("#recFilters").innerHTML = FILTERS.map(([k,l])=>`<button class="chip" data-fi="${k}" aria-pressed="${recFilter===k}">${l}</button>`).join("");
  $$("#recFilters .chip").forEach(b=>b.onclick=()=>{recFilter=b.dataset.fi;renderRecetas();});
  const q=($("#recSearch").value||"").toLowerCase().trim();
  const list = RECIPES.filter(base=>{
    if(recFilter==="micro" && base.micro!=="ok") return false;
    if(["principal","antojo","desayuno"].includes(recFilter) && base.tipo!==recFilter) return false;
    if(!q) return true;
    const hay = base.n.toLowerCase()+" "+base.ing.map(i=>food(i.f).n.toLowerCase()).join(" ")+" "+base.tags.join(" ");
    return hay.includes(q);
  });
  $("#recipeList").innerHTML = list.length? list.map(b=>recipeCard(recipe(b.id))).join("")
    : `<div class="card"><p>Nada coincide con «${esc(q)}».</p></div>`;
  bindRecipeCards();
}
$("#recSearch").oninput = renderRecetas;

function recipeCard(r){
  const base=RECIPES.find(x=>x.id===r.id);
  const bm=batchMacros(r), sm=servingMacros(r), p1=per100(r), cw=scaledCookedWeight(r), raw=rawWeight(r);
  const label = r.servingsLabel||"raciones";
  const ingRows = r.ing.map((it,i)=>{
    const F=food(it.f), m=ingMacros(it), scale=r.servings/base.servings;
    const g=it.g*scale;
    const unit = F.unitG? ` <small>(${r1(g/F.unitG)} ${F.unitName||"ud"})</small>`:"";
    return `<tr>
      <td>${esc(F.n)} ${qTag(F.q)}<br><small>${esc(F.st)}${it.note?" · "+esc(it.note):""}</small></td>
      <td class="num"><input type="number" data-ig="${r.id}|${i}|${it.key||it.f}" value="${r1(it.g)}" min="0" step="5" style="max-width:90px;text-align:right"></td>
      <td class="num">${r1(g)} g${unit}</td>
      <td class="num">${r0(m.kcal*scale)}</td>
      <td class="num">${r1(m.p*scale)}</td>
    </tr>`;
  }).join("");

  const cons=r.conservacion||{};
  return `<div class="card" id="rec-${r.id}">
    <div class="row" style="justify-content:space-between;align-items:flex-start">
      <h2 style="margin:0">${esc(r.n)}</h2>
      <span class="badge">${r.minutes} min · ${r.micro==="ok"?"microondas ✓":r.micro==="no"?"air fryer":"sin cocinar"}</span>
    </div>
    ${r.aviso?`<div class="note warn">${r.aviso}</div>`:""}

    <div class="row" style="margin:.6rem 0">
      <label class="fld" style="max-width:150px;margin:0"><span>${label==="raciones"?"Raciones del lote":"Unidades"}</span>
        <input type="number" data-sv="${r.id}" value="${r.servings}" min="1" step="1"></label>
      <label class="fld" style="max-width:210px;margin:0"><span>Peso cocinado real (g)</span>
        <input type="number" data-cw="${r.id}" value="${r.cookedWeightUser?r.cookedWeight:""}" min="0" step="10" placeholder="${r.cookedWeight? r0(scaledCookedWeight(r))+' (estimado)':'—'}"></label>
      <div style="align-self:flex-end;padding-bottom:.5rem"><small>Crudo/seco de entrada: <b>${r0(raw)} g</b></small></div>
    </div>
    ${r.cookedNote?`<p class="small">${r.cookedWeightUser?'<span class="tag v">PESADO</span>':'<span class="tag e">ESTIMADO</span>'} ${esc(r.cookedNote)}</p>`:""}

    <h3>Ingredientes</h3>
    <div class="scrollx"><table class="ingt">
      <thead><tr><th>Ingrediente</th><th class="num">g base<br><small>(${base.servings})</small></th><th class="num">g lote<br><small>(${r.servings})</small></th><th class="num">kcal</th><th class="num">prot</th></tr></thead>
      <tbody>${ingRows}</tbody>
    </table></div>
    <p class="small">La columna editable está referida al lote base de <b>${base.servings} ${label}</b>. Cambia las raciones arriba y todo se escala solo.</p>

    <div class="grid g3" style="margin-top:.7rem">
      <div><h4>Por lote (${r.servings} ${label})</h4>${macroBox(bm)}</div>
      <div><h4>Por ración</h4>${macroBox(sm)}</div>
      <div><h4>Por 100 g del plato terminado</h4>${p1?macroBox(p1):`<div class="note warn small" style="margin:0">Sin peso cocinado no puedo darlo. Pesa el resultado y escríbelo arriba: no me lo voy a inventar.</div>`}</div>
    </div>
    ${cw?`<p class="small">Peso cocinado usado: <b>${r0(cw)} g</b> ${r.cookedWeightUser?'<span class="tag v">pesado por ti</span>':'<span class="tag e">estimación</span>'} → ración de ≈ <b>${r0(cw/r.servings)} g</b>.</p>`:""}

    <details><summary>Preparación (${r.minutes} min)</summary>
      <p class="small"><b>Utensilios:</b> ${esc(r.utensilios)}</p>
      <ol class="steps">${r.pasos.map(p=>`<li>${p}</li>`).join("")}</ol>
    </details>

    ${r.fresh?`<details><summary>${esc(r.fresh.titulo)}</summary>
      <h4>Va al frío ya cocinado</h4><ul class="small">${r.fresh.frio.map(x=>`<li>${x}</li>`).join("")}</ul>
      <h4>Va aparte, en fresco, y se añade al servir</h4><ul class="small">${r.fresh.fresco.map(x=>`<li>${x}</li>`).join("")}</ul>
      <div class="note">${r.fresh.porque}</div></details>`:""}

    <details><summary>Conservar, congelar, llevar y recalentar</summary>
      <div class="kv"><b>Nevera</b><span style="text-align:right;max-width:70%">${cons.nevera||"—"}</span></div>
      <div class="kv"><b>Congelador</b><span style="text-align:right;max-width:70%">${cons.congelador||"—"}</span></div>
      <div class="kv"><b>Descongelar</b><span style="text-align:right;max-width:70%">${cons.descongelar||"—"}</span></div>
      <div class="kv"><b>Recalentar</b><span style="text-align:right;max-width:70%">${cons.recalentar||"—"}</span></div>
      <div class="kv"><b>A la facultad</b><span style="text-align:right;max-width:70%">${cons.universidad||"—"}</span></div>
      <p class="small" style="margin-top:.5rem">Fuentes: FSA (arroz y <i>Bacillus cereus</i>), USDA FSIS (sobras, congelación, recalentado a 74 °C, transporte con 2 acumuladores de frío), FDA (tomate cortado y hoja verde cortada), AESAN (etiquetar con la fecha y consumir primero lo más antiguo). Enlaces en la pestaña «Datos».</p>
    </details>

    <details><summary>Cómo meter esta receta en MacroFactor</summary>
      ${mfInstructions(r, cw)}
    </details>

    <details><summary>Variantes</summary>
      ${r.variantes.map(v=>`<div class="kv" style="display:block"><b>${esc(v.n)}</b><br><span class="small">${v.d}</span></div>`).join("")}
    </details>
  </div>`;
}

function mfInstructions(r,cw){
  const label=r.servingsLabel||"raciones";
  return `<ol class="steps small">
    <li>En MacroFactor: botón <b>«+» → «New Recipe» → «Build from scratch» → Next</b>. <span class="tag v">CONFIRMADO</span> en su Help Center.</li>
    <li>Nombre: <b>${esc(r.n)}</b>. En <b>número de porciones (servings)</b> pon <b>${r.servings}</b>.</li>
    <li>«Add Ingredients»: añade uno a uno los ingredientes con los gramos de la columna <b>«g del lote»</b> de arriba. Busca el producto de Mercadona; si no aparece o los valores no cuadran con tu envase, créalo como <b>alimento personalizado</b> (+ → alimento nuevo: eliges «Por 100 g», metes kcal/proteína/hidratos/grasa de la etiqueta). <span class="tag v">CONFIRMADO</span></li>
    <li><b>Lo importante:</b> rellena la casilla <b>«Total Weight»</b> con el peso del plato ya cocinado${cw?` — ahora mismo tienes ${r0(cw)} g${r.cookedWeightUser?" (pesado)":" (estimado: pésalo)"}`:""}. Su documentación dice literalmente que esto <i>«te permitirá registrar la receta usando unidades de masa»</i>. Es decir: podrás registrar «310 g de esto» en vez de «0,7 raciones». <span class="tag v">CONFIRMADO</span></li>
    <li>Si vas a repartir el lote en porciones iguales y comerlas enteras, su propia documentación dice que no hace falta afinar el peso final. El peso real solo importa si vas a comer <b>cantidades variables</b> — que es exactamente tu caso, así que pésalo.</li>
    <li>Para registrar media ración o una cantidad concreta: seleccionas el alimento y cambias unidad y cantidad antes de añadirlo al plato. <span class="tag v">CONFIRMADO</span> que se pueden cambiar unidad y cantidad; <span class="tag e">no he encontrado</span> una frase literal en su documentación que confirme decimales tipo «0,5 porciones», así que si te da problemas, regístralo <b>por gramos</b> (que sí está confirmado vía Total Weight).</li>
    <li>Puedes compartir la receta con un enlace («Share»): el enlace lleva ingredientes, notas y pasos, y quien lo abre se la guarda en su cuenta. <span class="tag v">CONFIRMADO</span>. No hay código de receta ni exportación a archivo documentados.</li>
    <li>Para algo suelto que no merece receta (un almuerzo improvisado): <b>«+» → «Quick Add»</b>, metes proteína/hidratos/grasa y calcula las calorías. Si luego lo quieres reutilizable, «Copy to Custom». <span class="tag v">CONFIRMADO</span></li>
  </ol>
  <div class="note"><b>Sobre los objetivos:</b> MacroFactor recalcula tus objetivos al principio de cada semana a partir del peso y de lo que registras, y aplica un suavizado: su documentación dice que si tu peso está varios kilos arriba o abajo durante 1-5 días, la estimación de gasto cambia, <i>«pero no mucho»</i>. Traducción: no toques nada por un día raro de báscula.</div>`;
}

function bindRecipeCards(){
  $$("input[data-sv]").forEach(i=>i.onchange=()=>{
    const id=i.dataset.sv, v=Math.max(1,Math.round(Number(i.value)||1));
    S.ov[id]=S.ov[id]||{}; S.ov[id].servings=v; save(); later(()=>{renderRecetas(); renderAdj();});
  });
  $$("input[data-cw]").forEach(i=>i.onchange=()=>{
    const id=i.dataset.cw, v=i.value===""?null:Math.max(0,Number(i.value)||0);
    S.ov[id]=S.ov[id]||{}; S.ov[id].cookedWeight=v; save(); later(()=>{renderRecetas(); renderAdj();});
  });
  $$("input[data-ig]").forEach(i=>i.onchange=()=>{
    const [id,idx,key]=i.dataset.ig.split("|");
    S.ov[id]=S.ov[id]||{}; S.ov[id].ing=S.ov[id].ing||{};
    S.ov[id].ing[idx+"_"+key]=Math.max(0,Number(i.value)||0);
    save(); later(()=>{renderRecetas(); renderAdj();});
  });
}
