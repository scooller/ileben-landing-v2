export function initPlantasFilter() {
  const wrappers = document.querySelectorAll('.bs-plantas-filters-wrapper');
  
  wrappers.forEach((wrapper) => {
    const form = wrapper.querySelector('[data-ajax-filter]');
    const container = wrapper.querySelector('.bs-plantas-slider-container');
    const swiperContainer = container?.querySelector('.swiper');
    // Guard against nulls before querying inside form
    if (!form || !container || !swiperContainer) return;
    const selects = form.querySelectorAll('[data-filter-select]');

    // Get reference to all slides
    const allSlides = swiperContainer.querySelectorAll('.swiper-slide');

    // Handle select changes
    selects.forEach((select) => {
      select.addEventListener('change', () => {
        filterSlides();
      });
    });

    function filterSlides() {
      const formData = new FormData(form);
      const selectedDorm = formData.get('planta_dormitorio') || '';
      const selectedBano = formData.get('planta_bano') || '';

      let visibleCount = 0;

      allSlides.forEach((slide) => {
        const slideDorm = slide.dataset.dorm || '';
        const slideBano = slide.dataset.bano || '';

        // Check if slide matches filters
        const matchesDorm = !selectedDorm || slideDorm === selectedDorm;
        const matchesBano = !selectedBano || slideBano === selectedBano;

        if (matchesDorm && matchesBano) {
          slide.style.display = '';
          slide.classList.remove('swiper-slide-hidden');
          slide.classList.add('swiper-slide-visible');
          visibleCount++;
        } else {
          slide.style.display = 'none';
          slide.classList.add('swiper-slide-hidden');
          slide.classList.remove('swiper-slide-visible');
        }
      });

      // Find and reinitialize the Swiper instance
      // Using update() alone doesn't work with loop: true when slides are hidden
      // We need to trigger re-initialization to recalculate indices
      if (swiperContainer.swiper) {
        // Destroy old instance to force proper recalculation
        const wasDestroyed = swiperContainer.swiper.destroyed;
        if (!wasDestroyed) {
          swiperContainer.swiper.destroy(true, true);
        }
        
        // Reinitialize Swiper (it will be picked up by the plantas-slider.js init)
        // Manually trigger re-init since the swiper property was cleared
        setTimeout(() => {
          if (window.initPlantasSlider) {
            window.initPlantasSlider();
          } else {
            console.warn('[Plantas Filter] initPlantasSlider not found, Swiper may need manual reinit');
          }
          
          // Fallback: if Swiper instance is not restored, try to reinitialize it
          if (swiperContainer.swiper) {
            swiperContainer.swiper.slideTo(0, 0);
          }
        }, 50);
      }

      // Show message if no results
      const existingAlert = container.querySelector('.plantas-no-results');
      if (visibleCount === 0) {
        if (!existingAlert) {
          const alert = document.createElement('div');
          alert.className = 'alert alert-info plantas-no-results mt-3';
          alert.textContent = 'No se encontraron plantas con los filtros seleccionados.';
          container.appendChild(alert);
        }
        if (swiperContainer) {
          swiperContainer.style.display = 'none';
        }
      } else {
        if (existingAlert) {
          existingAlert.remove();
        }
        if (swiperContainer) {
          swiperContainer.style.display = '';
        }
      }
    }
  });
}

