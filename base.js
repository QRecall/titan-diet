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
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);}
const todayISO=()=>new Date().toISOString().slice(0,10);
function fmtDate(iso){if(!iso)return"";const[a,m,d]=iso.split("-");return `${d}/${m}/${a}`;}
function daysSince(iso){if(!iso)return null;const ms=Date.now()-new Date(iso+"T12:00:00").getTime();return Math.floor(ms/86400000);}

/* =========================================================================
   1. ALIMENTOS  (valores por 100 g salvo que se indique)
   v = verificado en ficha/etiqueta del producto ; e = estimación (base de datos
   genérica o producto equivalente) ; p = provisional / pendiente de comprobar
   ========================================================================= */
const FOODS = {
  pollo_carne:{n:"Pollo (carne comestible, cruda, sin piel ni hueso)",cat:"Carnicería",st:"crudo, parte comestible",kcal:120,p:18.8,c:0.5,f:5.6,fib:0,q:"v",
    src:"Etiqueta pollo entero Mercadona (Open Food Facts 2302781004573)",
    buyFactor:2.1, buyUnit:"pollo entero", buyNote:"Se compra pollo entero: hacen falta ~2,1 g de pollo entero por cada 1 g de carne limpia (rendimiento estimado 45-50 %).", price:3.50},
  carne_picada:{n:"Carne picada de vacuno 99 %",cat:"Carnicería",st:"cruda",kcal:204,p:19,c:0.5,f:14,fib:0,q:"v",
    src:"Preparado de carne picada vacuno 99 % (OFF 8436569263174) — coincide exactamente con tu entrada provisional",price:9.5,priceQ:"p"},
  lomo_vacuno:{n:"Lomo de vacuno",cat:"Carnicería",st:"crudo",kcal:145,p:23,c:0.5,f:5.7,fib:0,q:"v",
    src:"Lomo vacuno Mercadona (OFF 2302800004812). Precio no verificado.",price:16,priceQ:"p"},
  arroz:{n:"Arroz redondo",cat:"Despensa",st:"seco",kcal:344,p:8.2,c:75,f:1,fib:1.05,q:"v",
    src:"Arroz redondo Hacendado (OFF 8480000050441)",price:1.15, cookFactor:2.8},
  pasta:{n:"Macarrones",cat:"Despensa",st:"seca",kcal:361,p:13,c:72,f:1.5,fib:3.5,q:"v",
    src:"Macarrón Hacendado (OFF 8480000062505)",price:1.15, cookFactor:2.5},
  patata:{n:"Patata",cat:"Frutería",st:"cruda, pelada",kcal:77,p:2,c:17.5,f:0.09,fib:2.1,q:"e",
    src:"USDA FoodData Central (patata cruda). Producto a granel sin etiqueta propia.",price:1.30,priceQ:"p"},
  huevo:{n:"Huevo L",cat:"Huevos y lácteos",st:"crudo, sin cáscara",kcal:150,p:12.5,c:0.5,f:11.1,fib:0,q:"v",
    src:"Huevos L Hacendado (OFF 8437019803032). 1 huevo L ≈ 63 g sin cáscara (rango UE 63-73 g con cáscara).",price:4.03,priceQ:"e",unitG:63,unitName:"huevo"},
  q_batido_prot:{n:"Queso fresco batido + proteínas",cat:"Huevos y lácteos",st:"tal cual",kcal:52,p:10,c:3.1,f:0.5,fib:0,q:"v",
    src:"Queso fresco batido +proteínas Hacendado (OFF 8480000210036)",price:2.4,priceQ:"p"},
  q_batido_0:{n:"Queso fresco batido 0 %",cat:"Huevos y lácteos",st:"tal cual",kcal:46,p:8,c:3.5,f:0.1,fib:0,q:"v",
    src:"Queso fresco batido 0 % Hacendado (OFF 8480000510211) — 1,10 € la tarrina de 500 g",price:2.20},
  q_cheddar:{n:"Queso cheddar en lonchas",cat:"Huevos y lácteos",st:"tal cual",kcal:392,p:26,c:0,f:32,fib:0,q:"v",
    src:"Queso cheddar Hacendado (OFF 8480000550170) — 1,85 € / 200 g",price:9.25},
  q_havarti:{n:"Queso havarti light en lonchas",cat:"Huevos y lácteos",st:"tal cual",kcal:267,p:27,c:1.6,f:17,fib:0,q:"v",
    src:"Havarti lonchas light Hacendado (OFF 2350439002525)",price:11,priceQ:"p"},
  tortilla:{n:"Tortillas de trigo",cat:"Despensa",st:"tal cual",kcal:294,p:8.4,c:50,f:5.8,fib:4.2,q:"v",
    src:"Tortillas trigo Hacendado (OFF 8480000808592) — 1,13 € / 360 g. Peso por unidad ≈ 36 g (estimado del peso total).",price:3.14,unitG:36,unitName:"tortilla"},
  pan_chapata:{n:"Chapata de cristal (pan de bocata)",cat:"Panadería",st:"tal cual",kcal:299,p:8.8,c:48,f:7,fib:2.5,q:"p",
    src:"Chapata cristal El Horno de Mercadona (OFF 8480000064592). La ficha NO trae azúcares, saturadas, fibra ni sal: la fibra que ves es una estimación mía.",price:4.65,unitG:71,unitName:"panecillo"},
  maiz:{n:"Maíz dulce en conserva",cat:"Despensa",st:"escurrido",kcal:75,p:2.6,c:9.3,f:2.3,fib:2.84,q:"v",
    src:"Maíz dulce Hacendado (OFF 8480000167125). Peso escurrido de la lata de 150 g ≈ 90-100 g (estimación).",price:3,priceQ:"p"},
  tomate:{n:"Tomate",cat:"Frutería",st:"crudo",kcal:18,p:0.88,c:3.9,f:0.2,fib:1.2,q:"e",src:"USDA FoodData Central",price:1.9,priceQ:"p"},
  lechuga:{n:"Lechuga",cat:"Frutería",st:"cruda",kcal:15,p:1.36,c:2.87,f:0.15,fib:1.3,q:"e",src:"USDA FoodData Central",price:2.2,priceQ:"p"},
  rucula:{n:"Rúcula",cat:"Frutería",st:"cruda",kcal:25,p:2.6,c:3.6,f:0.66,fib:1.6,q:"e",src:"USDA FoodData Central",price:8,priceQ:"p"},
  cebolla_morada:{n:"Cebolla morada",cat:"Frutería",st:"cruda",kcal:42,p:0.94,c:9.9,f:0.1,fib:2.2,q:"e",src:"USDA FoodData Central",price:1.9,priceQ:"p"},
  cebolla:{n:"Cebolla",cat:"Frutería",st:"cruda",kcal:40,p:1.1,c:9.3,f:0.1,fib:1.7,q:"e",src:"USDA FoodData Central",price:1.2,priceQ:"p"},
  pimiento:{n:"Pimiento (rojo/verde)",cat:"Frutería",st:"crudo",kcal:26,p:0.99,c:6.03,f:0.3,fib:2.1,q:"e",src:"USDA FoodData Central",price:2.5,priceQ:"p"},
  aove:{n:"Aceite de oliva virgen extra",cat:"Despensa",st:"tal cual",kcal:822,p:0,c:0,f:91,fib:0,q:"v",
    src:"AOVE Hacendado (OFF 8480000047403) — 4,45 €/L",price:4.87},
  chia:{n:"Semillas de chía",cat:"Despensa",st:"secas",kcal:464,p:22,c:2.6,f:34,fib:30,q:"v",
    src:"Semillas de chía Hacendado (OFF 8480000054647) — 1,45 € / 150 g",price:9.67},
  avena:{n:"Copos de avena",cat:"Despensa",st:"secos",kcal:370,p:14,c:58,f:6.5,fib:10,q:"e",
    src:"Agregador (FatSecret) para copos Hacendado; la fibra es estimación genérica de avena. Sin ficha con foto de etiqueta.",price:2,priceQ:"p"},
  fruta_fp:{n:"Fresa y plátano congelados",cat:"Congelados",st:"congelado",kcal:54,p:0.9,c:11.1,f:0.1,fib:1.4,q:"v",
    src:"Dúo fresa y plátano Hacendado congelado (2,75 € / 450 g)",price:6.11},
  fruta_trop:{n:"Mix tropical congelado (mango, melocotón, papaya)",cat:"Congelados",st:"congelado",kcal:60,p:0.7,c:13,f:0.2,fib:1.8,q:"e",
    src:"Precio verificado (2,75 € / 450 g). Tabla nutricional NO localizada: valores estimados de fruta equivalente. Mercadona no parece vender mango congelado suelto.",price:6.11},
  tomate_trit:{n:"Tomate triturado",cat:"Despensa",st:"tal cual",kcal:30,p:1.3,c:5,f:0.3,fib:1.3,q:"e",src:"Estimación genérica de tomate triturado en conserva; ficha Hacendado no verificada.",price:1.2,priceQ:"p"},
  salsa_yogur:{n:"Salsa de yogur",cat:"Despensa",st:"tal cual",kcal:257,p:0.8,c:8.7,f:23.9,fib:0,q:"v",
    src:"Salsa yogur Hacendado (OFF 8480000173270)",price:5,priceQ:"p"},
  picante:{n:"Salsa picante",cat:"Despensa",st:"tal cual",kcal:54,p:0.6,c:4,f:0.9,fib:0,q:"v",
    src:"Salsa picante extra Hacendado (OFF 8480000172105)",price:12,priceQ:"p"},
  proteina:{n:"Proteína en polvo (whey)",cat:"Suplementos",st:"polvo",kcal:390,p:78,c:6,f:6,fib:0,q:"e",
    src:"Valores típicos de una whey concentrada al ~78 % (p. ej. HSN Evowhey). CAMBIA ESTOS NÚMEROS por los del bote que compres.",price:21,priceQ:"e",unitG:30,unitName:"cacito (pésalo: los cacitos NO son todos de 30 g)"},
  leche:{n:"Leche desnatada",cat:"Huevos y lácteos",st:"líquida",kcal:35,p:3.4,c:4.8,f:0.1,fib:0,q:"e",src:"Estimación genérica de leche desnatada.",price:0.85,priceQ:"p"},
  lima:{n:"Lima",cat:"Frutería",st:"cruda",kcal:30,p:0.7,c:10.5,f:0.2,fib:2.8,q:"e",src:"USDA. 0,33 €/ud en Mercadona.",price:4.4,unitG:70,unitName:"lima"},
  cilantro:{n:"Cilantro fresco",cat:"Frutería",st:"crudo",kcal:23,p:2.1,c:3.7,f:0.5,fib:2.8,q:"e",src:"USDA. Producto confirmado en catálogo Mercadona, precio no verificado.",price:12,priceQ:"p"},
  especias:{n:"Especias (pimentón, comino, ajo en polvo, orégano, sal, pimienta)",cat:"Despensa",st:"secas",kcal:0,p:0,c:0,f:0,fib:0,q:"e",
    src:"Se cuentan como 0 kcal: a estas cantidades el error es irrelevante.",price:0,priceQ:"e",noWeight:true}
};
