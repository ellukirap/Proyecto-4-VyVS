# Proyecto 4 — Testing Funcional Automatizado del Login

**Verificación y Validación de Software · DCIC-UNS · 2026**
Comisión: `__` · Integrantes: `__________` · `__________`

Automatización de **todos los casos de test del Login** de la Obra Social de los
Trabajadores de Hogwarts (tabla *Casos de test-Login*, LOG-01 a LOG-13).
Los casos se describen en **Gherkin** (Cucumber) y se implementan con **Playwright**.

Sistema bajo prueba: <https://cs.uns.edu.ar/~mll/temp/testing/hogwarts/login.html>

---

## Requisitos

- **Node.js 24.x**. Para verificarlo: `node --version`
- Conexión a internet (el sistema está publicado en el servidor de la cátedra)

## Instalación

Desde la carpeta del proyecto (donde está este README):

```powershell
node --version
npm.cmd --version
npm.cmd ci
```

Instala Cucumber y Playwright y, al terminar, **descarga el navegador Chromium
automáticamente** (script `postinstall`). Si esa descarga fallara, se puede hacer a mano:

```powershell
npx.cmd playwright install chromium
```

## Ejecución

Los comandos siguientes se ejecutan desde la raíz del repositorio en PowerShell.
Se usa `npm.cmd` para no depender de la política de ejecución de scripts `.ps1`.

| Comando | Qué hace |
|---|---|
| `npm.cmd run test:dry` | Valida Gherkin y asociación de pasos sin ejecutar el navegador |
| `npm.cmd test` | Corre los 13 casos sin mostrar el navegador |
| `npm.cmd run test:visible` | Corre los 13 casos **mostrando el navegador**, en cámara lenta |
| `npm.cmd run test:visible -- --name LOG-01` | Corre LOG-01 con navegador visible |
| `npm.cmd run test:visible -- --name LOG-05` | Corre LOG-05 con navegador visible |
| `npm.cmd run test:visible -- --tags @bloqueo` | Corre LOG-13 con navegador visible |

En un dry-run correcto los escenarios aparecen como `skipped`: se comprueba su
asociación con las Step Definitions, sin ejecutar acciones ni hooks de navegador.

### Seleccionar Node 24 en Windows

Se puede instalar Node 24 desde <https://nodejs.org/en/download> y después cerrar
y volver a abrir VS Code para renovar el `PATH`. Si el instalador detecta una
versión superior y rechaza la instalación, desinstalar Node 25 desde Aplicaciones
instaladas de Windows antes de instalar Node 24.

Durante la validación se usó el ZIP oficial de Node 24.21.0, con SHA256 verificado,
extraído en `.tools/`. Si esa carpeta sigue presente, seleccionar esa distribución
para la terminal actual:

```powershell
$node24 = (Resolve-Path '.tools/node-v24.21.0-win-x64').Path
$env:PATH = "$node24;$env:PATH"
node --version
npm.cmd --version
```

La selección dura hasta cerrar esa terminal. `.tools/` es una instalación local,
se excluye de Git y del ZIP de entrega. Una copia limpia necesita Node 24 instalado.

Al terminar se generan:

- `reportes/reporte.html`: reporte visual (abrir con el navegador). Los escenarios
  que fallan incluyen una **captura de pantalla** del momento de la falla.
- `reportes/reporte.json`: el mismo resultado en formato JSON.

## Especificación y resultados de ejecución

La especificación exige que los 13 casos cumplan sus resultados esperados. LOG-13
debe mostrar `Atención, su cuenta está a punto de ser bloqueada.` al tercer intento
con correo registrado y contraseña incorrecta. No se exige un bloqueo efectivo.

Los resultados comprobados, comandos y evidencia del defecto se documentan en
[el informe de validación](docs/RESULTADOS_VALIDACION_PROYECTO4.md). Una falla de
LOG-13 produce código de salida 1; no se ignora ni se cambia el esperado para
hacer pasar la suite. Si Hogwarts se corrige, este escenario debería pasar.

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

| Caso | Correo | Contraseña | Se verifica |
|---|---|---|---|
| LOG-01 | (vacío) | (vacío) | "Por favor, completa ambos campos." y no ingresa |
| LOG-02 | (vacío) | válida | "Por favor, completa ambos campos." y no ingresa |
| LOG-03 | (vacío) | inválida | "Por favor, completa ambos campos." y no ingresa |
| LOG-04 | registrado | (vacío) | "Por favor, completa ambos campos." y no ingresa |
| LOG-05 | registrado | válida | Redirige a la página de Bienvenida |
| LOG-06 | registrado | inválida | "Usuario correcto, pero la contraseña es incorrecta." y no ingresa |
| LOG-07 | no registrado | (vacío) | "Por favor, completa ambos campos." y no ingresa |
| LOG-08 | no registrado | válida | "El usuario no es correcto." y no ingresa |
| LOG-09 | no registrado | inválida | "El usuario no es correcto." y no ingresa |
| LOG-10 | formato inválido | (vacío) | "Por favor, completa ambos campos." y no ingresa |
| LOG-11 | formato inválido | válida | "Por favor, ingrese un correo electrónico válido." y no ingresa |
| LOG-12 | formato inválido | inválida | "Por favor, ingrese un correo electrónico válido." y no ingresa |
| LOG-13 | registrado | inválida, tres intentos | Advertencia de bloqueo tras el 3.er intento |

### Decisiones tomadas

- **LOG-06, LOG-08 y LOG-09.** La tabla indica como resultado esperado "Acceso no
  autorizado. Solicitar ingreso de datos válidos", que no es un texto verificable. Se
  automatizó verificando **el mensaje concreto que muestra el sistema** (que cumple con lo
  esperado) **y que el usuario no accede** (sigue en la página de inicio de sesión).
- **Texto exacto de los mensajes.** Se tomaron del código de la página. En LOG-08 y LOG-09
  el sistema muestra "El usuario no es correcto." (con punto final), aunque la tabla lo
  registra sin el punto.
- **Aislamiento.** Cada escenario corre en un contexto y página nuevos. Esto aísla
  cookies, almacenamiento y el contador local del login actual; no reinicia un
  eventual contador del servidor.
- **Page Object Model.** Los localizadores están sólo en `pages/`: si cambia la interfaz,
  se modifica un único archivo y los escenarios no cambian.

## Datos de prueba y entrega

Se mantienen los datos oficiales del entorno docente en Gherkin para conservar los
13 casos y el pasaje de parámetros. No utilizar credenciales personales. No se
replica la contraseña válida en esta documentación. Los reportes contienen los
datos de los escenarios: son locales, están excluidos de Git y no deben publicarse
innecesariamente. `.env` y `.env.*` también están excluidos.

Antes de entregar, completar comisión e integrantes y comprobar la reproducción
desde una carpeta limpia con Node 24, `npm.cmd ci` y los comandos anteriores.
Incluir `cucumber.json`, `package-lock.json`, features, pages, README e informe;
excluir `.git/`, `.tools/`, `node_modules/`, `.env` y los reportes completos.
La evidencia acotada del defecto se encuentra en `docs/evidencias/`.
