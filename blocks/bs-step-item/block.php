<?php

/**
 * Bootstrap Step Item Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Bootstrap Step Item Block
 */
function bootstrap_theme_register_bs_step_item_block()
{
    register_block_type('bootstrap-theme/bs-step-item', array(
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Step'
            ),
            // Animation attributes
            'animationType' => array('type' => 'string'),
            'animationTrigger' => array('type' => 'string'),
            'animationDuration' => array('type' => 'number'),
            'animationDelay' => array('type' => 'number'),
            'animationEase' => array('type' => 'string'),
            'animationRepeat' => array('type' => 'number'),
            'animationRepeatDelay' => array('type' => 'number'),
            'animationYoyo' => array('type' => 'boolean'),
            'animationDistance' => array('type' => 'string'),
            'animationRotation' => array('type' => 'number'),
            'animationScale' => array('type' => 'string'),
            'animationParallaxSpeed' => array('type' => 'number'),
            'animationHoverEffect' => array('type' => 'string'),
            'animationMobileEnabled' => array('type' => 'boolean')
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_step_item_block');
