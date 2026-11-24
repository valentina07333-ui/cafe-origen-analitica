# Rendimiento

Medí las funciones que reciben ventas con 10.000 ventas generadas. Las que reciben un catálogo o una lista de días se midieron con esos datos. La tabla explica qué hace cada función, cuánto crece su trabajo y qué memoria necesita. No cuento como memoria extra el arreglo que la función recibe.

Los tiempos están expresados en milisegundos con seis decimales; corresponden a una lectura de reloj de alta precisión (nanosegundos) en una corrida y pueden variar al repetirla. `clientesRecurrentes` y `clientesRecurrentesSet` se midieron sobre el mismo arreglo. `totalCiudadCadena` está disponible para comparar los dos enfoques; el reporte usa `totalCiudadUnaPasada`. En las funciones `Conteo` anoté también las operaciones contadas por `medir.js`.

| Función | Para qué sirve | Tiempo | Memoria extra | Cómo lo veo | Resultado con 10.000 ventas |
|---|---|---|---|---|---:|
| `valorVenta` | Calcula el valor de una venta. | O(1) | O(1) | Solo multiplica cantidad por precio. | 0,018054 ms |
| `totalVendido` | Suma el valor de las ventas válidas. | O(n) | O(1) | Revisa las ventas y lleva un total. | 0,585159 ms |
| `unidadesVendidas` | Suma las unidades vendidas. | O(n) | O(1) | Revisa las ventas y lleva la suma. | 0,369565 ms |
| `ventaMayor` | Encuentra la venta de mayor valor. | O(n) | O(1) | Va guardando cuál es la mayor que ha visto. | 1,451276 ms |
| `ticketPromedio` | Calcula el promedio por venta válida. | O(n) | O(1) | Guarda la suma y cuántas ventas contó. | 0,587153 ms |
| `ventasPorCiudad` | Suma las ventas válidas de una ciudad. | O(n) | O(1) | Mira todas las ventas y suma las de esa ciudad. | 0,746653 ms |
| `totalVendidoM` | Suma las ventas válidas con `filter` y `reduce`. | O(n) | O(n) | `filter` arma una lista aparte antes de sumar. | 0,512152 ms |
| `unidadesVendidasM` | Suma unidades con `filter` y `reduce`. | O(n) | O(n) | También arma una lista temporal con `filter`. | 0,457449 ms |
| `ventasPorCiudadM` | Suma las ventas de una ciudad con `filter` y `reduce`. | O(n) | O(n) | Primero guarda las ventas que coinciden y después las suma. | 0,824699 ms |
| `totalCiudadUnaPasada` | Suma las ventas válidas de una ciudad. | O(n) | O(1) | Hace un ciclo y solo guarda el total. | 1,143447 ms |
| `totalCiudadCadena` | Hace lo mismo con `map`, `filter`, `map` y `reduce`. | O(n) | O(n) | Hace cuatro recorridos y crea tres arreglos intermedios. | 1,652093 ms |
| `totalPorCiudad` | Suma las ventas por ciudad. | O(n) | O(c), hasta O(n) | Guarda un total por ciudad; en el peor caso hay tantas ciudades como ventas. | 2,726140 ms |
| `unidadesPorProducto` | Suma las unidades de cada producto. | O(n) | O(p), hasta O(n) | Guarda un total por producto; puede haber tantos productos como ventas. | 0,751301 ms |
| `topProductosPorValor` | Ordena los productos por valor y devuelve los primeros k. | O(n + p log p), hasta O(n log n) | O(p), hasta O(n) | Primero suma por producto y luego ordena la lista de productos. | 0,956917 ms |
| `ventasDelDia` | Busca las ventas válidas de una fecha y las devuelve. | O(n) | O(n) | Revisa todas las ventas y arma una lista con las de ese día. | 0,641164 ms |
| `totalVendidoConteo` | Suma las ventas y cuenta visitas y comparaciones. | O(n) | O(1) | Recorre la lista y actualiza el total y el contador. | 0,647616 ms; 20.000 operaciones |
| `ventaMayorConteo` | Busca la venta mayor y cuenta visitas y comparaciones. | O(n) | O(1) | Recorre la lista y se queda con la mayor. | 0,994709 ms; 39.999 operaciones |
| `totalPorCiudadConteo` | Suma por ciudad y cuenta algunas operaciones. | O(n) | O(c), hasta O(n) | Recorre las ventas y guarda un total por ciudad. | 3,226059 ms; 30.000 operaciones |
| `primeraVentaConteo` | Devuelve la primera venta si existe. | O(1) | O(1) | Solo mira si la lista está vacía y accede al primer elemento. | 0,059302 ms; 2 operaciones |
| `comprasPorCliente` | Cuenta las compras válidas de cada cliente. | O(n) promedio | O(u) | Actualiza un `Map` por cada venta con cantidad mayor que cero. | 1,426920 ms |
| `clientesRecurrentes` | Devuelve los clientes con más de una compra. | O(n) promedio | O(u) | Toma del `Map` los clientes que aparecen más de una vez. | 1,383558 ms |
| `clientesRecurrentesSet` | Hace lo mismo con dos `Set`. | O(n) promedio | O(u) | Uno recuerda quién apareció; el otro, quién se repitió. | 1,449874 ms |
| `comboRegalo` | Prueba parejas del catálogo y devuelve las que suman el valor buscado. | O(p²) | O(m) por las parejas devueltas | Revisa cada pareja distinta. | Catálogo de 8 productos; no usa ventas |
| `comboRegaloOptimizado` | Busca un complemento con `Map`. | O(p) promedio | O(p) | Recorre el catálogo una vez. | Catálogo de 8 productos; no usa ventas |
| `productoEstrellaPorCiudad` | Encuentra el producto más frecuente de cada ciudad. | O(n) promedio | O(n) | Cuenta con `Map` anidados. | 2,530993 ms |
| `primerClienteUnico` | Encuentra el primer cliente que compró una sola vez. | O(n) promedio | O(u) | Cuenta clientes y hace una segunda pasada. | 1,152806 ms |
| `mejorSemanaBruta` | Suma desde cero cada bloque de días. | O(n × k) | O(1) | Puede volver a sumar los mismos días. | 2,497615 ms con 100.000 días y k=7 |
| `mejorSemana` | Encuentra el bloque de k días con mayor total. | O(n) | O(1) | Cada paso agrega el día nuevo y resta el que sale. | 1,295665 ms con 100.000 días y k=7 |
| `parMasCercano` | Busca la pareja más cercana sin superar el presupuesto. | O(p log p) | O(p) | Ordena una copia y recorre con dos punteros. | Catálogo de 8 productos; no usa ventas |

Los conteos no incluyen cada instrucción de JavaScript; son las visitas y comparaciones que decidí contar en `medir.js`. `u` representa los clientes distintos y `p` los productos distintos. Los tiempos son de una sola corrida y pueden variar, sobre todo en funciones que crean arreglos.

`totalCiudadCadena` usa cuatro métodos: `map` y `filter` recorren todas las ventas; el segundo `map` y `reduce` recorren las que pasaron el filtro. Se puede contar como O(4n), pero Big O deja fuera el número 4 porque no cambia cómo crece el trabajo: O(4n) = O(n).

Para el reporte elegí `totalCiudadUnaPasada`: da el mismo resultado y no crea listas temporales. `totalCiudadCadena` se conserva para comparar legibilidad y memoria. `clientesRecurrentes` ahora usa un `Map`, así que evita comparar cada venta con todas las demás.

## Proyección

Para estimar el tiempo con 1.000.000 de ventas, multipliqué por 100 cada tiempo medido con 10.000 ventas. Son estimaciones de una corrida.

| Función | Proyección con 1.000.000 de ventas |
|---|---:|
| `valorVenta` | 0,018054 ms por llamada |
| `totalVendido` | 58,515900 ms |
| `unidadesVendidas` | 36,956500 ms |
| `ventaMayor` | 145,127600 ms |
| `ticketPromedio` | 58,715300 ms |
| `ventasPorCiudad` | 74,665300 ms |
| `totalVendidoM` | 51,215200 ms |
| `unidadesVendidasM` | 45,744900 ms |
| `ventasPorCiudadM` | 82,469900 ms |
| `totalCiudadUnaPasada` | 114,344700 ms |
| `totalCiudadCadena` | 165,209300 ms |
| `totalPorCiudad` | 272,614000 ms |
| `unidadesPorProducto` | 75,130100 ms |
| `topProductosPorValor` | 95,691700 ms, con los mismos 5 productos |
| `ventasDelDia` | 64,116400 ms |
| `totalVendidoConteo` | 64,761600 ms |
| `ventaMayorConteo` | 99,470900 ms |
| `totalPorCiudadConteo` | 322,605900 ms |
| `primeraVentaConteo` | 0,059302 ms (O(1)) |
| `comprasPorCliente` | 142,692000 ms |
| `clientesRecurrentes` | 138,355800 ms |
| `clientesRecurrentesSet` | 144,987400 ms |
| `productoEstrellaPorCiudad` | 253,099300 ms |
| `primerClienteUnico` | 115,280600 ms |
| `comboRegaloOptimizado` | No depende de la cantidad de ventas |
| `mejorSemana` | No depende de la cantidad de ventas |
| `parMasCercano` | No depende de la cantidad de ventas |

Las funciones de catálogo y de días fijos no aumentan cuando crece la cantidad de ventas.

## Comparación del reporte v0.1 y v1.0

Medí las dos versiones sobre el mismo arreglo generado; la generación quedó fuera del cronómetro. La línea v0.1 reproduce los cálculos base y la búsqueda original de clientes recurrentes que causaba la demora. La v1.0 calcula el reporte integrado con el conteo optimizado.

| Ventas | Reporte v0.1 | Reporte v1.0 |
|---:|---:|---:|
| 10.000 | 337,777626 ms | 7,365594 ms |
| 100.000 | 40,819200446 s | 76,228442 ms |

La comparación se ejecuta con `node src/medir.js --comparar-reportes`. En una corrida, el comando completo `node src/reporte.js 100000` tardó 0,312905166 s; las cifras varían entre corridas.

El reporte final no llama a las versiones por fuerza bruta: usa `clientesRecurrentes`, `comboRegaloOptimizado` y `mejorSemana`. Las búsquedas sobre el catálogo ordenan como máximo 8 productos, y la ventana mensual revisa 30 días. Ninguna parte del reporte final compara todas las ventas entre sí.

## Riesgos

El mayor riesgo que encontré fue la versión original de `clientesRecurrentes`. Comparaba las ventas por pares y, cuando encontraba una coincidencia, `includes` volvía a buscar en la lista de clientes repetidos. Las comparaciones por pares crecen como O(n²), y esa búsqueda puede elevar el peor caso a O(n³). Esa versión podía volverse muy lenta al crecer las ventas.

Ese riesgo ya se redujo con `comprasPorCliente` y `clientesRecurrentes`, que guardan los conteos en un `Map`, y con `clientesRecurrentesSet`, que usa dos `Set`. Ambas alternativas nuevas recorren las ventas en O(n) promedio y usan O(u) de memoria, donde u es la cantidad de clientes distintos. En una medición con 100.000 ventas, `comprasPorCliente` tardó 14,092769 ms, `Map` tardó 17,277300 ms y `Set` tardó 17,912693 ms.

Después revisaría `topProductosPorValor` si creciera mucho el catálogo: suma cada venta y ordena los p productos, con costo O(n + p log p). También vigilaría las funciones que guardan listas o agrupaciones (`totalVendidoM`, `unidadesVendidasM`, `ventasPorCiudadM`, `totalCiudadCadena`, `ventasDelDia`, `totalPorCiudad`, `totalPorCiudadConteo`, `unidadesPorProducto` y las versiones de clientes), porque su memoria adicional puede aumentar con los datos.

## Plan de optimización

En la versión original se repetía el trabajo de comparar cada venta con las que venían después. Además, cada cliente repetido podía volver a buscarse con `includes` dentro de la lista de resultados. La mejora consiste en recordar cada cliente a medida que se recorre el arreglo: un `Map` guarda cuántas compras lleva, o dos `Set` separan los clientes vistos de los repetidos. Ya implementé ambas opciones y las comparé con la versión original; el costo pasa a O(n) en promedio, a cambio de guardar hasta O(u) datos.

## Clientes recurrentes después del cambio

Antes la función comparaba cada venta con las demás. Ahora `comprasPorCliente` lleva la cuenta en un `Map`, y `clientesRecurrentes` usa esos conteos para devolver los clientes repetidos. Dejé también `clientesRecurrentesSet` para hacer lo mismo con dos `Set`. Las dos versiones entregan los clientes en el mismo orden.

En una medición con 100.000 ventas, contar las compras tardó 14,092769 ms. Obtener los recurrentes tardó 17,277300 ms con `Map` y 17,912693 ms con `Set`. Las dos opciones quedaron por debajo de 1.000 ms; las pruebas de verificación confirman que devuelven la misma lista.

### Comparación de tiempos

Las cifras siguientes son mediciones de una corrida para cada tamaño. La versión original también se midió con 100.000 ventas.

| Ventas | Original | `Map` | `Set` |
|---:|---:|---:|---:|
| 1.000 | 4,449177 ms | 0,345108 ms | 0,291227 ms |
| 10.000 | 336,267860 ms | 2,424734 ms | 1,490970 ms |
| 100.000 | 41,015764594 s | 17,277300 ms | 17,912693 ms |

Los tiempos cambian entre corridas porque los datos se generan al azar. En esta medición con 100.000 ventas, `Map` tardó 17,277300 ms y `Set` 17,912693 ms; ambos tiempos son menores que 1.000 ms.

También se ve al contar el trabajo: la versión original compara cada venta con las que vienen después. Las otras dos revisan las ventas una vez y luego recorren la lista de clientes distintos.

| Ventas | Pares revisados por la original | Trabajo de `Map` | Trabajo de `Set` |
|---:|---:|---:|---:|
| 1.000 | 499.500 | O(1.000 + u), lineal | O(1.000 + u), lineal |
| 10.000 | 49.995.000 | O(10.000 + u), lineal | O(10.000 + u), lineal |
| 100.000 | 4.999.950.000 | O(100.000 + u), lineal | O(100.000 + u), lineal |

En las nuevas versiones, u es la cantidad de clientes distintos y no puede ser mayor que n. Por eso n + u crece en línea con las ventas: O(n). Las comparaciones por pares de la original crecen como O(n²); además, `includes` puede hacer que su peor caso llegue a O(n³).

La mejora también usa memoria para guardar los clientes distintos. Es O(u), y como u puede llegar a n, en el peor caso es O(n). A cambio, `Map` y `Set` evitan volver a recorrer la lista para encontrar un cliente; esas búsquedas toman O(1) en promedio.
