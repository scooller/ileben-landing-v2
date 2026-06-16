<?php

/**
 * Asesores Block
 *
 * Muestra la lista de asesores desde la API de ileben según el proyecto configurado.
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Fetch advisors from the ileben API.
 *
 * @param string $api_url     Base URL of the API.
 * @param string $api_token   Bearer token for authentication.
 * @param string $proyecto    Project slug to filter advisors.
 * @return array List of advisors, each with 'nombre', 'email', 'fono', 'imagen'.
 */
function bootstrap_theme_fetch_asesores_api($api_url, $api_token, $proyecto)
{
    if (empty($api_url) || empty($proyecto)) {
        return [];
    }

    // Ensure trailing slash
    $api_url = rtrim($api_url, '/') . '/';

    // Build the endpoint
    $endpoint = add_query_arg('proyecto', $proyecto, $api_url . 'asesores');

    // Cache key based on endpoint
    $cache_key = 'bs_asesores_' . md5($endpoint);
    $cached = get_transient($cache_key);
    if (false !== $cached) {
        return $cached;
    }

    $args = [
        'timeout' => 15,
        'headers' => [
            'Accept' => 'application/json',
        ],
    ];

    // Add Bearer token if provided
    if (!empty($api_token)) {
        $args['headers']['Authorization'] = 'Bearer ' . $api_token;
    }

    $response = wp_remote_get($endpoint, $args);

    if (is_wp_error($response)) {
        return [];
    }

    $status = wp_remote_retrieve_response_code($response);
    if ($status < 200 || $status >= 300) {
        return [];
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (!is_array($data)) {
        return [];
    }

    // Normalize: if the API wraps results in a key like 'data' or 'asesores'
    if (isset($data['data']) && is_array($data['data'])) {
        $data = $data['data'];
    } elseif (isset($data['asesores']) && is_array($data['asesores'])) {
        $data = $data['asesores'];
    }

    // Cache for 10 minutes
    set_transient($cache_key, $data, 10 * MINUTE_IN_SECONDS);

    return $data;
}

/**
 * Render Asesores block pulling data from the ileben API.
 */
function bootstrap_theme_render_bs_asesores_block($attributes, $content, $block)
{
    $columns_md = isset($attributes['columnsMd']) ? (int) $attributes['columnsMd'] : 2;
    $columns_lg = isset($attributes['columnsLg']) ? (int) $attributes['columnsLg'] : 3;
    $show_image = isset($attributes['showImage']) ? (bool) $attributes['showImage'] : true;
    $show_phone = isset($attributes['showPhone']) ? (bool) $attributes['showPhone'] : true;
    $show_email = isset($attributes['showEmail']) ? (bool) $attributes['showEmail'] : true;
    $avatar_shape = isset($attributes['avatarShape']) ? $attributes['avatarShape'] : 'card'; // 'card' | 'round'
    $layout = isset($attributes['layout']) ? $attributes['layout'] : 'horizontal'; // 'horizontal' | 'vertical'
    $content_mode = isset($attributes['contentMode']) ? $attributes['contentMode'] : 'both'; // 'both' | 'text' | 'buttons'
    $show_text = in_array($content_mode, ['both', 'text'], true);
    $show_actions = in_array($content_mode, ['both', 'buttons'], true);

    // Fetch from API
    $api_url    = function_exists('get_field') ? get_field('api_url', 'option') : '';
    $api_token  = function_exists('get_field') ? get_field('api_token', 'option') : '';
    $proyecto   = function_exists('get_field') ? get_field('api_proyecto_actual', 'option') : '';

    $asesores = bootstrap_theme_fetch_asesores_api($api_url, $api_token, $proyecto);

    if (empty($asesores) || !is_array($asesores)) {
        if (current_user_can('manage_options')) {
            $reason = '';
            if (empty($api_url) || empty($proyecto)) {
                $reason = __('Configura la URL de la API y el Proyecto Actual en Opciones de Tema > API.', 'ileben-landing');
            } else {
                $reason = __('No se pudieron obtener asesores desde la API. Verifica la configuración.', 'ileben-landing');
            }
            return '<div class="alert alert-warning">' . esc_html($reason) . '</div>';
        }
        return '';
    }

    // Build wrapper classes
    $classes = ['bs-asesores', 'row', 'row-cols-1', 'g-3', 'justify-content-center'];
    $cd_classes = ['card', 'h-100', 'bs-asesor-card', 'text-center'];
    if ($columns_md > 1) {
        $classes[] = 'row-cols-md-' . $columns_md;
    }
    if ($columns_lg > 1) {
        $classes[] = 'row-cols-lg-' . $columns_lg;
    }
    $cd_classes = bootstrap_theme_add_custom_classes($cd_classes, $attributes, $block);
    $wrapper_classes = implode(' ', array_unique($classes));
    $card_classes = implode(' ', array_unique($cd_classes));

    ob_start();
?>
    <div class="<?php echo esc_attr($wrapper_classes); ?>">
        <?php foreach ($asesores as $index => $asesor) :
            // Map API fields — supports both snake_case (api standard) and camelCase
            $image = isset($asesor['imagen']) ? $asesor['imagen'] : (isset($asesor['imagenUrl']) ? $asesor['imagenUrl'] : '');
            $image = isset($asesor['foto']) ? $asesor['foto'] : $image;
            $name  = isset($asesor['nombre']) ? $asesor['nombre'] : (isset($asesor['name']) ? $asesor['name'] : '');
            $email = isset($asesor['email']) ? $asesor['email'] : '';
            $phone = isset($asesor['fono']) ? $asesor['fono'] : (isset($asesor['telefono']) ? $asesor['telefono'] : (isset($asesor['phone']) ? $asesor['phone'] : ''));

            // Build hrefs
            $wa_href = '';
            if ($phone !== '') {
                $digits = preg_replace('/\D+/', '', $phone);
                if ($digits !== '') {
                    $wa_number = function_exists('str_starts_with') && str_starts_with($digits, '56') ? $digits : '56' . $digits;
                    $wa_href = 'https://wa.me/' . $wa_number;
                }
            }
            $mailto_href = $email !== '' ? 'mailto:' . sanitize_email($email) : '';
            // Animation data attrs (shared across cards)
            $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);
            // add delay based on index
            $delay = $index * ($attributes['animationDelay'] ?? 0);
            $animation_attrs = preg_replace(
                '/data-animate-delay="[^"]*"/',
                'data-animate-delay="' . esc_attr($delay) . '"',
                $animation_attrs
            );
        ?>
            <div class="col">
                <div class="<?php echo esc_attr($card_classes); ?>" <?php echo $animation_attrs; ?>>
                    <?php if ($layout === 'vertical') : ?>
                        <?php if ($show_image && $image) : ?>
                            <?php if ($avatar_shape === 'card') : ?>
                                <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($name); ?>" class="card-img-top" loading="lazy" />
                            <?php else : ?>
                                <div class="bs-asesor-avatar text-center pt-3">
                                    <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($name); ?>" class="img-fluid rounded-circle" loading="lazy" />
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>
                        <div class="card-body">
                            <div class="card-title mb-3">
                                <?php if ($name !== '') : ?>
                                    <?php echo esc_html($name); ?>
                                <?php endif; ?>
                                <?php if ($show_text && $show_phone && $phone !== '') : ?>
                                    <div class="small mb-1"><?php echo esc_html($phone); ?></div>
                                <?php endif; ?>
                                <?php if ($show_text && $show_email && $email !== '') : ?>
                                    <div class="small mb-2"><?php echo esc_html($email); ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="card-text">
                                <div class="d-flex flex-wrap justify-content-center gap-2 mt-2">
                                    <?php if ($show_actions && $show_phone && $wa_href !== '') : ?>
                                        <a class="btn btn-success btn-sm" href="<?php echo esc_url($wa_href); ?>" target="_blank" rel="noopener noreferrer">
                                            <i class="fa-brands fa-whatsapp"></i>
                                            <?php esc_html_e('WhatsApp', 'ileben-landing'); ?>
                                        </a>
                                    <?php endif; ?>
                                    <?php if ($show_actions && $show_email && $mailto_href !== '') : ?>
                                        <a class="btn btn-danger btn-sm" href="<?php echo esc_url($mailto_href); ?>">
                                            <i class="fa-solid fa-at"></i>
                                            <?php esc_html_e('Escríbeme', 'ileben-landing'); ?>
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    <?php else : ?>
                        <div class="card-body">
                            <div class="row">
                                <?php if ($show_image && $image) : ?>
                                    <div class="col">
                                        <?php if ($avatar_shape === 'card') : ?>
                                            <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($name); ?>" class="img-fluid card-img" loading="lazy" />
                                        <?php else : ?>
                                            <div class="bs-asesor-avatar">
                                                <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($name); ?>" class="img-fluid rounded-circle" loading="lazy" />
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                                <div class="col d-flex align-items-center justify-content-center">
                                    <div class="content-wrapper row">
                                        <div class="card-title mb-3 col">
                                            <?php if ($name !== '') : ?>
                                                <strong><?php echo esc_html($name); ?></strong>
                                            <?php endif; ?>
                                            <?php if ($show_text && $show_phone && $phone !== '') : ?>
                                                <div class="small mb-1 mt-2"><?php echo esc_html($phone); ?></div>
                                            <?php endif; ?>
                                            <?php if ($show_text && $show_email && $email !== '') : ?>
                                                <div class="small mb-2 mt-1"><?php echo esc_html($email); ?></div>
                                            <?php endif; ?>
                                        </div>
                                        <div class="card-text col">
                                            <div class="d-flex flex-wrap justify-content-center gap-2 mt-2">
                                                <?php if ($show_actions && $show_phone && $wa_href !== '') : ?>
                                                    <a class="btn btn-success btn-sm" href="<?php echo esc_url($wa_href); ?>" target="_blank" rel="noopener noreferrer">
                                                        <i class="fa-brands fa-whatsapp"></i>
                                                        <?php esc_html_e('WhatsApp', 'ileben-landing'); ?>
                                                    </a>
                                                <?php endif; ?>
                                                <?php if ($show_actions && $show_email && $mailto_href !== '') : ?>
                                                    <a class="btn btn-danger btn-sm" href="<?php echo esc_url($mailto_href); ?>">
                                                        <i class="fa-solid fa-at"></i>
                                                        <?php esc_html_e('Escríbeme', 'ileben-landing'); ?>
                                                    </a>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
<?php
    return ob_get_clean();
}

/**
 * Register block
 */
function bootstrap_theme_register_bs_asesores_block()
{
    register_block_type('bootstrap-theme/bs-asesores', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_asesores_block',
        'attributes' => array(
            'columnsMd' => array(
                'type' => 'number',
                'default' => 2,
            ),
            'columnsLg' => array(
                'type' => 'number',
                'default' => 3,
            ),
            'showImage' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'showPhone' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'showEmail' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'avatarShape' => array(
                'type' => 'string',
                'default' => 'card',
            ),
            'layout' => array(
                'type' => 'string',
                'default' => 'horizontal',
            ),
            'contentMode' => array(
                'type' => 'string',
                'default' => 'both',
            ),
            // Animation attributes
            'animationType' => array('type' => 'string'),
            'animationTrigger' => array('type' => 'string'),
            'animationDuration' => array('type' => 'number'),
            'animationDelay' => array('type' => 'number'),
            'animationEase' => array('type' => 'string'),
            'animationRepeat' => array('type' => 'number'),
            'animationRepeatDelay' => array('type' => 'number'),
            'animationYoyo' => array('type' => 'boolean'),
            'animationDistance' => array('type' => 'string'),
            'animationRotation' => array('type' => 'number'),
            'animationScale' => array('type' => 'string'),
            'animationParallaxSpeed' => array('type' => 'number'),
            'animationHoverEffect' => array('type' => 'string'),
            'animationMobileEnabled' => array('type' => 'boolean'),
            'className' => array(
                'type' => 'string',
                'default' => '',
            ),
        ),
        'supports' => array(
            'html' => false,
        ),
    ));
}
add_action('init', 'bootstrap_theme_register_bs_asesores_block');
