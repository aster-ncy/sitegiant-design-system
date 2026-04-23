import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for Storybook to load
    await page.goto('http://localhost:6006/iframe.html?args=&id=components-button--all-variants&viewMode=story');
    await page.waitForLoadState('networkidle');
    
    // Quick wait to ensure styles are perfectly applied
    await page.waitForTimeout(1000);
    
    const root = page.locator('#storybook-root');
    await root.waitFor();
    await root.screenshot({ path: 'button_all_variants_updated.png' });
    console.log('Saved button_all_variants_updated.png');

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
