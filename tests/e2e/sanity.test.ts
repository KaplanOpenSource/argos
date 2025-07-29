// tests/e2e/fullstack.test.ts
import { expect, test } from '@playwright/test';
import { spawn } from 'child_process';

let flaskProcess: any;
let reactProcess: any;

test.beforeAll(async () => {
  // Start the Flask server
  flaskProcess = spawn('python3', ['server.py'], { stdio: 'inherit' });

  // Start the React client
  reactProcess = spawn('npm', ['start'], { cwd: 'client', stdio: 'inherit' });

  // Wait for the servers to start
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Adjust the timeout as needed
});

test.afterAll(async () => {
  // Kill the Flask and React servers after tests
  flaskProcess.kill();
  reactProcess.kill();
});

test.describe('Fullstack Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000'); // Replace with your React app URL
  });

  test('should display welcome message from Flask', async ({ page }) => {
    const welcomeMessage = await page.locator('text=Welcome to Flask'); // Adjust the selector as needed
    await expect(welcomeMessage).toBeVisible();
  });
});
