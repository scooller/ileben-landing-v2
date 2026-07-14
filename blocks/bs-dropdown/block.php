<?php

/**
 * Bootstrap Dropdown Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Dropdown Block
 */
function bootstrap_theme_render_bs_dropdown_block($attributes, $content, $block)
{
    $buttonText = $attributes['buttonText'] ?? __('Dropdown', 'ileben-landing');
    $buttonVariant = $attributes['buttonVariant'] ?? 'secondary';
    $split = $attributes['split'] ?? false;
    $direction = $attributes['direction'] ?? 'down';
    $size = $attributes['size'] ?? '';
    $alignment = $attributes['alignment'] ?? '';
    $dark = $attributes['dark'] ?? false;
    $autoClose = $attributes['autoClose'] ?? 'true';
    $dropdownId = $attributes['dropdownId'] ?? 'dropdown-' . uniqid();

    // Normalize variant: editor stores 'secondary', PHP needs 'btn-secondary'
    $btn_variant_class = str_starts_with($buttonVariant, 'btn-') ? $buttonVariant : "btn-{$buttonVariant}";
    $btn_size_class = !empty($size) ? $size : '';

    // Build dropdown wrapper classes
    $wrapper_classes = array();

    switch ($direction) {
        case 'up':
            $wrapper_classes[] = 'dropup';
            break;
        case 'end':
            $wrapper_classes[] = 'dropend';
            break;
        case 'start':
            $wrapper_classes[] = 'dropstart';
            break;
        case 'center':
            $wrapper_classes[] = 'dropdown-center';
            break;
        case 'up-center':
            $wrapper_classes[] = 'dropup-center';
            $wrapper_classes[] = 'dropup';
            break;
        default:
            $wrapper_classes[] = 'dropdown';
            break;
    }

    if ($split) {
        $wrapper_classes[] = 'btn-group';
    }

    // Add custom CSS classes from Advanced panel
    $wrapper_classes = bootstrap_theme_add_custom_classes($wrapper_classes, $attributes, $block);

    $wrapper_class_string = implode(' ', array_unique($wrapper_classes));

    ob_start();
?>
    <div class="<?php echo esc_attr($wrapper_class_string); ?>">
        <?php if ($split) : ?>
            <button type="button" class="btn <?php echo esc_attr($btn_variant_class); ?> <?php echo esc_attr($btn_size_class); ?>"><?php echo esc_html($buttonText); ?></button>
            <button type="button" class="btn <?php echo esc_attr($btn_variant_class); ?> <?php echo esc_attr($btn_size_class); ?> dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" data-bs-auto-close="<?php echo esc_attr($autoClose); ?>" aria-expanded="false" id="<?php echo esc_attr($dropdownId); ?>">
                <span class="visually-hidden"><?php echo esc_html__('Toggle Dropdown', 'ileben-landing'); ?></span>
            </button>
        <?php else : ?>
            <button class="btn <?php echo esc_attr($btn_variant_class); ?> <?php echo esc_attr($btn_size_class); ?> dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="<?php echo esc_attr($autoClose); ?>" aria-expanded="false" id="<?php echo esc_attr($dropdownId); ?>">
                <?php echo esc_html($buttonText); ?>
            </button>
        <?php endif; ?>

        <ul class="dropdown-menu <?php echo esc_attr($alignment); ?>"<?php echo $dark ? ' data-bs-theme="dark"' : ''; ?> aria-labelledby="<?php echo esc_attr($dropdownId); ?>">
            <?php if (!empty($content)) : ?>
                <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
                ?>
            <?php else : ?>
                <li><a class="dropdown-item" href="#"><?php echo esc_html__('Action', 'ileben-landing'); ?></a></li>
                <li><a class="dropdown-item" href="#"><?php echo esc_html__('Another action', 'ileben-landing'); ?></a></li>
                <li>
                    <hr class="dropdown-divider">
                </li>
                <li><a class="dropdown-item" href="#"><?php echo esc_html__('Something else here', 'ileben-landing'); ?></a></li>
            <?php endif; ?>
        </ul>
    </div>
<?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Dropdown Block
 */
function bootstrap_theme_register_bs_dropdown_block()
{
    register_block_type('bootstrap-theme/bs-dropdown', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_dropdown_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'buttonText' => array(
                'type' => 'string',
                'default' => 'Dropdown'
            ),
            'buttonVariant' => array(
                'type' => 'string',
                'default' => 'secondary'
            ),
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'split' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'direction' => array(
                'type' => 'string',
                'default' => 'down'
            ),
            'alignment' => array(
                'type' => 'string',
                'default' => ''
            ),
            'dark' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'autoClose' => array(
                'type' => 'string',
                'default' => 'true'
            ),
            'dropdownId' => array(
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
add_action('init', 'bootstrap_theme_register_bs_dropdown_block');
