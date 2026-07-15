# Changelog

Todos los cambios relevantes en el tema ileben-landing-v2 se documentan aquí.

## [Unreleased]

### Fixed
- **Tooltip `data-bs-html`**: El atributo `data-bs-html` usaba el booleano PHP `true` que se imprimía como `1`, causando `TypeError: Option "html" provided type "number" but expected type "boolean"` que rompía toda la cadena de inicialización de componentes Bootstrap.
- **Dropdown no cerraba**: Triple inicialización de Bootstrap Dropdown (bundle completo + módulos individuales + `new Dropdown()`) causaba handlers duplicados que impedían cerrar el dropdown al hacer click de nuevo. Solucionado eliminando el `bootstrap.bundle.min.js` y usando solo módulos individuales de `bootstrap/js/dist/*` con `getOrCreateInstance`.
- **Toast no se inicializaba**: El bloque toast no estaba incluido en la inicialización diferida de componentes Bootstrap en `main.js`.

### Changed
- **Arquitectura Bootstrap JS refactorizada**: Eliminado `import 'bootstrap/dist/js/bootstrap.bundle.min.js'` (bundle completo). Ahora se importan módulos individuales (`bootstrap/js/dist/dropdown`, `collapse`, `tab`, `carousel`, `modal`, `offcanvas`, `scrollspy`) en el top-level de `main.js`, permitiendo que el data-api de Bootstrap registre los event listeners una sola vez. Tooltip, popover y toast se inicializan manualmente con lazy-load (solo cuando existen en la página).
- **`nav.js`**: Cambiado `new Dropdown()` / `new Collapse()` → `getOrCreateInstance()` para evitar crear instancias duplicadas sobre elementos que ya tienen data-api.
- **`main.js` deferred init**: Eliminada la inicialización manual redundante de dropdown/collapse/tab/carousel (ya funcionan via data-api). Añadido `.catch()` al `Promise.all()` para que un error de un componente no mate toda la cadena.
- **Tamaño del bundle JS**: Reducido de 577KB a 514KB (−63KB, −11%) al eliminar el bundle duplicado.

### Added
- **`bs-popover` mejorado** con atributos de Bootstrap 5.3: `html` (contenido HTML), `customClass` (`data-bs-custom-class`), y `dismissable` (dismiss-on-next-click con `trigger=focus`).
- **`bs-dropdown` mejorado** con nuevas direcciones centradas: `dropdown-center` y `dropup-center` (BS 5.3).
- **Inicialización automática de Popover y Tooltip** en `main.js`: cualquier elemento con `data-bs-toggle="popover"` o `data-bs-toggle="tooltip"` se inicializa al cargar la página (lazy-loaded).
- **`bs-tabs` + `bs-tab-pane`**: Nuevo sistema de pestañas que reemplaza al obsoleto `bs-navs-tabs` (que no tenía registro de cliente). El bloque `bs-tabs` genera la navegación `ul.nav.nav-tabs` automáticamente desde los atributos de los `bs-tab-pane` hijos.
- Nuevo bloque `bs-split-carousel` y `bs-split-carousel-item` para sliders con diseño dividido (texto a la izquierda superpuesto y gran imagen a la derecha), con soporte para imagen de fondo en la tarjeta de texto y uso de Gutenberg InnerBlocks para total libertad de diseño.
- Nuevo bloque `bs-counter-card`: tarjeta con número animado (count-up) al hacer scroll, con prefijo, sufijo, título, subtítulo y modo de color (`text-bg-*`, `border-*`, `border+text`).
- Nuevo bloque `bs-card-group`: contenedor para tarjetas con dos modos de layout (`row` con `row-cols-*` y `gutters`, o `card-group` nativo de Bootstrap).
- **Bootstrap JS bundle** incluido en el bundle de Vite. Los componentes interactivos (modal, carousel, dropdown, collapse, offcanvas, tab, toast, tooltip, popover, scrollspy) funcionan sin necesidad de cargar JS adicional. *(Nota: posteriormente refactorizado a módulos individuales — ver [Unreleased].)*
- **Carousel con indicadores**: `bs-carousel` ahora genera botones indicadores reales desde el contenido renderizado, no un div vacío. Corrige `TypeError: Cannot read properties of null` de Bootstrap JS.
- **Sección de Íconos Font Awesome** en el showcase con enlace a la documentación y ejemplos de estilos (solid, regular, brands) y tamaños.
- **Showcase actualizado:** Dropdowns con variantes outline y modo oscuro; Popovers con HTML, dismissable y placement variado; Tooltips con 3 posiciones.
- **Sección de Counter Cards y Card Groups** en el showcase.
- **Sección de componentes interactivos extra** en el showcase: Collapse, Dropdown, Popover, Tooltip, Toast, Video, Parallax.
- Animación de pulso para `bs-masterplan-hotspot` con 5 opciones: none, scale, ping, bounce, glow.

### Changed
- **Versiones centralizadas:** Todas las librerías CDN ahora usan constantes únicas en `functions.php`:
  - Font Awesome `7.2.0` (`ILEBEN_FA_VERSION`) — migrado de cdnjs a jsdelivr (corrige errores WOFF2/OTS en Chrome).
  - Bootstrap `5.3.3` (`ILEBEN_BS_VERSION`)
  - Select2 `4.1.0-rc.0` (`ILEBEN_SELECT2_VERSION`)
- **Bootstrap JS:** Incluido en el bundle Vite en vez de CDN separado. *(Nota: posteriormente refactorizado a módulos individuales — ver [Unreleased].)*
- **Carousel:** Corregidos atributos del showcase (`columnsMd`→`colMd`, `marginTop`→`className`).
- **Preload LCP:** Removido `crossorigin="anonymous"` del preload de imágenes de carrusel para coincidir con el modo de credenciales de CSS background-image.
- **Font Awesome:** Migrado de cdnjs a jsdelivr — cdnjs servía las fuentes woff2 con `application/octet-stream` causando errores de decodificación UTF-8 en Chrome.
- **Variantes de botón normalizadas:** `bs-dropdown`, `bs-collapse` y `bs-popover` ahora garantizan el prefijo `btn-` en las variantes (antes `"secondary"` generaba `class="btn secondary"`).
- **`bs-dropdown` dark mode:** Reemplazada la clase obsoleta `.dropdown-menu-dark` por `data-bs-theme="dark"` (recomendado en BS 5.3.0).
- **`bs-dropdown` variantes:** Añadidas todas las variantes outline (outline-success, outline-danger, etc.).
- **`bs-dropdown` preview:** Ahora muestra `data-bs-auto-close` en el editor.
- **`bs-collapse` ID estable:** Movido `setAttributes` a `useEffect` con `[clientId]` para evitar warnings de React.
- **`bs-popover` preview:** Ahora muestra todos los atributos `data-bs-*` en el editor.
- **Eliminado `bs-navs-tabs`** — consolidado en `bs-tabs` + `bs-tab-pane` con `block.php` y `editor.js` completos.
- **Logos desde API:** Nuevos campos ACF `api_logo` y `api_logo_dark` (tipo imagen) en el tab **General** de Opciones del Tema. Cuando no existe menú asignado a `header-menu`, se muestra automáticamente el logo desde la configuración de la API, con soporte light/dark.
- **Sincronización ampliada:** El botón "Sincronizar" ahora descarga logos y sincroniza tipografías desde `/site-config`:
  - `google_fonts_stylesheet` → `google_font_family` (tab Personalización).
  - `font_family_body` → `google_font_name` (tab Personalización).
  - `logo` y `logo_dark` → se descargan y guardan como attachment en la Media Library.
- **Mensajes de sincronización:** El `admin_notices` ahora muestra los resultados de logos, tipografías y RRSS además de las plantas.
- **Header:** `header.php` usa `has_nav_menu()` para detectar si existe el menú antes de renderizar; si no existe, muestra el logo de la API en `.logo-menu`.

## [0.1.16] - 2026-07-07

### ✨ Mejoras y Nuevas Funciones
- **Generador de Componentes (Showcase):**
  - Arreglados los componentes Modales y Offcanvas para su correcto funcionamiento.
  - Agregados ejemplos de todos los tipos de Barras de Progreso (Progress bars).
  - Agregados ejemplos del sistema de grillas (Rows y Columns) similar a la documentación oficial de Bootstrap.
- **bs-masterplan-hotspot:** 
  - Nuevo estado "-sin estado-" para limpiar estados asignados.
  - Nueva opción para personalizar el ícono (FontAwesome) de cada punto (hotspot) desde el inspector.
  - Animación sutil de "pulso" agregada con GSAP a los botones de ubicación.
  - Revertida la animación de entrada del Popover a su estado nativo por comportamiento inconsistente.

## [0.1.15] - 2026-07-07

### ✨ Mejoras y Nuevas Funciones
- **bs-masterplan-hotspot:** 
  - Soporte completo para tooltips interactivos con contenido.
  - Se puede asignar una imagen a mostrar en el admin/frontend.
  - El tooltip ahora cuenta con un botón de cierre en la cabecera.
  - Comportamiento mejorado: al abrir un tooltip se cierra automáticamente el anterior.
  - Corrección visual en la cabecera del tooltip para que sea legible en temas oscuros (dark mode).
- **bs-plantas-showcase:**
  - Nueva opción en el inspector para elegir si el slider debe mostrar la `Imagen de Portada` o la `Imagen Interior`.
  - Corrección visual del selector (dropdown) en temas oscuros, haciendo el texto y fondo legibles.
- **bs-asesores:**
  - Nueva función para mostrar un código **QR** (WhatsApp o vCard) de forma automática para cada asesor, configurado desde el bloque.
  - Nuevo selector de **Orden de asesores** con opciones: predeterminado de ACF, al azar, alfabético (A-Z) o alfabético (Z-A).
- **Dependencias:**
  - FontAwesome actualizado a la versión **6.6.0**.

## [0.1.14] - 2026-03-16

### ⚡ Carga de Assets
- **Resolución por manifest de Vite:** `inc/assets.php` ahora resuelve CSS/JS desde `dist/.vite/manifest.json` para una carga determinista de archivos hasheados.
- **Helpers nuevos:** se agregan `ileben_get_vite_manifest()` y `ileben_find_manifest_asset()` para leer y consultar el manifest con cache por request.
- **Compatibilidad mantenida:** `ileben_find_asset()` queda como fallback si no existe manifest o falta una entrada.

## [0.1.12] - 2026-03-11

### 🎬 Animaciones y ScrollTrigger
- **Scroll Trigger Parámetros Editables:** Agregados controles en editor Gutenberg para ajustar `start`, `end` y debug markers de ScrollTrigger.
  - Nuevos campos en todos los bloques con soporte de animaciones (bs-column, bs-asesores, bs-card, bs-cf7, bs-fa-icon, bs-container, bs-list-group-item, bs-step-item, bs-divider, bs-plantas-slider).
  - Defaults: `start: 'top 70%'`, `end: 'top 10%'`, `markers: false`.
  - Data attributes: `data-animate-scroll-start`, `data-animate-scroll-end`, `data-animate-scroll-markers`.

- **UI Fixes - Animation Controls:** Corrección de visualización de nuevos controles Scroll en paneles de animación.
  - Agregados TextControl y ToggleControl en `animation-controls.js` con renderizado condicional por trigger.
  - Todos los editores de bloques ahora muestran campos scroll cuando trigger es "On Scroll".

- **GSAP Master Toggle:** Implementado control maestro verdadero para GSAP Core en ACF Options.
  - Desactivar "Habilitar GSAP Core" ahora previene carga de librerías GSAP desde CDN (PHP).
  - `assets/js/main.js` condiciona lazy-loading de GSAP, parallax, y animation manager según `ILEBEN_GSAP.enableGsap`.
  - Fallback seguro sin errores cuando GSAP está deshabilitado.

- **ScrollTrigger Refresh Diferido:** Múltiples refresh escalonados para resolver problemas de triggers tardíos.
  - Refresh inicial en doble `requestAnimationFrame` (post-paint).
  - Refresh diferidos a 250ms, 800ms, 1600ms para absorber cambios de layout tardío (imágenes, fuentes).
  - Refresh automático cuando se agregan nodos animables via MutationObserver.
  - Limpieza adecuada de timers en cleanup/resize handlers.

### 🔧 Cambios Técnicos
- **inc/animations.php:** Condicional de enqueue de GSAP/ScrollTrigger basada en `enable_gsap` ACF.
- **assets/js/main.js:** Gating de import de parallax y GSAP lazy-loading por configuración global.
- **assets/js/animations.js:** Métodos `refreshScrollTrigger()` y `scheduleScrollTriggerRefresh()` para refrescos diferidos.

## [0.1.11] - 2026-02-11

### 🔄 Sistema de Actualizaciones
- **GitHub Theme Updater:** Correcciones para instalaciones desde zipball.
  - Resolucion de estructura de carpetas para `style.css`.
  - Renombrado del tema al slug correcto despues de instalar.
  - Limpieza de carpetas antiguas en `/wp-content/upgrade/`.
  - Limpieza de cache de temas y headers despues de actualizar.
- **Logs condicionales:** Los logs ahora se escriben solo si `WP_DEBUG_LOG` es verdadero.
- **Activacion estable:** Se restaura el tema activo al slug correcto tras la actualizacion.

## [0.1.10] - 2026-01-28

### 🎨 Bloques de Gutenberg
- **Revisión de sincronización:** Auditoría completa de sincronización entre `block.php` y `editor.js`.
  - bs-button, bs-card, bs-column, bs-accordion, bs-carousel, bs-alert, bs-parallax, bs-gallery, bs-iframe: ✅ Sincronizados correctamente.
  - **bs-container:** Agregados controles faltantes (breakpoint, backgroundColor, textColor, padding, margin).
  - **bs-row:** Agregado atributo `noGutters` en editor.js para sincronización.
  - **bs-modal:** Renombrado `modalTitle` → `title`, agregados controles para `backdrop` y `keyboard`.
  - **bs-badge:** Agregado atributo `size` en block.php (faltaba en registro).
  - **bs-card:** Agregados controles para `link`, `target`, `variant`, `textAlign`.

- **Animaciones en bloques:** Extensión de sistema de animaciones GSAP.
  - **bs-plantas-slider:** Agregados 14 atributos de animación, panel de controles con AnimationControls.
  - **bs-divider:** Agregados atributos de animación, integración de data-attributes en frontend.
  - **Desactivado parallax:** Removido `data-animate-parallax-speed` de todos los bloques (solo disponible en bs-parallax).
  - **Removida opción parallax:** bs-plantas-slider y bs-divider usan `allowScroll: false`.

- **bs-carousel-item:** Nuevo control para enlaces.
  - Agregados atributos `link` y `target` en editor.js.
  - Save function renderiza como `<a>` si tiene link, como `<div>` si no.
  - Compatibilidad total con bootstrap carousel de HTML.

### 🔧 Cambios
- **Validación de bloques:** Corrección de discrepancias en validación (itemClasses, minHeight, carousel-caption).
- **Sincronización uniforme:** Todos los bloques principales ahora tienen sincronización verificada entre PHP y JS.

## [0.1.10] - 2026-01-14

### 🔄 Sistema de Actualizaciones
- **GitHub Theme Updater:** Nuevo sistema de actualizaciones automáticas desde GitHub Releases.
  - Implementada clase `Ileben_GitHub_Theme_Updater` en `inc/github-updater.php`.
  - WordPress detecta automáticamente nuevas versiones en GitHub Releases.
  - Actualización con 1 clic desde Apariencia → Temas.
  - Cacheo inteligente (12 horas) para minimizar peticiones a GitHub API.
  - Soporte para repos públicos y privados (requiere GitHub token).
  - Versionado semántico sincronizado con tags de Git (v0.1.10, etc.).

### 🛡️ Seguridad y Robustez
- **ACF Pro Dependency Check:** Sistema robusto de verificación de ACF Pro.
  - Aviso prominente en admin si ACF no está instalado.
  - Aviso de advertencia si solo está ACF gratuito (se requiere PRO).
  - Protección contra errores fatales si ACF no está disponible.
  - Verificaciones `function_exists('get_field')` en templates y configuración.
  
- **Protección de templates:** Todos los archivos PHP verifican disponibilidad de ACF.
  - `header.php`: Protegida llamada a `the_field()` para analytics.
  - `footer.php`: Protegidas todas las llamadas a get_field() y the_field().
  - `inc/acf-hooks.php`: Return early si ACF no está disponible.
  - `inc/setup.php`: Función helper `$get_color()` con fallbacks seguros.

### 🔧 Cambios
- **Version estática:** Cambio de `ILEBEN_THEME_VERSION` de random a '0.1.9' para versionado correcto.
- **Actualización de versión:** Sincronización entre `style.css` y `functions.php`.
- **Documentación extendida:** README.md incluye sección completa sobre flujo de actualizaciones.

### 📚 Archivos nuevos
- `inc/github-updater.php`: Clase principal para verificar y aplicar actualizaciones desde GitHub.

### 📚 Archivos modificados
- `functions.php`: Incluido github-updater.php, versión estática.
- `header.php`: Protegida llamada a the_field().
- `footer.php`: Protegidas llamadas a get_field() y the_field().
- `inc/acf.php`: Mejorada verificación de ACF Pro.
- `inc/acf-hooks.php`: Agregada verificación early return.
- `inc/setup.php`: Función helper con fallbacks para colores.
- `README.md`: Sección completa sobre GitHub Theme Updater y flujo de deployment.

### 📋 Próximas Mejoras
- [ ] Integración de CI/CD para compilación automática en deployment.
- [ ] Sistema de rollback automático en caso de error.
- [ ] Notificaciones por email de actualizaciones disponibles.

---

## [0.1.9] - 2026-01-14

### 🔧 Optimizaciones
- **Build system:** Integración de `blocks-frontend.scss` en el CSS principal.
  - El archivo `blocks-frontend.scss` ahora se importa en `assets/scss/main.scss`.
  - Se compila junto con el resto de estilos en un solo archivo `dist/assets/style-*.css`.
  - Eliminado `wp_enqueue_style` separado para blocks-frontend.
  - Mejora en rendimiento al reducir peticiones HTTP.
- **Swiper:** Efecto de fade gradient horizontal en carouseles.
  - Agregado `mask-image` con degradado lineal a `.carousel.slide`.
  - Desvanecimiento suave en bordes izquierdo y derecho (0% → 10% → 90% → 100%).
- **Parallax:** Soporte para contenedores `.container-fluid`.
  - Actualizado `parallax.js` para buscar contenedores `.container` o `.container-fluid`.
  - Mayor flexibilidad en layouts responsive.

### 📚 Archivos modificados
- `assets/scss/main.scss`: Importado `../../blocks/blocks-frontend`.
- `assets/scss/_swiper.scss`: Agregado `mask-image` para fade gradient horizontal.
- `assets/js/parallax.js`: Selector actualizado a `.container, .container-fluid`.
- `blocks/blocks.php`: Eliminado enqueue separado de blocks-frontend.css.
- `package.json`: Script `build:blocks-css` actualizado (solo compila blocks-editor.scss).

## [0.1.8] - 2026-01-08

### ✨ Nuevas funciones
- **Animaciones en bloques:** Sistema de animaciones extendido a múltiples bloques.
  - Bloque `bs-column`: Soporte para animaciones (tipo, trigger, duración, delay, easing).
  - Bloque `bs-step-item`: Animaciones por item en pasos.
  - Bloque `bs-list-group-item`: Animaciones en ítems de listas.
  - Bloque `bs-asesores`: Animaciones en tarjetas con delay escalonado por índice.
  - Trigger `on-scroll`: Soporte de delay con ScrollTrigger de GSAP.

### 🔧 Cambios
- **Función helper `bootstrap_theme_get_animation_attributes()`:** Ahora siempre emite valores por defecto para trigger, duración, delay y easing cuando se establece el tipo de animación.
- **Animaciones en scroll:** Modificada función `animateOnScroll()` en `assets/js/animations.js` para soportar delay explícito en configuración GSAP.
- **Renderizado dinámico:** Bloque `bs-list-group` ahora renderiza sus items internos dinámicamente para preservar atributos de animación.

### 📚 Archivos modificados
- `inc/blocks-helpers.php`: Mejorada lógica de `bootstrap_theme_get_animation_attributes()`.
- `blocks/bs-column/editor.js` y `blocks/bs-column/block.php`: Añadido soporte de animaciones.
- `blocks/bs-step-item/editor.js`: Panel de animación para items.
- `blocks/bs-steps/block.php`: Renderizado de animaciones en pasos.
- `blocks/bs-list-group-item/editor.js` y `blocks/bs-list-group-item/block.php`: Sistema dinámico de renderizado.
- `blocks/bs-list-group/block.php`: Uso de `$inner_block->render()` para renderizado dinámico de items.
- `blocks/bs-asesores/editor.js` y `blocks/bs-asesores/block.php`: Animaciones en tarjetas de asesores con delay escalonado.
- `assets/js/animations.js`: Soporte de delay en `animateOnScroll()`.

## [0.1.7] - 2026-01-06

### ✨ Nuevas funciones
- **Bloque bs-asesores:** Nuevo bloque dinámico que carga asesores desde ACF options.
  - Configuración de columnas por breakpoint (MD/LG).
  - Layout horizontal (foto + datos) o vertical (foto arriba).
  - Avatar en forma redonda o completa (card-img-top).
  - Modo de contenido: mostrar texto, botones o ambos.
  - Botón WhatsApp con enlace wa.me (código país 56 por defecto).
  - Botón Email con mailto.
  - Estilos card con hover y responsive.
- **Bloque bs-steps:** Mejoras en animación de barra de progreso.
  - Animación con GSAP (gsap.fromTo) en lugar de requestAnimationFrame.
  - Cálculo pixel-perfect de posición usando getBoundingClientRect().
  - Soporte para layout vertical y horizontal.
  - Toggle para activar/desactivar animación.

### 🔧 Cambios
- **ACF Options:** Eliminados campos WhatsApp del tab "Asesores y RRSS".
  - Removido subcampo "Texto Whatsapp" del repeater de asesores.
  - Removido campo global "WhatsApp" de redes sociales.
- **ACF Options:** Añadido campo "Logo Footer" en el tab Footer.
  - Campo tipo imagen con return format URL.
  - Opcional para personalizar logo en pie de página.

### 📚 Archivos nuevos
- `blocks/bs-asesores/block.php`: Renderizado dinámico del bloque.
- `blocks/bs-asesores/editor.js`: Controles y preview del editor.
- CSS: Estilos para `.bs-asesor-card` y `.bs-asesor-avatar` en blocks-frontend.css y blocks-editor.css.

### 📚 Archivos modificados
- `blocks/bs-steps/steps-animation.js`: Reescrito para usar GSAP y cálculo DOM preciso.
- `blocks/blocks.php`: Registrado bs-asesores en $blocks_with_editors.
- `acf-json/group_ileben_options.json`: Estructura actualizada con nuevo campo footer_logo.

## [0.1.6] - 2025-01-01

### 🔧 Cambios
- **ACF Options:** Reorganización de campos en "Configuración del tema".
  - Nuevo tab "Footer" con campos: "Texto Legal Footer" y "Código Extra" (movido desde General).
  - Eliminados campos "Teléfono" y "Correo" del tab General.
  - El código extra ahora se gestiona exclusivamente desde el tab Footer.

### 📚 Archivos modificados
- `acf-json/group_ileben_options.json`: Estructura actualizada de tabs y campos.

## [0.1.5] - 2025-12-31

### ✨ Nuevas funciones
- **CF7 Multistep:** Sistema completo de formularios multipaso con Contact Form 7.
  - Parsing robusto de marcadores `[step_break label="Paso X"]` incluso cuando están envueltos en `<p>` u otros elementos.
  - Validación por campo con toasts de Bootstrap personalizables (mensaje configurable desde ACF).
  - Indicador de pasos horizontal con badges (`badge rounded-circle` para números/checkmarks, `badge rounded-pill` para etiquetas).
  - Estados visuales: completado (verde con ✓), actual (azul primario), próximo (gris secundario).
  - Barra de progreso opcional configurable desde ACF.
  - Títulos de paso opcionales con dos modos: mostrar etiqueta personalizada o número de paso.
  - Animaciones configurables: fade, slide, lift, zoom o sin animación.
  - Duración y easing de animación personalizables desde ACF.
  - Navegación con botones "Anterior" y "Siguiente" con etiquetas configurables.
  - Todos los elementos visuales respetan configuración ACF (toggles para títulos, barra de progreso, indicador de pasos).

### 🔧 Correcciones
- **CF7 Config:** Corregido casting de booleans desde ACF para evitar que valores vacíos (`''`) se interpreten como `true`.
- **CF7 Indicador:** Cuando el modo de título es "número", solo se muestra el círculo con número, sin etiqueta adicional.
- **CF7 Estilos:** Migración completa de estilos inline a SCSS (`_cf7.scss`) para mejor mantenimiento.

### 📚 Archivos modificados
- `assets/js/cf7-bootstrap.js`: Parser de pasos, validación, animaciones, indicador y barra de progreso.
- `assets/scss/_cf7.scss`: Estilos completos para multistep (animaciones, indicador, progress bar, toasts).
- `inc/assets.php`: Localización de configuración CF7 desde ACF a JavaScript.
- `acf-json/group_ileben_options.json`: Nuevos campos ACF para configuración CF7 multistep.

## [0.1.4] - 2025-12-17

### 🔧 Correcciones
- Bloque `bs-container`: el anclaje se guarda correctamente; se eliminó un registro duplicado en `blocks/blocks.js` y se añadió soporte explícito de `anchor` en PHP y editor.

### ✨ Nuevas funciones
- GSAP: pestaña en opciones del tema (ACF JSON) para habilitar GSAP y plugins.
- Inicializador `assets/js/gsap-loader.js` e importación en `assets/js/main.js`.
- `inc/assets.php`: se expone `window.ILEBEN_GSAP` con configuración desde ACF; los scripts de footer (`extra_code`) pueden usar `gsap` y `ScrollTrigger`.

## [0.1.3] - 2025-12-16

### ✨ Nuevas funciones
- Bloque `bs-plantas-slider`: slider con filtros en cliente (dormitorios/baños), Fancybox, navegación, paginaciones múltiples (bullets, fraction, progressbar, scrollbar, none), efectos Swiper (slide, fade, cube, coverflow, flip, cards) y slides per view por viewport (mobile/tablet/desktop).
- Filtrado instantáneo sin AJAX usando `data-dorm`/`data-bano`, con alerta de "sin resultados" y re-render de Swiper.

### 🔧 Cambios
- Build dividido: `npm run build` (frontend Vite) y `npm run build:back-css` (Sass para editor) generan `dist/assets/style-*.css`, `main-*.js` y `editor.css`.
- `inc/assets.php` ahora encola `editor.css` directamente en Gutenberg.

## [0.1.2] - 2025-12-16

### ✨ Nuevas funciones
- Bloque `bs-container`: Opción de Fondo → Tipo "Imagen" con selector, tamaño, posición, repetición y attachment. Renderiza estilos en línea validados.
- Swiper: Configuración global desde ACF (tab "Otros") y overrides por bloque en `bs-container` (paginación, navegación, loop, speed, autoplay, delay, slidesPerView, spaceBetween).
 - Shortcodes: `[lazy_image]` para imágenes con lazyload basado en placeholder y `[iframe_facade]` para facades de iframes.
 - Shortcode adicional: `[loader]` para renderizar el preloader del sitio en cualquier contenido.

### 🔧 Correcciones
- Editor (`blocks/bs-container/editor.js`): Limpieza de paneles; controles de imagen movidos a "Background". Arreglo de arrays y imports para eliminar errores de sintaxis.
- JS (`assets/js/sliders.js`): Corrección de precedencia al combinar `??` y `||` en merges de configuración.

### 📚 Docs
- README: Instrucciones para usar `bs-container` como Swiper y cómo configurar Fondo → Imagen.
 - README: Sección de Shortcodes con ejemplos de `[lazy_image]`, `[iframe_facade]` y `[loader]`.
 - Licencia: Aclarado en README el uso de GNU GPL v3.0.

## [0.1.1] - 2025-12-16

### ✨ Mejoras
- ACF: Renombrado tab principal a "Colores y Extras BS" y añadido sub-tabs para organizar variables.
- ACF: Nuevos campos para controlar variables de Bootstrap 5.3:
	- Colores base, grises, temáticos y sistema.
	- Bordes y radios (`--bs-border-width`, `--bs-border-style`, `--bs-border-radius` y variantes).
	- Sombras (`--bs-box-shadow`, `--bs-box-shadow-sm`, `--bs-box-shadow-lg`, `--bs-box-shadow-inset`).
	- Focus ring (`--bs-focus-ring-width`, `--bs-focus-ring-opacity`, `--bs-focus-ring-color`).
- PHP: `inc/assets.php` ahora inyecta todas las variables anteriores como CSS variables en `:root` usando valores ACF.
- Tipografía: mantiene `--bs-body-font-family`, `--bs-body-font-size`, `--bs-body-font-weight` desde ACF (con ajuste móvil).

### 🧹 Limpieza
- SCSS: Eliminada la estructura modular (base, utilities, layout, components, pages). Se mantiene únicamente `assets/scss/main.scss`.
- Theming: Personalización de Bootstrap ahora vía ACF (CSS variables) en lugar de Sass.

### 🔧 JavaScript
- `assets/js/router.js`: Removida importación y llamada a `animations`. Las animaciones se gestionan externamente.

### 📚 Docs
- README: Actualizado para reflejar ACF como fuente de theming, categorías de variables y estructura SCSS simplificada.

## [0.1.0] - 2025-12-15

### ✨ Características iniciales

#### Core del Tema
- Tema WordPress móvil-first con soporte PHP 8.2+
- Plantillas base: header.php, footer.php, index.php, front-page.php
- Estructura modular con archivos en `inc/` para setup, assets, ACF e helpers
- Soporte de menús: Primary Menu (navbar Bootstrap)
- Soporte de miniaturas de entrada: banner (1600x900), banner_mobile (900x1200)

#### Build & Assets
- Configuración Vite para bundling JS/SCSS con manifest.json
- PostCSS + Autoprefixer para compatibilidad CSS cross-browser
- Enqueue inteligente de assets via `ileben_theme_manifest()` helper
- Soporte dinámico de Google Fonts desde ACF Options

#### Estilos (SCSS)
- Sistema de variables modular (colores, tipografía, breakpoints)
- Estructura escalable: base, utilities, layout, components, pages
- Integración Bootstrap 5 (partial imports para tree-shake)
- Componentes: navbar, botones, banner, preloader, iframe facades
- Mobile-first responsive design con media queries progresivas
- Soporte para temas oscuro/claro vía CSS variables

#### JavaScript
- Entry point `main.js` con carga de módulos
- **Router**: navegación por body class para rutas específicas
- **Preloader**: overlay visible durante carga, ocultamiento automático + failsafe (5s)
- **Lazyload**: IntersectionObserver para imágenes `.lazyload` + fallback
- **Facade**: click-to-load para iframes (YouTube, Vimeo, etc.)
- **Nav**: Bootstrap Collapse + Dropdown integrado
- **Sliders**: Swiper.js con configuración responsive
- **Fancybox**: Modal lightbox para galerías
- **Animations**: GSAP para animaciones suaves (banner fade-in)

#### ACF Pro Integration
- Sincronización JSON automática en `acf-json/`
- Field Group: Banner Landing (título, texto, CTA, imagen)
- Field Group: Theme Options (Google Font, colores primario/secundario)
- Helpers en `template-tags.php` para integración fluida

#### Helpers PHP
- `ileben_lazy_image()` – Carga perezosa de imágenes con placeholders
- `ileben_iframe_facade()` – Facade de iframe click-to-load
- `ileben_render_loader()` – Renderización del cargador inicial
- `ileben_google_font_family()` – Lectura de fuente configurada en ACF
- `ileben_asset_uri()` – Resolución de URIs de assets desde manifest
- `ileben_asset_css_list()` – Listado de CSS importados

#### Imágenes & Placeholders
- SVG placeholders para imágenes y iframes
- Base lista para blade masks y blur effects

#### Template Parts
- `template-parts/header/navbar.php` – Navegación Bootstrap con responsive toggle
- `template-parts/banner/main-banner.php` – Banner principal ACF-driven
- Base lista para secciones flexibles

#### npm Scripts
- `npm run dev` – Vite dev server con watch
- `npm run build` – Compilación optimizada para producción
- `npm run preview` – Vista previa local del build

#### Documentación
- README.md completo con guía de instalación y personalización
- CHANGELOG.md para tracking de cambios
- Código bien comentado y estructura auto-explicativa

### 🎯 Próximas versiones

- [ ] WP_Bootstrap_Navwalker para dropdowns avanzados
- [ ] Secciones flexibles ACF adicionales (hero, cta, testimonios, etc.)
- [ ] Soporte WooCommerce
- [ ] PageSpeed optimizations (critical CSS, async JS defer)
- [ ] Dark mode toggle
- [ ] Internacionalización (i18n)
- [ ] Pruebas unitarias para JS
- [ ] CI/CD con GitHub Actions
- [ ] Documentación API extendida

---

**Autor:** ileben.cl  
**Licencia:** © 2025
