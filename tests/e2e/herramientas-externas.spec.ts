import { test, expect } from '@playwright/test';

test.describe('App Herramientas Externas (/apps/herramientas-externas/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apps/herramientas-externas/index.html');
  });

  test('carga con herramientas predeterminadas y enlaces externos', async ({ page }) => {
    await expect(page.locator('.main-title')).toHaveText('Herramientas externas');

    const container = page.locator('#tools-container');
    await expect(container).toContainText('Nube de archivos');
    await expect(container).toContainText('Calendario');
    await expect(container).toContainText('Lector de notas');

    // Verificar que los links tienen target="_blank"
    const firstLink = container.locator('.tool-link').first();
    await expect(firstLink).toHaveAttribute('target', '_blank');
  });

  test('permite crear una nueva herramienta externa', async ({ page }) => {
    await page.fill('#input-tool-name', 'GitHub Repo');
    await page.fill('#input-tool-desc', 'Repositorio del proyecto');
    await page.fill('#input-tool-url', 'github.com/ramonmenor');
    await page.click('#btn-submit-tool');

    const container = page.locator('#tools-container');
    await expect(container).toContainText('GitHub Repo');
    await expect(container).toContainText('Repositorio del proyecto');
  });

  test('permite editar una herramienta existente', async ({ page }) => {
    // Clic en editar en la primera herramienta
    await page.locator('.btn-edit').first().click();

    // El formulario debe cambiar a modo edición
    await expect(page.locator('#form-heading')).toHaveText('EDITAR ACCESO');
    await expect(page.locator('#btn-submit-tool')).toHaveText('Guardar cambios');

    // Cambiar el nombre
    await page.fill('#input-tool-name', 'Mi Drive Editado');
    await page.click('#btn-submit-tool');

    // Verificar actualización
    const container = page.locator('#tools-container');
    await expect(container).toContainText('Mi Drive Editado');
  });
});
