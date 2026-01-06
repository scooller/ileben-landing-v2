<?php
/**
 * Bootstrap Steps Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Steps Block
 */
function bootstrap_theme_render_bs_steps_block($attributes, $content, $block) {
    $currentStep = $attributes['currentStep'] ?? 2;
    $colorVariant = $attributes['colorVariant'] ?? 'primary';
    $showProgress = $attributes['showProgress'] ?? true;
    $animateProgress = $attributes['animateProgress'] ?? true;
    
    // Get step items from inner blocks
    $steps = [];
    if (!empty($block->inner_blocks)) {
        foreach ($block->inner_blocks as $inner_block) {
            if ($inner_block->block_type->name === 'bootstrap-theme/bs-step-item') {
                $steps[] = $inner_block->attributes['title'] ?? 'Step';
            }
        }
    }
    
    if (empty($steps)) {
        return '';
    }
    
    $total_steps = count($steps);
    $progress_percentage = $total_steps > 1 ? ((($currentStep - 1) / ($total_steps - 1)) * 100) : 0;
    $unique_id = 'bs-steps-' . uniqid();
    
    // Build wrapper classes
    $wrapper_classes = array('bs-steps');
    $wrapper_classes = bootstrap_theme_add_custom_classes($wrapper_classes, $attributes, $block);
    $wrapper_class_string = implode(' ', array_unique($wrapper_classes));
    
    ob_start();
    ?>
    <div class="<?php echo esc_attr($wrapper_class_string); ?>" id="<?php echo esc_attr($unique_id); ?>" data-current-step="<?php echo esc_attr($currentStep); ?>" data-total-steps="<?php echo esc_attr($total_steps); ?>" data-animate="<?php echo esc_attr($animateProgress ? 'true' : 'false'); ?>" data-porcentage="<?php echo esc_attr($progress_percentage); ?>">
        <div class="bs-steps-header d-flex flex-column justify-content-center flex-md-row justify-content-md-between align-items-center align-items-md-start position-relative mb-3">
            <?php if ($showProgress) : ?>
                <div class="bs-steps-progress position-absolute w-100 d-md-block d-none">
                    <div class="bg-light w-100 h-100"></div>
                    <div class="bg-<?php echo esc_attr($colorVariant); ?> h-100 bs-steps-progress-bar" style="width: <?php echo $animateProgress ? '0' : esc_attr($progress_percentage); ?>%;"></div>
                </div>
            <?php endif; ?>
            
            <?php foreach ($steps as $index => $step_title) : 
                $step_number = $index + 1;
                $is_active = $step_number === $currentStep;
                $is_completed = $step_number < $currentStep;
                
                $circle_classes = ['bs-step-circle', 'rounded-circle', 'd-inline-flex', 'align-items-center', 'justify-content-center', 'fw-bold', 'mb-2'];
                
                if ($is_active) {
                    $circle_classes[] = 'bg-' . $colorVariant;
                    $circle_classes[] = 'text-white';
                    $circle_classes[] = 'active';
                } elseif ($is_completed) {
                    $circle_classes[] = 'bg-outline-' . $colorVariant;
                    $circle_classes[] = 'active';
                    $circle_classes[] = 'completed';
                } else {
                    $circle_classes[] = 'bg-light';
                    $circle_classes[] = 'text-muted';
                    $circle_classes[] = 'border';
                }
                
                $title_classes = ['bs-step-title', 'small'];
                if ($is_active) {
                    $title_classes[] = 'fw-bold';
                    $title_classes[] = 'text-' . $colorVariant;
                } elseif ($is_completed) {
                    $title_classes[] = 'text-' . $colorVariant;
                } else {
                    $title_classes[] = 'text-white';
                }
            ?>
                <div class="bs-step text-center position-relative flex-grow-1 mb-2 mb-md-0">
                    <div class="<?php echo esc_attr(implode(' ', $circle_classes)); ?>">
                        <?php echo esc_html($step_number); ?>
                    </div>
                    <div class="<?php echo esc_attr(implode(' ', $title_classes)); ?>">
                        <?php echo esc_html($step_title); ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Steps Block
 */
function bootstrap_theme_register_bs_steps_block() {
    register_block_type('bootstrap-theme/bs-steps', array(
        'render_callback' => 'bootstrap_theme_render_bs_steps_block',
        'attributes' => array(
            'currentStep' => array(
                'type' => 'number',
                'default' => 2
            ),
            'colorVariant' => array(
                'type' => 'string',
                'default' => 'primary'
            ),
            'showProgress' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'animateProgress' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_steps_block');
