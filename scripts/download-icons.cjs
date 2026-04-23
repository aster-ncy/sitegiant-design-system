/**
 * Downloads Figma icon SVGs from the MCP dev server and generates
 * src/components/Icon/iconPaths.ts with inline path data.
 *
 * Usage: node scripts/download-icons.js
 * Prereq: Figma Desktop app open with MCP server running
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const { ICON_NODES } = require('./icon-manifest.js');

const OUTPUT = path.resolve(
  __dirname,
  '../src/components/Icon/iconPaths.ts'
);

function fetchSvg(nodeId) {
  // Use Figma MCP export endpoint pattern
  return new Promise((resolve, reject) => {
    // First get the design context to find the asset URL
    const url = `http://localhost:3845/figma/export?nodeId=${encodeURIComponent(nodeId)}&format=svg`;
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractPathFromSvg(svgContent) {
  // Extract viewBox
  const vbMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = vbMatch ? vbMatch[1] : '0 0 24 24';

  // Extract all path d attributes
  const pathRegex = /d="([^"]+)"/g;
  const paths = [];
  let match;
  while ((match = pathRegex.exec(svgContent)) !== null) {
    paths.push(match[1]);
  }

  // Extract fill-rule if present
  const fillRuleMatch = svgContent.match(/fill-rule="([^"]+)"/);
  const fillRule = fillRuleMatch ? fillRuleMatch[1] : undefined;

  return { viewBox, paths, fillRule };
}

async function fetchIconFromFigmaMcp(nodeId, name) {
  return new Promise((resolve, reject) => {
    // Use the Figma MCP get_design_context pattern to get asset URL
    // The MCP server provides SVG at: http://localhost:3845/assets/{hash}.svg
    // We need to call the design context first to get the hash
    
    // Alternative: Export the node directly
    const body = JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'get_design_context',
        arguments: {
          nodeId: nodeId,
          clientFrameworks: 'react',
          clientLanguages: 'typescript',
          artifactType: 'REUSABLE_COMPONENT',
          forceCode: true,
        },
      },
      id: 1,
    });

    const options = {
      hostname: 'localhost',
      port: 3845,
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          // Extract asset URL from response
          const urlMatch = data.match(/http:\/\/localhost:3845\/assets\/([a-f0-9]+\.svg)/);
          if (urlMatch) {
            // Fetch the actual SVG
            http.get(urlMatch[0], (svgRes) => {
              let svgData = '';
              svgRes.on('data', (chunk) => (svgData += chunk));
              svgRes.on('end', () => {
                const parsed = extractPathFromSvg(svgData);
                resolve({ name, ...parsed });
              });
            }).on('error', reject);
          } else {
            console.log(`  ⚠ No SVG URL found for ${name} (${nodeId})`);
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('Downloading icon SVGs from Figma MCP server...\n');
  
  const results = {};
  let success = 0;
  let fail = 0;

  // Process in batches of 5 to avoid overwhelming the server
  for (let i = 0; i < ICON_NODES.length; i += 5) {
    const batch = ICON_NODES.slice(i, i + 5);
    const promises = batch.map((icon) =>
      fetchIconFromFigmaMcp(icon.id, icon.name).catch((e) => {
        console.log(`  ✗ ${icon.name}: ${e.message}`);
        return null;
      })
    );

    const batchResults = await Promise.all(promises);
    for (const r of batchResults) {
      if (r) {
        results[r.name] = {
          viewBox: r.viewBox,
          paths: r.paths,
          fillRule: r.fillRule,
        };
        success++;
        process.stdout.write(`  ✓ ${r.name}\n`);
      } else {
        fail++;
      }
    }

    console.log(`  Progress: ${i + batch.length}/${ICON_NODES.length}`);
  }

  // Generate TypeScript file
  let output = `// Auto-generated from Figma Core SiteGiant Library (section 3039:156)\n`;
  output += `// Generated: ${new Date().toISOString()}\n`;
  output += `// Total: ${success} icons\n\n`;
  output += `export interface IconPathData {\n`;
  output += `  viewBox: string;\n`;
  output += `  paths: string[];\n`;
  output += `  fillRule?: string;\n`;
  output += `}\n\n`;
  output += `export const iconPaths: Record<string, IconPathData> = ${JSON.stringify(results, null, 2)};\n\n`;
  output += `export type IconName = keyof typeof iconPaths;\n`;

  // Ensure directory exists
  const dir = path.dirname(OUTPUT);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(OUTPUT, output);
  console.log(`\n✅ Generated ${OUTPUT}`);
  console.log(`   ${success} icons saved, ${fail} failed`);
}

main().catch(console.error);
