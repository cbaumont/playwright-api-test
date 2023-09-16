import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://grocerycrud.com');
});

test('should access grocery crud download page', async ({ page }) => {
    const downloadLink = page.getByRole('link', { name: 'Download', exact: true });
    await downloadLink.click();
    expect(page.url()).toContain('download');
});