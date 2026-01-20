<?php
/**
 * Fallback template.
 */

global $wp_query;
get_header();
?>

<main id="primary" class="site-main">
    <div class="container py-5">
        <h1 class="mb-3"><?php esc_html_e('Content not found', 'ileben-landing'); ?></h1>
        <p class="lead"><?php esc_html_e('This theme is intended for a custom landing page. Please configure front-page.php.', 'ileben-landing'); ?></p>
    </div>
</main>

<?php get_footer(); ?>
