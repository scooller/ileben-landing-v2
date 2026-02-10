<?php
/**
 * GitHub Theme Updater
 * 
 * Permite actualizar el theme desde GitHub Releases directamente desde el admin de WordPress.
 * Los pasos para publicar una actualización son:
 * 
 * 1. En functions.php, actualiza la versión en "Version: X.Y.Z"
 * 2. Haz git commit y push
 * 3. Crea un Release en GitHub con tag vX.Y.Z
 * 4. WordPress detectará la actualización automáticamente
 * 5. Desde Apariencia → Temas, verás "Actualizar ahora"
 */

if (!defined('ABSPATH')) {
    exit;
}

class Ileben_GitHub_Theme_Updater {
    
    private $github_user = 'scooller';
    private $github_repo = 'ileben-landing-v2';
    private $github_token = null; // Dejar null si el repo es público
    private $theme_slug = 'ileben-landing-v2';
    private $cache_key = 'ileben_theme_update_check';
    private $cache_hours = 12;
    
    public function __construct() {
        // Hook para verificar actualizaciones
        add_filter('pre_set_site_transient_update_themes', array($this, 'check_for_updates'));
        
        // Hook para descargas desde GitHub (añade headers necesarios)
        add_filter('http_request_args', array($this, 'add_auth_header'), 10, 2);

        // Hook para renombrar el folder al descomprimir el ZIP de GitHub
        add_filter('upgrader_source_selection', array($this, 'rename_github_source'), 10, 4);
        
        // Hook para limpiar caché después de actualizar
        add_action('upgrader_process_complete', array($this, 'after_update'), 10, 2);
    }
    
    /**
     * Se ejecuta después de completar una actualización
     */
    public function after_update($upgrader_object, $options) {
        // Solo para actualizaciones de temas
        if ($options['action'] === 'update' && $options['type'] === 'theme') {
            // Si se actualizó nuestro tema
            if (isset($options['themes']) && in_array($this->theme_slug, $options['themes'])) {
                self::clear_cache();
                error_log('GitHub Updater: Tema actualizado, caché limpiado');
            }
        }
    }
    
    /**
     * Verifica si hay nuevas versiones disponibles en GitHub
     */
    public function check_for_updates($transient) {
        if (empty($transient->checked)) {
            return $transient;
        }
        
        // Obtener versión actual del theme
        $theme = wp_get_theme($this->theme_slug);
        $current_version = $theme->get('Version');
        
        error_log('GitHub Updater: Versión actual: ' . $current_version);
        
        // Verificar caché
        $cached = get_transient($this->cache_key);
        if ($cached !== false && !isset($_GET['force-check'])) {
            error_log('GitHub Updater: Usando caché');
            
            if (isset($cached['new_version']) && version_compare($current_version, $cached['new_version'], '<')) {
                error_log('GitHub Updater: Actualización disponible desde caché: ' . $cached['new_version']);
                $transient->response[$this->theme_slug] = $cached;
            } else {
                error_log('GitHub Updater: No hay actualización (caché)');
            }
            return $transient;
        }
        
        error_log('GitHub Updater: Verificando actualizaciones en GitHub...');
        
        // Obtener datos del último release desde GitHub
        $remote_data = $this->get_latest_release();
        
        if (!$remote_data || !isset($remote_data['new_version'])) {
            error_log('GitHub Updater: No se pudo obtener información del release');
            // Guardar caché negativo
            set_transient($this->cache_key, array('error' => true), $this->cache_hours * HOUR_IN_SECONDS);
            return $transient;
        }
        
        // Guardar en caché
        set_transient($this->cache_key, $remote_data, $this->cache_hours * HOUR_IN_SECONDS);
        error_log('GitHub Updater: Datos guardados en caché');
        
        // Comparar versiones usando version_compare
        if (version_compare($current_version, $remote_data['new_version'], '<')) {
            error_log('GitHub Updater: Actualización disponible: ' . $remote_data['new_version']);
            $transient->response[$this->theme_slug] = $remote_data;
        } else {
            error_log('GitHub Updater: Ya estás en la última versión');
        }
        
        return $transient;
    }
    
    /**
     * Obtiene el release más reciente desde GitHub
     */
    private function get_latest_release() {
        $url = "https://api.github.com/repos/{$this->github_user}/{$this->github_repo}/releases/latest";
        
        $args = array(
            'timeout' => 15,
            'headers' => array(
                'User-Agent' => $this->github_user,
                'Accept' => 'application/json',
            ),
            // Deshabilitar verificación SSL en desarrollo local
            'sslverify' => !defined('WP_LOCAL_DEV') || !WP_LOCAL_DEV ? true : false,
        );
        
        // Añadir autenticación si hay token
        if ($this->github_token) {
            $args['headers']['Authorization'] = 'token ' . $this->github_token;
        }
        
        error_log('GitHub Updater: Consultando ' . $url);
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            error_log('GitHub Updater Error: ' . $response->get_error_message());
            return false;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        if ($response_code !== 200) {
            error_log('GitHub Updater Error: HTTP ' . $response_code);
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $release = json_decode($body, true);
        
        if (!$release || empty($release['tag_name'])) {
            error_log('GitHub Updater Error: No se pudo obtener tag_name del release');
            error_log('GitHub Updater Response: ' . substr($body, 0, 500));
            return false;
        }
        
        // Extraer versión del tag (remover 'v' si existe)
        $version = preg_replace('/^(v|ver|version)?\s*/', '', $release['tag_name']);
        $version = trim($version);
        
        // Validar que sea un número de versión válido
        if (!preg_match('/^\d+\.\d+\.\d+/', $version)) {
            error_log('GitHub Updater Error: Versión inválida: ' . $version);
            return false;
        }
        
        error_log('GitHub Updater: Nueva versión encontrada: ' . $version);
        
        // Obtener URL del ZIP (usa zipball_url)
        $zip_url = $release['zipball_url'];
        
        error_log('GitHub Updater: Package URL: ' . $zip_url);
        
        return array(
            'theme' => $this->theme_slug,
            'new_version' => $version,
            'url' => $release['html_url'],
            'package' => $zip_url,
            'requires' => '6.0',
            'requires_php' => '8.2',
            'tested' => get_bloginfo('version'),
        );
    }
    
    /**
     * Añade headers necesarios para descargar desde GitHub
     */
    public function add_auth_header($args, $url) {
        // Verificar si es una URL de GitHub relacionada con nuestro repo
        if (strpos($url, 'github.com') !== false && 
            (strpos($url, $this->github_user) !== false || strpos($url, $this->github_repo) !== false)) {
            
            // Headers necesarios para la descarga
            if (!isset($args['headers'])) {
                $args['headers'] = array();
            }
            
            $args['headers']['User-Agent'] = $this->github_user;
            $args['headers']['Accept'] = 'application/json, application/octet-stream';
            
            // Si hay token, añadir autorización
            if ($this->github_token) {
                $args['headers']['Authorization'] = 'token ' . $this->github_token;
            }
            
            // Permitir URLs especiales de GitHub
            $args['reject_unsafe_urls'] = false;
            
            error_log('GitHub Updater: Headers añadidos para ' . $url);
        }
        
        return $args;
    }

    /**
     * Renombra la carpeta descomprimida de GitHub (zipball) al slug del tema
     * GitHub zipball crea folders con formato: username-repo-commit
     */
    public function rename_github_source($source, $remote_source, $upgrader, $hook_extra) {
        global $wp_filesystem;
        
        // Solo aplica a temas
        if (!isset($hook_extra['theme'])) {
            return $source;
        }
        
        // Aplicar solo a nuestro tema
        if ($hook_extra['theme'] !== $this->theme_slug) {
            return $source;
        }
        
        // Inicializar filesystem si no está disponible
        if (!isset($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }
        
        // El basename debería ser algo como: scooller-ileben-landing-v2-abc123
        $basename = basename($source);
        
        error_log('GitHub Updater: Renombrando folder de ' . $basename . ' a ' . $this->theme_slug);
        
        // Verificar que el folder contiene el nombre del repo
        // GitHub zipball genera nombres como: username-repo-commitHash
        if (strpos($basename, $this->github_user) === false && 
            strpos($basename, $this->github_repo) === false) {
            error_log('GitHub Updater: El folder no parece ser del repo correcto');
            return $source;
        }
        
        // Construir el nuevo path con el slug correcto
        $new_source = trailingslashit(dirname($source)) . $this->theme_slug . '/';
        
        // Si ya existe el destino, eliminarlo
        if ($wp_filesystem->is_dir($new_source)) {
            error_log('GitHub Updater: Eliminando folder existente en ' . $new_source);
            $wp_filesystem->delete($new_source, true);
        }
        
        // Renombrar el folder
        if ($wp_filesystem->move($source, $new_source, true)) {
            error_log('GitHub Updater: Folder renombrado exitosamente a ' . $new_source);
            return $new_source;
        } else {
            error_log('GitHub Updater: Error al renombrar folder');
        }
        
        return $source;
    }
    
    /**
     * Limpia el caché cuando se actualiza el theme
     */
    public static function clear_cache() {
        delete_transient('ileben_theme_update_check');
        error_log('GitHub Updater: Caché limpiado');
    }
    
    /**
     * Fuerza una verificación de actualizaciones (útil para debug)
     */
    public static function force_check() {
        self::clear_cache();
        // Forzar WordPress a verificar actualizaciones
        delete_site_transient('update_themes');
        error_log('GitHub Updater: Forzando nueva verificación');
    }
    
    /**
     * Debug: Endpoint para verificar el estado del updater
     */
    public static function debug_status() {
        $updater = new self();
        $release = $updater->get_latest_release();
        
        $theme = wp_get_theme($updater->theme_slug);
        $current_version = $theme->get('Version');
        
        $status = array(
            'current_version' => $current_version,
            'theme_slug' => $updater->theme_slug,
            'github_user' => $updater->github_user,
            'github_repo' => $updater->github_repo,
            'has_token' => !empty($updater->github_token),
            'cache_key' => $updater->cache_key,
            'cached_data' => get_transient($updater->cache_key),
        );
        
        if ($release) {
            $status['latest_release'] = $release;
            $status['update_available'] = version_compare($current_version, $release['new_version'], '<');
        } else {
            $status['error'] = 'No se pudo obtener información del release';
        }
        
        return $status;
    }
}

// Instanciar el updater
new Ileben_GitHub_Theme_Updater();

// Limpiar caché cuando el theme se actualiza
add_action('upgrader_process_complete', function($upgrader, $options) {
    if ($options['type'] === 'theme' && isset($options['themes']) && in_array('ileben-landing-v2', $options['themes'])) {
        Ileben_GitHub_Theme_Updater::clear_cache();
    }
}, 10, 2);

// Auto-limpiar caché cuando se carga la pantalla de temas
add_action('load-themes.php', function() {
    delete_transient('ileben_theme_update_check');
    wp_update_themes(); // fuerza verificación inmediata
});
/**
 * Función helper para forzar verificación de actualizaciones
 * Uso: Añadir ?ileben_force_update=1 a la URL del admin
 */
add_action('admin_init', function() {
    if (isset($_GET['ileben_force_update']) && current_user_can('update_themes')) {
        Ileben_GitHub_Theme_Updater::force_check();
        wp_redirect(admin_url('themes.php?force-check=1'));
        exit;
    }
});

/**
 * Función helper para debug del updater
 * Uso: Añadir ?ileben_debug_updater=1 a la URL del admin
 */
add_action('admin_init', function() {
    if (isset($_GET['ileben_debug_updater']) && current_user_can('update_themes')) {
        $status = Ileben_GitHub_Theme_Updater::debug_status();
        
        echo '<pre style="background:#f1f1f1;padding:20px;margin:20px;border:1px solid #ccc;">';
        echo '<h2>GitHub Updater Debug Info</h2>';
        echo '<strong>Versión actual:</strong> ' . esc_html($status['current_version']) . '<br>';
        echo '<strong>Theme slug:</strong> ' . esc_html($status['theme_slug']) . '<br>';
        echo '<strong>GitHub user:</strong> ' . esc_html($status['github_user']) . '<br>';
        echo '<strong>GitHub repo:</strong> ' . esc_html($status['github_repo']) . '<br>';
        echo '<strong>Tiene token:</strong> ' . ($status['has_token'] ? 'Sí' : 'No') . '<br>';
        echo '<hr>';
        
        if (isset($status['latest_release'])) {
            echo '<strong>Última versión en GitHub:</strong> ' . esc_html($status['latest_release']['new_version']) . '<br>';
            echo '<strong>Package URL:</strong> ' . esc_html($status['latest_release']['package']) . '<br>';
            echo '<strong>¿Actualización disponible?:</strong> ' . ($status['update_available'] ? '<span style="color:green">SÍ</span>' : '<span style="color:orange">NO</span>') . '<br>';
        } else {
            echo '<strong style="color:red;">Error:</strong> ' . esc_html($status['error']) . '<br>';
        }
        
        echo '<hr>';
        echo '<strong>Datos en caché:</strong><br>';
        print_r($status['cached_data']);
        echo '</pre>';
        
        echo '<p><a href="' . admin_url('themes.php?ileben_force_update=1') . '" class="button button-primary">Forzar verificación de actualizaciones</a></p>';
        echo '<p><a href="' . admin_url('themes.php') . '" class="button">Volver a Temas</a></p>';
        exit;
    }
});