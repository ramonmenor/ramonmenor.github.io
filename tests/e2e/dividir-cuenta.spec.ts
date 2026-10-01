import { test, expect } from '@playwright/test';

test.describe('App Dividir Cuenta (/apps/dividir-cuenta/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apps/dividir-cuenta/index.html');
  });

  test('permite agregar comensales, platos y calcular la cuenta correctamente', async ({ page }) => {
    // 1. Agregar comensal Ana
    await page.fill('#input-person-name', 'Ana');
    await page.click('#form-add-person button[type="submit"]');

    // 2. Agregar comensal Carlos
    await page.fill('#input-person-name', 'Carlos');
    await page.click('#form-add-person button[type="submit"]');

    // Verificar que aparecen en la lista de personas
    await expect(page.locator('#people-list')).toContainText('Ana');
    await expect(page.locator('#people-list')).toContainText('Carlos');

    // 3. Agregar un plato compartido: Pizza (20€)
    await page.fill('#input-item-name', 'Pizza');
    await page.fill('#input-item-price', '20');
    await page.click('#form-add-item button[type="submit"]');

    // 4. Verificar resultados
    const dinerResults = page.locator('#diner-results');
    await expect(dinerResults).toContainText('Ana');
    await expect(dinerResults).toContainText('Carlos');

    // 5. Verificar footer total y match status
    await expect(page.locator('#footer-total')).toBeVisible();
    await expect(page.locator('#match-status')).toContainText('Suma exacta comprobada');
  });

  test('permite configurar teléfono Bizum y compartir resumen', async ({ page }) => {
    // Rellenar teléfono Bizum
    await page.fill('#input-bizum-phone', '600123456');

    // El botón de copiar debe estar habilitado y visible
    const copyBtn = page.locator('#btn-copy-whatsapp');
    await expect(copyBtn).toBeVisible();
  });

  test('permite escanear o pegar texto de un ticket y extraer platos automáticamente', async ({ page }) => {
    // Abrir modal de escaneo de ticket
    await page.click('#btn-open-scanner');
    const modal = page.locator('#modal-ticket-scanner');
    await expect(modal).toBeVisible();

    // Cambiar a la pestaña de texto
    await page.click('#tab-scan-text');
    await expect(page.locator('#panel-scan-text')).toBeVisible();

    // Pegar texto típico de un ticket
    const ticketText = `
      RESTAURANTE EL BUEN GUSTO
      NIF: B-12345678
      MESA: 4
      ---------------------------------
      1 Ensalada Mixta          8.50
      2 Cerveza Alhambra        5.00
      1 Entrecot Ternera       18.00
      ---------------------------------
      SUBTOTAL: 31.50
      IVA 10%: 3.15
      TOTAL: 34.65
    `;
    await page.fill('#textarea-ticket-raw', ticketText);
    await page.click('#btn-parse-text');

    // Verificar que se extrajeron los platos descartando ruido
    const scannedNames = page.locator('.scanned-name');
    await expect(scannedNames.first()).toHaveValue('Ensalada Mixta');
    await expect(scannedNames.nth(1)).toHaveValue('Cerveza Alhambra');
    await expect(scannedNames.nth(2)).toHaveValue('Entrecot Ternera');

    // Añadir los platos a la cuenta
    await page.click('#btn-apply-scanned-items');
    await expect(modal).not.toBeVisible();

    // Verificar que los platos aparecen en la lista principal
    const itemsContainer = page.locator('#items-container');
    await expect(itemsContainer).toContainText('Ensalada Mixta');
    await expect(itemsContainer).toContainText('Cerveza Alhambra');
    await expect(itemsContainer).toContainText('Entrecot Ternera');
  });
});
