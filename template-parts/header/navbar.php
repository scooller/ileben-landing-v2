<?php
/**
 * Primary navigation using Bootstrap classes.
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<nav class="navbar navbar-expand-lg">
    <div class="container">        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#primaryMenu" aria-controls="primaryMenu" aria-expanded="false" aria-label="<?php esc_attr_e('Toggle navigation', 'ileben-landing'); ?>">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="primaryMenu">
            <?php
            wp_nav_menu([
                'theme_location'  => 'primary',
                'menu_class'      => 'navbar-nav ms-auto text-center',
                'container'       => false,
                'fallback_cb'     => false,
                'depth'           => 2,
                'walker'          => new WP_Bootstrap_Navwalker(),
            ]);
            ?>
        </div>
    </div>
</nav>
