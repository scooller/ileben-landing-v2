<?php

/**
 * Card Group Block
 *
 * Container for cards with two layout modes:
 *  - card-group: cards attached with equal width and equal height footers
 *  - row: Bootstrap grid row with row-cols-* responsive columns
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Card Group Block
 */
function bootstrap_theme_render_bs_card_group_block($attributes, $content, $block)
{
    $layout     = $attributes['layout'] ?? 'row';
    $row_cols   = $attributes['rowCols'] ?? '3';
    $gutters    = $attributes['gutters'] ?? 'g-3';

    $classes = array('bs-card-group');

    if ($layout === 'group') {
        $classes[] = 'card-group';
    } else {
        $classes[] = 'row';
        $classes[] = 'row-cols-' . $row_cols;
        // Add responsive suffixes for better defaults
        $classes[] = 'row-cols-md-' . $row_cols;
        if (!empty($gutters)) {
            $classes[] = $gutters;
        }
    }

    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    $class_string = implode(' ', array_unique($classes));

    ob_start();
?>
    <div class="<?php echo esc_attr($class_string); ?>">
        <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
        ?>
    </div>
<?php
    return ob_get_clean();
}

/**
 * Register Card Group Block
 */
function bootstrap_theme_register_bs_card_group_block()
{
    register_block_type('bootstrap-theme/bs-card-group', array(
        'api_version'     => 3,
        'render_callback' => 'bootstrap_theme_render_bs_card_group_block',
        'attributes'      => array(
            'layout' => array(
                'type'    => 'string',
                'default' => 'row',
            ),
            'rowCols' => array(
                'type'    => 'string',
                'default' => '3',
            ),
            'gutters' => array(
                'type'    => 'string',
                'default' => 'g-3',
            ),
            'className' => array(
                'type'    => 'string',
                'default' => '',
            ),
        ),
    ));
}
add_action('init', 'bootstrap_theme_register_bs_card_group_block');
