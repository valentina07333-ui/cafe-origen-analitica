# Café Origen Analítica

Reporte de consola para analizar ventas de café y accesorios. Usa JavaScript y Node.js; no requiere dependencias.

## Ejecutar

```bash
node src/reporte.js          # 12 ventas de ejemplo
node src/reporte.js 100000   # genera y analiza 100.000 ventas
```

El número debe ser un entero positivo. Los datos generados cambian en cada ejecución. El reporte también muestra la semana de septiembre calculada con los totales diarios del proyecto y las sugerencias basadas en el catálogo fijo.

## Qué muestra

Totales y promedios; ventas por ciudad y producto; productos estrella; clientes recurrentes y cliente para cupón; combo de $87.000; par bajo presupuesto de $100.000; mejor semana de siete días.

Las ventas con cantidad 0 se excluyen y las variantes de escritura de una ciudad se normalizan.

## Archivos

- `src/reporte.js`: reporte y opción de generar n ventas.
- `src/analitica.js`: funciones de análisis.
- `src/datos.js`, `src/catalogo.js`, `src/generador.js`: ventas de ejemplo, catálogo y datos aleatorios.
- `src/pruebas.js`, `src/verificar.js`, `src/medir.js`: pruebas, comparación y mediciones.
- `bitacora.md`: decisiones y trazas; `RENDIMIENTO.md`: complejidad y tiempos.

## Requisitos

- Node.js
- Terminal
- No necesita instalar paquetes externos

## Desde cero

```bash
git clone <url-del-repositorio>
cd cafe-origen-analitica
node src/reporte.js
node src/reporte.js 100000
```
