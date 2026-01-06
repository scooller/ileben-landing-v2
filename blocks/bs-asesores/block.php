<?php
/**
 * Asesores Block
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Asesores block pulling data from ACF options
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

    $asesores = function_exists('get_field') ? get_field('asesores', 'option') : [];
    if (empty($asesores) || !is_array($asesores)) {
        return '';
    }

    // Build wrapper classes
    $classes = ['bs-asesores', 'row', 'row-cols-1', 'g-3'];
    if ($columns_md > 1) {
        $classes[] = 'row-cols-md-' . $columns_md;
    }
    if ($columns_lg > 1) {
        $classes[] = 'row-cols-lg-' . $columns_lg;
    }
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    $wrapper_classes = implode(' ', array_unique($classes));

    ob_start();
    ?>
    <div class="<?php echo esc_attr($wrapper_classes); ?>">
        <?php foreach ($asesores as $asesor) :
            $image = isset($asesor['imagen']) ? $asesor['imagen'] : '';
            $name = isset($asesor['nombre']) ? $asesor['nombre'] : '';
            $email = isset($asesor['email']) ? $asesor['email'] : '';
            $phone = isset($asesor['fono']) ? $asesor['fono'] : '';

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
            ?>
            <div class="col">
                <div class="card h-100 bs-asesor-card text-center">
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
                            <?php if ($name !== '') : ?>
                                <div class="card-title mb-3"><?php echo esc_html($name); ?></div>
                            <?php endif; ?>
                            <div class="card-text">
                                <?php if ($show_text && $show_phone && $phone !== '') : ?>
                                    <div class="small mb-1"><?php echo esc_html($phone); ?></div>
                                <?php endif; ?>
                                <?php if ($show_text && $show_email && $email !== '') : ?>
                                    <div class="small mb-2"><?php echo esc_html($email); ?></div>
                                <?php endif; ?>
                                <div class="d-flex flex-wrap justify-content-center gap-2 mt-2">
                                    <?php if ($show_actions && $show_phone && $wa_href !== '') : ?>
                                        <a class="btn btn-success btn-sm" href="<?php echo esc_url($wa_href); ?>" target="_blank" rel="noopener noreferrer">
                                            <i class="fa-brands fa-whatsapp"></i>
                                            <?php esc_html_e('WhatsApp', 'bootstrap-theme'); ?>
                                        </a>
                                    <?php endif; ?>
                                    <?php if ($show_actions && $show_email && $mailto_href !== '') : ?>
                                        <a class="btn btn-danger btn-sm" href="<?php echo esc_url($mailto_href); ?>">
                                            <i class="fa-solid fa-at"></i>
                                            <?php esc_html_e('Escríbeme', 'bootstrap-theme'); ?>
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
                                    <div class="content-wrapper">
                                        <?php if ($name !== '') : ?>
                                        <div class="card-title mb-3"><?php echo esc_html($name); ?></div>
                                        <?php endif; ?>
                                        <div class="card-text">
                                            <?php if ($show_text && $show_phone && $phone !== '') : ?>
                                                <div class="small mb-1"><?php echo esc_html($phone); ?></div>
                                            <?php endif; ?>
                                            <?php if ($show_text && $show_email && $email !== '') : ?>
                                                <div class="small mb-2"><?php echo esc_html($email); ?></div>
                                            <?php endif; ?>
                                            <div class="d-flex flex-wrap justify-content-center gap-2 mt-2">
                                                <?php if ($show_actions && $show_phone && $wa_href !== '') : ?>                                        
                                                    <a class="btn btn-success btn-sm" href="<?php echo esc_url($wa_href); ?>" target="_blank" rel="noopener noreferrer">
                                                        <i class="fa-brands fa-whatsapp"></i>
                                                        <?php esc_html_e('WhatsApp', 'bootstrap-theme'); ?>
                                                    </a>
                                                <?php endif; ?>
                                                <?php if ($show_actions && $show_email && $mailto_href !== '') : ?>
                                                    <a class="btn btn-danger btn-sm" href="<?php echo esc_url($mailto_href); ?>">
                                                        <i class="fa-solid fa-at"></i>
                                                        <?php esc_html_e('Escríbeme', 'bootstrap-theme'); ?>
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
            'className' => array(
                'type' => 'string',
                'default' => '',
            ),
        ),
        'supports' => array(
            'html' => true,
        ),
    ));
}
add_action('init', 'bootstrap_theme_register_bs_asesores_block');
