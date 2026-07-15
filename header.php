<?php

/**
 * Header template.
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="<?php echo esc_url(get_site_icon_url()); ?>" />
    <!-- Resource hints for critical third-party resources -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php if (function_exists('ileben_render_loader')) {
        ileben_render_loader();
    } ?>
    <?php wp_body_open(); ?>
    <?php $glass_class = get_field('enable_glass_class', 'option') ? 'glass' : ''; ?>
    <header id="site-header" class="site-header <?php echo esc_attr($glass_class); ?> d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 fixed-top top-0 shadow-sm">
        <div class="col-md-5 col-3 mb-2 mb-md-0 px-3 logo-menu">
            <?php
            if (has_nav_menu('header-menu')) {
                wp_nav_menu([
                    'theme_location'  => 'header-menu',
                    'menu_class'      => 'navbar-nav ms-auto text-center',
                    'container'       => false,
                    'fallback_cb'     => false,
                    'depth'           => 2,
                    'walker'          => new WP_Bootstrap_Navwalker(),
                ]);
            } else {
                $api_logo     = function_exists('get_field') ? get_field('api_logo', 'option') : '';
                $api_logo_dark = function_exists('get_field') ? get_field('api_logo_dark', 'option') : '';

                if ($api_logo) {
                    $api_logo = esc_url($api_logo);
                }
                if ($api_logo_dark) {
                    $api_logo_dark = esc_url($api_logo_dark);
                }

                if ($api_logo || $api_logo_dark) {
                    $home_url = esc_url(home_url('/'));
                    echo '<a class="navbar-brand api-logo" href="' . $home_url . '">';
                    if ($api_logo) {
                        echo '<img src="' . $api_logo . '" alt="' . esc_attr(get_bloginfo('name')) . '" class="img-fluid logo-light" />';
                    }
                    if ($api_logo_dark) {
                        echo '<img src="' . $api_logo_dark . '" alt="' . esc_attr(get_bloginfo('name')) . '" class="img-fluid logo-dark" />';
                    }
                    echo '</a>';
                }
            }
            ?>
        </div>
        <div class="col-md-2 col-6 mb-2 mb-md-0 text-center">
            <?php if (get_field('mostrar_logonombre', 'option')) : ?>
                <a class="navbar-brand" href="<?php echo esc_url(home_url('/')); ?>">
                    <?php
                    if (function_exists('the_custom_logo') && has_custom_logo()) {
                        the_custom_logo();
                    } else {
                    ?>
                        <h1 class="site-title m-0"><?php bloginfo('name'); ?></h1>
                    <?php
                    }
                    ?>
                </a>
            <?php endif; ?>
        </div>
        <div class="col-md-5 col-3 text-end">
            <?php get_template_part('template-parts/header/navbar'); ?>
        </div>
    </header>