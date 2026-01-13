# Cache Status Checker - Chrome Extension

A Chrome extension that monitors and displays the cache status of websites using Cloudflare and/or LiteSpeed caching systems.

## Features

- Real-time cache status monitoring
- Visual color-coded icon indicators with badge text (HIT/MISS/CACHE/N/A)
- Support for both Cloudflare and LiteSpeed cache
- Browser cache detection
- One-click page reload functionality
- Color-coded popup background matching cache status
- Current page URL display
- Copy cache status to clipboard
- Highlighted key status messages
- Responsive and modern UI design

## Cache Status Colors

The extension displays **5 different colors** based on the cache status:

### 🟢 GREEN - Perfect Cache Status
- **When:** Cloudflare shows **HIT**
- **Badge Text:** `HIT`
- **Meaning:** Cache is working perfectly, no action needed
- **Highlighted Message:** "**The cache status is perfect, and you don't need to do anything further.**"
- **Popup Background:** Light green gradient

### 🟡 YELLOW - Partial Cache Hit
- **When:** LiteSpeed shows **HIT** but Cloudflare doesn't
- **Badge Text:** `HIT`
- **Meaning:** Partial caching is active, reload recommended to improve status
- **Highlighted Message:** "**Please reload the page to improve the cache status.**"
- **Popup Background:** Light yellow gradient
- **Action:** Reload button available

### 🔴 RED - Cache Miss
- **When:** Both Cloudflare and LiteSpeed show **MISS** or other non-HIT status
- **Badge Text:** `MISS`
- **Meaning:** Content is not cached, page load is slower than optimal
- **Highlighted Message:** "**Please reload the page to improve the cache status.**"
- **Popup Background:** Light red gradient
- **Action:** Reload button available

### 🔵 BLUE - Browser Cache
- **When:** Page loaded from local browser cache
- **Badge Text:** `CACHE`
- **Meaning:** Viewing cached version from your browser, not the live online cache status
- **Highlighted Message:** "**The page is being loaded from your browser cache.**"
- **Popup Background:** Light blue gradient
- **Action:** Reload button available

### ⚪ GREY - Not Applicable
- **When:** Site doesn't have Cloudflare or LiteSpeed cache headers
- **Badge Text:** `N/A`
- **Meaning:** Cache monitoring not available for this site
- **Highlighted Message:** "**Cloudflare and LiteSpeed cache not found.**"
- **Popup Background:** Light grey gradient

## How It Works

The extension monitors HTTP response headers:
- `cf-cache-status` - Cloudflare cache status
- `x-litespeed-cache` - LiteSpeed cache status

### Cache Status Priority

1. **Browser Cache** - If detected, shows BLUE icon (reload needed to check server cache)
2. **No Cache System** - If neither Cloudflare nor LiteSpeed detected, shows GREY icon
3. **Cloudflare HIT** - Best case, shows GREEN icon
4. **LiteSpeed HIT only** - Good but can be better, shows YELLOW icon
5. **Both MISS** - Needs reload, shows RED icon

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the extension folder

## Usage

1. **View Status at a Glance:** Look at the extension icon badge text (`HIT`, `MISS`, `CACHE`, or `N/A`) without opening the popup
2. **Open Popup:** Click the extension icon to see detailed information
3. **Check Current Page:** View the current page URL at the top of the popup
4. **Read Status Details:** Review the cache status with highlighted key messages
5. **Take Action:** Click "🔄 Reload Page" button if available to improve cache status
6. **Copy Status:** Click "📋 Copy Status" to copy the URL and cache details to clipboard for sharing

## UI Features

### Extension Icon Badge
- Shows quick status without opening popup
- Badge text changes based on cache status:
  - `HIT` - Green/Yellow (cache working)
  - `MISS` - Red (needs reload)
  - `CACHE` - Blue (browser cache detected)
  - `N/A` - Grey (no cache system)

### Popup Interface
- **Color Indicator Dot:** Visual circle matching the icon color
- **Current Page URL:** Displays hostname + path (hover for full URL)
- **Status Message:** Detailed cache information with smaller, readable text
- **Highlighted Messages:** Key information in bold with subtle background
- **Colored Background:** Gradient background matching cache status for instant recognition
- **Action Buttons:**
  - 🔄 Reload Page - Appears when reload is recommended
  - 📋 Copy Status - Always available, changes to "✓ Copied!" on success

### Color-Coded Backgrounds
Each cache status has a unique gradient background in the popup:
- **Green gradient** for perfect cache (HIT)
- **Yellow gradient** for partial cache
- **Red gradient** for cache miss
- **Blue gradient** for browser cache
- **Grey gradient** for N/A

## Technical Details

- **Manifest Version:** 3
- **Permissions Required:**
  - `webRequest` - To read HTTP headers
  - `webNavigation` - To detect page navigation
  - `scripting` - To check browser cache
  - `activeTab` - To interact with current tab
  - `tabs` - To reload tabs

## Files

- `manifest.json` - Extension configuration
- `background.js` - Main logic for cache detection, icon management, and badge text
- `popup.js` - Popup interface logic with color mapping and clipboard functionality
- `popup.html` - Popup interface HTML with styled components and gradient backgrounds
- `icon-green.png` - Perfect cache (HIT) icon
- `icon-yellow.png` - Partial cache (LiteSpeed HIT) icon
- `icon-red.png` - Cache miss icon
- `icon-blue.png` - Browser cache icon
- `icon-grey.png` - No cache system detected icon

## Recent Enhancements (v2.9)

### Badge Text on Icon
- Extension icon now shows status text (`HIT`, `MISS`, `CACHE`, `N/A`)
- Badge background color matches the icon color
- Quick status visibility without opening popup

### Enhanced Popup UI
- **Color-coded backgrounds:** Gradient backgrounds matching cache status
- **Current URL display:** Shows hostname + path at the top
- **Color indicator dot:** Visual status indicator with shadow
- **Smaller text:** Optimized font sizes (12px) for better fit
- **Copy to clipboard:** New button to copy status information
- **Highlighted messages:** Important messages shown in bold with background
- **Responsive design:** Text wraps properly with scrolling for long messages

### Improved UX
- Visual consistency across icon, badge, and popup
- Instant recognition through color-coding
- Better readability with highlighted key messages
- Easy sharing via clipboard copy functionality

## License

MIT
