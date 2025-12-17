export function initPlantasFilter() {
  const wrappers = document.querySelectorAll('.bs-plantas-filters-wrapper');
  
  wrappers.forEach((wrapper) => {
    const form = wrapper.querySelector('[data-ajax-filter]');
    const container = wrapper.querySelector('.bs-plantas-slider-container');
    const swiperContainer = container?.querySelector('.swiper');
    const selects = form.querySelectorAll('[data-filter-select]');
    
    if (!form || !container || !swiperContainer) return;

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
          visibleCount++;
        } else {
          slide.style.display = 'none';
          slide.classList.add('swiper-slide-hidden');
        }
      });

      // Find and update the Swiper instance
      if (swiperContainer.swiper) {
        swiperContainer.swiper.update();
        swiperContainer.swiper.slideTo(0);
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

