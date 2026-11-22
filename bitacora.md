# Bitácora - Café Origen Analítica

## Diccionario de datos

Cada registro de ventas es una línea de venta: un cliente compra una cantidad de un producto, en una ciudad y en un día concreto.

id: número. Identifica cada registro. Va del 1 al 12 y no se repite.

fecha: texto. Es el día de la venta, escrito como 2026-09-01. Lo dejo como texto porque por ahora no necesito hacer cálculos con fechas.

cliente: texto. Es el código del cliente, por ejemplo C01. Es un código y no un número, y un mismo cliente puede aparecer varias veces.

producto: texto. Es el nombre de lo que se vendió. En el café la presentación va dentro del nombre, por ejemplo Origen Huila 500 g. También hay accesorios, como la prensa francesa y el molino manual.

ciudad: texto. Es la ciudad donde se hizo la venta, por ejemplo Medellín.

cantidad: número. Son las unidades que se vendieron en esa línea.

precio: número. Es lo que cuesta una unidad, en pesos colombianos.

## Casos borde detectados

Ciudad escrita distinto. En el id 5 la ciudad aparece como medellín, en minúscula, mientras que en los demás registros es Medellín. Para JavaScript son dos textos distintos, así que al agrupar por ciudad las ventas de Medellín quedarían partidas en dos. Decisión: voy a normalizar la ciudad al procesar los datos, quitando espacios sobrantes y dejando la primera letra en mayúscula, para que las dos formas cuenten como la misma ciudad. No voy a modificar datos.js, la corrección se hace en analitica.js.

Cantidad en cero. El id 8 tiene cantidad 0, o sea que no hubo unidades vendidas. No es una venta real, pero si se deja entra en el conteo de transacciones y baja el promedio por venta. Decisión: voy a excluir los registros con cantidad 0 de todos los cálculos de ventas. El registro se queda en datos.js tal como vino.

Clientes repetidos y cliente sin compra real. El cliente C01 aparece en tres registros (ids 1, 4 y 11), y C02 y C03 aparecen dos veces cada uno. Si cuento registros, el número de clientes sale inflado. Además, C06 solo aparece en el id 8, que tiene cantidad 0, así que en la práctica no compró nada. Decisión: voy a contar clientes únicos, no filas, y lo haré después de excluir los registros con cantidad 0, de modo que C06 no cuente como cliente que compró.

## Plan en pseudocódigo de los indicadores

Total vendido
Recorro: todas las ventas.
Condición: cantidad mayor que 0.
Acumulo: cantidad por precio de cada venta.
Inicio: totalVendido en 0.

Unidades vendidas
Recorro: todas las ventas.
Condición: cantidad mayor que 0.
Acumulo: la cantidad de cada venta.
Inicio: totalUnidades en 0.

Venta más grande
Recorro: todas las ventas.
Condición: cantidad mayor que 0 y cantidad por precio mayor que el máximo que llevo.
Guardo: el valor más alto encontrado y el id de esa venta.
Inicio: mayorValor en 0 y mayorId sin valor.

Ticket promedio
Recorro: todas las ventas.
Condición: cantidad mayor que 0.
Cuento y acumulo: cuento las ventas válidas y sumo cantidad por precio de cada una.
Inicio: cantidadVentas en 0 y sumaValores en 0.
Al terminar: si cantidadVentas es mayor que 0, divido sumaValores entre cantidadVentas; si es 0, el ticket promedio es 0 para no dividir por cero.

## Pruebas y arreglo vacío

Probé cada función con tres entradas: el arreglo completo, un arreglo con una sola venta (el id 1) y un arreglo vacío. valorVenta recibe un registro y no un arreglo, así que la probé con el id 1, que da 84000.

Con el arreglo vacío decidí lo siguiente:

totalVendido devuelve 0, porque no hay nada que sumar.

unidadesVendidas devuelve 0, por la misma razón.

ventaMayor devuelve null, porque no existe ningún registro que pueda ser el mayor. Devolver 0 sería confuso, ya que 0 no es un registro.

ticketPromedio devuelve 0, porque dividir entre cero ventas daría NaN. Prefiero un 0 explícito.

ventasPorCiudad devuelve 0, porque no hay ventas en esa ciudad.

Resultados con el arreglo completo, un solo elemento y arreglo vacío:

totalVendido: 985000, 84000, 0
unidadesVendidas: 21, 2, 0
ventaMayor: id 10, id 1, null
ticketPromedio: 89545.45, 84000, 0
ventasPorCiudad de Medellín: 356000, 84000, 0

## Verificación a mano con tabla de traza

Verifiqué dos resultados siguiendo el ciclo venta por venta. El id 8 se omite porque su cantidad es 0.

### totalVendido

Empieza con total en 0.

| id | cantidad | precio | valor de la venta | total después |
|----|----------|--------|-------------------|---------------|
| 1 | 2 | 42000 | 84000 | 84000 |
| 2 | 1 | 26000 | 26000 | 110000 |
| 3 | 1 | 95000 | 95000 | 205000 |
| 4 | 1 | 42000 | 42000 | 247000 |
| 5 | 3 | 45000 | 135000 | 382000 |
| 6 | 2 | 26000 | 52000 | 434000 |
| 7 | 1 | 120000 | 120000 | 554000 |
| 8 | 0 | 42000 | se omite | 554000 |
| 9 | 2 | 45000 | 90000 | 644000 |
| 10 | 4 | 42000 | 168000 | 812000 |
| 11 | 1 | 95000 | 95000 | 907000 |
| 12 | 3 | 26000 | 78000 | 985000 |

Resultado a mano: 985000.

### ventaMayor

Empieza con mayor en null.

| id | valor de la venta | comparación | mayor después |
|----|-------------------|-------------|---------------|
| 1 | 84000 | mayor es null | id 1 |
| 2 | 26000 | no supera 84000 | id 1 |
| 3 | 95000 | supera 84000 | id 3 |
| 4 | 42000 | no supera 95000 | id 3 |
| 5 | 135000 | supera 95000 | id 5 |
| 6 | 52000 | no supera 135000 | id 5 |
| 7 | 120000 | no supera 135000 | id 5 |
| 8 | se omite | cantidad 0 | id 5 |
| 9 | 90000 | no supera 135000 | id 5 |
| 10 | 168000 | supera 135000 | id 10 |
| 11 | 95000 | no supera 168000 | id 10 |
| 12 | 78000 | no supera 168000 | id 10 |

Resultado a mano: la venta mayor es el id 10, con 168000.

Resultado del programa: totalVendido dio 985000 y ventaMayor dio el id 10. Coinciden con la traza a mano.

## Preguntas que responde cada función

valorVenta
¿Qué recorro? Nada, recibe un solo registro.
¿Qué filtro? Nada.
¿Qué transformo? El registro en un número: cantidad por precio.
¿Qué acumulo? Nada.
¿Cómo agrupo? No agrupo.

totalVendido y totalVendidoM
¿Qué recorro? Todas las ventas.
¿Qué filtro? Las que tienen cantidad mayor que 0.
¿Qué transformo? Cada venta en su valor, con valorVenta.
¿Qué acumulo? La suma de esos valores, empezando en 0.
¿Cómo agrupo? No agrupo, el resultado es un solo número.

unidadesVendidas y unidadesVendidasM
¿Qué recorro? Todas las ventas.
¿Qué filtro? Las que tienen cantidad mayor que 0.
¿Qué transformo? Nada, uso la cantidad tal cual.
¿Qué acumulo? La suma de las cantidades, empezando en 0.
¿Cómo agrupo? No agrupo.

ventaMayor
¿Qué recorro? Todas las ventas.
¿Qué filtro? Las que tienen cantidad mayor que 0.
¿Qué transformo? Cada venta en su valor, solo para compararla.
¿Qué acumulo? No sumo. Guardo el registro con el valor más alto visto hasta ahora, empezando en null.
¿Cómo agrupo? No agrupo.

ticketPromedio
¿Qué recorro? Todas las ventas.
¿Qué filtro? Las que tienen cantidad mayor que 0.
¿Qué transformo? Cada venta en su valor.
¿Qué acumulo? Dos cosas: la suma de valores y la cuenta de ventas válidas, ambas empezando en 0. Al final divido, y si no hay ventas válidas devuelvo 0.
¿Cómo agrupo? No agrupo.

ventasPorCiudad y ventasPorCiudadM
¿Qué recorro? Todas las ventas.
¿Qué filtro? Las que tienen cantidad mayor que 0 y cuya ciudad, sin espacios y en minúscula, es igual a la ciudad buscada.
¿Qué transformo? Cada venta en su valor. También normalizo el texto de la ciudad para poder compararlo.
¿Qué acumulo? La suma de los valores, empezando en 0.
¿Cómo agrupo? No agrupo, filtro una sola ciudad.

totalPorCiudad
¿Qué recorro? Todas las ventas.
¿Qué filtro? Las que tienen cantidad mayor que 0.
¿Qué transformo? La ciudad, quitando espacios y dejando la primera letra en mayúscula; y cada venta en su valor.
¿Qué acumulo? El total de cada ciudad, que empieza en 0 la primera vez que aparece.
¿Cómo agrupo? Con un objeto cuyas claves son los nombres de ciudad normalizados.

unidadesPorProducto
¿Qué recorro? Todas las ventas.
¿Qué filtro? Las que tienen cantidad mayor que 0.
¿Qué transformo? Nada, uso la cantidad tal cual.
¿Qué acumulo? Las unidades de cada producto, que empiezan en 0 la primera vez que aparece.
¿Cómo agrupo? Con un objeto cuyas claves son los nombres de producto.

topProductosPorValor
¿Qué recorro? Primero todas las ventas, y después la lista de productos ya agrupados.

## Errores reportados por la gerente

Una versión preliminar que le compartió un compañero mostraba dos errores. Los reproduje con una entrada concreta desde la terminal y comprobé que mi versión ya no los presenta.

Error 1: Bogotá aparecía dos veces

Síntoma: en el total por ciudad, Bogotá salía como dos grupos distintos, con el total partido en dos.

Entrada que lo produce: ventas cuya ciudad está escrita Bogotá, Bogotá con un espacio al final y bogotá en minúscula.

Hipótesis: el agrupador usa el texto de la ciudad tal como viene, así que JavaScript trata cada variante como una clave distinta.

Prueba realizada: pasé a totalPorCiudad tres ventas de 1000 con cantidades 1, 2 y 3, escritas con las tres variantes. El resultado tiene una sola clave, Bogotá, con 6000.

Causa: la ciudad no se normalizaba antes de usarla como clave. Es el mismo caso del id 5, que viene como medellín.

Corrección: totalPorCiudad quita los espacios con trim, pasa todo a minúscula y deja la primera letra en mayúscula antes de agrupar. En mi versión el error ya no existe.

Error 2: el ticket promedio daba NaN en un día sin ventas

Síntoma: al filtrar un día sin ventas, el ticket promedio salía NaN.

Entrada que lo produce: el día 2026-09-07, que no tiene ventas porque la muestra va del 1 al 6 de septiembre.

Hipótesis: al no haber ventas, la función divide 0 entre 0, y eso da NaN en JavaScript.

Prueba realizada: filtré el día 2026-09-07 con ventasDelDia, que devolvió un arreglo vacío, y pasé ese arreglo a ticketPromedio. Devolvió 0.

Causa: la división no estaba protegida cuando la cantidad de ventas válidas es 0.

Corrección: ticketPromedio revisa si la cantidad de ventas válidas es 0 y, en ese caso, devuelve 0 sin dividir. En mi versión el error ya no existe.