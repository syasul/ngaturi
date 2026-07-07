export function initSentry() {
    if (typeof window === 'undefined') return;

    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (!sentryDsn) {
        // Development local error capture fallback
        window.addEventListener('error', (event) => {
            console.error(
                '[Web Error Boundary Log]:',
                event.error || event.message,
            );
        });
        return;
    }

    // Load Sentry bundle dynamically from CDN to keep initial bundle size lightweight
    const script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/7.100.0/bundle.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
        const sentryInstance = (window as any).Sentry;
        if (sentryInstance) {
            sentryInstance.init({
                dsn: sentryDsn,
                tracesSampleRate: 0.1,
                replaysSessionSampleRate: 0.1,
            });
            console.log(
                `[Sentry] Error tracking successfully initialized with DSN.`,
            );
        }
    };
    document.head.appendChild(script);
}
