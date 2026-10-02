# TITAN Diet

App web (PWA) de meal prep: recetas con macros calculados a partir de etiquetas reales, escalado de raciones,
lista de compra que se recalcula sola, inventario de congelador, plan del domingo de cocina y pirámide de la
alimentación de la SENC.

**Abrir:** https://qrecall.github.io/titan-diet/

## Instalarla en el móvil
- **Android (Chrome):** menú ⋮ → *Añadir a pantalla de inicio* / *Instalar app*.
- **iPhone (Safari):** botón compartir → *Añadir a pantalla de inicio*.

Funciona sin conexión una vez cargada.

## Privacidad
Todo lo que escribas (objetivos, plan, inventario, ajustes de recetas) se guarda **solo en el navegador de tu
dispositivo**, en `localStorage`. No hay servidor, ni cuentas, ni analítica: este repositorio contiene únicamente
el código de la página. Copia de seguridad manual desde la pestaña *Datos* (exportar/importar `.json`).

## Cómo está hecho
Un solo `index.html` con CSS y JavaScript integrados, sin dependencias externas ni build. Más `manifest.webmanifest`,
`sw.js` (service worker) e iconos.

## Datos y fuentes
Los valores nutricionales van etiquetados dentro de la app como **VERIFICADO** (ficha/etiqueta del producto),
**ESTIMACIÓN** (base de datos genérica) o **PENDIENTE**. Conservación y seguridad alimentaria: FSA, USDA FSIS, FDA y
AESAN. Pirámide: SENC. Referencia de 400 g/día de frutas y verduras: OMS. Las fuentes concretas están enlazadas en la
pestaña *Datos* de la propia app.

No sustituye el consejo de un profesional sanitario ni de un dietista-nutricionista.
