// Page Object de la pantalla "Iniciar Sesión" (login.html).
// Todos los localizadores de esta pantalla viven acá: los pasos de Cucumber
// nunca tocan elementos de la página directamente.
class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page pestaña de Playwright
   * @param {string} url dirección del login (viene de cucumber.json)
   */
  constructor(page, url) {
    this.page = page;
    this.url = url;

    this.campoCorreo = page.locator('#email');
    this.campoContrasena = page.locator('#password');
    this.botonIngresar = page.getByRole('button', { name: 'Ingresar', exact: true });
    this.mensajeError = page.locator('#error-message');
    this.mensajeAdvertencia = page.locator('#warning-message');
  }

  async abrir() {
    await this.page.goto(this.url);
  }

  // Completa ambos campos. Un texto vacío ("") deja el campo vacío.
  async completar(correo, contrasena) {
    await this.campoCorreo.fill(correo);
    await this.campoContrasena.fill(contrasena);
  }

  async ingresar() {
    await this.botonIngresar.click();
  }

  async iniciarSesion(correo, contrasena) {
    await this.completar(correo, contrasena);
    await this.ingresar();
  }
}

module.exports = LoginPage;
