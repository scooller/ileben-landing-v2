<?php
/**
 * Bootstrap Progress Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Progress Block
 */
function bootstrap_theme_render_bs_progress_block($attributes, $content, $block) {

    $value = $attributes['value'] ?? 0;
    $min = $attributes['min'] ?? 0;
    $max = $attributes['max'] ?? 100;
    $label = $attributes['label'] ?? '';
    $variant = $attributes['variant'] ?? '';
    $striped = $attributes['striped'] ?? false;
    $animated = $attributes['animated'] ?? false;
    $showLabel = $attributes['showLabel'] ?? false;
    $height = $attributes['height'] ?? '';
    
    // Build progress bar classes
    $bar_classes = array('progress-bar');
    
    if (!empty($variant)) {
        $bar_classes[] = 'bg-' . $variant;
    }
    
    if ($striped || $animated) {
        $bar_classes[] = 'progress-bar-striped';
    }
    
    if ($animated) {
        $bar_classes[] = 'progress-bar-animated';
    }
    
    $bar_class_string = implode(' ', $bar_classes);
    
    // Calculate percentage
    $percentage = $max > $min ? (($value - $min) / ($max - $min)) * 100 : 0;
    $percentage = max(0, min(100, $percentage));
    
    // Build progress wrapper classes
    $progress_classes = array('progress');
    
    // Add custom CSS classes from Advanced panel
    $progress_classes = bootstrap_theme_add_custom_classes($progress_classes, $attributes, $block);
    
    $progress_class_string = implode(' ', array_unique($progress_classes));
    
    ob_start();
    ?>
    <div class="<?php echo esc_attr($progress_class_string); ?>"<?php echo !empty($height) ? ' style="height: ' . esc_attr($height) . ';"' : ''; ?>>
        <div class="<?php echo esc_attr($bar_class_string); ?>" role="progressbar" style="width: <?php echo esc_attr($percentage); ?>%;" aria-valuenow="<?php echo esc_attr($value); ?>" aria-valuemin="<?php echo esc_attr($min); ?>" aria-valuemax="<?php echo esc_attr($max); ?>">
            <?php if (!empty($label)) : ?>
                <?php echo esc_html($label); ?>
            <?php elseif ($showLabel) : ?>
                <?php echo esc_html(round($percentage) . '%'); ?>
            <?php endif; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Progress Block
 */
function bootstrap_theme_register_bs_progress_block() {
    register_block_type('bootstrap-theme/bs-progress', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_progress_block',
        'attributes' => array(
            'value' => array(
                'type' => 'number',
                'default' => 50
            ),
            'min' => array(
                'type' => 'number',
                'default' => 0
            ),
            'max' => array(
                'type' => 'number',
                'default' => 100
            ),
            'label' => array(
                'type' => 'string',
                'default' => ''
            ),
            'variant' => array(
                'type' => 'string',
                'default' => 'primary'
            ),
            'striped' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'animated' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'height' => array(
                'type' => 'string',
                'default' => ''
            ),
            'showLabel' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_progress_block');
