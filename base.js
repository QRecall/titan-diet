"use strict";
/* =========================================================================
   0. UTILIDADES
   ========================================================================= */
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const r0=n=>Math.round(n||0), r1=n=>Math.round((n||0)*10)/10;
// en pantalla los decimales van con coma, como toca en español
const d1=n=>String(r1(n)).replace(".",",");
const eur=n=>(Number(n)||0).toFixed(2).replace(".",",");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function later(fn){ setTimeout(fn,0); }
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),Math.max(2200,String(msg).length*55));}
const todayISO=()=>{ const d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,10); }; // fecha LOCAL, no UTC
function fmtDate(iso){if(!iso)return"";const[a,m,d]=iso.split("-");return `${d}/${m}/${a}`;}
function daysSince(iso){if(!iso)return null;const ms=Date.now()-new Date(iso+"T12:00:00").getTime();return Math.floor(ms/86400000);}

/* =========================================================================
   1. ALIMENTOS  (valores por 100 g salvo que se indique)
   v = verificado en ficha/etiqueta del producto ; e = estimación (base de datos
   genérica o producto equivalente) ; p = provisional / pendiente de comprobar
   ========================================================================= */
const FOODS = {
  pollo_carne:{n:"Pollo entero (carne comestible, cruda, sin piel ni hueso)",cat:"Carnicería",st:"crudo, parte comestible sin piel",kcal:119,p:21.4,c:0,f:3.1,fib:0,q:"e",
    src:"La etiqueta del Pollo entero de Mercadona (Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026)) da 158 kcal, 20 g prot. y 8,7 g grasa por 100 g, pero CON piel. Como tú la quitas, se usa el valor USDA de carne sin piel (FoodData Central, «meat only, raw»). 6,65 € el pollo de ~1,9 kg.",
    buyFactor:2.1, buyUnit:"pollo entero", buyNote:"Se compra pollo entero: hacen falta ~2,1 g de pollo entero por cada 1 g de carne limpia (rendimiento estimado 45-50 %).", price:3.50},
  pechuga:{n:"Pechuga de pollo (entera o en filetes)",cat:"Carnicería",st:"cruda",kcal:108,p:22,c:0.5,f:1.8,fib:0,q:"v",
    src:"Pechugas enteras de pollo — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). 3,33 € / 500 g.",price:6.66},
  carne_picada:{n:"Carne picada de vacuno 99 %",cat:"Carnicería",st:"cruda",kcal:204,p:19,c:0.5,f:14,fib:0,q:"v",
    src:"Preparado de carne picada vacuno 99 % (OFF 8436569263174) — coincide exactamente con tu entrada provisional",price:9.5,priceQ:"p"},
  lomo_vacuno:{n:"Lomo de vacuno",cat:"Carnicería",st:"crudo",kcal:145,p:23,c:0.5,f:5.7,fib:0,q:"v",
    src:"Lomo vacuno Mercadona (OFF 2302800004812). Precio no verificado.",price:16,priceQ:"p"},
  arroz:{n:"Arroz redondo",cat:"Despensa",st:"seco",kcal:344,p:8.2,c:75,f:1,fib:1.05,q:"v",
    src:"Arroz redondo Hacendado (OFF 8480000050441)",price:1.15, cookFactor:2.8},
  pasta:{n:"Macarrones",cat:"Despensa",st:"seca",kcal:361,p:13,c:72,f:1.5,fib:3.5,q:"v",
    src:"Macarrón Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). 0,80 € / 500 g.",price:1.60, cookFactor:2.5, packG:500, packName:"paquete de 500 g"},
  patata:{n:"Patata",cat:"Frutería",st:"cruda, pelada",kcal:77,p:2,c:17.5,f:0.09,fib:2.1,q:"e",
    src:"USDA FoodData Central (patata cruda). Producto a granel sin etiqueta propia.",price:1.30,priceQ:"p"},
  huevo:{n:"Huevo L",cat:"Huevos y lácteos",st:"crudo, sin cáscara",kcal:150,p:12.5,c:0.5,f:11.1,fib:0,q:"v",
    src:"Huevos L Hacendado (OFF 8437019803032). 1 huevo L ≈ 63 g sin cáscara (rango UE 63-73 g con cáscara).",price:4.03,priceQ:"e",unitG:63,unitName:"huevo"},
  cottage:{n:"Queso cottage",cat:"Huevos y lácteos",st:"tal cual",kcal:82,p:12,c:1.7,f:3,fib:0,q:"v",
    src:"Queso cottage Valblu (el único cottage que vende ahora Mercadona) — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). 1,35 € la tarrina de 200 g.",price:6.75, packG:200, packName:"tarrina de 200 g"},
  jalapenos:{n:"Jalapeños en vinagre (escurridos)",cat:"Despensa",st:"escurridos",kcal:18,p:0.3,c:2.8,f:0.5,fib:1.1,q:"v",
    src:"Jalapeños picantes en vinagre Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026) (grasa «<0,5 g»). Bote de 135 g = 60 g escurridos, 1,65 €. Llevan sulfitos.",price:27.5, packG:60, packName:"bote (60 g escurridos)"},
  q_batido_prot:{n:"Queso fresco batido + proteínas",cat:"Huevos y lácteos",st:"tal cual",kcal:52,p:10,c:3.1,f:0.5,fib:0,q:"v",
    src:"Queso fresco batido +proteínas Hacendado (OFF 8480000210036). OJO: el 3/10/2026 NO aparecía en la tienda online de Mercadona (sí el batido 0 %, 1,10 € / 500 g). Puede estar agotado o retirado: si no lo encuentras, usa el 0 % y corrige aquí (8 g de proteína en vez de 10)",price:2.4,priceQ:"p"},
  q_batido_0:{n:"Queso fresco batido 0 %",cat:"Huevos y lácteos",st:"tal cual",kcal:46,p:8,c:3.5,f:0.1,fib:0,q:"v",
    src:"Queso fresco batido 0 % Hacendado (OFF 8480000510211) — 1,10 € la tarrina de 500 g",price:2.20},
  q_cheddar:{n:"Queso cheddar en lonchas",cat:"Huevos y lácteos",st:"tal cual",kcal:392,p:26,c:0,f:32,fib:0,q:"v",
    src:"Queso cheddar Hacendado (OFF 8480000550170) — 1,85 € / 200 g",price:9.25},
  q_havarti:{n:"Queso en lonchas light (cremoso light)",cat:"Huevos y lácteos",st:"tal cual",kcal:267,p:27,c:1.6,f:17,fib:0,q:"v",
    src:"Queso lonchas cremoso light de vaca Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). Mismos valores que el antiguo «havarti light». 2,90 € / 300 g.",price:9.67},
  tortilla:{n:"Tortillas de trigo",cat:"Despensa",st:"tal cual",kcal:294,p:8.4,c:50,f:5.8,fib:4.2,q:"v",
    src:"Tortillas trigo Hacendado (OFF 8480000808592) — 1,13 € / 360 g. Peso por unidad ≈ 36 g (estimado del peso total).",price:3.14,unitG:36,unitName:"tortilla"},
  pan_chapata:{n:"Chapata de cristal (pan de bocata)",cat:"Panadería",st:"tal cual",kcal:299,p:8.8,c:48,f:7,fib:4.4,q:"v",
    src:"Panes chapata de cristal Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). 4 panes = 284 g, 1,30 €.",price:4.58,unitG:71,unitName:"panecillo"},
  maiz:{n:"Maíz dulce en conserva",cat:"Despensa",st:"escurrido",kcal:75,p:2.6,c:9.3,f:2.3,fib:2.84,q:"v",
    src:"Maíz dulce Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). La etiqueta no declara fibra: la fibra es estimación. Pack de 3 latas de 75 g (70 g escurridos cada una), 1,25 €.",price:5.95, packG:70, packName:"latita (70 g escurridos)"},
  tomate:{n:"Tomate",cat:"Frutería",st:"crudo",kcal:18,p:0.88,c:3.9,f:0.2,fib:1.2,q:"e",src:"USDA FoodData Central",price:1.9,priceQ:"p"},
  lechuga:{n:"Lechuga",cat:"Frutería",st:"cruda",kcal:15,p:1.36,c:2.87,f:0.15,fib:1.3,q:"e",src:"USDA FoodData Central",price:2.2,priceQ:"p"},
  rucula:{n:"Rúcula",cat:"Frutería",st:"cruda",kcal:25,p:2.6,c:3.6,f:0.66,fib:1.6,q:"e",src:"USDA FoodData Central",price:8,priceQ:"p"},
  cebolla_morada:{n:"Cebolla morada",cat:"Frutería",st:"cruda",kcal:42,p:0.94,c:9.9,f:0.1,fib:2.2,q:"e",src:"USDA FoodData Central",price:1.9,priceQ:"p"},
  brocoli:{n:"Brócoli congelado",cat:"Congelados",st:"congelado, tal cual",kcal:34,p:2.8,c:6.6,f:0.4,fib:2.6,q:"e",
    src:"USDA FoodData Central (brócoli crudo). No he verificado la ficha del brócoli congelado de Mercadona: compruébalo en la bolsa. Precio no verificado.",price:2.6,priceQ:"p"},
  calabacin:{n:"Calabacín",cat:"Frutería",st:"crudo",kcal:17,p:1.2,c:3.1,f:0.3,fib:1,q:"e",src:"USDA FoodData Central",price:1.9,priceQ:"p"},
  cebolla:{n:"Cebolla",cat:"Frutería",st:"cruda",kcal:40,p:1.1,c:9.3,f:0.1,fib:1.7,q:"e",src:"USDA FoodData Central",price:1.2,priceQ:"p"},
  pimiento:{n:"Pimiento (rojo/verde)",cat:"Frutería",st:"crudo",kcal:26,p:0.99,c:6.03,f:0.3,fib:2.1,q:"e",src:"USDA FoodData Central",price:2.5,priceQ:"p"},
  aove:{n:"Aceite de oliva virgen extra",cat:"Despensa",st:"tal cual, en crudo",kcal:899,p:0,c:0,f:99.9,fib:0,q:"v",
    src:"AOVE Hacendado (OFF 8480000047403): la etiqueta da 822 kcal y 91,4 g de grasa por 100 ml; pasado a 100 g (densidad ≈0,915) son ≈899 kcal y ≈99,9 g. 4,45 €/L",price:4.87},
  chia:{n:"Semillas de chía",cat:"Despensa",st:"secas",kcal:464,p:22,c:2.6,f:34,fib:30,q:"v",
    src:"Semillas de chía Hacendado (OFF 8480000054647) — 1,45 € / 150 g",price:9.67},
  avena:{n:"Copos de avena (Brüggen)",cat:"Despensa",st:"secos",kcal:375,p:14,c:59,f:7,fib:10,q:"v",
    src:"Copos de avena Brüggen, los que vende Mercadona — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). 1,30 € / 800 g.",price:1.63},
  fruta_fp:{n:"Fresa y plátano congelados",cat:"Congelados",st:"congelado",kcal:54,p:0.9,c:11.1,f:0.1,fib:1.4,q:"v",
    src:"Dúo fresa y plátano Hacendado congelado (2,75 € / 450 g)",price:6.11},
  fruta_trop:{n:"Mix tropical congelado (mango, melocotón, papaya)",cat:"Congelados",st:"congelado",kcal:59,p:0.7,c:12.4,f:0.2,fib:1.6,q:"v",
    src:"Mix frutas tropical Hacendado ultracongelado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). 2,75 € / 450 g.",price:6.11},
  tomate_trit:{n:"Tomate triturado",cat:"Despensa",st:"tal cual",kcal:23,p:1.1,c:3.8,f:0,fib:1.3,q:"v",
    src:"Tomate triturado Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). La etiqueta no declara fibra: la fibra es estimación. 1,00 € / 800 g.",price:1.25, packG:800, packName:"bote de 800 g"},
  salsa_yogur:{n:"Salsa de yogur",cat:"Despensa",st:"tal cual",kcal:257,p:0.8,c:8.7,f:23.9,fib:0,q:"v",
    src:"Salsa yogur Hacendado (OFF 8480000173270)",price:5,priceQ:"p"},
  picante:{n:"Salsa picante",cat:"Despensa",st:"tal cual",kcal:54,p:0.6,c:4,f:0.9,fib:0,q:"v",
    src:"Salsa picante extra Hacendado (OFF 8480000172105). OJO: el 3/10/2026 no aparecía en la tienda online de Mercadona. Si no la hay, cayena o Salsa Piri Piri; se usa tan poca que los números casi no cambian",price:12,priceQ:"p"},
  proteina:{n:"Proteína en polvo (whey)",cat:"Suplementos",st:"polvo",kcal:390,p:78,c:6,f:6,fib:0,q:"e",
    src:"Valores típicos de una whey concentrada al ~78 % (p. ej. HSN Evowhey). CAMBIA ESTOS NÚMEROS por los del bote que compres.",price:21,priceQ:"e",unitG:30,unitName:"cacito (pésalo: los cacitos NO son todos de 30 g)"},
  leche:{n:"Leche desnatada",cat:"Huevos y lácteos",st:"líquida",kcal:34,p:3.1,c:4.7,f:0.3,fib:0,q:"v",
    src:"Leche desnatada Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026): 35 kcal, 3,2 g prot., 4,9 g HC y 0,3 g grasa por 100 ml, pasados a 100 g. 0,81 € / L.",price:0.81},
  pera:{n:"Pera",cat:"Frutería",st:"cruda, con piel",kcal:57,p:0.4,c:15.2,f:0.1,fib:3.1,q:"e",src:"USDA FoodData Central (pera cruda). Fruta fresca sin etiqueta: es estimación. Precio no verificado.",price:2.3,priceQ:"p",unitG:180,unitName:"pera mediana"},
  manzana:{n:"Manzana",cat:"Frutería",st:"cruda, con piel",kcal:52,p:0.3,c:13.8,f:0.2,fib:2.4,q:"e",src:"USDA FoodData Central (manzana cruda con piel). Fruta fresca sin etiqueta: es estimación. Precio no verificado.",price:2,priceQ:"p",unitG:180,unitName:"manzana mediana"},
  kiwi:{n:"Kiwi verde",cat:"Frutería",st:"crudo, pelado",kcal:61,p:1.1,c:14.7,f:0.5,fib:3,q:"e",src:"USDA FoodData Central (kiwi verde crudo). Fruta fresca sin etiqueta: es estimación. Precio no verificado.",price:3.5,priceQ:"p",unitG:75,unitName:"kiwi"},
  lima:{n:"Lima",cat:"Frutería",st:"cruda",kcal:30,p:0.7,c:10.5,f:0.2,fib:2.8,q:"e",src:"USDA. 0,33 €/ud en Mercadona.",price:4.4,unitG:70,unitName:"lima"},
  cilantro:{n:"Cilantro fresco",cat:"Frutería",st:"crudo",kcal:23,p:2.1,c:3.7,f:0.5,fib:2.8,q:"e",src:"USDA. Producto confirmado en catálogo Mercadona, precio no verificado.",price:12,priceQ:"p"},
  tortilla_grande:{n:"Maxi tortillas de trigo (para quesadilla)",cat:"Despensa",st:"tal cual",kcal:294,p:8.4,c:50,f:5.8,fib:4.2,q:"v",
    src:"Maxi tortillas de trigo Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). 6 tortillas de ~60 g = 360 g, 1,50 €.",price:4.17,unitG:60,unitName:"tortilla grande"},
  q_fundir:{n:"Queso rallado especial fundir",cat:"Huevos y lácteos",st:"tal cual",kcal:284,p:19,c:7,f:20,fib:0,q:"v",
    src:"Queso rallado especial fundir mezcla Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). 1,10 € / 200 g. Sustituye al cheddar rallado y al rallado light, que Mercadona no vende.",price:5.5},
  mayo_ligera:{n:"Salsa Light (mayonesa ligera)",cat:"Despensa",st:"tal cual",kcal:292,p:0.8,c:4.7,f:30,fib:0,q:"v",
    src:"Salsa Light Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026). 1,20 € / 500 ml.",price:2.4},
  miel:{n:"Miel de flores",cat:"Despensa",st:"tal cual",kcal:333,p:0.3,c:83,f:0,fib:0,q:"v",
    src:"Miel de flores Hacendado — Tienda online Mercadona, foto de la etiqueta (consultada el 3/10/2026) (proteína «<0,5 g»). 3,20 € / 500 g.",price:6.4},
  especias:{n:"Especias (pimentón, comino, ajo en polvo, orégano, sal, pimienta)",cat:"Despensa",st:"secas",kcal:0,p:0,c:0,f:0,fib:0,q:"e",
    src:"Se cuentan como 0 kcal: a estas cantidades el error es irrelevante.",price:0,priceQ:"e",noWeight:true}
};
