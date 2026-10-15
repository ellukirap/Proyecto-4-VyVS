# Prompt para Codex — Auditar, corregir y terminar el Proyecto 4

Actuá como **ingeniero de QA Automation y revisor de código** especializado en Cucumber.js, Gherkin, Playwright, JavaScript/Node.js y Page Object Model (POM). Necesito que **revises y corrijas la implementación que ya hizo mi compañero**, no que empieces el proyecto desde cero.

## Contexto y fuentes de verdad

- **Repositorio existente:** https://github.com/ellukirap/Proyecto-4-VyVS.git
- **Proyecto:** Proyecto 4 de Verificación y Validación de Software, Universidad Nacional del Sur.
- **Sistema bajo prueba:** http://www.cs.uns.edu.ar/~mll/temp/testing/hogwarts/login.html
- **Consigna:** `docs/enunciado_proyecto4.md` (si el nombre cambia, localizá el documento equivalente).
- **Casos oficiales:** Excel en `docs/`, llamado aproximadamente `Casos de test-Login (para P4).xlsx` (verificá su nombre y extensión reales).
- **Tabla online de referencia:** https://docs.google.com/spreadsheets/d/1GNRt_9EcRke3SX_6Bna0HwcHVlEMSY_ABluxqkS8isA/edit?gid=0#gid=0

**Prioridad de fuentes:** la consigna y la planilla oficial definen el alcance y los resultados esperados. El código existente muestra lo que ya se implementó, pero no es fuente de verdad sobre el comportamiento esperado. Distinguir siempre resultado esperado de resultado observado.

El alcance de esta entrega es **únicamente el Login y sus casos LOG-01 a LOG-13**. No automatices reintegros, perfil, bonos o noticias.

## Misión: preservar y corregir, no reescribir

1. Trabajá sobre el repositorio **ya abierto en VS Code**. No crees un repositorio, workspace ni proyecto paralelo.
2. Antes de tocar archivos, inspeccioná árbol de carpetas, `git status`, rama actual, remoto, `package.json`, `package-lock.json`, `cucumber.json`, `.feature`, steps, hooks, Page Objects, utilidades, README y archivos de `docs/`.
3. **No presupongas que el trabajo de mi compañero está mal.** Identificá qué sirve, qué falta, qué está duplicado y qué no cumple la consigna. Conservá implementaciones correctas, nombres y convenciones útiles.
4. No sobrescribas cambios locales ajenos ni hagas `git reset --hard`, `clean -fd`, force push, cambios de rama peligrosos o eliminación masiva. Si hay cambios sin commitear, avisame y evitá operaciones que puedan perderlos.
5. Podés aplicar correcciones locales acotadas cuando estén justificadas por la auditoría. Pedime autorización antes de reestructurar masivamente, eliminar trabajo ajeno o cambiar dependencias de forma importante. **No hagas commit ni push** sin mi autorización.

## Auditoría obligatoria antes de corregir

Prepará una tabla con columnas: `ID/requisito`, `archivo existente`, `estado (bien/parcial/faltante/incorrecto)`, `problema concreto`, `acción propuesta`.

Revisá especialmente:

- Cobertura de **LOG-01 a LOG-13**, sin omisiones ni duplicaciones accidentales.
- Archivos `.feature` válidos con Gherkin en español (`# language: es`) y pasos comprensibles.
- Pasaje **real y demostrable de parámetros**: valores de Gherkin → Step Definitions de Cucumber → métodos Page Object → acciones/assertions de Playwright. No alcanza con declararlos sin usarlos.
- Asociación entre cada paso y su definición; ningún `undefined` ni `ambiguous step`.
- Page Object Model bien utilizado: los steps expresan intención, los Page Objects encapsulan selectores e interacción; no duplicar selectores en cada step.
- Selectores comprobados en el HTML real y sincronización mediante esperas/locators robustos. No inventar IDs, textos ni URLs de destino.
- Aserciones útiles que realmente verifiquen los resultados esperados (no tests que pasan solo por hacer clic).
- Independencia entre escenarios: cookies/sesiones aisladas, pero recordar que el estado del servidor puede persistir.
- Preparación/cierre de navegadores y hooks, sin recursos abiertos o tests dependientes del orden.
- `cucumber.json` obligatorio, scripts npm, dependencias/versiones compatibles, `.gitignore`, configuración de URL/credenciales y README reproducible.
- Seguridad: no subir `.env`, tokens, contraseñas privadas ni `node_modules`.

## Reglas funcionales importantes

- LOG-01 a LOG-04 y LOG-07/LOG-10 involucran campos vacíos; respetá el mensaje esperado de la planilla.
- LOG-05: usuario registrado y contraseña correcta; comprobar ingreso y redirección **a la página de bienvenida correcta**, no solo un cambio arbitrario de URL.
- LOG-06, LOG-08 y LOG-09: credenciales no válidas; comprobar rechazo real de acceso y retroalimentación de la aplicación de acuerdo con las expectativas oficiales.
- LOG-11 y LOG-12: formato de correo inválido; verificar la validación definida en la planilla.
- **LOG-13:** tres intentos consecutivos con correo registrado y contraseña incorrecta. El resultado esperado es la advertencia `Atención, su cuenta está a punto de ser bloqueada.`; en la planilla se registró un resultado observado diferente. **No transformes el resultado observado en esperado para que pase la prueba.** El bloqueo efectivo todavía no está implementado ni debe exigirse. Antes de cada repetición sincronizá con el resultado del intento previo, y considerá que los contadores pueden persistir en el servidor. Si el test falla porque se confirma un defecto del sistema, informalo con evidencia.

El enunciado ofrece datos de un usuario de prueba del entorno docente. Usalos solo para el entorno académico, preferentemente desde variables de configuración, evitando imprimir contraseñas en logs/reporte.

## Proceso de trabajo

**Fase A — Diagnóstico.** Inspeccioná primero el proyecto real, leé los materiales de `docs/` y obtené la matriz de cobertura. Mostrame un resumen de lo que está bien, de lo que hay que corregir y de los riesgos de perder cambios. Indicá las rutas exactas de los archivos existentes. Si no podés leer el Excel o visitar el sitio, decilo expresamente y pedime el dato necesario en vez de adivinar.

**Fase B — Reparación incremental.** Sobre la base existente, corregí los errores prioritarios uno por uno: escenarios, conexión Cucumber-Playwright, Page Objects, hooks, configuración y aserciones. Explicá para cada cambio **qué archivo tocaste, qué problema solucionaste y por qué**. Conservá la estructura actual si funciona; refactorizá solo cuando mejore legibilidad o mantenibilidad sin romper la ejecución.

**Fase C — Validación real.** Comprobá versiones de Node/npm, instalá dependencias si corresponde, ejecutá `npm run test:dry` si existe (o el comando equivalente), luego los casos individuales y finalmente la suite completa. Cuando haga falta, inspeccioná el Login real mediante Playwright Codegen o navegador. Clasificá fallos como: problema del test, configuración/datos, inaccesibilidad del sitio o posible defecto de la aplicación. Nunca afirmes que pasó algo sin haberlo ejecutado. Si el sitio no está accesible, verificá todo lo posible en seco y explicá el bloqueo.

**Fase D — Entrega.** Comprobá que `README.md` indique requisitos, `npm ci`, instalación del navegador, configuración y comando de ejecución. Verificá que `cucumber.json` esté en el ZIP, y que `node_modules` no esté. Hacé una prueba de reproducción desde una carpeta limpia si el entorno lo permite. No elimines el repositorio original.

## Formato de tus respuestas

- Explicá en español, con claridad técnica, y usá nombres concretos de archivos.
- Primero presentá **un diagnóstico fundado en el código existente**, no una arquitectura imaginaria.
- Después mostrámelo en forma de tabla de problemas y prioridades, seguido de los cambios realizados y resultados de los comandos.
- Separá siempre **VERIFICADO**, **PENDIENTE** y **POSIBLE DEFECTO DEL SISTEMA**.
- Si encontrás un comportamiento no especificado, consultame; no cambies silenciosamente los resultados esperados.

**Empezá ahora leyendo el repositorio local y `docs/`. No generes una nueva implementación desde cero. Hacé la auditoría y luego avanzá con correcciones pequeñas y justificadas; detenete para pedirme autorización si una corrección implica cambios destructivos o una reestructuración grande.**
