<?php
/**
 * Landing page template.
 */

get_header();
?>

<?php if (function_exists('ileben_render_loader')) { ileben_render_loader(); } ?>

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
