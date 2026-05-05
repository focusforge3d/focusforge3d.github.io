# FocusForge - Google Sheets Integration Setup Guide

This guide will help you set up dynamic product management using Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "FocusForge Products"

## Step 2: Set Up the Spreadsheet Structure

Create the following columns in your Google Sheet (Row 1 should be headers):

| Column | Header | Example |
|--------|--------|---------|
| A | Name | Bahtinov Mask 72ED |
| B | Description | Precision-engineered Bahtinov mask for perfect focus on your Sky-Watcher 72ED refractor. |
| C | Tags | Sky-Watcher,72ED,EQ5 |
| D | Price | €12.99 |
| E | Image URL | https://example.com/image.png |
| F | Etsy Link | https://www.etsy.com/listing/123456 |
| G | STL Download Link | https://example.com/model.stl |

### Notes:
- **Tags**: Separate multiple tags with commas (e.g., "Sky-Watcher,72ED,EQ5")
- **Image URL**: Use full URLs to images (can be from your own server or cloud storage)
- **Etsy Link**: Full URL to your Etsy product listing
- **STL Download Link**: URL to download the 3D model file

## Step 3: Add Your Products

Fill in your products starting from Row 2. Example:

```
Name                    | Description                              | Tags                | Price  | Image URL              | Etsy Link                    | STL Download Link
Bahtinov Mask 72ED      | Precision-engineered Bahtinov mask...   | Sky-Watcher,72ED    | €12.99 | https://...image1.png | https://www.etsy.com/...     | https://...model1.stl
Dust Cap Set            | Universal dust caps for eyepieces...    | Universal,1.25",2"  | €8.50  | https://...image2.png | https://www.etsy.com/...     | https://...model2.stl
Cable Organizer Pro     | Keep your mount cables organized...     | Mount,Universal     | €5.99  | https://...image3.png | https://www.etsy.com/...     | https://...model3.stl
```

## Step 4: Publish Your Sheet as CSV

1. In your Google Sheet, click **File** → **Share**
2. Click **Share** button in the top right
3. In the sharing dialog, click **File** → **Publish to web**
4. Select your sheet from the dropdown (if you have multiple sheets)
5. Select **CSV** as the format
6. Click **Publish**
7. Copy the published URL

## Step 5: Update the Configuration

1. Open `js/sheets-config.js` in your website files
2. Find this line:
   ```javascript
   SHEET_URL: 'https://docs.google.com/spreadsheets/d/1YOUR_SHEET_ID/export?format=csv&gid=0',
   ```
3. Replace `1YOUR_SHEET_ID` with your actual sheet ID (from the URL of your Google Sheet)
4. The URL should look like: `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/export?format=csv&gid=0`

## Step 6: Test Your Setup

1. Open your website in a browser
2. Go to the Shop page
3. Your products should load from Google Sheets
4. If products don't appear, check:
   - Browser console for errors (F12 → Console tab)
   - That the Google Sheet is published as CSV
   - That the URL in `sheets-config.js` is correct

## Updating Products

Whenever you update your Google Sheet:
- Changes will appear on your website after a page refresh
- You can manually trigger an update by calling `updateProductsFromSheets()` in the browser console

## Troubleshooting

### Products not loading?
1. Check that the Google Sheet is published as CSV (not just shared)
2. Verify the URL in `sheets-config.js` is correct
3. Open the CSV URL in your browser to test if it's accessible
4. Check browser console (F12) for CORS or other errors

### Images not showing?
- Make sure image URLs are complete (start with `https://`)
- Images must be publicly accessible
- Consider using a cloud storage service like Google Drive or Imgur

### Tags not displaying correctly?
- Make sure tags are separated by commas with no extra spaces
- Example: `Sky-Watcher,72ED,EQ5` (not `Sky-Watcher, 72ED, EQ5`)

### Styling looks off?
- Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)

## Advanced: Hosting Images on Google Drive

1. Upload images to Google Drive
2. Right-click image → Share
3. Change to "Anyone with the link"
4. Copy the sharing link
5. Extract the file ID from the URL
6. Use this format: `https://drive.google.com/uc?export=view&id=FILE_ID`

## Advanced: Using Different Sheet Tabs

If you want to use a different sheet tab:
1. Find the sheet ID in the URL of your Google Sheet
2. Right-click the sheet tab → Get sheet ID
3. Replace `gid=0` in the URL with your sheet ID

Example: `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/export?format=csv&gid=123456`

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all URLs are correct and accessible
3. Test the CSV export URL directly in your browser
4. Contact support if problems persist
