<?php

/**
 * ACF hooks to populate dynamic select choices from Options page
 */

if (!defined('ABSPATH')) {
    exit;
}

// Only run if ACF is active
if (!function_exists('get_field')) {
    return;
}

/**
 * Helper: Build choices array from options repeater rows filtering by 'activo'
 */
function ileben_build_choices_from_options_repeater($repeater_field_name)
{
    $choices = [];
    if (!function_exists('get_field')) {
        return $choices;
    }
    $rows = get_field($repeater_field_name, 'option');
    if (is_array($rows)) {
        foreach ($rows as $row) {
            $active = isset($row['activo']) ? (bool)$row['activo'] : false;
            $text = isset($row['texto']) ? trim(wp_strip_all_tags($row['texto'])) : '';
            if ($active && $text !== '') {
                $choices[$text] = $text;
            }
        }
    }
    return $choices;
}

/**
 * Populate Dormitorios choices on Plantas edit screen
 */
add_filter('acf/load_field/name=planta_dormitorio', function ($field) {
    $field['choices'] = ileben_build_choices_from_options_repeater('dormitorios');
    return $field;
});

/**
 * Populate Baños choices on Plantas edit screen
 */
add_filter('acf/load_field/name=planta_bano', function ($field) {
    $field['choices'] = ileben_build_choices_from_options_repeater('banos');
    return $field;
});

/**
 * Populate Proyecto Actual choices from cached API data
 * IMPORTANTE: Solo lee del transient, NUNCA llama get_field() ni hace HTTP.
 * Llamar get_field('api_proyecto_actual') aquí causa recursión infinita.
 */
add_filter('acf/load_field/name=api_proyecto_actual', function ($field) {
    // Primero intentar leer del cache (transient)
    $proyectos = get_transient('ileben_theme_proyectos');

    // Si no hay cache, intentar auto-cargar si URL y Token están configurados
    if ((empty($proyectos) || !is_array($proyectos)) && function_exists('ileben_theme_fetch_proyectos')) {
        // Leer URL y Token directamente de la DB para evitar recursión con get_field()
        $api_url   = get_option('options_api_url', '');
        $api_token = get_option('options_api_token', '');

        if (!empty($api_url) && !empty($api_token)) {
            // Auto-fetch: URL y Token configurados, cargar proyectos desde la API
            $proyectos = ileben_theme_fetch_proyectos(false);
        }
    }

    if (!empty($proyectos) && is_array($proyectos)) {
        $field['choices'] = $proyectos;
        asort($field['choices']);
        $field['instructions'] = sprintf(
            'Se encontraron %d proyectos desde la API.',
            count($proyectos)
        );
    } else {
        // Verificar si falta configuración
        $api_url   = get_option('options_api_url', '');
        $api_token = get_option('options_api_token', '');

        if (empty($api_url) || empty($api_token)) {
            $field['choices'] = ['' => '— Configura URL de API y Token primero —'];
            $field['instructions'] = 'Ingresa la URL de la API y el Bearer Token arriba, guarda los cambios y los proyectos se cargarán automáticamente.';
        } else {
            $field['choices'] = ['' => '— No se pudieron cargar proyectos —'];
            // Mostrar error detallado si existe
            $last_error = get_transient('ileben_theme_proyectos_error');
            if (!empty($last_error)) {
                $field['instructions'] = '<span style="color:#d63638;">❌ Error: ' . esc_html($last_error) . '</span>';
            } else {
                $field['instructions'] = 'La API no devolvió proyectos. Verifica la URL y el Token, o usa el botón Refrescar.';
            }
        }
    }

    // Botón refrescar siempre disponible
    $refresh_url = add_query_arg([
        'ileben_refresh_projects' => '1',
        '_ileben_nonce' => wp_create_nonce('ileben_refresh_projects')
    ]);
    $field['instructions'] .= sprintf(
        ' <a href="%s" class="button button-secondary button-small" style="margin-left:6px;">↻ Refrescar proyectos</a>',
        esc_url($refresh_url)
    );

    return $field;
});

/**
 * Handle manual cache refresh via admin link.
 * Usa admin_init para detectar el query param ileben_refresh_projects.
 */
add_action('admin_init', function () {
    if (empty($_GET['ileben_refresh_projects'])) {
        return;
    }

    if (!current_user_can('manage_options')) {
        wp_die('Permisos insuficientes');
    }

    // Verificar nonce
    if (!isset($_GET['_ileben_nonce']) || !wp_verify_nonce($_GET['_ileben_nonce'], 'ileben_refresh_projects')) {
        wp_die('Nonce inválido');
    }

    if (function_exists('ileben_theme_fetch_proyectos')) {
        delete_transient('ileben_theme_proyectos');
        $proyectos = ileben_theme_fetch_proyectos(true);
        $count = is_array($proyectos) ? count($proyectos) : 0;
    } else {
        $count = 0;
    }

    // Redirect de vuelta con mensaje
    $redirect_url = remove_query_arg(['ileben_refresh_projects', '_ileben_nonce']);
    $redirect_url = add_query_arg('ileben_refreshed', $count, $redirect_url);
    wp_redirect($redirect_url);
    exit;
});

/**
 * Mostrar notificación de éxito al refrescar proyectos
 */
add_action('admin_notices', function () {
    if (!isset($_GET['ileben_refreshed'])) {
        return;
    }

    $count = intval($_GET['ileben_refreshed']);
    $message = $count > 0
        ? sprintf('✅ Se cargaron %d proyecto(s) desde la API de iLeben.', $count)
        : '⚠️ No se encontraron proyectos. Verifica la URL de la API y el Token.';

    $type = $count > 0 ? 'success' : 'warning';

    printf(
        '<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
        esc_attr($type),
        esc_html($message)
    );
});

/* ------------------------------------------------------------------ *
 * Sincronización de Asesores y RRSS
 * ------------------------------------------------------------------ */

/**
 * Agregar botón "Sincronizar desde API" en el campo asesores
 */
add_filter('acf/load_field/name=asesores', function ($field) {
    // Solo mostrar el botón si la API está configurada
    $api_url   = get_option('options_api_url', '');
    $api_token = get_option('options_api_token', '');
    $proyecto  = get_option('options_api_proyecto_actual', '');

    if (empty($api_url) || empty($api_token)) {
        return $field;
    }

    $sync_url = add_query_arg([
        'ileben_sync_asesores_rrss' => '1',
        '_ileben_sync_nonce' => wp_create_nonce('ileben_sync_asesores_rrss'),
    ]);

    $btn_style = 'display:inline-flex;align-items:center;gap:4px;margin-bottom:8px;';
    $button = sprintf(
        '<a href="%s" class="button button-primary" style="%s" onclick="return confirm(\'Esto reemplazará los asesores y RRSS actuales con los datos de la API. ¿Continuar?\');">🔄 Sincronizar desde API</a>',
        esc_url($sync_url),
        $btn_style
    );

    $info = '';
    if (empty($proyecto)) {
        $info = '<br><small style="color:#d63638;">⚠️ Selecciona un proyecto en el tab "API iLeben" para sincronizar asesores.</small>';
    }

    $field['instructions'] = $button . $info;

    return $field;
});

/**
 * Handler: Ejecutar sincronización de asesores y RRSS
 */
add_action('admin_init', function () {
    if (empty($_GET['ileben_sync_asesores_rrss'])) {
        return;
    }

    if (!current_user_can('manage_options')) {
        wp_die('Permisos insuficientes');
    }

    if (!isset($_GET['_ileben_sync_nonce']) || !wp_verify_nonce($_GET['_ileben_sync_nonce'], 'ileben_sync_asesores_rrss')) {
        wp_die('Nonce inválido');
    }

    $sync_results = ['rrss' => [], 'asesores' => []];

    // 1. Sincronizar RRSS desde site-config
    if (function_exists('ileben_theme_sync_rrss')) {
        $sync_results['rrss'] = ileben_theme_sync_rrss();
    }

    // 2. Sincronizar Asesores desde proyecto
    if (function_exists('ileben_theme_sync_asesores')) {
        $sync_results['asesores'] = ileben_theme_sync_asesores();
    }

    // Guardar resultados en transient para mostrar en admin_notices
    set_transient('ileben_sync_results', $sync_results, 60);

    // Redirect de vuelta
    $redirect_url = remove_query_arg(['ileben_sync_asesores_rrss', '_ileben_sync_nonce']);
    $redirect_url = add_query_arg('ileben_synced', '1', $redirect_url);
    wp_redirect($redirect_url);
    exit;
});

/**
 * Mostrar resultados de la sincronización
 */
add_action('admin_notices', function () {
    if (!isset($_GET['ileben_synced'])) {
        return;
    }

    $results = get_transient('ileben_sync_results');
    delete_transient('ileben_sync_results');

    if (!is_array($results)) {
        return;
    }

    $messages = [];

    // Resultado RRSS
    $rrss = isset($results['rrss']) ? $results['rrss'] : [];
    if (!empty($rrss['success']) && !empty($rrss['synced'])) {
        $messages[] = sprintf('✅ RRSS sincronizadas: %s', implode(', ', $rrss['synced']));
    }
    if (!empty($rrss['errors'])) {
        foreach ($rrss['errors'] as $err) {
            $messages[] = '⚠️ RRSS: ' . $err;
        }
    }

    // Resultado Asesores
    $asesores = isset($results['asesores']) ? $results['asesores'] : [];
    if (!empty($asesores['success'])) {
        $messages[] = sprintf('✅ %d asesor(es) sincronizado(s) desde la API.', $asesores['count']);
    }
    if (!empty($asesores['errors'])) {
        foreach ($asesores['errors'] as $err) {
            $messages[] = '⚠️ Asesores: ' . $err;
        }
    }

    if (empty($messages)) {
        $messages[] = '⚠️ No se realizó ninguna sincronización.';
    }

    $has_errors = !empty($rrss['errors']) || !empty($asesores['errors']);
    $has_success = !empty($rrss['success']) || !empty($asesores['success']);
    $type = $has_errors ? ($has_success ? 'warning' : 'error') : 'success';

    printf(
        '<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
        esc_attr($type),
        wp_kses(implode('<br>', $messages), ['br' => []])
    );
});

/* ------------------------------------------------------------------ *
 * Sincronización de Plantas (separada de Asesores/RRSS)
 * ------------------------------------------------------------------ */

/**
 * Agregar botón "Sincronizar Plantas desde API" en el tab API iLeben
 * (campo api_cotiza_url, que es el último del tab API).
 */
add_filter('acf/load_field/name=api_cotiza_url', function ($field) {
    $api_url   = get_option('options_api_url', '');
    $api_token = get_option('options_api_token', '');
    $proyecto  = get_option('options_api_proyecto_actual', '');

    if (empty($api_url) || empty($api_token)) {
        return $field;
    }

    $sync_url = add_query_arg([
        'ileben_sync_plantas'  => '1',
        '_ileben_sync_nonce'   => wp_create_nonce('ileben_sync_plantas'),
    ]);

    $btn_style = 'display:inline-flex;align-items:center;gap:4px;margin-bottom:8px;';
    $button = sprintf(
        '<a href="%s" class="button button-primary" style="%s" onclick="return confirm(\'Esto sincronizará todas las plantas del proyecto seleccionado desde la API. ¿Continuar?\');">🔄 Sincronizar Plantas desde API</a>',
        esc_url($sync_url),
        $btn_style
    );

    $info = '';
    if (empty($proyecto)) {
        $info = '<br><small style="color:#d63638;">⚠️ Selecciona un proyecto arriba para sincronizar plantas.</small>';
    }

    $field['instructions'] = $button . $info . ($field['instructions'] ? '<br>' . $field['instructions'] : '');

    return $field;
});

/**
 * Handler: Ejecutar sincronización de Plantas
 */
add_action('admin_init', function () {
    if (empty($_GET['ileben_sync_plantas'])) {
        return;
    }

    if (!current_user_can('manage_options')) {
        wp_die('Permisos insuficientes');
    }

    if (!isset($_GET['_ileben_sync_nonce']) || !wp_verify_nonce($_GET['_ileben_sync_nonce'], 'ileben_sync_plantas')) {
        wp_die('Nonce inválido');
    }

    $sync_results = [];

    // 1. Sincronizar site-config (RRSS, logos, tipografías)
    if (function_exists('ileben_theme_sync_rrss')) {
        $sync_results['site_config'] = ileben_theme_sync_rrss();
    }

    // 2. Sincronizar Plantas
    if (function_exists('ileben_theme_sync_plantas')) {
        $plantas_result = ileben_theme_sync_plantas();
        foreach (['success', 'created', 'updated', 'deleted', 'errors'] as $k) {
            $sync_results[$k] = isset($plantas_result[$k]) ? $plantas_result[$k] : [];
        }
    }

    // Guardar resultados en transient para mostrar en admin_notices
    set_transient('ileben_sync_plantas_results', $sync_results, 60);

    // Redirect de vuelta
    $redirect_url = remove_query_arg(['ileben_sync_plantas', '_ileben_sync_nonce']);
    $redirect_url = add_query_arg('ileben_synced_plantas', '1', $redirect_url);
    wp_redirect($redirect_url);
    exit;
});

/**
 * Mostrar resultados de la sincronización de Plantas
 */
add_action('admin_notices', function () {
    if (!isset($_GET['ileben_synced_plantas'])) {
        return;
    }

    $results = get_transient('ileben_sync_plantas_results');
    delete_transient('ileben_sync_plantas_results');

    if (!is_array($results)) {
        return;
    }

    $messages = [];

    // Site-config (logos, tipografías, RRSS)
    $site_config = isset($results['site_config']) ? $results['site_config'] : [];
    if (!empty($site_config['success']) && !empty($site_config['synced'])) {
        $labels = [
            'logo'              => 'Logo',
            'logo_dark'         => 'Logo Dark',
            'google_font_family' => 'Tipografía (familia)',
            'font_family_body'  => 'Tipografía (nombre)',
            'facebook'          => 'Facebook',
            'instagram'         => 'Instagram',
            'linkedin'          => 'LinkedIn',
        ];
        $labels_synced = array_map(function ($k) use ($labels) {
            return $labels[$k] ?? $k;
        }, $site_config['synced']);
        $messages[] = '✅ Configuración: ' . implode(', ', $labels_synced) . '.';
    }
    if (!empty($site_config['errors'])) {
        foreach ($site_config['errors'] as $err) {
            $messages[] = '⚠️ Config: ' . $err;
        }
    }

    // Plantas
    if (!empty($results['success'])) {
        $plantas_msgs = [];
        if (!empty($results['created'])) {
            $plantas_msgs[] = sprintf('%d creada(s)', $results['created']);
        }
        if (!empty($results['updated'])) {
            $plantas_msgs[] = sprintf('%d actualizada(s)', $results['updated']);
        }
        if (!empty($results['deleted'])) {
            $plantas_msgs[] = sprintf('%d desactivada(s)', $results['deleted']);
        }
        if (!empty($plantas_msgs)) {
            $messages[] = '✅ Plantas: ' . implode(', ', $plantas_msgs) . '.';
        }
    }

    if (!empty($results['errors'])) {
        foreach ($results['errors'] as $err) {
            $messages[] = '⚠️ Plantas: ' . $err;
        }
    }

    if (empty($messages)) {
        $messages[] = '⚠️ No se realizó ninguna sincronización.';
    }

    $has_errors   = !empty($results['errors']) || !empty($site_config['errors']);
    $has_success  = !empty($results['success']) || !empty($site_config['success']);
    $type = $has_errors ? ($has_success ? 'warning' : 'error') : 'success';

    printf(
        '<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
        esc_attr($type),
        wp_kses(implode('<br>', $messages), ['br' => []])
    );
});
