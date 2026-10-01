# Ramón Menor — Suite Personal & Hub de Aplicaciones

Espacio de trabajo personal y hub de micro-aplicaciones independientes, diseñado con **Astro**, **Tailwind CSS** y **Playwright**, optimizado para el uso diario y centrado en una experiencia **mobile-first** e instalable como **PWA**.

Sitio en producción: [ramonmenor.es](https://ramonmenor.es)

---

## 🚀 Concepto & Arquitectura

El proyecto está diseñado bajo un modelo de **suite de herramientas desacopladas**:

- **Hub Central (Astro)**: Dashboard oscuro (*Taller / Panel Personal*) que organiza las aplicaciones por categorías, muestra resúmenes en vivo y sincroniza accesos.
- **Micro-Apps Autónomas (`/public/apps/`)**: Cada herramienta reside en su propio directorio independiente. Son aplicaciones client-side autónomas desarrolladas con tecnologías web estándar (HTML5, Vanilla JS, CSS3, Web APIs) sin atarse rígidamente al ciclo de vida del framework.
- **Control de Acceso Cifrado (`auth-guard.js`)**: Sistema de permisos con PIN maestro (cifrado con SHA-256 en el cliente). Permite alternar cualquier aplicación entre **Pública** o **Privada** desde el [Panel de Control](/apps/panel-control/).
- **PWA & Mobile-First**: Preparado para añadirse a la pantalla de inicio en smartphones (iOS / Android) y funcionar a pantalla completa sin barras del navegador.

---

## 🛠️ Catálogo de Aplicaciones

### Gestión Personal & Finanzas
- **Dividir Cuenta & Ticket (`/apps/dividir-cuenta/`)**: Divide gastos de restaurantes por comensal y consumición. Incluye **escáner OCR de tickets** con la cámara o desde la galería (Tesseract.js), desglose individual y generador de resúmenes para WhatsApp y Bizum.
- **Hábitos & Rutinas (`/apps/habitos/`)**: Rastreador de hábitos diarios con seguimiento visual de 7 días, contador de cumplimiento diario y persistencia local.
- **Cuaderno Privado (`/apps/notas-privadas/`)**: Bloc de notas rápido con guardado persistente en `localStorage`, protegido bajo PIN maestro.

### Utilidades & Herramientas Dev
- **Temporizador Pomodoro (`/apps/pomodoro/`)**: Cronómetro de bloques de enfoque y descansos configurables con avisos sonoros (Web Audio API) y contador de ciclos.
- **JSON Formatter & Validator (`/apps/json-formatter/`)**: Validador sintáctico, formateador con sangría adaptable y minificador en tiempo real.
- **SQL Formatter (`/apps/sql-formatter/`)**: Formateador y embellecedor de consultas SQL complejas con palabras clave en mayúsculas estándar.
- **Hashes & UUIDs (`/apps/hash-uuid/`)**: Generador de UUID v4 en lote, contraseñas criptográficas y hashes SHA-256 / SHA-512 al vuelo con WebCrypto.
- **Colores & Contraste WCAG (`/apps/color-converter/`)**: Conversión bidireccional entre HEX, RGB y HSL con calculadora en vivo de contrastes de accesibilidad WCAG.

### Sistema & Infraestructura
- **Base64 & URL Encoder (`/apps/base64-converter/`)**: Codificación y decodificación Base64 con soporte UTF-8 completo y utilidades URL-Safe.
- **Servidores & Accesos (`/apps/mis-servidores/`)**: Fichero privado de servidores, credenciales SSH y configuraciones DevOps, protegido por PIN.
- **Herramientas Externas (`/apps/herramientas-externas/`)**: Gestor de accesos directos personalizables a servicios externos, sincronizado en tiempo real con la página principal.

---

## 🔒 Control de Acceso & Privacidad

1. **Sin servidores externos para tus datos**: Todas las notas, servidores, hábitos y configuraciones se almacenan exclusivamente en el navegador (`localStorage` / `sessionStorage`).
2. **PIN Maestro**: Las aplicaciones marcadas como privadas requieren la introducción de un PIN maestro verificado criptográficamente en el cliente mediante SHA-256.
3. **Panel de Gestión**: Desde `/apps/panel-control/` es posible cambiar el PIN, modificar los permisos de visibilidad de cada app y bloquear la sesión.

---

## 🧪 Pruebas Automatizadas (Playwright E2E)

El proyecto cuenta con una batería completa de pruebas End-to-End con **Playwright**, ejecutándose tanto en resoluciones de escritorio (**Desktop Chrome**) como en entornos móviles (**Mobile Chrome / Pixel 5**):

```bash
# Ejecutar todas las pruebas E2E
npm run test:e2e

# Ejecutar pruebas con interfaz visual interactiva
npm run test:e2e:ui

# Ver reporte HTML de la última ejecución
npm run test:e2e:report
```

---

## 💻 Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo (puerto 4321)
npm run dev

# 3. Compilar el sitio estático para producción
npm run build

# 4. Previsualizar la distribución estática
npm run preview
```

---

## 📄 Licencia & Contacto

Desarrollado por **Ramón Menor** ([minombre@ramonmenor.es](mailto:minombre@ramonmenor.es)).  
Repositorio alojado en [GitHub Pages](https://github.com/ramonmenor/ramonmenor.github.io).
