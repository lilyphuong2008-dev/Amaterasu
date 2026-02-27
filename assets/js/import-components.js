(function() {
    const script = document.currentScript;
    const queryString = script.src.split('?')[1];
    const urlParams = new URLSearchParams(queryString);

    // Get the comma-separated list (e.g., "navbar,footer")
    const componentsParam = urlParams.get('components');
    const loadCss = urlParams.get('css') !== 'false';  // Optional: css=false will disable CSS loading
    const loadJs = urlParams.get('js') !== 'false';    // Optional: js=false will disable JS loading

    if (!componentsParam) { 
        console.error('import.js: No "components" parameter specified.');
        return;
    }

    // Get baseUrl (assets/)
    const components = componentsParam.split(',').map(item => item.trim());
    const scriptPath = script.src.split('?')[0];
    const pathSegments = scriptPath.split('/');
    pathSegments.pop();
    pathSegments.pop();
    const baseUrl = pathSegments.join('/');

    components.forEach(fileName => {
        const htmlPath = `${baseUrl}/html/${fileName}.html`;
        const cssPath = `${baseUrl}/css/${fileName}.css`;
        const jsPath = `${baseUrl}/js/${fileName}.js`;
        const targetElement = document.getElementById(fileName);

        if (!targetElement) {
            console.warn(`import.js: Element with id="${fileName}" not found.`);
            return;
        }

        // 1. Inject CSS if enabled and the file exists
        if (loadCss && !document.querySelector(`link[href="${cssPath}"]`)) {
            fetch(cssPath)
                .then(response => {
                    if (response.ok) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = cssPath;
                        document.head.appendChild(link);
                    } else {
                        console.warn(`import.js: CSS file "${cssPath}" not found.`);
                    }
                })
                .catch(error => {
                    console.error(`import.js: Error fetching CSS file "${cssPath}":`, error);
                });
        }

        // 2. Inject JS if enabled and the file exists
        if (loadJs && !document.querySelector(`script[src="${jsPath}"]`)) {
            fetch(jsPath)
                .then(response => {
                    if (response.ok) {
                        const script = document.createElement('script');
                        script.src = jsPath;
                        document.head.appendChild(script);
                    } else {
                        console.warn(`import.js: JS file "${jsPath}" not found.`);
                    }
                })
                .catch(error => {
                    console.error(`import.js: Error fetching JS file "${jsPath}":`, error);
                });
        }

        // 3. Load HTML with Caching Strategy
        const cacheKey = `cached_html_${fileName}`;
        const cachedContent = sessionStorage.getItem(cacheKey);

        if (cachedContent) {
            // A. Serve from Cache (Instant, no flicker)
            targetElement.innerHTML = cachedContent;
            console.log(`Loaded ${fileName} from cache.`);
        } else {
            // B. Fetch from Network
            fetch(htmlPath)
                .then(response => {
                    if (!response.ok) throw new Error(response.statusText);
                    return response.text();
                })
                .then(html => {
                    // Inject HTML
                    targetElement.innerHTML = html;
                    // Save to Session Storage for next time
                    sessionStorage.setItem(cacheKey, html);
                })
                .catch(error => {
                    console.error(`Error loading ${fileName}:`, error);
                });
        }
    });
})();
