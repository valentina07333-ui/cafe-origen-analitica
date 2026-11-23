# Bitácora - Café Origen Analítica

## Datos y casos borde

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

Casos y decisiones:

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

Reproduje por terminal dos fallos de una versión preliminar compartida por un compañero; la versión actual ya no los presenta.

1. **Bogotá aparecía en dos grupos.** Entrada: tres ventas de valor unitario 1.000, cantidades 1, 2 y 3, con ciudades `Bogotá`, `Bogotá ` y `bogotá`. Hipótesis/causa: se usaba el texto sin normalizar como clave, igual que `medellín` del id 5. Prueba: `totalPorCiudad` devolvió una sola clave `Bogotá` con 6.000. Corrección: trim, minúsculas y primera letra mayúscula antes de agrupar.
2. **Ticket promedio daba `NaN` en un día vacío.** El 2026-09-07 no tiene ventas (la muestra cubre del 1 al 6). Sin protección, 0/0 da `NaN`. Probé `ventasDelDia` para esa fecha: dio arreglo vacío; `ticketPromedio` devolvió 0. Corrección: si no hay ventas válidas devuelve 0 sin dividir.

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

Ya sustituí la búsqueda repetida por conteo con `Map`; con 100.000 ventas generadas dio cerca de 0,01 s. En mediciones actuales: `comprasPorCliente` ~0,004 s, `clientesRecurrentes` ~0,010 s y `clientesRecurrentesSet` ~0,007 s; ambas opciones de recurrentes cumplen la meta de menos de un segundo.

Comparación adicional de tiempos:

| n | Original | `Map` | `Set` |
|---:|---:|---:|---:|
| 1.000 | 3,6 ms | 0,3 ms | 0,2 ms |
| 10.000 | 213 ms | 1,3 ms | 0,7 ms |
| 100.000 | ~40 s (medición anterior) | 10 ms | 7 ms |

La original no se volvió a correr con 100.000; una prueba anterior tardó cerca de 40 s (en otra medición se registraron 40,3 s). Los tiempos varían por los datos aleatorios. A 100.000, `Map` y `Set` terminan en milisegundos, muy debajo de la meta.

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
