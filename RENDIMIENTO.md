# Rendimiento

Revisé las funciones del motor con 10.000 ventas generadas. En la tabla anoté para qué sirve cada una, cuánto crece su trabajo y qué memoria necesita. No cuento el arreglo de ventas como memoria extra, porque la función ya lo recibe.

Los tiempos son de una sola corrida con ventas generadas, así que pueden variar si se vuelve a ejecutar. `clientesRecurrentes` y `clientesRecurrentesSet` se midieron sobre el mismo arreglo. `totalCiudadCadena` está disponible para comparar los dos enfoques; el reporte usa `totalCiudadUnaPasada`. En las funciones `Conteo` anoté también las operaciones contadas por `medir.js`.

| Función | Para qué sirve | Tiempo | Memoria extra | Cómo lo veo | Resultado con 10.000 ventas |
|---|---|---|---|---|---:|
| `valorVenta` | Calcula el valor de una venta. | O(1) | O(1) | Solo multiplica cantidad por precio. | 0,038 ms |
| `totalVendido` | Suma el valor de las ventas válidas. | O(n) | O(1) | Revisa las ventas y lleva un total. | 2,936 ms |
| `unidadesVendidas` | Suma las unidades vendidas. | O(n) | O(1) | Revisa las ventas y lleva la suma. | 1,166 ms |
| `ventaMayor` | Encuentra la venta de mayor valor. | O(n) | O(1) | Va guardando cuál es la mayor que ha visto. | 0,416 ms |
| `ticketPromedio` | Calcula el promedio por venta válida. | O(n) | O(1) | Guarda la suma y cuántas ventas contó. | 1,078 ms |
| `ventasPorCiudad` | Suma las ventas válidas de una ciudad. | O(n) | O(1) | Mira todas las ventas y suma las de esa ciudad. | 0,958 ms |
| `totalVendidoM` | Suma las ventas válidas con `filter` y `reduce`. | O(n) | O(n) | `filter` arma una lista aparte antes de sumar. | 11,753 ms |
| `unidadesVendidasM` | Suma unidades con `filter` y `reduce`. | O(n) | O(n) | También arma una lista temporal con `filter`. | 0,858 ms |
| `ventasPorCiudadM` | Suma las ventas de una ciudad con `filter` y `reduce`. | O(n) | O(n) | Primero guarda las ventas que coinciden y después las suma. | 1,790 ms |
| `totalCiudadUnaPasada` | Suma las ventas válidas de una ciudad. | O(n) | O(1) | Hace un ciclo y solo guarda el total. | 1,433 ms |
| `totalCiudadCadena` | Hace lo mismo con `map`, `filter`, `map` y `reduce`. | O(n) | O(n) | Hace cuatro recorridos y crea tres arreglos intermedios. | 2,592 ms |
| `totalPorCiudad` | Suma las ventas por ciudad. | O(n) | O(c), hasta O(n) | Guarda un total por ciudad; en el peor caso hay tantas ciudades como ventas. | 2,306 ms |
| `unidadesPorProducto` | Suma las unidades de cada producto. | O(n) | O(p), hasta O(n) | Guarda un total por producto; puede haber tantos productos como ventas. | 1,178 ms |
| `topProductosPorValor` | Ordena los productos por valor y devuelve los primeros k. | O(n + p log p), hasta O(n log n) | O(p), hasta O(n) | Primero suma por producto y luego ordena la lista de productos. | 1,113 ms |
| `ventasDelDia` | Busca las ventas válidas de una fecha y las devuelve. | O(n) | O(n) | Revisa todas las ventas y arma una lista con las de ese día. | 0,612 ms |
| `totalVendidoConteo` | Suma las ventas y cuenta visitas y comparaciones. | O(n) | O(1) | Recorre la lista y actualiza el total y el contador. | 0,563 ms; 20.000 operaciones |
| `ventaMayorConteo` | Busca la venta mayor y cuenta visitas y comparaciones. | O(n) | O(1) | Recorre la lista y se queda con la mayor. | 0,633 ms; 39.999 operaciones |
| `totalPorCiudadConteo` | Suma por ciudad y cuenta algunas operaciones. | O(n) | O(c), hasta O(n) | Recorre las ventas y guarda un total por ciudad. | 1,569 ms; 30.000 operaciones |
| `primeraVentaConteo` | Devuelve la primera venta si existe. | O(1) | O(1) | Solo mira si la lista está vacía y accede al primer elemento. | 0,019 ms; 2 operaciones |
| `comprasPorCliente` | Cuenta las compras válidas de cada cliente. | O(n) promedio | O(u) | Actualiza un `Map` por cada venta con cantidad mayor que cero. | 0,557 ms |
| `clientesRecurrentes` | Devuelve los clientes con más de una compra. | O(n) promedio | O(u) | Toma del `Map` los clientes que aparecen más de una vez. | 1,273 ms |
| `clientesRecurrentesSet` | Hace lo mismo con dos `Set`. | O(n) promedio | O(u) | Uno recuerda quién apareció; el otro, quién se repitió. | 0,697 ms |

Los conteos no incluyen cada instrucción de JavaScript; son las visitas y comparaciones que decidí contar en `medir.js`. `u` representa los clientes distintos y `p` los productos distintos. Los tiempos son de una sola corrida y pueden variar, sobre todo en funciones que crean arreglos.

`totalCiudadCadena` usa cuatro métodos: `map` y `filter` recorren todas las ventas; el segundo `map` y `reduce` recorren las que pasaron el filtro. Se puede contar como O(4n), pero Big O deja fuera el número 4 porque no cambia cómo crece el trabajo: O(4n) = O(n).

Para el reporte elegí `totalCiudadUnaPasada`: da el mismo resultado y no crea listas temporales. `totalCiudadCadena` se conserva para comparar legibilidad y memoria. `clientesRecurrentes` ahora usa un `Map`, así que evita comparar cada venta con todas las demás.

## Proyección

No tiene mucho sentido dar tantos decimales para una estimación. La mayoría de las funciones tardaría menos de un segundo con un millón de ventas. Estas son cuentas aproximadas basadas en las mediciones, no tiempos exactos.

| Función | Tiempo estimado con 1.000.000 de ventas |
|---|---:|
| `valorVenta` | Casi inmediato |
| `totalVendido` | Menos de un segundo |
| `unidadesVendidas` | Menos de un segundo |
| `ventaMayor` | Menos de un segundo |
| `ticketPromedio` | Menos de un segundo |
| `ventasPorCiudad` | Menos de un segundo |
| `totalVendidoM` | Alrededor de un segundo |
| `unidadesVendidasM` | Menos de un segundo |
| `ventasPorCiudadM` | Menos de un segundo |
| `totalCiudadUnaPasada` | Menos de un segundo |
| `totalCiudadCadena` | Menos de un segundo |
| `totalPorCiudad` | Menos de un segundo |
| `unidadesPorProducto` | Menos de un segundo |
| `topProductosPorValor` | Menos de un segundo, si siguen siendo pocos productos |
| `ventasDelDia` | Menos de un segundo |
| `totalVendidoConteo` | Menos de un segundo |
| `ventaMayorConteo` | Menos de un segundo |
| `totalPorCiudadConteo` | Menos de un segundo |
| `primeraVentaConteo` | Casi inmediato |
| `comprasPorCliente` | Menos de una décima de segundo |
| `clientesRecurrentes` | Alrededor de una décima de segundo, según la medición de 100.000 ventas |
| `clientesRecurrentesSet` | Menos de una décima de segundo, según la medición de 100.000 ventas |

Para las funciones O(n), tomé el tiempo de 10.000 ventas y lo multipliqué por 100. Para los conteos de clientes también revisé la prueba de 100.000: un millón de ventas daría cerca de 0,04 segundos en `comprasPorCliente`, 0,10 en `clientesRecurrentes` y 0,07 en la versión con `Set`. Son estimaciones de una corrida, no garantías.

## Riesgos

El mayor riesgo que encontré fue la versión original de `clientesRecurrentes`. Comparaba las ventas por pares y, cuando encontraba una coincidencia, `includes` volvía a buscar en la lista de clientes repetidos. Las comparaciones por pares crecen como O(n²), y esa búsqueda puede elevar el peor caso a O(n³). Esa versión podía volverse muy lenta al crecer las ventas.

Ese riesgo ya se redujo con `comprasPorCliente` y `clientesRecurrentes`, que guardan los conteos en un `Map`, y con `clientesRecurrentesSet`, que usa dos `Set`. Ambas alternativas nuevas recorren las ventas en O(n) promedio y usan O(u) de memoria, donde u es la cantidad de clientes distintos. En la medición con 100.000 ventas tardaron cerca de 0,010 segundos (`Map`) y 0,007 segundos (`Set`).

Después revisaría `topProductosPorValor` si creciera mucho el catálogo: suma cada venta y ordena los p productos, con costo O(n + p log p). También vigilaría las funciones que guardan listas o agrupaciones (`totalVendidoM`, `unidadesVendidasM`, `ventasPorCiudadM`, `totalCiudadCadena`, `ventasDelDia`, `totalPorCiudad`, `totalPorCiudadConteo`, `unidadesPorProducto` y las versiones de clientes), porque su memoria adicional puede aumentar con los datos.

## Plan de optimización

En la versión original se repetía el trabajo de comparar cada venta con las que venían después. Además, cada cliente repetido podía volver a buscarse con `includes` dentro de la lista de resultados. La mejora consiste en recordar cada cliente a medida que se recorre el arreglo: un `Map` guarda cuántas compras lleva, o dos `Set` separan los clientes vistos de los repetidos. Ya implementé ambas opciones y las comparé con la versión original; el costo pasa a O(n) en promedio, a cambio de guardar hasta O(u) datos.

## Clientes recurrentes después del cambio

Antes la función comparaba cada venta con las demás. Ahora `comprasPorCliente` lleva la cuenta en un `Map`, y `clientesRecurrentes` usa esos conteos para devolver los clientes repetidos. Dejé también `clientesRecurrentesSet` para hacer lo mismo con dos `Set`. Las dos versiones entregan los clientes en el mismo orden.

En la prueba actual con 100.000 ventas, contar las compras tardó unos 0,004 segundos. Obtener los recurrentes tardó unos 0,010 con `Map` y 0,007 con `Set`. Las dos opciones quedaron muy por debajo del segundo; en los casos que probé dieron la misma lista.

### Comparación de tiempos

Con 1.000 ventas las tres responden rápido. Con 10.000, la versión original ya tarda más de dos décimas de segundo, mientras que `Map` y `Set` tardan apenas un momento. No volví a correr la original con 100.000 ventas: en una prueba anterior se había demorado casi medio minuto. `Map` y `Set` sí las corrí con ese tamaño.

| Ventas | Original | `Map` | `Set` |
|---:|---:|---:|---:|
| 1.000 | 3,6 ms | 0,3 ms | 0,2 ms |
| 10.000 | 213 ms | 1,3 ms | 0,7 ms |
| 100.000 | cerca de 40 s (medición anterior) | 10 ms | 7 ms |

Los tiempos cambian un poco en cada corrida porque los datos se generan al azar. Pero la diferencia se nota: con 100.000 ventas, `Map` y `Set` terminaron en unos milisegundos, muy por debajo del segundo que pide el marketplace.

También se ve al contar el trabajo: la versión original compara cada venta con las que vienen después. Las otras dos revisan las ventas una vez y luego recorren la lista de clientes distintos.

| Ventas | Pares revisados por la original | Trabajo de `Map` | Trabajo de `Set` |
|---:|---:|---:|---:|
| 1.000 | 499.500 | O(1.000 + u), lineal | O(1.000 + u), lineal |
| 10.000 | 49.995.000 | O(10.000 + u), lineal | O(10.000 + u), lineal |
| 100.000 | 4.999.950.000 | O(100.000 + u), lineal | O(100.000 + u), lineal |

En las nuevas versiones, u es la cantidad de clientes distintos y no puede ser mayor que n. Por eso n + u crece en línea con las ventas: O(n). Las comparaciones por pares de la original crecen como O(n²); además, `includes` puede hacer que su peor caso llegue a O(n³).

La mejora también usa memoria para guardar los clientes distintos. Es O(u), y como u puede llegar a n, en el peor caso es O(n). A cambio, `Map` y `Set` evitan volver a recorrer la lista para encontrar un cliente; esas búsquedas toman O(1) en promedio.
