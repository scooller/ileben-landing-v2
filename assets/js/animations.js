/**
 * GSAP Animations Manager
 * 
 * Maneja todas las animaciones GSAP para bloques Bootstrap
 * Soporta: Fade, Scale, Slide, Rotate, Bounce, Stagger, Parallax, etc.
 * Triggers: on-load, on-scroll, on-hover, on-click
 */

class GSAPAnimationManager {
  constructor() {
    this.animations = new Map();
    this.scrollTriggers = [];
    this.hoverObservers = [];
    this.clickObservers = [];
    this.initialized = false;
    this.isMobile = window.innerWidth < 768;
    
    // Register ScrollTrigger plugin if available
    if (window.gsap && window.ScrollTrigger && !gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }
  }

  /**
   * Inicializa todas las animaciones en la página
   */
  init() {
    if (!window.gsap) {
      console.warn('GSAP not loaded');
      return;
    }

    if (this.initialized) return;
    this.initialized = true;

    // Buscar todos los elementos con atributos de animación
    this.findAnimatedElements();

    // Observar cambios en el DOM
    this.observeDOM();

    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Encuentra todos los elementos que deben ser animados
   */
  findAnimatedElements() {
    const elements = document.querySelectorAll('[data-animate-type]');
    
    elements.forEach((element) => {
      const config = this.parseAnimationConfig(element);
      
      if (!config) return;

      // Saltarse si está deshabilitado en móvil
      if (this.isMobile && !config.mobileEnabled) {
        return;
      }

      this.setupAnimation(element, config);
    });
  }

  /**
   * Parsea la configuración de animación desde data attributes
   */
  parseAnimationConfig(element) {
    const type = element.getAttribute('data-animate-type');
    const trigger = element.getAttribute('data-animate-trigger') || 'on-load';
    const duration = parseFloat(element.getAttribute('data-animate-duration')) || 0.6;
    const delay = parseFloat(element.getAttribute('data-animate-delay')) || 0;
    const ease = element.getAttribute('data-animate-ease') || 'power2.inOut';
    const repeat = parseInt(element.getAttribute('data-animate-repeat')) || 0;
    const repeatDelay = parseFloat(element.getAttribute('data-animate-repeat-delay')) || 0;
    const yoyo = element.getAttribute('data-animate-yoyo') === 'true';
    const distance = element.getAttribute('data-animate-distance') || '30px';
    const rotation = parseInt(element.getAttribute('data-animate-rotation')) || 360;
    const scale = element.getAttribute('data-animate-scale') || '0.8';
    const staggerDelay = parseFloat(element.getAttribute('data-animate-stagger-delay')) || 0.1;
    const parallaxSpeed = parseFloat(element.getAttribute('data-animate-parallax-speed')) || 0.5;
    const hoverEffect = element.getAttribute('data-animate-hover-effect') || null;
    const mobileEnabled = element.getAttribute('data-animate-mobile') !== 'false';
    // SplitText attributes
    const enableSplitText = element.getAttribute('data-split-text') === 'true';
    const splitType = element.getAttribute('data-split-type') || 'words';
    const splitStagger = parseFloat(element.getAttribute('data-split-stagger')) || 0.05;

    if (!type) return null;

    return {
      type,
      trigger,
      duration,
      delay,
      ease,
      repeat,
      repeatDelay,
      yoyo,
      distance,
      rotation,
      scale,
      staggerDelay,
      parallaxSpeed,
      hoverEffect,
      mobileEnabled,
      enableSplitText,
      splitType,
      splitStagger
    };
  }

  /**
   * Configura la animación según el trigger
   */
  setupAnimation(element, config) {
    const key = this.getElementKey(element);
    
    switch (config.trigger) {
      case 'on-load':
        this.animateOnLoad(element, config);
        break;
      
      case 'on-scroll':
        this.animateOnScroll(element, config);
        break;
      
      case 'on-hover':
        this.animateOnHover(element, config);
        break;
      
      case 'on-click':
        this.animateOnClick(element, config);
        break;
      
      default:
        this.animateOnLoad(element, config);
    }

    this.animations.set(key, config);
  }

  /**
   * Animación al cargar (on-load)
   */
  animateOnLoad(element, config) {
    // Verificar si tiene SplitText habilitado
    if (config.enableSplitText && window.SplitText) {
      this.animateWithSplitText(element, config);
      return;
    }

    const { fromVars, toVars } = this.buildAnimationConfig(config);
    
    gsap.fromTo(element, fromVars, {
      ...toVars,
      delay: config.delay,
      repeat: config.repeat,
      repeatDelay: config.repeatDelay,
      yoyo: config.yoyo
    });
  }

  /**
   * Animación al hacer scroll (on-scroll)
   */
  animateOnScroll(element, config) {
    // Requiere ScrollTrigger
    if (!window.ScrollTrigger || !gsap.plugins.ScrollTrigger) {
      // Intenta registrar ScrollTrigger si está disponible
      if (window.ScrollTrigger && !gsap.plugins.ScrollTrigger) {
        gsap.registerPlugin(window.ScrollTrigger);
      } else {
        console.warn('ScrollTrigger plugin not loaded');
        return;
      }
    }

    // Verificar si tiene SplitText habilitado
    if (config.enableSplitText && window.SplitText) {
      this.animateWithSplitText(element, config, true);
      return;
    }

    const { fromVars, toVars } = this.buildAnimationConfig(config);

    gsap.fromTo(element, fromVars, {
      ...toVars,
      delay: config.delay,
      repeat: config.repeat,
      repeatDelay: config.repeatDelay,
      yoyo: config.yoyo,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
        markers: false
      }
    });
  }

  /**
   * Animación al hover (on-hover)
   */
  animateOnHover(element, config) {
    element.addEventListener('mouseenter', () => {
      this.playHoverAnimation(element, config, true);
    });

    element.addEventListener('mouseleave', () => {
      this.playHoverAnimation(element, config, false);
    });
  }

  /**
   * Animación al hacer click (on-click)
   */
  animateOnClick(element, config) {
    element.style.cursor = 'pointer';
    
    element.addEventListener('click', () => {
      // Matar animaciones previas
      gsap.killTweensOf(element);

      const { fromVars, toVars } = this.buildAnimationConfig(config);
      
      gsap.fromTo(element, fromVars, {
        ...toVars,
        repeat: config.repeat,
        repeatDelay: config.repeatDelay,
        yoyo: config.yoyo
      });
    });
  }

  /**
   * Construye la configuración del tween según el tipo de animación
   * Retorna un objeto con { fromVars, toVars }
   */
  buildAnimationConfig(config) {
    const { type, duration, ease, scale, distance, rotation } = config;

    const baseConfig = {
      duration,
      ease
    };

    let fromVars = {};
    let toVars = { ...baseConfig };

    switch (type) {
      case 'fadeIn':
        fromVars = { opacity: 0 };
        toVars = { ...toVars, opacity: 1 };
        break;

      case 'fadeInUp':
        fromVars = { opacity: 0, y: this.parseDistance(distance) };
        toVars = { ...toVars, opacity: 1, y: 0 };
        break;

      case 'fadeInDown':
        fromVars = { opacity: 0, y: -this.parseDistance(distance) };
        toVars = { ...toVars, opacity: 1, y: 0 };
        break;

      case 'fadeInLeft':
        fromVars = { opacity: 0, x: this.parseDistance(distance) };
        toVars = { ...toVars, opacity: 1, x: 0 };
        break;

      case 'fadeInRight':
        fromVars = { opacity: 0, x: -this.parseDistance(distance) };
        toVars = { ...toVars, opacity: 1, x: 0 };
        break;

      case 'slideUp':
        fromVars = { y: this.parseDistance(distance) };
        toVars = { ...toVars, y: 0 };
        break;

      case 'slideDown':
        fromVars = { y: -this.parseDistance(distance) };
        toVars = { ...toVars, y: 0 };
        break;

      case 'slideLeft':
        fromVars = { x: this.parseDistance(distance) };
        toVars = { ...toVars, x: 0 };
        break;

      case 'slideRight':
        fromVars = { x: -this.parseDistance(distance) };
        toVars = { ...toVars, x: 0 };
        break;

      case 'scaleIn':
        fromVars = { scale: parseFloat(scale), opacity: 0 };
        toVars = { ...toVars, scale: 1, opacity: 1 };
        break;

      case 'scaleUp':
        fromVars = { scale: parseFloat(scale) };
        toVars = { ...toVars, scale: 1 };
        break;

      case 'scaleDown':
        fromVars = { scale: parseFloat(scale) };
        toVars = { ...toVars, scale: 1 };
        break;

      case 'rotate':
        fromVars = { rotation: 0 };
        toVars = { ...toVars, rotation: rotation };
        break;

      case 'rotateFast':
        fromVars = { rotation: 0 };
        toVars = { ...toVars, rotation: rotation * 2 };
        break;

      case 'bounce':
        fromVars = { y: 0 };
        toVars = { ...toVars, y: -this.parseDistance(distance), duration: duration / 2 };
        break;

      case 'elastic':
        fromVars = { scale: 1 };
        toVars = { ...toVars, scale: 1.2, ease: 'elastic.out(1, 0.5)' };
        break;

      case 'flip':
        fromVars = { rotationY: 90 };
        toVars = { ...toVars, rotationY: 0 };
        break;

      case 'flipX':
        fromVars = { rotationX: 90 };
        toVars = { ...toVars, rotationX: 0 };
        break;

      case 'pulse':
        fromVars = { scale: 1 };
        toVars = { ...toVars, scale: 1.1, ease: 'sine.inOut' };
        break;

      default:
        fromVars = { opacity: 0 };
        toVars = { ...toVars, opacity: 1 };
    }

    return { fromVars, toVars };
  }

  /**
   * Construye la configuración del tween según el tipo de animación (DEPRECATED - usar buildAnimationConfig)
   */
  buildTweenConfig(config) {
    const { type, duration, ease, scale, distance, rotation } = config;

    const tweenConfig = {
      duration,
      ease
    };

    switch (type) {
      case 'fadeIn':
        return {
          ...tweenConfig,
          opacity: 0,
          duration
        };

      case 'fadeInUp':
        return {
          ...tweenConfig,
          opacity: 0,
          y: this.parseDistance(distance),
          duration
        };

      case 'fadeInDown':
        return {
          ...tweenConfig,
          opacity: 0,
          y: -this.parseDistance(distance),
          duration
        };

      case 'fadeInLeft':
        return {
          ...tweenConfig,
          opacity: 0,
          x: this.parseDistance(distance),
          duration
        };

      case 'fadeInRight':
        return {
          ...tweenConfig,
          opacity: 0,
          x: -this.parseDistance(distance),
          duration
        };

      case 'slideUp':
        return {
          ...tweenConfig,
          y: this.parseDistance(distance),
          duration
        };

      case 'slideDown':
        return {
          ...tweenConfig,
          y: -this.parseDistance(distance),
          duration
        };

      case 'slideLeft':
        return {
          ...tweenConfig,
          x: this.parseDistance(distance),
          duration
        };

      case 'slideRight':
        return {
          ...tweenConfig,
          x: -this.parseDistance(distance),
          duration
        };

      case 'scaleIn':
        return {
          ...tweenConfig,
          scale: parseFloat(scale),
          opacity: 0,
          duration
        };

      case 'scaleUp':
        return {
          ...tweenConfig,
          scale: parseFloat(scale),
          duration
        };

      case 'scaleDown':
        return {
          ...tweenConfig,
          scale: parseFloat(scale),
          duration
        };

      case 'rotate':
        return {
          ...tweenConfig,
          rotation: rotation,
          duration
        };

      case 'rotateFast':
        return {
          ...tweenConfig,
          rotation: rotation * 2,
          duration
        };

      case 'bounce':
        return {
          ...tweenConfig,
          y: this.parseDistance(distance),
          ease: 'back.out',
          duration
        };

      case 'elastic':
        return {
          ...tweenConfig,
          opacity: 0,
          y: this.parseDistance(distance),
          ease: 'elastic.out(1, 0.5)',
          duration
        };

      case 'flip':
        return {
          ...tweenConfig,
          rotationY: 180,
          transformOrigin: 'center center',
          duration
        };

      case 'flipX':
        return {
          ...tweenConfig,
          rotationX: 180,
          transformOrigin: 'center center',
          duration
        };

      case 'pulse':
        return {
          ...tweenConfig,
          scale: [1, 1.1, 1],
          duration
        };

      default:
        return {
          ...tweenConfig,
          opacity: 0,
          duration
        };
    }
  }

  /**
   * Anima el efecto hover
   */
  playHoverAnimation(element, config, isEntering) {
    gsap.killTweensOf(element);

    if (isEntering) {
      const hoverConfig = this.buildHoverConfig(config);
      gsap.to(element, {
        ...hoverConfig,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      // Revertir a estado original
      gsap.to(element, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }

  /**
   * Construye configuración para hover effects
   */
  buildHoverConfig(config) {
    const { hoverEffect } = config;

    switch (hoverEffect) {
      case 'scale':
        return { scale: 1.05 };
      case 'brightness':
        return { filter: 'brightness(1.2)' };
      case 'shadow':
        return { boxShadow: '0 10px 30px rgba(0,0,0,0.3)' };
      case 'lift':
        return { y: -10, scale: 1.02 };
      case 'glow':
        return { 
          filter: 'brightness(1.1)',
          boxShadow: '0 0 20px rgba(255,255,255,0.3)'
        };
      default:
        return { scale: 1.05 };
    }
  }

  /**
   * Parsea distancia (soporta px, %, etc)
   */
  parseDistance(distance) {
    if (typeof distance === 'number') return distance;
    return parseInt(distance) || 30;
  }

  /**
   * Obtiene clave única para elemento
   */
  getElementKey(element) {
    return element.id || Math.random().toString(36).substr(2, 9);
  }

  /**
   * Maneja el resize de ventana
   */
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    // Si cambió entre mobile/desktop, reinitializar
    if (wasMobile !== this.isMobile) {
      this.cleanup();
      this.init();
    }
  }

  /**
   * Observa cambios en el DOM
   */
  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              const elements = node.querySelectorAll?.('[data-animate-type]') || [];
              elements.forEach((el) => {
                const config = this.parseAnimationConfig(el);
                if (config && this.isMobile && !config.mobileEnabled) return;
                if (config) this.setupAnimation(el, config);
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Limpia todas las animaciones
   */
  cleanup() {
    // Kill all GSAP tweens and timelines
    gsap.globalTimeline.clear();
    gsap.globalTimeline.kill();
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.hoverObservers.forEach(observer => observer.disconnect?.());
    this.clickObservers.forEach(observer => observer.disconnect?.());
    this.animations.clear();
    this.initialized = false;
  }

  /**
   * Anima texto usando SplitText
   */
  animateWithSplitText(element, config, useScrollTrigger = false) {
    if (!window.SplitText) {
      console.warn('SplitText plugin not loaded');
      return;
    }

    // Registrar SplitText si no está registrado
    if (!gsap.plugins.SplitText) {
      gsap.registerPlugin(window.SplitText);
    }

    // Determinar qué dividir
    const splitType = config.splitType === 'chars' ? 'chars' : 'words';
    
    // Crear el split
    const split = new SplitText(element, {
      type: splitType,
      charsClass: 'char-anim',
      wordsClass: 'word-anim'
    });

    // Obtener los elementos a animar
    const targets = splitType === 'chars' ? split.chars : split.words;

    if (!targets || targets.length === 0) {
      console.warn('No text elements to animate');
      return;
    }

    // Construir la animación
    const { fromVars, toVars } = this.buildAnimationConfig(config);

    // Agregar configuración de stagger
    const staggerConfig = {
      ...toVars,
      delay: config.delay,
      stagger: {
        each: config.splitStagger,
        from: 'start'
      }
    };

    if (useScrollTrigger) {
      // Animación con ScrollTrigger
      staggerConfig.scrollTrigger = {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
        markers: false
      };
    } else {
      // Animación inmediata con repeat si está configurado
      if (config.repeat > 0) {
        staggerConfig.repeat = config.repeat;
        staggerConfig.repeatDelay = config.repeatDelay;
        staggerConfig.yoyo = config.yoyo;
      }
    }

    // Aplicar la animación
    gsap.fromTo(targets, fromVars, staggerConfig);
  }
}

// Inicialización global
document.addEventListener('DOMContentLoaded', () => {
  window.gsapAnimationManager = new GSAPAnimationManager();
  window.gsapAnimationManager.init();
});

// Re-inicializar si el contenido cambia dinámicamente
window.addEventListener('load', () => {
  if (window.gsapAnimationManager) {
    window.gsapAnimationManager.findAnimatedElements();
  }
});

// Expose to window for external access
window.GSAPAnimationManager = GSAPAnimationManager;

// Export for module usage
export default GSAPAnimationManager;
