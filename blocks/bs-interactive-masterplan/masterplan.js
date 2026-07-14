/**
 * Frontend JS for Interactive Masterplan
 */

export function initInteractiveMasterplan(PopoverClass) {
  const hotspots = document.querySelectorAll('.bs-hotspot-btn');
  if (!hotspots.length || !PopoverClass) return;

  const popovers = [];

  hotspots.forEach(btn => {
    const popover = new PopoverClass(btn, {
      container: 'body',
      trigger: 'manual',
      html: true,
      sanitize: false,
      template: '<div class="popover toast show p-0" role="tooltip"><div class="popover-arrow"></div><div class="popover-body p-0"></div></div>'
    });
    popovers.push({ btn, popover });

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      popovers.forEach(p => {
        if (p.btn !== btn) {
          p.popover.hide();
        }
      });
      
      popover.toggle();
    });
  });

  document.addEventListener('click', function(e) {
    if (e.target.closest('.bs-hotspot-close')) {
      popovers.forEach(p => p.popover.hide());
      return;
    }

    if (!e.target.closest('.bs-hotspot-btn') && !e.target.closest('.popover')) {
      popovers.forEach(p => p.popover.hide());
    }
  });

  // GSAP Animation: only for hotspots that have a pulse animation enabled
  if (window.gsap) {
    const animatedHotspots = Array.from(hotspots).filter(
      btn => !btn.classList.contains('bs-hotspot-pulse-none')
    );
    if (animatedHotspots.length) {
      window.gsap.fromTo(animatedHotspots, 
        { }, 
        { duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: { each: 0.15, from: "random" } }
      );
    }
  }
}
