import { setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';

class SampleShopWorld extends World {
  constructor(options) {
    super(options);
    this.baseUrl = 'http://localhost:5173';
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async openBrowser() {
    this.browser = await chromium.launch({
      channel: 'chrome', // macOS 13: use system Chrome, Playwright cannot download browsers
      headless: true,
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }

  async go(path = '/') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }
}

setWorldConstructor(SampleShopWorld);
