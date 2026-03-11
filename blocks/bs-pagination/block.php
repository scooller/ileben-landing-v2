<?php
/**
 * Bootstrap Pagination Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Pagination Block
 */
function bootstrap_theme_render_bs_pagination_block($attributes, $content, $block) {
    $size = $attributes['size'] ?? '';
    $alignment = $attributes['alignment'] ?? '';
    
    // Build pagination wrapper classes
    $wrapper_classes = array();
    
    if (!empty($alignment)) {
        switch ($alignment) {
            case 'center':
                $wrapper_classes[] = 'justify-content-center';
                break;
            case 'end':
                $wrapper_classes[] = 'justify-content-end';
                break;
        }
    }
    
    // Build pagination classes
    $pagination_classes = array('pagination');
    
    if (!empty($size)) {
        $pagination_classes[] = 'pagination-' . $size;
    }
    
    // Add custom CSS classes from Advanced panel
    $pagination_classes = bootstrap_theme_add_custom_classes($pagination_classes, $attributes, $block);
    
    $pagination_class_string = implode(' ', array_unique($pagination_classes));
    $ul_class_string = trim(implode(' ', array_filter([
        !empty($wrapper_classes) ? implode(' ', $wrapper_classes) : '',
        $pagination_class_string,
    ])));

    ob_start();
    ?>
    <nav aria-label="<?php echo esc_attr__('Page navigation', 'ileben-landing'); ?>">
        <ul class="<?php echo esc_attr($ul_class_string); ?>">
            <?php if (!empty($content)) : ?>
                <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            <?php else : ?>
                <li class="page-item disabled"><a class="page-link" href="#"><?php echo esc_html__('Previous', 'ileben-landing'); ?></a></li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#"><?php echo esc_html__('Next', 'ileben-landing'); ?></a></li>
            <?php endif; ?>
        </ul>
    </nav>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Pagination Block
 */
function bootstrap_theme_register_bs_pagination_block() {
    register_block_type('bootstrap-theme/bs-pagination', array(
        'render_callback' => 'bootstrap_theme_render_bs_pagination_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'alignment' => array(
                'type' => 'string',
                'default' => ''
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_pagination_block');