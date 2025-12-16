<?php
/**
 * ACF integration and sample fields.
 */

if (!defined('ABSPATH')) {
    exit;
}

// Check for ACF Pro dependency
function ileben_theme_check_acf_pro() {
	if ( ! class_exists( 'ACF' ) || ! function_exists( 'acf_get_setting' ) ) {
		add_action( 'admin_notices', 'ileben_theme_acf_missing_notice' );
		return false;
	}
	
	// Check if it's ACF Pro (has options page capability)
	if ( ! function_exists( 'acf_add_options_page' ) ) {
		add_action( 'admin_notices', 'ileben_theme_acf_pro_missing_notice' );
		return false;
	}
	
	return true;
}

function ileben_theme_acf_missing_notice() {
	?>
	<div class="notice notice-error is-dismissible">
		<p><strong><?php esc_html_e( 'Ileben Theme:', 'ileben-theme' ); ?></strong> <?php esc_html_e( 'Este tema requiere Advanced Custom Fields (ACF) para funcionar correctamente.', 'ileben-theme' ); ?> <a href="<?php echo esc_url( admin_url( 'plugin-install.php?s=advanced+custom+fields&tab=search&type=term' ) ); ?>"><?php esc_html_e( 'Instalar ACF', 'ileben-theme' ); ?></a></p>
	</div>
	<?php
}

function ileben_theme_acf_pro_missing_notice() {
	?>
	<div class="notice notice-error is-dismissible">
		<p><strong><?php esc_html_e( 'Ileben Theme:', 'ileben-theme' ); ?></strong> <?php esc_html_e( 'Este tema requiere Advanced Custom Fields PRO para funcionar correctamente. La versión gratuita no es suficiente.', 'ileben-theme' ); ?> <a href="https://www.advancedcustomfields.com/pro/" target="_blank"><?php esc_html_e( 'Conseguir ACF Pro', 'ileben-theme' ); ?></a></p>
	</div>
	<?php
}
// Run ACF check
ileben_theme_check_acf_pro();

// Register ACF options page (theme settings)
function ileben_theme_register_acf_options_page() {
    if (!ileben_theme_check_acf_pro()) {
        return;
    }

    acf_add_options_page([
        'page_title'      => __('Configuración del tema', 'ileben-landing-v2'),
        'menu_title'      => __('Ileben Config', 'ileben-landing-v2'),
        'menu_slug'       => 'ileben-opciones-tema',
        'capability'      => 'manage_options',
        'redirect'        => false,
        'icon_url'       => 'dashicons-building',
        'position'       => 61,
        'update_button'   => __('Guardar cambios', 'ileben-landing-v2'),
        'updated_message' => __('Opciones guardadas', 'ileben-landing-v2'),
    ]);
}
add_action('acf/init', 'ileben_theme_register_acf_options_page');

// Local JSON sync - ACF loads field groups from /acf-json automatically.
add_filter('acf/settings/save_json', function ($path) {
    return ILEBEN_THEME_DIR . '/acf-json';
});

add_filter('acf/settings/load_json', function ($paths) {
    $paths[] = ILEBEN_THEME_DIR . '/acf-json';
    return $paths;
});
