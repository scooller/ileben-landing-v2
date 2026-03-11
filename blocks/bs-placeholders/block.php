<?php
/**
 * Bootstrap Placeholders Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Placeholders Block
 */
function bootstrap_theme_render_bs_placeholders_block($attributes, $content, $block) {
    $animation = $attributes['animation'] ?? '';
    $color = $attributes['color'] ?? '';
    $size = $attributes['size'] ?? '';
    $placeholders = $attributes['placeholders'] ?? array();

    if (empty($placeholders)) {
        $placeholders = array(
            array('width' => '6', 'type' => 'placeholder'),
            array('width' => '4', 'type' => 'placeholder'),
            array('width' => '4', 'type' => 'placeholder'),
            array('width' => '6', 'type' => 'placeholder'),
            array('width' => '8', 'type' => 'placeholder')
        );
    }

    // Build container classes
    $container_classes = array('placeholder-container');

    // Add custom CSS classes from Advanced panel
    $container_classes = bootstrap_theme_add_custom_classes($container_classes, $attributes, $block);

    $container_class_string = implode(' ', array_unique($container_classes));

    ob_start();
    ?>
    <div class="<?php echo esc_attr($container_class_string); ?>">
        <?php foreach ($placeholders as $placeholder) : ?>
            <?php
            $width = $placeholder['width'] ?? '12';
            $type = $placeholder['type'] ?? 'placeholder';
            ?>
            <?php if ($type === 'text') : ?>
                <p class="placeholder-paragraph">
                    <?php $for_count = intval($width); ?>
                    <?php for ($i = 0; $i < $for_count; $i++) : ?>
                        <span class="placeholder col-<?php echo esc_attr($width); ?>"></span>
                    <?php endfor; ?>
                </p>
            <?php else : ?>
                <?php
                $classes = array('placeholder');
                if (!empty($color)) {
                    $classes[] = 'bg-' . $color;
                }
                if (!empty($size)) {
                    $classes[] = 'placeholder-' . $size;
                }
                if (!empty($animation)) {
                    $classes[] = 'placeholder-' . $animation;
                }
                $classes[] = 'col-' . $width;
                $class_string = implode(' ', $classes);
                ?>
                <span class="<?php echo esc_attr($class_string); ?>"></span>
            <?php endif; ?>
        <?php endforeach; ?>
    </div>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Placeholders Block
 */
function bootstrap_theme_register_bs_placeholders_block() {
    register_block_type('bootstrap-theme/bs-placeholders', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_placeholders_block',
        'attributes' => array(
            'animation' => array(
                'type' => 'string',
                'default' => ''
            ),
            'color' => array(
                'type' => 'string',
                'default' => ''
            ),
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'placeholders' => array(
                'type' => 'array',
                'default' => array()
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_placeholders_block');
