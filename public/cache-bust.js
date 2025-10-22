// Client-side cache busting script for cached 404s
// This script helps users who have cached 404 responses

(function() {
  'use strict';
  
  // Check if we're on a 404 page or if the page failed to load
  if (document.title.includes('404') || 
      document.title.includes('Not Found') ||
      window.location.pathname !== '/' && !document.body.innerHTML.trim()) {
    
    // Try to reload with cache-busting parameters
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    // Add cache-busting parameter if not already present
    if (!params.has('v') && !params.has('cache_bust') && !params.has('timestamp')) {
      params.set('v', Date.now().toString());
      url.search = params.toString();
      
      console.log('Cache-busting 404, redirecting to:', url.toString());
      window.location.replace(url.toString());
    }
  }
  
  // Add a global function to manually clear cache
  window.clearLinkCache = function() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set('cache_bust', Date.now().toString());
    url.search = params.toString();
    window.location.replace(url.toString());
  };
  
  // Add a meta tag to prevent caching
  const metaNoCache = document.createElement('meta');
  metaNoCache.setAttribute('http-equiv', 'Cache-Control');
  metaNoCache.setAttribute('content', 'no-cache, no-store, must-revalidate');
  document.head.appendChild(metaNoCache);
  
  const metaPragma = document.createElement('meta');
  metaPragma.setAttribute('http-equiv', 'Pragma');
  metaPragma.setAttribute('content', 'no-cache');
  document.head.appendChild(metaPragma);
  
  const metaExpires = document.createElement('meta');
  metaExpires.setAttribute('http-equiv', 'Expires');
  metaExpires.setAttribute('content', '0');
  document.head.appendChild(metaExpires);
})();
