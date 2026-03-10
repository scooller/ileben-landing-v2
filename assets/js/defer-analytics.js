/**
 * Defer third-party analytics scripts to improve page load performance
 * Load GTM, tracking pixels, and analytics after page idle
 */

export function deferAnalytics() {
  // Wait for page to be interactive (after load event)
  if (document.readyState === 'complete') {
    loadAnalyticsAsync();
  } else {
    window.addEventListener('load', loadAnalyticsAsync, { once: true });
  }
}

function loadAnalyticsAsync() {
  // Use requestIdleCallback if available, otherwise fallback to setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      triggerDeferredScripts();
    }, { timeout: 3000 });
  } else {
    // Fallback: wait 3 seconds after load
    setTimeout(triggerDeferredScripts, 3000);
  }
}

function triggerDeferredScripts() {
  // Trigger any Google Tag Manager mutations or events
  if (window.dataLayer) {
    window.dataLayer.push({ 'event': 'gtm.js', 'gtm.start': new Date().getTime() });
  }
  
  // Re-initialize any tracking that was held back
  if (window.gtag) {
    // Any additional gtag calls can go here
  }
}
