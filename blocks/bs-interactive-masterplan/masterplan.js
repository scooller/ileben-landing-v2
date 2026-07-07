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

  // GSAP Animation: Aparecer y desaparecer (Pulse effect)
  if (window.gsap) {
    window.gsap.fromTo(hotspots, 
      { opacity: 0.2 }, 
      { opacity: 1, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: { each: 0.15, from: "random" } }
    );
  }
}
