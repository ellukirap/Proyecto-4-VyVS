// Page Object de la página de Bienvenida (bienvenida.html), a la que se llega
// después de un inicio de sesión exitoso.
class BienvenidaPage {
  /**
   * @param {import('@playwright/test').Page} page pestaña de Playwright
   */
  constructor(page) {
    this.page = page;

    this.urlEsperada = /\/bienvenida\.html$/;
    this.tituloNoticias = page.getByRole('heading', { name: 'Noticias de la Obra Social' });
    this.opcionSalir = page.getByRole('link', { name: 'Salir' });
  }
}

module.exports = BienvenidaPage;
