<?php
/**
 * Block: Construction Stage
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_construction_stage($attributes, $content, $block)
{
    $title = isset($attributes['title']) ? $attributes['title'] : '';
    $percentage = isset($attributes['percentage']) ? intval($attributes['percentage']) : 0;
    $date = isset($attributes['date']) ? $attributes['date'] : '';
    $status = isset($attributes['status']) ? $attributes['status'] : 'pending';
    
    $barClass = 'bg-secondary';
    $textClass = 'text-muted';
    $icon = 'fa-regular fa-circle';
    
    if ($status === 'completed') {
        $barClass = 'bg-success';
        $textClass = 'text-success';
        $icon = 'fa-solid fa-circle-check';
        $percentage = 100; // Forzar a 100 si está completado
    } elseif ($status === 'active') {
        $barClass = 'bg-primary progress-bar-striped progress-bar-animated';
        $textClass = 'text-primary fw-bold';
        $icon = 'fa-solid fa-person-digging';
    }
    
    ob_start();
    ?>
    <div class="col text-center bs-construction-stage <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>">
        <div class="mb-3 <?php echo esc_attr($textClass); ?>" style="font-size: 2rem;">
            <i class="<?php echo esc_attr($icon); ?>"></i>
        </div>
        <h5 class="h6 fw-bold mb-1"><?php echo wp_kses_post($title); ?></h5>
        <?php if (!empty($date)): ?>
            <small class="d-block text-muted mb-2"><?php echo wp_kses_post($date); ?></small>
        <?php endif; ?>
        
        <div class="progress mt-3 shadow-sm rounded-pill" style="height: 12px;">
            <div class="progress-bar <?php echo esc_attr($barClass); ?>" role="progressbar" style="width: <?php echo esc_attr($percentage); ?>%" aria-valuenow="<?php echo esc_attr($percentage); ?>" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="mt-2 small fw-semibold <?php echo esc_attr($textClass); ?>">
            <?php echo esc_html($percentage); ?>%
        </div>
    </div>
    <?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_construction_stage()
{
    register_block_type('bootstrap-theme/bs-construction-stage', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_construction_stage',
        'attributes' => array(
            'title' => array('type' => 'string', 'default' => 'Nueva Etapa'),
            'percentage' => array('type' => 'number', 'default' => 0),
            'date' => array('type' => 'string', 'default' => ''),
            'status' => array('type' => 'string', 'default' => 'pending'),
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_construction_stage');
