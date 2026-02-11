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

        // Hook para corregir la estructura de carpetas de GitHub zipball
        add_filter('upgrader_source_selection', array($this, 'rename_github_source'), 10, 4);
        
        // Hook para verificar después de que WordPress copia los archivos
        add_filter('upgrader_post_install', array($this, 'verify_installation'), 10, 3);
        
        // Hook para limpiar caché después de actualizar
        add_action('upgrader_process_complete', array($this, 'after_update'), 10, 2);
    }
    
    /**
     * Log helper que solo registra si WP_DEBUG_LOG está habilitado
     */
    private function debug_log($message) {
        if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            error_log('GitHub Updater: ' . $message);
        }
    }
    
    /**
     * Verifica la instalación después de que WordPress copia los archivos
     */
    public function verify_installation($response, $hook_extra, $result) {
        $this->debug_log('====== VERIFICANDO INSTALACION POST-COPIA ======');
        $this->debug_log('Hook extra: ' . json_encode($hook_extra));
        $this->debug_log('Result: ' . json_encode($result));
        
        // Solo aplica a nuestro tema
        if (empty($hook_extra['theme']) || $hook_extra['theme'] !== $this->theme_slug) {
            $this->debug_log('No es nuestro tema, ignorando verificación');
            return $response;
        }
        
        $this->debug_log('✓ Verificando post-copia de ' . $this->theme_slug);
        
        // Si hay error, retornar
        if (is_wp_error($response)) {
            $this->debug_log('Response es un error: ' . $response->get_error_message());
            return $response;
        }
        
        // Obtener la ruta de destino
        if (!isset($result['destination'])) {
            $this->debug_log('No hay destination en result');
            return $response;
        }
        
        $destination = $result['destination'];
        $temp_source = $result['source'];
        
        $this->debug_log('Origen (temp): ' . $temp_source);
        $this->debug_log('Destino (final): ' . $destination);

        // Asegurar que el tema quede con el slug correcto
        $destination = rtrim($destination, '/') . '/';
        $themes_root = rtrim(dirname($destination), '/') . '/';
        $destination_name = isset($result['destination_name'])
            ? $result['destination_name']
            : basename(rtrim($destination, '/'));
        $expected_destination = $themes_root . $this->theme_slug . '/';

        if ($destination_name !== $this->theme_slug && is_dir($destination)) {
            if (!function_exists('WP_Filesystem')) {
                require_once ABSPATH . 'wp-admin/includes/file.php';
            }
            global $wp_filesystem;
            if (!isset($wp_filesystem)) {
                WP_Filesystem();
            }

            // Evitar conflicto si ya existe el destino esperado
            if ($wp_filesystem && $wp_filesystem->is_dir($expected_destination)) {
                $wp_filesystem->delete($expected_destination, true);
            }

            if ($wp_filesystem && $wp_filesystem->move($destination, $expected_destination, true)) {
                $this->debug_log('✓ Renombrado destino a: ' . $expected_destination);
                $destination = $expected_destination;
            } else {
                $this->debug_log('ERROR: No se pudo renombrar destino a slug');
            }
        }

        // Evitar que el tema quede activado con nombre temporal
        if (function_exists('get_stylesheet') && function_exists('switch_theme')) {
            $current_stylesheet = get_stylesheet();
            if ($current_stylesheet !== $this->theme_slug && $current_stylesheet === $destination_name) {
                switch_theme($this->theme_slug);
                $this->debug_log('✓ Tema activo restaurado a: ' . $this->theme_slug);
            }
        }
        
        // Verificar si style.css está en destino con la versión correcta
        if (file_exists($destination . 'style.css')) {
            $content = file_get_contents($destination . 'style.css', false, null, 0, 1500);
            if (preg_match('/Version:\s*(.+?)[\r\n]/i', $content, $matches)) {
                $dest_version = trim($matches[1]);
                $this->debug_log('Versión en destino: ' . $dest_version);
                
                // Si ya tiene la versión correcta, no hacer nada más
                $this->debug_log('✓ Post-copia OK, archivos ya en destino');
                return $response;
            }
        } else {
            $this->debug_log('ERROR: style.css NO en destino');
        }
        
        // Si llegamos aquí, el archivo no se copió correctamente o tiene versión vieja
        $this->debug_log('Copiando manualmente desde temp a destino...');
        
        if (!file_exists($temp_source) || !file_exists($destination)) {
            $this->debug_log('ERROR: Rutas inválidas');
            return $response;
        }
        
        // Copiar recursivamente
        $this->copy_dir($temp_source, $destination);
        
        // Verificar de nuevo
        if (file_exists($destination . 'style.css')) {
            $content = file_get_contents($destination . 'style.css', false, null, 0, 1500);
            if (preg_match('/Version:\s*(.+?)[\r\n]/i', $content, $matches)) {
                $final_version = trim($matches[1]);
                $this->debug_log('✓ Versión final tras copia manual: ' . $final_version);
            }
        }
        
        $this->debug_log('====== FIN VERIFICACION POST-COPIA ======');
        
        return $response;
    }
    
    /**
     * Copia recursiva de directorio (usando PHP estándar, no WP_Filesystem)
     */
    private function copy_dir($src, $dst) {
        if (is_dir($src)) {
            if (!is_dir($dst)) {
                @mkdir($dst, 0755, true);
            }
            
            $files = scandir($src);
            foreach ($files as $file) {
                if ($file === '.' || $file === '..') {
                    continue;
                }
                
                $src_path = rtrim($src, '/') . '/' . $file;
                $dst_path = rtrim($dst, '/') . '/' . $file;
                
                if (is_dir($src_path)) {
                    $this->debug_log('Copiando dir: ' . basename($src_path));
                    $this->copy_dir($src_path, $dst_path);
                } else {
                    $this->debug_log('Copiando archivo: ' . basename($src_path));
                    @copy($src_path, $dst_path);
                }
            }
        }
    }
    
    /**
     * Elimina recursivamente un directorio
     */
    private function delete_directory($dir) {
        if (!is_dir($dir)) {
            return false;
        }
        
        $files = scandir($dir);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }
            
            $path = rtrim($dir, '/') . '/' . $file;
            if (is_dir($path)) {
                if (!$this->delete_directory($path)) {
                    return false;
                }
            } else {
                if (!@unlink($path)) {
                    return false;
                }
            }
        }
        
        return @rmdir($dir);
    }
    
    /**
     * Se ejecuta después de completar una actualización
     */
    public function after_update($upgrader_object, $options) {
        $this->debug_log('====== PROCESANDO FINALIZACION DE ACTUALIZACIÓN ======');
        $this->debug_log('Opciones: ' . json_encode($options));
        
        // Solo para actualizaciones de temas
        if ($options['action'] === 'update' && $options['type'] === 'theme') {
            $this->debug_log('Es una actualización de tema');
            
            // Si se actualizó nuestro tema
            if (isset($options['themes']) && in_array($this->theme_slug, $options['themes'])) {
                $this->debug_log('✓ Nuestro tema fue actualizado');
                
                // Esperar a que se estabilice el filesystem
                sleep(2);
                
                // Obtener rutas
                $theme_dir = WP_CONTENT_DIR . '/themes/' . $this->theme_slug . '/';
                $upgrade_dir = WP_CONTENT_DIR . '/upgrade/';
                
                $this->debug_log('Tema dir: ' . $theme_dir);
                $this->debug_log('Upgrade dir: ' . $upgrade_dir);
                
                // Buscar la carpeta temporal de upgrade más reciente
                if (is_dir($upgrade_dir)) {
                    $dirs = glob($upgrade_dir . 'scooller-ileben-landing-v2-*', GLOB_ONLYDIR);
                    if ($dirs) {
                        usort($dirs, function($a, $b) {
                            return filemtime($b) - filemtime($a);
                        });
                        $latest_temp = $dirs[0];
                        $this->debug_log('Última carpeta temp encontrada: ' . $latest_temp);
                        
                        // Buscar la subcarpeta dentro
                        $subfolder = glob($latest_temp . '/scooller-ileben-landing-v2-*', GLOB_ONLYDIR);
                        if ($subfolder) {
                            $source = $subfolder[0];
                            $this->debug_log('Subcarpeta encontrada: ' . $source);
                            
                            // Mostrar el contenido
                            if (file_exists($source . '/style.css')) {
                                $content = file_get_contents($source . '/style.css', false, null, 0, 1500);
                                if (preg_match('/Version:\s*(.+?)[\r\n]/i', $content, $matches)) {
                                    $temp_version = trim($matches[1]);
                                    $this->debug_log('Versión en carpeta temp: ' . $temp_version);
                                    
                                    // Copiar desde temp a destino final
                                    $this->debug_log('Copiando de temp a destino final...');
                                    $this->copy_dir($source, $theme_dir);
                                    $this->debug_log('✓ Copia completada');
                                    
                                    // Verificar destino final
                                    if (file_exists($theme_dir . 'style.css')) {
                                        $final_content = file_get_contents($theme_dir . 'style.css', false, null, 0, 1500);
                                        if (preg_match('/Version:\s*(.+?)[\r\n]/i', $final_content, $matches)) {
                                            $final_version = trim($matches[1]);
                                            $this->debug_log('✓ Versión final en destino: ' . $final_version);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Limpiar caché último
                self::clear_cache();
                $this->debug_log('Caché limpiado');
            } else {
                $this->debug_log('Nuestro tema no estaba en la lista: ' . json_encode($options['themes']));
            }
        } else {
            $this->debug_log('No es una actualización de tema (action=' . $options['action'] . ', type=' . $options['type'] . ')');
        }
        
        $this->debug_log('====== FIN FINALIZACION DE ACTUALIZACIÓN ======');
    }
    
    /**
     * Verifica si hay nuevas versiones disponibles en GitHub
     */
    public function check_for_updates($transient) {
        if (empty($transient->checked)) {
            $this->debug_log('checked está vacío, retornando transient sin cambios');
            return $transient;
        }
        
        // Obtener versión actual del theme
        $theme = wp_get_theme($this->theme_slug);
        $current_version = $theme->get('Version');
        
        $this->debug_log('==== INICIANDO VERIFICACIÓN DE ACTUALIZACIONES ====');
        $this->debug_log('Versión actual: ' . $current_version);
        $this->debug_log('Theme slug: ' . $this->theme_slug);
        $this->debug_log('Cache key: ' . $this->cache_key);
        
        // Verificar caché
        $cached = get_transient($this->cache_key);
        if ($cached !== false && !isset($_GET['force-check'])) {
            $this->debug_log('✓ Usando caché');
            $this->debug_log('Cached data: ' . json_encode($cached));
            
            if (isset($cached['new_version']) && version_compare($current_version, $cached['new_version'], '<')) {
                $this->debug_log('✓ Actualización disponible desde caché: ' . $cached['new_version']);
                $this->debug_log('version_compare(' . $current_version . ', ' . $cached['new_version'] . ', <) = true');
                $transient->response[$this->theme_slug] = $cached;
            } else {
                $this->debug_log('No hay actualización (caché)');
                if (isset($cached['new_version'])) {
                    $this->debug_log('version_compare(' . $current_version . ', ' . $cached['new_version'] . ', <) = false');
                }
            }
            return $transient;
        }
        
        $this->debug_log('Caché no disponible o force-check activo, consultando GitHub...');
        
        // Obtener datos del último release desde GitHub
        $remote_data = $this->get_latest_release();
        
        if (!$remote_data || !isset($remote_data['new_version'])) {
            $this->debug_log('No se pudo obtener información del release');
            // Guardar caché negativo
            set_transient($this->cache_key, array('error' => true), $this->cache_hours * HOUR_IN_SECONDS);
            return $transient;
        }
        
        // Guardar en caché
        set_transient($this->cache_key, $remote_data, $this->cache_hours * HOUR_IN_SECONDS);
        $this->debug_log('Datos guardados en caché');
        
        // Comparar versiones usando version_compare
        if (version_compare($current_version, $remote_data['new_version'], '<')) {
            $this->debug_log('✓ ACTUALIZACIÓN DISPONIBLE: ' . $remote_data['new_version']);
            $this->debug_log('version_compare(' . $current_version . ', ' . $remote_data['new_version'] . ', <) = true');
            $this->debug_log('Añadiendo a transient->response');
            $this->debug_log('Remote data: ' . json_encode($remote_data));
            $transient->response[$this->theme_slug] = $remote_data;
        } else {
            $this->debug_log('Ya estás en la última versión');
            $this->debug_log('version_compare(' . $current_version . ', ' . $remote_data['new_version'] . ', <) = false');
        }
        
        $this->debug_log('==== FIN VERIFICACIÓN DE ACTUALIZACIONES ====');
        
        return $transient;
    }
    
    /**
     * Obtiene el release más reciente desde GitHub
     */
    private function get_latest_release() {
        $url = "https://api.github.com/repos/{$this->github_user}/{$this->github_repo}/releases/latest";
        
        $this->debug_log('====== OBTENIENDO RELEASE DESDE GITHUB ======');
        $this->debug_log('URL: ' . $url);
        
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
            $this->debug_log('Usando token de autenticación');
        }
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            $this->debug_log('ERROR: ' . $response->get_error_message());
            return false;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        $this->debug_log('HTTP ' . $response_code);
        if ($response_code !== 200) {
            $this->debug_log('ERROR: HTTP ' . $response_code);
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $release = json_decode($body, true);
        
        $this->debug_log('Release data: ' . substr($body, 0, 300) . '...');
        
        if (!$release || empty($release['tag_name'])) {
            $this->debug_log('Error: No tag_name en el release recibido');
            $this->debug_log('Response: ' . substr($body, 0, 500));
            return false;
        }
        
        $this->debug_log('Tag name: ' . $release['tag_name']);
        
        // Extraer versión del tag (remover 'v' si existe)
        $version = preg_replace('/^(v|ver|version)?\s*/', '', $release['tag_name']);
        $version = trim($version);
        
        $this->debug_log('Versión extraída: ' . $version);
        
        // Validar que sea un número de versión válido
        if (!preg_match('/^\d+\.\d+\.\d+/', $version)) {
            $this->debug_log('Error: Versión inválida: ' . $version);
            return false;
        }
        
        $this->debug_log('✓ Versión válida encontrada: ' . $version);
        
        // Obtener URL del ZIP (usa zipball_url)
        $zip_url = $release['zipball_url'];
        
        $this->debug_log('URL del ZIP: ' . $zip_url);
        
        $return_data = array(
            'theme' => $this->theme_slug,
            'new_version' => $version,
            'url' => $release['html_url'],
            'package' => $zip_url,
            'requires' => '6.0',
            'requires_php' => '8.2',
            'tested' => get_bloginfo('version'),
        );
        
        $this->debug_log('Return data: ' . json_encode($return_data));
        $this->debug_log('====== FIN OBTENCIÓN DE RELEASE ======');
        
        return $return_data;
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
            
            $this->debug_log('Headers añadidos para ' . $url);
        }
        
        return $args;
    }

    /**
     * Corrige la estructura de carpetas de GitHub zipball
     * 
     * El problema: GitHub zipball descomprime en:
     *   /wp-content/upgrade/scooller-ileben-landing-v2-xxx/scooller-ileben-landing-v2-yyy/
     * 
     * WordPress espera:
     *   /wp-content/upgrade/ileben-landing-v2/
     * 
     * Este hook renombra la carpeta padre para que WordPress la pueda procesar correctamente
     */
    public function rename_github_source($source, $remote_source, $upgrader, $hook_extra) {
        global $wp_filesystem;
        
        $this->debug_log('====== PROCESANDO ESTRUCTURA DE CARPETAS ======');
        $this->debug_log('Source original: ' . $source);
        
        // Solo aplica a nuestro tema
        if (empty($hook_extra['theme']) || $hook_extra['theme'] !== $this->theme_slug) {
            $this->debug_log('No es nuestro tema, ignorando');
            return $source;
        }
        
        // Limpiar carpetas antiguas de upgrade de nuestro tema
        $upgrade_dir = WP_CONTENT_DIR . '/upgrade/';
        if (is_dir($upgrade_dir)) {
            $this->debug_log('Limpiando carpetas antiguas de upgrade...');
            $dirs = glob($upgrade_dir . 'scooller-ileben-landing-v2*', GLOB_ONLYDIR);
            foreach ((array) $dirs as $dir) {
                // No eliminar el directorio actual siendo usado
                if ($dir !== dirname($source)) {
                    if ($this->delete_directory($dir)) {
                        $this->debug_log('✓ Eliminada carpeta antigua: ' . basename($dir));
                    } else {
                        $this->debug_log('⚠ No se pudo eliminar: ' . basename($dir));
                    }
                }
            }
            $this->debug_log('Limpieza completada');
        }
        
        // Inicializar filesystem
        if (!function_exists('WP_Filesystem')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }
        if (!isset($wp_filesystem)) {
            WP_Filesystem();
        }
        
        // Detectar la estructura: puede ser style.css en raíz O en una subfolder
        $has_style_at_root = $wp_filesystem->is_file($source . 'style.css');
        
        $subfolder = null;
        if (!$has_style_at_root) {
            // Buscar subfolder con style.css
            $files = $wp_filesystem->dirlist($source);
            foreach ($files as $name => $file_data) {
                if ($file_data['type'] === 'd' && $wp_filesystem->is_file($source . $name . '/style.css')) {
                    $subfolder = $name;
                    $this->debug_log('Subfolder encontrada: ' . $name);
                    break;
                }
            }
        } else {
            $this->debug_log('✓ style.css en raíz');
        }
        
        // Verificar que encontramos el theme en algún lugar
        if (!$has_style_at_root && !$subfolder) {
            $this->debug_log('ERROR: No se encontró style.css');
            return $source;
        }
        
        // Si hay subfolder con style.css, usarla como source (sin renombrar aqui)
        if ($subfolder) {
            $new_source = rtrim($source, '/') . '/' . $subfolder . '/';
            $this->debug_log('Usando subfolder como source: ' . $new_source);
            return $new_source;
        }
        
        $this->debug_log('Retornando source final: ' . $source);
        return $source;
    }
    
    /**
     * Copia recursivamente un directorio
     */
    private function copy_recursive($wp_filesystem, $source, $dest) {
        $files = $wp_filesystem->dirlist($source);
        
        foreach ($files as $name => $file_data) {
            $src = $source . '/' . $name;
            $dst = $dest . '/' . $name;
            
            if ($file_data['type'] === 'd') {
                if (!$wp_filesystem->is_dir($dst)) {
                    $wp_filesystem->mkdir($dst, FS_CHMOD_DIR);
                }
                $this->copy_recursive($wp_filesystem, $src, $dst);
            } else {
                $wp_filesystem->copy($src, $dst, FS_CHMOD_FILE);
            }
        }
    }
    
    /**
    /**
     * Log helper estático
     */
    private static function debug_log_static($message) {
        if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            error_log('GitHub Updater: ' . $message);
        }
    }
    
    /**
     * Limpia el caché cuando se actualiza el theme
     */
    public static function clear_cache() {
        // Limpiar nuestro transient personalizado
        delete_transient('ileben_theme_update_check');
        self::debug_log_static('Transient personalizado limpiado');
        
        // Limpiar cache de actualizaciones de WordPress
        delete_site_transient('update_themes');
        self::debug_log_static('Transient de actualizaciones limpiado');
        
        // Limpiar cache de headers del tema (WordPress lee y cachea los headers)
        wp_cache_delete('theme_' . 'ileben-landing-v2', 'themes');
        wp_cache_delete('themes', 'themes');
        self::debug_log_static('Caché de headers del tema limpiado');
        
        // Forzar recarga de temas desde disco
        if (function_exists('wp_clean_themes_cache')) {
            wp_clean_themes_cache(true);
            self::debug_log_static('wp_clean_themes_cache ejecutado');
        }
    }
    
    /**
     * Fuerza una verificación de actualizaciones (útil para debug)
     */
    public static function force_check() {
        self::clear_cache();
        // Forzar WordPress a verificar actualizaciones
        delete_site_transient('update_themes');
        self::debug_log_static('Forzando nueva verificación');
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

// Auto-limpiar caché cuando se carga la pantalla de temas
add_action('load-themes.php', function() {
    if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
        error_log('GitHub Updater: Pantalla de temas cargada, limpiando caché y forzando verificación');
    }
    delete_transient('ileben_theme_update_check');
    wp_update_themes(); // fuerza verificación inmediata
    if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
        error_log('GitHub Updater: Verificación forzada completada');
    }
});
/**
 * Función helper para forzar verificación de actualizaciones
 * Uso: Añadir ?ileben_force_update=1 a la URL del admin
 */
add_action('admin_init', function() {
    if (isset($_GET['ileben_force_update']) && current_user_can('update_themes')) {
        if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            error_log('GitHub Updater: Forzando verificación de actualizaciones...');
        }
        Ileben_GitHub_Theme_Updater::force_check();
        if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            error_log('GitHub Updater: Verificación forzada, redirigiendo a temas');
        }
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

        ob_start();
        ?>
        <style>
            *, ::after, ::before {
                box-sizing: border-box;
            }
            pre { 
                background:#f1f1f1; 
                padding:20px; 
                margin:20px; 
                border:1px solid #ccc; 
                line-height: 1;
                display: block;
                margin-top: 0;
                margin-bottom: 1rem;
                overflow: auto;
                font-size: .875em;
            }
            .button { margin-right: 10px; }
            ul { list-style: none; padding-left: 0; }
                li { margin-bottom: 5px; }
        </style>
        
        <pre>
        <h2>🖥️ GitHub Updater Debug Info</h2>
        <ul>
            <li><strong>Versión actual:</strong> ✨<?php echo esc_html($status['current_version']); ?></li>
            <li><strong>Theme slug:</strong> <?php echo esc_html($status['theme_slug']); ?></li>
            <li><strong>GitHub user:</strong> 🙋<?php echo esc_html($status['github_user']); ?></li>
            <li><strong>GitHub repo:</strong> 📖<a href="https://github.com/<?php echo esc_html($status['github_user'] . '/' . $status['github_repo']); ?>" target="_blank"><?php echo esc_html($status['github_repo']); ?></a></li>
            <li><strong>Tiene token:</strong> <?php echo ($status['has_token'] ? '🔐 Sí' : '🔓 No'); ?></li>
        </ul>
        <hr>
        <h3>📦 Último release en GitHub:</h3>
        <ul>            
    <?php if (isset($status['latest_release'])): ?>        
            <li><strong>Último release:</strong> 📅<a href="<?php echo esc_html($status['latest_release']['url']); ?>" target="_blank"><?php echo esc_html($status['latest_release']['new_version']); ?></a></li>
            <li><strong>Requiere WP:</strong> <?php echo esc_html($status['latest_release']['tested']); ?></li>
            <li><strong>Requiere PHP:</strong> <?php echo esc_html($status['latest_release']['requires_php']); ?></li>
            <li><strong>Última versión en GitHub:</strong> ✨<?php echo esc_html($status['latest_release']['new_version']); ?></li>
            <li><strong>Package URL:</strong> 🔗<a href="<?php echo esc_html($status['latest_release']['package']); ?>" target="_blank"><?php echo esc_html($status['latest_release']['package']); ?></a></li>
            <li><strong>¿Actualización disponible?:</strong> <?php echo ($status['update_available'] ? '<span style="color:green">👌 SÍ</span>' : '<span style="color:orange">🙂‍↔️ NO</span>'); ?></li>        
    <?php else: ?>
            <li><strong style="color:red;">Error:</strong> <?php echo esc_html($status['error']); ?></li>
    <?php endif; ?>
        </ul>        
        <hr>
        <h3>💾 Datos en caché:</h3>
        <code>
            <?php print_r($status['cached_data']); ?>
        </code>
        </pre>        
        <p><a href="<?php echo admin_url('themes.php?ileben_force_update=1'); ?>" class="button button-primary">🗣️​ Forzar verificación de actualizaciones</a></p>
        <p><a href="<?php echo admin_url('themes.php'); ?>" class="button">Volver a Temas 🌄</a></p>
        <?php
        $output = ob_get_clean();
        echo $output;
        exit;
    }
});