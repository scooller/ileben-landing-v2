/**
 * Gallery Block Frontend - Filter functionality
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        // Gallery filter buttons
        const filterButtons = document.querySelectorAll('[data-filter]');
        
        if (!filterButtons.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const filter = this.getAttribute('data-filter');
                const gallery = this.closest('.gallery-container');
                
                if (!gallery) return;

                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                // Filter items
                const items = gallery.querySelectorAll('figure');
                items.forEach(item => {
                    if (filter === '*') {
                        item.style.display = '';
                    } else {
                        // Remove leading dot from filter
                        const filterClass = filter.substring(1);
                        if (item.classList.contains(filterClass)) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
            });
        });
    });
})();
