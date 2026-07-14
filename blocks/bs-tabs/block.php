<?php

/**
 * Bootstrap Tabs Block
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Tabs Block
 *
 * The editor (editor.js) uses InnerBlocks with bs-tab-pane children.
 * The save() returns InnerBlocks.Content, so $content contains the tab panes.
 * We parse the tab pane titles from block attributes to build the nav links.
 */
function bootstrap_theme_render_bs_tabs_block($attributes, $content, $block)
{
    $variant    = $attributes['variant'] ?? 'tabs';
    $justified  = $attributes['justified'] ?? false;
    $vertical   = $attributes['vertical'] ?? false;
    $tabsId     = $attributes['tabsId'] ?? 'tabs-' . uniqid();

    // Build nav classes
    $nav_classes = array('nav', "nav-{$variant}");
    if ($justified) {
        $nav_classes[] = 'nav-justified';
    }
    $nav_classes = bootstrap_theme_add_custom_classes($nav_classes, $attributes, $block);
    $nav_class_string = implode(' ', array_unique($nav_classes));

    // Extract tab pane titles and IDs from inner blocks
    $tabs = array();
    if (!empty($block->inner_blocks)) {
        foreach ($block->inner_blocks as $inner_block) {
            if ($inner_block->name === 'bootstrap-theme/bs-tab-pane') {
                $attrs      = $inner_block->attributes;
                $tabs[] = array(
                    'title'  => $attrs['title'] ?? __('Tab', 'ileben-landing'),
                    'paneId' => $attrs['paneId'] ?? '',
                    'active' => $attrs['active'] ?? false,
                );
            }
        }
    }

    // Fallback: try to parse from content HTML
    if (empty($tabs)) {
        preg_match_all('/id="([^"]*tab[^"]*)"/i', $content, $id_matches);
        if (!empty($id_matches[1])) {
            foreach ($id_matches[1] as $i => $pid) {
                $tabs[] = array(
                    'title'  => sprintf(__('Tab %d', 'ileben-landing'), $i + 1),
                    'paneId' => $pid,
                    'active' => $i === 0,
                );
            }
        }
    }

    ob_start();
?>
    <div class="<?php echo $vertical ? 'd-flex align-items-start' : ''; ?>">
        <?php if ($vertical) : ?>
            <div class="<?php echo esc_attr($nav_class_string); ?> flex-column me-3" id="<?php echo esc_attr($tabsId); ?>" role="tablist" aria-orientation="vertical">
                <?php foreach ($tabs as $tab) : ?>
                    <button class="nav-link<?php echo $tab['active'] ? ' active' : ''; ?>" type="button" data-bs-toggle="tab" data-bs-target="#<?php echo esc_attr($tab['paneId']); ?>" role="tab" aria-selected="<?php echo $tab['active'] ? 'true' : 'false'; ?>"><?php echo esc_html($tab['title']); ?></button>
                <?php endforeach; ?>
            </div>
            <div class="tab-content flex-grow-1" id="<?php echo esc_attr($tabsId); ?>-content">
                <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
                ?>
            </div>
        <?php else : ?>
            <ul class="<?php echo esc_attr($nav_class_string); ?>" id="<?php echo esc_attr($tabsId); ?>" role="tablist">
                <?php foreach ($tabs as $tab) : ?>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link<?php echo $tab['active'] ? ' active' : ''; ?>" type="button" data-bs-toggle="tab" data-bs-target="#<?php echo esc_attr($tab['paneId']); ?>" role="tab" aria-selected="<?php echo $tab['active'] ? 'true' : 'false'; ?>"><?php echo esc_html($tab['title']); ?></button>
                    </li>
                <?php endforeach; ?>
            </ul>
            <div class="tab-content" id="<?php echo esc_attr($tabsId); ?>-content">
                <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
                ?>
            </div>
        <?php endif; ?>
    </div>
<?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Tabs Block
 */
function bootstrap_theme_register_bs_tabs_block()
{
    register_block_type('bootstrap-theme/bs-tabs', array(
        'api_version'     => 3,
        'render_callback' => 'bootstrap_theme_render_bs_tabs_block',
        'supports'        => array(
            'html' => true,
        ),
        'attributes' => array(
            'tabsId' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'variant' => array(
                'type'    => 'string',
                'default' => 'tabs',
            ),
            'justified' => array(
                'type'    => 'boolean',
                'default' => false,
            ),
            'vertical' => array(
                'type'    => 'boolean',
                'default' => false,
            ),
            'className' => array(
                'type'    => 'string',
                'default' => '',
            ),
        ),
    ));
}
add_action('init', 'bootstrap_theme_register_bs_tabs_block');
