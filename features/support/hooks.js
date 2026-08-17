import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { spawn } from 'child_process';

setDefaultTimeout(30_000);

let devServer = null;

BeforeAll(async function () {
  // Start the Vite dev server if it is not already running
  let running = false;
  for (let i = 0; i < 15; i++) {
    try {
      await fetch('http://localhost:5173');
      running = true;
      break;
    } catch {
      if (i === 0) {
        devServer = spawn('npm', ['run', 'dev'], {
          cwd: process.cwd(),
          stdio: 'ignore',
        });
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  if (!running) throw new Error('Dev server did not start within 15 seconds');
});

AfterAll(async function () {
  if (devServer) {
    devServer.kill('SIGTERM');
    devServer = null;
  }
});

Before(async function () {
  await this.openBrowser();
  // Navigate to site and clear cart state before every scenario
  await this.go('/');
  await this.page.evaluate(() => localStorage.removeItem('sample-shop-cart'));
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED' && this.page) {
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
    } catch {
      // ignore screenshot capture errors
    }
  }
  await this.closeBrowser();
});
