const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`[Browser Error] ${error.message}`);
  });

  page.on('request', request => {
    if (request.url().includes('localhost:3000')) {
      console.log(`[Network] >> ${request.method()} ${request.url()}`);
    }
  });

  try {
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    console.log('[Navigation Error]', e.message);
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
