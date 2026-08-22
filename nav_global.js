// Global EVision India Cross-Module Router & Interactivity Helper

(function() {
    console.log("EVision India Global Navigation Engine Initialized");

    const moduleKeyMap = {
        'fleet metrics': 'exec',
        'executive ai': 'exec',
        'map': 'gis',
        'gis map': 'gis',
        'explore map': 'gis',
        'gis dashboard': 'gis',
        'gis satellite hud': 'gis',
        'gis satellite intelligence': 'gis',
        'infrastructure': 'gis',
        'find best location': 'site',
        'site analysis': 'site',
        'site ai': 'site',
        'ai site analysis': 'site',
        'ai site feasibility': 'site',
        'evaluate station site': 'site',
        'ev demand': 'forecast',
        'demand forecasting': 'forecast',
        'forecasting': 'forecast',
        'view forecast models': 'forecast',
        'grid analysis': 'forecast',
        'what-if simulator': 'simulator',
        'simulator': 'simulator',
        'what-if solar simulator': 'simulator',
        'run roi simulation': 'simulator',
        'cost calculator': 'simulator',
        'admin': 'admin',
        'admin panel': 'admin',
        'admin command center': 'admin',
        'admin gateway': 'admin',
        'settings': 'admin',
        'auth / login': 'auth',
        'sign in': 'auth',
        'login': 'auth',
        'authentication': 'auth',
        'register': 'auth&mode=register',
        'register project': 'auth&mode=register',
        '+ register project': 'auth&mode=register',
        'register station': 'auth&mode=register',
        '+ register station': 'auth&mode=register',
        '+ register': 'auth&mode=register'
    };

    function isCurrentInSubfolder() {
        const p = window.location.pathname.toLowerCase();
        return p.includes('/site-planner/') || p.includes('\\site-planner\\') || p.includes('evision_india_');
    }

    function resolvePath(targetRel) {
        if (!targetRel) return targetRel;
        const clean = targetRel.startsWith('/') ? targetRel.substring(1) : targetRel;
        if (isCurrentInSubfolder()) {
            return '../' + clean;
        }
        return clean;
    }

    function navigateTo(key) {
        const normKey = key.toLowerCase().trim();

        if (normKey === 'home' || normKey === 'landing' || normKey === 'landing page' || normKey === 'landing overview') {
            const target = resolvePath('landing.html');
            if (window.self !== window.top) {
                window.top.location.href = target;
            } else {
                window.location.href = target;
            }
            return true;
        }

        if (normKey === 'dashboard' || normKey === 'site planner' || normKey === 'site-planner' || normKey === 'planner' || normKey === 'ai site planner' || normKey === 'ai site feasibility' || normKey === 'site analysis' || normKey === 'site ai' || normKey === 'evaluate station site' || normKey === 'find best location') {
            const target = resolvePath('site-planner/dashboard.html');
            if (window.self !== window.top) {
                window.top.location.href = target;
            } else {
                window.location.href = target;
            }
            return true;
        }

        if (normKey === '3d' || normKey === '3d vision' || normKey === '3d cad' || normKey === '3d spatial') {
            const target = resolvePath('site-planner/3dvision.html');
            if (window.self !== window.top) {
                window.top.location.href = target;
            } else {
                window.location.href = target;
            }
            return true;
        }

        if (normKey === 'research' || normKey === 'research with ai' || normKey === 'ai research' || normKey === 'location recommendation' || normKey === 'ai location recommendation') {
            const target = resolvePath('research-ai.html');
            if (window.self !== window.top) {
                window.top.location.href = target;
            } else {
                window.location.href = target;
            }
            return true;
        }

        const modId = moduleKeyMap[normKey];
        if (modId) {
            const [modName, extra] = modId.split('&');
            if (modName === 'auth') {
                const query = extra ? `?${extra}` : '';
                const targetUrl = resolvePath(`register.html${query}`);
                if (window.self !== window.top) {
                    window.top.location.href = targetUrl;
                } else {
                    window.location.href = targetUrl;
                }
                return true;
            }
            const targetUrl = resolvePath('site-planner/dashboard.html');
            if (window.self !== window.top) {
                window.top.location.href = targetUrl;
            } else {
                window.location.href = targetUrl;
            }
            return true;
        }

        return false;
    }

    // Expose globally
    window.EVisionNav = {
        navigateTo: navigateTo,
        resolvePath: resolvePath
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('a, button').forEach(el => {
            const explicitRoute = el.getAttribute('data-route');
            const title = el.getAttribute('title') || '';
            const text = el.innerText ? el.innerText.replace(/[^a-zA-Z0-9\+\s]/g, ' ').trim().toLowerCase() : '';
            
            const candidateKeys = [explicitRoute, title.toLowerCase().trim(), text].filter(Boolean);
            
            for (const key of candidateKeys) {
                if (moduleKeyMap[key] || ['home','landing','landing page','command center','command','dashboard'].includes(key)) {
                    el.style.cursor = 'pointer';
                    el.addEventListener('click', (e) => {
                        const href = el.getAttribute('href');
                        if (href && (href.startsWith('index.html') || href.startsWith('../index.html') || href.startsWith('landing.html') || href.startsWith('../landing.html'))) {
                            // Handled by direct link unless default action needed
                            return;
                        }
                        if (el.hasAttribute('onclick') && !el.getAttribute('onclick').includes('window.location')) {
                            return;
                        }
                        e.preventDefault();
                        navigateTo(key);
                    });
                    break;
                }
            }
        });
    });
})();
