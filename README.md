# Proyecto 4 — Testing Funcional Automatizado del Login

**Verificación y Validación de Software · DCIC-UNS · 2026**
Comisión: `25` · Integrantes: `Nicolás Mérida` · `Lucas Solmoni`

Automatización de **todos los casos de test del Login** de la Obra Social de los
Trabajadores de Hogwarts (tabla *Casos de test-Login*, LOG-01 a LOG-13).
Los casos se describen en **Gherkin** (Cucumber) y se implementan con **Playwright**.

Sistema bajo prueba: <https://cs.uns.edu.ar/~mll/temp/testing/hogwarts/login.html>

---

## Requisitos

- **Node.js 18 o superior** (probado con Node 24). Para verificarlo: `node -v`
- Conexión a internet (el sistema está publicado en el servidor de la cátedra)

## Instalación

Desde la carpeta del proyecto (donde está este README):

```bash
npm install
```

Instala Cucumber y Playwright y, al terminar, **descarga el navegador Chromium
automáticamente** (script `postinstall`). Si esa descarga fallara, se puede hacer a mano:

```bash
npx playwright install chromium
```

## Ejecución

| Comando | Qué hace |
|---|---|
| `npm test` | Corre los 13 casos sin mostrar el navegador |
| `npm run test:visible` | Corre los 13 casos **mostrando el navegador**, en cámara lenta |
| `npx cucumber-js --tags @bloqueo` | Corre sólo un grupo (`@exitoso`, `@campos-vacios`, `@correo-invalido`, `@credenciales-incorrectas`, `@bloqueo`) |

Al terminar se generan:

- `reportes/reporte.html`: reporte visual (abrir con el navegador). Los escenarios
  que fallan incluyen una **captura de pantalla** del momento de la falla.
- `reportes/reporte.json`: el mismo resultado en formato JSON.

## Resultado esperado

```
13 scenarios (12 passed, 1 failed)
```

**LOG-13 falla a propósito: el test detecta un defecto del sistema.**
La especificación pide que, tras **tres** intentos seguidos con el correo correcto y la
contraseña incorrecta, se advierta que la cuenta está a punto de ser bloqueada. El
sistema muestra esa advertencia recién en el **cuarto** intento. El test verifica la
especificación, no el comportamiento actual, y por eso falla:

```
Locator:  locator('#warning-message')
Expected: "Atención, su cuenta está a punto de ser bloqueada."
Received: ""
```

## Estructura del proyecto

```
proyecto4-login/
├── features/
│   ├── login.feature              Casos de test en Gherkin (LOG-01 a LOG-13)
│   ├── step_definitions/
│   │   └── login.steps.js         Implementación de cada paso con Playwright
│   └── support/
│       └── hooks.js               Abre el navegador y crea un contexto limpio por escenario
├── pages/
│   ├── LoginPage.js               Page Object del login (localizadores y acciones)
│   └── BienvenidaPage.js          Page Object de la página de bienvenida
├── cucumber.json                  Configuración de Cucumber (perfiles, reportes, URL)
├── package.json                   Dependencias y scripts
└── package-lock.json              Versiones exactas de las dependencias
```

## Cómo se pasa la información entre Cucumber y Playwright

1. **Parámetros de los pasos.** Los datos se escriben en `login.feature` y llegan como
   argumentos a las funciones de `login.steps.js` mediante *Cucumber expressions*:
   ```gherkin
   Cuando ingreso el correo "ron@hogwarts.com" y la contraseña "123"
   ```
   ```js
   When('ingreso el correo {string} y la contraseña {string}', async function (correo, contrasena) { … })
   ```
   `{int}` se usa para la cantidad de intentos de LOG-13.
2. **Tablas de `Ejemplos`.** Cada `Esquema del escenario` se ejecuta una vez por fila:
   correo, contraseña y mensaje esperado de cada caso están en la tabla.
3. **World de Cucumber (`this`).** Comparte entre los pasos de un escenario la página de
   Playwright, los Page Objects y los `worldParameters` de `cucumber.json` (URL del
   sistema, modo visible).

Ningún dato de prueba está escrito en el código JavaScript: todos vienen del `.feature`.

## Trazabilidad con la tabla de casos

| Caso | Correo | Contraseña | Se verifica | Resultado |
|---|---|---|---|---|
| LOG-01 | (vacío) | (vacío) | "Por favor, completa ambos campos." y no ingresa | ✅ |
| LOG-02 | (vacío) | hermione2025 | "Por favor, completa ambos campos." y no ingresa | ✅ |
| LOG-03 | (vacío) | 123 | "Por favor, completa ambos campos." y no ingresa | ✅ |
| LOG-04 | ron@hogwarts.com | (vacío) | "Por favor, completa ambos campos." y no ingresa | ✅ |
| LOG-05 | ron@hogwarts.com | hermione2025 | Redirige a la página de Bienvenida | ✅ |
| LOG-06 | ron@hogwarts.com | 123 | "Usuario correcto, pero la contraseña es incorrecta." y no ingresa | ✅ |
| LOG-07 | vyvs@mail.com | (vacío) | "Por favor, completa ambos campos." y no ingresa | ✅ |
| LOG-08 | vyvs@mail.com | hermione2025 | "El usuario no es correcto." y no ingresa | ✅ |
| LOG-09 | vyvs@mail.com | 123 | "El usuario no es correcto." y no ingresa | ✅ |
| LOG-10 | harry.com | (vacío) | "Por favor, completa ambos campos." y no ingresa | ✅ |
| LOG-11 | harry.com | hermione2025 | "Por favor, ingrese un correo electrónico válido." y no ingresa | ✅ |
| LOG-12 | harry.com | 123 | "Por favor, ingrese un correo electrónico válido." y no ingresa | ✅ |
| LOG-13 | ron@hogwarts.com ×3 | 123 ×3 | Advertencia de bloqueo tras el 3.er intento | ❌ defecto |

### Decisiones tomadas

- **LOG-06, LOG-08 y LOG-09.** La tabla indica como resultado esperado "Acceso no
  autorizado. Solicitar ingreso de datos válidos", que no es un texto verificable. Se
  automatizó verificando **el mensaje concreto que muestra el sistema** (que cumple con lo
  esperado) **y que el usuario no accede** (sigue en la página de inicio de sesión).
- **Texto exacto de los mensajes.** Se tomaron del código de la página. En LOG-08 y LOG-09
  el sistema muestra "El usuario no es correcto." (con punto final), aunque la tabla lo
  registra sin el punto.
- **Aislamiento.** Cada escenario corre en un contexto de navegador nuevo, para que el
  contador de intentos fallidos de un caso no afecte a otro.
- **Page Object Model.** Los localizadores están sólo en `pages/`: si cambia la interfaz,
  se modifica un único archivo y los escenarios no cambian.
