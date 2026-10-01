import { test, expect } from '@playwright/test';

test.describe('Página Principal y Navegación', () => {
  test('la página de inicio carga correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ramón Menor/i);
    
    // Comprobar que el header o nombre principal es visible
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('la página de CV carga sin errores', async ({ page }) => {
    await page.goto('/cv');
    await expect(page).toHaveTitle(/CV|Ramón Menor/i);
  });
});
