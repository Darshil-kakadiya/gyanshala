/**
 * Shared Google Maps Loader
 * Ensures the Google Maps API is loaded exactly once, caches the promise,
 * and parses authentication/billing errors for production diagnostics.
 */

let googleMapsPromise = null;

/**
 * Maps Google Maps authentication failure codes to detailed error messages.
 */
function parseGoogleMapsError(errStr) {
    if (errStr.includes('ApiNotActivatedMapError')) {
        return 'Maps JavaScript API Disabled. Please enable it in the Google Cloud Console.';
    } else if (errStr.includes('InvalidKeyMapError')) {
        return 'Invalid API Key. The provided API key is invalid or not found.';
    } else if (errStr.includes('RefererNotAllowedMapError')) {
        return 'Referrer Not Allowed. The current URL is not allowed by the API key restrictions.';
    } else if (errStr.includes('BillingNotEnabledMapError')) {
        return 'Billing Disabled. You must enable Billing on the Google Cloud Project.';
    } else if (errStr.includes('MissingKeyMapError')) {
        return 'Missing API Key. The API key is missing from the request.';
    } else if (errStr.includes('OverQuotaMapError')) {
        return 'Quota Exceeded. The API key has exceeded its usage limits.';
    }
    return 'An unknown Google Maps authentication error occurred.';
}

export function loadGoogleMaps(apiKey) {
    // Return cached promise if already loading or loaded
    if (googleMapsPromise) {
        return googleMapsPromise;
    }

    if (!apiKey) {
        const errorMsg = 'Missing API Key: The Google Maps API key was not provided to the loader.';
        console.error(errorMsg);
        return Promise.reject(new Error(errorMsg));
    }

    googleMapsPromise = new Promise((resolve, reject) => {
        // If it's already loaded globally
        if (window.google && window.google.maps) {
            console.log('[Google Maps Loader] API already loaded globally.');
            resolve(window.google.maps);
            return;
        }

        console.log('[Google Maps Loader] Injecting Google Maps script...');

        // Setup the authentication failure global callback required by Google Maps API
        window.gm_authFailure = function () {
            console.error('[Google Maps Loader] Authentication or Billing failure detected (gm_authFailure triggered).');
            // We can't know the exact error synchronously in the callback without parsing the console,
            // but we can reject the promise.
            // Often, Google logs the specific error right before this.
            reject(new Error('Google Maps Authentication Failure: Check console for exact details (e.g., Billing disabled, Invalid Key).'));
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=__googleMapsInitCallback&v=weekly`;
        script.async = true;
        script.defer = true;
        script.id = 'google-maps-script'; // Prevent duplicate injection manually just in case

        // Global callback for successful load
        window.__googleMapsInitCallback = function () {
            console.log('[Google Maps Loader] Google Maps loaded successfully.');
            delete window.__googleMapsInitCallback;
            resolve(window.google.maps);
        };

        script.onerror = (error) => {
            console.error('[Google Maps Loader] Network Failure: Script failed to load.', error);
            reject(new Error('Network Failure: The Google Maps script failed to load.'));
        };

        // Inject script
        if (!document.getElementById('google-maps-script')) {
            document.head.appendChild(script);
        } else {
            console.warn('[Google Maps Loader] Script tag already exists in DOM.');
        }

        // Add a timeout for initialization just in case
        setTimeout(() => {
            if (!window.google || !window.google.maps) {
                console.error('[Google Maps Loader] Initialization Timeout.');
                reject(new Error('Initialization Timeout: Google Maps failed to initialize within 15 seconds.'));
            }
        }, 15000);
    });

    // To intercept console.error for specific MapErrors (since gm_authFailure doesn't provide the exact string)
    const originalConsoleError = console.error;
    console.error = function (...args) {
        if (typeof args[0] === 'string' && args[0].includes('Google Maps JavaScript API error:')) {
            const parsedError = parseGoogleMapsError(args[0]);
            console.error('[Google Maps Loader] Diagnosed Error:', parsedError);
            
            // Dispatch a custom event so the UI can catch it if needed
            window.dispatchEvent(new CustomEvent('GoogleMapsError', { detail: parsedError }));
        }
        originalConsoleError.apply(console, args);
    };

    return googleMapsPromise;
}

export function showGoogleMapsError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:400px; background:#ffebee; color:#c62828; padding:20px; text-align:center; border-radius:12px;">
                <span class="material-symbols-rounded" style="font-size:48px; margin-bottom:10px;">error</span>
                <h3 style="margin-bottom:10px;">Unable to Load Map</h3>
                <p style="font-weight:bold;">${message}</p>
                <p style="font-size:0.9em; margin-top:10px;">Please check the browser console for more details.</p>
            </div>
        `;
    }
}
