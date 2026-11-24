# Café Origen Analítica v1.0

Motor de análisis de ventas para Café Origen. Resume ventas reales o genera datos de prueba, y muestra resultados claros en la terminal. Está hecho con Node.js y no necesita instalar paquetes externos.

## Requisitos

- Node.js en una versión LTS.
- Git para clonar el repositorio.

## Ejecutar

Clona el repositorio y entra a la carpeta:

```bash
git clone https://github.com/valentina07333-ui/cafe-origen-analitica.git
cd cafe-origen-analitica
```

Ejecuta el reporte con las 12 ventas de muestra:

```bash
node src/reporte.js
```

Para generar y analizar otra cantidad de ventas, pasa un número entero:

```bash
node src/reporte.js 100000
```

El reporte muestra totales, ciudades, productos, clientes recurrentes, productos estrella, sugerencias de productos, el cliente para cupón y la mejor semana. Si no se indica una cantidad, usa las ventas reales de muestra.

## Preguntas que responde

- ¿Cuánto se vendió y cuántas unidades salieron?
- ¿Cuál fue la venta más grande y cuál es el ticket promedio?
- ¿Cuánto se vendió por ciudad y qué productos generaron más valor?
- ¿Qué clientes compraron más de una vez y cuál compró una sola vez?
- ¿Qué producto se vendió más en cada ciudad?
- ¿Qué productos suman el valor de una tarjeta regalo o se acercan a un presupuesto?
- ¿Cuál fue la semana de siete días con mayores ventas?
- ¿Qué ocurre con un día sin ventas?

## Comprobaciones y mediciones

```bash
node src/verificar.js
node src/pruebas.js
node src/medir.js
node src/medir.js --comparar-reportes
```

La última opción compara el cálculo del reporte anterior con el reporte v1.0 usando conjuntos de datos generados de 10.000 y 100.000 ventas. La generación queda fuera del cronómetro.
La versión anterior incluye la búsqueda lenta de clientes y puede tardar varias decenas de segundos con 100.000 ventas.

## Estructura del proyecto

```text
src/
  analitica.js       Funciones de cálculo y optimización
  catalogo.js        Productos y precios
  datos.js           Ventas de muestra y ventas diarias de septiembre
  explorar.js        Exploración de los datos de muestra
  generador.js       Generación de ventas aleatorias
  medir.js           Conteo de operaciones y medición de tiempos
  pruebas.js         Pruebas manuales de indicadores básicos
  reporte.js         Reporte de negocio v1.0
  verificar.js       Comparaciones y casos borde
bitacora.md          Decisiones, trazas y cierre de los MiniRetos
RENDIMIENTO.md       Complejidades, mediciones y comparación de versiones
README.md            Guía del producto
```

Las ventas con cantidad cero no cuentan en los indicadores. Los nombres de ciudad se normalizan al agrupar. Un día sin ventas muestra ceros.
