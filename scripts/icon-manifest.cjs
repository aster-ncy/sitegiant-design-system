/**
 * Fetches all Figma icon SVGs from the MCP dev server and generates
 * a TypeScript icon map file for the SiteGiant icon component library.
 *
 * Usage: node scripts/fetch-figma-icons.js
 *
 * Prerequisites: Figma Desktop must be open with the Core SiteGiant Library
 *                file, and the MCP dev server must be running.
 */
const fs = require('fs');
const path = require('path');

// Icon node IDs extracted from Figma section 3039:156
const ICON_NODES = [
  // --- Navigation / Arrows ---
  { id: '3039:157', name: 'plus' },
  { id: '3039:260', name: 'minus' },
  { id: '3039:306', name: 'check' },
  { id: '3039:183', name: 'close' },
  { id: '3039:236', name: 'arrow-up' },
  { id: '3039:278', name: 'arrow-right' },
  { id: '3039:238', name: 'arrow-down' },
  { id: '3039:181', name: 'arrow-left' },
  { id: '3039:232', name: 'chevron-up' },
  { id: '3039:244', name: 'chevron-right' },
  { id: '3039:189', name: 'chevron-down' },
  { id: '3039:246', name: 'chevron-left' },
  { id: '3428:42', name: 'chevrons-up' },
  { id: '3428:43', name: 'chevrons-right' },
  { id: '3428:44', name: 'chevrons-down' },
  { id: '3428:45', name: 'chevrons-left' },

  // --- Status / Feedback ---
  { id: '3039:171', name: 'plus-circle' },
  { id: '3533:18', name: 'minus-circle' },
  { id: '3039:191', name: 'alert-circle' },
  { id: '3039:195', name: 'help-circle' },
  { id: '3039:264', name: 'info' },
  { id: '3039:248', name: 'clock' },
  { id: '3039:282', name: 'x-circle' },
  { id: '3039:284', name: 'pause-circle' },
  { id: '3808:10', name: 'check-circle' },
  { id: '3039:314', name: 'close-circle' },
  { id: '3810:13', name: 'spinner' },

  // --- Actions ---
  { id: '3039:173', name: 'plus-square' },
  { id: '3039:240', name: 'minus-square' },
  { id: '3039:242', name: 'alert-triangle' },
  { id: '3194:43', name: 'refresh-cw' },
  { id: '3154:28', name: 'reverse-ccw' },
  { id: '3166:27', name: 'sync-cw' },

  // --- I/O ---
  { id: '3683:21', name: 'external' },
  { id: '3560:27', name: 'log-in' },
  { id: '3187:39', name: 'log-out' },
  { id: '3039:274', name: 'upload' },
  { id: '3039:276', name: 'download' },
  { id: '3312:29', name: 'external-link' },
  { id: '3140:34', name: 'share' },
  { id: '3039:258', name: 'menu-swap' },

  // --- Vision ---
  { id: '3039:230', name: 'eye' },
  { id: '3039:256', name: 'eye-open' },
  { id: '3039:254', name: 'eye-close' },

  // --- Core UI ---
  { id: '3039:159', name: 'search' },
  { id: '3039:187', name: 'settings' },
  { id: '3039:193', name: 'bell' },
  { id: '3039:165', name: 'trash' },
  { id: '3138:44', name: 'phone' },
  { id: '3188:46', name: 'mail' },
  { id: '3137:41', name: 'location' },

  // --- Media ---
  { id: '3111:50', name: 'camera' },
  { id: '3192:32', name: 'camera-switch' },
  { id: '3127:30', name: 'videocam-off' },
  { id: '3127:31', name: 'videocam' },

  // --- E-commerce ---
  { id: '3039:270', name: 'power' },
  { id: '3186:24', name: 'web' },
  { id: '3110:32', name: 'slash' },
  { id: '3135:37', name: 'loading' },
  { id: '3423:22', name: 'shopping-bag' },
  { id: '3423:27', name: 'tag' },
  { id: '3039:163', name: 'mobile-app' },

  // --- Devices ---
  { id: '3774:17', name: 'monitor' },
  { id: '3774:14', name: 'tablet' },
  { id: '4064:35', name: 'desktop' },
  { id: '4064:37', name: 'tablet-device' },
  { id: '4064:39', name: 'mobile' },

  // --- Sidebar / Features ---
  { id: '3039:185', name: 'home' },
  { id: '3039:179', name: 'apps' },
  { id: '3039:203', name: 'inventory' },
  { id: '3039:201', name: 'orders' },
  { id: '3039:207', name: 'customer-service' },
  { id: '3039:215', name: 'analytics' },
  { id: '3039:213', name: 'marketing-centre' },
  { id: '3039:310', name: 'send' },
  { id: '3039:175', name: 'products' },
  { id: '3039:288', name: 'box' },
  { id: '3039:205', name: 'customers' },
  { id: '3184:25', name: 'user' },
  { id: '3039:161', name: 'server' },
  { id: '3039:169', name: 'printer' },
  { id: '3039:167', name: 'truck' },
  { id: '3483:29', name: 'map' },
  { id: '3039:199', name: 'get-started' },

  // --- Content ---
  { id: '3192:35', name: 'flash' },
  { id: '3192:38', name: 'flash-off' },
  { id: '3556:55', name: 'dollar-sign' },
  { id: '3556:54', name: 'credit-card' },
  { id: '3556:57', name: 'shopping-cart' },
  { id: '3560:30', name: 'wallet' },
  { id: '3039:217', name: 'omo-solution' },
  { id: '3039:286', name: 'layers' },
  { id: '3039:268', name: 'copy' },
  { id: '3293:26', name: 'edit' },
  { id: '3304:23', name: 'edit-pen' },
  { id: '3638:26', name: 'edit-line' },
  { id: '3778:12', name: 'slider' },

  // --- Data / Files ---
  { id: '3556:56', name: 'cloud' },
  { id: '3135:38', name: 'history' },
  { id: '3039:209', name: 'whatsapp-chat' },
  { id: '3039:308', name: 'paperclip' },
  { id: '3039:312', name: 'database' },
  { id: '3039:272', name: 'filter' },
  { id: '3039:266', name: 'calendar' },
  { id: '3039:280', name: 'file-text' },
  { id: '3939:10', name: 'file' },

  // --- Layout ---
  { id: '3773:15', name: 'sliders' },
  { id: '3039:197', name: 'menu' },
  { id: '3039:262', name: 'list' },
  { id: '3039:177', name: 'more-horizontal' },
  { id: '3322:22', name: 'drag' },

  // --- Stars / Ratings ---
  { id: '3349:22', name: 'star' },
  { id: '3118:35', name: 'star-full' },
  { id: '3118:37', name: 'star-left' },
  { id: '3118:39', name: 'star-right' },

  // --- Sort ---
  { id: '3039:298', name: 'sorting-ascending' },
  { id: '3039:300', name: 'sorting-descending' },
  { id: '3039:302', name: 'sort-horizontal' },
  { id: '3039:304', name: 'sort-vertical' },

  // --- Security ---
  { id: '3039:290', name: 'unlock' },
  { id: '3188:42', name: 'lock-line' },
  { id: '3039:292', name: 'lock' },
  { id: '3039:294', name: 'pin' },
  { id: '3039:296', name: 'pin-off' },
  { id: '3784:14', name: 'left-pin' },
  { id: '3784:15', name: 'left-pin-off' },
  { id: '3784:45', name: 'right-pin' },
  { id: '3784:46', name: 'right-pin-off' },

  // --- Additional ---
  { id: '3807:24', name: 'upload-cloud' },
  { id: '3840:10', name: 'barcode-scan' },
  { id: '3566:36', name: 'snowflake' },
  { id: '3567:16', name: 'fragile' },
  { id: '3566:54', name: 'temperature' },
  { id: '3991:119', name: 'coin' },
  { id: '3999:38', name: 'weight' },
  { id: '3999:39', name: 'bulky' },
  { id: '4046:27', name: 'theme' },
  { id: '4054:37', name: 'flash-solid' },
  { id: '3911:12', name: 'check-circle-outline' },
  { id: '3868:13', name: 'share-alt' },
  { id: '3868:14', name: 'shopping-bag-alt' },
  { id: '3855:12', name: 'minus-circle-alt' },
  { id: '3855:15', name: 'plus-circle-alt' },
  { id: '3039:296', name: 'clear-cache' },

  // --- Text formatting ---
  { id: '3815:23', name: 'text-size-1' },
  { id: '3815:24', name: 'text-size-2' },
  { id: '3815:25', name: 'text-size-3' },
  { id: '3815:14', name: 'text-size-4' },
  { id: '3815:27', name: 'text-bold' },
  { id: '3815:26', name: 'text-italic' },
  { id: '3815:53', name: 'text-uppercase' },
  { id: '3815:52', name: 'text-title-case' },
  { id: '3815:51', name: 'text-lowercase' },
];

console.log(`\nTotal icons to fetch: ${ICON_NODES.length}`);
console.log('Icon node IDs saved. Run the download step next.\n');

// Export for use
module.exports = { ICON_NODES };
