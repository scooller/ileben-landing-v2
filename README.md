# ileben-landing-v2

Tema de WordPress moderno y optimizado para mobile-first, diseñado para landing pages de alto rendimiento.

**Autor:** [ileben.cl](https://ileben.cl)  
**Versión:** 0.1.14  
**Compatibilidad:** PHP 8.3+, WordPress 6.0+ (tested 6.4), ACF Pro

---

## 🎯 Características

- **Mobile-first design** – Optimizado para dispositivos móviles desde el inicio
- **Bootstrap 5** – Framework CSS moderno con componentes personalizables
- **GSAP** – Animaciones suaves y de alto rendimiento
- **Swiper.js** – Carouseles y sliders responsive
- **Fancybox** – Galerías de imágenes elegantes con modal lightbox
- **Bloque bs-plantas-slider** – Slider con filtros en cliente (dormitorios/baños), Fancybox, navegación, paginación múltiple y efectos Swiper
- **Preloader** – Cargador de sitio visible antes del renderizado inicial
- **Lazy Loading** – Carga perezosa de imágenes con IntersectionObserver fallback
- **Iframe Facade** – Click-to-load para iframes con Bootstrap Placeholders (sin imágenes)
- **Google Fonts** – Integración flexible de fuentes tipográficas
- **ACF Pro** – Opciones de tema (JSON), colores, tipografía, sociales y selector claro/oscuro
- **Build optimizado con Vite** – Bundling de assets con hashing automático y sourcemaps
- **Variables Bootstrap vía ACF** – Personaliza colores, tipografía, bordes, sombras y focus-ring desde el admin
- **SCSS mínimo** – Solo `assets/scss/main.scss`; el theming se controla por CSS variables

---

## 📁 Estructura del Tema

```
ileben-landing-v2/
├── style.css                             # Cabecera del tema WordPress
├── functions.php                         # Bootstrap del tema
├── header.php                            # Plantilla de encabezado
├── footer.php                            # Plantilla de pie de página
├── index.php                             # Fallback template
├── front-page.php                        # Landing page principal
├── package.json                          # Dependencias npm
├── vite.config.js                        # Configuración del bundler
├── postcss.config.js                     # Configuración de PostCSS (autoprefixer)
├── inc/
│   ├── setup.php                         # Setup del tema (soportes, menús, tamaños de imagen)
│   ├── assets.php                        # Enqueue de assets Vite + Google Fonts + Font Awesome
│   ├── acf.php                           # Integración ACF Pro (JSON sync y options page)
│   ├── github-updater.php                # GitHub Theme Updater (actualizaciones automáticas)
│   ├── color-scheme-switcher.php         # Widget flotante con selector claro/oscuro
│   └── template-tags.php                 # Helpers (lazy images, iframe facade con placeholders, loader)
├── template-parts/
│   ├── header/
│   │   └── navbar.php                    # Navegación principal con Bootstrap
│   └── banner/
│       └── main-banner.php               # Banner principal (ACF-driven)
├── assets/
│   ├── scss/
│   │   └── main.scss                     # Único entry point de estilos (Bootstrap + estilos mínimos)
│   ├── js/
│   │   ├── main.js                       # Entry point JS
│   │   ├── router.js                     # Router basado en body class
│   │   ├── preloader.js                  # Control del cargador inicial
│   │   ├── lazyload.js                   # IntersectionObserver para imágenes
│   │   ├── facade.js                     # Click-to-load para iframes (Bootstrap placeholders)
│   │   ├── nav.js                        # Bootstrap navbar toggles y dropdowns
│   │   ├── sliders.js                    # Inicialización Swiper
│   │   └── fancybox.js                   # Inicialización Fancybox
│   └── images/
│       └── placeholders/
│           └── placeholder-image.svg     # Placeholder para imágenes
├── acf-json/                             # Sincronización JSON de campos ACF
└── dist/                                 # Salida compilada (generada con npm run build)
```

---

## 🚀 Instalación y Setup

### 1. Requisitos previos

- Node.js 20+ (incluye npm)
- WordPress 6.0+ (tested 6.4)
- PHP 8.3+
- ACF Pro (recomendado para campos personalizados)

### 2. Instalación del tema

```bash
# Navega a la carpeta del tema
cd wp-content/themes/ileben-landing-v2

# Instala las dependencias
npm install

# Compila los assets
npm run build:all

# (Opcional) Modo desarrollo con watch
npm run dev
```

### 3. Configuración en WordPress

1. **Activa el tema** desde Apariencia → Temas
2. **Logo del sitio:**
  - Personalizar → Identidad del sitio → Logo
  - El tema soporta custom-logo y lo renderiza fluido
3. **Asigna un menú:**
   - Ve a Apariencia → Menús
   - Crea o edita un menú
   - Asígnalo a "Primary Menu"
4. **Opciones del tema (ACF):**
  - Campos gestionados vía JSON en acf-json/ (sin redundancia en PHP)
  - Branding: Google Font, colores primario/secundario
  - Social: Facebook, Instagram, LinkedIn, WhatsApp (+56)
  - Selector de tema: mostrar/ocultar switcher y tema por defecto (auto/claro/oscuro)

---

## 🔄 Sistema de Actualizaciones desde GitHub

El tema incluye un **GitHub Theme Updater** que permite actualizar el theme directamente desde el admin de WordPress sin necesidad de SSH, FTP o cPanel.

> 📚 **Para documentación completa y troubleshooting, ver [GITHUB_UPDATER.md](GITHUB_UPDATER.md)**

### 🛠️ Herramientas de Debug

Si acabas de publicar un release y no aparece la actualización, usa estas URLs:

**Ver estado del updater:**
```
https://tu-sitio.com/wp-admin/themes.php?ileben_debug_updater=1
```
Muestra: versión actual, última versión en GitHub, si hay actualización disponible, estado del caché, etc.

**Forzar verificación inmediata:**
```
https://tu-sitio.com/wp-admin/themes.php?ileben_force_update=1
```
Limpia el caché y fuerza a WordPress a verificar actualizaciones inmediatamente.

### 📋 Cómo Funciona

1. **Desarrollo Local:** Haces cambios en el código y compilas los assets con `npm run build:all`
2. **Git Push:** Subes los cambios a GitHub (`git push origin main`)
3. **GitHub Release:** Creas un Release con un tag que coincida con la versión (ej: `vX.Y.Z`)
4. **WordPress Detecta:** El theme updater verifica automáticamente si hay nuevas versiones
5. **Admin Notifica:** Se muestra "Actualizar ahora" en Apariencia → Temas
6. **Un Clic:** Haces clic y se descarga e instala automáticamente

### 🔧 Flujo Detallado de Actualización

#### Paso 1: Actualizar Versión Localmente

```bash
# Edita style.css y functions.php con la nueva versión
Version: X.Y.Z
```

En `style.css`:
```css
/*
Theme Name: ileben-landing-v2
Version: X.Y.Z
...
*/
```

En `functions.php`:
```php
define('ILEBEN_THEME_VERSION', 'X.Y.Z');
```

#### Paso 2: Compilar y Hacer Commit

```bash
# Compila los assets
npm run build

# Haz commit de los cambios
git add .
git commit -m "Version bump to X.Y.Z - Add new features and fixes"
git push origin main
```

#### Paso 3: Crear Release en GitHub

1. Ve a https://github.com/scooller/ileben-landing-v2/releases
2. Clic en **"Create a new release"**
3. Completa los campos:
  - **Tag version:** `vX.Y.Z` (IMPORTANTE: debe coincidir con Version en style.css)
  - **Release title:** `Version X.Y.Z`
   - **Description:** (opcional) Describe los cambios realizados
   - **Publish release:** Clic en botón

#### Paso 4: Verificar en WordPress

1. Ve a **WordPress Admin → Apariencia → Temas**
2. Verás **"Actualizar ahora"** debajo de ileben-landing-v2 (puede tardar hasta 12 horas si el sitio no visita esa página)
3. Clic en "Actualizar ahora"
4. WordPress descargará e instalará automáticamente el ZIP desde GitHub

### 📊 Diagrama del Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│ DESARROLLO LOCAL                                                │
│ ├─ Código + npm run build                                       │
│ ├─ Actualizar Version en style.css y functions.php              │
│ └─ git push origin main                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ GITHUB                                                          │
│ ├─ Code está en main                                            │
│ └─ Crear Release con tag vX.Y.Z                                 │
│    └─ Genera automáticamente ZIP (zipball_url)                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ WORDPRESS PRODUCTION                                            │
│ ├─ inc/github-updater.php verifica GitHub API cada 12 horas     │
│ ├─ Detecta nueva versión (X.Y.Z > A.B.C)                        │
│ └─ Muestra "Actualizar ahora" en Apariencia → Temas             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ ADMIN WORDPRESS                                                 │
│ ├─ 1 clic en "Actualizar ahora"                                 │
│ ├─ Descarga ZIP desde GitHub                                    │
│ ├─ Descomprime en wp-content/themes/ileben-landing-v2/          │
│ ├─ Ejecuta npm run build:all en servidor (opcional)             │
│ └─ ✅ Theme actualizado                                          │
└─────────────────────────────────────────────────────────────────┘
```

### 🔍 Archivos Relacionados

- **inc/github-updater.php** – Clase que verifica GitHub y proporciona datos de actualización
- **style.css** – Header con Version (usado para comparación)
- **functions.php** – Define `ILEBEN_THEME_VERSION` (debe coincidir con style.css)

### ⚙️ Configuración del Updater

En `inc/github-updater.php` puedes personalizar:

```php
private $github_user = 'scooller';      // Tu usuario de GitHub
private $github_repo = 'ileben-landing-v2';  // Nombre del repo
private $github_token = null;           // Token si es repo privado (null para público)
private $cache_hours = 12;              // Cacheo de verificación
```

### 🔒 Para Repositorios Privados

Si el repositorio es privado:

1. Genera un **Personal Access Token** en GitHub:
   - Ve a **Settings → Developer settings → Personal access tokens → Tokens (classic)**
   - Crea un token con permisos `repo`

2. En `inc/github-updater.php`, agrega tu token:
```php
private $github_token = 'ghp_xxxxxxxxxxxxxxxxxxxxx';
```

### ✅ Ventajas de este Sistema

- ✅ **Sin SSH necesario** – Todo desde el admin de WordPress
- ✅ **Versionado limpio** – Git + Semantic Versioning
- ✅ **Rollback fácil** – Puedes volver a una versión anterior desde GitHub Releases
- ✅ **Histórico visible** – Todos los cambios documentados en GitHub
- ✅ **Seguro** – Usa API oficial de GitHub, sin confianza en terceros
- ✅ **Automatizable** – Si integras CI/CD, puedes compilar y crear releases automáticamente

### 🚀 Tips Adicionales

**Para acelerar la verificación durante desarrollo:**
- Elimina el transient en WordPress: `Plugins → Database → wp_transients` (busca `ileben_theme_update_check`)
- O accede a Apariencia → Temas y WordPress verificará inmediatamente

**Cambios sin publicar Release:**
- Los cambios en `main` NO generan actualización hasta que crees un Release
- Esto te permite mergear código sin afectar usuarios en producción

---

## 🛠 Scripts npm

```bash
# Desarrollo con servidor Vite (watch mode)
npm run dev

# Compilación para producción
npm run build

# Preview de build local
npm run preview

# Estilos del editor (Gutenberg)
npm run build:back-css
```

---

## 📦 Dependencias principales

### Dependencies
- **bootstrap** (^5.3) – Framework CSS responsive y componentes
- **gsap** (^3.14) – Animaciones de alto rendimiento
- **swiper** (^12.0) – Carouseles y sliders modernos
- **@fancyapps/ui** (^6.1) – Galerías lightbox con Fancybox

### DevDependencies
- **vite** (^5.4.8) – Bundler moderno ultra-rápido
- **sass** (^1.79.4) – Preprocesador SCSS
- **autoprefixer** (^10.4.20) – Prefijos CSS automáticos
- **postcss** (^8.4.47) – Transformaciones CSS

---

## 🎨 Personalización

### Opciones de Tema (ACF) – Colores y Extras BS

El tema expone las variables de Bootstrap 5.3 como CSS variables en `:root`, configurables desde el admin (ACF → Opciones de tema → "Colores y Extras BS"). Esto evita modificar Sass y permite theming instantáneo.

Categorías disponibles:
- Colores Base: `--bs-blue`, `--bs-indigo`, `--bs-purple`, `--bs-pink`, `--bs-red`, `--bs-orange`, `--bs-yellow`, `--bs-green`, `--bs-teal`, `--bs-cyan`, `--bs-gray`, `--bs-gray-dark`, `--bs-black`, `--bs-white`
- Escala de grises: `--bs-gray-100` … `--bs-gray-900`
- Temáticos: `--bs-primary`, `--bs-secondary`, `--bs-success`, `--bs-info`, `--bs-warning`, `--bs-danger`, `--bs-light`, `--bs-dark`
- Sistema: `--bs-body-color`, `--bs-body-bg`, `--bs-link-color`, `--bs-link-hover-color`, `--bs-border-color`, `--bs-emphasis-color`, `--bs-secondary-color`, `--bs-secondary-bg`, `--bs-tertiary-color`, `--bs-tertiary-bg`, `--bs-code-color`, `--bs-highlight-color`, `--bs-highlight-bg`
- Bordes y radios: `--bs-border-width`, `--bs-border-style`, `--bs-border-radius`, `--bs-border-radius-sm`, `--bs-border-radius-lg`, `--bs-border-radius-xl`, `--bs-border-radius-xxl`, `--bs-border-radius-pill`
- Sombras: `--bs-box-shadow`, `--bs-box-shadow-sm`, `--bs-box-shadow-lg`, `--bs-box-shadow-inset`
- Focus ring: `--bs-focus-ring-width`, `--bs-focus-ring-opacity`, `--bs-focus-ring-color`

Además, puedes ajustar tipografía base: `--bs-body-font-family`, `--bs-body-font-size`, `--bs-body-font-weight`.

Implementación: las variables se inyectan en el `<head>` desde `inc/assets.php` usando `get_field(..., 'option')`.

### Bloque `bs-container`

Permite usar el contenedor como slider Swiper y definir fondos, incluyendo imágenes.

- Use as Swiper: activa clases `swiper js-swiper` y muestra el panel "Swiper Settings" en el inspector.
- Overrides por bloque (toman prioridad sobre lo global):
  - `Pagination`, `Navigation`, `Loop`, `Autoplay`
  - `Slides per view` (ej: 1, 1.1), `Space between (px)`, `Speed (ms)`, `Autoplay delay (ms)`
- Configuración global: desde ACF → Opciones → "Otros" → "Swiper (Global)". Se usa como fallback cuando el bloque no define un override.

Fondo → Tipo: selecciona `None`, `Solid`, `Gradient` o `Image`.

- `Solid`: elige color.
- `Gradient`: dirección (`to right`, `to left`, `to bottom`, `to top`, `45deg`, `135deg`) y colores `From` / `To`.
- `Image`: selector de imagen y ajustes `Size` (cover/contain/auto), `Position`, `Repeat`, `Attachment`.

Notas:
- El bloque renderiza estilos en línea seguros para el fondo.
- Al activar Swiper, el JS normaliza la estructura interna y aplica configuración combinando globales + overrides del bloque.

### Google Fonts

---

## 🔧 Shortcodes disponibles

Usa los helpers directamente en el editor clásico o bloques de shortcode.

- lazyload de imagen:

```
[lazy_image id="123" size="large" class="img-fluid" alt="Texto alternativo" loading="lazy"]
```

- Facade de iframe (YouTube/Vimeo u otros `embed_url`):

```
[iframe_facade embed_url="https://www.youtube.com/embed/VIDEO_ID" button_label="Reproducir" title="Video" ratio="16x9"]
```

Notas:
- `id` debe ser el ID de adjunto de la imagen en WordPress.
- Los atributos `class`, `alt`, `width`, `height`, `loading` son opcionales.
- `ratio` se mapea a utilidades Bootstrap (ej: 16x9, 4x3, 1x1).

Configura la fuente en ACF Opciones con el valor por defecto:
```
Open Sans:wght@400;600;700
```

O cualquier otra familia de Google Fonts con sus pesos:
```
Poppins:300,400,500,600,700
Merriweather:400,700
```

### Secciones personalizadas

Agrega nuevas secciones en `template-parts/sections/`. El theming se hereda automáticamente desde las variables CSS.

---

## 📋 Helpers disponibles

### Imagen perezosa

```php
<?php
echo ileben_lazy_image(
  $image_id, 
  'large',
  ['class' => 'custom-class img-fluid']
);
?>
```

### Facade de iframe (Bootstrap Placeholders)

```php
<?php
echo ileben_iframe_facade([
  'embed_url' => 'https://www.youtube.com/embed/...',
  'button_label' => 'Reproducir',
  'title' => 'Título accesible',
  'ratio' => '16x9' // 4x3, 1x1, etc.
]);
?>
```

### Cargador

Se renderiza automáticamente en `front-page.php`. El loader se oculta cuando la página se ha cargado completamente o después de 5 segundos (failsafe).

---

## 🎬 Bloques con Animaciones GSAP

El tema incluye un sistema completo de animaciones GSAP integrado en los bloques. Cada bloque con soporte de animaciones expone un panel "Animation" en el inspector de Gutenberg.

### Bloques con Soporte de Animaciones

#### ✅ **bs-card** – Tarjetas animadas
- Tipos de animación: Fade, Slide, Scale, Rotate, Bounce, Elastic, Flip, Pulse
- Triggers: On Load, On Scroll, On Hover, On Click
- Configuración: Duration, Delay, Easing, Distance, Rotation, Scale, Parallax Speed
- Ideal para: Cards en galería, portafolio, listados de productos

#### 📦 Próximos (Usar template en `blocks/animation-controls.js`):
- **bs-container** – Contenedores fluidos
- **bs-column** – Columnas Bootstrap
- **bs-list-group** – Listas con items
- **bs-badge** – Badges pequeños

### Tipos de Animación (19)

**Fade (5)**: fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight  
**Slide (4)**: slideUp, slideDown, slideLeft, slideRight  
**Scale (3)**: scaleIn, scaleUp, scaleDown  
**Rotate (2)**: rotate, rotateFast  
**Effects (5)**: bounce, elastic, flip, flipX, pulse  

### Triggers (4)

- **on-load** – Ejecuta al cargar la página
- **on-scroll** – ScrollTrigger (elemento entra en viewport)
- **on-hover** – Efectos interactivos con mouse
- **on-click** – Animación al hacer clic

### Configuraciones

```
Timing:    Duration (0.1-3s), Delay (0-5s), Repeat (0-5), Yoyo
Easing:    10 opciones (linear, power1-4, back, elastic, bounce, etc.)
Parameters: Distance (px), Rotation (°), Scale (0.1-2), Parallax Speed
Effects:    Hover (scale, brightness, shadow, lift, glow)
Mobile:     Toggle para habilitar/deshabilitar en móvil
```

### Uso en Editor

1. Selecciona un bloque compatible (ej: Card)
2. Inspector → Expande "Animation"
3. Configura: Type, Trigger, Duration, Delay, Ease y parámetros específicos
4. ¡Listo! Se guarda automáticamente

### Ejemplo: Card con Fade In Up

```
Animation Type: fadeInUp
Trigger: on-scroll
Duration: 0.6s
Delay: 0s
Easing: power2.inOut
Distance: 40px
```

### Archivos Relacionados

- **assets/js/animations.js** – Gestor GSAP (GSAPAnimationManager)
- **blocks/animation-controls.js** – Componentes Gutenberg reutilizables
- **inc/blocks-helpers.php** – Helper PHP para data attributes
- **inc/animations.php** – Enqueue de GSAP, ScrollTrigger y scripts

---

## 🧱 Guía de Desarrollo de Bloques

### Convención: Output Buffering en `render_callback`

Todos los bloques deben usar `ob_start()` / `ob_get_clean()` en sus funciones `render_callback`. **No usar concatenación de strings** (`$output .= '<...'`).

**✅ Correcto:**
```php
function bootstrap_theme_render_bs_ejemplo_block( $attributes, $content ) {
    $class = 'ejemplo';
    if ( ! empty( $attributes['className'] ) ) {
        $class .= ' ' . $attributes['className'];
    }
    // Pre-construir atributos complejos antes de ob_start()
    $data_attrs = ! empty( $attributes['id'] ) ? ' data-id="' . esc_attr( $attributes['id'] ) . '"' : '';

    ob_start();
    ?>
    <div class="<?php echo esc_attr( $class ); ?>"<?php echo $data_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
        <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
    </div>
    <?php
    return ob_get_clean();
}
```

**❌ Incorrecto:**
```php
function bootstrap_theme_render_bs_ejemplo_block( $attributes, $content ) {
    $output  = '<div class="ejemplo">';
    $output .= $content;
    $output .= '</div>';
    return $output;
}
```

### Reglas de Escaping

| Contexto | Función |
|---|---|
| Atributo HTML (texto plano) | `esc_attr()` |
| Contenido HTML visible | `esc_html()` |
| URL en `href`/`src` | `esc_url()` |
| Strings i18n para atributos | `esc_attr__()` / `esc_attr_e()` |
| HTML pre-construido o `$content` confiable | `// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped` |

### Sintaxis Alternativa PHP en Templates

Usa la sintaxis alternativa de PHP dentro de los templates para mayor legibilidad:

```php
ob_start();
?>
<ul>
    <?php foreach ( $items as $item ) : ?>
        <li><?php echo esc_html( $item ); ?></li>
    <?php endforeach; ?>
</ul>
<?php if ( $show_footer ) : ?>
    <footer>...</footer>
<?php endif; ?>
<?php
return ob_get_clean();
```

### Excepción: `inc/bootstrap-navwalker.php`

`Bootstrap_Nav_Walker` extiende `Walker_Nav_Menu` de WordPress, cuya API nativa acumula output en `$output` de forma incremental. Este archivo **no debe** convertirse al patrón `ob_start()`.

---

## ⚡ Optimizaciones de rendimiento
- **Preloader visible** – Mejora la percepción de velocidad
- **Lazy loading nativo** – `loading="lazy"` en imágenes + IntersectionObserver fallback
- **Bundle optimizado** – Vite genera chunks con hashing automático
- **CSS variables** – Theming instantáneo sin recompilar Sass
- **Animaciones GSAP** – GPU-aceleradas para mejor rendimiento
---

## 🔗 ACF Pro Integration
 Loader (preloader del sitio):

Campos gestionados vía JSON en `acf-json/` y consumidos con `get_field('...', 'option')`.

### Group: Opciones de Tema
---

El tema está listo para:
- Extender con nuevas secciones
- Integrar con WooCommerce (con actualizaciones)
- Agregar más campos ACF según necesidad
- Crear versiones personalizadas por cliente

Para cambios en el build, edita `vite.config.js` y `postcss.config.js`.

---

## 📄 Licencia

ileben.cl © 2025
