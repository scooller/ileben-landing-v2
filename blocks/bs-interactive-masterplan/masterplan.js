/**
 * Frontend JS for Interactive Masterplan
 */

export function initInteractiveMasterplan(PopoverClass) {
  const hotspots = document.querySelectorAll('.bs-hotspot-btn');
  if (!hotspots.length || !PopoverClass) return;

  const popovers = [];

  // Inicializar popovers de Bootstrap en modo manual
  hotspots.forEach(btn => {
    const popover = new PopoverClass(btn, {
      container: 'body',
      trigger: 'manual', // Controlado manualmente
      html: true,
      sanitize: false // Permitir nuestro botón cerrar HTML personalizado
    });
    popovers.push({ btn, popover });

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Cerrar los demás popovers
      popovers.forEach(p => {
        if (p.btn !== btn) {
          p.popover.hide();
        }
      });
      
      // Mostrar/ocultar el actual
      popover.toggle();
    });
  });

  // Cerrar popovers al hacer click fuera o en el boton cerrar
  document.addEventListener('click', function(e) {
    if (e.target.closest('.bs-hotspot-close')) {
      // Clicked on close button inside popover
      popovers.forEach(p => p.popover.hide());
      return;
    }

    if (!e.target.closest('.bs-hotspot-btn') && !e.target.closest('.popover')) {
      popovers.forEach(p => p.popover.hide());
    }
  });
}
