<?php

/**
 * Bootstrap Tab Pane Block
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Tab Pane Block
 */
function bootstrap_theme_render_bs_tab_pane_block($attributes, $content, $block)
{
    $title  = $attributes['title'] ?? __('Tab', 'ileben-landing');
    $active = $attributes['active'] ?? false;
    $paneId = $attributes['paneId'] ?? 'pane-' . uniqid();
    $fade   = $attributes['fade'] ?? true;

    $pane_classes = array('tab-pane');
    if ($fade) {
        $pane_classes[] = 'fade';
    }
    if ($active) {
        $pane_classes[] = 'show';
        $pane_classes[] = 'active';
    }

    $pane_classes = bootstrap_theme_add_custom_classes($pane_classes, $attributes, $block);
    $pane_class_string = implode(' ', array_unique($pane_classes));

    ob_start();
?>
    <div class="<?php echo esc_attr($pane_class_string); ?>" id="<?php echo esc_attr($paneId); ?>" role="tabpanel" aria-labelledby="<?php echo esc_attr($paneId); ?>-tab">
        <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
        ?>
    </div>
<?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Tab Pane Block
 */
function bootstrap_theme_register_bs_tab_pane_block()
{
    register_block_type('bootstrap-theme/bs-tab-pane', array(
        'api_version'     => 3,
        'render_callback' => 'bootstrap_theme_render_bs_tab_pane_block',
        'supports'        => array(
            'html' => true,
        ),
        'attributes' => array(
            'title' => array(
                'type'    => 'string',
                'default' => 'Tab',
            ),
            'active' => array(
                'type'    => 'boolean',
                'default' => false,
            ),
            'paneId' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'fade' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'className' => array(
                'type'    => 'string',
                'default' => '',
            ),
        ),
    ));
}
add_action('init', 'bootstrap_theme_register_bs_tab_pane_block');
