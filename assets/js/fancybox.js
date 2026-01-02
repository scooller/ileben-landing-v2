import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

export function initFancybox() {
  //add custom options here
  // default data-fancybox attribute selector
  // add extra selector to wp-block-image a elements
  Fancybox.bind('[data-fancybox], .wp-block-image a', {
    dragToClose: false,
    animated: true,
    showClass: 'fancybox-fadeIn',
    hideClass: 'fancybox-fadeOut'
  });
}
