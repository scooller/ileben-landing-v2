document.addEventListener('DOMContentLoaded', function() {
    const swiperElements = document.querySelectorAll('.js-swiper');
    
    swiperElements.forEach(function(swiperEl) {
        const sliderId = swiperEl.dataset.sliderId;
        const navArrows = swiperEl.dataset.swiperNavArrows === 'true';
        const paginationType = swiperEl.dataset.swiperPaginationType || 'bullets';
        // ...otras opciones...
        
        const swiperConfig = {
            // ...otras configuraciones...
        };
        
        // Configurar paginación con selector específico
        if (paginationType !== 'none') {
            swiperConfig.pagination = {
                el: `.swiper-pagination-${sliderId}`,
                type: paginationType,
                clickable: true
            };
        }
        
        // Configurar navegación con selectores específicos
        if (navArrows) {
            swiperConfig.navigation = {
                nextEl: `.swiper-button-next-${sliderId}`,
                prevEl: `.swiper-button-prev-${sliderId}`
            };
        }
        
        new Swiper(swiperEl, swiperConfig);
    });
});
