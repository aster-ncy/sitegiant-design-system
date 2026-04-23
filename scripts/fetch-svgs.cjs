const http = require('http');
const fs = require('fs');
const path = require('path');

// All asset URLs collected from Figma MCP get_design_context
const ICON_ASSETS = {
  // --- Navigation ---
  'plus': 'http://localhost:3845/assets/1a09b9535622b2636964ac424e21381d60064b84.svg',
  'minus': 'http://localhost:3845/assets/8f9eaa5248a684cb300eab398fdfed14e79b0817.svg',
  'check': 'http://localhost:3845/assets/4e5003aebf1cf4987cafb5776a70e2535215fc4b.svg',
  'close': 'http://localhost:3845/assets/365609880bbf1a37f1e6ac83f3e7381b04e6379e.svg',
  'arrow-up': 'http://localhost:3845/assets/2e5354114e26a36e1455542d39bcf36fceef2db1.svg',
  'arrow-right': 'http://localhost:3845/assets/3103a14ea61710cc7d5aef4a423acc36d03d4c6d.svg',
  'arrow-down': 'http://localhost:3845/assets/034ff4e0e35cec247206fddc3ef79f53afc50089.svg',
  'arrow-left': 'http://localhost:3845/assets/53b3d9e7c58db1cadfb623868c7371309f77a409.svg',
  'chevron-up': 'http://localhost:3845/assets/ea550c7d30288986e6c41c1d9e65dbd691f1d53c.svg',
  'chevron-right': 'http://localhost:3845/assets/2ada5717cd7ef8ee14d32e7a0b98480d2dd86663.svg',
  'chevron-down': 'http://localhost:3845/assets/aac284ba725adede874f3335cc320b16fab2d644.svg',
  'chevron-left': 'http://localhost:3845/assets/d9a0fb672841b53cbd9779cf194a9572f23180d4.svg',

  // --- Core UI ---
  'search': 'http://localhost:3845/assets/df85589ff855f40b16d718c8f7a377d1499b462e.svg',
  'settings': 'http://localhost:3845/assets/b297ee4f340f26dbdaff8656a98796b54094da63.svg',
  'bell': 'http://localhost:3845/assets/d14da6dba28bd0dc623b40da9d6b0d1155859fc5.svg',
  'trash': 'http://localhost:3845/assets/12393807cac2e96cd248f51298f1fbc08fc6e20e.svg',
  'home': 'http://localhost:3845/assets/2e62920c1d930624c93b9593d646c9c3a1bf2992.svg',
  'info': 'http://localhost:3845/assets/d7f60127d3519bc50febf0d647727fa6f23469cc.svg',

  // --- Batch 2 ---
  'alert-circle': 'http://localhost:3845/assets/5e62aafea966af3f406025bc2ed3588e571b6d69.svg',
  'help-circle': 'http://localhost:3845/assets/3f63ada96b9cf6262d3f87965048da4fabcf17ac.svg',
  'eye': 'http://localhost:3845/assets/b653a4be1ea861c993e4c78bf2dfa96d61be3674.svg',
  'copy': 'http://localhost:3845/assets/197de89c4c366818ef481138ce18bf7cf4c4e6b2.svg',
  'edit': 'http://localhost:3845/assets/7de5ff85da6f96e65c308fec7204bc45dc3fac7f.svg',

  // --- Batch 3 ---
  'filter': 'http://localhost:3845/assets/7d41d931928b928a9983fb0e248acb538d7a2656.svg',
  'download': 'http://localhost:3845/assets/e4e08c20725bbfb59ccf220917949e6b489fd487.svg',
  'upload': 'http://localhost:3845/assets/aaa46da962d43e717a61c2d58e917cd4e0446fd0.svg',
  'external-link': 'http://localhost:3845/assets/e4145b3835821e04ab2c6fd6d01c422fb284e6f7.svg',
  'more-horizontal': 'http://localhost:3845/assets/8852f6ef3b03396054192920364d9ba326f19bc5.svg',
  'apps': 'http://localhost:3845/assets/36a91285093b6b5b77c7c31ccdf42eb4fa63088c.svg',
  'layers': 'http://localhost:3845/assets/cc0c11b61aeacf6d7be6c39cf89cd343d7eb81d3.svg',
  'user': 'http://localhost:3845/assets/4e1881cca955b2bfaae08ef0730b37e89bcf7c58.svg',
  'calendar': 'http://localhost:3845/assets/368b6a35c0697d2808998b3dd46df180991fc039.svg',
  'menu': 'http://localhost:3845/assets/3b6c5efe3422c12b22e9410b31d0ae1516738ce7.svg',
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractFromSvg(svgContent) {
  const vbMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = vbMatch ? vbMatch[1] : '0 0 24 24';
  
  const pathRegex = / d="([^"]+)"/g;
  const paths = [];
  let match;
  while ((match = pathRegex.exec(svgContent)) !== null) {
    paths.push(match[1]);
  }
  
  const fillRule = svgContent.includes('fill-rule="evenodd"') ? 'evenodd' : undefined;
  
  return { viewBox, paths, fillRule };
}

async function main() {
  // Load existing data if present
  const outFile = path.resolve(__dirname, 'icon-data.json');
  let results = {};
  if (fs.existsSync(outFile)) {
    try { results = JSON.parse(fs.readFileSync(outFile, 'utf8')); } catch(e) {}
  }
  
  for (const [name, url] of Object.entries(ICON_ASSETS)) {
    if (results[name]) {
      console.log('SKIP: ' + name + ' (already fetched)');
      continue;
    }
    try {
      const svg = await fetchUrl(url);
      const extracted = extractFromSvg(svg);
      results[name] = {
        viewBox: extracted.viewBox,
        paths: extracted.paths,
        fillRule: extracted.fillRule,
      };
      console.log('OK: ' + name + ' (vb: ' + extracted.viewBox + ', paths: ' + extracted.paths.length + ')');
    } catch (e) {
      console.log('FAIL: ' + name + ' - ' + e.message);
    }
  }
  
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  
  // Generate TypeScript
  const tsFile = path.resolve(__dirname, '..', 'src', 'components', 'Icon', 'iconPaths.ts');
  let ts = '// Auto-generated from Figma Core SiteGiant Library (section 3039:156)\n';
  ts += '// Generated: ' + new Date().toISOString() + '\n';
  ts += '// Total: ' + Object.keys(results).length + ' icons\n\n';
  ts += 'export interface IconPathData {\n';
  ts += '  viewBox: string;\n';
  ts += '  paths: string[];\n';
  ts += '  fillRule?: string;\n';
  ts += '}\n\n';
  ts += 'export const iconPaths: Record<string, IconPathData> = ' + JSON.stringify(results, null, 2) + ' as const;\n\n';
  ts += 'export type IconName = keyof typeof iconPaths;\n\n';
  ts += 'export const iconNames = Object.keys(iconPaths) as IconName[];\n';
  
  fs.writeFileSync(tsFile, ts);
  console.log('\nSaved JSON: ' + outFile);
  console.log('Saved TS:   ' + tsFile);
  console.log('Total: ' + Object.keys(results).length + ' icons');
}

main().catch(console.error);
