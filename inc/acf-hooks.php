<?php
/**
 * ACF hooks to populate dynamic select choices from Options page
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Helper: Build choices array from options repeater rows filtering by 'activo'
 */
function ileben_build_choices_from_options_repeater($repeater_field_name) {
    $choices = [];
    if (!function_exists('get_field')) {
        return $choices;
    }
    $rows = get_field($repeater_field_name, 'option');
    if (is_array($rows)) {
        foreach ($rows as $row) {
            $active = isset($row['activo']) ? (bool)$row['activo'] : false;
            $text = isset($row['texto']) ? trim(wp_strip_all_tags($row['texto'])) : '';
            if ($active && $text !== '') {
                $choices[$text] = $text;
            }
        }
    }
    return $choices;
}

/**
 * Populate Dormitorios choices on Plantas edit screen
 */
add_filter('acf/load_field/name=planta_dormitorio', function($field) {
    $field['choices'] = ileben_build_choices_from_options_repeater('dormitorios');
    return $field;
});

/**
 * Populate Baños choices on Plantas edit screen
 */
add_filter('acf/load_field/name=planta_bano', function($field) {
    $field['choices'] = ileben_build_choices_from_options_repeater('banos');
    return $field;
});
