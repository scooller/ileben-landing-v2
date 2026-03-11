<?php
/**
 * Bootstrap Accordion Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Accordion Block
 */
function bootstrap_theme_render_bs_accordion_block($attributes, $content, $block) {
    $accordionId = $attributes['accordionId'] ?? 'accordion-' . uniqid();
    $flush = $attributes['flush'] ?? false;
    $alwaysOpen = $attributes['alwaysOpen'] ?? false;
    
    // Build accordion classes
    $classes = array('accordion');
    
    if ($flush) {
        $classes[] = 'accordion-flush';
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    ob_start();
    ?>
    <div class="<?php echo esc_attr($class_string); ?>" id="<?php echo esc_attr($accordionId); ?>"<?php echo !$alwaysOpen ? ' data-bs-accordion-parent="true"' : ''; ?>>
        <?php if (!empty($content)) : ?>
            <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
        <?php else : ?>
            <div class="accordion-item">
                <h2 class="accordion-header" id="<?php echo esc_attr($accordionId); ?>-heading-0">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#<?php echo esc_attr($accordionId); ?>-collapse-0" aria-expanded="true" aria-controls="<?php echo esc_attr($accordionId); ?>-collapse-0">
                        <?php echo esc_html__('Accordion Item #1', 'ileben-landing'); ?>
                    </button>
                </h2>
                <div id="<?php echo esc_attr($accordionId); ?>-collapse-0" class="accordion-collapse collapse show" aria-labelledby="<?php echo esc_attr($accordionId); ?>-heading-0" data-bs-parent="#<?php echo esc_attr($accordionId); ?>">
                    <div class="accordion-body"><?php echo esc_html__('Add content to your accordion.', 'ileben-landing'); ?></div>
                </div>
            </div>
        <?php endif; ?>
    </div>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Accordion Block
 */
function bootstrap_theme_register_bs_accordion_block() {
    register_block_type('bootstrap-theme/bs-accordion', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_accordion_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'accordionId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'flush' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'alwaysOpen' => array(
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
add_action('init', 'bootstrap_theme_register_bs_accordion_block');