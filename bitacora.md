# Bitácora - Café Origen Analítica

## Diccionario de datos

Cada fila es una venta de un producto a un cliente, en una ciudad y fecha.

| Campo | Tipo y significado |
|---|---|
| `id` | Número único del registro: 1–12. |
| `fecha` | Texto `AAAA-MM-DD`; se conserva así porque aún no se calculan fechas. |
| `cliente` | Código de texto (p. ej., C01); puede repetirse y no es número. |
| `producto` | Texto con presentación incluida (p. ej., Origen Huila 500 g); también hay prensa francesa y molino manual. |
| `ciudad` | Texto del lugar de venta (p. ej., Medellín). |
| `cantidad` | Número de unidades de esa línea. |
| `precio` | Precio unitario en pesos colombianos. |

## Casos borde detectados

- **Ciudad con escritura distinta:** id 5 dice `medellín`; JavaScript lo separaría de `Medellín`. Normalizo al procesar en `analitica.js` (trim y mayúsculas/minúsculas coherentes); no cambio `datos.js`.
- **Cantidad cero:** id 8 tiene cantidad 0; no es venta real y altera conteos y promedios. Excluyo cantidades 0 de todos los cálculos, pero dejo el registro en `datos.js`.
- **Clientes repetidos:** C01 aparece en ids 1, 4 y 11; C02 y C03, dos veces cada uno. Cuento clientes únicos tras excluir cantidad 0; C06 solo figura en id 8 y no cuenta como comprador.

## Indicadores: lógica y resultados

Las seis funciones iniciales usan `for...of`, no `map`, `filter` ni `reduce` (estos aparecen en ejercicios posteriores).

| Indicador | Recorrido y cálculo |
|---|---|
| `valorVenta` | Recibe una fila y devuelve cantidad × precio; no recorre ni agrupa. |
| `totalVendido` | Suma `valorVenta` de filas con cantidad > 0; inicia en 0. |
| `unidadesVendidas` | Suma cantidades > 0; inicia en 0. |
| `ventaMayor` | Entre filas con cantidad > 0 conserva la de mayor cantidad × precio; inicia en `null`, sin ventas devuelve `null`. |
| `ticketPromedio` | Suma valores y cuenta filas válidas; divide al final, o devuelve 0 si no hay ventas válidas. |
| `ventasPorCiudad` | Suma valores válidos cuya ciudad normalizada (trim y minúsculas) coincide con la buscada; inicia en 0. |
| `totalPorCiudad` | Suma valores válidos en un objeto por ciudad; quita espacios, pasa a minúscula y capitaliza la primera letra; inicia cada total en 0. |

Probé cada función con los datos completos, una venta (id 1) y un arreglo vacío. `valorVenta` recibe una fila, no un arreglo; con id 1 da 84.000. En vacío: `totalVendido`, `unidadesVendidas`, `ticketPromedio` y `ventasPorCiudad` dan 0; `ventaMayor`, `null` (0 no sería un registro). Resultados (completo / id 1 / vacío):

| Función | Resultados |
|---|---|
| `totalVendido` | 985.000 / 84.000 / 0 |
| `unidadesVendidas` | 21 / 2 / 0 |
| `ventaMayor` | id 10 / id 1 / `null` |
| `ticketPromedio` | 89.545,45 / 84.000 / 0 |
| `ventasPorCiudad` (Medellín) | 356.000 / 84.000 / 0 |

### Plan en pseudocódigo de los indicadores

- **`valorVenta(venta)`:** recibir un registro; multiplicar `cantidad` por `precio`; devolver el resultado.
- **`totalVendido(ventas)`:** iniciar total en 0; recorrer cada venta; si cantidad > 0, sumar `valorVenta`; devolver total.
- **`unidadesVendidas(ventas)`:** iniciar unidades en 0; recorrer cada venta; si cantidad > 0, sumar cantidad; devolver unidades.
- **`ventaMayor(ventas)`:** iniciar mayor en `null`; recorrer cada venta; si cantidad > 0 y no hay mayor o su valor supera al mayor actual, guardar el registro; devolver el registro o `null`.
- **`ticketPromedio(ventas)`:** iniciar suma y contador en 0; recorrer cada venta; si cantidad > 0, sumar su valor y aumentar el contador; devolver 0 si el contador es 0, si no suma / contador.
- **`ventasPorCiudad(ventas, ciudad)`:** normalizar ciudad buscada con `trim` y `toLowerCase`; iniciar total en 0; recorrer ventas; si cantidad > 0 y la ciudad normalizada coincide, sumar `valorVenta`; devolver total.

### Trazas manuales

**`totalVendido`** inicia en 0; se omite id 8 (cantidad 0).

| id | Cant. | Precio | Valor | Total |
|---:|---:|---:|---:|---:|
| 1 | 2 | 42.000 | 84.000 | 84.000 |
| 2 | 1 | 26.000 | 26.000 | 110.000 |
| 3 | 1 | 95.000 | 95.000 | 205.000 |
| 4 | 1 | 42.000 | 42.000 | 247.000 |
| 5 | 3 | 45.000 | 135.000 | 382.000 |
| 6 | 2 | 26.000 | 52.000 | 434.000 |
| 7 | 1 | 120.000 | 120.000 | 554.000 |
| 8 | 0 | 42.000 | Omitido | 554.000 |
| 9 | 2 | 45.000 | 90.000 | 644.000 |
| 10 | 4 | 42.000 | 168.000 | 812.000 |
| 11 | 1 | 95.000 | 95.000 | 907.000 |
| 12 | 3 | 26.000 | 78.000 | 985.000 |

Resultado manual: 985.000.

**`ventaMayor`** inicia en `null`:

| id | Valor | Comparación | Mayor tras la fila |
|---:|---:|---|---|
| 1 | 84.000 | Mayor era `null` | id 1 |
| 2 | 26.000 | No supera 84.000 | id 1 |
| 3 | 95.000 | Supera 84.000 | id 3 |
| 4 | 42.000 | No supera 95.000 | id 3 |
| 5 | 135.000 | Supera 95.000 | id 5 |
| 6 | 52.000 | No supera 135.000 | id 5 |
| 7 | 120.000 | No supera 135.000 | id 5 |
| 8 | Omitido | Cantidad 0 | id 5 |
| 9 | 90.000 | No supera 135.000 | id 5 |
| 10 | 168.000 | Supera 135.000 | id 10 |
| 11 | 95.000 | No supera 168.000 | id 10 |
| 12 | 78.000 | No supera 168.000 | id 10 |

Resultado manual y del programa: id 10, valor 168.000; coincide con la traza. `totalVendido` también dio 985.000.

### Qué hace cada grupo de funciones

- `totalVendido` / `totalVendidoM`: recorren ventas válidas, convierten cada fila a valor con `valorVenta` y suman desde 0; un número, sin agrupar.
- `unidadesVendidas` / `unidadesVendidasM`: recorren ventas válidas, suman cantidad desde 0; sin transformación ni agrupación.
- `ventaMayor`: recorre ventas válidas, compara su valor y conserva el registro máximo desde `null`; no suma ni agrupa.
- `ticketPromedio`: recorre ventas válidas, acumula suma y cuenta desde 0; divide al final o da 0 si no hay filas; sin grupos.
- `ventasPorCiudad` / `ventasPorCiudadM`: recorren ventas válidas, normalizan ciudad y filtran una ciudad; suman valores desde 0, sin agrupar.
- `totalPorCiudad`: recorre ventas válidas, normaliza ciudad y valor, y acumula por clave normalizada en un objeto.
- `productoEstrellaPorCiudad`: con `Map` anidados cuenta filas válidas por ciudad y producto; devuelve un objeto ciudad → producto más frecuente. En empates conserva el primero visto. Tiempo O(n) promedio y espacio O(n).
- `primerClienteUnico`: primera pasada cuenta compras válidas por cliente con `Map`; segunda recorre las ventas en orden y devuelve el primer código con conteo 1, o `null` si no existe. Cantidad 0 no cuenta como compra. Tiempo O(n) promedio y espacio O(u), donde u es clientes distintos.
- `unidadesPorProducto`: suma cantidades válidas por producto en objeto; cada total inicia en 0.
- `topProductosPorValor`: suma valor por producto; transforma cada par producto-total a `{ producto, valor }`, ordena una copia descendente y devuelve primeros `k` con `slice` (usa `Object.entries`).

## Errores reportados por la gerente

La versión actual no presenta estos fallos. Añadí pruebas reproducibles en `src/verificar.js` para comprobar las entradas que los provocaban.

### Bogotá aparecía en dos grupos

- **Síntoma:** el reporte separaba una ciudad en varias claves por diferencias de mayúsculas o espacios.
- **Entrada que lo produce:** tres ventas de valor unitario 1.000, cantidades 1, 2 y 3, con ciudades `Bogotá`, `Bogotá ` y `bogotá`.
- **Hipótesis:** el texto de ciudad se usa directamente como clave, sin normalización.
- **Prueba realizada:** ejecuté `totalPorCiudad` con esas ventas; la verificación comprobó que hay una sola clave (`Bogotá`) y su total es 6.000.
- **Causa:** los nombres se agrupaban sin quitar espacios laterales ni unificar mayúsculas y minúsculas.
- **Corrección:** `totalPorCiudad` aplica `trim()`, `toLowerCase()` y capitaliza la primera letra antes de usar la ciudad como clave.

### Ticket promedio daba `NaN` en un día vacío

- **Síntoma:** el ticket promedio mostraba `NaN` cuando el filtro diario no encontraba ventas.
- **Entrada que lo produce:** fecha `2026-09-07`, que no aparece en la muestra, filtrada con `ventasDelDia`.
- **Hipótesis:** al no haber ventas, el cálculo divide el total entre cero.
- **Prueba realizada:** `ventasDelDia(ventas, "2026-09-07")` devuelve `[]`; `ticketPromedio([])` devuelve `0`. `src/verificar.js` comprueba ambas condiciones.
- **Causa:** dividir suma 0 entre contador 0 produce `NaN` en JavaScript.
- **Corrección:** `ticketPromedio` devuelve 0 cuando no hay ventas válidas, antes de dividir. El reporte muestra ceros para ese día.

## Complejidad: predicción y medición de operaciones

Las funciones instrumentadas recorren una vez y hacen una cantidad fija de pasos por venta; predije crecimiento lineal (×10 operaciones al multiplicar `n` por 10), sin ciclos anidados. `totalVendidoConteo`: visita y comparación de cantidad, 2n. `ventaMayorConteo`: visita y comparación de cantidad, más una o dos comparaciones si es válida, entre 2n y 4n; estimé ×10 o casi, pues la primera venta válida compara una vez menos. `totalPorCiudadConteo`: visita, comparación de cantidad y, si válida, consulta de ciudad: hasta 3n; pocas ciudades no cambian el conteo. Si las mediciones no daban cerca de ×10, el razonamiento era incorrecto.

| n | `totalVendido` | `ventaMayor` | `totalPorCiudad` | `primeraVenta` |
|---:|---:|---:|---:|---:|
| 100 | 200 | 399 | 300 | 2 |
| 1.000 | 2.000 | 3.999 | 3.000 | 2 |
| 10.000 | 20.000 | 39.999 | 30.000 | 2 |
| 100.000 | 200.000 | 399.999 | 300.000 | 2 |

Predicción cumplida: las tres de recorrido multiplican operaciones por 10; `primeraVenta`, añadida después y no predicha, queda fija en 2. `ventaMayor` dio 4n−1 (extremo alto) porque los datos generados eran todos válidos.

| Función | Complejidad y conteo |
|---|---|
| `totalVendidoConteo` | O(n), un ciclo, 2n operaciones. |
| `ventaMayorConteo` | O(n), un ciclo, hasta 4n (medido 4n−1). |
| `totalPorCiudadConteo` | O(n), un ciclo, hasta 3n. |
| `primeraVentaConteo` | O(1), sin ciclo, siempre 2 operaciones. |

Ninguna es O(n²): sin ciclos dentro de ciclos, ×10 en `n` no produce ×100 operaciones.

## Preguntas sobre colecciones (MiniReto 3)

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
|---|---|---|---|---|---|
| `totalVendidoM` | Las ventas | Cantidad > 0 | Cada venta a su valor con `valorVenta` | Valor total | No agrupa |
| `unidadesVendidasM` | Las ventas | Cantidad > 0 | Ningún registro | Cantidades | No agrupa |
| `ventasPorCiudadM` | Las ventas | Cantidad > 0 y ciudad normalizada coincidente | Ciudad a minúsculas y sin espacios laterales para comparar | Valor total | No agrupa |
| `totalPorCiudad` | Las ventas | Cantidad > 0 | Ciudad a una clave normalizada | Valor vendido | Por ciudad, en un objeto |
| `unidadesPorProducto` | Las ventas | Cantidad > 0 | Ningún registro | Unidades | Por producto, en un objeto |
| `topProductosPorValor` | Las ventas | Cantidad > 0 | Pares producto-total a objetos `{ producto, valor }` | Valor por producto | Agrupa por producto; ordena una copia y devuelve los primeros `k` |

La muestra completa produce cuatro claves en `totalPorCiudad`: Medellín, Bogotá, Cali y Pereira. `topProductosPorValor(ventas, 3)` ordena por valor descendente y usa una copia antes de ordenar para conservar el arreglo recibido.

## Clientes recurrentes

### Problema, casos y optimización

Entrada: ventas con código de cliente y cantidad. Salida: clientes con más de una compra, sin repetir, contando solo filas con cantidad > 0 (cada fila cuenta como compra, aunque tenga varias unidades). No modifico ventas y conservo orden de primera aparición. Meta: menos de 1 s con 100.000 ventas.

| Entrada | Resultado esperado |
|---|---|
| Arreglo vacío | `[]` |
| `C01` | `[]` |
| `C01`, `C02` | `[]` |
| `C01`, `C01`, `C01` | `[C01]` |
| `C02`, `C01`, `C02`, `C01` | `[C02, C01]` |
| `C01` cantidad 0 y `C01` cantidad 1 | `[]` |

Se comparan códigos literalmente: `C01` y `c01` son distintos.

La versión original comparaba cada venta con las siguientes: n(n−1)/2 pares, O(n²). Para 5 ventas (ids 1–5: C01, C02, C03, C01, C04), la traza fue:

| Venta exterior | Comparada con | ¿Igual? |
|---|---|---|
| id 1 (C01) | id 2 (C02) | No |
| id 1 (C01) | id 3 (C03) | No |
| id 1 (C01) | id 4 (C01) | Sí; agrega C01 |
| id 1 (C01) | id 5 (C04) | No |
| id 2 (C02) | id 3 (C03) | No |
| id 2 (C02) | id 4 (C01) | No |
| id 2 (C02) | id 5 (C04) | No |
| id 3 (C03) | id 4 (C01) | No |
| id 3 (C03) | id 5 (C04) | No |
| id 4 (C01) | id 5 (C04) | No |

Hizo 10 comparaciones y devolvió C01; la suma (n−1)+(n−2)+…+1 = n(n−1)/2, que con 5 da 5×4/2=10 y crece como n². Además, cada coincidencia podía provocar otro recorrido con `recurrentes.includes`; su peor caso total puede llegar a O(n³), no queda garantizada en O(n²). En arreglo ordenado desfavorablemente, esa búsqueda adicional puede elevar el peor caso. La memoria original es O(n).

Para optimizar, guardo quién apareció: `comprasPorCliente` suma compras válidas en un `Map`; `clientesRecurrentes` devuelve clientes con cuenta >1. `clientesRecurrentesSet` usa dos `Set` (vistos y repetidos) y consulta `size` para devolver `[]` enseguida si no hay repetidos. Las tres mantienen orden de primera aparición y no modifican ventas. `Map` y `Set` hacen `has`/`get`/`set`/`add` en O(1) promedio; las nuevas versiones son O(n) promedio y usan O(u), donde `u` es clientes distintos (peor caso O(n)).

Ejemplos de comparación: con datos del Día 1 (12 ventas), las tres devolvieron 3 clientes; con 5.000 ventas generadas, devolvieron 1.324 cada una. Comparé las salidas tras ordenarlas y revisé los casos borde anteriores.

### Medición, estimación y conclusión

Medí la original con `console.time`/`console.timeEnd` y el generador del MiniReto 5; generación fuera del cronómetro y mediciones repetidas para reducir el efecto de la primera ejecución. Valores aproximados, variables según datos aleatorios y corrida:

| n | Tiempo original | Salto vs. tamaño previo |
|---:|---:|---:|
| 1.000 | 0,002 s | — |
| 2.000 | 0,009 s | Cerca de 4× |
| 4.000 | 0,032 s | Cerca de 4× |
| 8.000 | 0,139 s | Cerca de 4× |
| 16.000 | 0,70 s | Cerca de 5× |

Al duplicar `n`, los pares se cuadruplican; `includes` y la aleatoriedad explican variaciones. Con 16.000 ventas, proyecté 100.000 en ~27 s (menos de 2 min); medí 40,3 s. Extrapolando desde esa medición y suponiendo crecimiento cuadrático, 1.000.000 tomaría ~67 min. Es aproximado: la distribución de clientes y `includes` pueden apartarlo de esa regla.

El compañero observó que la proyección depende de los datos; confirmé que era aproximada y lo aclaré en el informe.

**Conclusión para la gerente:** el reporte se demora porque compara muchas ventas entre sí y vuelve a buscar clientes repetidos. Cuando hay más ventas, repite ese trabajo muchas más veces. La versión optimizada recuerda los clientes que ya vio y evita repetir las búsquedas.

Ya sustituí la búsqueda repetida por conteo con `Map`. Los siguientes tiempos son los valores que imprimió `console.timeEnd` en una corrida reciente; son específicos de esa ejecución y pueden cambiar al repetirla.

Comparación adicional de tiempos:

| n | Original | `Map` | `Set` | `comprasPorCliente` |
|---:|---:|---:|---:|---:|
| 1.000 | 4,25 ms | 1,835 ms | 0,308 ms | 0,098 ms |
| 2.000 | 12,66 ms | 0,281 ms | 0,244 ms | 0,207 ms |
| 4.000 | 47,069 ms | 0,645 ms | 0,477 ms | 0,413 ms |
| 8.000 | 214,237 ms | 0,801 ms | 1,103 ms | 0,422 ms |
| 10.000 | 333,156 ms | 1,718 ms | 1,206 ms | 0,835 ms |
| 16.000 | 852,285 ms | 3,367 ms | 1,396 ms | 0,998 ms |
| 100.000 | No ejecutada | 15,226 ms | 12,673 ms | 8,629 ms |

La original no se ejecutó con 100.000 ventas por su costo. Los tiempos varían por los datos aleatorios y el equipo; los decimales registran la salida de esa corrida, no una garantía de repetición. A 100.000, `Map` y `Set` terminaron en milisegundos, muy debajo de la meta.

| n | Pares de la original | Trabajo `Map` | Trabajo `Set` |
|---:|---:|---|---|
| 1.000 | 499.500 | O(1.000 + u), lineal | O(1.000 + u), lineal |
| 10.000 | 49.995.000 | O(10.000 + u), lineal | O(10.000 + u), lineal |
| 100.000 | 4.999.950.000 | O(100.000 + u), lineal | O(100.000 + u), lineal |

Como `u` ≤ `n`, n+u crece linealmente; la original compara pares O(n²) y `includes` puede subir el peor caso a O(n³). La mejora usa memoria O(u), hasta O(n), para recordar clientes; evita recorrer la lista en cada búsqueda.

## Combos de tarjeta regalo: fuerza bruta

`comboRegalo(catalogo, valor)` resuelve primero por fuerza bruta: dos ciclos prueban todos los pares distintos. El segundo empieza en `i + 1`, así no compara un producto consigo mismo ni repite el par al revés. Si la suma de precios coincide con `valor`, guarda ambos nombres. Para los 8 productos y la tarjeta de 87.000 devuelve `[["Origen Huila 500 g", "Origen Sierra 500 g"]]`.

Con n productos revisa n(n−1)/2 pares, por tanto el tiempo es O(n²). Usa O(1) de espacio auxiliar; los m combos guardados ocupan O(m), hasta O(n²) en el peor caso.

### Búsqueda optimizada con `Map`

`comboRegaloOptimizado(catalogo, valor)` recorre el catálogo una vez. Para cada producto calcula `valor - precio` y consulta si ese complemento ya está en el `Map`; si está, devuelve los dos nombres. Si no, guarda el precio y el nombre actuales. Al terminar sin coincidencias devuelve `null`. Así no combina un producto consigo mismo: la consulta ocurre antes de guardar el producto actual. Para 87.000 devuelve `Origen Huila 500 g` y `Origen Sierra 500 g`.

Con n productos, el tiempo es O(n) promedio (consultas e inserciones de `Map`) y el espacio adicional O(n), por los precios guardados. A diferencia de la fuerza bruta, devuelve el primer par encontrado, no una lista de todos los pares.

Probé la versión optimizada con estos valores: 87.000 devuelve `["Origen Huila 500 g", "Origen Sierra 500 g"]`; 61.000 devuelve `["Origen Nariño 250 g", "Taza de cerámica"]`; 62.000 devuelve `null` (sin combinación).

La versión por fuerza bruta devuelve las mismas parejas dentro de una lista y también devuelve `null` si no hay ninguna. Con catálogo vacío, ambas versiones devuelven `null`. `productoEstrellaPorCiudad([])` devuelve `{}` y `primerClienteUnico([])` devuelve `null`. Si dos productos empatan en una ciudad, conservo el primero que aparece en las ventas.

Traza para 87.000 (el catálogo se recorre en su orden; el mapa guarda precio → producto):

| Producto actual | Precio | Complemento buscado | ¿Está en Map? | Acción / resultado |
|---|---:|---:|---|---|
| Origen Nariño 250 g | 26.000 | 61.000 | No | Guarda 26.000 → Origen Nariño 250 g |
| Origen Huila 500 g | 42.000 | 45.000 | No | Guarda 42.000 → Origen Huila 500 g |
| Origen Sierra 500 g | 45.000 | 42.000 | Sí | Devuelve Huila 500 g y Sierra 500 g; termina |

La búsqueda se detiene en la tercera fila; los productos posteriores no se recorren.

## Complejidad de las funciones de la campaña

| Función | Tiempo | Espacio adicional | Motivo |
|---|---|---|---|
| `comboRegalo` | O(n²) | O(m), más O(1) auxiliar | Prueba n(n−1)/2 pares y guarda m coincidencias. |
| `comboRegaloOptimizado` | O(n) promedio | O(n) | Una pasada con consultas e inserciones en `Map`; puede guardar hasta n precios. |
| `productoEstrellaPorCiudad` | O(n) promedio | O(n) | Cuenta y luego revisa las combinaciones ciudad-producto; ambas sumas de recorridos son como máximo proporcionales a n. |
| `primerClienteUnico` | O(n) promedio | O(u), hasta O(n) | Dos pasadas y un `Map` con u clientes distintos. |

## Mejor semana y presupuesto (MiniReto 11)

`mejorSemanaBruta(dias, k)` vuelve a sumar cada bloque de `k` días. Tiene tiempo O(n × k), que puede llegar a O(n²), y usa memoria O(1). `mejorSemana(dias, k)` suma la primera semana y después agrega el día que entra y resta el que sale. Recorre los días una vez: tiempo O(n) y memoria O(1). Si `k` no es válido o supera la cantidad de días, ambas devuelven `null`. En un empate se conserva la primera semana.

Las tres primeras ventanas de septiembre quedan así:

| Inicio | Días sumados | Total (miles de pesos) |
|---:|---|---:|
| 1 | 1–7 | 3.230 |
| 2 | 2–8 | 3.210 |
| 3 | 3–9 | 3.090 |

La mejor semana empieza el día 24 y suma 3.670 miles de pesos ($3.670.000). La fuerza bruta y la ventana deslizante dieron el mismo resultado. En una prueba con 100.000 días aleatorios y `k = 7`, ambas coincidieron; esa corrida tardó 2,242 ms con fuerza bruta y 1,347 ms con ventana deslizante.

`parMasCercano(catalogo, presupuesto)` ordena una copia del catálogo por precio y mueve dos punteros. Si la suma supera el presupuesto, baja el puntero del precio mayor; si cabe, guarda la pareja y sube el del menor. Ordenar cuesta O(p log p) y recorrer cuesta O(p), así que el tiempo total es O(p log p); la copia ocupa O(p) de memoria. Si no hay pareja posible, devuelve `null`.

Traza con presupuesto de 100.000 pesos, con precios ordenados de menor a mayor:

| Izquierda | Derecha | Suma | Acción |
|---|---|---:|---|
| Filtros, 18.000 | Molino, 120.000 | 138.000 | Supera el presupuesto: mover derecha |
| Filtros, 18.000 | Prensa francesa, 95.000 | 113.000 | Supera el presupuesto: mover derecha |
| Filtros, 18.000 | Huila 1 kg, 79.000 | 97.000 | Guardar pareja; mover izquierda |
| Nariño, 26.000 | Huila 1 kg, 79.000 | 105.000 | Supera el presupuesto: mover derecha |
| Nariño, 26.000 | Sierra, 45.000 | 71.000 | No mejora 97.000; mover izquierda |
| Taza, 35.000 | Sierra, 45.000 | 80.000 | No mejora 97.000; mover izquierda |
| Huila 500 g, 42.000 | Sierra, 45.000 | 87.000 | No mejora 97.000; mover izquierda |

El resultado es Filtros de papel x100 + Origen Huila 1 kg, por 97.000 pesos. Con 140.000, el par más cercano suma exactamente 140.000; con 40.000 no hay pareja.

## Cierre de la semana: los 12 MiniRetos

| MiniReto | Qué construí y cómo resolví el problema |
|---:|---|
| 1 | Guardé las 12 ventas, revisé sus campos y anoté los casos especiales. |
| 2 | Calculé los indicadores con ciclos y revisé los resultados a mano. |
| 3 | Reescribí cálculos con métodos de arreglos y comparé sus resultados. |
| 4 | Armé el primer reporte y corregí los errores de ciudad y promedio vacío. |
| 5 | Generé ventas de prueba y conté operaciones al crecer los datos. |
| 6 | Medí la búsqueda repetida de clientes y vi que se volvía muy lenta. |
| 7 | Comparé memoria y recorridos para elegir el cálculo de ciudad en una pasada. |
| 8 | Documenté tiempos, memoria, proyecciones y riesgos en `RENDIMIENTO.md`. |
| 9 | Cambié las comparaciones repetidas por conteos con `Set` y `Map`. |
| 10 | Busqué complementos y conté productos y clientes con `Map`. |
| 11 | Usé una ventana que se desliza y dos punteros para evitar repetir cálculos. |
| 12 | Integré los análisis en un reporte ejecutable con datos reales o generados. |

En cada reto entendí primero las entradas, las salidas y los casos límite. Luego probé una solución sencilla, medí o comparé el resultado, y elegí una forma más rápida cuando la evidencia mostró trabajo repetido.
