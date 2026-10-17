const { Before, After, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

// Cucumber corta cada paso a los 5 s por defecto; cargar la página puede tardar más.
setDefaultTimeout(30 * 1000);

// Un solo navegador para toda la corrida (abrirlo es lo más lento).
let browser;

Before(async function () {
  // this.parameters = "worldParameters" del perfil elegido en cucumber.json
  if (!browser) {
    const { headless, slowMo } = this.parameters;
    browser = await chromium.launch({ headless, slowMo });
  }
  // Cada escenario usa un contexto nuevo (como una ventana de incógnito):
  // no comparte estado con los demás. Así el contador de intentos fallidos
  // de un caso no se suma al de otro.
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  if (this.context) await this.context.close();
});

AfterAll(async function () {
  if (browser) await browser.close();
});
