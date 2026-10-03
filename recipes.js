"use strict";
/* =========================================================================
   2. RECETAS
   ========================================================================= */
const RECIPES = [
{
  id:"pollo_arroz", rev:3, short:"Pollo con arroz", n:"Pollo asado con arroz, pimiento rojo y cebolla", tipo:"principal", tags:["principal","micro","congela"],
  servings:4, minutes:90,
  cookedWeight:3000, cookedWeightQ:"e",
  cookedNote:"3.000 g es una ESTIMACIÓN (pollo −25 % al asarse, arroz ×2,8 su peso seco, pimiento y cebolla −35 % al saltearlos). Pesa el bol lleno el domingo y escribe el número real: es lo que hace que registrar por gramos sea exacto.",
  ing:[
    {f:"pollo_carne", g:900, note:"1 pollo entero de ~1,9 kg da aproximadamente esta carne limpia, cruda y sin piel"},
    {f:"pechuga", g:300, note:"extra para llegar a ~1000 kcal y ~70 g de proteína por ración"},
    {f:"arroz", g:600},
    {f:"pimiento", g:450, note:"pimiento ROJO, en tiras; ~110 g por ración, sube la fibra"},
    {f:"cebolla", g:300, note:"en juliana"},
    {f:"aove", g:20, note:"OPCIONAL y EN CRUDO: un chorrito (5 g) por ración al montar. Es la receta con menos grasa y el AOVE en crudo es la grasa que recomiendan las guías; si no lo quieres, pon 0"},
    {f:"especias", g:8, note:"pimentón dulce, ajo en polvo, orégano, sal, pimienta"}
  ],
  utensilios:"Horno + bandeja, tijeras de cocina (para abrir el pollo), olla grande, colador, sartén antiadherente, termómetro de sonda, báscula.",
  pasos:[
    "Abre el pollo en mariposa: con tijeras, corta a lo largo de los dos lados del espinazo, quítalo y aplasta el pollo con la palma sobre la bandeja, piel arriba. Así se asa en la mitad de tiempo y de forma pareja. Sécalo, sálalo y ponle las especias. Sin aceite: la piel suelta su propia grasa.",
    "Horno 200 °C, calor arriba y abajo: 45-55 min. Está hecho cuando la parte más gruesa (muslo y pechuga) marca 74 °C con el termómetro. Los 300 g de pechuga extra van en la misma bandeja los últimos 20-25 min, hasta 74 °C.",
    "Mientras se asa: pimiento rojo en tiras y cebolla en juliana en la sartén antiadherente grande SIN aceite (si no caben, en dos tandas), 12-15 min a fuego medio con 2-3 cucharadas de agua si se pegan, hasta que estén tiernos y algo dorados.",
    "Arroz como si fuera pasta: olla grande con mucha agua hirviendo y sal, 600 g de arroz, 15-16 min. Escúrrelo: así queda suelto y no se pega en tanda grande.",
    "EL ARROZ TIENE RELOJ: extiéndelo en una bandeja o fuente amplia y métela en la nevera nada más escurrirlo. La FSA pide enfriarlo en menos de 1 hora.",
    "Cuando salga el pollo, 10 min de reposo. Quita piel y huesos y corta la carne (y la pechuga) en trozos gordos. Si pesas la carne ya asada, pesará un ~25-35 % menos que en crudo: es normal, no cambies los 900 g de la receta por ese número.",
    "Monta los táperes con el arroz ya frío + verduras + pollo templado y, si quieres, el chorrito de AOVE en crudo por encima (5 g por táper). Pesa el total y escríbelo abajo en «peso cocinado real».",
    "Tapa y al frío enseguida: como mucho 1 ración a la nevera (para el día siguiente) y el resto al congelador el mismo domingo."
  ],
  conservacion:{
    nevera:"El arroz es el que manda: la FSA dice <b>no más de 1 día</b> en nevera antes de recalentarlo. Así que deja como mucho la ración del lunes en la nevera y congela el resto el mismo domingo.",
    congelador:"Congela las demás el domingo en cuanto estén frías (la FSA dice enfriar en 1 h y congelar lo antes posible). Calidad buena unos 2-4 meses (FoodSafety.gov/USDA: es calidad, no seguridad).",
    descongelar:"Lo mejor: pásalo del congelador a la nevera la noche antes. La USDA permite recalentar sin descongelar, pero la FSA prefiere descongelar del todo antes; con un táper grande, descongelado se calienta mucho más parejo.",
    recalentar:"Descongelado: microondas tapado 3-4 min, removiendo a mitad. Desde congelado: potencia media 8-10 min, removiendo cada 3 min. En los dos casos, reposo 1 min y que quede muy caliente en el centro (74 °C; con el termómetro, mira 2-3 puntos). El arroz <b>solo se recalienta una vez</b> (FSA).",
    universidad:"Sí. Bolsa isotérmica + 2 acumuladores de frío (USDA), y sin frío no más de 2 h. Llévalo descongelado de la nevera, no congelado: en el microondas de la facultad no tendrás 10 minutos."
  },
  alergenos:"Sin alérgenos principales (revisa la etiqueta de las especias).",
  variantes:[
    {n:"Al pimentón y limón", d:"Pimentón dulce + ajo + ralladura y zumo de medio limón sobre el pollo. Cambio nutricional: prácticamente nulo."},
    {n:"Estilo teriyaki casero", d:"2 cucharadas de salsa de soja + 1 de miel al saltear las verduras. Suma ~15-20 g de hidratos al lote y bastante sal (y gluten, si la soja lo lleva); ajústalo en MacroFactor como ingrediente extra."},
    {n:"Más verdura, menos arroz", d:"Baja el arroz a 500 g y sube el pimiento a 350 g: el lote pierde ~305 kcal y ~66 g de hidratos, y gana ~2 g de fibra. Cambia los gramos arriba y lo recalcula solo."},
    {n:"Con contramuslo", d:"Cambia la pechuga extra por contramuslo deshuesado sin piel: más jugoso, algo más de grasa. Mete su etiqueta como alimento nuevo si quieres afinarlo."}
  ],
  micro:"ok"
},
{
  id:"pastel_carne", rev:2, short:"Patatas con carne", n:"Patatas al horno con carne picada, cottage, jalapeños y huevo", tipo:"principal", tags:["principal","micro","huevo"],
  servings:4, minutes:60,
  cookedWeight:1950, cookedWeightQ:"e",
  cookedNote:"1.950 g es una ESTIMACIÓN de lo que va en los táperes (patata asada sin aceite −25 %, carne −25 %). Los huevos y el cottage NO entran en este peso: se añaden al servir y la app los cuenta aparte, así que lo que pesas y registras por gramos es solo el táper.",
  ing:[
    {f:"carne_picada", g:800},
    {f:"patata", g:1600, note:"en dados de 2 cm; 400 g por ración"},
    {f:"jalapenos", g:60, note:"escurridos; ~15 g por ración, al gusto"},
    {f:"cebolla", g:150},
    {f:"especias", g:8, note:"pimentón (dulce o ahumado), comino, ajo en polvo, sal, pimienta"},
    {f:"huevo", g:504, aparte:true, note:"AL SERVIR · 2 huevos L cocidos por ración (8 en total)"},
    {f:"cottage", g:400, aparte:true, note:"AL SERVIR · 100 g por ración, en frío: no se congela ni se calienta"}
  ],
  utensilios:"Horno + 2 bandejas con papel de horno, sartén antiadherente grande, cazo para los huevos, báscula. Para 4 raciones, mejor horno que air fryer: en la air fryer serían 3-4 tandas.",
  pasos:[
    "Horno a 210 °C. Patata en dados de 2 cm (con piel o sin ella). Sécalos muy bien con un trapo —sin aceite, lo que hace que se doren es que estén secos— y mézclalos con sal, pimentón y ajo en polvo.",
    "Reparte la patata en DOS bandejas con papel de horno, en una sola capa sin amontonar (si se amontona, se cuece en vez de dorarse). Horno 35-40 min, dándoles la vuelta a mitad, hasta que estén doradas y tiernas por dentro.",
    "Mientras: carne. Sartén antiadherente SIN aceite: cebolla picada con 2-3 cucharadas de agua 5 min, luego la carne. Desmenúzala y hazla hasta que evapore el jugo y se dore, 8-10 min: la propia carne suelta grasa de sobra. Comino, pimentón, sal y pimienta. Tiene que llegar a 71 °C (USDA para carne picada): que no quede nada rosa.",
    "Huevos: cuece solo 2 por cada ración que vayas a comer en los próximos 7 días (lo normal: 4 huevos para 2 raciones). Agua hirviendo, 10-11 min, a agua fría, y a la nevera EN SU CÁSCARA. Las raciones que congeles llevan sus huevos recién cocidos el día que las descongeles (10 min).",
    "Mezcla patata + carne y reparte en 4 táperes (pesa cada uno). Los jalapeños, por encima o en un bote aparte.",
    "Tapa cuando esté frío, y a la nevera o al congelador antes de 2 h (regla USDA).",
    "AL SERVIR: calienta el táper, pela 2 huevos y pártelos por encima, y añade 100 g de cottage frío."
  ],
  conservacion:{
    nevera:"Base de patata y carne: la USDA da 3-4 días; la FSA es más prudente con las sobras (unos 2 días). Plan sensato: en nevera las raciones de los próximos 2 días, el resto congelado. Huevos cocidos con cáscara: máximo 7 días (FDA). Cottage abierto: lo que diga su etiqueta; mejor una tarrina pequeña por semana.",
    congelador:"La base de patata y carne, sí: calidad buena unos 2-3 meses. Los huevos cocidos, NO: la USDA lo dice tal cual, «no los congeles». El cottage tampoco se congela.",
    descongelar:"En la nevera la noche antes (mejor textura de la patata y se calienta parejo).",
    recalentar:"Solo la base: microondas tapado 3-4 min desde nevera, removiendo a mitad, hasta que esté muy caliente (74 °C). Desde congelado: potencia media 7-9 min removiendo cada 3. Si tienes air fryer a mano, 180 °C 6-8 min deja la patata mejor. Después, huevo y cottage en frío.",
    universidad:"Sí: base en el táper, y los 2 huevos (con cáscara) y el cottage en un táper pequeño aparte. Bolsa isotérmica con 2 acumuladores; sin frío, no más de 2 h."
  },
  alergenos:"Huevo y leche (cottage). Los jalapeños en conserva pueden llevar sulfitos (metabisulfito): mira la etiqueta.",
  variantes:[
    {n:"Más magro", d:"Sustituye 300 g de la carne de vacuno por carne picada de pollo y pavo: baja la grasa. Mete la etiqueta de la bandeja que compres como alimento nuevo, porque no la he podido verificar."},
    {n:"Menos grasa por el huevo", d:"1 huevo entero + 60 g de claras pasteurizadas por ración en vez de 2 huevos: misma proteína aproximada y bastante menos grasa. Mete la etiqueta de las claras si lo haces fijo."},
    {n:"Air fryer (1-2 raciones)", d:"Si un día haces solo una o dos raciones: patata seca y especiada, 200 °C 20-25 min agitando dos veces, sin aceite."},
    {n:"Estilo «patatas bravas»", d:"Pimentón picante en la patata y un poco de salsa picante en la carne. Cambio nutricional despreciable."}
  ],
  micro:"ok",
  aviso:"Cada ración: <b>400 g de patata, 200 g de carne, 2 huevos y 100 g de cottage</b>. Huevo y cottage van <b>aparte</b>: no entran en el peso del táper. Aviso honesto: <b>no he encontrado ninguna fuente oficial que trate la congelación de patata asada</b>. Si la primera ración congelada no te convence de textura, deja esta receta en nevera y congela las otras dos."
},
{
  id:"bolonesa", rev:2, short:"Boloñesa", n:"Pasta boloñesa reforzada con cottage", tipo:"principal", tags:["principal","micro","congela"],
  servings:4, minutes:50,
  cookedWeight:2600, cookedWeightQ:"e",
  cookedNote:"2.600 g estimados (pasta ×2,3 desde seca cocida un punto firme, carne −22 %, tomate reducido). El cottage NO entra en este peso: se añade al servir y la app lo cuenta aparte. Pésalo.",
  ing:[
    {f:"pasta", g:500, note:"el paquete de 500 g"},
    {f:"carne_picada", g:950},
    {f:"tomate_trit", g:500},
    {f:"pimiento", g:300, note:"muy picado: casi desaparece en la salsa y sube la fibra"},
    {f:"cebolla", g:150},
    {f:"especias", g:8, note:"orégano, ajo, laurel, sal, pimienta"},
    {f:"cottage", g:400, aparte:true, note:"AL SERVIR · 100 g por ración, en frío por encima: más proteína y menos grasa que el cheddar"}
  ],
  utensilios:"Olla grande, sartén honda o cazuela antiadherente, colador, báscula.",
  pasos:[
    "Cebolla y pimiento muy picados en la cazuela antiadherente SIN aceite, con 3-4 cucharadas de agua, 8-10 min a fuego medio hasta que estén blandos.",
    "Sube el fuego, añade la carne, desmenúzala y dórala 8 min (suelta su propia grasa; que no quede rosa, 71 °C). Añade tomate triturado, orégano, una hoja de laurel, sal y pimienta y deja 15-20 min a fuego suave hasta que espese. Quita el laurel.",
    "Cuece la pasta 2 MINUTOS MENOS de lo que diga el paquete: la pasta pasada de punto se deshace al recalentar. Escúrrela y pásala por agua fría 10 segundos.",
    "Mezcla pasta + salsa (así la pasta absorbe salsa y no se seca). Si la ves seca, un chorrito del agua de cocción: al congelar, la pasta chupa salsa.",
    "Reparte en 4 táperes y déjalos enfriar destapados (no los cierres en caliente). Tapa ya fríos y a la nevera o al congelador antes de 2 h.",
    "AL SERVIR: calienta y pon 100 g de cottage frío por encima."
  ],
  conservacion:{
    nevera:"La USDA da 3-4 días para sobras; la FSA, unos 2. Plan sensato: en nevera las de los próximos 2 días, el resto al congelador. La USDA no tiene una línea específica para pasta cocida: entra en la categoría general de sobras.",
    congelador:"Sí, muy bien: la salsa protege la pasta. Calidad buena unos 2-3 meses. El cottage no se congela: va aparte.",
    descongelar:"En la nevera la noche antes; si se te olvida, microondas desde congelado a potencia media.",
    recalentar:"Descongelada: microondas tapado 3-4 min, con una cucharada de agua si la ves seca, removiendo a mitad. Desde congelado: potencia media 7-9 min removiendo cada 3. Muy caliente en el centro (74 °C). Luego el cottage frío.",
    universidad:"Sí: táper con bolsa isotérmica y 2 acumuladores, y el cottage en un táper pequeño aparte."
  },
  alergenos:"Gluten (pasta) y leche (cottage).",
  variantes:[
    {n:"Boloñesa picante (arrabbiata)", d:"Guindilla o una cucharada de salsa picante en la salsa. Sin cambio nutricional relevante."},
    {n:"Más verdura escondida", d:"Añade 300 g de calabacín rallado a la salsa con la cebolla: +~50 kcal y +3 g de fibra por lote, y llena más."},
    {n:"Con queso fundido", d:"Si echas de menos el queso: 25 g de cheddar por ración en vez de los 100 g de cottage. Mismas calorías, pero ~7,5 g menos de proteína y ~4 g más de grasa por ración."}
  ],
  micro:"ok"
},
{
  id:"burritos", rev:2, short:"Burritos", n:"Burritos frescos (mitad pollo, mitad vacuno)", tipo:"antojo", tags:["antojo","fresco","congela relleno"],
  servings:8, servingsLabel:"burritos", minutes:60,
  cookedWeight:null, cookedWeightQ:"p",
  cookedNote:"Aquí el peso final que interesa es el del RELLENO cocinado, no el del burrito montado (porque la parte fresca se añade al momento y varía). Pesa el relleno y divídelo entre 8.",
  ing:[
    {f:"pechuga", g:400, note:"para 4 unidades — en tiras"},
    {f:"lomo_vacuno", g:400, note:"para 4 unidades — en tiras finas"},
    {f:"arroz", g:100, note:"OPCIONAL y ya reducido: 12,5 g secos por burrito. Ponlo a 0 si lo quieres aún más fresco"},
    {f:"maiz", g:150, note:"escurrido"},
    {f:"cebolla_morada", g:100, note:"salteada, va en el relleno"},
    {f:"pimiento", g:150},
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
    "Marina 30 min: pollo por un lado y lomo por otro, cada uno con la mitad de las especias y zumo de media lima (sin aceite).",
    "Cuece el arroz (si lo pones) y mézclalo con cilantro picado y zumo de lima. Déjalo firme.",
    "Saltea a fuego fuerte en sartén antiadherente sin aceite, por separado, pollo y lomo, 4-6 min cada uno (el pollo, hasta que no quede rosa: 74 °C). El lomo, muy poco: en tiras finas se pasa enseguida.",
    "Saltea pimiento y los 100 g de cebolla morada 6-8 min, sin aceite y con un chorrito de agua si se pegan.",
    "Monta DOS rellenos distintos (pollo / vacuno), cada uno con su mitad de arroz, maíz y verdura salteada. Pesa cada uno y divídelo entre 4.",
    "Enfría rápido y congela el relleno en porciones individuales, en bolsa zip aplastada (congela plana = descongela en minutos). Etiqueta: contenido + fecha.",
    "AL SERVIR (en casa, sin cocinar nada): saca una bolsa de relleno, microondas 2-3 min hasta que esté bien caliente; calienta la tortilla 20 s; monta con lechuga, tomate, cebolla morada cruda, cilantro, lima y picante. Enrolla y come."
  ],
  conservacion:{
    nevera:"Relleno cocinado: 3-4 días (USDA). Si lleva arroz, la FSA aprieta a 1 día en nevera → por eso el plan por defecto es congelar el relleno el mismo domingo.",
    congelador:"<b>Solo el relleno cocinado, nunca el burrito montado con ensalada dentro.</b> Congelado plano en bolsa zip, 2-3 meses. La lechuga no se congela bien (lo dice expresamente la USDA: los alimentos muy acuosos pierden textura), y el tomate cortado tampoco.",
    descongelar:"Bolsa plana: en la nevera la noche antes o directa al microondas (no la dejes descongelando en la encimera).",
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
    {n:"Sin arroz (más fresco)", d:"Pon el arroz a 0: cada burrito pierde ~43 kcal y ~9 g de hidratos, y gana protagonismo la lechuga y el tomate, que es lo que buscabas."},
    {n:"Pico de gallo de verdad", d:"Tomate + cebolla morada + cilantro + lima + sal, picado al momento. Hazlo en el plato, no en un táper para toda la semana."},
    {n:"Crema fresca ligera", d:"2 cucharadas de queso batido 0 % + lima + picante como salsa: ~15 kcal y 2,5 g de proteína, frente a los ~80 kcal de dos cucharadas de salsa de yogur."}
  ],
  alergenos:"Gluten (tortillas de trigo). Revisa la etiqueta de la salsa picante.",
  micro:"ok",
  aviso:"Sobre el vídeo de referencia: es una <b>adaptación</b>, no una transcripción. No conozco las cantidades ni la salsa exactas de ese burrito. Y sobre la bandeja de «LOMO» de la foto: no tenía etiqueta nutricional legible, así que uso la ficha del lomo de vacuno de Mercadona (145 kcal, 23 g proteína) — comprueba la etiqueta de tu bandeja y corrígela si no coincide."
},
{
  id:"bocata_pollo", rev:2, short:"Bocatas", n:"Bocata de pollo especiado con queso y salsa cremosa", tipo:"antojo", tags:["antojo","air fryer"],
  servings:6, servingsLabel:"bocatas", minutes:45,
  cookedWeight:null, cookedWeightQ:"p",
  cookedNote:"Aquí lo práctico es registrar por unidades, no por gramos: cada bocata es una unidad casi idéntica. Pesa uno montado y ponlo como peso de porción en MacroFactor.",
  ing:[
    {f:"pan_chapata", g:426, note:"6 panecillos"},
    {f:"pechuga", g:720, note:"120 g crudos por bocata"},
    {f:"q_havarti", g:120, note:"1 loncha por bocata"},
    {f:"cebolla_morada", g:120},
    {f:"q_batido_0", g:150, note:"base de la salsa cremosa"},
    {f:"salsa_yogur", g:60, note:"para dar untuosidad; puedes bajarlo"},
    {f:"picante", g:20},
    {f:"lima", g:35},
    {f:"especias", g:10, note:"pimentón ahumado, comino, ajo, orégano, cayena"}
  ],
  utensilios:"Air fryer, sartén o plancha, papel de horno, papel de aluminio.",
  pasos:[
    "Corta el pollo en filetes finos y marínalo 30 min con especias y zumo de lima (sin aceite).",
    "Plancha antiadherente fuerte, sin aceite, 3-4 min por lado, hasta 74 °C en el centro. Deja templar y córtalo en tiras.",
    "Salsa cremosa: 150 g de queso batido 0 % + 60 g de salsa de yogur + 20 g de picante + zumo de lima + sal. Bátelo o mézclalo bien. Guárdala en un bote aparte.",
    "Monta cada bocata: pan abierto, pollo, loncha de queso, cebolla morada en juliana. <b>La salsa NO va dentro todavía.</b>",
    "Envuelve cada uno individualmente en papel de horno y luego en aluminio. Etiqueta con fecha.",
    "AL COMER: si estaba congelado, pásalo a la nevera la noche antes. Air fryer 180 °C, 6-8 min desde nevera, con el papel de horno puesto y el aluminio quitado los últimos 3 min para que el pan quede crujiente. Abre, echa la salsa fría y cierra."
  ],
  conservacion:{
    nevera:"Montados sin salsa: 3-4 días (USDA para pollo cocinado). La salsa, en su bote, lo mismo.",
    congelador:"Se pueden congelar montados <b>sin salsa y sin cebolla cruda</b> (añádelas al servir): 1-2 meses de calidad razonable. Con salsa dentro se separa y empapa el pan.",
    descongelar:"Nevera de un día para otro; luego air fryer.",
    recalentar:"Air fryer 180 °C 6-8 min, siempre ya descongelado en nevera: desde congelado, envuelto, no hay garantía de que el pollo llegue a 74 °C. En microondas el pan queda chicloso: aquí la air fryer no es opcional, y ya dijiste que la aceptas.",
    universidad:"No: en la facultad solo tienes microondas y este es el único plato que la necesita de verdad."
  },
  variantes:[
    {n:"Salsa más proteica", d:"Quita la salsa de yogur y usa 200 g de queso batido 0 % + picante + lima + un poco de mostaza: el lote pierde ~130 kcal y ~14 g de grasa."},
    {n:"Estilo buffalo", d:"Más salsa picante y un punto de vinagre en la marinada. Sin cambio nutricional relevante."},
    {n:"Con las sobras del pollo asado", d:"Si te sobra pollo de la receta 1, úsalo aquí: mismo cálculo, cero cocinado extra."}
  ],
  alergenos:"Gluten (pan), leche (queso, queso batido) y, según marca, huevo o mostaza en la salsa de yogur: mira la etiqueta.",
  micro:"no",
  aviso:"También es una <b>adaptación</b> del vídeo, no su receta. No conozco los ingredientes ni las cantidades de la salsa original."
},
{
  id:"quesadillas_chipotle", rev:2, short:"Quesadillas", n:"Quesadillas de pollo chipotle con miel (meal prep)", tipo:"antojo", tags:["antojo","congela","air fryer"],
  servings:10, servingsLabel:"quesadillas", minutes:75,
  cookedWeight:null, cookedWeightQ:"p",
  cookedNote:"Registra por UNIDADES: las 10 salen casi iguales. Pesa una quesadilla montada (antes de tostar) y ponla como peso de porción en MacroFactor. El relleno pésalo entero y divídelo entre 10 para repartirlo con báscula, no a ojo.",
  ing:[
    {f:"pechuga", g:1800, note:"180 g crudos por quesadilla (≈ 130 g cocidos). Pechuga entera, sin filetear"},
    {f:"especias", g:15, note:"sazonador chipotle: pimentón ahumado, cayena o chile en polvo, comino, ajo en polvo, sal. Mitad para el pollo, mitad para la salsa"},
    {f:"q_batido_0", g:300, note:"base de la salsa (en el vídeo usan cottage; el batido 0 % tiene más proteína y ya lo compras)"},
    {f:"mayo_ligera", g:60},
    {f:"salsa_chipotle", g:40, note:"si no la encuentras: 20 g más de picante + 1 cucharadita de pimentón ahumado"},
    {f:"picante", g:30},
    {f:"miel", g:40, note:"4 g por quesadilla: es lo que da el toque «honey»"},
    {f:"lima", g:35, note:"zumo de media lima; 1 diente de ajo también a la salsa"},
    {f:"q_rallado_light", g:150, note:"va MEZCLADO con el pollo y la salsa (15 g por unidad)"},
    {f:"q_cheddar_rallado", g:300, note:"15 g bajo el relleno + 15 g encima, en cada tortilla"},
    {f:"tortilla_grande", g:620, note:"10 tortillas grandes; con las pequeñas de 36 g haz 2 por ración y registra 2"}
  ],
  utensilios:"Sartén grande con tapa, batidora de vaso, dos tenedores (o batidora de varillas para desmenuzar), bol grande, plancha o sartén antiadherente, papel de horno, báscula.",
  pasos:[
    "Seca las pechugas y úntalas con la mitad del sazonador chipotle (sin aceite). Sartén antiadherente a fuego medio, TAPADA: 8-10 min por lado según grosor. Están cuando el centro marca 74 °C o ya no está rosa. Deja reposar 10 min.",
    "Salsa: en la batidora, queso batido 0 %, mayonesa ligera, salsa chipotle, picante, miel, zumo de lima, el diente de ajo y el resto del sazonador. Tritura hasta que quede lisa. Prueba y ajusta picante o sal.",
    "Desmenuza el pollo (dos tenedores, o 20 s con varillas eléctricas en el bol). Añade la salsa y el queso rallado light, y cebollino picado si tienes. Mezcla bien. PESA el bol: ese número entre 10 es el relleno de cada quesadilla.",
    "Monta cada quesadilla: tortilla, 15 g de cheddar en una mitad, 1/10 del relleno encima, otros 15 g de cheddar, dobla.",
    "Tuesta en sartén o plancha sin aceite, fuego medio, 2-3 min por lado hasta que esté dorada y el queso fundido. Presiona un poco con la espátula al dar la vuelta.",
    "Las que no comas hoy: deja enfriar del todo sobre una rejilla (si las envuelves calientes sudan y se ablandan), envuelve una a una en papel de horno + aluminio o bolsa zip, etiqueta con fecha, y a la nevera (para los próximos 2 días) o al congelador."
  ],
  conservacion:{
    nevera:"Envueltas y frías: la USDA da 3-4 días para pollo cocinado, pero la tortilla pierde textura a partir del segundo día. Plan razonable: las de los próximos 2 días en nevera, el resto al congelador.",
    congelador:"Sí, ya tostadas y envueltas individualmente: 1-2 meses de calidad buena. Congélalas planas y luego apílalas.",
    descongelar:"No hace falta: van directas de congelado a la air fryer o la sartén.",
    recalentar:"Air fryer 180 °C, 6-8 min desde nevera o 10-12 desde congelado, dándole la vuelta a mitad: recupera el crujiente. Sartén a fuego medio, tapada, también sirve. Microondas 2-3 min funciona pero queda blanda (es lo que tendrás en la facultad).",
    universidad:"Sí, si aceptas que en microondas queda blanda. Llévala en bolsa isotérmica con acumulador de frío y no la dejes más de 2 h sin frío."
  },
  variantes:[
    {n:"Más proteína", d:"Sube el pollo a 2.000 g (200 g crudos por unidad): cada quesadilla suma ~4,5 g de proteína y ~20 kcal: unos 64 g por unidad, casi los 65 g que anuncia el vídeo."},
    {n:"Menos grasa", d:"Baja el cheddar a 200 g (20 g por unidad) y quita la mayonesa (sube el queso batido a 360 g): cada quesadilla pierde ~55 kcal y ~5 g de grasa sin notarlo mucho, porque la salsa sigue siendo cremosa."},
    {n:"Con las sobras del pollo asado", d:"Si te sobra pollo de la receta 1, desmenúzalo y úsalo aquí en vez de cocinar pechugas: solo haces la salsa y montas."}
  ],
  alergenos:"Gluten (tortillas), leche (quesos) y huevo (mayonesa).",
  micro:"ok",
  aviso:"Es una <b>adaptación</b> del vídeo (@aussiefitness, «cheesy honey chipotle chicken quesadillas»), no su receta: el vídeo enseña los ingredientes y los pasos pero <b>no da ninguna cantidad</b>. Todos los gramos son míos, pensados para 10 unidades y para comprar en Mercadona. Los «65 g de proteína» que anuncia casi salen con estas cantidades (unos 59 g con pechuga): o sus tortillas y su pollo son más grandes, o la cifra es generosa. Los valores del cheddar rallado, el queso rallado light, la mayonesa ligera, la salsa chipotle y la miel son estimaciones: comprueba las etiquetas."
},
{
  id:"bol_desayuno", rev:2, short:"Bol", n:"Bol de queso batido con chía y fruta", tipo:"desayuno", tags:["desayuno","postre","sin cocinar"],
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
  alergenos:"Leche. La proteína en polvo suele llevar leche y puede llevar soja.",
  micro:"n/a"
},
{
  id:"helado_prot", rev:2, short:"Helado", n:"Helado proteico de fruta congelada", tipo:"desayuno", tags:["desayuno","postre","merienda","sin cocinar"],
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
    {n:"Porción media (postre o merienda)", d:"La mitad de todo: ~245 kcal y ~23 g de proteína. Sigue siendo UNA entrada en MacroFactor: registras 0,5 raciones, no dos comidas."},
    {n:"Con avena (más saciante)", d:"Añade 40-55 g de copos: +150-200 kcal y +4-5 g de fibra. Es lo que hacía tu receta antigua."},
    {n:"Sin proteína en polvo", d:"Sube el queso batido a 250 g: −65 kcal y −13 g de proteína aproximadamente."}
  ],
  alergenos:"Leche. La proteína en polvo suele llevar leche y puede llevar soja.",
  micro:"n/a",
  aviso:"Tu receta antigua anunciaba 581 kcal y 39 g de proteína con 225 g de fresa-plátano, 195 g de tropical, 55 g de avena, un cacito y 65 g de leche. Con los datos de etiqueta que uso aquí, esa combinación sale en torno a <b>580 kcal y ~37 g de proteína</b>: las cifras que tenías eran plausibles. Aun así no las doy por verificadas — dependen del bote de proteína concreto y de que el cacito pesara 30 g."
}
];
