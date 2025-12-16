<?php
/**
 * Footer template.
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<footer class="site-footer py-4">
    <div class="container">
        <p class="mb-0 small text-center">&copy; <?php echo esc_html(date_i18n('Y')); ?> ileben.cl</p>
    </div>
</footer>
<script>
<?php the_field('extra_code', 'option'); ?>
</script>
<?php wp_footer(); ?>
</body>
</html>
