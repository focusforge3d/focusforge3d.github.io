// Google Sheets Configuration
// To use this, you need to:
// 1. Create a Google Sheet with the following columns: Name, Description, Tags, Price, Image URL, Etsy Link, STL Download Link
// 2. Publish the sheet as CSV: File > Share > Publish to web > Select sheet > CSV format
// 3. Copy the published URL and replace the SHEET_URL below

const SHEETS_CONFIG = {
    // Replace with your published Google Sheet CSV URL
    // Example: https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={SHEET_GID}
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSU28a-LrI9S0AxK7jomoliIvm0E8DSETYbCLLnJ3HkdXbxlmUgW3QORwUHzTSFekxR3yEettl2O1D7/pub?output=csv',

    // Column indices (0-based) - adjust if your sheet layout is different
    COLUMNS: {
        name: 0,
        description: 1,
        tags: 2,
        price: 3,
        imageUrl: 4,
        etsy: 5,
        stl: 6,
        statsRating: 8,      // Column I
        statsCompatibility: 9, // Column J
        statsMaterial: 10     // Column K
    }
};

// Function to fetch and parse CSV from Google Sheets
async function fetchProductsFromSheets() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

        const fetchUrl = SHEETS_CONFIG.SHEET_URL + (SHEETS_CONFIG.SHEET_URL.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
        const response = await fetch(fetchUrl, { signal: controller.signal, cache: 'no-store' });
        clearTimeout(timeoutId);

        const csvText = await response.text();

        // Extract stats from first data row if available
        const lines = csvText.trim().split('\n');
        if (lines.length > 1) {
            const firstRowCells = parseCSVLine(lines[1]);
            updateStatsUI(firstRowCells);
        }

        const products = parseCSV(csvText);
        return products;
    } catch (error) {
        console.error('Error fetching products from Google Sheets:', error);
        return [];
    }
}

// Simple CSV parser
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const products = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Simple CSV parsing (handles basic cases)
        const cells = parseCSVLine(line);

        if (cells.length > 0 && cells[SHEETS_CONFIG.COLUMNS.name] && cells[SHEETS_CONFIG.COLUMNS.name].trim() !== '') {
            let finalImage = 'assets/images/bahtinov.png';
            const rawImage = cells[SHEETS_CONFIG.COLUMNS.imageUrl];
            if (rawImage && rawImage.trim() !== '') {
                const img = rawImage.trim();
                if (img.startsWith('http') || img.startsWith('assets/')) {
                    finalImage = img;
                } else {
                    finalImage = `assets/products/${img}`;
                }
            }

            const product = {
                name: cells[SHEETS_CONFIG.COLUMNS.name] || 'Product',
                description: cells[SHEETS_CONFIG.COLUMNS.description] || 'High-quality 3D printed accessory for your astrophotography rig.',
                tags: (cells[SHEETS_CONFIG.COLUMNS.tags] || '').split(',').map(t => t.trim()).filter(t => t),
                price: cells[SHEETS_CONFIG.COLUMNS.price] || '€0.00',
                imageUrl: finalImage,
                etsy: cells[SHEETS_CONFIG.COLUMNS.etsy] || 'https://www.etsy.com',
                stl: cells[SHEETS_CONFIG.COLUMNS.stl] || '#'
            };
            products.push(product);
        }
    }

    return products;
}

// CSV line parser that handles quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
}

function updateStatsUI(cells) {
    const reviewsEl = document.getElementById('stat-reviews');
    const compatibilityEl = document.getElementById('stat-compatibility');
    const materialEl = document.getElementById('stat-material');

    if (reviewsEl && cells[SHEETS_CONFIG.COLUMNS.statsRating]) {
        reviewsEl.textContent = cells[SHEETS_CONFIG.COLUMNS.statsRating];
    }
    if (compatibilityEl && cells[SHEETS_CONFIG.COLUMNS.statsCompatibility]) {
        compatibilityEl.textContent = cells[SHEETS_CONFIG.COLUMNS.statsCompatibility];
    }
    if (materialEl && cells[SHEETS_CONFIG.COLUMNS.statsMaterial]) {
        materialEl.textContent = cells[SHEETS_CONFIG.COLUMNS.statsMaterial];
    }
}
