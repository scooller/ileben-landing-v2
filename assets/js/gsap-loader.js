import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';

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
    }

    console.log('GSAP initialized with config:', config);
  }
}
