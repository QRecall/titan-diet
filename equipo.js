"use strict";
/* =========================================================================
   12. VISTA EQUIPO Y SUPLEMENTOS
   ========================================================================= */
function volumeAdvice(){
  const rs=["pollo_arroz","pastel_carne","bolonesa"].map(id=>{const r=recipe(id);const cw=scaledCookedWeight(r);
    return {n:r.n, g: cw? Math.round(cw/r.servings):null};});
  const max=Math.max(...rs.map(x=>x.g||0));
  return {rs, max};
}
function renderEquipo(){
  const {rs,max}=volumeAdvice();
  const need=Math.ceil(max*1.15/50)*50; // 15 % de aire + redondeo
  $("#equipContent").innerHTML=`
  <div class="card">
    <h2>Táperes: cuántos y de qué tamaño</h2>
    <p class="small">Primero el volumen, después la tienda. Las raciones de tus tres recetas pesan:</p>
    <ul class="small">${rs.map(x=>`<li><b>${esc(x.n)}</b>: ${x.g? x.g+" g por ración":"sin peso definido todavía"}</li>`).join("")}</ul>
    <div class="note"><b>Conclusión:</b> la ración más pesada ronda los <b>${max} g</b>. Con densidad de arroz/pasta/carne (≈0,9-1 g/ml) y un dedo de aire para que cierre y para que el líquido no toque la tapa al congelar, necesitas <b>${need} ml como mínimo por táper</b>. Con <b>1,0-1,2 L</b> vas holgado y te vale para las tres recetas. Añade unos pequeños de <b>350-500 ml</b> para la salsa de los bocatas, la lechuga cortada y las porciones de helado.
    <br><small>Estos números se recalculan solos si cambias raciones o pesos cocinados.</small></div>
    <h3>Cuántos</h3>
    <p class="small">12 raciones a la vez + los que están en el lavavajillas + margen: <b>14-16 grandes iguales y apilables</b> y <b>6 pequeños</b>. Todos del mismo modelo, que es lo que pedías: apilan de verdad y las tapas son intercambiables.</p>

    <h3>Opciones concretas <span class="small">(consultado el 10/09/2026)</span></h3>
    <div class="scrollx"><table>
      <thead><tr><th>Producto</th><th>Material</th><th>Capacidad</th><th>Precio</th><th>Micro</th><th>Dónde</th></tr></thead>
      <tbody>
        <tr><td><a href="https://www.leroymerlin.es/productos/tatay-top-flex-recipiente-cuadrado-alto-1l-con-cierre-a-presion-87736964.html" target="_blank" rel="noopener">TATAY Top Flex cuadrado alto</a></td><td>PP sin BPA</td><td>1,0 L</td><td>3,71 €</td><td>Sí (no consta si hay que ventear la tapa → ábrela por si acaso)</td><td>Leroy Merlin online</td></tr>
        <tr><td><a href="https://www.compraonline.alcampo.es/products/403039" target="_blank" rel="noopener">TATAY hermético ovalado</a></td><td>PP sin BPA</td><td>1,2 L</td><td>4,20 €</td><td>Sí, tapa flexible</td><td>Alcampo online</td></tr>
        <tr><td><a href="https://www.ikea.com/es/es/p/ikea-365-bote-con-tapa-rectangular-vidrio-plastico-s89269071/" target="_blank" rel="noopener">IKEA 365+ vidrio</a></td><td>Vidrio borosilicato + tapa PP/silicona</td><td>0,6 / 1,0 / 1,2 L</td><td>3,49 / 3,99 / 4,99 €</td><td>Sí, <b>pero IKEA avisa: la tapa hasta 100 °C y sin cerrar del todo</b>, para que salga el vapor</td><td>IKEA — <b>en Castellón solo hay punto de pedidos, no tienda</b>; tienda completa en Alfafar (Valencia)</td></tr>
        <tr><td><a href="https://www.carrefour.es/set-de-3-tapers-san-ignacio-hermeticos-380ml-1l-19l-verde/8435496485802/p" target="_blank" rel="noopener">Set 3 San Ignacio</a></td><td>ABS sin BPA</td><td>0,38 / 1,0 / 1,9 L</td><td>12,90-25,99 € el set</td><td>Sí (la ficha no separa cuerpo y tapa)</td><td>Carrefour online</td></tr>
        <tr><td>Recipiente hermético Bosque Verde</td><td>Plástico</td><td>1,0 L</td><td>3,00 €</td><td><b>NO</b> — la ficha dice que el plástico no es apto para altas temperaturas</td><td>Mercadona</td></tr>
      </tbody>
    </table></div>
    <div class="note warn"><b>Lo que NO puedo decirte:</b> si hoy hay stock en la tienda física de Castellón. No lo he verificado y no me lo voy a inventar. Lo que sí sé:
      <ul style="margin:.4rem 0 0;padding-left:1.1rem">
        <li><b>Family Cash Castellón</b>: no tiene catálogo online con fichas; hay que ir a mirar. Es la tienda donde más probable es encontrar TATAY a buen precio.</li>
        <li><b>Lidl</b>: la categoría de tuppers existe (<a href="https://www.lidl.es/es/tuppers/c6257" target="_blank" rel="noopener">lidl.es</a>) pero no pude abrir las fichas de producto actuales. El set ERNESTO que sale en cachés antiguas es de silicona plegable con válvula: no es lo que buscas.</li>
        <li><b>Bazar Casa, Flying Tiger, Ale-Hop, bazares</b>: sin catálogo fiable con material y aptitudes. Son de ir y leer la caja.</li>
        <li><b>Leroy Merlin y IKEA</b>: no hay tienda en Castellón capital.</li>
      </ul>
      <b>Recomendación práctica:</b> vete a Family Cash con esta medida en la cabeza — <b>1,0-1,2 L, polipropileno, apto congelador y microondas, tapa con clips</b> — y compra 14-16 iguales. Si no hay, TATAY en Alcampo o Carrefour cumple lo mismo.</div>
    <h3>Requisitos: recipiente vs. tapa</h3>
    <ul class="small">
      <li><b>Recipiente:</b> PP (polipropileno) o vidrio borosilicato; apto congelador (que no se agriete a −18 °C) y microondas.</li>
      <li><b>Tapa:</b> es donde falla casi todo. Muchas tapas <b>no</b> son aptas para microondas o exigen abrir una válvula. Regla segura: <b>calienta siempre con la tapa puesta pero sin cerrar del todo</b> — cumple lo que pide IKEA para su gama y de paso deja salir el vapor, que es lo que recomienda la USDA para que caliente uniforme.</li>
      <li>Lavavajillas: comprueba que lo diga también para la tapa; las juntas de silicona sufren.</li>
    </ul>
  </div>

  <div class="card">
    <h2>Envolver burritos y bocatas</h2>
    <div class="scrollx"><table>
      <thead><tr><th>Producto (Mercadona)</th><th>Precio</th><th>Para qué</th></tr></thead>
      <tbody>
        <tr><td>Bolsas zip congelación medianas Bosque Verde (18×18,5 cm), 20 ud</td><td>1,20 €</td><td><b>Relleno de burrito</b>, congelado plano. Es lo mejor de todo el sistema: plano descongela en minutos.</td></tr>
        <tr><td>Bolsas zip congelación grandes Bosque Verde (27×30,8 cm)</td><td>1,25 €</td><td>Bocatas ya envueltos, porciones de fruta para el helado.</td></tr>
        <tr><td>Papel vegetal / de horno Bosque Verde, 36 hojas</td><td>2,00 €</td><td>Envolver cada bocata. Va directo a la air fryer.</td></tr>
        <tr><td>Papel de aluminio Bosque Verde, 30 m</td><td>2,25 €</td><td>Segunda capa del bocata. Fuera los últimos 3 min para que el pan quede crujiente.</td></tr>
        <tr><td>Film transparente Bosque Verde, 80 m</td><td>1,85 €</td><td>General.</td></tr>
      </tbody>
    </table></div>
    <p class="small">Precios de agregadores de Mercadona consultados el 10/09/2026, no de la web oficial (no permite consulta automática). Pueden haber cambiado. <b>Papel encerado tipo americano no lo encontré</b> en Mercadona ni Lidl: no lo doy por existente.</p>
  </div>

  <div class="card">
    <h2>Suplementos</h2>
    <div class="note warn">Precios y composiciones consultados el <b>10/09/2026</b>. HSN, MyProtein y Prozis cambian precios con ofertas constantemente: <b>comprueba el precio final en el carrito</b>. No he comprado nada.</div>

    <h3>Proteína en polvo</h3>
    <div class="scrollx"><table>
      <thead><tr><th>Producto</th><th>Formato</th><th>Precio</th><th>Prot./dosis</th><th>€/kg de proteína real</th><th>Sabores que te valen</th></tr></thead>
      <tbody>
        <tr><td><a href="https://www.hsnstore.com/marcas/sport-series/evowhey-protein" target="_blank" rel="noopener">HSN Evowhey</a> (concentrada 80 %)</td><td>2 kg</td><td>≈41,99 € <span class="tag e">agregador</span></td><td>22-24 g / 30 g</td><td><b>≈27-30 €</b></td><td>Caramelo, Cookies &amp; Cream, Chocolate y Galletas</td></tr>
        <tr><td><a href="https://www.myprotein.es/p/nutricion-deportiva/impact-whey-protein-caramelo-bolsa-2.5-kg/10530984/" target="_blank" rel="noopener">MyProtein Impact Whey</a></td><td>2,5 kg</td><td>79,99 € <span class="tag v">tarifa</span></td><td>20 g / 25 g</td><td>≈40 € (baja a 19-25 € en sus rebajas del 40-70 %)</td><td>Caramelo, Cookies &amp; Cream, Vainilla</td></tr>
        <tr><td>Prozis 100% Real Whey</td><td>1 kg</td><td>≈24,74 € <span class="tag e">revendedor</span></td><td>22,8 g / 30 g</td><td>≈32,5 €</td><td>Galletas y Crema, Café y Caramelo</td></tr>
        <tr><td><a href="https://www.bulk.com/es/products/pura-proteina-de-suero-aislada-al-90/bpb-wpi9-0000" target="_blank" rel="noopener">Bulk Whey Isolate 90</a></td><td>1 kg</td><td>26,99 € <span class="tag v">web oficial</span></td><td>24 g / 30 g</td><td>≈33,7 €</td><td>Chocolate Cookie, Caramelo Salado</td></tr>
      </tbody>
    </table></div>
    <p class="small"><b>Para tus dos usos:</b> en el <b>bol de queso batido</b> cualquiera vale, pero si te molestan los tropezones elige caramelo o vainilla en vez de cookies&amp;cream. En el <b>helado de fruta</b>, la fruta ya endulza: si quieres lo más limpio, la isolada de Bulk (0,4 g de azúcar por dosis). <b>Mejor relación €/proteína real: HSN Evowhey.</b></p>
    <div class="note">Cuando compres, <b>abre la ficha del bote y corrige los valores de «Proteína en polvo»</b> en la biblioteca de recetas: los que hay puestos ahora (390 kcal, 78 g prot./100 g) son de una whey concentrada típica, no de tu bote. Y <b>pesa el cacito</b>: no todos son de 30 g.</div>

    <h3>Creatina</h3>
    <div class="scrollx"><table>
      <thead><tr><th>Producto</th><th>Formato</th><th>Precio</th><th>€/100 g</th></tr></thead>
      <tbody>
        <tr><td><a href="https://www.hsnstore.com/nutricion-deportiva/creatina" target="_blank" rel="noopener">HSN Creatina Excell 100 % Creapure®</a></td><td>500 g</td><td>≈27,98 €</td><td><b>5,60 €</b></td></tr>
        <tr><td>MyProtein Creapure®</td><td>500 g</td><td>≈31,99 € <span class="tag e">agregador</span></td><td>6,40 €</td></tr>
        <tr><td>Prozis Creapure®</td><td>300 g</td><td>34,99 € PVP</td><td>11,66 €</td></tr>
      </tbody>
    </table></div>
    <div class="note ok"><b>Pauta, con la fuente delante.</b> El <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z" target="_blank" rel="noopener">position stand de la ISSN (Kreider et al., 2017)</a> establece <b>3-5 g/día de monohidrato</b> como mantenimiento, e indica que <b>deportistas con más masa corporal pueden necesitar 5-10 g/día</b>. La fórmula por peso que da (0,03 g/kg/día) sale en <b>3,4 g/día</b> para tus 113 kg; por comodidad de cuchara y porque estás en la parte alta de masa, <b>5 g/día</b> es la dosis razonable.
    <ul style="margin:.4rem 0 0;padding-left:1.1rem">
      <li><b>Fase de carga:</b> no hace falta. La que describe el documento (0,3 g/kg/día) serían ~34 g diarios en tu caso, repartidos en 4 tomas: molestias digestivas casi garantizadas a cambio de llegar antes a lo mismo. Empieza directo con 5 g/día.</li>
      <li><b>Cuándo:</b> el mismo documento no encuentra que la hora sea determinante. Lo que importa es tomarla <b>todos los días</b>, entrenes o no.</li>
      <li><b>Con qué:</b> el documento sí recoge que tomarla con hidratos, o con hidratos + proteína, mejora la retención muscular. Encaja perfecto en tu bol de queso batido o en el helado.</li>
      <li><b>Riñón:</b> el ISSN concluye que es segura y bien tolerada en personas sanas, incluso a dosis altas y durante años. Esto no sustituye una valoración médica si hubiera antecedentes renales — y esto se lo puedes preguntar a tu padre en casa mejor que a mí.</li>
    </ul></div>

    <h3>Preentreno</h3>
    <p class="small">Tu contexto: solo lo tomarías si entrenas <b>antes de comer</b> (mediodía), y tu cafeína habitual es como mucho <b>1 Monster ≈ 160 mg</b>, a veces nada. Eso es tolerancia baja-media.</p>
    <div class="scrollx"><table>
      <thead><tr><th>Producto</th><th>Cafeína/dosis</th><th>Formato y precio</th><th>Veredicto</th></tr></thead>
      <tbody>
        <tr><td>Prozis Big Shot (polvo, 46 dosis)</td><td><b>160 mg</b></td><td>322 g · ≈24,99 € <span class="tag e">revendedor</span></td><td><b>El que encaja.</b> Misma cafeína que tu Monster: territorio conocido.</td></tr>
        <tr><td>MyProtein THE Pre-Workout</td><td>200 mg</td><td>≈42,99 € (baja mucho en ofertas)</td><td>Justo en el límite de la EFSA para dosis única. Si lo coges, empieza por <b>media dosis</b>.</td></tr>
        <tr><td>HSN Evordx 2.0</td><td><b>300 mg</b></td><td>150 g · ≈18,80 €</td><td><b>Demasiado.</b> Casi el doble de tu Monster y por encima del límite EFSA de dosis única. Descartado.</td></tr>
        <tr><td>HSN Evostamine <b>(sin estimulantes)</b></td><td>0 mg</td><td>500 g / 25 dosis · precio no verificado</td><td>La opción para los días que entrenas antes de cenar.</td></tr>
      </tbody>
    </table></div>
    <div class="note"><b>Qué hace y qué no el «sin estimulantes».</b> Va de citrulina y beta-alanina (a veces creatina y nitratos). <b>Sí</b>: más flujo sanguíneo, algo menos de fatiga percibida, y la beta-alanina retrasa la fatiga en esfuerzos duros de 1-4 minutos — que es literalmente un round de MMA. <b>No</b>: no da nada de energía ni de alerta mental, porque eso lo daba la cafeína. Si esperas el subidón, te va a decepcionar; si esperas aguantar mejor el último asalto, tiene sentido.
    <br><br><b>Referencia oficial:</b> la <a href="https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2015.4102" target="_blank" rel="noopener">EFSA (2015)</a> considera sin problema dosis únicas de hasta <b>200 mg</b> y hasta <b>400 mg/día</b> en adultos sanos, y señala que a partir de ~100 mg ya puede afectar al sueño en gente sensible. Como solo lo tomarías al mediodía, no interfiere con dormir. Para entrenar antes de cenar: el stim-free, o nada.</div>

    <h3>Carrito mínimo sensato</h3>
    <div class="scrollx"><table><tbody>
      <tr><td>HSN Evowhey 2 kg (caramelo o cookies&amp;cream)</td><td class="num">≈42 €</td></tr>
      <tr><td>HSN Creatina Creapure® 500 g</td><td class="num">≈28 €</td></tr>
      <tr><td>Prozis Big Shot polvo (160 mg cafeína)</td><td class="num">≈25 €</td></tr>
      <tr><td><b>Total suplementos</b></td><td class="num"><b>≈95 €</b></td></tr>
      <tr><td>14-16 táperes 1-1,2 L + 6 pequeños (TATAY o equivalente, ~3,7-4,2 €/ud)</td><td class="num">≈60-85 €</td></tr>
    </tbody></table></div>
    <p class="small">Se te va del presupuesto de 90-150 € si compras todo de golpe. Orden sensato: <b>primero táperes y creatina</b> (creatina es barata y es el suplemento con más respaldo), <b>proteína después</b> (o esperando una oferta de MyProtein, que suele caer −40/−70 %), y el <b>preentreno el último</b>: es el que menos hace.</p>
  </div>

  <div class="card">
    <h2>Equipamiento que ya tienes y cómo se reparte</h2>
    <ul class="small">
      <li><b>Horno</b> — pollo entero y el pastel de carne. Es lo que trabaja solo mientras tú haces otra cosa.</li>
      <li><b>Air fryer</b> — patata en dados (mejor que hervida para congelar) y recalentar bocatas.</li>
      <li><b>Fogones</b> — arroz, pasta y las dos carnes picadas.</li>
      <li><b>Batidora</b> — solo el helado proteico. Sin ella hay alternativa (mirar la receta).</li>
      <li><b>Microondas</b> — entre semana, en casa y en la facultad. Las tres recetas principales están diseñadas para esto.</li>
      <li><b>Congelador con sitio</b> — es lo que hace que este sistema funcione: cocinas una vez y comes tres semanas.</li>
      <li><b>Lo único que te falta</b>: una <b>báscula de cocina</b> (imprescindible, todo esto va en gramos), un <b>termómetro de sonda</b> (5-12 €, para saber si el pollo está a 74 °C sin abrirlo a cuchilladas), <b>cinta de papel y rotulador</b> para etiquetar, y una <b>bolsa isotérmica con 2 acumuladores</b> para la facultad (la USDA recomienda expresamente dos fuentes de frío, no una).</li>
    </ul>
  </div>`;
}
