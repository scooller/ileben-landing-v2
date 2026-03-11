<?php
/**
 * Bootstrap Navs & Tabs Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Navs & Tabs Block
 */
function bootstrap_theme_render_bs_navs_tabs_block($attributes, $content, $block) {
    $type = $attributes['type'] ?? 'tabs';
    $fill = $attributes['fill'] ?? false;
    $justified = $attributes['justified'] ?? false;
    $vertical = $attributes['vertical'] ?? false;
    $navId = $attributes['navId'] ?? 'nav-' . uniqid();

    // Build nav classes
    $nav_classes = array('nav');
    switch ($type) {
        case 'tabs':
            $nav_classes[] = 'nav-tabs';
            break;
        case 'pills':
            $nav_classes[] = 'nav-pills';
            break;
        case 'underline':
            $nav_classes[] = 'nav-underline';
            break;
    }
    if ($fill) {
        $nav_classes[] = 'nav-fill';
    }
    if ($justified) {
        $nav_classes[] = 'nav-justified';
    }
    // Add custom CSS classes from Advanced panel
    $nav_classes = bootstrap_theme_add_custom_classes($nav_classes, $attributes, $block);
    $nav_class_string = implode(' ', array_unique($nav_classes));

    ob_start();
    ?>
    <?php if ($vertical) : ?>
        <div class="d-flex align-items-start">
            <div class="nav flex-column nav-pills me-3" id="<?php echo esc_attr($navId); ?>-tab" role="tablist" aria-orientation="vertical">
                <?php if (!empty($content)) : ?>
                    <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                <?php else : ?>
                    <li class="nav-item"><span class="nav-link disabled"><?php echo esc_html__('Agrega pestanas', 'ileben-landing'); ?></span></li>
                <?php endif; ?>
            </div>
            <div class="tab-content" id="<?php echo esc_attr($navId); ?>-tabContent"></div>
        </div>
    <?php else : ?>
        <ul class="<?php echo esc_attr($nav_class_string); ?>" id="<?php echo esc_attr($navId); ?>-tab" role="tablist">
            <?php if (!empty($content)) : ?>
                <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            <?php else : ?>
                <li class="nav-item"><span class="nav-link disabled"><?php echo esc_html__('Agrega pestanas', 'ileben-landing'); ?></span></li>
            <?php endif; ?>
        </ul>
        <div class="tab-content" id="<?php echo esc_attr($navId); ?>-tabContent"></div>
    <?php endif; ?>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Navs & Tabs Block
 */
function bootstrap_theme_register_bs_navs_tabs_block() {
    register_block_type('bootstrap-theme/bs-navs-tabs', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_navs_tabs_block',
        'attributes' => array(
            'type' => array(
                'type' => 'string',
                'default' => 'tabs'
            ),
            'fill' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'justified' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'vertical' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'navId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        ),
        'supports' => array(
            'html' => true
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_navs_tabs_block');
