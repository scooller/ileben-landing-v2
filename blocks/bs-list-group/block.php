<?php

/**
 * Bootstrap List Group Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap List Group Block
 */
function bootstrap_theme_render_bs_list_group_block($attributes, $content, $block)
{
    $flush = $attributes['flush'] ?? false;
    $numbered = $attributes['numbered'] ?? false;
    $horizontal = $attributes['horizontal'] ?? '';

    // Build list group classes
    $classes = array('list-group');

    if ($flush) {
        $classes[] = 'list-group-flush';
    }

    if ($numbered) {
        $classes[] = 'list-group-numbered';
    }

    if (!empty($horizontal)) {
        $classes[] = 'list-group-' . $horizontal;
    }

    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);

    $class_string = implode(' ', array_unique($classes));

    $tag = $numbered ? 'ol' : 'ul';

    ob_start();
    ?>
    <<?php echo esc_html($tag); ?> class="<?php echo esc_attr($class_string); ?>">
        <?php if (!empty($block->inner_blocks)) : ?>
            <?php foreach ($block->inner_blocks as $inner_block) : ?>
                <?php echo $inner_block->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            <?php endforeach; ?>
        <?php elseif (!empty($content)) : ?>
            <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
        <?php else : ?>
            <div class="list-group-item"><?php echo esc_html__('First item', 'ileben-landing'); ?></div>
            <div class="list-group-item active"><?php echo esc_html__('Second item', 'ileben-landing'); ?></div>
            <div class="list-group-item"><?php echo esc_html__('Third item', 'ileben-landing'); ?></div>
        <?php endif; ?>
    </<?php echo esc_html($tag); ?>>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap List Group Block
 */
function bootstrap_theme_register_bs_list_group_block()
{
    register_block_type('bootstrap-theme/bs-list-group', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_list_group_block',
        'attributes' => array(
            'flush' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'numbered' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'horizontal' => array(
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
add_action('init', 'bootstrap_theme_register_bs_list_group_block');