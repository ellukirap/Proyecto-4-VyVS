# Proyecto 4 — Testing Funcional Automatizado (en comisión)

**Materia:** Verificación y Validación de Software  
**Sistema bajo prueba:** Obra Social de los Trabajadores de Hogwarts  
**Apertura:** viernes, 2 de octubre de 2026, 00:01  
**Cierre:** viernes, 16 de octubre de 2026, 23:59

## Referencias

- **Aplicación web:** [Login de la Obra Social de Hogwarts](http://www.cs.uns.edu.ar/~mll/temp/testing/hogwarts/login.html)
- **Planilla de casos de prueba:** [Casos de test — Login (para P4)](https://docs.google.com/spreadsheets/d/1GNRt_9EcRke3SX_6Bna0HwcHVlEMSY_ABluxqkS8isA/edit?gid=0#gid=0)

---

## 1. Contexto del sistema (Proyecto 2)

> Hola a mi mejor tester. Tenemos algo nuevo para testear. Esta vez nos toca la parte de los reintegros de la obra social de los trabajadores de Hogwarts. El sistema está parcialmente implementado y además, no está completo en lo estético. Algunas cosas se van a ver feas.

### 1.1. Inicio de Sesión

Ya hay un usuario cargado en el sistema, es el único que tenemos por ahora:

- **Usuario:** `ron@hogwarts.com`
- **Contraseña:** `hermione2025`

Sobre el login, todos los campos son requeridos. Si un usuario intenta ingresar tres veces seguidas mal (mail correcto pero contraseña incorrecta) se le advierte que al próximo intento erróneo su cuenta será bloqueada. El bloqueo de la cuenta todavía no está implementado pero sí el aviso al usuario.

Cuando el usuario hace un inicio de sesión exitoso, automáticamente se lo lleva a la página de bienvenida de la Obra Social. La página de Inicio de Sesión muestra noticias (no hay nada para hacer con eso).

### 1.2. Página de Bienvenida

La página de Bienvenida ofrece noticias generales de la Obra Social (no hay nada para hacer con eso) y cuatro opciones en el menú vertical.

- **Perfil:** Acá el usuario modifica su perfil, esto todavía no hay que testearlo porque están trabajando en eso los chicos. Quedará para la semana que viene.
- **Solicitar Bono:** Esta será la página para los bonos de la obra social. No está funcionando todavía.
- **Reintegro:** Acá se solicita el reintegro de un pago efectuado. Te lo explico en detalle más abajo.
- **Salir:** Te lleva de nuevo al Inicio de Sesión, con el mail del usuario precargado en el campo Correo electrónico.

### 1.3. Reintegro

Con respecto al reintegro, primero se debe ingresar cierta información (lo que está marcado con `*` es obligatorio). El usuario debe seleccionar si es un reintegro por una atención de un profesional o la compra de algo. Además, debe indicar cómo quiere el reintegro (si con un cheque o una transferencia). Si acá está todo cargado bien, el siguiente paso es información sobre el cheque o la transferencia. Una vez que se ingresa esa información, se vuelve al inicio con un mensaje de confirmación de que se tomó la solicitud.

Lo que es CUIT/CUIL y CBU se ingresan sólo números.

---

## 2. Proyecto 4: Situación

Ya conocen bien el sistema de reintegros de la Obra Social de los Trabajadores de Hogwarts: en el Proyecto 2 lo testearon a mano, clic por clic. Ahora vamos a dejar de depender de esos clics, empezando por el Login.

## 3. Consigna

Deben **automatizar todos los casos de test vinculados al Login** de la Obra Social. Primero, describan los casos con **Cucumber, usando Gherkin**; después, implementen esos escenarios con **Playwright**.

Para resolverlo, tomen como referencia la siguiente [tabla de casos de test](https://docs.google.com/spreadsheets/d/1GNRt_9EcRke3SX_6Bna0HwcHVlEMSY_ABluxqkS8isA/edit?gid=0#gid=0).

**Para aprobar esta entrega es requisito hacer uso del pasaje de información entre Cucumber y Playwright.**

## 4. Entregable

Compriman la carpeta del proyecto en un archivo `.zip` y súbanla con el nombre en el siguiente formato:

`nro de comisión - apellido alumno 1 - apellido alumno 2 - Proyecto 4.zip`

Incluyan también un **README breve** con los pasos para ejecutarlo.

> **Un consejo de testers para testers:** antes de entregar, prueben su propia entrega. Descompriman el `.zip` en otra carpeta, instalen las dependencias y ejecútenlo como lo haría alguien que lo ve por primera vez. Si no corre en la computadora de quien corrige, no hay mucho para corregir.

Revisen que estén todos los archivos necesarios para ejecutarlo, en especial el **`cucumber.json`**. La carpeta **`node_modules`**, en cambio, no hace falta.
