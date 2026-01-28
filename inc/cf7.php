<?php

/**
 * Contact Form 7 + Bootstrap helpers
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Custom tag to split CF7 into steps: [step_break "Nombre del paso"]
 * JS will convert these markers into a multi-step flow.
 * 
 * Input group wrapper tags:
 * Usage: [input_group_prepend "+56"][number* phone][/input_group_prepend]
 *        [input_group_append "@example.com"][email* email][/input_group_append]
 */
add_action('wpcf7_init', 'ileben_cf7_register_step_break_tag');
function ileben_cf7_register_step_break_tag()
{
    if (!function_exists('wpcf7_add_form_tag')) {
        return;
    }
    wpcf7_add_form_tag('step_break', 'ileben_cf7_step_break_tag');
}

function ileben_cf7_step_break_tag($tag)
{
    $label = '';

    if (is_object($tag) && isset($tag->values[0])) {
        $label = $tag->values[0];
    } elseif (is_array($tag) && isset($tag['values'][0])) {
        $label = $tag['values'][0];
    }

    $label = esc_attr($label);

    return sprintf('<div class="wpcf7-step-break" data-step-label="%s"></div>', $label);
}

/**
 * Marker tag for input-group wrappers
 */
function ileben_cf7_ig_marker_tag($tag)
{
    if (!is_object($tag) || !class_exists('WPCF7_FormTag') || !($tag instanceof WPCF7_FormTag)) {
        return '';
    }

    $type = $tag->type;
    $position = $type === 'input_group_append' ? 'append' : 'prepend';
    
    // Get the text value from values array
    $value = isset($tag->values[0]) ? $tag->values[0] : '';

    if (!$value) {
        return '';
    }

    return sprintf(
        '<ileben-ig position="%s" value="%s"></ileben-ig>',
        esc_attr($position),
        esc_attr($value)
    );
}

/**
 * Handle input_group_prepend and input_group_append tags
 */
function ileben_cf7_input_group_tag($tag)
{
    // Just output a marker - the actual wrapping happens in post-processing
    return ileben_cf7_ig_marker_tag($tag);
}

/**
 * Pre-process form content to handle input-group wrappers before CF7 renders them
 * Convert [input_group_prepend "..."][form fields][/input_group_prepend] 
 * into markers that will be processed later
 */
function ileben_cf7_preprocess_input_groups($form)
{
    if (!is_object($form)) {
        return $form;
    }

    // Get the form post content
    $post_content = $form->prop('form');
    
    if (empty($post_content)) {
        return $form;
    }

    // Find all [input_group_prepend "..."] ... [/input_group_prepend] blocks
    $post_content = preg_replace_callback(
        '/\[input_group_prepend\s+"([^"]+)"\](.*?)\[\/input_group_prepend\]/s',
        function ($matches) {
            $value = $matches[1];
            $inner = $matches[2];
            return '[ileben-ig-marker position="prepend" value="' . esc_attr($value) . '"]' . $inner . '[/ileben-ig-marker]';
        },
        $post_content
    );

    // Find all [input_group_append "..."] ... [/input_group_append] blocks
    $post_content = preg_replace_callback(
        '/\[input_group_append\s+"([^"]+)"\](.*?)\[\/input_group_append\]/s',
        function ($matches) {
            $value = $matches[1];
            $inner = $matches[2];
            return '[ileben-ig-marker position="append" value="' . esc_attr($value) . '"]' . $inner . '[/ileben-ig-marker]';
        },
        $post_content
    );

    $form->set_properties(['form' => $post_content]);

    return $form;
}
add_filter('wpcf7_form_meta', 'ileben_cf7_preprocess_input_groups', 10, 1);
function ileben_cf7_bootstrap_classes($tag)
{
    // CF7 may pass either WPCF7_FormTag objects or associative arrays (during validation).
    $is_obj = is_object($tag) && class_exists('WPCF7_FormTag') && ($tag instanceof WPCF7_FormTag);
    $is_array = is_array($tag);
    if (!$is_obj && !$is_array) {
        return $tag; // unknown shape, bail out
    }

    $type = $is_obj ? $tag->type : ($tag['type'] ?? '');
    $basetype = $is_obj ? ($tag->basetype ?? $type) : ($tag['basetype'] ?? $type);
    $class_attr = $is_obj
        ? ($tag->atts['class'] ?? '')
        : (($tag['atts']['class'] ?? '') ?: '');

    // Check for append/prepend attributes
    $append = $is_obj
        ? ($tag->atts['append'] ?? '')
        : ($tag['atts']['append'] ?? '');
    $prepend = $is_obj
        ? ($tag->atts['prepend'] ?? '')
        : ($tag['atts']['prepend'] ?? '');

    $add_class = function ($extra) use (&$class_attr) {
        $class_attr = trim($class_attr . ' ' . $extra);
    };

    // Text-like controls
    $text_like = ['text', 'email', 'url', 'tel', 'number', 'date', 'textarea', 'quiz'];
    if (in_array($basetype, $text_like, true)) {
        $add_class('form-control');
    }

    // Selects
    if ($basetype === 'select') {
        $add_class('form-select');
    }

    // Submit buttons
    if ($basetype === 'submit') {
        $add_class('btn btn-primary');
    }

    // File inputs
    if ($basetype === 'file') {
        $add_class('form-control');
    }

    // Checkboxes / radios / acceptance
    $check_like = ['checkbox', 'radio', 'acceptance'];
    if (in_array($basetype, $check_like, true)) {
        $add_class('form-check-input');
    }

    if ($is_obj) {
        $tag->atts['class'] = $class_attr;
    } else {
        $tag['atts']['class'] = $class_attr;
    }

    return $tag;
}
// Enable class injection via CF7 filter so inputs get Bootstrap classes.
add_filter('wpcf7_form_tag', 'ileben_cf7_bootstrap_classes', 10);

/**
 * Massage CF7 rendered HTML to better match Bootstrap structure.
 * - Wrap control spans as div.form-group
 * - Add form-label class to labels that are direct siblings
 */
function ileben_cf7_bootstrap_structure($content)
{
    // Use DOM to safely reshape structure per Bootstrap guidelines.
    $html = '<div id="ileben-cf7-wrap">' . $content . '</div>';
    $dom = new DOMDocument();
    libxml_use_internal_errors(true);
    $dom->loadHTML('<meta charset="UTF-8">' . $html);
    libxml_clear_errors();

    $xpath = new DOMXPath($dom);

    $add_class = function ($el, $class) {
        if (!$el) {
            return;
        }
        $current = $el->getAttribute('class');
        $classes = preg_split('/\s+/', trim($current)) ?: [];
        if (!in_array($class, $classes, true)) {
            $classes[] = $class;
        }
        $el->setAttribute('class', trim(implode(' ', array_filter($classes))));
    };

    // Convert span.wpcf7-form-control-wrap to div.form-group and reorganize labels.
    foreach ($xpath->query('//*[contains(concat(" ", normalize-space(@class), " "), " wpcf7-form-control-wrap ")]') as $wrap) {
        /** @var DOMElement $wrap */
        // Rename span to div if needed.
        if (strtolower($wrap->tagName) === 'span') {
            $div = $dom->createElement('div');
            foreach ($wrap->attributes as $attr) {
                $div->setAttribute($attr->nodeName, $attr->nodeValue);
            }
            while ($wrap->firstChild) {
                $div->appendChild($wrap->firstChild);
            }
            $wrap->parentNode->replaceChild($div, $wrap);
            $wrap = $div;
        }

        // Find the primary control inside the wrapper.
        $control = null;
        foreach ($wrap->childNodes as $child) {
            if ($child instanceof DOMElement && in_array(strtolower($child->tagName), ['input', 'select', 'textarea'], true)) {
                $control = $child;
                break;
            }
        }

        $is_check = false;
        $is_select = false;
        if ($control && strtolower($control->tagName) === 'input') {
            $type = strtolower($control->getAttribute('type'));
            $is_check = in_array($type, ['checkbox', 'radio'], true);
        } elseif ($control && strtolower($control->tagName) === 'select') {
            $is_select = true;
        }

        // Fetch a sibling label that CF7 may have placed after the wrapper.
        $label = null;
        $sibling = $wrap->nextSibling;
        while ($sibling) {
            if ($sibling instanceof DOMText && trim($sibling->wholeText) === '') {
                $sibling = $sibling->nextSibling;
                continue;
            }
            if ($sibling instanceof DOMElement && strtolower($sibling->tagName) === 'br') {
                // Remove trailing <br> that CF7 may insert.
                $next = $sibling->nextSibling;
                $sibling->parentNode->removeChild($sibling);
                $sibling = $next;
                continue;
            }
            if ($sibling instanceof DOMElement && strtolower($sibling->tagName) === 'label') {
                $label = $sibling;
                break;
            }
            break;
        }

        // For selects with first_as_label, transform first option into a proper label
        if ($is_select) {
            $firstOption = null;
            foreach ($control->childNodes as $child) {
                if ($child instanceof DOMElement && strtolower($child->tagName) === 'option') {
                    $firstOption = $child;
                    break;
                }
            }

            // If first option has empty value, treat it as first_as_label (with or without disabled)
            if ($firstOption && $firstOption->getAttribute('value') === '') {
                // Extract the text from first option to create a real label
                $labelText = trim($firstOption->textContent);

                // Remove the label sibling if exists
                if ($label) {
                    $label->parentNode->removeChild($label);
                }

                // Create new label with the text from first option
                if ($labelText) {
                    $label = $dom->createElement('label');
                    $label->textContent = $labelText;
                    $add_class($label, 'form-label');

                    // Add 'for' attribute if select has id
                    if ($control->hasAttribute('id')) {
                        $label->setAttribute('for', $control->getAttribute('id'));
                    }
                }

                // Replace first option text with generic "Seleccione" and ensure it's disabled and selected
                $firstOption->textContent = 'Seleccione';
                $firstOption->setAttribute('disabled', 'disabled');
                $firstOption->setAttribute('selected', 'selected');
            }
        }

        if ($label) {
            // Ensure label class.
            if ($is_check) {
                $add_class($label, 'form-check-label');
            } else {
                $add_class($label, 'form-label');
            }
            // Remove label from its current position if it's still in the DOM
            if ($label->parentNode) {
                $label->parentNode->removeChild($label);
            }
        }

        if ($is_check) {
            $add_class($wrap, 'form-check');
            if ($label && $control) {
                // For check/radio, label goes after input.
                if ($control->nextSibling) {
                    $wrap->insertBefore($label, $control->nextSibling);
                } else {
                    $wrap->appendChild($label);
                }
            } elseif ($label) {
                $wrap->appendChild($label);
            }
        } else {
            $add_class($wrap, 'form-group');
            if ($label) {
                if ($wrap->firstChild) {
                    $wrap->insertBefore($label, $wrap->firstChild);
                } else {
                    $wrap->appendChild($label);
                }
            }
        }

        // Remove any <br> elements that follow this wrapper
        $sibling = $wrap->nextSibling;
        while ($sibling) {
            if ($sibling instanceof DOMText && trim($sibling->wholeText) === '') {
                $next = $sibling->nextSibling;
                // Only remove whitespace-only text nodes between wrapper and br
                if ($next instanceof DOMElement && strtolower($next->tagName) === 'br') {
                    $sibling->parentNode->removeChild($sibling);
                } else {
                    break;
                }
                $sibling = $next;
            } elseif ($sibling instanceof DOMElement && strtolower($sibling->tagName) === 'br') {
                // Remove the br element
                $next = $sibling->nextSibling;
                $sibling->parentNode->removeChild($sibling);
                $sibling = $next;
            } else {
                break;
            }
        }
    }

    // Fallback: ensure Bootstrap classes on controls even if tag-level injection was skipped
    // Inputs
    foreach ($xpath->query('//input') as $input) {
        if (!$input instanceof DOMElement) {
            continue;
        }
        $type = strtolower($input->getAttribute('type'));
        if (in_array($type, ['text', 'email', 'url', 'tel', 'number', 'date', 'password', 'search'], true)) {
            $add_class($input, 'form-control');
        } elseif (in_array($type, ['checkbox', 'radio'], true)) {
            $add_class($input, 'form-check-input');
        } elseif ($type === 'file') {
            $add_class($input, 'form-control');
        }
    }

    // Textareas
    foreach ($xpath->query('//textarea') as $textarea) {
        if ($textarea instanceof DOMElement) {
            $add_class($textarea, 'form-control');
        }
    }

    // Selects
    foreach ($xpath->query('//select') as $select) {
        if ($select instanceof DOMElement) {
            $add_class($select, 'form-select');
        }
    }

    // Remove all <p> tags inside input-group elements
    foreach ($xpath->query('//*[contains(concat(" ", normalize-space(@class), " "), " input-group ")]//p') as $p) {
        /** @var DOMElement $p */
        // Move all child nodes of <p> to its parent
        $parent = $p->parentNode;
        while ($p->firstChild) {
            $parent->insertBefore($p->firstChild, $p);
        }
        // Remove the now-empty <p>
        $parent->removeChild($p);
    }

    // Remove empty paragraphs that CF7 sometimes leaves.
    foreach ($xpath->query('//p') as $p) {
        if (!trim($p->textContent) && !$p->getElementsByTagName('*')->length) {
            $p->parentNode->removeChild($p);
        }
    }

    // Add d-block class to wpcf7-spinner elements
    foreach ($xpath->query('//*[contains(concat(" ", normalize-space(@class), " "), " wpcf7-spinner ")]') as $spinner) {
        $add_class($spinner, 'd-block');
    }

    // Add Bootstrap alert classes to wpcf7-response-output
    foreach ($xpath->query('//*[contains(concat(" ", normalize-space(@class), " "), " wpcf7-response-output ")]') as $output) {
        $add_class($output, 'alert');

        $classes = $output->getAttribute('class');
        if (strpos($classes, 'wpcf7-mail-sent-ok') !== false) {
            $add_class($output, 'alert-success');
        } elseif (strpos($classes, 'wpcf7-validation-errors') !== false || strpos($classes, 'wpcf7-mail-sent-ng') !== false) {
            $add_class($output, 'alert-danger');
        }
    }

    // Extract inner HTML of our wrapper.
    $wrapper = $dom->getElementById('ileben-cf7-wrap');
    $out = '';
    if ($wrapper) {
        foreach ($wrapper->childNodes as $child) {
            $out .= $dom->saveHTML($child);
        }
    }

    // Regex fallback: ensure d-block class on spinner and alert classes on response-output
    if (!$out) {
        $out = $content;
    }

    $out = preg_replace_callback(
        '/<span\s+class="wpcf7-spinner"/',
        function ($matches) {
            return '<span class="wpcf7-spinner d-block"';
        },
        $out
    );

    $out = preg_replace_callback(
        '/<div\s+class="wpcf7-response-output"/',
        function ($matches) {
            return '<div class="wpcf7-response-output alert"';
        },
        $out
    );

    // Add alert-danger if response contains validation errors or mail sent ng
    $out = preg_replace_callback(
        '/<div\s+class="wpcf7-response-output\s+alert"/',
        function ($matches) {
            return '<div class="wpcf7-response-output alert alert-danger"';
        },
        $out
    );

    // Process input-group wrappers AFTER bootstrap structure is done
    $out = ileben_cf7_process_input_groups_regex($out);

    return $out;
}
// Run late so it happens after CF7 internal formatting and other filters.
add_filter('wpcf7_form_elements', 'ileben_cf7_bootstrap_structure', 9998);

/**
 * Process input-group tags with regex
 * Captures min/max for numbers and maxlength for text inputs
 */
function ileben_cf7_process_input_groups_regex($content)
{
    // Helper function to extract complete form element (input/select/textarea with attributes)
    $extract_element = function ($html) {
        
        // For input/textarea - capture the complete self-closing or single tag with all attributes
        if (preg_match('/<input[^>]*>/i', $html, $match)) {
            return $match[0];
        }
        // For select - capture opening tag, options, and closing tag
        if (preg_match('/<select[^>]*>.*?<\/select>/is', $html, $match)) {
            return $match[0];
        }
        // For textarea - capture opening tag, content, and closing tag
        if (preg_match('/<textarea[^>]*>.*?<\/textarea>/is', $html, $match)) {
            return $match[0];
        }
        return '';
    };

    // Process input-group wrapper patterns
    
    // Pattern 1: Standard with optional whitespace
    $content = preg_replace_callback(
        '/\[input_group_prepend\s*=\s*"([^"]+)"\s*\](.*?)\[\/input_group_prepend\]/is',
        function ($matches) use ($extract_element) {
            return ileben_process_input_group_match($matches, $extract_element, 'prepend');
        },
        $content
    );

    // Pattern 2: With quotes (original syntax)
    $content = preg_replace_callback(
        '/\[input_group_prepend\s+"([^"]+)"\](.*?)\[\/input_group_prepend\]/is',
        function ($matches) use ($extract_element) {
            return ileben_process_input_group_match($matches, $extract_element, 'prepend');
        },
        $content
    );

    // Pattern 3: Append variant with equals
    $content = preg_replace_callback(
        '/\[input_group_append\s*=\s*"([^"]+)"\s*\](.*?)\[\/input_group_append\]/is',
        function ($matches) use ($extract_element) {
            return ileben_process_input_group_match($matches, $extract_element, 'append');
        },
        $content
    );

    // Pattern 4: Append variant with quotes (original syntax)
    $content = preg_replace_callback(
        '/\[input_group_append\s+"([^"]+)"\](.*?)\[\/input_group_append\]/is',
        function ($matches) use ($extract_element) {
            return ileben_process_input_group_match($matches, $extract_element, 'append');
        },
        $content
    );
    
    return $content;
}

/**
 * Helper function to process a single input-group match
 */
function ileben_process_input_group_match($matches, $extract_element, $type)
{
    $value = $matches[1];
    $inner_html = $matches[2];
    
    // Parse the inner HTML to extract label and input
    $label_html = '';
    $input_html = '';
    
    // Extract label (can be anywhere in the content)
    if (preg_match('/<label[^>]*>.*?<\/label>/is', $inner_html, $label_match)) {
        $label_html = $label_match[0];
        // Remove label from inner HTML
        $inner_html = preg_replace('/<label[^>]*>.*?<\/label>/is', '', $inner_html);
    }
    
    // Extract complete form element with all attributes (min, max, maxlength, etc.)
    $input_html = $extract_element($inner_html);
    
    // Clean up br tags and extra whitespace
    $input_html = preg_replace('/<br\s*\/?>/i', '', $input_html);
    $input_html = trim($input_html);
    
    if (!$input_html) {
        // fallback if extraction failed
        return $label_html . $inner_html;
    }
    
    if ($type === 'append') {
        return $label_html . '
  <div class="input-group">
    ' . $input_html . '
    <span class="input-group-text">' . esc_html($value) . '</span>
  </div>';
    } else {
        return $label_html . '
  <div class="input-group">
    <span class="input-group-text">' . esc_html($value) . '</span>
    ' . $input_html . '
  </div>';
    }
}
