<?php
/**
 * Fallback template.
 */

global $wp_query;
get_header();
?>

<main id="primary" class="site-single">
    <div class="container-fluid g-0">           
        <?php
        while (have_posts()) {
            the_post();
            the_content();
        }
        ?>
    </div>
</main>

<?php get_footer(); ?>
