<?php
/**
 * Landing page template.
 */

get_header();
?>
<main id="primary" class="site-main">
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
