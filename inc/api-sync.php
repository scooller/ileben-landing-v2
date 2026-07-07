<?php

/**
 * API Sync - Theme to Plugin Integration
 *
 * Sincroniza la configuración de API definida en Opciones del Tema (ACF)
 * con el plugin ileben_plantas, para mantener un solo punto de configuración.
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Devuelve la configuración de API desde las opciones del tema (ACF).
 *
 * @return array Associative array with keys:
 *               api_endpoint, api_token, proyecto_id, timeout, cotiza_url
 */
function ileben_theme_get_api_config()
{
    $config = array(
        'api_endpoint' => '',
        'api_token'    => '',
        'proyecto_id'  => '',
        'timeout'      => 15,
        'cotiza_url'   => '',
    );

    if (!function_exists('get_field')) {
        return $config;
    }

    $url      = (string) get_field('api_url', 'option');
    $token    = (string) get_field('api_token', 'option');
    $timeout  = (int)    get_field('api_timeout', 'option');
    $proyecto = (string) get_field('api_proyecto_actual', 'option');
    $cotiza   = (string) get_field('api_cotiza_url', 'option');

    if ($url !== '') {
        $config['api_endpoint'] = esc_url_raw(trim($url));
    }
    if ($token !== '') {
        $token = trim($token);
        if (stripos($token, 'bearer ') === 0) {
            $token = trim(substr($token, 7));
        }
        $config['api_token'] = sanitize_text_field($token);
    }
    if ($timeout >= 5 && $timeout <= 120) {
        $config['timeout'] = $timeout;
    }
    if ($proyecto !== '') {
        $config['proyecto_id'] = sanitize_text_field(trim($proyecto));
    }
    if ($cotiza !== '') {
        $config['cotiza_url'] = esc_url_raw(trim($cotiza));
    }

    return $config;
}

/**
 * Versión segura de get_api_config que NO lee api_proyecto_actual.
 * Evita recursión infinita cuando se llama desde acf/load_field.
 */
function ileben_theme_get_api_config_safe()
{
    $config = array(
        'api_endpoint' => '',
        'api_token'    => '',
        'timeout'      => 15,
    );

    // Intentar leer con get_field() primero, fallback a get_option()
    $url     = '';
    $token   = '';
    $timeout = 0;

    if (function_exists('get_field')) {
        $url     = (string) get_field('api_url', 'option');
        $token   = (string) get_field('api_token', 'option');
        $timeout = (int)    get_field('api_timeout', 'option');
    }

    // Fallback a get_option() si get_field() devolvió vacío
    // (puede ocurrir cuando se llama desde acf/load_field)
    if ($url === '') {
        $url = (string) get_option('options_api_url', '');
    }
    if ($token === '') {
        $token = (string) get_option('options_api_token', '');
    }
    if ($timeout === 0) {
        $timeout = (int) get_option('options_api_timeout', 15);
    }

    if ($url !== '') {
        $config['api_endpoint'] = esc_url_raw(trim($url));
    }
    if ($token !== '') {
        $token = trim($token);
        if (stripos($token, 'bearer ') === 0) {
            $token = trim(substr($token, 7));
        }
        $config['api_token'] = sanitize_text_field($token);
    }
    if ($timeout >= 5 && $timeout <= 120) {
        $config['timeout'] = $timeout;
    }

    return $config;
}

/**
 * Realiza una petición GET a la API de iLeben usando la configuración del tema.
 *
 * @param string $endpoint   Endpoint to append (e.g. 'plantas', 'proyectos', 'site-config').
 * @param array  $query_args Optional query parameters.
 * @return array|WP_Error Decoded response body or WP_Error on failure.
 */
function ileben_theme_api_request($endpoint, $query_args = array())
{
    $config = ileben_theme_get_api_config();

    if (empty($config['api_endpoint'])) {
        return new WP_Error('missing_endpoint', 'URL de la API no configurada en Opciones del Tema > API.');
    }

    // Build URL: {base}/{endpoint}
    $url = rtrim($config['api_endpoint'], '/') . '/' . ltrim($endpoint, '/');

    if (!empty($config['proyecto_id'])) {
        $query_args['proyecto_id'] = $config['proyecto_id'];
    }

    if (!empty($query_args)) {
        $url = add_query_arg($query_args, $url);
    }

    $headers = array('Accept' => 'application/json');

    if (!empty($config['api_token'])) {
        $headers['authorization'] = 'Bearer ' . $config['api_token'];
    }

    // Origin header required by the API (same as plugin)
    $parsed_home   = wp_parse_url(home_url());
    $origin        = (isset($parsed_home['scheme']) ? $parsed_home['scheme'] : 'http') . '://' . $parsed_home['host'];
    if (isset($parsed_home['port'])) {
        $origin .= ':' . $parsed_home['port'];
    }
    $headers['origin'] = $origin;

    $response = wp_remote_get($url, array(
        'timeout' => min(120, max(5, $config['timeout'])),
        'headers' => $headers,
    ));

    if (is_wp_error($response)) {
        return $response;
    }

    $status = (int) wp_remote_retrieve_response_code($response);
    if ($status < 200 || $status >= 300) {
        $body = wp_remote_retrieve_body($response);
        return new WP_Error(
            'api_http_error',
            sprintf('La API devolvió HTTP %d: %s', $status, substr($body, 0, 200))
        );
    }

    $body     = wp_remote_retrieve_body($response);

    // Detectar Cloudflare challenge
    if (strpos($body, 'cf-challenge') !== false || strpos($body, 'Cloudflare') !== false) {
        return new WP_Error(
            'cloudflare_challenge',
            'La API está protegida por Cloudflare. No se pueden cargar proyectos automáticamente. Por favor, ingresa el ID del proyecto manualmente.'
        );
    }

    $decoded = json_decode($body, true);

    if (!is_array($decoded)) {
        return new WP_Error('api_parse_error', 'No se pudo interpretar la respuesta JSON de la API.');
    }

    return $decoded;
}

/**
 * Sincroniza la configuración del tema hacia el plugin ileben_plantas.
 *
 * Si el plugin está activo y la opción "Sincronizar con el plugin" está activada,
 * actualiza las settings del plugin con los valores del tema.
 *
 * @return bool True si se actualizó, false en caso contrario.
 */
function ileben_theme_sync_to_plugin()
{
    if (!function_exists('get_field')) {
        return false;
    }

    $sync_enabled = (bool) get_field('api_sync_plugin', 'option');
    if (!$sync_enabled) {
        return false;
    }

    // Check if plugin is active
    if (!class_exists('Ileben_Api_Client')) {
        return false;
    }

    $config = ileben_theme_get_api_config();

    $api_client = new Ileben_Api_Client();
    $existing  = $api_client->get_settings();

    // Merge theme values into plugin settings
    $merged = array_merge($existing, array(
        'api_endpoint' => $config['api_endpoint'],
        'api_token'    => $config['api_token'],
        'proyecto_id'  => $config['proyecto_id'],
        'timeout'      => $config['timeout'],
        'cotiza_url'   => $config['cotiza_url'],
    ));

    $api_client->save_settings($merged);

    return true;
}

/**
 * Hook: sincroniza al guardar las opciones del tema (ACF).
 */
add_action('acf/save_post', function ($post_id) {
    // Solo procesar cuando se guardan las opciones del tema (post_id = 'options')
    if ($post_id !== 'options') {
        return;
    }

    // Verificar si se guardó algo del tab API
    if (!isset($_POST['acf']) || !is_array($_POST['acf'])) {
        return;
    }

    // Verificar si la opción de sincronización está activada
    $sync_enabled = (bool) get_field('api_sync_plugin', 'option');
    if (!$sync_enabled) {
        return;
    }

    // Sincronizar de forma segura
    ileben_theme_sync_to_plugin();

    // Limpiar cache de proyectos para forzar recarga en la próxima visita
    delete_transient('ileben_theme_proyectos');
}, 20);

/**
 * Hook: sincroniza al activar el tema por primera vez.
 */
add_action('after_switch_theme', function () {
    // Esperar un poco para asegurar que las opciones se hayan cargado
    add_action('init', function () {
        ileben_theme_sync_to_plugin();
    }, 100);
});

/**
 * Clear proyectos cache when API settings change
 */
add_action('acf/update_value', function ($value, $post_id, $field) {
    $api_fields = ['api_endpoint', 'api_token', 'api_timeout', 'api_cotiza_url'];

    // Check if this is an API-related field on the options page
    if ($post_id === 'options' && in_array($field['name'], $api_fields)) {
        delete_transient('ileben_theme_proyectos');
    }

    return $value;
}, 10, 3);

/* ------------------------------------------------------------------ *
 * Selector de Proyecto dinámico
 * ------------------------------------------------------------------ */

/**
 * Obtiene la lista de proyectos desde la API y los cachea en transient.
 * Usa cURL directo para menor consumo de memoria.
 *
 * @param bool $force_refresh Saltar el cache y forzar petición a la API.
 * @return array Associative array: [id => nombre, ...] or empty on failure.
 */
function ileben_theme_fetch_proyectos($force_refresh = false)
{
    $cache_key  = 'ileben_theme_proyectos';
    $error_key  = 'ileben_theme_proyectos_error';
    $cache_time = 30 * MINUTE_IN_SECONDS;

    if (!$force_refresh) {
        $cached = get_transient($cache_key);
        if (is_array($cached)) {
            return $cached;
        }
    }

    // Limpiar error anterior
    delete_transient($error_key);

    // Construir URL del endpoint — usar versión segura para evitar recursión
    $config = ileben_theme_get_api_config_safe();
    if (empty($config['api_endpoint'])) {
        $err = 'api_endpoint está vacío. Verifica que la URL de API esté guardada.';
        set_transient($error_key, $err, HOUR_IN_SECONDS);
        error_log('[iLeben Proyectos] ' . $err);
        return array();
    }

    if (empty($config['api_token'])) {
        $err = 'api_token está vacío. Verifica que el Bearer Token esté guardado.';
        set_transient($error_key, $err, HOUR_IN_SECONDS);
        error_log('[iLeben Proyectos] ' . $err);
        return array();
    }

    $url = rtrim($config['api_endpoint'], '/') . '/proyectos';

    // Origin header — requerido por la API (Sanctum token.origin)
    $parsed_home = wp_parse_url(home_url());
    $origin      = (isset($parsed_home['scheme']) ? $parsed_home['scheme'] : 'http') . '://' . $parsed_home['host'];
    if (isset($parsed_home['port'])) {
        $origin .= ':' . $parsed_home['port'];
    }

    $headers = [
        'Accept: application/json',
        'Authorization: Bearer ' . $config['api_token'],
        'Origin: ' . $origin,
        'Referer: ' . home_url('/'),
    ];

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS      => 3,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT        => min(30, max(5, $config['timeout'])),
        CURLOPT_ENCODING       => 'gzip',
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER     => $headers,
    ]);
    $body       = curl_exec($ch);
    $http_code  = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    unset($ch);

    // Error de cURL (timeout, DNS, SSL, etc.)
    if ($body === false) {
        $err = sprintf('Error cURL: %s | URL: %s', $curl_error, $url);
        set_transient($error_key, $err, HOUR_IN_SECONDS);
        error_log('[iLeben Proyectos] ' . $err);
        return array();
    }

    // HTTP error
    if ($http_code < 200 || $http_code >= 300) {
        $body_preview = mb_substr(strip_tags($body), 0, 300);
        $err = sprintf('HTTP %d | URL: %s | Origin: %s | Respuesta: %s', $http_code, $url, $origin, $body_preview);
        set_transient($error_key, $err, HOUR_IN_SECONDS);
        error_log('[iLeben Proyectos] ' . $err);
        return array();
    }

    // Detectar Cloudflare
    if (strpos($body, 'cf-challenge') !== false || strpos($body, 'Cloudflare') !== false) {
        $err = 'Cloudflare challenge detectado. La API está protegida por Cloudflare.';
        set_transient($error_key, $err, HOUR_IN_SECONDS);
        error_log('[iLeben Proyectos] ' . $err);
        return array();
    }

    $decoded = json_decode($body, true);
    unset($body);

    if (!is_array($decoded)) {
        $err = 'La respuesta no es JSON válido.';
        set_transient($error_key, $err, HOUR_IN_SECONDS);
        error_log('[iLeben Proyectos] ' . $err);
        return array();
    }

    $proyectos = array();

    // Support both paginated {data:[...]} and plain array responses
    $items = isset($decoded['data']) && is_array($decoded['data'])
        ? $decoded['data']
        : (is_array($decoded) ? $decoded : array());

    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }
        $id    = isset($item['id']) ? (string) $item['id'] : '';
        $nombre = isset($item['name']) ? (string) $item['name'] : (isset($item['nombre']) ? (string) $item['nombre'] : '');
        if ($id !== '' && $nombre !== '') {
            $proyectos[$id] = $nombre;
        }
    }

    if (!empty($proyectos)) {
        set_transient($cache_key, $proyectos, $cache_time);
    } else {
        $err = sprintf('La API respondió OK (HTTP %d) pero 0 proyectos encontrados. Respuesta: %s', $http_code, mb_substr(json_encode($decoded, JSON_UNESCAPED_UNICODE), 0, 300));
        set_transient($error_key, $err, HOUR_IN_SECONDS);
        error_log('[iLeben Proyectos] ' . $err);
    }

    return $proyectos;
}

/* ------------------------------------------------------------------ *
 * Sincronización de Asesores y RRSS desde la API
 * ------------------------------------------------------------------ */

/**
 * Descarga una imagen desde URL y la sube a la Media Library de WordPress.
 * Si la imagen ya fue importada antes (misma URL fuente), reutiliza el attachment existente.
 *
 * @param string $url URL de la imagen remota.
 * @return int|WP_Error Attachment ID o WP_Error en caso de fallo.
 */
function ileben_theme_sideload_image($url)
{
    if (empty($url)) {
        return new WP_Error('empty_url', 'URL de imagen vacía.');
    }

    // Buscar si ya existe un attachment con esta URL fuente
    global $wpdb;
    $existing_id = $wpdb->get_var($wpdb->prepare(
        "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_ileben_source_url' AND meta_value = %s LIMIT 1",
        $url
    ));

    if ($existing_id && get_post($existing_id)) {
        return (int) $existing_id;
    }

    // Cargar funciones de admin necesarias para sideload
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    // Descargar archivo temporal
    $tmp = download_url($url, 30);
    if (is_wp_error($tmp)) {
        return $tmp;
    }

    // Extraer nombre de archivo limpio
    $url_path = wp_parse_url($url, PHP_URL_PATH);
    $filename = $url_path ? basename($url_path) : 'asesor-avatar.jpg';

    // Asegurar extensión
    if (!preg_match('/\.(jpe?g|png|gif|webp|svg)$/i', $filename)) {
        $filename .= '.jpg';
    }

    $file_array = [
        'name'     => sanitize_file_name($filename),
        'tmp_name' => $tmp,
    ];

    $attachment_id = media_handle_sideload($file_array, 0, null, [
        'post_status' => 'inherit',
    ]);

    // Limpiar temporal si hubo error
    if (is_wp_error($attachment_id)) {
        @unlink($tmp);
        return $attachment_id;
    }

    // Guardar URL fuente para evitar duplicados futuros
    update_post_meta($attachment_id, '_ileben_source_url', $url);

    return $attachment_id;
}

/**
 * Sincroniza las RRSS desde /site-config de la API hacia los campos ACF.
 *
 * @return array Resultado con claves: success, synced, errors.
 */
function ileben_theme_sync_rrss()
{
    $result = ['success' => false, 'synced' => [], 'errors' => []];

    $response = ileben_theme_api_request('site-config');

    if (is_wp_error($response)) {
        $result['errors'][] = 'Error al obtener site-config: ' . $response->get_error_message();
        error_log('[iLeben Sync RRSS] ' . $result['errors'][0]);
        return $result;
    }

    $social = isset($response['social']) && is_array($response['social']) ? $response['social'] : [];

    if (empty($social)) {
        $result['errors'][] = 'site-config no contiene datos de redes sociales.';
        error_log('[iLeben Sync RRSS] ' . $result['errors'][0]);
        return $result;
    }

    // Mapeo: clave API → campo ACF
    $map = [
        'facebook'  => 'social_facebook',
        'instagram' => 'social_instagram',
        'linkedin'  => 'social_linkedin',
    ];

    foreach ($map as $api_key => $acf_field) {
        $value = isset($social[$api_key]) ? trim((string) $social[$api_key]) : '';
        if ($value !== '') {
            update_field($acf_field, esc_url_raw($value), 'option');
            $result['synced'][] = $api_key;
        }
    }

    $result['success'] = true;
    return $result;
}

/**
 * Sincroniza los asesores desde /proyectos/{id}?include_asesores=true
 * hacia el repeater ACF 'asesores'.
 *
 * @return array Resultado con claves: success, count, errors.
 */
function ileben_theme_sync_asesores()
{
    $result = ['success' => false, 'count' => 0, 'errors' => []];

    // Obtener el proyecto seleccionado
    $proyecto_id = get_field('api_proyecto_actual', 'option');
    if (empty($proyecto_id)) {
        // Fallback a get_option
        $proyecto_id = get_option('options_api_proyecto_actual', '');
    }

    if (empty($proyecto_id)) {
        $result['errors'][] = 'No hay proyecto seleccionado. Selecciona uno en el tab "API iLeben" primero.';
        error_log('[iLeben Sync Asesores] ' . $result['errors'][0]);
        return $result;
    }

    // Fetch proyecto con asesores
    $response = ileben_theme_api_request('proyectos/' . $proyecto_id, [
        'include_asesores' => 'true',
    ]);

    if (is_wp_error($response)) {
        $result['errors'][] = 'Error al obtener proyecto: ' . $response->get_error_message();
        error_log('[iLeben Sync Asesores] ' . $result['errors'][0]);
        return $result;
    }

    $asesores_api = isset($response['asesores']) && is_array($response['asesores']) ? $response['asesores'] : [];

    if (empty($asesores_api)) {
        $result['errors'][] = sprintf('El proyecto #%s no tiene asesores asociados.', $proyecto_id);
        error_log('[iLeben Sync Asesores] ' . $result['errors'][0]);
        return $result;
    }

    // Construir filas del repeater
    $rows = [];
    foreach ($asesores_api as $asesor) {
        if (!is_array($asesor)) {
            continue;
        }

        $nombre = isset($asesor['full_name']) ? sanitize_text_field($asesor['full_name']) : '';
        $email  = isset($asesor['email']) ? sanitize_email($asesor['email']) : '';
        $fono   = isset($asesor['whatsapp_owner']) ? sanitize_text_field($asesor['whatsapp_owner']) : '';
        $avatar = isset($asesor['resolved_avatar_url']) ? esc_url_raw($asesor['resolved_avatar_url']) : '';

        if (empty($nombre)) {
            continue;
        }

        // Sideload avatar
        $imagen_id = '';
        if (!empty($avatar)) {
            $sideload_result = ileben_theme_sideload_image($avatar);
            if (!is_wp_error($sideload_result)) {
                $imagen_id = $sideload_result;
            } else {
                $result['errors'][] = sprintf('No se pudo descargar avatar de %s: %s', $nombre, $sideload_result->get_error_message());
                error_log('[iLeben Sync Asesores] ' . end($result['errors']));
            }
        }

        $rows[] = [
            'imagen' => $imagen_id,
            'nombre' => $nombre,
            'email'  => $email,
            'fono'   => $fono,
        ];
    }

    if (!empty($rows)) {
        // Limpiar repeater existente y escribir nuevas filas
        update_field('asesores', $rows, 'option');
        $result['count'] = count($rows);
        $result['success'] = true;
    }

    return $result;
}

/* ------------------------------------------------------------------ *
 * Sincronización de Plantas desde la API
 * ------------------------------------------------------------------ */

/**
 * Asegura que una opción exista en un repeater de ACF (opciones del tema).
 * Si no existe, la agrega como fila nueva con activo=true.
 *
 * @param string $repeater_name Nombre del campo repeater (ej: 'dormitorios', 'banos').
 * @param string $texto          Valor de texto a asegurar (ej: '3 Dormitorios').
 * @return void
 */
function ileben_ensure_option_in_repeater($repeater_name, $texto)
{
    if (!function_exists('get_field') || empty($texto)) {
        return;
    }

    $rows = get_field($repeater_name, 'option');
    if (!is_array($rows)) {
        $rows = [];
    }

    // Verificar si ya existe
    foreach ($rows as $row) {
        if (isset($row['texto']) && trim($row['texto']) === $texto) {
            return; // Ya existe
        }
    }

    // Agregar nueva fila
    $rows[] = [
        'texto'  => $texto,
        'activo' => 1,
    ];

    update_field($repeater_name, $rows, 'option');
}

/**
 * Sincroniza las plantas desde /proyectos/{id}?include_plantas=true
 * hacia el CPT 'plantas'.
 *
 * @return array Resultado con claves: success, created, updated, deleted, errors.
 */
function ileben_theme_sync_plantas()
{
    $result = ['success' => false, 'created' => 0, 'updated' => 0, 'deleted' => 0, 'errors' => []];

    // Obtener el proyecto seleccionado
    $proyecto_id = get_field('api_proyecto_actual', 'option');
    if (empty($proyecto_id)) {
        $proyecto_id = get_option('options_api_proyecto_actual', '');
    }

    if (empty($proyecto_id)) {
        $result['errors'][] = 'No hay proyecto seleccionado. Selecciona uno en el tab "API iLeben" primero.';
        error_log('[iLeben Sync Plantas] ' . $result['errors'][0]);
        return $result;
    }

    // Fetch proyecto con plantas
    $response = ileben_theme_api_request('proyectos/' . $proyecto_id, [
        'include_plantas' => 'true',
    ]);

    if (is_wp_error($response)) {
        $result['errors'][] = 'Error al obtener proyecto: ' . $response->get_error_message();
        error_log('[iLeben Sync Plantas] ' . $result['errors'][0]);
        return $result;
    }

    $plantas_api = isset($response['plantas']) && is_array($response['plantas']) ? $response['plantas'] : [];

    if (empty($plantas_api)) {
        $result['errors'][] = sprintf('El proyecto #%s no tiene plantas asociadas.', $proyecto_id);
        error_log('[iLeben Sync Plantas] ' . $result['errors'][0]);
        return $result;
    }

    $synced_api_ids = [];

    foreach ($plantas_api as $planta) {
        if (!is_array($planta) || empty($planta['id'])) {
            continue;
        }

        $api_id = (int) $planta['id'];
        $synced_api_ids[] = $api_id;

        // Buscar si ya existe una planta con este api_id (meta _ileben_planta_api_id)
        $existing = get_posts([
            'post_type'      => 'plantas',
            'post_status'    => 'any',
            'meta_key'       => '_ileben_planta_api_id',
            'meta_value'     => $api_id,
            'posts_per_page' => 1,
            'fields'         => 'ids',
        ]);

        $post_id = !empty($existing) ? (int) $existing[0] : 0;

        // Datos básicos de la planta
        $name         = isset($planta['name']) ? sanitize_text_field($planta['name']) : 'Planta ' . $api_id;
        $product_code = isset($planta['product_code']) ? sanitize_text_field($planta['product_code']) : '';
        $salesforce_id = isset($planta['salesforce_product_id']) ? sanitize_text_field($planta['salesforce_product_id']) : '';
        $tipo_producto = isset($planta['tipo_producto']) ? sanitize_text_field($planta['tipo_producto']) : '';
        $programa     = isset($planta['programa']) ? sanitize_text_field($planta['programa']) : '';
        $programa2    = isset($planta['programa2']) ? sanitize_text_field($planta['programa2']) : '';
        $piso         = isset($planta['piso']) ? sanitize_text_field($planta['piso']) : '';
        $orientacion  = isset($planta['orientacion']) ? sanitize_text_field($planta['orientacion']) : '';
        $precio_base  = isset($planta['precio_base']) ? (float) $planta['precio_base'] : 0;
        $precio_lista = isset($planta['precio_lista']) ? (float) $planta['precio_lista'] : 0;
        $precio_final = isset($planta['precio_final']) ? (float) $planta['precio_final'] : 0;
        $superficie_total = isset($planta['superficie_total_principal']) ? (float) $planta['superficie_total_principal'] : 0;
        $superficie_util  = isset($planta['superficie_util']) ? (float) $planta['superficie_util'] : 0;
        $superficie_terraza = isset($planta['superficie_terraza']) ? (float) $planta['superficie_terraza'] : 0;
        $unidad_sale  = !empty($planta['unidad_sale']);
        $is_active    = !empty($planta['is_active']);
        $is_available = !empty($planta['is_available']);

        // Parsear dormitorios y baños desde programa (ej: "3D+3B")
        $dorm_num = '';
        $bano_num = '';
        if ($programa && preg_match('/(\d+)\s*D/i', $programa, $m1) && preg_match('/(\d+)\s*B/i', $programa, $m2)) {
            $dorm_num = $m1[1];
            $bano_num = $m2[1];
        }

        // --- Crear o actualizar el post ---
        $post_data = [
            'post_title'   => $name,
            'post_name'    => sanitize_title($name . '-' . $api_id),
            'post_status'  => $is_active ? 'publish' : 'draft',
            'post_type'    => 'plantas',
            'post_content' => $programa ? $programa : '',
        ];

        if ($post_id) {
            $post_data['ID'] = $post_id;
            wp_update_post($post_data);
            $result['updated']++;
        } else {
            $post_id = wp_insert_post($post_data);
            if (is_wp_error($post_id)) {
                $result['errors'][] = sprintf('Error al crear planta %s: %s', $name, $post_id->get_error_message());
                error_log('[iLeben Sync Plantas] ' . end($result['errors']));
                continue;
            }
            $result['created']++;
        }

        // --- Meta: identificador API y datos de sincronización ---
        update_post_meta($post_id, '_ileben_planta_api_id', $api_id);
        update_post_meta($post_id, '_ileben_planta_proyecto_id', (int) $proyecto_id);
        update_post_meta($post_id, '_ileben_planta_last_sync', current_time('mysql'));
        update_post_meta($post_id, '_ileben_planta_product_code', $product_code);
        update_post_meta($post_id, '_ileben_planta_salesforce_id', $salesforce_id);
        update_post_meta($post_id, '_ileben_planta_tipo_producto', $tipo_producto);
        update_post_meta($post_id, '_ileben_planta_piso', $piso);
        update_post_meta($post_id, '_ileben_planta_orientacion', $orientacion);
        update_post_meta($post_id, '_ileben_planta_precio_base', $precio_base);
        update_post_meta($post_id, '_ileben_planta_precio_lista', $precio_lista);
        update_post_meta($post_id, '_ileben_planta_precio_final', $precio_final);
        update_post_meta($post_id, '_ileben_planta_superficie_total', $superficie_total);
        update_post_meta($post_id, '_ileben_planta_superficie_util', $superficie_util);
        update_post_meta($post_id, '_ileben_planta_superficie_terraza', $superficie_terraza);
        update_post_meta($post_id, '_ileben_planta_unidad_sale', $unidad_sale ? '1' : '0');
        update_post_meta($post_id, '_ileben_planta_is_available', $is_available ? '1' : '0');

        // --- URLs de imágenes desde la API ---
        $front_image_url = isset($planta['imageUrl']) ? esc_url_raw($planta['imageUrl']) : '';
        $back_image_url  = isset($planta['detailImageUrl']) ? esc_url_raw($planta['detailImageUrl']) : '';
        if (empty($back_image_url)) {
            $back_image_url = isset($planta['interior_image_url']) ? esc_url_raw($planta['interior_image_url']) : '';
        }

        // --- ACF fields: cotizador, link, imágenes, dormitorios y baños ---
        if (function_exists('update_field')) {
            // Cotizador activo = la planta está activa en la API
            update_field('cotizador_activo', $is_active ? 1 : 0, $post_id);

            // Salesforce Product ID
            update_field('planta_salesforce_id', $salesforce_id, $post_id);

            // Guardar URLs de imágenes
            update_field('planta_imagen_front', $front_image_url, $post_id);
            update_field('planta_imagen_back', $back_image_url, $post_id);

            // Piso, orientación y precios
            update_field('planta_piso', $piso, $post_id);
            update_field('planta_orientacion', $orientacion, $post_id);
            update_field('planta_precio_base', $precio_base, $post_id);
            update_field('planta_precio_lista', $precio_lista, $post_id);
            update_field('planta_precio_final', $precio_final, $post_id);

            // Superficies
            update_field('planta_superficie_total', $superficie_total, $post_id);
            update_field('planta_superficie_util', $superficie_util, $post_id);
            update_field('planta_superficie_terraza', $superficie_terraza, $post_id);

            if ($dorm_num !== '') {
                $dorm_texto = $dorm_num . ($dorm_num === '1' ? ' Dormitorio' : ' Dormitorios');
                ileben_ensure_option_in_repeater('dormitorios', $dorm_texto);
                update_field('planta_dormitorio', $dorm_texto, $post_id);
            }
            if ($bano_num !== '') {
                $bano_texto = $bano_num . ($bano_num === '1' ? ' Baño' : ' Baños');
                ileben_ensure_option_in_repeater('banos', $bano_texto);
                update_field('planta_bano', $bano_texto, $post_id);
            }
        }

        // --- Descargar imágenes a Media Library si save_planta_images está activo ---
        $save_images = get_field('save_planta_images', 'option');
        if (empty($save_images)) {
            $save_images = get_option('options_save_planta_images', '');
        }
        if ($save_images) {
            // Descargar imagen interior/back como thumbnail
            if (!empty($back_image_url)) {
                $image_id = ileben_theme_sideload_image($back_image_url);
                if (!is_wp_error($image_id)) {
                    set_post_thumbnail($post_id, $image_id);
                } else {
                    $result['errors'][] = sprintf('No se pudo descargar imagen interior de %s: %s', $name, $image_id->get_error_message());
                    error_log('[iLeben Sync Plantas] ' . end($result['errors']));
                }
            }
        }
    }

    // --- Marcar como draft las plantas que ya no existen en la API ---
    $all_synced = get_posts([
        'post_type'      => 'plantas',
        'post_status'    => 'publish',
        'meta_key'       => '_ileben_planta_proyecto_id',
        'meta_value'     => (int) $proyecto_id,
        'posts_per_page' => -1,
        'fields'         => 'ids',
    ]);

    foreach ($all_synced as $old_id) {
        $old_api_id = (int) get_post_meta($old_id, '_ileben_planta_api_id', true);
        if (!in_array($old_api_id, $synced_api_ids, true)) {
            wp_update_post([
                'ID'          => $old_id,
                'post_status' => 'draft',
            ]);
            update_post_meta($old_id, '_ileben_planta_is_available', '0');
            $result['deleted']++;
        }
    }

    $result['success'] = true;
    return $result;
}
