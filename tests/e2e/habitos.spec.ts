import { test, expect } from '@playwright/test';

test.describe('App Hábitos (/apps/habitos/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apps/habitos/index.html');
  });

  test('carga con los hábitos predeterminados y métricas', async ({ page }) => {
    // Comprobar título y métrica
    await expect(page.locator('.main-title')).toHaveText('Hábitos');
    await expect(page.locator('#metric-total')).toHaveText('6');
    await expect(page.locator('#metric-today')).toHaveText('0');

    // Verificar que los hábitos del mockup están presentes
    const container = page.locator('#habits-container');
    await expect(container).toContainText('Beber 2 L de agua');
    await expect(container).toContainText('Leer 20 minutos');
    await expect(container).toContainText('Ejercicio');
  });

  test('permite marcar y desmarcar días de un hábito', async ({ page }) => {
    // Seleccionar el primer botón de día del primer hábito
    const firstDayBtn = page.locator('.habit-card').first().locator('.day-btn').last(); // hoy
    await firstDayBtn.click();

    // Debe tener clase completed
    await expect(firstDayBtn).toHaveClass(/completed/);
    await expect(firstDayBtn.locator('.day-status')).toHaveText('✓');

    // Métrica de hoy debe subir a 1
    await expect(page.locator('#metric-today')).toHaveText('1');

    // Volver a hacer clic desmarca
    await firstDayBtn.click();
    await expect(firstDayBtn).not.toHaveClass(/completed/);
    await expect(firstDayBtn.locator('.day-status')).toHaveText('·');
    await expect(page.locator('#metric-today')).toHaveText('0');
  });

  test('permite añadir un nuevo hábito', async ({ page }) => {
    await page.fill('#input-habit-name', 'Aprender Astro');
    await page.click('#form-add-habit button[type="submit"]');

    // Debe aparecer en la lista y aumentar el total
    const container = page.locator('#habits-container');
    await expect(container).toContainText('Aprender Astro');
    await expect(page.locator('#metric-total')).toHaveText('7');
  });
});
