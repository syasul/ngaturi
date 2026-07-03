export function initAnalytics() {
  // If running in Server Side Rendering or test environment
  if (typeof window === 'undefined') return

  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN
  const gaId = import.meta.env.VITE_GA_ID

  // Plausible Integration (privacy-friendly, recommended)
  if (plausibleDomain) {
    const script = document.createElement('script')
    script.defer = true
    script.setAttribute('data-domain', plausibleDomain)
    script.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(script)
    console.log(`[Analytics] Plausible initialized for domain: ${plausibleDomain}`)
  }

  // Google Analytics 4 Integration
  if (gaId) {
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', { page_path: window.location.pathname });
    `
    document.head.appendChild(script2)
    console.log(`[Analytics] Google Analytics 4 initialized with ID: ${gaId}`)
  }
}
