import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';
import { SplitText } from 'gsap/SplitText';

export function initGsap() {
  const config = window.ILEBEN_GSAP || {};

  if (config.enableGsap) {
    // Register GSAP globally
    window.gsap = gsap;

    // Register plugins if enabled
    if (config.enableScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      window.ScrollTrigger = ScrollTrigger;
    }

    if (config.enableScrollTo) {
      gsap.registerPlugin(ScrollToPlugin);
    }

    if (config.enableDraggable) {
      gsap.registerPlugin(Draggable);
      window.Draggable = Draggable;
    }

    if (config.enableSplitText) {
      gsap.registerPlugin(SplitText);
      window.SplitText = SplitText;
    } else if (!window.SplitText) {
      // Provide a safe stub so inline scripts referencing SplitText do not break when disabled
      window.SplitText = function splitTextFallback() {
        console.warn('SplitText requested but the plugin is disabled. Returning empty segments.');
        return { lines: [], words: [], chars: [] };
      };
    }

    //console.log('GSAP initialized with config:', config);
  }
}
