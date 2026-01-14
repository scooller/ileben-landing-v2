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
        
        // Hook para descargas desde repos privados (si es necesario)
        add_filter('http_request_args', array($this, 'add_auth_header'), 10, 2);
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
        
        // Verificar caché
        $cached = get_transient($this->cache_key);
        if ($cached !== false) {
            if (isset($cached['new_version']) && version_compare($current_version, $cached['new_version'], '<')) {
                $transient->response[$this->theme_slug] = $cached;
            }
            return $transient;
        }
        
        // Obtener datos del último release desde GitHub
        $remote_data = $this->get_latest_release();
        
        if (!$remote_data || !isset($remote_data['new_version'])) {
            // Guardar caché negativo
            set_transient($this->cache_key, array('error' => true), $this->cache_hours * HOUR_IN_SECONDS);
            return $transient;
        }
        
        // Guardar en caché
        set_transient($this->cache_key, $remote_data, $this->cache_hours * HOUR_IN_SECONDS);
        
        // Comparar versiones
        if (version_compare($current_version, $remote_data['new_version'], '<')) {
            $transient->response[$this->theme_slug] = $remote_data;
        }
        
        return $transient;
    }
    
    /**
     * Obtiene el release más reciente desde GitHub
     */
    private function get_latest_release() {
        $url = "https://api.github.com/repos/{$this->github_user}/{$this->github_repo}/releases/latest";
        
        $args = array(
            'timeout' => 10,
            'headers' => array(
                'User-Agent' => 'ileben-theme-updater',
            ),
        );
        
        if ($this->github_token) {
            $args['headers']['Authorization'] = 'token ' . $this->github_token;
        }
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            error_log('GitHub Updater Error: ' . $response->get_error_message());
            return false;
        }
        
        $release = json_decode(wp_remote_retrieve_body($response), true);
        
        if (!$release || empty($release['tag_name'])) {
            return false;
        }
        
        // Extraer versión del tag (remover 'v' si existe)
        $version = ltrim($release['tag_name'], 'v');
        
        // Validar que sea un número de versión válido
        if (!preg_match('/^\d+\.\d+\.\d+/', $version)) {
            return false;
        }
        
        // Obtener URL del ZIP (usa zipball_url que es el formato correcto)
        $zip_url = $release['zipball_url'];
        
        // Si es un repo privado, añadir token al URL
        if ($this->github_token) {
            $zip_url = add_query_arg('access_token', $this->github_token, $zip_url);
        }
        
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
     * Añade header de autenticación para repos privados
     */
    public function add_auth_header($args, $url) {
        // Solo para descargas de GitHub si el repo es privado
        if ($this->github_token && strpos($url, 'github.com') !== false && strpos($url, 'zipball') !== false) {
            $args['headers']['Authorization'] = 'token ' . $this->github_token;
        }
        return $args;
    }
    
    /**
     * Limpia el caché cuando se actualiza el theme
     */
    public static function clear_cache() {
        delete_transient('ileben_theme_update_check');
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
