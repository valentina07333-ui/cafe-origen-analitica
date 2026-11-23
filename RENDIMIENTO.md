# Rendimiento

Revisé las funciones del motor con 10.000 ventas generadas. En la tabla anoté para qué sirve cada una, cuánto crece su trabajo y qué memoria necesita. No cuento el arreglo de ventas como memoria extra, porque la función ya lo recibe.

Los tiempos son de una sola corrida y pueden salir distintos si se ejecuta otra vez. `totalCiudadCadena` la medí aparte, así que ese tiempo no sirve para compararla directamente con `totalCiudadUnaPasada`. En las funciones que terminan en `Conteo` anoté las operaciones contadas por `medir.js`.

| Función | Para qué sirve | Tiempo | Memoria extra | Cómo lo veo | Resultado con 10.000 ventas |
|---|---|---|---|---|---:|
| `valorVenta` | Calcula el valor de una venta. | O(1) | O(1) | Solo multiplica cantidad por precio. | 0,023 ms |
| `totalVendido` | Suma el valor de las ventas válidas. | O(n) | O(1) | Revisa las ventas y lleva un total. | 3,472 ms |
| `unidadesVendidas` | Suma las unidades vendidas. | O(n) | O(1) | Revisa las ventas y lleva la suma. | 0,940 ms |
| `ventaMayor` | Encuentra la venta de mayor valor. | O(n) | O(1) | Va guardando cuál es la mayor que ha visto. | 0,242 ms |
| `ticketPromedio` | Calcula el promedio por venta válida. | O(n) | O(1) | Guarda la suma y cuántas ventas contó. | 0,333 ms |
| `ventasPorCiudad` | Suma las ventas válidas de una ciudad. | O(n) | O(1) | Mira todas las ventas y suma las de esa ciudad. | 7,604 ms |
| `totalVendidoM` | Suma las ventas válidas con `filter` y `reduce`. | O(n) | O(n) | `filter` arma una lista aparte antes de sumar. | 0,383 ms |
| `unidadesVendidasM` | Suma unidades con `filter` y `reduce`. | O(n) | O(n) | También arma una lista temporal con `filter`. | 0,757 ms |
| `ventasPorCiudadM` | Suma las ventas de una ciudad con `filter` y `reduce`. | O(n) | O(n) | Primero guarda las ventas que coinciden y después las suma. | 22,779 ms |
| `totalCiudadUnaPasada` | Suma las ventas válidas de una ciudad. | O(n) | O(1) | Hace un ciclo y solo guarda el total. | 9,872 ms |
| `totalCiudadCadena` (alternativa) | Hace lo mismo con `map`, `filter`, `map` y `reduce`. | O(n) | O(n) | Hace cuatro recorridos y va creando listas temporales. | 1,463 ms |
| `totalPorCiudad` | Suma las ventas por ciudad. | O(n) | O(c), hasta O(n) | Guarda un total por ciudad; en el peor caso hay tantas ciudades como ventas. | 3,630 ms |
| `unidadesPorProducto` | Suma las unidades de cada producto. | O(n) | O(p), hasta O(n) | Guarda un total por producto; puede haber tantos productos como ventas. | 0,785 ms |
| `topProductosPorValor` | Ordena los productos por valor y devuelve los primeros k. | O(n + p log p), hasta O(n log n) | O(p), hasta O(n) | Primero suma por producto y luego ordena la lista de productos. | 1,854 ms |
| `ventasDelDia` | Busca las ventas válidas de una fecha y las devuelve. | O(n) | O(n) | Revisa todas las ventas y arma una lista con las de ese día. | 0,360 ms |
| `totalVendidoConteo` | Suma las ventas y cuenta visitas y comparaciones. | O(n) | O(1) | Recorre la lista y actualiza el total y el contador. | 0,434 ms; 20.000 operaciones |
| `ventaMayorConteo` | Busca la venta mayor y cuenta visitas y comparaciones. | O(n) | O(1) | Recorre la lista y se queda con la mayor. | 0,934 ms; 39.999 operaciones |
| `totalPorCiudadConteo` | Suma por ciudad y cuenta algunas operaciones. | O(n) | O(c), hasta O(n) | Recorre las ventas y guarda un total por ciudad. | 7,475 ms; 30.000 operaciones |
| `primeraVentaConteo` | Devuelve la primera venta si existe. | O(1) | O(1) | Solo mira si la lista está vacía y accede al primer elemento. | 0,038 ms; 2 operaciones |
| `clientesRecurrentes` | Encuentra clientes que aparecen más de una vez. | O(n³) en el peor caso | O(n) | Compara ventas entre sí y, cuando encuentra un repetido, busca si ya lo había guardado. | Unos 190 ms |

Los conteos no incluyen cada instrucción de JavaScript; son las visitas y comparaciones que decidí contar en `medir.js`. `clientesRecurrentes` tardó unos 190 ms con 10.000 ventas. En la bitácora, las corridas cercanas fueron de 8.000 ventas (alrededor de 0,1 s) y 16.000 (alrededor de 0,6 s), así que el resultado queda entre ellas. Son ejecuciones distintas y los tiempos son aproximados.

De las dos versiones de `totalCiudad`, me quedé con `totalCiudadUnaPasada`: da el mismo resultado y no crea listas temporales. La función que más puede crecer en tiempo es `clientesRecurrentes`, porque compara ventas entre sí y vuelve a buscar los clientes repetidos.

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
| `totalVendidoM` | Menos de un segundo |
| `unidadesVendidasM` | Menos de un segundo |
| `ventasPorCiudadM` | Alrededor de dos segundos |
| `totalCiudadUnaPasada` | Cerca de un segundo |
| `totalCiudadCadena` | Menos de un segundo |
| `totalPorCiudad` | Menos de un segundo |
| `unidadesPorProducto` | Menos de un segundo |
| `topProductosPorValor` | Menos de un segundo, si siguen siendo pocos productos |
| `ventasDelDia` | Menos de un segundo |
| `totalVendidoConteo` | Menos de un segundo |
| `ventaMayorConteo` | Menos de un segundo |
| `totalPorCiudadConteo` | Menos de un segundo |
| `primeraVentaConteo` | Casi inmediato |
| `clientesRecurrentes` | Alrededor de 50 minutos con los datos generados |

Para `clientesRecurrentes` me basé en la prueba de 100.000 ventas, que tardó unos 29 segundos. Al llevar esa medida a un millón, da cerca de 50 minutos. Es una aproximación con los datos generados por el proyecto; con otra distribución de clientes podría tardar bastante más.

## Riesgos

Si mañana hubiera que procesar muchas más ventas, empezaría revisando `clientesRecurrentes`. En la prueba ya tardó unos 29 segundos con 100.000 ventas. Compara las ventas entre sí y, cuando encuentra un cliente repetido, lo vuelve a buscar en la lista. Esa búsqueda adicional puede hacer que el tiempo crezca muchísimo; en el peor caso llega a O(n³).

Después miraría `topProductosPorValor`, sobre todo si el catálogo crece. La función ordena los productos y eso se va notando cuando hay muchos distintos. Con el generador actual solo hay cinco, así que por ahora no es el problema principal.

Las funciones que usan `filter` o devuelven listas y agrupaciones (`totalVendidoM`, `unidadesVendidasM`, `ventasPorCiudadM`, `ventasDelDia`, `totalPorCiudad`, `totalPorCiudadConteo` y `unidadesPorProducto`) hacen un recorrido, pero guardan resultados en arreglos u objetos. Si el volumen crece, también crece esa memoria. La alternativa `totalCiudadCadena` hace lo mismo con varios arreglos temporales; la probé, pero no la dejé en el motor.

El resto me preocupa menos: `totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `ventasPorCiudad`, `totalCiudadUnaPasada`, `totalVendidoConteo` y `ventaMayorConteo` recorren las ventas, pero solo van guardando unos pocos valores. `valorVenta` y `primeraVentaConteo` hacen casi lo mismo con pocas ventas que con muchas.

## Plan de optimización

En `clientesRecurrentes` se repite trabajo porque compara cada venta con las demás. Y cuando encuentra dos del mismo cliente, `includes` vuelve a buscarlo en la lista para revisar si ya lo había agregado.

Yo guardaría cuántas veces aparece cada cliente en un objeto. Cuando el conteo llegue a dos, lo agregaría a la lista de recurrentes. Así no tendría que comparar todos los pares ni volver a buscar al cliente. Por ahora es solo el plan; la función sigue igual.
