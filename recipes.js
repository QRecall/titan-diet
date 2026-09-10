"use strict";
/* =========================================================================
   2. RECETAS
   ========================================================================= */
const RECIPES = [
{
  id:"pollo_arroz", n:"Pollo asado con arroz y verduras", tipo:"principal", tags:["principal","micro","congela"],
  servings:4, minutes:95,
  cookedWeight:1780, cookedWeightQ:"e",
  cookedNote:"1.780 g es una ESTIMACIÓN (pollo pierde ~25 % al asarse, el arroz multiplica ×2,8 su peso seco). Pesa el bol lleno el domingo y escribe el número real: es lo que hace que registrar por gramos sea exacto.",
  ing:[
    {f:"pollo_carne", g:900, note:"1 pollo entero de ~1,9 kg da aproximadamente esta carne limpia"},
    {f:"arroz", g:300},
    {f:"pimiento", g:200},
    {f:"cebolla", g:150},
    {f:"aove", g:30},
    {f:"especias", g:8, note:"pimentón dulce, ajo en polvo, orégano, sal, pimienta"}
  ],
  utensilios:"Horno + bandeja, cazo o arrocera, tabla y cuchillo, báscula.",
  pasos:[
    "Saca el pollo de la nevera 20 min antes. Sécalo, sálalo por fuera y por dentro y úntalo con la mitad del aceite y las especias.",
    "Horno 190 °C, calor arriba y abajo. Pollo entero sobre rejilla con bandeja debajo: ~75-85 min (unos 45 min por kg). Está hecho cuando el muslo marca 74 °C en el centro con termómetro.",
    "Mientras se asa: pica pimiento y cebolla, saltéalos con el resto del aceite 8-10 min a fuego medio-alto hasta que doren un poco.",
    "Cuece el arroz en el mismo rato: 300 g con 600 ml de agua y sal, 16-18 min tapado; déjalo un punto FIRME, porque terminará de hacerse al recalentar.",
    "Deja reposar el pollo 15 min. Deshuésalo: retira piel y huesos, desmenuza o corta la carne en trozos gordos. Pesa la carne limpia y apúntalo (te dirá tu rendimiento real).",
    "Mezcla carne + arroz + verduras en un bol grande. Pesa el total y escríbelo abajo en «peso cocinado real».",
    "Reparte en 4 táperes. IMPORTANTE con el arroz: enfría rápido (recipientes destapados sobre la encimera con el táper en una bandeja con agua fría) y mete al frío ANTES de 1 hora."
  ],
  conservacion:{
    nevera:"El arroz cocido es el que manda: la FSA recomienda <b>máximo 1 día</b> en nevera antes de recalentarlo. Así que de esta receta deja como mucho la del lunes en la nevera y congela el resto el mismo domingo.",
    congelador:"Congela 3 de las 4 raciones el domingo, dentro de la primera hora tras cocinar (FSA). Calidad buena 2-6 meses (USDA para carne cocinada).",
    descongelar:"En la nevera de un día para otro, o directo del congelador al microondas: la USDA confirma que es seguro recalentar sobras congeladas sin descongelar antes.",
    recalentar:"Microondas, tapado, 4-6 min desde congelado o 2-3 min desde nevera. Remueve a mitad, deja reposar 1 min y comprueba que está bien caliente por dentro (objetivo 74 °C). El arroz <b>solo se recalienta una vez</b> (FSA).",
    universidad:"Sí. Es la receta que mejor viaja. Bolsa isotérmica + 2 acumuladores de frío (recomendación USDA), y sin frío no más de 2 h."
  },
  variantes:[
    {n:"Al pimentón y limón", d:"Pimentón dulce + ajo + ralladura y zumo de medio limón sobre el pollo. Cambio nutricional: prácticamente nulo."},
    {n:"Estilo teriyaki casero", d:"2 cucharadas de salsa de soja + 1 de miel al saltear las verduras. Suma ~15-20 g de hidratos al lote y bastante sal; ajústalo en MacroFactor como ingrediente extra."},
    {n:"Más verdura, menos arroz", d:"Baja el arroz a 200 g y sube pimiento a 350 g: el lote pierde ~344 kcal y ~75 g de hidratos, y gana ~3 g de fibra. Cambia los gramos arriba y lo recalcula solo."}
  ],
  micro:"ok"
},
{
  id:"pastel_carne", n:"Pastel de carne picada, patata y huevo", tipo:"principal", tags:["principal","micro","huevo"],
  servings:4, minutes:70,
  cookedWeight:2000, cookedWeightQ:"e",
  cookedNote:"2.000 g estimados (la carne pierde ~20-25 %, la patata asada algo de agua). Pésalo el domingo.",
  ing:[
    {f:"carne_picada", g:800},
    {f:"patata", g:900, note:"en dados de 1,5 cm"},
    {f:"huevo", g:378, note:"6 huevos L"},
    {f:"cebolla", g:150},
    {f:"pimiento", g:150},
    {f:"tomate_trit", g:100},
    {f:"aove", g:20},
    {f:"especias", g:8, note:"comino, pimentón, ajo, sal, pimienta"}
  ],
  utensilios:"Air fryer (o horno), sartén grande, fuente de horno de ~30×20 cm, báscula.",
  pasos:[
    "Patata en dados de 1,5 cm con la mitad del aceite y sal. Air fryer 190 °C, 18-22 min agitando a mitad (o horno 200 °C, 30-35 min). Que queden HECHAS y doradas por fuera, no blandas.",
    "Mientras: sofríe cebolla y pimiento picados 8 min. Añade la carne picada, desmenúzala y hazla hasta que suelte y evapore su jugo, 8-10 min. Añade el tomate triturado y las especias, 3 min más. Prueba de sal.",
    "Mezcla carne + patata en la fuente de horno y reparte bien.",
    "Bate los 6 huevos con una pizca de sal y viértelos por encima, moviendo con un tenedor para que bajen entre los huecos.",
    "Horno 180 °C, 20-25 min, hasta que el huevo esté cuajado en el centro (que no tiemble). Deja templar 15 min: se corta mucho mejor.",
    "Corta en 4 porciones, pésalas y a los táperes. Enfría y refrigera antes de 2 h (regla USDA)."
  ],
  conservacion:{
    nevera:"3-4 días (USDA, sobras de carne cocinada). Es la receta que mejor aguanta en nevera de las tres.",
    congelador:"Sí. La USDA da 2-3 meses de calidad para «cazuelas con huevo», que es exactamente este formato: el huevo cuajado dentro de una masa se comporta mucho mejor que un huevo duro suelto (ese sí, la FDA dice directamente «no lo congeles»). Congélalo ya cortado en porciones y envuelto.",
    descongelar:"Nevera de un día para otro (mejor textura) o directo al microondas.",
    recalentar:"Microondas tapado, 3-4 min desde nevera, 6-8 min desde congelado, a media potencia los 2 primeros minutos para que el huevo no se ponga gomoso. Objetivo 74 °C en el centro.",
    universidad:"Sí, y es la mejor de las tres para llevar: no lleva arroz, así que no tiene la limitación de 1 día."
  },
  variantes:[
    {n:"Más magro", d:"Sustituye 300 g de la carne picada de vacuno por carne picada de pollo/pavo: el lote baja del orden de 250-300 kcal y ~25 g de grasa. Los valores exactos dependen de la bandeja que compres: mete su etiqueta como alimento nuevo."},
    {n:"Menos grasa por el huevo", d:"4 huevos enteros + 200 g de claras: el lote pierde ~22 g de grasa y ~180 kcal, y mantiene casi la misma proteína."},
    {n:"Picante estilo chili", d:"Comino + pimentón picante + una cucharada de salsa picante en el sofrito. Cambio nutricional despreciable."}
  ],
  micro:"ok",
  aviso:"El punto delicado de esta receta era el huevo y la patata. Solución: <b>nada de huevo duro ni patata cocida</b>. El huevo va cuajado dentro (formato «cazuela con huevo», que la USDA sí contempla congelado) y la patata va asada en dados, no hervida — la hervida suelta agua y queda arenosa. Aviso honesto: <b>no he encontrado ninguna fuente oficial (AESAN, FSA, USDA, FDA) que trate la congelación de patata cocida</b>. Si al probar la primera ración congelada la textura no te convence, deja esta receta solo en nevera (3-4 días) y congela las otras dos."
},
{
  id:"bolonesa", n:"Pasta boloñesa con queso", tipo:"principal", tags:["principal","micro","congela"],
  servings:4, minutes:50,
  cookedWeight:2045, cookedWeightQ:"e",
  cookedNote:"2.045 g estimados (pasta ×2,5 desde seca, carne −22 %). Pésalo.",
  ing:[
    {f:"pasta", g:320},
    {f:"carne_picada", g:700},
    {f:"tomate_trit", g:500},
    {f:"cebolla", g:150},
    {f:"pimiento", g:100},
    {f:"q_cheddar", g:100, note:"o havarti light si prefieres menos grasa"},
    {f:"aove", g:20},
    {f:"especias", g:8, note:"orégano, ajo, laurel, sal, pimienta"}
  ],
  utensilios:"Olla grande, sartén honda o cazuela, colador, báscula.",
  pasos:[
    "Sofríe cebolla y pimiento muy picados 8-10 min con el aceite.",
    "Sube el fuego, añade la carne, desmenúzala y dórala 8 min. Añade tomate triturado, orégano, laurel, sal y pimienta y deja 15-20 min a fuego suave hasta que espese.",
    "Cuece la pasta 2 MINUTOS MENOS de lo que diga el paquete. Este es el truco: la pasta pasada de punto se deshace al recalentar. Escúrrela y pásala por agua fría 10 segundos para cortar la cocción.",
    "Mezcla pasta + salsa (no las guardes separadas: así la pasta absorbe salsa y no se seca). Añade un chorrito del agua de cocción si ves la mezcla seca.",
    "Reparte en 4 táperes, pon el queso por encima de cada uno (25 g por ración) y ciérralos ya, para que el queso funda al recalentar.",
    "Enfría y refrigera/congela antes de 2 h."
  ],
  conservacion:{
    nevera:"3-4 días (regla general de sobras, USDA). Nota honesta: la USDA no da una línea específica para «pasta cocida», entra en la categoría general de sobras.",
    congelador:"Sí, muy bien: es una salsa con grasa que protege la pasta. Calidad 2-3 meses (USDA para sopas/guisos).",
    descongelar:"Nevera o directo al microondas desde congelado.",
    recalentar:"Microondas tapado, 3-4 min desde nevera, 6-8 desde congelado. Añade una cucharada de agua antes de calentar si la ves seca, y remueve a mitad.",
    universidad:"Sí. Va bien en mochila con bolsa isotérmica."
  },
  variantes:[
    {n:"Boloñesa picante (arrabbiata)", d:"Guindilla o una cucharada de salsa picante en la salsa. Sin cambio nutricional relevante."},
    {n:"Con más verdura escondida", d:"200 g de pimiento y 150 g de cebolla más finos, casi disueltos en la salsa: +2 g de fibra por lote y ~45 kcal, y llena más."},
    {n:"Menos grasa", d:"Cambia el cheddar (32 g grasa/100 g) por havarti light (17 g): el lote pierde ~125 kcal y 15 g de grasa manteniendo la proteína."}
  ],
  micro:"ok"
},
{
  id:"burritos", n:"Burritos frescos (mitad pollo, mitad vacuno)", tipo:"antojo", tags:["antojo","fresco","congela relleno"],
  servings:8, servingsLabel:"burritos", minutes:60,
  cookedWeight:null, cookedWeightQ:"p",
  cookedNote:"Aquí el peso final que interesa es el del RELLENO cocinado, no el del burrito montado (porque la parte fresca se añade al momento y varía). Pesa el relleno y divídelo entre 8.",
  ing:[
    {f:"pollo_carne", g:400, note:"para 4 unidades — en tiras"},
    {f:"lomo_vacuno", g:400, note:"para 4 unidades — en tiras finas"},
    {f:"arroz", g:100, note:"OPCIONAL y ya reducido: 25 g secos por burrito. Ponlo a 0 si lo quieres aún más fresco"},
    {f:"maiz", g:150, note:"escurrido"},
    {f:"cebolla_morada", g:100, note:"salteada, va en el relleno"},
    {f:"pimiento", g:150},
    {f:"aove", g:20},
    {f:"tortilla", g:288, note:"8 tortillas de trigo"},
    {f:"especias", g:10, note:"comino, pimentón, ajo, orégano, chile en polvo"},
    {f:"lechuga", g:320, note:"FRESCO — 40 g por burrito, se añade al servir"},
    {f:"tomate", g:480, note:"FRESCO — 60 g por burrito, se añade al servir"},
    {f:"cebolla_morada", g:120, note:"FRESCO — 15 g por burrito, cruda al servir", key:"cm_fresca"},
    {f:"cilantro", g:40, note:"FRESCO — al servir"},
    {f:"lima", g:140, note:"FRESCO — 2 limas, al servir"},
    {f:"picante", g:80, note:"FRESCO — 10 g por burrito, al servir"}
  ],
  utensilios:"Sartén grande o plancha, cazo para el arroz, bolsas zip de congelación, báscula.",
  pasos:[
    "Marina 30 min: pollo por un lado y lomo por otro, cada uno con la mitad de las especias, un chorro de aceite y zumo de media lima.",
    "Cuece el arroz (si lo pones) y mézclalo con cilantro picado y zumo de lima. Déjalo firme.",
    "Saltea a fuego fuerte, por separado, pollo y lomo, 4-6 min cada uno. El lomo, muy poco: en tiras finas se pasa enseguida.",
    "Saltea pimiento y los 100 g de cebolla morada 6-8 min.",
    "Monta DOS relleros distintos (pollo / vacuno), cada uno con su mitad de arroz, maíz y verdura salteada. Pesa cada uno y divídelo entre 4.",
    "Enfría rápido y congela el relleno en porciones individuales, en bolsa zip aplastada (congela plana = descongela en minutos). Etiqueta: contenido + fecha.",
    "AL SERVIR (en casa, sin cocinar nada): saca una bolsa de relleno, microondas 2-3 min hasta que esté bien caliente; calienta la tortilla 20 s; monta con lechuga, tomate, cebolla morada cruda, cilantro, lima y picante. Enrolla y come."
  ],
  conservacion:{
    nevera:"Relleno cocinado: 3-4 días (USDA). Si lleva arroz, la FSA aprieta a 1 día en nevera → por eso el plan por defecto es congelar el relleno el mismo domingo.",
    congelador:"<b>Solo el relleno cocinado, nunca el burrito montado con ensalada dentro.</b> Congelado plano en bolsa zip, 2-3 meses. La lechuga no se congela bien (lo dice expresamente la USDA: los alimentos muy acuosos pierden textura), y el tomate cortado tampoco.",
    descongelar:"Bolsa plana: 10-15 min a temperatura ambiente o directa al microondas.",
    recalentar:"Microondas 2-3 min el relleno. La tortilla, 20-30 s aparte o 10 s en la sartén.",
    universidad:"No hace falta: dijiste que estos los comes solo en casa, y es lo correcto — montar el fresco necesita nevera y tabla."
  },
  fresh:{
    titulo:"Qué se congela y qué NO",
    frio:["Relleno cocinado (carne + arroz + maíz + verdura salteada) → CONGELADOR en bolsas planas individuales.","Tortillas de trigo → despensa, en su bolsa cerrada."],
    fresco:["Lechuga lavada y cortada → nevera, tarrina hermética con papel de cocina dentro. La FDA marca ≤5 °C y máximo 7 días desde que se corta.","Tomate → entero en la nevera y se corta al momento. La FDA da 4 h como máximo a temperatura ambiente para tomate ya cortado: no lo dejes preparado en la mochila ni en la encimera.","Cebolla morada → se corta al momento (30 segundos). Si la cortas con antelación, tarrina cerrada y máximo 2-3 días.","Salsa picante y lima → despensa/nevera, sin problema."],
    porque:"Un burrito montado y congelado con ensalada dentro sale aguado: al descongelar, el agua de la lechuga y el tomate empapa la tortilla. Y en nevera durante días mezclas crudo y cocinado en un envase que luego calientas por fuera. Por eso: la parte caliente se congela sola y lo fresco entra al final."
  },
  variantes:[
    {n:"Sin arroz (más fresco)", d:"Pon el arroz a 0: cada burrito pierde ~86 kcal y ~19 g de hidratos, y gana protagonismo la lechuga y el tomate, que es lo que buscabas."},
    {n:"Pico de gallo de verdad", d:"Tomate + cebolla morada + cilantro + lima + sal, picado al momento. Hazlo en el plato, no en un táper para toda la semana."},
    {n:"Crema fresca ligera", d:"2 cucharadas de queso batido 0 % + lima + picante como salsa: ~15 kcal y 2,5 g de proteína, frente a los ~50 kcal de dos cucharadas de salsa de yogur."}
  ],
  micro:"ok",
  aviso:"Sobre el vídeo de referencia: es una <b>adaptación</b>, no una transcripción. No conozco las cantidades ni la salsa exactas de ese burrito. Y sobre la bandeja de «LOMO» de la foto: no tenía etiqueta nutricional legible, así que uso la ficha del lomo de vacuno de Mercadona (145 kcal, 23 g proteína) — comprueba la etiqueta de tu bandeja y corrígela si no coincide."
},
{
  id:"bocata_pollo", n:"Bocata de pollo especiado con queso y salsa cremosa", tipo:"antojo", tags:["antojo","air fryer"],
  servings:6, servingsLabel:"bocatas", minutes:45,
  cookedWeight:null, cookedWeightQ:"p",
  cookedNote:"Aquí lo práctico es registrar por unidades, no por gramos: cada bocata es una unidad casi idéntica. Pesa uno montado y ponlo como peso de porción en MacroFactor.",
  ing:[
    {f:"pan_chapata", g:426, note:"6 panecillos"},
    {f:"pollo_carne", g:720, note:"120 g crudos por bocata"},
    {f:"q_havarti", g:120, note:"1 loncha por bocata"},
    {f:"cebolla_morada", g:120},
    {f:"q_batido_0", g:150, note:"base de la salsa cremosa"},
    {f:"salsa_yogur", g:60, note:"para dar untuosidad; puedes bajarlo"},
    {f:"picante", g:20},
    {f:"lima", g:35},
    {f:"aove", g:15},
    {f:"especias", g:10, note:"pimentón ahumado, comino, ajo, orégano, cayena"}
  ],
  utensilios:"Air fryer, sartén o plancha, papel de horno, papel de aluminio.",
  pasos:[
    "Corta el pollo en filetes finos y marínalo 30 min con aceite, especias y zumo de lima.",
    "Plancha fuerte 3-4 min por lado. Deja templar y córtalo en tiras.",
    "Salsa cremosa: 150 g de queso batido 0 % + 60 g de salsa de yogur + 20 g de picante + zumo de lima + sal. Bátelo o mézclalo bien. Guárdala en un bote aparte.",
    "Monta cada bocata: pan abierto, pollo, loncha de queso, cebolla morada en juliana. <b>La salsa NO va dentro todavía.</b>",
    "Envuelve cada uno individualmente en papel de horno y luego en aluminio. Etiqueta con fecha.",
    "AL COMER: air fryer 180 °C, 6-8 min desde nevera (12-14 desde congelado), con el papel de horno puesto y el aluminio quitado los últimos 3 min para que el pan quede crujiente. Abre, echa la salsa fría y cierra."
  ],
  conservacion:{
    nevera:"Montados sin salsa: 3-4 días (USDA para pollo cocinado). La salsa, en su bote, lo mismo.",
    congelador:"Se pueden congelar montados <b>sin salsa y sin cebolla cruda</b> (añádelas al servir): 1-2 meses de calidad razonable. Con salsa dentro se separa y empapa el pan.",
    descongelar:"Nevera de un día para otro; luego air fryer.",
    recalentar:"Air fryer 180 °C 6-8 min (nevera) o 12-14 (congelado). En microondas el pan queda chicloso: aquí la air fryer no es opcional, y ya dijiste que la aceptas.",
    universidad:"No: en la facultad solo tienes microondas y este es el único plato que la necesita de verdad."
  },
  variantes:[
    {n:"Salsa más proteica", d:"Quita la salsa de yogur y usa 200 g de queso batido 0 % + picante + lima + un poco de mostaza: el lote pierde ~150 kcal y 14 g de grasa."},
    {n:"Estilo buffalo", d:"Más salsa picante y un punto de vinagre en la marinada. Sin cambio nutricional relevante."},
    {n:"Con las sobras del pollo asado", d:"Si te sobra pollo de la receta 1, úsalo aquí: mismo cálculo, cero cocinado extra."}
  ],
  micro:"no",
  aviso:"También es una <b>adaptación</b> del vídeo, no su receta. No conozco los ingredientes ni las cantidades de la salsa original."
},
{
  id:"bol_desayuno", n:"Bol de queso batido con chía y fruta", tipo:"desayuno", tags:["desayuno","postre","sin cocinar"],
  useRaw:true, servings:1, minutes:5,
  cookedWeight:null,
  cookedNote:"No se cocina: el peso final es la suma de los ingredientes.",
  ing:[
    {f:"q_batido_prot", g:250},
    {f:"chia", g:15, note:"aporta 4,5 g de fibra. No está fijado en 25 g: 15 g es un punto de partida cómodo"},
    {f:"fruta_fp", g:120, note:"descongelada la noche anterior en la nevera"},
    {f:"proteina", g:15, note:"OPCIONAL — medio cacito"},
    {f:"avena", g:0, note:"OPCIONAL — pon 30 g si quieres que llene más"}
  ],
  utensilios:"Bol, cuchara, báscula. Nada más.",
  pasos:[
    "La noche antes: mezcla el queso batido con la chía y déjalo en la nevera. La chía se hidrata y el bol queda cremoso en vez de arenoso.",
    "La noche antes también: saca la fruta congelada que vayas a usar a un bote en la nevera.",
    "Por la mañana: añade la fruta, la proteína si la pones y remueve.",
    "Si te has olvidado de la noche anterior: la chía seca por encima también vale, solo que cruje."
  ],
  conservacion:{
    nevera:"Preparado con la chía hidratada aguanta 2-3 días perfectamente en un bote cerrado. Puedes dejar 3 botes hechos el domingo.",
    congelador:"No tiene sentido congelarlo.",
    descongelar:"—",
    recalentar:"—",
    universidad:"Sí, en un bote cerrado con bolsa isotérmica. Es lácteo: no lo dejes horas a temperatura ambiente."
  },
  variantes:[
    {n:"Versión más ligera", d:"Queso batido 0 % en vez de +proteínas: −15 kcal y −5 g de proteína por bol."},
    {n:"Más fibra", d:"Sube la chía a 20-25 g: cada 5 g suman 1,5 g de fibra y ~23 kcal. Recuerda: la referencia son ~25 g de fibra al día sumando TODO, no gramos de chía."}
  ],
  micro:"n/a"
},
{
  id:"helado_prot", n:"Helado proteico de fruta congelada", tipo:"desayuno", tags:["desayuno","postre","merienda","sin cocinar"],
  useRaw:true, servings:1, minutes:4,
  cookedWeight:null,
  cookedNote:"No se cocina. El peso final es la suma de ingredientes (menos lo que se quede en el vaso de la batidora).",
  ing:[
    {f:"fruta_fp", g:250},
    {f:"fruta_trop", g:150},
    {f:"q_batido_prot", g:150},
    {f:"proteina", g:30, note:"un cacito ≈ 30 g, pero PÉSALO: los cacitos no son todos iguales"},
    {f:"chia", g:10},
    {f:"leche", g:60, note:"empieza con poca; si no gira la batidora, añade de 20 en 20 g"}
  ],
  utensilios:"Batidora de vaso o de brazo potente, espátula, báscula.",
  pasos:[
    "El domingo: pesa las bolsas de porción — fruta congelada + chía + proteína en polvo, cada porción en su bolsa zip, al congelador. Así por la mañana no pesas nada.",
    "Al momento: vuelca la bolsa en el vaso, añade el queso batido y la leche y bate. Empieza con poca leche y para a bajar la fruta con la espátula cada 15 segundos.",
    "Si la batidora sufre, deja la bolsa 5 minutos fuera del congelador antes de batir.",
    "SIN BATIDORA: deja la fruta descongelándose en la nevera toda la noche, chafa con un tenedor y remueve con el queso batido y la proteína. Queda tipo yogur helado espeso, no tipo helado — pero sale."
  ],
  conservacion:{
    nevera:"Se come al momento. Si lo dejas hecho se derrite y se separa.",
    congelador:"Lo que se congela son las BOLSAS DE PORCIÓN (fruta + chía + proteína), no el helado batido. Duran meses.",
    descongelar:"—",
    recalentar:"—",
    universidad:"No."
  },
  variantes:[
    {n:"Porción media (postre o merienda)", d:"La mitad de todo: ~245 kcal y ~20 g de proteína. Sigue siendo UNA entrada en MacroFactor: registras 0,5 raciones, no dos comidas."},
    {n:"Con avena (más saciante)", d:"Añade 40-55 g de copos: +150-200 kcal y +4-5 g de fibra. Es lo que hacía tu receta antigua."},
    {n:"Sin proteína en polvo", d:"Sube el queso batido a 250 g: −80 kcal y −13 g de proteína aproximadamente."}
  ],
  micro:"n/a",
  aviso:"Tu receta antigua anunciaba 581 kcal y 39 g de proteína con 225 g de fresa-plátano, 195 g de tropical, 55 g de avena, un cacito y 65 g de leche. Con los datos de etiqueta que uso aquí, esa combinación sale en torno a <b>585 kcal y ~38 g de proteína</b>: las cifras que tenías eran plausibles. Aun así no las doy por verificadas — dependen del bote de proteína concreto y de que el cacito pesara 30 g."
}
];
