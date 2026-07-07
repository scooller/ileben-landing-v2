<?php

/**
 * Block: Entorno
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_entorno($attributes, $content, $block)
{
    $mapType = isset($attributes['mapType']) ? $attributes['mapType'] : 'iframe';
    $mapIframeUrl = isset($attributes['mapIframeUrl']) ? $attributes['mapIframeUrl'] : '';
    $mapImage = isset($attributes['mapImage']) ? $attributes['mapImage'] : null;

    // Get animation data attributes
    $animation_attrs = function_exists('bootstrap_theme_get_animation_attributes') ? bootstrap_theme_get_animation_attributes($attributes, $block) : '';

    // Generar un ID único para los tabs
    $tabs_id = 'entorno-tabs-' . uniqid();

    // Extraer las categorías (InnerBlocks) para construir la navegación
    $categories = [];
    $direct_pois = [];

    if (isset($block->parsed_block['innerBlocks']) && is_array($block->parsed_block['innerBlocks'])) {
        foreach ($block->parsed_block['innerBlocks'] as $index => $inner_block) {
            if ($inner_block['blockName'] === 'bootstrap-theme/bs-entorno-category') {
                $title = isset($inner_block['attrs']['title']) ? trim($inner_block['attrs']['title']) : '';

                if (!empty($title)) {
                    $tab_target = $tabs_id . '-pane-' . $index;
                    $categories[] = [
                        'title' => $title,
                        'target' => $tab_target,
                        'index' => $index,
                        'is_active' => false // Se asignará luego
                    ];
                } else {
                    // Si no tiene título, extraemos sus POIs
                    if (isset($inner_block['innerBlocks']) && is_array($inner_block['innerBlocks'])) {
                        foreach ($inner_block['innerBlocks'] as $poi) {
                            if ($poi['blockName'] === 'bootstrap-theme/bs-entorno-poi') {
                                $direct_pois[] = $poi;
                            }
                        }
                    }
                }
            } else if ($inner_block['blockName'] === 'bootstrap-theme/bs-entorno-poi') {
                $direct_pois[] = $inner_block;
            }
        }
    }

    // Activar el primer tab si hay categorías
    if (!empty($categories)) {
        $categories[0]['is_active'] = true;
    }

    ob_start();
?>
    <div class="bs-entorno-wrapper <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>" <?php echo $animation_attrs; ?> id="<?php echo esc_attr($tabs_id); ?>">
        <div class="row g-4 align-items-center justify-content-center">
            <!-- Columna Mapa -->
            <div class="col-lg-6">
                <div class="bs-entorno-map rounded overflow-hidden shadow-sm h-100" style="min-height: 400px;">
                    <?php if ($mapType === 'iframe' && !empty($mapIframeUrl)): ?>
                        <iframe src="<?php echo esc_url($mapIframeUrl); ?>" width="100%" height="100%" style="border:0; min-height: 400px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    <?php elseif ($mapType === 'image' && !empty($mapImage)): ?>
                        <img src="<?php echo esc_url($mapImage['url']); ?>" alt="<?php echo esc_attr($mapImage['alt'] ?? 'Mapa Entorno'); ?>" class="img-fluid w-100 h-100 object-fit-cover">
                    <?php else: ?>
                        <div class="bg-light w-100 h-100 d-flex align-items-center justify-content-center text-muted p-4 text-center">
                            <?php esc_html_e('Configura el mapa del entorno desde el panel.', 'ileben-landing'); ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Columna POIs -->
            <div class="col-lg-6">
                <?php if (!empty($categories)): ?>
                    <ul class="nav nav-pills mb-4 bs-entorno-nav" role="tablist">
                        <?php foreach ($categories as $cat): ?>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link <?php echo $cat['is_active'] ? 'active' : ''; ?>"
                                    id="<?php echo esc_attr($cat['target']); ?>-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#<?php echo esc_attr($cat['target']); ?>"
                                    type="button"
                                    role="tab"
                                    aria-controls="<?php echo esc_attr($cat['target']); ?>"
                                    aria-selected="<?php echo $cat['is_active'] ? 'true' : 'false'; ?>">
                                    <?php echo esc_html($cat['title']); ?>
                                </button>
                            </li>
                        <?php endforeach; ?>
                    </ul>

                    <div class="tab-content bs-entorno-content">
                        <?php
                        if (isset($block->parsed_block['innerBlocks'])) {
                            $active_assigned = false;
                            foreach ($block->parsed_block['innerBlocks'] as $index => $inner_block) {
                                if ($inner_block['blockName'] === 'bootstrap-theme/bs-entorno-category') {
                                    $title = isset($inner_block['attrs']['title']) ? trim($inner_block['attrs']['title']) : '';
                                    if (!empty($title)) {
                                        $tab_target = $tabs_id . '-pane-' . $index;
                                        $is_active = (!$active_assigned) ? 'show active' : '';
                                        $active_assigned = true;

                                        echo '<div class="tab-pane fade ' . esc_attr($is_active) . '" id="' . esc_attr($tab_target) . '" role="tabpanel" aria-labelledby="' . esc_attr($tab_target) . '-tab" tabindex="0">';
                                        echo render_block($inner_block);
                                        echo '</div>';
                                    }
                                }
                            }
                        }
                        ?>
                    </div>
                <?php elseif (!empty($direct_pois)): ?>
                    <div class="bs-entorno-content">
                        <?php foreach ($direct_pois as $poi): ?>
                            <?php echo render_block($poi); ?>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div class="alert alert-info">
                        <?php esc_html_e('Agrega categorías o puntos de entorno.', 'ileben-landing'); ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
<?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_entorno()
{
    register_block_type('bootstrap-theme/bs-entorno', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_entorno',
        'attributes' => array(
            'mapType' => array('type' => 'string', 'default' => 'iframe'),
            'mapIframeUrl' => array('type' => 'string', 'default' => ''),
            'mapImage' => array('type' => 'object', 'default' => null),
            // Animation attributes
            'animationType' => array('type' => 'string'),
            'animationTrigger' => array('type' => 'string'),
            'animationDuration' => array('type' => 'number'),
            'animationDelay' => array('type' => 'number'),
            'animationEase' => array('type' => 'string'),
            'animationRepeat' => array('type' => 'number'),
            'animationRepeatDelay' => array('type' => 'number'),
            'animationYoyo' => array('type' => 'boolean'),
            'animationDistance' => array('type' => 'string'),
            'animationRotation' => array('type' => 'number'),
            'animationScale' => array('type' => 'string'),
            'animationParallaxSpeed' => array('type' => 'number'),
            'animationHoverEffect' => array('type' => 'string'),
            'animationMobileEnabled' => array('type' => 'boolean'),
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_entorno');
