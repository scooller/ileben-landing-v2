/**
 * CF7 Bootstrap - Add missing classes via JavaScript
 * Fixes spinner and response-output styling
 */

function applyBootstrapClasses() {
    // Add d-block to all wpcf7-spinner elements
    document.querySelectorAll('.wpcf7-spinner').forEach(spinner => {
        if (!spinner.classList.contains('d-block')) {
            spinner.classList.add('d-block', 'mt-2', 'mx-auto');
        }
    });

    // add invalid-feedback and d-block to wpcf7-not-valid-tip
    // agregar timer para esperar que se creen los elementos
    setTimeout(() => {
        document.querySelectorAll('.wpcf7-not-valid-tip').forEach(tip => {
            if (!tip.classList.contains('invalid-feedback')) {
                tip.classList.add('invalid-feedback', 'd-block');
            }
        });
        //buscar los input con wpcf7-not-valid y agregar is-invalid
        document.querySelectorAll('.wpcf7-form-control.wpcf7-not-valid').forEach(input => {
            if (!input.classList.contains('is-invalid')) {
                input.classList.add('is-invalid');
            }
        });
    }, 100);

    // Add alert classes to wpcf7-response-output
    document.querySelectorAll('.wpcf7-response-output').forEach(output => {
        if (!output.classList.contains('alert')) {
            output.classList.add('alert');
        }

        // Add alert-success or alert-danger based on other classes
        if (output.classList.contains('wpcf7-mail-sent-ok')) {
            output.classList.add('alert-success');
            output.classList.remove('alert-danger', 'alert-info', 'wpcf7-validation-errors', 'wpcf7-mail-sent-ng');
        } else if (output.classList.contains('wpcf7-validation-errors') || output.classList.contains('wpcf7-mail-sent-ng')) {
            output.classList.add('alert-danger');
            output.classList.remove('alert-success', 'alert-info', 'wpcf7-validation-errors', 'wpcf7-mail-sent-ng');
        }
    });
}

function clearFieldToasts(step) {
    step.querySelectorAll('.cf7-field-toast').forEach((toast) => toast.remove());
}

function showFieldToast(field, message) {
    const wrapper = field.closest('.form-group') || field.parentElement;
    if (!wrapper) return;
    wrapper.classList.add('position-relative');

    const fallbackMessage = (field.form && field.form.dataset.cf7ToastMessage) || 'Por favor completa los campos requeridos.';
    const toastMessage = message || fallbackMessage;

    let toast = wrapper.querySelector('.cf7-field-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast cf7-field-toast align-items-center text-bg-danger border-0 show position-absolute top-0 start-0 translate-middle-y';
        toast.style.zIndex = '2';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.setAttribute('aria-atomic', 'true');

        const body = document.createElement('div');
        body.className = 'd-flex';
        const text = document.createElement('div');
        text.className = 'toast-body';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn-close btn-close-white me-2 m-auto';
        button.setAttribute('aria-label', 'Close');
        button.addEventListener('click', () => toast.remove());

        body.appendChild(text);
        body.appendChild(button);
        toast.appendChild(body);
        wrapper.appendChild(toast);
    }

    const bodyText = toast.querySelector('.toast-body');
    if (bodyText) {
        bodyText.textContent = toastMessage;
    }
    toast.classList.add('show');
}

function isCf7Required(field) {
    return (
        field.required ||
        field.getAttribute('aria-required') === 'true' ||
        field.classList.contains('wpcf7-validates-as-required')
    );
}

function validateCf7Step(step) {
    clearFieldToasts(step);
    const fields = step.querySelectorAll('input, select, textarea');
    for (const field of fields) {
        field.classList.remove('is-valid');
        field.classList.remove('is-invalid');
        // Handle required markers from CF7 even if the native required attr is missing
        if (isCf7Required(field)) {
            if (field.type === 'radio' || field.type === 'checkbox') {
                const group = step.querySelectorAll(`input[name="${field.name}"]`);
                const anyChecked = Array.from(group).some((input) => input.checked);
                if (!anyChecked) {
                    field.classList.add('is-invalid');
                    showFieldToast(field);
                    field.reportValidity();
                    return false;
                }
            } else if (!field.value || !field.value.trim()) {
                field.classList.add('is-invalid');
                showFieldToast(field);
                field.reportValidity();
                return false;
            }
        }

        // Use native validation when available (patterns, types, etc.)
        if (!field.checkValidity()) {
            field.classList.add('is-invalid');
            showFieldToast(field);
            field.reportValidity();
            return false;
        }

        field.classList.add('is-valid');
    }
    return true;
}

function updateStepIndicator(form, currentIndex) {
    const items = form.querySelectorAll('.cf7-step-indicator-item');
    items.forEach((item, idx) => {
        const dot = item.querySelector('.cf7-step-dot');
        const label = item.querySelector('.cf7-step-label');
        const isCurrent = idx === currentIndex;
        const isComplete = idx < currentIndex;
        item.classList.toggle('is-current', isCurrent);
        item.classList.toggle('is-complete', isComplete);
        item.classList.toggle('is-upcoming', idx > currentIndex);
        if (dot) {
            dot.textContent = isComplete ? '✓' : String(idx + 1);
            dot.className = 'cf7-step-dot badge rounded-circle';
            if (isComplete) {
                dot.classList.add('text-bg-success');
            } else if (isCurrent) {
                dot.classList.add('text-bg-primary');
            } else {
                dot.classList.add('text-bg-secondary');
            }
        }
        if (label) {
            label.className = 'cf7-step-label badge rounded-pill';
            if (isComplete) {
                label.classList.add('text-bg-success');
            } else if (isCurrent) {
                label.classList.add('text-bg-primary');
            } else {
                label.classList.add('text-bg-light', 'text-secondary', 'border');
            }
        }
    });

    const connectors = form.querySelectorAll('.cf7-step-connector');
    connectors.forEach((connector, idx) => {
        connector.classList.toggle('is-complete', idx < currentIndex);
    });
}

function showCf7Step(form, targetIndex, animation = 'fade') {
    const steps = form.querySelectorAll('.wpcf7-step');
    const currentIndex = Number(form.dataset.cf7CurrentStep || '0');
    if (targetIndex === currentIndex) return;

    const currentStep = steps[currentIndex];
    const nextStep = steps[targetIndex];
    if (!nextStep) return;

    if (animation !== 'none') {
        form.classList.add('cf7-step-animated');
        form.classList.toggle('cf7-step-animate-fade', animation === 'fade');
        form.classList.toggle('cf7-step-animate-slide', animation === 'slide');
        form.classList.toggle('cf7-step-animate-lift', animation === 'lift');
        form.classList.toggle('cf7-step-animate-zoom', animation === 'zoom');
    }

    steps.forEach((step, idx) => {
        const active = idx === targetIndex;
        step.classList.toggle('active', active);
    });

    if (animation === 'none') {
        steps.forEach((step, idx) => {
            step.hidden = idx !== targetIndex;
            step.classList.remove('is-entering', 'is-leaving');
        });
    } else {
        steps.forEach((step) => {
            step.classList.remove('is-entering', 'is-leaving');
        });
        if (currentStep) {
            currentStep.classList.add('is-leaving');
        }
        nextStep.hidden = false;
        nextStep.classList.add('is-entering');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (currentStep) {
                    currentStep.hidden = true;
                    currentStep.classList.remove('is-leaving');
                }
                nextStep.classList.remove('is-entering');
            });
        });
        steps.forEach((step, idx) => {
            if (idx !== targetIndex && step !== currentStep) {
                step.hidden = true;
            }
        });
    }

    form.dataset.cf7CurrentStep = String(targetIndex);

    // Update progress bar if present
    const progressBar = form.querySelector('.cf7-progress .progress-bar');
    if (progressBar && steps.length > 0) {
        const pct = Math.round(((targetIndex + 1) / steps.length) * 100);
        progressBar.style.width = `${pct}%`;
        progressBar.setAttribute('aria-valuenow', String(pct));
    }

    // Update step indicator if present
    updateStepIndicator(form, targetIndex);
}

function getCf7Config() {
    const cfg = window.ILEBEN_CF7 || {};
    return {
        nextButtonLabel: cfg.nextButtonLabel || 'Siguiente',
        prevButtonLabel: cfg.prevButtonLabel || 'Anterior',
        stepAnimation: cfg.stepAnimation || 'fade',
        stepAnimationDuration: Number(cfg.stepAnimationDuration || 250),
        stepAnimationEasing: cfg.stepAnimationEasing || 'ease',
        toastMessage: cfg.toastMessage || 'Por favor completa los campos requeridos.',
        showStepTitles: !!cfg.showStepTitles,
        stepTitleMode: cfg.stepTitleMode || 'label',
        showProgressBar: !!cfg.showProgressBar,
    };
}

function buildCf7Steps(form) {
    if (form.dataset.cf7StepsInit === 'true') {
        return;
    }

    const markers = Array.from(form.querySelectorAll('.wpcf7-step-break'));
    if (!markers.length) {
        return;
    }

    const steps = [];
    let currentNodes = [];
    let currentLabel = 'Paso 1';

    // Detect existing submit button to reuse label; remove it from flow
    const submitNodes = Array.from(form.querySelectorAll('input[type="submit"], button[type="submit"]'));
    let submitLabel = 'Enviar';
    if (submitNodes.length) {
        const firstSubmit = submitNodes[0];
        submitLabel = firstSubmit.value || firstSubmit.textContent || 'Enviar';
    }

    // Parse steps scanning all child nodes (including text/br) and markers inside wrappers
    const nodes = Array.from(form.childNodes).filter((node) => {
        if (submitNodes.includes(node)) {
            node.remove();
            return false;
        }
        // Drop empty text nodes
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
            node.parentNode && node.parentNode.removeChild(node);
            return false;
        }
        return true;
    });

    const findMarker = (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        if (node.classList && node.classList.contains('wpcf7-step-break')) return node;
        return node.querySelector ? node.querySelector('.wpcf7-step-break') : null;
    };

    let seenMarker = false;

    nodes.forEach((node) => {
        const marker = findMarker(node);
        if (marker) {
            const markerLabel = marker.dataset.stepLabel || `Paso ${steps.length + 1}`;
            // Remove all markers inside this node
            node.querySelectorAll && node.querySelectorAll('.wpcf7-step-break').forEach((m) => m.remove());

            // If marker node is itself and has no other content, drop it
            if (node.nodeType === Node.ELEMENT_NODE && !node.querySelector('*') && !node.textContent.trim()) {
                node.remove();
            }

            if (!seenMarker) {
                currentLabel = markerLabel;
                seenMarker = true;
                return;
            }

            if (currentNodes.length > 0) {
                steps.push({ label: currentLabel, nodes: currentNodes });
            }

            currentLabel = markerLabel;
            currentNodes = [];
            return;
        }

        currentNodes.push(node);
    });

    if (currentNodes.length) {
           steps.push({ label: currentLabel, nodes: currentNodes });
    }
    if (steps.length <= 1) {
        return;
    }

    form.innerHTML = '';

    const cfg = getCf7Config();
    const animation = cfg.stepAnimation;
    const animDurationMs = Math.max(0, Number(cfg.stepAnimationDuration || 0));

    form.style.setProperty('--cf7-step-duration', `${animDurationMs}ms`);
    form.style.setProperty('--cf7-step-easing', cfg.stepAnimationEasing || 'ease');
    form.dataset.cf7ToastMessage = cfg.toastMessage || '';
    // Optional step indicator (header)
    let indicatorList = null;
    if (cfg.showStepTitles && steps.length > 0) {
        const indicator = document.createElement('div');
        indicator.className = 'cf7-step-indicator';
        indicatorList = document.createElement('ol');
        indicatorList.className = 'cf7-step-indicator-list';

        steps.forEach((step, idx) => {
            const item = document.createElement('li');
            item.className = 'cf7-step-indicator-item';
            item.dataset.stepIndex = String(idx);

            const dot = document.createElement('span');
            dot.className = 'cf7-step-dot badge rounded-circle text-bg-secondary';
            dot.textContent = String(idx + 1);

            item.appendChild(dot);

            // Only show label if stepTitleMode is not 'number'
            if (cfg.stepTitleMode !== 'number') {
                const label = document.createElement('span');
                label.className = 'cf7-step-label badge rounded-pill text-bg-light text-secondary border';
                label.textContent = step.label || `Paso ${idx + 1}`;
                item.appendChild(label);
            }

            indicatorList.appendChild(item);

            if (idx < steps.length - 1) {
                const connector = document.createElement('span');
                connector.className = 'cf7-step-connector';
                indicatorList.appendChild(connector);
            }
        });

        indicator.appendChild(indicatorList);
        form.appendChild(indicator);
    }

    // Optional progress bar
    let progressWrapper = null;
    if (cfg.showProgressBar && steps.length > 1) {
        progressWrapper = document.createElement('div');
        progressWrapper.className = 'cf7-progress-wrapper';
        const progress = document.createElement('div');
        progress.className = 'progress cf7-progress';
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.style.width = `${Math.round((1 / steps.length) * 100)}%`;
        progress.appendChild(bar);
        progressWrapper.appendChild(progress);
        form.appendChild(progressWrapper);
    }

    steps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'wpcf7-step';
        stepEl.dataset.stepIndex = String(index);
        stepEl.dataset.stepLabel = step.label;
        stepEl.classList.toggle('active', index === 0);
        if (index !== 0) {
            stepEl.hidden = true;
        }

        // Step title from marker label (configurable)
        if (cfg.showStepTitles) {
            const title = document.createElement('h5');
            title.className = 'wpcf7-step-title text-center mb-3';
            if (cfg.stepTitleMode === 'number') {
                title.textContent = `Paso ${index + 1}`;
            } else {
                title.textContent = step.label || `Paso ${index + 1}`;
            }
            stepEl.appendChild(title);
        }

        step.nodes.forEach((node) => stepEl.appendChild(node));
        // Remove stray <br> immediately after the title if present (including from existing nodes)
        stepEl.querySelectorAll('.wpcf7-step-title + br').forEach((br) => br.remove());

        const nav = document.createElement('div');
        nav.className = 'd-flex gap-2 justify-content-between mt-3';

        if (index > 0) {
            const prev = document.createElement('button');
            prev.type = 'button';
            prev.className = 'btn btn-primary';
            prev.innerHTML = cfg.prevButtonLabel;
            prev.addEventListener('click', () => {
                const current = Number(form.dataset.cf7CurrentStep || '0');
                showCf7Step(form, Math.max(current - 1, 0), animation);
            });
            nav.appendChild(prev);
        }

        if (index < steps.length - 1) {
            const next = document.createElement('button');
            next.type = 'button';
            next.className = 'btn btn-primary ms-auto';
            next.innerHTML = cfg.nextButtonLabel;
            next.addEventListener('click', () => {
                const current = Number(form.dataset.cf7CurrentStep || '0');
                const currentStepEl = form.querySelector('.wpcf7-step.active') || form.querySelector(`.wpcf7-step[data-step-index="${current}"]`);
                if (currentStepEl && !validateCf7Step(currentStepEl)) {
                    applyBootstrapClasses();
                    return;
                }
                showCf7Step(form, Math.min(current + 1, steps.length - 1), animation);
            });
            nav.appendChild(next);
        } else {
            // Last step: render submit button
            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.className = 'btn btn-primary ms-auto';
            submitBtn.innerHTML = submitLabel;
            nav.appendChild(submitBtn);
        }

        stepEl.appendChild(nav);
        form.appendChild(stepEl);
    });

    form.dataset.cf7StepsInit = 'true';
    form.dataset.cf7CurrentStep = '0';
    if (animation !== 'none') {
        form.classList.add('cf7-step-animated');
    }

    if (indicatorList) {
        updateStepIndicator(form, 0);
    }
}

function initCf7Multistep() {
    document.querySelectorAll('.wpcf7-form').forEach((form) => {
        buildCf7Steps(form);
    });
}

function applyCf7Enhancements() {
    applyBootstrapClasses();
    initCf7Multistep();
}

// add Class info on sending
document.addEventListener('wpcf7beforesubmit', function (event) {
    const output = event.target.querySelector('.wpcf7-response-output');
    if (output) {
        output.classList.add('alert', 'alert-info');
        output.classList.remove('alert-success', 'alert-danger');
        applyCf7Enhancements();
    }
});

// Apply on DOM ready
document.addEventListener('DOMContentLoaded', applyCf7Enhancements);

// Apply immediately if DOM is already ready
if (document.readyState !== 'loading') {
    applyCf7Enhancements();
}

// Apply after CF7 AJAX submissions
document.addEventListener('wpcf7submit', applyCf7Enhancements);
document.addEventListener('wpcf7invalid', applyCf7Enhancements);
document.addEventListener('wpcf7spam', applyCf7Enhancements);
document.addEventListener('wpcf7mailfailed', applyCf7Enhancements);
document.addEventListener('wpcf7mailsent', applyCf7Enhancements);

// Add blur event listener to CF7 form inputs for validation feedback
document.addEventListener('DOMContentLoaded', function () {
    const cf7Forms = document.querySelectorAll('.wpcf7-form');

    cf7Forms.forEach(form => {
        const inputs = form.querySelectorAll('.wpcf7-form-control');

        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                // If input has is-invalid but no longer has wpcf7-not-valid
                if (this.classList.contains('is-invalid') && !this.classList.contains('wpcf7-not-valid')) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');

                    // Remove invalid-feedback message if exists
                    const wrapper = this.closest('.form-group');
                    if (wrapper) {
                        const invalidTip = wrapper.querySelector('.wpcf7-not-valid-tip');
                        if (invalidTip) {
                            invalidTip.style.display = 'none';
                        }
                    }
                }
                // If input has wpcf7-not-valid, ensure it has is-invalid
                else if (this.classList.contains('wpcf7-not-valid') && !this.classList.contains('is-invalid')) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                }
            });
        });
    });
});

export { applyBootstrapClasses, applyCf7Enhancements, initCf7Multistep };
