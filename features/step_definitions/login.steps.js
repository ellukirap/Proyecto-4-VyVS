const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const BienvenidaPage = require('../../pages/BienvenidaPage');

// Pasaje de información Cucumber -> Playwright:
//  - {string} / {int} capturan los datos escritos en login.feature (correo,
//    contraseña, cantidad de intentos, mensaje esperado) y llegan como argumentos.
//  - Las filas de "Ejemplos" ejecutan el mismo escenario con datos distintos.
//  - "this" es el World de Cucumber: comparte entre los pasos de un escenario la
//    página de Playwright, los Page Objects y la URL configurada en cucumber.json.
// Ningún dato de prueba está escrito en este archivo: todos vienen del .feature.
// Por eso las step definitions usan "function" y no arrow functions (=>):
// con una arrow function, "this" no sería el World.

// ---------------------------------------------------------------- Dado

Given('que estoy en la página de inicio de sesión', async function () {
  this.loginPage = new LoginPage(this.page, this.parameters.urlLogin);
  await this.loginPage.abrir();
  await expect(this.loginPage.botonIngresar).toBeVisible();
});

// ---------------------------------------------------------------- Cuando

When('ingreso el correo {string} y la contraseña {string}', async function (correo, contrasena) {
  await this.loginPage.completar(correo, contrasena);
});

When('presiono el botón Ingresar', async function () {
  await this.loginPage.ingresar();
});

When('intento ingresar {int} veces seguidas con el correo {string} y la contraseña {string}',
  async function (veces, correo, contrasena) {
    for (let intento = 1; intento <= veces; intento++) {
      await this.loginPage.iniciarSesion(correo, contrasena);
      // cada intento tiene que haber sido rechazado antes de hacer el siguiente
      await expect(this.loginPage.mensajeError).not.toBeEmpty();
    }
  });

// ---------------------------------------------------------------- Entonces

Then('veo el mensaje de error {string}', async function (mensaje) {
  await expect(this.loginPage.mensajeError).toHaveText(mensaje);
});

Then('veo la advertencia {string}', async function (advertencia) {
  await expect(this.loginPage.mensajeAdvertencia).toHaveText(advertencia);
});

Then('sigo en la página de inicio de sesión', async function () {
  await expect(this.page).toHaveURL(this.parameters.urlLogin);
  await expect(this.loginPage.botonIngresar).toBeVisible();
});

Then('accedo a la página de bienvenida de la Obra Social', async function () {
  const bienvenida = new BienvenidaPage(this.page);
  await expect(this.page).toHaveURL(bienvenida.urlEsperada);
  await expect(bienvenida.tituloNoticias).toBeVisible();
  await expect(bienvenida.opcionSalir).toBeVisible();
});
