// Configuration for PDF Guides
// To use this, you need to:
// 1. Create a Google Sheet with the following columns: Title, Description, PDF Link, Image Link
// 2. Publish the sheet as CSV: File > Share > Publish to web > Select sheet > CSV format
// 3. Copy the published URL and replace the SHEET_URL below

const GUIDES_CONFIG = {
    // Replace with your published Google Sheet CSV URL for Guides
    // Example: https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
    // Leave empty ('') until you have created your Guides specific Google Sheet.
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRlP69xpW-GM6RQfAZ5Oa_VUXPStQ6G4JldqpGAqONe6grFX6AYNNGwLSUa1iQz9mOiDM0cglP_io0I/pub?output=csv',

    // Column indices (0-based) - adjust if your sheet layout is different
    COLUMNS: {
        title: 0,
        description: 1,
        pdfUrl: 2,
        imageUrl: 3
    },

    // Fallback/Local list of guides (used if Google Sheet is empty or fails).
    // Example: { title: "Setup Guide", description: "How to use", pdfUrl: "assets/guides/setup.pdf", imageUrl: "assets/images/guide.png" }
    LOCAL_GUIDES: []
};
