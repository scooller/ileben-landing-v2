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
        <div class="row mb-3">
            <div class="col-12 text-center pb-3" data-animate-type="fadeInUp" data-animate-trigger="on-scroll" data-animate-duration="0.8" data-animate-delay="0" data-animate-ease="linear">
                <small class="legal d-block">
                    <?php if (function_exists('the_field')) {
                        the_field('footer_legal_text', 'option');
                    } ?>
                    </small>
            </div>
            <hr>
            <div class="col d-flex text-center align-items-center justify-content-start">
                <?php if (function_exists('get_field') && get_field('footer_logo', 'option')) : ?>
                    <img src="<?php echo esc_url(get_field('footer_logo', 'option')); ?>" class="footer-logo" alt="<?php esc_attr_e('Ileben Logo', 'ileben-landing'); ?>" data-animate-type="fadeInUp" data-animate-trigger="on-load" data-animate-duration="0.8" data-animate-delay="0" data-animate-ease="linear">
                    <img src="<?php echo esc_url(get_field('footer_logo_dark', 'option')); ?>" class="footer-logo-dark" alt="<?php esc_attr_e('Ileben Logo', 'ileben-landing'); ?>" data-animate-type="fadeInUp" data-animate-trigger="on-load" data-animate-duration="0.8" data-animate-delay="0" data-animate-ease="linear">
                <?php endif; ?>
            </div>
            <div class="col d-flex flex-column align-items-end justify-content-center" data-animate-type="scaleIn" data-animate-trigger="on-load" data-animate-duration="0.8" data-animate-delay="0" data-animate-ease="linear">
                <?php
                wp_nav_menu([
                    'theme_location'  => 'footer-menu',
                    'menu_class'      => 'nav flex-column align-items-end align-items-stretch',
                    'container'       => false,
                    'fallback_cb'     => false,
                    'depth'           => 1,
                    'walker'          => new WP_Bootstrap_Navwalker(),
                ]);
                ?>
                <!-- RRSS ICONS -->
                <ul class="social-icons list-unstyled d-flex mb-0">
                    <?php if (function_exists('get_field') && get_field('facebook_url', 'option')) : ?>
                        <li class="ms-3">
                            <a href="<?php echo esc_url(get_field('facebook_url', 'option')); ?>" target="_blank" rel="noopener noreferrer">
                                <i class="bi bi-facebook fs-4"></i>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (function_exists('get_field') && get_field('instagram_url', 'option')) : ?>
                        <li class="ms-3">
                            <a href="<?php echo esc_url(get_field('instagram_url', 'option')); ?>" target="_blank" rel="noopener noreferrer">
                                <i class="bi bi-instagram fs-4"></i>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (function_exists('get_field') && get_field('linkedin_url', 'option')) : ?>
                        <li class="ms-3">
                            <a href="<?php echo esc_url(get_field('linkedin_url', 'option')); ?>" target="_blank" rel="noopener noreferrer">
                                <i class="bi bi-linkedin fs-4"></i>
                            </a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
            <div class="col-12 text-center mt-3">
                <p class="mb-0 small text-center">&copy; <?php echo esc_html(date_i18n('Y')); ?> ileben.cl</p>
            </div>
        </div>
    </div>
</footer>
<script>
    var $ = jQuery.noConflict();
    <?php if (function_exists('the_field')) {
        the_field('extra_code', 'option');
    } ?>
</script>
<?php wp_footer(); ?>
</body>

</html>