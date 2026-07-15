<?php

/**
 * Generador de Página Showcase para revisión de bloques.
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Agrega el botón "Generar Showcase" a la barra de administración.
 */
function ileben_add_showcase_admin_bar_node($wp_admin_bar)
{
  // Solo visible para administradores/editores
  if (!current_user_can('edit_pages')) {
    return;
  }

  $url = wp_nonce_url(
    admin_url('admin-post.php?action=ileben_generate_showcase'),
    'ileben_generate_showcase_action'
  );

  $wp_admin_bar->add_node([
    'id'    => 'ileben-showcase-generator',
    'title' => '<span class="ab-icon" style="margin-top: 2px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20" height="20" fill="currentColor"><!--!Font Awesome Free v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M64 96c0-35.3 28.7-64 64-64l384 0c35.3 0 64 28.7 64 64l0 240-64 0 0-240-384 0 0 240-64 0 0-240zM0 403.2C0 392.6 8.6 384 19.2 384l601.6 0c10.6 0 19.2 8.6 19.2 19.2 0 42.4-34.4 76.8-76.8 76.8L76.8 480C34.4 480 0 445.6 0 403.2zM281 209l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM393 175l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg></span> ' . __('Generar Showcase', 'ileben-landing'),
    'href'  => $url,
    'meta'  => [
      'title' => __('Crea una página en borrador con todos los bloques', 'ileben-landing'),
    ]
  ]);
}
add_action('admin_bar_menu', 'ileben_add_showcase_admin_bar_node', 999);

/**
 * Procesa la creación de la página Showcase
 */
function ileben_handle_generate_showcase()
{
  if (!current_user_can('edit_pages')) {
    wp_die(__('No tienes permisos para realizar esta acción.', 'ileben-landing'));
  }

  check_admin_referer('ileben_generate_showcase_action');

  $content = <<<HTML
<!-- wp:spacer {"height":"10rem"} -->
<div style="height:10rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"style":{"typography":{"textAlign":"center"}}} -->
<h2 class="wp-block-heading has-text-align-center">Showcase de Bloques ileben-landing</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"textAlign":"center"}}} -->
<p class="has-text-align-center">Bienvenido al showcase. Aquí puedes inspeccionar las opciones de los bloques en el panel derecho.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">1. Componentes Básicos</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-card {"title":"Título de la Tarjeta","subtitle":"Subtítulo de ejemplo","image":"https://placehold.co/600x400/eeeeee/999999.jpg?text=Card+Image","imageAlt":"Placeholder"} -->
<!-- wp:paragraph -->
<p>Este es un texto descriptivo de la tarjeta de ejemplo. Puedes agregar cualquier bloque aquí adentro como contenido.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-card -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-alert {"variant":"info"} -->
<!-- wp:paragraph -->
<p>Este es un Alert de información (Info).</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-alert -->

<!-- wp:bootstrap-theme/bs-alert {"variant":"success"} -->
<!-- wp:paragraph -->
<p>Este es un Alert de éxito (Success).</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-alert -->

<!-- wp:bootstrap-theme/bs-alert {"variant":"warning"} -->
<!-- wp:paragraph -->
<p>Este es un Alert de advertencia (Warning).</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-alert -->

<!-- wp:bootstrap-theme/bs-alert {"variant":"danger"} -->
<!-- wp:paragraph -->
<p>Este es un Alert de error (Danger).</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-alert -->

<!-- wp:bootstrap-theme/bs-button-group -->
<!-- wp:bootstrap-theme/bs-button {"text":"Botón Primario","variant":"primary"} /-->

<!-- wp:bootstrap-theme/bs-button {"text":"Secundario","variant":"secondary"} /-->

<!-- wp:bootstrap-theme/bs-button {"text":"Outline","variant":"outline-primary"} /-->
<!-- /wp:bootstrap-theme/bs-button-group -->

<!-- wp:paragraph -->
<p>Badges Normales:</p>
<!-- /wp:paragraph -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Primary"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-primary">Primary</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Secondary","variant":"secondary"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-secondary">Secondary</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Success","variant":"success"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-success">Success</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Danger","variant":"danger"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-danger">Danger</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Warning","variant":"warning"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-warning">Warning</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Info","variant":"info"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-info">Info</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Light","variant":"light"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-light">Light</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Dark","variant":"dark"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-dark">Dark</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:paragraph -->
<p>Badges Pill:</p>
<!-- /wp:paragraph -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Pill Primary","pill":true} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-primary rounded-pill">Pill Primary</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:bootstrap-theme/bs-badge {"text":"Pill Success","variant":"success","pill":true} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-success rounded-pill">Pill Success</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">2. Tipografías y Tamaños</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Headings</h4>
<!-- /wp:heading -->

<!-- wp:heading -->
<h1 class="wp-block-heading">h1. Bootstrap heading</h1>
<!-- /wp:heading -->

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">h2. Bootstrap heading</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">h3. Bootstrap heading</h3>
<!-- /wp:heading -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">h4. Bootstrap heading</h4>
<!-- /wp:heading -->

<!-- wp:heading {"level":5} -->
<h5 class="wp-block-heading">h5. Bootstrap heading</h5>
<!-- /wp:heading -->

<!-- wp:heading {"level":6} -->
<h6 class="wp-block-heading">h6. Bootstrap heading</h6>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Display Headings</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="display-1">Display 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="display-2">Display 2</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="display-3">Display 3</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="display-4">Display 4</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="display-5">Display 5</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="display-6">Display 6</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Utilidades de texto</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="lead">Este es un párrafo <code>.lead</code> — texto destacado más grande.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="text-muted">Este es texto <code>.text-muted</code> — texto secundario atenuado.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="fst-italic">Texto en <code>.fst-italic</code> — cursiva.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="fw-bold">Texto en <code>.fw-bold</code> — negrita.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="fw-light">Texto en <code>.fw-light</code> — peso ligero.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="text-lowercase">Texto en <code>.text-lowercase</code> — minúsculas.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="text-uppercase">Texto en <code>.text-uppercase</code> — mayúsculas.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="text-capitalize">Texto en <code>.text-capitalize</code> — capitalizado.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Texto <mark>resaltado con mark</mark> y <small>pequeño con small</small> y <s>tachado con s</s> y <u>subrayado con u</u>.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Blockquote</h4>
<!-- /wp:heading -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>Una cita conocida envuelta en un elemento blockquote.</p></blockquote>
<!-- /wp:quote -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Listas</h4>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list">
<li>Lista desordenada — elemento 1</li>
<li>Lista desordenada — elemento 2</li>
<li>Lista desordenada — elemento 3</li>
</ul>
<!-- /wp:list -->

<!-- wp:list {"ordered":true} -->
<ol class="wp-block-list">
<li>Lista ordenada — elemento 1</li>
<li>Lista ordenada — elemento 2</li>
<li>Lista ordenada — elemento 3</li>
</ol>
<!-- /wp:list -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">3. Colores y Variables CSS</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:html -->
<div class="ileben-css-vars-showcase">
<style>
.ileben-css-vars-showcase .vars-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.75rem;margin:1rem 0 2rem}
.ileben-css-vars-showcase .vars-group-title{font-size:1.1rem;font-weight:700;margin:1.5rem 0 .5rem;padding-bottom:.25rem;border-bottom:2px solid var(--bs-border-color)}
.ileben-css-vars-showcase .var-item{display:flex;align-items:center;gap:.5rem;padding:.4rem .6rem;border-radius:var(--bs-border-radius);background:var(--bs-tertiary-bg);font-size:.85rem}
.ileben-css-vars-showcase .var-swatch{width:1.5rem;height:1.5rem;border-radius:.25rem;border:1px solid var(--bs-border-color);flex-shrink:0}
.ileben-css-vars-showcase .var-swatch.na{background:repeating-linear-gradient(45deg,#ccc,#ccc 4px,#eee 4px,#eee 8px);opacity:.5}
.ileben-css-vars-showcase .var-name{font-family:monospace;font-size:.8rem;color:var(--bs-secondary-color)}
.ileben-css-vars-showcase .var-value{font-family:monospace;font-size:.75rem;color:var(--bs-secondary-color);margin-left:auto}
.ileben-css-vars-showcase .mode-switch{margin-bottom:1rem}
.ileben-css-vars-showcase .featured-section{margin-bottom:2rem;padding:1.5rem;background:var(--bs-body-bg);border:1px solid var(--bs-border-color);border-radius:var(--bs-border-radius-lg)}
.ileben-css-vars-showcase .featured-title{font-size:1.25rem;font-weight:700;margin-bottom:1rem;color:var(--bs-primary)}
.ileben-css-vars-showcase .featured-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:1rem}
.ileben-css-vars-showcase .featured-item{text-align:center}
.ileben-css-vars-showcase .featured-swatch{width:100%;height:80px;border-radius:.5rem;border:1px solid var(--bs-border-color);margin-bottom:.5rem;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:.7rem;padding:.25rem;overflow:hidden}
.ileben-css-vars-showcase .featured-name{font-family:monospace;font-size:.75rem;font-weight:600;color:var(--bs-secondary-color);word-break:break-all}
.ileben-css-vars-showcase .shadow-demo{padding:1.5rem;margin:.5rem 0;border-radius:var(--bs-border-radius);background:var(--bs-tertiary-bg)}
.ileben-css-vars-showcase .gray-scale-row{display:flex;gap:.5rem;margin-bottom:.5rem}
.ileben-css-vars-showcase .gray-scale-item{flex:1;padding:.75rem .5rem;text-align:center;border-radius:.25rem;font-family:monospace;font-size:.7rem;color:#000}
[data-bs-theme="dark"] .ileben-css-vars-showcase .gray-scale-item{color:#fff}
</style>

<div class="mode-switch">
<button class="btn btn-sm btn-outline-primary active" onclick="document.documentElement.setAttribute('data-bs-theme','light');this.classList.add('active');this.nextElementSibling.classList.remove('active')">Light</button>
<button class="btn btn-sm btn-outline-primary" onclick="document.documentElement.setAttribute('data-bs-theme','dark');this.classList.add('active');this.previousElementSibling.classList.remove('active')">Dark</button>
</div>

<div id="ileben-featured-vars"></div>

<script>
(function(){
const featuredGroups = {
  title: 'Variables CSS Destacadas (ACF + Bootstrap)',
  sections: [
    {
      title: '🎨 Colores Base (Bootstrap)',
      description: 'Colores semánticos principales de Bootstrap 5.3',
      type: 'color-swatches',
      vars: [
        {var: '--bs-blue', name: 'Blue'},
        {var: '--bs-indigo', name: 'Indigo'},
        {var: '--bs-purple', name: 'Purple'},
        {var: '--bs-pink', name: 'Pink'},
        {var: '--bs-red', name: 'Red'},
        {var: '--bs-orange', name: 'Orange'},
        {var: '--bs-yellow', name: 'Yellow'},
        {var: '--bs-green', name: 'Green'},
        {var: '--bs-teal', name: 'Teal'},
        {var: '--bs-cyan', name: 'Cyan'}
      ]
    },
    {
      title: '⬛ Escala de Grises',
      description: 'Gradación completa de grises desde claro hasta oscuro',
      type: 'gray-scale',
      vars: [
        {var: '--bs-gray-100', name: '100'},
        {var: '--bs-gray-200', name: '200'},
        {var: '--bs-gray-300', name: '300'},
        {var: '--bs-gray-400', name: '400'},
        {var: '--bs-gray-500', name: '500'},
        {var: '--bs-gray-600', name: '600'},
        {var: '--bs-gray-700', name: '700'},
        {var: '--bs-gray-800', name: '800'},
        {var: '--bs-gray-900', name: '900'}
      ]
    },
    {
      title: '🌤️ Box Shadows (ACF)',
      description: 'Sombras configuradas desde ACF Pro - Opciones del tema',
      type: 'shadows',
      vars: [
        {var: '--bs-box-shadow', name: 'Normal'},
        {var: '--bs-box-shadow-sm', name: 'Pequeña'},
        {var: '--bs-box-shadow-lg', name: 'Grande'}
      ]
    }
  ]
};

function renderFeatured(){
  const root=getComputedStyle(document.documentElement);
  let html='<div class="featured-section">';
  html+='<div class="featured-title">'+featuredGroups.title+'</div>';
  
  featuredGroups.sections.forEach(section=>{
    html+='<div style="margin:1.5rem 0 1rem"><h5 style="font-weight:600;margin-bottom:.25rem">'+section.title+'</h5>';
    html+='<small class="text-muted">'+section.description+'</small></div>';
    
    if(section.type==='color-swatches'){
      html+='<div class="featured-grid">';
      section.vars.forEach(item=>{
        let val=root.getPropertyValue(item.var).trim();
        if(!val) val='transparent';
        html+='<div class="featured-item">';
        html+='<div class="featured-swatch" style="background:'+val+'">'+item.var.replace('--bs-','')+'</div>';
        html+='<div class="featured-name">'+item.name+'</div>';
        html+='</div>';
      });
      html+='</div>';
    }
    else if(section.type==='gray-scale'){
      html+='<div class="gray-scale-row">';
      section.vars.forEach(item=>{
        let val=root.getPropertyValue(item.var).trim();
        if(!val) val='#ccc';
        const textColor=item.var.includes('800')||item.var.includes('900')?'#fff':'#000';
        html+='<div class="gray-scale-item" style="background:'+val+';color:'+textColor+'">';
        html+='<div style="font-size:1rem;font-weight:700">'+item.name+'</div>';
        html+='<div style="font-size:.6rem;margin-top:.25rem;opacity:.8">'+val+'</div>';
        html+='</div>';
      });
      html+='</div>';
      html+='<div style="margin-top:.5rem;font-size:.75rem;color:var(--bs-secondary-color)">';
      html+='Variable RGB: <code>--bs-gray-dark-rgb</code> = <span style="font-family:monospace">'+root.getPropertyValue('--bs-gray-dark-rgb').trim()+'</span>';
      html+='</div>';
    }
    else if(section.type==='shadows'){
      section.vars.forEach(item=>{
        let val=root.getPropertyValue(item.var).trim();
        if(!val) val='none';
        html+='<div class="shadow-demo" style="box-shadow:'+val+'">';
        html+='<div style="font-family:monospace;font-size:.85rem;font-weight:600;color:var(--bs-secondary-color)">'+item.var+'</div>';
        html+='<div style="font-size:.75rem;color:var(--bs-secondary-color);margin-top:.25rem">'+item.name+'</div>';
        html+='<div style="font-size:.7rem;color:var(--bs-tertiary-color);margin-top:.5rem;font-family:monospace">'+val+'</div>';
        html+='</div>';
      });
    }
  });
  
  html+='</div>';
  document.getElementById('ileben-featured-vars').innerHTML=html;
}
renderFeatured();
})();
</script>

<div id="ileben-vars-render"></div>

<script>
(function(){
const groups = [
{title:'Theme Colors', vars:['--bs-primary','--bs-secondary','--bs-success','--bs-info','--bs-warning','--bs-danger','--bs-light','--bs-dark']},
{title:'Theme Colors RGB', vars:['--bs-primary-rgb','--bs-secondary-rgb','--bs-success-rgb','--bs-info-rgb','--bs-warning-rgb','--bs-danger-rgb','--bs-light-rgb','--bs-dark-rgb']},
{title:'Subtle / Emphasis (v5.3)', vars:['--bs-primary-bg-subtle','--bs-primary-border-subtle','--bs-primary-text-emphasis','--bs-secondary-bg-subtle','--bs-secondary-border-subtle','--bs-secondary-text-emphasis','--bs-success-bg-subtle','--bs-success-border-subtle','--bs-success-text-emphasis','--bs-danger-bg-subtle','--bs-danger-border-subtle','--bs-danger-text-emphasis','--bs-warning-bg-subtle','--bs-warning-border-subtle','--bs-warning-text-emphasis','--bs-info-bg-subtle','--bs-info-border-subtle','--bs-info-text-emphasis']},
{title:'Body', vars:['--bs-body-color','--bs-body-bg','--bs-body-color-rgb','--bs-body-bg-rgb','--bs-emphasis-color','--bs-secondary-color','--bs-secondary-bg','--bs-tertiary-color','--bs-tertiary-bg']},
{title:'Links', vars:['--bs-link-color','--bs-link-hover-color','--bs-link-color-rgb','--bs-link-hover-color-rgb']},
{title:'Border', vars:['--bs-border-color','--bs-border-width','--bs-border-style','--bs-border-radius','--bs-border-radius-sm','--bs-border-radius-lg','--bs-border-radius-xl']},
{title:'Focus Ring', vars:['--bs-focus-ring-width','--bs-focus-ring-opacity','--bs-focus-ring-color']},
{title:'Tipografía', vars:['--bs-body-font-family','--bs-body-font-size','--bs-body-font-weight','--bs-heading-color']},
];

function isColor(val){return /^#|rgba?\(|hsla?|var\(--bs-/.test(val)}
function render(){
const root=getComputedStyle(document.documentElement);
let html='';
groups.forEach(g=>{
  html+='<div class="vars-group-title">'+g.title+'</div><div class="vars-grid">';
  g.vars.forEach(v=>{
    let val=root.getPropertyValue(v).trim();
    if(!val) val='<em>unset</em>';
    const swatchClass=isColor(val)?'':' na';
    const bgStyle=val.startsWith('#')||val.startsWith('rgb')||val.startsWith('var(')?' style="background:'+val+'"':'';
    html+='<div class="var-item"><span class="var-swatch'+swatchClass+'"'+bgStyle+'></span><span class="var-name">'+v+'</span><span class="var-value">'+val+'</span></div>';
  });
  html+='</div>';
});
document.getElementById('ileben-vars-render').innerHTML=html;
}
render();
document.querySelectorAll('.mode-switch button').forEach(b=>{
  b.addEventListener('click',()=>{setTimeout(renderFeatured,50);setTimeout(render,100);});
});
})();
</script>
</div>
<!-- /wp:html -->

<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Utilidades de Color</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Backgrounds (<code>.bg-*</code>):</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<div class="d-flex flex-wrap gap-2 mb-4">
<span class="badge bg-primary">bg-primary</span>
<span class="badge bg-secondary">bg-secondary</span>
<span class="badge bg-success">bg-success</span>
<span class="badge bg-info">bg-info</span>
<span class="badge bg-warning">bg-warning</span>
<span class="badge bg-danger">bg-danger</span>
<span class="badge bg-light">bg-light</span>
<span class="badge bg-dark">bg-dark</span>
</div>
<div class="d-flex flex-wrap gap-2 mb-4">
<span class="badge bg-primary-subtle text-primary-emphasis">bg-primary-subtle</span>
<span class="badge bg-secondary-subtle text-secondary-emphasis">bg-secondary-subtle</span>
<span class="badge bg-success-subtle text-success-emphasis">bg-success-subtle</span>
<span class="badge bg-info-subtle text-info-emphasis">bg-info-subtle</span>
<span class="badge bg-warning-subtle text-warning-emphasis">bg-warning-subtle</span>
<span class="badge bg-danger-subtle text-danger-emphasis">bg-danger-subtle</span>
</div>
<!-- /wp:html -->

<!-- wp:paragraph -->
<p>Text (<code>.text-*</code>):</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<div class="d-flex flex-wrap gap-2 mb-4">
<span class="badge text-primary">text-primary</span>
<span class="badge text-secondary">text-secondary</span>
<span class="badge text-success">text-success</span>
<span class="badge text-info">text-info</span>
<span class="badge text-warning">text-warning</span>
<span class="badge text-danger">text-danger</span>
<span class="badge text-light bg-dark">text-light</span>
<span class="badge text-dark">text-dark</span>
</div>
<div class="d-flex flex-wrap gap-2 mb-4">
<span class="badge text-primary-emphasis">text-primary-emphasis</span>
<span class="badge text-secondary-emphasis">text-secondary-emphasis</span>
<span class="badge text-success-emphasis">text-success-emphasis</span>
<span class="badge text-info-emphasis">text-info-emphasis</span>
<span class="badge text-warning-emphasis">text-warning-emphasis</span>
<span class="badge text-danger-emphasis">text-danger-emphasis</span>
</div>
<!-- /wp:html -->

<!-- wp:paragraph -->
<p>Borders (<code>.border-*</code>):</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<div class="d-flex flex-wrap gap-2 mb-4">
<div class="p-2 border border-primary rounded">border-primary</div>
<div class="p-2 border border-secondary rounded">border-secondary</div>
<div class="p-2 border border-success rounded">border-success</div>
<div class="p-2 border border-info rounded">border-info</div>
<div class="p-2 border border-warning rounded">border-warning</div>
<div class="p-2 border border-danger rounded">border-danger</div>
<div class="p-2 border border-primary-subtle rounded">border-primary-subtle</div>
<div class="p-2 border border-success-subtle rounded">border-success-subtle</div>
</div>
<!-- /wp:html -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:html -->
<div class="alert alert-primary" role="alert">mas info en <a href="https://getbootstrap.com/docs/5.3/customize/color/" target="_blank" class="alert-link">aquí</a></div>
<!-- /wp:html -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">4. Navegación y Listas</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Breadcrumb</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-breadcrumb -->
<!-- wp:bootstrap-theme/bs-breadcrumb-item {"text":"Inicio"} -->
<li class="wp-block-bootstrap-theme-bs-breadcrumb-item breadcrumb-item"><a href="#"><span>Inicio</span></a></li>
<!-- /wp:bootstrap-theme/bs-breadcrumb-item -->

<!-- wp:bootstrap-theme/bs-breadcrumb-item {"text":"Proyectos"} -->
<li class="wp-block-bootstrap-theme-bs-breadcrumb-item breadcrumb-item"><a href="#"><span>Proyectos</span></a></li>
<!-- /wp:bootstrap-theme/bs-breadcrumb-item -->

<!-- wp:bootstrap-theme/bs-breadcrumb-item {"text":"Actual","active":true} -->
<li class="wp-block-bootstrap-theme-bs-breadcrumb-item breadcrumb-item active" aria-current="page"><span>Actual</span></li>
<!-- /wp:bootstrap-theme/bs-breadcrumb-item -->
<!-- /wp:bootstrap-theme/bs-breadcrumb -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Paginación</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-pagination -->
<!-- wp:bootstrap-theme/bs-pagination-item {"text":"Anterior","disabled":true} -->
<li class="wp-block-bootstrap-theme-bs-pagination-item page-item disabled"><span class="page-link"><span>Anterior</span></span></li>
<!-- /wp:bootstrap-theme/bs-pagination-item -->

<!-- wp:bootstrap-theme/bs-pagination-item {"active":true} -->
<li class="wp-block-bootstrap-theme-bs-pagination-item page-item active" aria-current="page"><a class="page-link" href="#"><span>1</span></a></li>
<!-- /wp:bootstrap-theme/bs-pagination-item -->

<!-- wp:bootstrap-theme/bs-pagination-item {"text":"2"} -->
<li class="wp-block-bootstrap-theme-bs-pagination-item page-item"><a class="page-link" href="#"><span>2</span></a></li>
<!-- /wp:bootstrap-theme/bs-pagination-item -->

<!-- wp:bootstrap-theme/bs-pagination-item {"text":"Siguiente"} -->
<li class="wp-block-bootstrap-theme-bs-pagination-item page-item"><a class="page-link" href="#"><span>Siguiente</span></a></li>
<!-- /wp:bootstrap-theme/bs-pagination-item -->
<!-- /wp:bootstrap-theme/bs-pagination -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">List Group</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-list-group -->
<!-- wp:bootstrap-theme/bs-list-group-item {"text":"Elemento 1 de la lista"} -->
<li class="wp-block-bootstrap-theme-bs-list-group-item list-group-item"><span>Elemento 1 de la lista</span></li>
<!-- /wp:bootstrap-theme/bs-list-group-item -->

<!-- wp:bootstrap-theme/bs-list-group-item {"text":"Elemento 2 de la lista"} -->
<li class="wp-block-bootstrap-theme-bs-list-group-item list-group-item"><span>Elemento 2 de la lista</span></li>
<!-- /wp:bootstrap-theme/bs-list-group-item -->
<!-- /wp:bootstrap-theme/bs-list-group -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">5. Interacción y Acordeones</h2>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-accordion {"accordionId":"accordion-showcase"} -->
<!-- wp:bootstrap-theme/bs-accordion-item {"title":"Elemento 1","itemId":"showcase-1"} -->
<div class="accordion-item wp-block-bootstrap-theme-bs-accordion-item"><h2 class="accordion-header" id="heading-showcase-1"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-showcase-1" aria-expanded="false" aria-controls="collapse-showcase-1"><span>Elemento 1</span></button></h2><div id="collapse-showcase-1" class="accordion-collapse collapse" aria-labelledby="heading-showcase-1"><div class="accordion-body"><!-- wp:paragraph -->
<p>Contenido del acordeón 1.</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:bootstrap-theme/bs-accordion-item -->

<!-- wp:bootstrap-theme/bs-accordion-item {"title":"Elemento 2","itemId":"showcase-2"} -->
<div class="accordion-item wp-block-bootstrap-theme-bs-accordion-item"><h2 class="accordion-header" id="heading-showcase-2"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-showcase-2" aria-expanded="false" aria-controls="collapse-showcase-2"><span>Elemento 2</span></button></h2><div id="collapse-showcase-2" class="accordion-collapse collapse" aria-labelledby="heading-showcase-2"><div class="accordion-body"><!-- wp:paragraph -->
<p>Contenido del acordeón 2.</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:bootstrap-theme/bs-accordion-item -->
<!-- /wp:bootstrap-theme/bs-accordion -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">6. Tabs / Pestañas</h2>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-tabs {"tabsId":"tabs-showcase"} -->
<!-- wp:bootstrap-theme/bs-tab-pane {"title":"Tab 1","paneId":"tab-1","active":true} -->
<!-- wp:paragraph -->
<p>Contenido del Tab 1.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-tab-pane -->

<!-- wp:bootstrap-theme/bs-tab-pane {"title":"Tab 2","paneId":"tab-2"} -->
<!-- wp:paragraph -->
<p>Contenido del Tab 2.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-tab-pane -->
<!-- /wp:bootstrap-theme/bs-tabs -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"colMd":"12"} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">7. Carruseles, Galerías e Iframe</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"colMd":"12"} -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Carrusel Bootstrap</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-carousel {"carouselId":"carousel-b30d7420-ca1c-4633-9a65-b88f8b0dccea"} -->
<!-- wp:bootstrap-theme/bs-carousel-item {"active":true,"backgroundImage":{"id":999,"url":"https://placehold.co/1200x600/eeeeee/999999.jpg?text=Slide+1","alt":"Slide 1"}} -->
<!-- wp:paragraph -->
<p>Item 1</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-carousel-item -->

<!-- wp:bootstrap-theme/bs-carousel-item {"backgroundImage":{"id":998,"url":"https://placehold.co/1200x600/cccccc/666666.jpg?text=Slide+2","alt":"Slide 2"}} -->
<!-- wp:paragraph -->
<p>Item 2</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-carousel-item -->

<!-- wp:bootstrap-theme/bs-carousel-item {"backgroundImage":{"id":997,"url":"https://placehold.co/1200x600/bbbbbb/777777.jpg?text=Slide+3","alt":"Slide 3"}} -->
<!-- wp:paragraph -->
<p>Item 3</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-carousel-item -->
<!-- /wp:bootstrap-theme/bs-carousel -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"colMd":"12","className":"mt-5"} -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Split Carousel (GSAP Transitions)</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-split-carousel {"carouselId":"split-carousel-showcase","leftTransition":"fadeLeft","rightTransition":"fadeRight"} -->
<!-- wp:bootstrap-theme/bs-split-carousel-item {"active":true,"mainImageUrl":"https://placehold.co/800x600/6366f1/ffffff.jpg?text=PUERTO+VARAS","mainImageAlt":"Puerto Varas"} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">PUERTO VARAS</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"lead text-muted"} -->
<p class="lead text-muted">Departamentos con vista al lago Llanquihue</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Proyecto inmobiliario de lujo en el sur de Chile, con amplias superficies y terminaciones de alta calidad.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-split-carousel-item -->

<!-- wp:bootstrap-theme/bs-split-carousel-item {"mainImageUrl":"https://placehold.co/800x600/10b981/ffffff.jpg?text=PUCON","mainImageAlt":"Pucon"} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">PUCON</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"lead text-muted"} -->
<p class="lead text-muted">Vive frente al volcán</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Apartamentos modernos con vista panorámica al Volcán Villarrica y acceso directo a la playa.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-split-carousel-item -->

<!-- wp:bootstrap-theme/bs-split-carousel-item {"mainImageUrl":"https://placehold.co/800x600/f59e0b/ffffff.jpg?text=SANTIAGO","mainImageAlt":"Santiago"} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">SANTIAGO</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"lead text-muted"} -->
<p class="lead text-muted">Diseño urbano contemporáneo</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Departamentos de 2 y 3 ambientes en el corazón del barrio Lastarria, cerca de metro y servicios.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-split-carousel-item -->
<!-- /wp:bootstrap-theme/bs-split-carousel -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"colMd":"12"} -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Galería Fancybox</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-gallery {"images":[{"id":1001,"url":"https://placehold.co/600x400/eeeeee/999999.jpg?text=Galeria+1","thumbnailSize":"medium","columnSpan":1,"rowSpan":1,"customCaption":""},{"id":1002,"url":"https://placehold.co/600x400/cccccc/666666.jpg?text=Galeria+2","thumbnailSize":"medium","columnSpan":1,"rowSpan":1,"customCaption":""}]} /-->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"colMd":"12","className":"mt-4"} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Iframe (Mapa)</h3>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-iframe {"ratio":"21x9"} /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">8. Elementos de Interfaz (Modales, Spinners)</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-modal {"modalId":"modal-showcase-1","title":"Modal de Ejemplo"} -->
<!-- wp:paragraph -->
<p>Contenido del modal.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-modal -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-offcanvas {"offcanvasId":"offcanvas-showcase-1","title":"Offcanvas de Ejemplo"} -->
<!-- wp:paragraph -->
<p>Contenido del offcanvas.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-offcanvas -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-spinner -->
<div class="wp-block-bootstrap-theme-bs-spinner"><div class="spinner-border text-primary" role="status" aria-hidden="true"><span class="visually-hidden">Loading...</span></div></div>
<!-- /wp:bootstrap-theme/bs-spinner -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">9. Barras de Progreso (Progress)</h2>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-progress {"value":25,"variant":"success"} /-->

<!-- wp:bootstrap-theme/bs-progress {"variant":"info","striped":true} /-->

<!-- wp:bootstrap-theme/bs-progress {"value":75,"variant":"warning","striped":true,"animated":true} /-->

<!-- wp:bootstrap-theme/bs-progress {"value":100,"variant":"danger"} /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">10. Sistema de Grillas (Row y Columns)</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-3"} -->
<!-- wp:bootstrap-theme/bs-column {"colMd":"4"} -->
<!-- wp:paragraph -->
<p>col-md-4</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"colMd":"4"} -->
<!-- wp:paragraph -->
<p>col-md-4</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"colMd":"4"} -->
<!-- wp:paragraph -->
<p>col-md-4</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-3"} -->
<!-- wp:bootstrap-theme/bs-column {"colMd":"8"} -->
<!-- wp:paragraph -->
<p>col-md-8</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"colMd":"4"} -->
<!-- wp:paragraph -->
<p>col-md-4</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">11. Bloques Inmobiliarios Avanzados</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Plantas Showcase</h3>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-plantas-showcase /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Plantas Slider</h3>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-plantas-slider /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Masterplan Interactivo</h3>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-interactive-masterplan {"masterplanImage":{"id":0,"url":"https://placehold.co/1200x800/e2e8f0/94a3b8.png?text=Masterplan","alt":"Masterplan Placeholder"}} -->
<!-- wp:bootstrap-theme/bs-masterplan-hotspot /-->
<!-- /wp:bootstrap-theme/bs-interactive-masterplan -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Amenities</h3>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-amenities -->
<!-- wp:bootstrap-theme/bs-amenity-item {"title":"Piscina","icon":"fa-solid fa-swimming-pool"} /-->

<!-- wp:bootstrap-theme/bs-amenity-item {"title":"Gimnasio","icon":"fa-solid fa-dumbbell"} /-->

<!-- wp:bootstrap-theme/bs-amenity-item {"title":"Quincho","icon":"fa-solid fa-fire"} /-->
<!-- /wp:bootstrap-theme/bs-amenities -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Avance de Obra</h3>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-construction-progress-v2 -->
<!-- wp:bootstrap-theme/bs-construction-stage {"title":"Excavación","percentage":100} /-->

<!-- wp:bootstrap-theme/bs-construction-stage {"title":"Obra Gruesa","percentage":50} /-->

<!-- wp:bootstrap-theme/bs-construction-stage {"title":"Terminaciones"} /-->
<!-- /wp:bootstrap-theme/bs-construction-progress-v2 -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Asesores</h3>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-asesores /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Entorno</h3>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-entorno {"mapIframeUrl":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.6563095937354!2d-70.6171069!3d-33.432203699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf7c8b1f22e3%3A0xf908cfc82e7848fb!2sDr.%20Manuel%20Barros%20Borgo%C3%B1o%20386%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1783456303101!5m2!1ses!2scl"} -->
<!-- wp:bootstrap-theme/bs-entorno-category {"title":"Educación"} -->
<!-- wp:bootstrap-theme/bs-entorno-poi {"name":"Colegio Mayor","details":"5 min"} /-->

<!-- wp:bootstrap-theme/bs-entorno-poi {"name":"Universidad Andrés Bello","details":"10 min"} /-->
<!-- /wp:bootstrap-theme/bs-entorno-category -->
<!-- /wp:bootstrap-theme/bs-entorno -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Pasos (Steps)</h3>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-steps -->
<!-- wp:bootstrap-theme/bs-step-item {"title":"Paso 1"} /-->

<!-- wp:bootstrap-theme/bs-step-item {"title":"Paso 2"} /-->
<!-- /wp:bootstrap-theme/bs-steps -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">12. Íconos Font Awesome</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Versión: <strong>7.2.0</strong> · CDN: <code>cdnjs.cloudflare.com</code> · Buscar íconos en <a href="https://fontawesome.com/search" target="_blank" rel="noopener">fontawesome.com/search</a> · Licencia: Free</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Solid</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconName":"fa-house","size":"fa-3x","align":"center"} /-->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconName":"fa-user","size":"fa-3x","align":"center"} /-->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconName":"fa-gear","size":"fa-3x","align":"center"} /-->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconName":"fa-heart","size":"fa-3x","color":"#dc3545","align":"center"} /-->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Regular</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconStyle":"fa-regular","size":"fa-3x","color":"#ffc107","align":"center"} /-->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconStyle":"fa-regular","iconName":"fa-heart","size":"fa-3x","align":"center"} /-->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconStyle":"fa-regular","iconName":"fa-circle","size":"fa-3x","align":"center"} /-->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconStyle":"fa-regular","iconName":"fa-square","size":"fa-3x","align":"center"} /-->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Brands</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconStyle":"fa-brands","iconName":"fa-whatsapp","size":"fa-3x","color":"#25d366","align":"center"} /-->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconStyle":"fa-brands","iconName":"fa-instagram","size":"fa-3x","color":"#e1306c","align":"center"} /-->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconStyle":"fa-brands","iconName":"fa-facebook","size":"fa-3x","color":"#1877f2","align":"center"} /-->

<!-- wp:bootstrap-theme/bs-fa-icon {"iconStyle":"fa-brands","iconName":"fa-youtube","size":"fa-3x","color":"#ff0000","align":"center"} /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">13. Counter Cards</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-card-group -->
<!-- wp:bootstrap-theme/bs-counter-card {"target":150,"suffix":"+","title":"Departamentos","subtitle":"Vendidos","numberSize":"h2"} /-->

<!-- wp:bootstrap-theme/bs-counter-card {"target":12,"title":"Torres","subtitle":"En construcción","variant":"success","colorMode":"border","numberSize":"h2"} /-->

<!-- wp:bootstrap-theme/bs-counter-card {"target":3500,"suffix":" m²","title":"Área Total","subtitle":"Superficie","variant":"info","colorMode":"border-text","numberSize":"h2"} /-->
<!-- /wp:bootstrap-theme/bs-card-group -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-card-group {"layout":"group"} -->
<!-- wp:bootstrap-theme/bs-counter-card {"target":98,"suffix":"%","title":"Satisfacción","variant":"warning","numberSize":"h1"} /-->

<!-- wp:bootstrap-theme/bs-counter-card {"target":24,"title":"Meses","subtitle":"Plazo entrega","variant":"danger","numberSize":"h1"} /-->

<!-- wp:bootstrap-theme/bs-counter-card {"target":7,"title":"Años","subtitle":"Garantía","variant":"dark","numberSize":"h1"} /-->
<!-- /wp:bootstrap-theme/bs-card-group -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">14. Componentes Interactivos</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Collapse</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-button {"text":"Toggle Collapse","variant":"primary"} /-->

<!-- wp:bootstrap-theme/bs-collapse {"collapseId":"collapse-showcase"} -->
<!-- wp:paragraph -->
<p>Contenido colapsable. Click para mostrar/ocultar.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-collapse -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Dropdown</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-dropdown {"buttonText":"Dropdown Básico","buttonVariant":"secondary"} -->
<!-- wp:bootstrap-theme/bs-dropdown-item {"text":"Acción 1","className":"dropdown-item"} -->
<li class="wp-block-bootstrap-theme-bs-dropdown-item dropdown-item"><a class="dropdown-item" href="#"><span>Acción 1</span></a></li>
<!-- /wp:bootstrap-theme/bs-dropdown-item -->

<!-- wp:bootstrap-theme/bs-dropdown-divider -->
<li class="wp-block-bootstrap-theme-bs-dropdown-divider"><hr class="dropdown-divider"/></li>
<!-- /wp:bootstrap-theme/bs-dropdown-divider -->

<!-- wp:bootstrap-theme/bs-dropdown-item {"text":"Acción 2","className":"dropdown-item"} -->
<li class="wp-block-bootstrap-theme-bs-dropdown-item dropdown-item"><a class="dropdown-item" href="#"><span>Acción 2</span></a></li>
<!-- /wp:bootstrap-theme/bs-dropdown-item -->
<!-- /wp:bootstrap-theme/bs-dropdown -->

<!-- wp:bootstrap-theme/bs-dropdown {"buttonText":"Split Danger","buttonVariant":"danger","split":true} -->
<!-- wp:bootstrap-theme/bs-dropdown-item {"text":"Editar","className":"dropdown-item"} -->
<li class="wp-block-bootstrap-theme-bs-dropdown-item dropdown-item"><a class="dropdown-item" href="#"><span>Editar</span></a></li>
<!-- /wp:bootstrap-theme/bs-dropdown-item -->
<!-- wp:bootstrap-theme/bs-dropdown-item {"text":"Eliminar","className":"dropdown-item"} -->
<li class="wp-block-bootstrap-theme-bs-dropdown-item dropdown-item"><a class="dropdown-item" href="#"><span>Eliminar</span></a></li>
<!-- /wp:bootstrap-theme/bs-dropdown-item -->
<!-- /wp:bootstrap-theme/bs-dropdown -->

<!-- wp:bootstrap-theme/bs-dropdown {"buttonText":"Outline Info Dropup","buttonVariant":"outline-info","direction":"up"} -->
<!-- wp:bootstrap-theme/bs-dropdown-item {"text":"Opción A","className":"dropdown-item"} -->
<li class="wp-block-bootstrap-theme-bs-dropdown-item dropdown-item"><a class="dropdown-item" href="#"><span>Opción A</span></a></li>
<!-- /wp:bootstrap-theme/bs-dropdown-item -->
<!-- wp:bootstrap-theme/bs-dropdown-item {"text":"Opción B","className":"dropdown-item"} -->
<li class="wp-block-bootstrap-theme-bs-dropdown-item dropdown-item"><a class="dropdown-item" href="#"><span>Opción B</span></a></li>
<!-- /wp:bootstrap-theme/bs-dropdown-item -->
<!-- /wp:bootstrap-theme/bs-dropdown -->

<!-- wp:bootstrap-theme/bs-dropdown {"buttonText":"Dark Menu","buttonVariant":"dark","dark":true} -->
<!-- wp:bootstrap-theme/bs-dropdown-item {"text":"Modo oscuro","className":"dropdown-item"} -->
<li class="wp-block-bootstrap-theme-bs-dropdown-item dropdown-item"><a class="dropdown-item" href="#"><span>Modo oscuro</span></a></li>
<!-- /wp:bootstrap-theme/bs-dropdown-item -->
<!-- wp:bootstrap-theme/bs-dropdown-item {"text":"data-bs-theme","className":"dropdown-item"} -->
<li class="wp-block-bootstrap-theme-bs-dropdown-item dropdown-item"><a class="dropdown-item" href="#"><span>data-bs-theme</span></a></li>
<!-- /wp:bootstrap-theme/bs-dropdown-item -->
<!-- /wp:bootstrap-theme/bs-dropdown -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Tooltip</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-tooltip {"text":"Tooltip superior","elementText":"Hover Top"} /-->

<!-- wp:bootstrap-theme/bs-tooltip {"text":"Tooltip derecho","placement":"right","elementText":"Hover Right","variant":"btn-info"} /-->

<!-- wp:bootstrap-theme/bs-tooltip {"text":"Tooltip inferior","placement":"bottom","elementText":"Hover Bottom","variant":"btn-warning"} /-->

<!-- wp:bootstrap-theme/bs-tooltip {"text":"Tooltip izquierdo","placement":"left","elementText":"Hover Left","variant":"btn-success"} /-->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Popover</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-popover {"title":"Título Popover","elementText":"Click para Popover","variant":"btn-primary"} /-->

<!-- wp:bootstrap-theme/bs-popover {"title":"Popover Izquierda","content":"Contenido del popover a la izquierda.","placement":"left","elementText":"Popover Left","variant":"btn-success"} /-->

<!-- wp:bootstrap-theme/bs-popover {"title":"Popover Superior","content":"Este popover aparece arriba.","placement":"top","elementText":"Popover Top","variant":"btn-info"} /-->

<!-- wp:bootstrap-theme/bs-popover {"title":"Popover Dismissable","content":"Click fuera para cerrar (trigger focus).","dismissable":true,"placement":"bottom","elementText":"Dismissable","variant":"btn-warning"} /-->

<!-- wp:bootstrap-theme/bs-popover {"title":"Popover con HTML","content":"<strong>Negrita</strong> y <em>cursiva</em>","html":true,"placement":"right","elementText":"HTML Content","variant":"btn-dark","customClass":"popover-custom-showcase"} /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Toast</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-toast {"toastId":"toast-showcase","variant":"primary"} -->
<!-- wp:paragraph -->
<p>Hello, world! This is a toast message.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-toast -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"className":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Video</h4>
<!-- /wp:heading -->

<!-- wp:bootstrap-theme/bs-video {"videoUrl":"https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4","controls":true} /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider /-->

<!-- wp:bootstrap-theme/bs-container -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column -->
<!-- wp:heading -->
<h2 class="wp-block-heading">15. Parallax</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-parallax {"parallaxSpeed":0.3,"bgImageUrl":"https://placehold.co/1920x1080/1a1a2e/e94560.jpg?text=Parallax+1","overlayColor":"#000000","overlayOpacity":40,"height":50} -->
<!-- wp:heading {"style":{"typography":{"textAlign":"center"}}} -->
<h2 class="wp-block-heading has-text-align-center text-white">Parallax Básico (speed 0.3)</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"textAlign":"center"}}} -->
<p class="has-text-align-center text-white">Overlay negro 40% · 50dvh de altura · imagen de fondo</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-parallax -->

<!-- wp:spacer {"height":"3rem"} -->
<div style="height:3rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:bootstrap-theme/bs-parallax {"parallaxSpeed":0.6,"parallaxContent":true,"bgImageUrl":"https://placehold.co/1920x1080/0f3460/e94560.jpg?text=Parallax+2","overlayColor":"#0f3460","overlayOpacity":25,"height":60} -->
<!-- wp:heading {"style":{"typography":{"textAlign":"center"}}} -->
<h2 class="wp-block-heading has-text-align-center text-white">Parallax con Content Move (speed 0.6)</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"textAlign":"center"}}} -->
<p class="has-text-align-center text-white">El contenido se mueve a velocidad diferente que el fondo · overlay 25%</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-parallax -->

<!-- wp:spacer {"height":"3rem"} -->
<div style="height:3rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:bootstrap-theme/bs-parallax {"parallaxSpeed":0.8,"bgImageUrl":"https://placehold.co/1920x1080/16213e/e94560.jpg?text=Parallax+3","overlayColor":"#16213e","overlayOpacity":30,"height":40} -->
<!-- wp:heading {"style":{"typography":{"textAlign":"center"}}} -->
<h2 class="wp-block-heading has-text-align-center text-white">Parallax Rápido (speed 0.8)</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"textAlign":"center"}}} -->
<p class="has-text-align-center text-white">Efecto de profundidad acelerado · 40dvh</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-parallax -->

<!-- wp:spacer {"height":"3rem"} -->
<div style="height:3rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:bootstrap-theme/bs-parallax {"parallaxSpeed":0.5,"enableParallax":false,"bgImageUrl":"https://placehold.co/1920x1080/533483/e94560.jpg?text=Sin+Parallax","overlayColor":"#533483","overlayOpacity":20,"height":35} -->
<!-- wp:heading {"style":{"typography":{"textAlign":"center"}}} -->
<h2 class="wp-block-heading has-text-align-center text-white">Sin Parallax (disableParallax)</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"textAlign":"center"}}} -->
<p class="has-text-align-center text-white">Imagen fija sin efecto scroll · solo overlay</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-parallax -->
<!-- /wp:bootstrap-theme/bs-container -->
HTML;

  // Crear la página en estado borrador
  $post_id = wp_insert_post([
    'post_title'   => 'Showcase de Bloques - ' . date('d/m/Y H:i'),
    'post_content' => $content,
    'post_status'  => 'draft',
    'post_type'    => 'page',
  ]);

  if (!is_wp_error($post_id)) {
    // Redirigir al editor de la nueva página
    wp_redirect(get_edit_post_link($post_id, 'raw'));
    exit;
  } else {
    wp_die(__('Error al crear la página showcase.', 'ileben-landing'));
  }
}
add_action('admin_post_ileben_generate_showcase', 'ileben_handle_generate_showcase');
