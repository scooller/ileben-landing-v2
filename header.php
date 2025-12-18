<?php
/**
 * Header template.
 */

if (!defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="<?php echo esc_url(get_site_icon_url()); ?>" />
    <?php the_field('analytics_code', 'option'); ?>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header id="site-header" class="site-header d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 fixed-top top-0 shadow-sm">
    <div class="col-md-3 mb-2 mb-md-0 px-3">
        <a href="/" class="btn btn-primary">Home</a>
    </div>
    <div class="col-md-3 mb-2 mb-md-0 text-center">
        <a class="navbar-brand" href="<?php echo esc_url(home_url('/')); ?>">
            <?php
            if (function_exists('the_custom_logo') && has_custom_logo()) {
                the_custom_logo();
            } else {
                bloginfo('name');
            }
            ?>
        </a>
    </div>
    <div class="col-md-3 text-end">
        <?php get_template_part('template-parts/header/navbar'); ?>
    </div>
</header>
