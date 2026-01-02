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
 * Add Bootstrap-friendly classes to CF7 form tags.
 */
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
// Class injection disabled: keeping structure filter only; add Bootstrap classes directly in the CF7 form.

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
    $dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
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

    return $out;
}
// Run late so it happens after CF7 internal formatting and other filters.
add_filter('wpcf7_form_elements', 'ileben_cf7_bootstrap_structure', 9999);
