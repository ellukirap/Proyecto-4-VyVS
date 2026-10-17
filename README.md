# Proyecto 4 — Testing Funcional Automatizado del Login

Comisión 25 · Nicolás Mérida · Lucas Solmoni

## Requisitos

- Node.js 18 o superior
- Conexión a internet

## Pasos para ejecutarlo

1. Abrir una terminal en esta carpeta.
2. Instalar las dependencias (también descarga el navegador Chromium):
   ```
   npm install
   ```
3. Ejecutar los tests:
   ```
   npm test
   ```
   Para ver el navegador mientras se ejecutan: `npm run test:visible`

El reporte queda en `reportes/reporte.html`.

## Resultado esperado

```
13 scenarios (12 passed, 1 failed)
```

LOG-13 falla a propósito: detecta un defecto del sistema. La especificación pide el
aviso de bloqueo después del 3.er intento fallido y el sistema lo muestra recién en el 4.º.
