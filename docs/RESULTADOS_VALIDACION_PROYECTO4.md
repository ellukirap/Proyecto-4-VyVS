# Proyecto 4 — Corrección del entorno y validación real

Fecha: **12 de octubre de 2026**, zona `America/Buenos_Aires`.

## VERIFICADO: entorno y conservación

- Node **24.21.0**, distribución ZIP oficial para Windows x64, seleccionada en el
  `PATH` de las sesiones de prueba. npm **11.19.0**.
- SHA256 del ZIP: `158f7685b44de51f6c0df1d153526cbcd3e1bc739a8dfc607721cef75de9e541`.
- La instalación global de Windows conserva Node 25.7.0. Una terminal nueva debe
  seleccionar Node 24; las instrucciones están más abajo y en el README.
- `npm.cmd ci` instaló 87 paquetes y auditó 88: cero vulnerabilidades informadas.
  El `postinstall` ejecutó `playwright install chromium` correctamente; el navegador
  necesario ya estaba disponible en la caché local.
- `npm.cmd ls --depth=0`: Cucumber **13.3.0** y Playwright Test **1.64.0**, sin
  dependencias faltantes, inválidas ni sobrantes en el primer nivel.
- Se conservaron las versiones de dependencias y los rangos originales.
  `package-lock.json` cambió únicamente en `packages[""].engines.node`, de `>=18`
  a `24.x`. Su hash permaneció igual durante `npm ci`.
- `features/login.feature`, `features/step_definitions/login.steps.js`, los dos
  Page Objects y `cucumber.json` no fueron modificados. Continúan los 13 casos,
  los esquemas de ejemplos y el pasaje de parámetros existentes.
- No se hicieron commit, push ni modificaciones al sistema Hogwarts.

## Comandos ejecutados y orden

Todos los comandos de npm se ejecutaron con Node 24 seleccionado.

| Orden | Comando / comprobación | Resultado |
|---|---|---|
| 1 | Descarga del ZIP oficial, `Get-FileHash -Algorithm SHA256`, `Expand-Archive` | SHA256 coincide con `SHASUMS256.txt` oficial |
| 2 | `node --version`; `npm.cmd --version` | 24.21.0 y 11.19.0 |
| 3 | `npm.cmd ci` | Código 0; lockfile conservado durante la instalación |
| 4 | `npm.cmd ls --depth=0` | Código 0; versiones declaradas instaladas |
| 5 | `npm.cmd run test:dry` | Código 0; 13 escenarios y 89 pasos skipped; sin undefined ni ambiguous |
| 6 | `npm.cmd run test:visible -- --name LOG-01` | Código 0; 1 escenario aprobado |
| 7 | `npm.cmd run test:visible -- --name LOG-05` | Código 0; 1 escenario aprobado |
| 8 | Otros 11 casos en perfil visible, comando de abajo | Código 1; 10 aprobados y LOG-13 fallido |
| 9 | `npm.cmd test` | Código 1; suite headless: 12 aprobados y LOG-13 fallido |
| 10 | Diagnóstico adicional con Playwright y `LoginPage` originales | Contador inicial 0; advertencia vacía en intentos 1–3 y presente en el 4 |
| 11 | Fallo de captura simulado en memoria sobre el hook existente | Contexto cerrado exactamente una vez; error original conservado |
| 12 | `node --check features/support/hooks.js`; `git diff --check` | Código 0 |

Comando usado para los otros 11 casos:

```powershell
npm.cmd run test:visible -- --name LOG-02 --name LOG-03 --name LOG-04 --name LOG-06 --name LOG-07 --name LOG-08 --name LOG-09 --name LOG-10 --name LOG-11 --name LOG-12 --name LOG-13
```

Una primera invocación de LOG-01 con una expresión que contenía `|` se detuvo
antes de ejecutar Cucumber, porque `npm.cmd` la interpretó como sintaxis de Windows.
Se corrigió el filtro y se ejecutaron los comandos simples registrados arriba.
Ese intento no fue un fallo de LOG-01.

## Resultado real por escenario

Cada caso se ejecutó en modo visible (LOG-01 y LOG-05 individualmente; los otros
11 en grupo) y también dentro de la suite headless. Los resultados coincidieron.

| Caso | Visible | Suite headless | Comprobación / resultado |
|---|---|---|---|
| LOG-01 | Aprobado | Aprobado | Ambos campos vacíos: mensaje oficial y permanencia en login |
| LOG-02 | Aprobado | Aprobado | Correo vacío y contraseña válida: mensaje de campos obligatorios |
| LOG-03 | Aprobado | Aprobado | Correo vacío y contraseña inválida: mensaje de campos obligatorios |
| LOG-04 | Aprobado | Aprobado | Correo registrado y contraseña vacía: mensaje de campos obligatorios |
| LOG-05 | Aprobado | Aprobado | Redirección a `bienvenida.html`, encabezado de noticias y enlace Salir visibles |
| LOG-06 | Aprobado | Aprobado | Rechazo con mensaje de contraseña incorrecta y permanencia en login |
| LOG-07 | Aprobado | Aprobado | Correo no registrado y contraseña vacía: mensaje de campos obligatorios |
| LOG-08 | Aprobado | Aprobado | Rechazo con mensaje de usuario incorrecto y permanencia en login |
| LOG-09 | Aprobado | Aprobado | Rechazo con mensaje de usuario incorrecto y permanencia en login |
| LOG-10 | Aprobado | Aprobado | Contraseña vacía: se prioriza el mensaje de campos obligatorios |
| LOG-11 | Aprobado | Aprobado | Mensaje oficial de formato de correo inválido |
| LOG-12 | Aprobado | Aprobado | Mensaje oficial de formato de correo inválido |
| LOG-13 | Fallido | Fallido | Advertencia vacía después de tres intentos; defecto de Hogwarts |

La suite final informó **13 escenarios: 12 passed, 1 failed**; **89 pasos: 87
passed, 1 skipped, 1 failed**. El paso skipped es la comprobación de permanencia
de LOG-13, posterior a la aserción fallida. Los hooks de cierre pasaron.

Resumen extraído del reporte real, sin copiar credenciales:
[resultados-suite.json](evidencias/resultados-suite.json).

Reportes completos locales, excluidos de Git:

- `reportes/reporte.html` y `reportes/reporte.json`: última suite completa.
- `reportes/suite-headless.html` y `reportes/suite-headless.json`: copia de esa suite.
- `reportes/restantes-visible.html` y `reportes/restantes-visible.json`: grupo de 11.
- `reportes/log-01.json` y `reportes/log-05.json`: ejecuciones individuales iniciales.

## DEFECTO DEL SISTEMA CONFIRMADO: LOG-13

**Esperado:** tras tres intentos consecutivos con correo registrado y contraseña
incorrecta, mostrar `Atención, su cuenta está a punto de ser bloqueada.`.

**Observado:** al tercer intento, `#warning-message` permanece vacío y solamente
aparece `Usuario correcto, pero la contraseña es incorrecta.` en `#error-message`.
La advertencia aparece recién en el cuarto intento.

**Evidencia de la suite:** `expect(locator).toHaveText(expected)` falla sobre
`#warning-message`, con `Received: ""` y timeout de 5000 ms. El hook adjuntó una
captura antes de cerrar el contexto:
[LOG-13-falla-suite.png](evidencias/LOG-13-falla-suite.png).

**Diagnóstico adicional:** se abrió una página nueva y se comprobó el contador
inicial 0. Cada clic se sincronizó comprobando el nuevo valor del contador antes
de registrar mensajes. Se utilizó el Page Object existente, sin reemplazar la
función `login()` ni modificar el contenido de Hogwarts.

| Intento | Contador leído | Error | Advertencia |
|---|---|---|---|
| 1 | 1 | Contraseña incorrecta | Vacía |
| 2 | 2 | Contraseña incorrecta | Vacía |
| 3 | 3 | Contraseña incorrecta | Vacía |
| 4 | 4 | Contraseña incorrecta | Texto oficial presente |

Registro completo sin credenciales:
[LOG-13-observaciones.json](evidencias/LOG-13-observaciones.json).
Capturas del [tercer intento](evidencias/LOG-13-tercer-intento.png) y del
[cuarto intento](evidencias/LOG-13-cuarto-intento.png).

La función publicada también utiliza `failedAttempts >= 4`, consistente con lo
observado. LOG-13 permanece con **tres** intentos. El cuarto fue exclusivamente
diagnóstico; no se agregó al escenario. El bloqueo efectivo no se implementó ni
se exige en esta entrega.

## Correcciones realizadas

| Archivo | Cambio y propósito |
|---|---|
| `package.json` | Agregar `test:dry` y declarar Node `24.x` |
| `package-lock.json` | Alinear exclusivamente el requisito de Node del paquete raíz |
| `features/support/hooks.js` | Cerrar el contexto en `finally` aunque falle la captura; precisar el alcance del aislamiento |
| `.gitignore` | Excluir runtime local `.tools/` y archivos `.env`, permitiendo una eventual plantilla `.env.example` |
| `README.md` | Node 24, `npm ci`, selección del runtime en PowerShell, comandos visibles/headless, resultados separados de especificación y contraseñas omitidas de la documentación |
| Este informe y `docs/evidencias/` | Registrar resultados comprobados y evidencia acotada del defecto |

Las credenciales académicas oficiales se mantienen en los escenarios originales.
No se incorporó ninguna contraseña personal ni dependencia adicional. Los reportes
completos contienen los datos Gherkin y deben conservarse localmente. Las capturas
muestran la contraseña enmascarada por el campo del navegador.

## Instrucciones exactas para PowerShell

En esta instalación local:

```powershell
Set-Location 'C:\Users\Usuario\Desktop\UNI\Proyecto4-VyVS\Proyecto-4-VyVS'
$node24 = (Resolve-Path '.tools/node-v24.21.0-win-x64').Path
$env:PATH = "$node24;$env:PATH"
node --version
npm.cmd --version
npm.cmd ci
npm.cmd run test:dry
npm.cmd run test:visible -- --name LOG-01
npm.cmd run test:visible -- --name LOG-05
npm.cmd run test:visible
```

Para la ejecución habitual sin ventana:

```powershell
npm.cmd test
```

`npm ci` ejecuta automáticamente la instalación de Chromium. Si falta el navegador
o esa descarga falla, ejecutar `npx.cmd playwright install chromium`. Hasta que
Hogwarts corrija el defecto, una suite completa termina con código 1 por LOG-13.

En una copia limpia, instalar primero Node 24 y verificar `node --version`; omitir
las dos líneas de selección de `.tools/`, porque esa carpeta no forma parte de la
entrega. Cerrar y abrir VS Code tras una instalación global para renovar el PATH.

## PENDIENTE antes de entregar

- Completar comisión e integrantes en el README.
- Comprobar reproducción desde una carpeta limpia o desde el ZIP descomprimido.
  Esa prueba de entrega todavía no se ejecutó en esta fase.
- Armar el ZIP con el nombre requerido por la consigna e incluir `cucumber.json`.
  Excluir `.git/`, `.tools/`, `node_modules/`, archivos `.env` y reportes completos.
- Conservar este informe y la evidencia del defecto. Hogwarts necesita corregir
  el umbral del aviso para que LOG-13 pase; el test conserva su esperado oficial.
- Los archivos originales de `docs/` siguen sin seguimiento, junto con este
  informe nuevo. Revisar su inclusión cuando se autorice preparar la entrega.
- Commit y push siguen pendientes de autorización.
