<?php
/**
 * Block: Amenity Item
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_amenity_item($attributes, $content, $block)
{
    $title = isset($attributes['title']) ? $attributes['title'] : '';
    $description = isset($attributes['description']) ? $attributes['description'] : '';
    $iconType = isset($attributes['iconType']) ? $attributes['iconType'] : 'icon';
    $icon = isset($attributes['icon']) ? $attributes['icon'] : 'fa-solid fa-check';
    $imageUrl = isset($attributes['imageUrl']) ? $attributes['imageUrl'] : '';
    
    ob_start();
    ?>
    <div class="col bs-amenity-item <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>">
        <div class="card h-100 border-0 bg-transparent text-center bs-amenity-card">
            <div class="card-body p-3">
                <div class="bs-amenity-icon text-primary mb-3 d-flex justify-content-center align-items-center" style="height: 2.5rem;">
                    <?php if ($iconType === 'image' && !empty($imageUrl)): ?>
                        <img src="<?php echo esc_url($imageUrl); ?>" alt="<?php echo esc_attr($title); ?>" class="img-fluid" style="max-height: 2.5rem; object-fit: contain;">
                    <?php else: ?>
                        <i class="<?php echo esc_attr($icon); ?>" style="font-size: 2.5rem;"></i>
                    <?php endif; ?>
                </div>
                <h5 class="card-title h6 fw-bold mb-2"><?php echo esc_html($title); ?></h5>
                <?php if (!empty($description)): ?>
                    <p class="card-text small text-muted"><?php echo wp_kses_post($description); ?></p>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_amenity_item()
{
    register_block_type('bootstrap-theme/bs-amenity-item', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_amenity_item',
        'attributes' => array(
            'title' => array('type' => 'string', 'default' => 'Amenity'),
            'description' => array('type' => 'string', 'default' => ''),
            'iconType' => array('type' => 'string', 'default' => 'icon'),
            'icon' => array('type' => 'string', 'default' => 'fa-solid fa-check'),
            'imageUrl' => array('type' => 'string', 'default' => ''),
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_amenity_item');
