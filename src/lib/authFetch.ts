/**
 * Authenticated fetch wrapper.
 * Automatically attaches the JWT token from localStorage to every request.
 */

// Determine API base URL - use full URL if not in development mode or if proxy isn't available
function getApiBaseUrl(): string {
    // In development with Vite proxy, use relative URLs
    if (import.meta.env.DEV) {
        return '';
    }
    // In production, use absolute URL to backend
    return 'http://localhost:3001';
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('token');
    
    // Build full URL if needed
    const fullUrl = url.startsWith('http') ? url : `${getApiBaseUrl()}${url}`;

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Only set Content-Type for non-FormData bodies
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    const response = await fetch(fullUrl, {
        ...options,
        headers,
    });

    // Automatically handle expired or invalid tokens globally
    if (response.status === 401) {
        // Only clear if we actually had a token that is now rejected
        if (token) {
            console.warn("API returned 401 Unauthorized. Clearing session.");
            localStorage.removeItem('token');
            // Dispatch a custom event so AuthContext or App can react (e.g. redirect to login)
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
    }

    return response;
}

