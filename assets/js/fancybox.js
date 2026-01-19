import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export function initFancybox() {
  // Configure Fancybox with optimal settings
  Fancybox.bind('[data-fancybox], .wp-block-image a', {
    // Carousel settings
    Carousel: {
      // Toolbar configuration
      Toolbar: {
        display: {
          left: ['counter'],
          middle: [],
          right: ['close']
        }
      },
      // Responsive toolbar - more options on desktop
      breakpoints: {
        '(min-width: 768px)': {
          Toolbar: {
            display: {
              left: ['counter'],
              middle: ['zoomIn', 'zoomOut', 'toggle1to1'],
              right: ['close']
            }
          }
        }
      }
    },
    // Enable drag to close on mobile
    dragToClose: true,
    // Animation settings
    animated: true,
    showClass: 'fancybox-fadeIn',
    hideClass: 'fancybox-fadeOut',
    // Disable idle mode (no auto-hide controls)
    idle: false,
    // Compact mode for mobile
    compact: (instance) => {
      return window.innerWidth < 768;
    }
  });
}
