# Changelog

Todos los cambios relevantes en el tema ileben-landing-v2 se documentan aquí.

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
