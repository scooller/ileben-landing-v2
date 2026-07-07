<?php
/**
 * Block: Masterplan Hotspot
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_masterplan_hotspot($attributes, $content, $block)
{
    $top = isset($attributes['top']) ? $attributes['top'] : 50;
    $left = isset($attributes['left']) ? $attributes['left'] : 50;
    $title = isset($attributes['title']) ? $attributes['title'] : '';
    $description = isset($attributes['description']) ? $attributes['description'] : '';
    $status = isset($attributes['status']) ? $attributes['status'] : 'disponible';
    $link = isset($attributes['link']) ? $attributes['link'] : '';
    
    $image = isset($attributes['image']) ? $attributes['image'] : null;
    
    // Definir color por estado
    $btnClass = 'btn-primary';
    if ($status === 'vendido') {
        $btnClass = 'btn-danger';
    } elseif ($status === 'reservado') {
        $btnClass = 'btn-warning text-dark';
    }

    // Armar HTML del popover
    $popover_content = '<div class="text-center">';
    if (!empty($image)) {
        $popover_content .= '<img src="' . esc_url($image['url']) . '" class="img-fluid mb-2 rounded" style="max-height: 120px; object-fit: cover; width: 100%;" alt="' . esc_attr($title) . '">';
    }
    if (!empty($description)) {
        $popover_content .= '<p class="mb-2 small">' . esc_html($description) . '</p>';
    }
    if (!empty($link)) {
        $popover_content .= '<a href="' . esc_url($link) . '" class="btn btn-sm btn-outline-primary d-block">' . esc_html__('Ver más', 'ileben-landing') . '</a>';
    }
    $popover_content .= '</div>';
    
    // Armar título con botón cerrar
    $popover_title = esc_html($title . ' (' . ucfirst($status) . ')') . '<button type="button" class="btn-close btn-close-white float-end ms-2 bs-hotspot-close" aria-label="Close" style="font-size: 0.65rem; margin-top: 0.2rem;"></button>';
    
    ob_start();
    ?>
    <button type="button" 
            class="bs-hotspot-btn btn btn-sm rounded-circle position-absolute p-0 shadow-sm <?php echo esc_attr($btnClass); ?> <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>" 
            style="top: <?php echo esc_attr($top); ?>%; left: <?php echo esc_attr($left); ?>%; width: 28px; height: 28px; transform: translate(-50%, -50%); z-index: 10;"
            data-bs-placement="top"
            data-bs-custom-class="bs-hotspot-popover"
            title="<?php echo esc_attr($popover_title); ?>" 
            data-bs-content="<?php echo esc_attr($popover_content); ?>">
        <i class="fa-solid fa-plus small"></i>
    </button>
    <?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_masterplan_hotspot()
{
    register_block_type('bootstrap-theme/bs-masterplan-hotspot', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_masterplan_hotspot',
        'attributes' => array(
            'title' => array('type' => 'string', 'default' => 'Lote / Depto'),
            'description' => array('type' => 'string', 'default' => ''),
            'status' => array('type' => 'string', 'default' => 'disponible'),
            'link' => array('type' => 'string', 'default' => ''),
            'image' => array('type' => 'object', 'default' => null),
            'top' => array('type' => 'number', 'default' => 50),
            'left' => array('type' => 'number', 'default' => 50),
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_masterplan_hotspot');
