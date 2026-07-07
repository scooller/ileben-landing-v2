/**
 * Async font loading for better performance
 * Loads Font Awesome after critical resources
 */

export function initFontLoader() {
  // Load Font Awesome CSS asynchronously after fonts are ready
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadFontAwesome();
    }, { timeout: 2000 });
  } else {
    // Fallback: load after short delay
    setTimeout(loadFontAwesome, 1000);
  }
}

function loadFontAwesome() {
  // Check if already loading or loaded
  if (document.querySelector('link[href*="font-awesome"][href*="all.min.css"]')) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
  link.crossOrigin = 'anonymous';
  link.onload = () => {
    document.documentElement.classList.add('fa-loaded');
  };
  link.onerror = () => {
    console.warn('Font Awesome failed to load');
  };
  document.head.appendChild(link);
}
