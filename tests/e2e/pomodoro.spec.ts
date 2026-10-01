import { test, expect } from '@playwright/test';

test.describe('App Pomodoro (/apps/pomodoro/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apps/pomodoro/index.html');
  });

  test('el temporizador pomodoro carga con 25:00 y controles', async ({ page }) => {
    // Verificar título y display inicial
    await expect(page.locator('#timer-display')).toHaveText('25:00');
    await expect(page.locator('#btn-toggle')).toHaveText('Empezar');
    await expect(page.locator('#counter-cycles')).toHaveText('0');

    // Cambiar a modo pausa
    await page.click('#btn-mode-break');
    await expect(page.locator('#timer-display')).toHaveText('05:00');
    await expect(page.locator('#btn-mode-break')).toHaveClass(/active/);

    // Volver a modo enfoque
    await page.click('#btn-mode-focus');
    await expect(page.locator('#timer-display')).toHaveText('25:00');
  });

  test('permite cambiar configuración con los sliders', async ({ page }) => {
    // Modificar slider de enfoque a 30
    await page.fill('#slider-focus', '30');
    await page.dispatchEvent('#slider-focus', 'input');
    await expect(page.locator('#val-focus')).toHaveText("30'");
    await expect(page.locator('#timer-display')).toHaveText('30:00');

    // Modificar slider de pausa a 10
    await page.fill('#slider-break', '10');
    await page.dispatchEvent('#slider-break', 'input');
    await expect(page.locator('#val-break')).toHaveText("10'");
  });

  test('permite iniciar y pausar el cronómetro', async ({ page }) => {
    const toggleBtn = page.locator('#btn-toggle');
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText('Pausar');

    await toggleBtn.click();
    await expect(toggleBtn).toHaveText('Empezar');
  });
});
