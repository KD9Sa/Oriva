import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const executablePath =
  process.env['PLAYWRIGHT_EXECUTABLE_PATH'] ??
  (existsSync(edge) ? edge : existsSync(chrome) ? chrome : undefined);

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4200',
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
    timezoneId: 'Africa/Cairo',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: { executablePath },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
  ],
  webServer: {
    command: 'node ./node_modules/@angular/cli/bin/ng.js serve --host 127.0.0.1 --port 4200',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
