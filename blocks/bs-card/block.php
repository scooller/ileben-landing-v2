<?php

/**
 * Bootstrap Card Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Card Block
 */
function bootstrap_theme_render_bs_card_block($attributes, $content, $block)
{
    $title = $attributes['title'] ?? '';
    $subtitle = $attributes['subtitle'] ?? '';
    $image = $attributes['image'] ?? '';
    $imageAlt = $attributes['imageAlt'] ?? '';
    $imageFull = $attributes['imageFull'] ?? false;
    $link = $attributes['link'] ?? '';
    $target = $attributes['target'] ?? '_self';
    $variant = $attributes['variant'] ?? '';
    $textAlign = $attributes['textAlign'] ?? '';
    $S = $attributes['headerBg'] ?? '';
    $footerBg = $attributes['footerBg'] ?? '';
    $bodyClasses = $attributes['bodyClasses'] ?? '';
    $titleClasses = $attributes['titleClasses'] ?? '';
    $textClasses = $attributes['textClasses'] ?? '';

    // Build card classes
    $card_classes = array('card');
    if (!empty($variant)) {
        $card_classes[] = $variant;
    }

    // Add custom CSS classes from Advanced panel
    $card_classes = bootstrap_theme_add_custom_classes($card_classes, $attributes, $block);

    // Get animation data attributes
    $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);

    $body_classes = array('card-body');
    if (!empty($textAlign)) {
        $body_classes[] = 'text-' . $textAlign;
    }
    if (!empty($bodyClasses)) {
        $body_classes[] = $bodyClasses;
    }
    if($imageFull){
        $body_classes[] = 'position-absolute bottom-0 start-0 w-100 bg-gradient-theme';
    }

    ob_start();
    ?>
    <?php if (!empty($link)): ?>
    <a href="<?php echo esc_url($link); ?>" target="<?php echo esc_attr($target); ?>" class="<?php echo esc_attr(implode(' ', array_unique($card_classes))); ?>"<?php echo $animation_attrs; ?>>
    <?php else: ?>
    <div class="<?php echo esc_attr(implode(' ', array_unique($card_classes))); ?>"<?php echo $animation_attrs; ?>>
    <?php endif; ?>
    <?php
    // Card image
    if (!empty($image)):
        $img_class = 'card-img-top'; 
    ?>       
        <img src="<?php echo esc_url($image); ?>" class="<?php echo esc_attr($img_class); ?>" alt="<?php echo esc_attr($imageAlt); ?>">
    <?php endif; ?>

    <?php
    // Card header
    if (!empty($headerBg)):
        $header_classes = 'card-header';
        if (!empty($headerBg)) {
            $header_classes .= ' ' . $headerBg;
        }
        ?>
        <div class="<?php echo esc_attr($header_classes); ?>">
            <?php if (!empty($title)): ?>
                <h5 class="card-title mb-0"><?php echo esc_html($title); ?></h5>
            <?php endif; ?>
        </div>
        <?php
    endif; ?>

    <?php
    // Card body
    ?>
    <div class="<?php echo esc_attr(implode(' ', $body_classes)); ?>">

    <?php
    // Title in body (if not in header)
    if (!empty($title) && empty($headerBg)):
        $title_class = 'card-title';
        if (!empty($titleClasses)) {
            $title_class .= ' ' . $titleClasses;
        }
        ?>
        <h5 class="<?php echo esc_attr($title_class); ?>"><?php echo esc_html($title); ?></h5>
        <?php 
    endif; ?>

    <?php
    // Subtitle
    if (!empty($subtitle)): ?>
        <h6 class="card-subtitle mb-2 text-muted"><?php echo esc_html($subtitle); ?></h6>
    <?php endif; ?>

    <?php
    // Content from InnerBlocks
    if (!empty($content)):
        $text_class = 'card-text';
        if (!empty($textClasses)) {
            $text_class .= ' ' . $textClasses;
        }
        ?>
        <div class="<?php echo esc_attr($text_class); ?>"><?php echo $content; ?></div>
    <?php endif; ?>

    </div> <?php // End card-body ?>

    <?php
    // Card footer
    if (!empty($footerBg)):
        $footer_classes = 'card-footer';
        if (!empty($footerBg)) {
            $footer_classes .= ' ' . $footerBg;
        }
        ?>
        <div class="<?php echo esc_attr($footer_classes); ?>">
            <small class="text-muted"><?php echo __('Card footer', 'bootstrap-theme'); ?></small>
        </div>
        <?php
    endif; ?>

    <?php if (!empty($link)): ?>
    </a>
    <?php else: ?>
    </div> 
    <?php
    endif;
     // End card ?>
    <?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Card Block
 */
function bootstrap_theme_register_bs_card_block()
{
    register_block_type('bootstrap-theme/bs-card', array(
        'render_callback' => 'bootstrap_theme_render_bs_card_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => ''
            ),
            'subtitle' => array(
                'type' => 'string',
                'default' => ''
            ),
            'image' => array(
                'type' => 'string',
                'default' => ''
            ),
            'imageAlt' => array(
                'type' => 'string',
                'default' => ''
            ),
            'imageFull' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'link' => array(
                'type' => 'string',
                'default' => ''
            ),
            'target' => array(
                'type' => 'string',
                'default' => '_self'
            ),
            'variant' => array(
                'type' => 'string',
                'default' => ''
            ),
            'textAlign' => array(
                'type' => 'string',
                'default' => ''
            ),
            'headerBg' => array(
                'type' => 'string',
                'default' => ''
            ),
            'footerBg' => array(
                'type' => 'string',
                'default' => ''
            ),
            'bodyClasses' => array(
                'type' => 'string',
                'default' => ''
            ),
            'titleClasses' => array(
                'type' => 'string',
                'default' => ''
            ),
            'textClasses' => array(
                'type' => 'string',
                'default' => ''
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            ),
            // Animation attributes
            'animationType' => array(
                'type' => 'string'
            ),
            'animationTrigger' => array(
                'type' => 'string'
            ),
            'animationDuration' => array(
                'type' => 'number'
            ),
            'animationDelay' => array(
                'type' => 'number'
            ),
            'animationEase' => array(
                'type' => 'string'
            ),
            'animationRepeat' => array(
                'type' => 'number'
            ),
            'animationRepeatDelay' => array(
                'type' => 'number'
            ),
            'animationYoyo' => array(
                'type' => 'boolean'
            ),
            'animationDistance' => array(
                'type' => 'string'
            ),
            'animationRotation' => array(
                'type' => 'number'
            ),
            'animationScale' => array(
                'type' => 'string'
            ),
            'animationParallaxSpeed' => array(
                'type' => 'number'
            ),
            'animationHoverEffect' => array(
                'type' => 'string'
            ),
            'animationMobileEnabled' => array(
                'type' => 'boolean'
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_card_block');
