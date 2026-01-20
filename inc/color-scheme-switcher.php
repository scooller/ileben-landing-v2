<?php
/**
 * Floating Color Scheme Switcher (Light / Dark / Auto)
 *
 * Renders a small floating widget on the left side that lets users pick
 * their preferred color scheme. Preference is stored in localStorage
 * and overrides the global theme setting from ACF for that visitor.
 *
 * Uses ileben 5.3 data-bs-theme values: 'light' | 'dark' | 'auto'
 *
 * @package ileben_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Output the floating switcher HTML
 */
function ileben_theme_render_color_scheme_switcher() {
    // Check ACF option to show/hide switcher
    $show = true;
    if (function_exists('get_field')) {
        $show = get_field('color_scheme_switcher', 'option');
    }
    $show = apply_filters( 'ileben_theme_show_color_scheme_switcher', $show );
    
    // Get default color scheme from ACF
    $default_scheme = 'auto';
    if (function_exists('get_field')) {
        $default_scheme = get_field('default_color_scheme', 'option') ?: 'auto';
    }

    // Markup: a vertical pill with three buttons. Minimal inline style; prefers ileben utilities.
    // Only render the HTML if switcher is enabled
    if ( $show ) :
    ?>
    <!-- Desktop switcher (md and up) -->
    <div id="bs-color-scheme-switcher" class="position-fixed start-0 top-50 translate-middle-y d-none d-md-flex flex-column gap-1 bg-body border rounded-end shadow p-2 z-3"
         style="--_offset: 8px; left: var(--_offset);">
    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-theme-value="light" aria-label="Tema claro" title="<?php esc_attr_e('Claro','ileben-landing') ?>"><i class="fa-solid fa-sun"></i></button>
    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-theme-value="dark" aria-label="Tema oscuro" title="<?php esc_attr_e('Oscuro','ileben-landing') ?>"><i class="fa-solid fa-moon"></i></button>
    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-theme-value="auto" aria-label="Tema automático" title="<?php esc_attr_e('Automático','ileben-landing') ?>"><i class="fa-solid fa-cloud-sun"></i></button>
    </div>

    <!-- Mobile switcher (below md) -->
    <div id="bs-color-scheme-switcher-mobile" class="position-fixed bottom-0 start-0 m-3 d-flex d-md-none z-3">
        <div class="dropdown">
            <button class="btn btn-secondary btn-sm dropdown-toggle shadow" type="button" id="bsColorSchemeMenu" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-cloud-sun"></i>
            </button>
            <ul class="dropdown-menu" aria-labelledby="bsColorSchemeMenu" style="--bs-dropdown-min-width: auto;">
                <li><button class="dropdown-item" type="button" data-bs-theme-value="light"><i class="fa-solid fa-sun"></i></button></li>
                <li><button class="dropdown-item" type="button" data-bs-theme-value="dark"><i class="fa-solid fa-moon"></i></button></li>
                <li><button class="dropdown-item" type="button" data-bs-theme-value="auto"><i class="fa-solid fa-cloud-sun"></i></button></li>
            </ul>
        </div>
    </div>
    <?php
    endif; // End switcher HTML
    ?>
    
    <!-- Theme application script (always runs, even if switcher is hidden) -->
    <script>
    (function(){
    const STORAGE_KEY = 'ileben-theme-color-scheme';
    const htmlEl = document.documentElement;
    const desk = document.getElementById('bs-color-scheme-switcher');
    const mobile = document.getElementById('bs-color-scheme-switcher-mobile');

        // Apply the theme to <html data-bs-theme="...">
        function applyTheme(mode) {
            if (mode === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                htmlEl.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
            } else {
                htmlEl.setAttribute('data-bs-theme', mode);
            }

            // Update active visual state across both UIs (only if switcher exists)
            if (desk || mobile) {
                function setActiveIn(container) {
                    if (!container) return;
                    const buttons = container.querySelectorAll('[data-bs-theme-value]');
                    buttons.forEach(el => {
                        const isActive = el.getAttribute('data-bs-theme-value') === mode;
                        // Desktop buttons styling
                        if (el.classList.contains('btn')) {
                            el.classList.toggle('btn-primary', isActive);
                            el.classList.toggle('text-white', isActive);
                            el.classList.toggle('btn-outline-secondary', !isActive);
                        }
                        // Dropdown items styling
                        if (el.classList.contains('dropdown-item')) {
                            el.classList.toggle('active', isActive);
                        }
                    });
                }
                setActiveIn(desk);
                setActiveIn(mobile);
            }
        }

        // Initialize from saved preference or from current attribute
        const saved = localStorage.getItem(STORAGE_KEY);
        const defaultScheme = '<?php echo esc_js($default_scheme); ?>';
        const current = saved || defaultScheme;
        applyTheme(current);

        // React to system changes when in auto
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        function onSystemChange(e){
            const mode = localStorage.getItem(STORAGE_KEY) || '<?php echo esc_js($default_scheme); ?>';
            if (mode === 'auto') {
                htmlEl.setAttribute('data-bs-theme', e.matches ? 'dark' : 'light');
            }
        }
        if (mql && mql.addEventListener) mql.addEventListener('change', onSystemChange);

        // Handle clicks (only if switcher UI exists)
        if (desk || mobile) {
            function handleClick(container){
                if (!container) return;
                container.addEventListener('click', function(e){
                    const el = e.target.closest('[data-bs-theme-value]');
                    if (!el) return;
                    const value = el.getAttribute('data-bs-theme-value');
                    localStorage.setItem(STORAGE_KEY, value);
                    applyTheme(value);
                });
            }
            handleClick(desk);
            handleClick(mobile);
        }
    })();
    </script>
    <?php
}
add_action( 'wp_footer', 'ileben_theme_render_color_scheme_switcher', 9 );
