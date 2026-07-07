/**
 * Plantas Showcase – Front-end JS
 *
 * Initializes the showcase: carousel rendering, detail panel updates,
 * client-side filtering, and lightbox via Fancybox.
 *
 * Data is embedded in a <script type="application/json"> tag by the PHP block.
 */

(function () {
    'use strict';

    function formatNumber(value) {
        var num = Number(value || 0);
        return num.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatArea(value) {
        var num = Number(value || 0);
        if (!num) return '-';
        return formatNumber(num) + ' m<sup>2*</sup>';
    }

    function formatPrice(value) {
        var num = Number(value || 0);
        if (!num) return '-';
        return 'UF ' + num.toLocaleString('es-CL', { maximumFractionDigits: 0 });
    }

    function normalizeSecureUrl(url) {
        if (!url) return '';
        try {
            var parsed = new URL(String(url), window.location.origin);
            return parsed.toString();
        } catch (e) {
            return String(url);
        }
    }

    function initShowcase(wrapper) {
        var dataNode = document.getElementById(wrapper.id + '-data');
        if (!dataNode) return;

        var allItems = [];
        try {
            allItems = JSON.parse(dataNode.textContent || '[]');
        } catch (e) {
            return;
        }
        if (!allItems.length) return;

        var carouselId = wrapper.id + '-carousel';
        var carouselElement = document.getElementById(carouselId);
        if (!carouselElement) return;

        var inner = carouselElement.querySelector('.carousel-inner');
        var fancyboxGroup = wrapper.getAttribute('data-fancybox-group') || wrapper.id;

        // Filter elements
        var filterBtn = wrapper.querySelector('[data-action="filter"]');
        var resetBtn = wrapper.querySelector('[data-action="reset"]');
        var shownPlantsNode = wrapper.querySelector('.show_plantas');

        // Detail panel fields
        var detailName = wrapper.querySelector('[data-field="nombre"]');
        var detailDesc = wrapper.querySelector('[data-field="descripcion"]');
        var fields = {
            dorm_bano: wrapper.querySelector('[data-field="dorm_bano"]'),
            orientacion: wrapper.querySelector('[data-field="orientacion"]'),
            superficie_total: wrapper.querySelector('[data-field="superficie_total"]'),
            precio_final: wrapper.querySelector('[data-field="precio_final"]')
        };
        var cotizarBtn = wrapper.querySelector('[data-field="cotizar_btn"]');

        var visibleItems = allItems.slice();

        // ── Carousel bootstrap controller helper ──
        function getCarouselController() {
            if (!carouselElement) return null;
            if (window.bootstrap && window.bootstrap.Carousel) {
                if (typeof window.bootstrap.Carousel.getOrCreateInstance === 'function') {
                    return window.bootstrap.Carousel.getOrCreateInstance(carouselElement, { interval: false, ride: false });
                }
                try {
                    return new window.bootstrap.Carousel(carouselElement, { interval: false, ride: false });
                } catch (e) { /* noop */ }
            }
            return null;
        }

        // ── Update detail panel ──
        function updateDetails(item) {
            if (!item) item = {};

            if (detailName) {
                detailName.textContent = item.name || item.planta_label || '-';
            }
            if (detailDesc) {
                detailDesc.textContent = item.content || '';
            }
            if (fields.dorm_bano) {
                fields.dorm_bano.textContent = item.dorm_bano || '-';
            }
            if (fields.orientacion) {
                fields.orientacion.textContent = item.orientacion || '-';
            }
            if (fields.superficie_total) {
                fields.superficie_total.innerHTML = formatArea(item.superficie_total);
            }
            if (fields.precio_final) {
                fields.precio_final.textContent = formatPrice(item.precio_final);
            }

            // Cotizar button
            if (cotizarBtn) {
                if (item.cotizador_activo && item.cotizacion_url) {
                    cotizarBtn.style.display = '';
                    cotizarBtn.removeAttribute('disabled');
                    cotizarBtn.classList.remove('disabled');
                    cotizarBtn.setAttribute('href', normalizeSecureUrl(item.cotizacion_url));
                } else {
                    cotizarBtn.style.display = 'none';
                    cotizarBtn.setAttribute('href', '#');
                    cotizarBtn.setAttribute('disabled', 'disabled');
                }
            }
        }

        // ── Render carousel slides ──
        function renderCarousel(items) {
            inner.innerHTML = '';
            updateShownPlants(items.length);

            if (!items.length) {
                inner.innerHTML = '<div class="carousel-item active"><div class="d-flex align-items-center justify-content-center text-muted fst-italic p-5">No hay plantas para esos filtros.</div></div>';
                updateDetails({});
                return;
            }

            items.forEach(function (item, index) {
                var slide = document.createElement('div');
                slide.className = 'carousel-item text-center' + (index === 0 ? ' active' : '');
                slide.setAttribute('data-item-id', String(item.id));

                var imageType = wrapper.getAttribute('data-image-type') || 'portada';
                var defaultSrc = imageType === 'interior' ? (item.imagen_interior || item.imagen || item.imagen_fallback) : (item.imagen || item.imagen_fallback);
                var imageSrc = normalizeSecureUrl(defaultSrc || '');
                var fullSrc = normalizeSecureUrl(item.imagen_interior || imageSrc || '');
                var fallbackSrc = normalizeSecureUrl(item.imagen_fallback || '');
                var safeAlt = item.name || 'Planta';

                // Use <a data-fancybox> so Fancybox handles the lightbox
                var imageHtml = imageSrc
                    ? '<a href="' + fullSrc + '" data-fancybox="' + fancyboxGroup + '" data-caption="' + safeAlt + '" class="w-100 h-100">' +
                      '<img src="' + imageSrc + '" class="object-fit-cover mx-auto w-100 h-100" alt="' + safeAlt + '" data-fallback-src="' + fallbackSrc + '">' +
                      '</a>'
                    : '<div class="d-flex align-items-center justify-content-center text-muted fst-italic p-5">Sin imagen disponible</div>';

                slide.innerHTML = imageHtml;
                inner.appendChild(slide);

                // Image error fallback
                var slideImage = slide.querySelector('img');
                if (slideImage) {
                    slideImage.addEventListener('error', function onImageError() {
                        var fb = slideImage.getAttribute('data-fallback-src') || '';
                        if (fb && slideImage.getAttribute('src') !== fb) {
                            slideImage.setAttribute('src', fb);
                            return;
                        }
                        slideImage.removeEventListener('error', onImageError);
                        slideImage.outerHTML = '<div class="d-flex align-items-center justify-content-center text-muted fst-italic p-5">Sin imagen disponible</div>';
                    });
                }
            });

            // Initialize bootstrap carousel
            getCarouselController();

            // Update details for first item
            updateDetails(items[0]);

            // Listen for slide changes to update details
            carouselElement.addEventListener('slid.bs.carousel', function (e) {
                var activeSlide = inner.querySelector('.carousel-item.active');
                if (activeSlide) {
                    var itemId = activeSlide.getAttribute('data-item-id');
                    var matched = items.find(function (it) { return String(it.id) === itemId; });
                    if (matched) updateDetails(matched);
                }
            });
        }

        // ── Filtering ──
        function getFilterValues() {
            var filters = { dorm: '', bano: '', piso: '', orientacion: '' };
            var selects = wrapper.querySelectorAll('[data-filter]');
            selects.forEach(function (sel) {
                var key = sel.getAttribute('data-filter');
                if (filters.hasOwnProperty(key)) {
                    filters[key] = sel.value || '';
                }
            });
            return filters;
        }

        function updateShownPlants(count) {
            if (!shownPlantsNode) return;
            shownPlantsNode.textContent = String(Math.max(0, Number(count) || 0));
        }

        function applyFilters() {
            var f = getFilterValues();

            visibleItems = allItems.filter(function (item) {
                var dormOk = !f.dorm || String(item.dorm || '').indexOf(f.dorm) !== -1;
                var banoOk = !f.bano || String(item.bano || '').indexOf(f.bano) !== -1;
                var pisoOk = !f.piso || String(item.piso || '') === f.piso;
                var orientOk = !f.orientacion || String(item.orientacion || '') === f.orientacion;
                return dormOk && banoOk && pisoOk && orientOk;
            });

            wrapper.classList.add('is-filtering');
            setTimeout(function () {
                renderCarousel(visibleItems);
                wrapper.classList.remove('is-filtering');
            }, 140);
        }

        function resetFilters() {
            var selects = wrapper.querySelectorAll('[data-filter]');
            selects.forEach(function (sel) {
                sel.value = '';
                if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.select2 === 'function') {
                    window.jQuery(sel).val('').trigger('change');
                }
            });
            visibleItems = allItems.slice();
            wrapper.classList.add('is-filtering');
            setTimeout(function () {
                renderCarousel(visibleItems);
                wrapper.classList.remove('is-filtering');
            }, 140);
        }

        if (filterBtn) {
            filterBtn.addEventListener('click', applyFilters);
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', resetFilters);
        }

        // ── Initial render ──
        renderCarousel(visibleItems);
    }

    // ── Initialize Select2 on filter selects ──
    function initSelect2(wrapper) {
        if (!window.jQuery || !window.jQuery.fn || typeof window.jQuery.fn.select2 !== 'function') {
            return;
        }
        var $ = window.jQuery;
        var selects = wrapper.querySelectorAll('select.form-select[data-filter]');
        selects.forEach(function (select) {
            var $select = $(select);
            if ($select.hasClass('select2-hidden-accessible')) {
                return;
            }
            $select.select2({
                dropdownParent: $(wrapper),
                width: 'auto',
                minimumResultsForSearch: 0,
                placeholder: select.querySelector('option:first-child') ? select.querySelector('option:first-child').textContent : '',
                allowClear: true,
                language: {
                    noResults: function () { return 'No se encontraron resultados'; },
                    searching: function () { return 'Buscando...'; }
                }
            });
            // Re-sync select2 value when resetFilters clears the underlying <select>
            $select.on('change', function () {
                $select.trigger('select2:updated');
            });
        });
    }

    // ── Initialize all showcases on DOM ready ──
    function initAll() {
        var showcases = document.querySelectorAll('.bs-plantas-showcase');
        showcases.forEach(function (el) {
            if (!el.dataset.showcaseInitialized) {
                el.dataset.showcaseInitialized = 'true';
 initShowcase(el);
                initSelect2(el);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
