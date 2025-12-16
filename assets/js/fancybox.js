import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

export function initFancybox() {
  Fancybox.bind('[data-fancybox]', {
    dragToClose: false,
    animated: true,
    showClass: 'fancybox-fadeIn',
    hideClass: 'fancybox-fadeOut'
  });
}
