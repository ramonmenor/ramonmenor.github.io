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

  test('permite alternar entre modo claro y oscuro con el ThemeToggle', async ({ page }) => {
    await page.goto('/');

    const toggleBtn = page.locator('#theme-toggle-btn');
    await expect(toggleBtn).toBeVisible();

    // Obtener estado inicial
    const isInitiallyDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));

    // Clic en el botón para cambiar de tema
    await toggleBtn.click();

    // Comprobar que el estado de la clase se invirtió
    const isNowDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(isNowDark).toBe(!isInitiallyDark);

    // Comprobar persistencia en localStorage
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(savedTheme).toBe(isNowDark ? 'dark' : 'light');

    // Volver al estado anterior
    await toggleBtn.click();
    const isRestoredDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(isRestoredDark).toBe(isInitiallyDark);
  });

  test('permite buscar y filtrar herramientas en tiempo real', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('#tool-search-input');
    await expect(searchInput).toBeVisible();

    // Filtrar por JSON
    await searchInput.fill('json');
    const jsonCard = page.locator('.app-card[data-app-id="json"]');
    await expect(jsonCard).toBeVisible();

    const pomodoroCard = page.locator('.app-card[data-app-id="pomodoro"]');
    await expect(pomodoroCard).toBeHidden();

    // Limpiar búsqueda
    const clearBtn = page.locator('#clear-search-btn');
    await clearBtn.click();
    await expect(pomodoroCard).toBeVisible();
  });
});
