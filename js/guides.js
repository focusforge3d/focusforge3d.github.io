document.addEventListener('DOMContentLoaded', () => {
    const guidesGrid = document.getElementById('guides-grid');
    if (!guidesGrid) return;

    loadGuides();

    async function loadGuides() {
        guidesGrid.innerHTML = '<div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;"><i class="fas fa-circle-notch fa-spin"></i> Loading guides...</div>';

        let guides = [];

        // Check if there's a Google Sheet configured
        if (typeof GUIDES_CONFIG !== 'undefined' && GUIDES_CONFIG.SHEET_URL) {
            try {
                const csvText = await fetchWithCORSFallback(GUIDES_CONFIG.SHEET_URL);
                console.log('[Guides] CSV fetched successfully, length:', csvText.length);
                guides = parseGuidesCSV(csvText);
                console.log('[Guides] Parsed guides:', guides.length);
            } catch (e) {
                console.warn('[Guides] All fetch methods failed:', e.message, '- Falling back to local.');
                guides = (typeof GUIDES_CONFIG !== 'undefined' && GUIDES_CONFIG.LOCAL_GUIDES) ? GUIDES_CONFIG.LOCAL_GUIDES : [];
            }
        } else if (typeof GUIDES_CONFIG !== 'undefined' && GUIDES_CONFIG.LOCAL_GUIDES) {
            guides = GUIDES_CONFIG.LOCAL_GUIDES;
        }

        // Render after a short delay for smooth transition
        setTimeout(() => {
            renderGuides(guides);
        }, 300);
    }

    // Fetch with automatic CORS proxy fallback (works from file:// protocol)
    async function fetchWithCORSFallback(url) {
        const bustUrl = url + (url.includes('?') ? '&' : '?') + 't=' + new Date().getTime();

        // Try direct fetch first (works when served via HTTP)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const response = await fetch(bustUrl, { signal: controller.signal, cache: 'no-store' });
            clearTimeout(timeoutId);
            return await response.text();
        } catch (directError) {
            console.warn('[Guides] Direct fetch failed (likely CORS from file://), trying proxy...');
        }

        // Fallback: use CORS proxy (needed for file:// protocol)
        const proxies = [
            'https://corsproxy.io/?',
            'https://api.allorigins.win/raw?url='
        ];

        for (const proxy of proxies) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                const proxyUrl = proxy + encodeURIComponent(bustUrl);
                const response = await fetch(proxyUrl, { signal: controller.signal });
                clearTimeout(timeoutId);
                const text = await response.text();
                console.log('[Guides] Fetched via proxy:', proxy);
                return text;
            } catch (proxyError) {
                console.warn('[Guides] Proxy failed:', proxy, proxyError.message);
            }
        }

        throw new Error('All fetch methods failed');
    }

    function parseGuidesCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const guidesList = [];

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;

            // Use parseCSVLine from sheets-config.js if available, otherwise simple split
            let cells;
            if (typeof parseCSVLine === 'function') {
                cells = parseCSVLine(line);
            } else {
                cells = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            }

            const titleCol = typeof GUIDES_CONFIG !== 'undefined' && GUIDES_CONFIG.COLUMNS ? GUIDES_CONFIG.COLUMNS.title : 0;
            const descCol = typeof GUIDES_CONFIG !== 'undefined' && GUIDES_CONFIG.COLUMNS ? GUIDES_CONFIG.COLUMNS.description : 1;
            const pdfCol = typeof GUIDES_CONFIG !== 'undefined' && GUIDES_CONFIG.COLUMNS ? GUIDES_CONFIG.COLUMNS.pdfUrl : 2;
            const imgCol = typeof GUIDES_CONFIG !== 'undefined' && GUIDES_CONFIG.COLUMNS ? GUIDES_CONFIG.COLUMNS.imageUrl : 3;

            if (cells.length > titleCol) {
                guidesList.push({
                    title: cells[titleCol] || 'Untitled Guide',
                    description: cells[descCol] || '',
                    pdfUrl: cells[pdfCol] || '#',
                    imageUrl: cells[imgCol] || ''
                });
            }
        }
        return guidesList;
    }

    function renderGuides(guides) {
        guidesGrid.innerHTML = '';

        if (!guides || guides.length === 0) {
            guidesGrid.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 60px 20px; grid-column: 1 / -1; background: var(--color-surface); border-radius: 8px; border: 1px solid rgba(155, 143, 208, 0.2); animation: fade-in 0.5s ease-out;">
                    <i class="fas fa-file-pdf" style="font-size: 3.5rem; color: var(--color-muted); margin-bottom: 20px; display: block;"></i>
                    <h3 style="color: var(--color-white); font-family: var(--font-display); margin-bottom: 12px;">No Guides Currently Available</h3>
                    <p style="color: var(--color-muted); max-width: 400px; margin: 0 auto;">We are working on creating comprehensive guides for our gear. Please check back later!</p>
                </div>
            `;
            return;
        }

        guides.forEach((guide, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animation = `slideUp 0.6s ease-out ${index * 0.1}s both`;
            
            card.innerHTML = `
                <div class="product-info" style="padding-top: 20px;">
                    <h3>${guide.title}</h3>
                    <div class="product-actions" style="margin-top: 20px;">
                        <a href="${guide.pdfUrl}" class="btn btn-primary" target="_blank" rel="noopener" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;">
                            <i class="fas fa-download"></i> View PDF Guide
                        </a>
                    </div>
                </div>
            `;
            guidesGrid.appendChild(card);
        });
    }
});
