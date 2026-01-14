<?php
/**
 * FontAwesome Icon Block
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_fa_icon_block($attributes, $content, $block) {
    $icon_style = $attributes['iconStyle'] ?? 'fa-solid';
    $icon_name  = $attributes['iconName'] ?? 'fa-star';
    $size       = $attributes['size'] ?? 'fa-2x';
    $color      = $attributes['color'] ?? '';
    $align      = $attributes['align'] ?? '';

    $icon_classes = array_filter([
        $icon_style,
        $icon_name,
        $size,
    ]);

    $wrapper_classes = ['fa-icon-block'];
    if (!empty($align)) {
        $wrapper_classes[] = 'text-' . $align;
    }

    // Allow custom classes from Advanced panel
    if (!empty($attributes['className'])) {
        $wrapper_classes[] = $attributes['className'];
    }

    $style_attr = '';
    if (!empty($color)) {
        $style_attr = ' style="color: ' . esc_attr($color) . ';"';
    }

    // Get animation data attributes
    $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);

    ob_start();
    ?>
    <div class="<?php echo esc_attr(implode(' ', array_unique($wrapper_classes))); ?>"<?php echo $animation_attrs; ?>>
        <i class="<?php echo esc_attr(implode(' ', $icon_classes)); ?>" aria-hidden="true"<?php echo $style_attr; ?>></i>
    </div>
    <?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_fa_icon_block() {
    register_block_type('bootstrap-theme/bs-fa-icon', [
        'render_callback' => 'bootstrap_theme_render_bs_fa_icon_block',
        'attributes' => [
            'iconStyle' => [
                'type' => 'string',
                'default' => 'fa-solid',
            ],
            'iconName' => [
                'type' => 'string',
                'default' => 'fa-star',
            ],
            'size' => [
                'type' => 'string',
                'default' => 'fa-2x',
            ],
            'color' => [
                'type' => 'string',
                'default' => '',
            ],
            'align' => [
                'type' => 'string',
                'default' => '',
            ],
            'className' => [
                'type' => 'string',
                'default' => '',
            ],
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
        ],
    ]);
}
add_action('init', 'bootstrap_theme_register_bs_fa_icon_block');
