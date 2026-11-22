# Café Origen Analítica

Un pequeño proyecto en JavaScript para entender las ventas de Café Origen, una tienda de café de origen y accesorios. Toma un registro de ventas (12 líneas, del 1 al 6 de septiembre de 2026) y saca los números que importan en un reporte por consola.

## Cómo correrlo

Solo necesitas [Node.js](https://nodejs.org), no hay nada más que instalar.

```bash
node src/reporte.js     
node src/pruebas.js      
node src/verificar.js   
```

## Qué te cuenta

- Cuánto se vendió en total y cuántas unidades
- Cuál fue la venta más grande
- El ticket promedio
- Cuánto se vendió por ciudad y por producto
- Qué productos aportan más dinero
- Cómo le fue a un día en particular

## Cosas a tener en cuenta

- Las ventas con cantidad 0 no cuentan.
- `medellín` y `Medellín` se tratan como la misma ciudad.
- Si un día no tuvo ventas, el ticket promedio es 0, no `NaN`.

Las decisiones y los errores que se corrigieron por el camino están en `bitacora.md`.