# Bitácora — Café Origen

## Datos que usé

Cada fila es una venta. Tiene `id` (número único, 1–12), `fecha` (texto `AAAA-MM-DD`), `cliente` (código que puede repetirse), `producto`, `ciudad`, `cantidad` y `precio` unitario en pesos colombianos. Dejé la fecha como texto porque todavía no hago cálculos con ella.

Encontré dos casos que había que cuidar. En el id 5, Medellín aparece como `medellín`; por eso normalizo espacios y mayúsculas en `analitica.js`, sin tocar `datos.js`. El id 8 tiene cantidad 0: lo dejo en los datos, pero no lo cuento como compra. C06 solo aparece en esa fila. También comprobé que C01 está en los ids 1, 4 y 11; C02 y C03 aparecen dos veces.

## Indicadores de ventas

Para los primeros indicadores usé ciclos `for...of`. Con `valorVenta` multiplico cantidad por precio. Las demás funciones suman unidades o valores, encuentran la venta mayor, calculan el promedio o agrupan por ciudad. Solo cuentan filas con cantidad mayor que 0. Normalizo las ciudades para que variantes como `medellín` y `Medellín` queden juntas. Si no hay ventas, el promedio da 0 y `ventaMayor` da `null`.

Probé con todos los datos, solo el id 1 y un arreglo vacío. `valorVenta` recibe una venta individual; el id 1 vale 84.000.

| Función | Todos / id 1 / vacío |
|---|---|
| `totalVendido` | 985.000 / 84.000 / 0 |
| `unidadesVendidas` | 21 / 2 / 0 |
| `ventaMayor` | id 10 / id 1 / `null` |
| `ticketPromedio` | 89.545,45 / 84.000 / 0 |
| `ventasPorCiudad` (Medellín) | 356.000 / 84.000 / 0 |

Esta tabla junta mis trazas de `totalVendido` y `ventaMayor`. El total va creciendo por fila y “Mayor” muestra el id más alto hasta ese momento. `*` marca cuando cambió; el id 8 se omite.

| id | Cant. | Precio | Valor | Total | Mayor |
|---:|---:|---:|---:|---:|---|
| 1 | 2 | 42.000 | 84.000 | 84.000 | 1* |
| 2 | 1 | 26.000 | 26.000 | 110.000 | 1 |
| 3 | 1 | 95.000 | 95.000 | 205.000 | 3* |
| 4 | 1 | 42.000 | 42.000 | 247.000 | 3 |
| 5 | 3 | 45.000 | 135.000 | 382.000 | 5* |
| 6 | 2 | 26.000 | 52.000 | 434.000 | 5 |
| 7 | 1 | 120.000 | 120.000 | 554.000 | 5 |
| 8 | 0 | 42.000 | — | 554.000 | 5 |
| 9 | 2 | 45.000 | 90.000 | 644.000 | 5 |
| 10 | 4 | 42.000 | 168.000 | 812.000 | 10* |
| 11 | 1 | 95.000 | 95.000 | 907.000 | 10 |
| 12 | 3 | 26.000 | 78.000 | 985.000 | 10 |

La traza confirma el resultado del programa: se vendieron 985.000 y la venta mayor fue la del id 10, por 168.000.

También comparé estilos. Las versiones `M` usan `filter` y `reduce`, así que crean listas aparte (O(n) de memoria). Las versiones de un ciclo usan O(1) de memoria. `totalCiudadCadena` hace `map` → `filter` → `map` → `reduce` y crea tres listas; las dos últimas etapas solo recorren las ventas filtradas. `totalCiudadUnaPasada` hace lo mismo con un ciclo. Ambas tardan O(n), pero elegí la segunda para el reporte porque no crea listas temporales; dejé la otra para comparar. `unidadesPorProducto` agrupa unidades. `topProductosPorValor` suma por producto, ordena y devuelve los primeros k; tarda O(n+p log p). `ventasDelDia` devuelve las ventas válidas de una fecha.

## Errores que corregí

- **Bogotá salía separada:** probé tres ventas de valor unitario 1.000, cantidades 1, 2 y 3, con `Bogotá`, `Bogotá ` y `bogotá`. Al normalizar, `totalPorCiudad` devuelve una sola ciudad con 6.000.
- **El promedio daba `NaN`:** el 2026-09-07 no tiene ventas (la muestra va del 1 al 6). `ventasDelDia` devuelve `[]` y `ticketPromedio` devuelve 0, sin dividir 0 entre 0.

## Conteos y memoria

Antes de medir, esperaba que los ciclos simples crecieran en línea con n: si n aumenta 10 veces, el número de operaciones también. `totalVendidoConteo` hace 2n operaciones; `ventaMayorConteo`, entre 2n y 4n; `totalPorCiudadConteo`, hasta 3n. `primeraVentaConteo` siempre hace dos.

| n | Total vendido | Venta mayor | Total por ciudad | Primera venta |
|---:|---:|---:|---:|---:|
| 100 | 200 | 399 | 300 | 2 |
| 1.000 | 2.000 | 3.999 | 3.000 | 2 |
| 10.000 | 20.000 | 39.999 | 30.000 | 2 |
| 100.000 | 200.000 | 399.999 | 300.000 | 2 |

Las medidas coincidieron con mi predicción. `ventaMayor` hizo 4n−1 porque las ventas generadas eran válidas. Las tres funciones de conteo son O(n); `primeraVentaConteo` es O(1). No son O(n²): al multiplicar n por 10, el trabajo no se multiplicó por 100.

No cuento como memoria extra el arreglo que recibe la función. Usan O(1): `valorVenta`, los indicadores de un ciclo y `totalVendidoConteo`, `ventaMayorConteo` y `primeraVentaConteo`. Usan O(n): versiones `M`, `totalCiudadCadena`, `ventasDelDia` y las funciones de clientes. `totalPorCiudad` y `totalPorCiudadConteo` guardan O(c); las agrupaciones por producto, O(p); las de clientes, O(u). c, p y u son cantidades distintas y no superan n. `topProductosPorValor` ordena todos los productos aunque al final devuelva k.

## Clientes recurrentes

Conté como compra cada fila con cantidad >0, aunque incluya varias unidades. La función devuelve, sin repetir, los clientes con más de una compra y respeta el orden en que aparecieron. No cambia las ventas; `C01` y `c01` son códigos distintos.

| Entrada | Resultado |
|---|---|
| Vacía, `C01` o `C01,C02` | `[]` |
| `C01,C01,C01` | `[C01]` |
| `C02,C01,C02,C01` | `[C02,C01]` |
| `C01` con cantidad 0 y `C01` con cantidad 1 | `[]` |

La versión original comparaba cada venta con las que venían después. Con ids 1–5 (`C01,C02,C03,C01,C04`): id 1 se compara con 2, 3, 4 y 5 (no, no, sí—agrega C01, no); id 2 con 3, 4 y 5 (no, no, no); id 3 con 4 y 5 (no, no); id 4 con 5 (no). Son 10 comparaciones y devuelve C01. En general hace n(n−1)/2 comparaciones: O(n²). Además, `includes` vuelve a buscar los clientes; en el peor caso puede llevar el tiempo a O(n³). Usa O(n) de memoria.

Para mejorarla, `comprasPorCliente` cuenta en un `Map` y `clientesRecurrentes` devuelve los conteos mayores que 1. `clientesRecurrentesSet` usa dos `Set`: uno para los vistos y otro para los repetidos. Las versiones nuevas conservan el orden, no cambian la entrada, tardan O(n) en promedio y usan O(u) de memoria. Buscar en `Map` o `Set` tarda O(1) en promedio.

Las tres versiones dieron 3 clientes con las 12 ventas y 1.324 con 5.000 ventas generadas. Comparé sus resultados ordenados y revisé los casos de la tabla. Medí la versión original con `console.time`; generé los datos antes de iniciar el reloj y repetí las corridas. Los tiempos son aproximados:

| n | Original | Al duplicar n |
|---:|---:|---:|
| 1.000 | 0,002 s | — |
| 2.000 | 0,009 s | ≈4× |
| 4.000 | 0,032 s | ≈4× |
| 8.000 | 0,139 s | ≈4× |
| 16.000 | 0,70 s | ≈5× |

Con 16.000 ventas calculé unos 27 s para 100.000, pero medí 40,3 s. Suponiendo crecimiento cuadrático, estimé 67 min para 1.000.000. Es una proyección, y depende de los datos; un compañero me señaló esto y lo aclaré en el informe.

| n | Pares original | Original | `Map` | `Set` |
|---:|---:|---:|---:|---:|
| 1.000 | 499.500 | 3,6 ms | 0,3 ms | 0,2 ms |
| 10.000 | 49.995.000 | 213 ms | 1,3 ms | 0,7 ms |
| 100.000 | 4.999.950.000 | ~40 s* | 10 ms | 7 ms |

*No repetí la versión original con 100.000; un registro anterior fue 40,3 s. En otra corrida de 100.000 ventas, `comprasPorCliente` tardó 0,004 s, `clientesRecurrentes` 0,010 s y `clientesRecurrentesSet` 0,007 s. Para un millón estimé 0,04 s, 0,10 s y 0,07 s. Son mediciones distintas, no promesas. La mejora cambia las comparaciones por pares por recorridos lineales.

## Catálogo, producto estrella y cupón

Precios: Origen Nariño 250 g $26.000; Origen Huila 500 g $42.000; Origen Sierra 500 g $45.000; filtros de papel x100 $18.000; taza de cerámica $35.000; Origen Huila 1 kg $79.000; prensa francesa $95.000; molino manual $120.000.

Primero hice `comboRegaloFuerzaBruta`: prueba cada par una vez, tarda O(n²) y devuelve todos los resultados (memoria O(m), más O(1) auxiliar). Después usé `comboRegalo`: guarda precios en un `Map` y busca el complemento antes de guardar el producto actual. Es O(n) promedio y usa O(n) de memoria; devuelve el primer par o `null`. `comboRegaloOptimizado` es un alias. Resultados: $87.000 → Origen Huila 500 g + Origen Sierra 500 g; $61.000 → Origen Nariño 250 g + taza; $62.000 y catálogo vacío → `null`. Traza para $87.000: Nariño $26.000 busca $61.000 y se guarda; Huila $42.000 busca $45.000 y se guarda; Sierra $45.000 busca $42.000 y lo encuentra.

`productoEstrellaPorCiudad` usa un `Map` de ciudades y, dentro de cada una, otro `Map` para contar productos. Ignora cantidad 0; si hay empate, gana el que apareció primero. Día 1: Medellín, Origen Huila 500 g; Bogotá, Origen Nariño 250 g; Cali, prensa francesa (empata con Sierra y aparece primero); Pereira, Origen Huila 500 g. Vacío → `{}`. Tiempo O(n) promedio, memoria O(n).

`primerClienteUnico` cuenta compras válidas en un `Map` y luego busca, en el orden de las ventas, el primer cliente con una sola compra. Día 1 → C04; vacío o sin candidato → `null`. Tiempo O(n) promedio, memoria O(u). La estrella, el cliente único y el combo optimizado son O(n) promedio.

## Mejor semana de septiembre

Totales diarios (miles de pesos): 320, 410, 280, 390, 510, 620, 700, 300, 290, 450, 480, 530, 610, 680, 350, 330, 420, 470, 560, 640, 710, 380, 360, 440, 500, 590, 650, 720, 400, 370.

`mejorSemanaBruta(dias,k)` vuelve a sumar cada bloque de k días: O((n−k+1)k), espacio O(1). Con k fijo es O(n). Si k no es entero positivo o supera n, devuelve `null`. `mejorSemana` suma la primera ventana y luego añade el día que entra y resta el que sale: O(n) tiempo y O(1) memoria. Devuelve total e inicio (día contado desde 1); en empate conserva la primera semana. Con k=7, ambas dan 3.670 y la semana empieza el día 24 (del 24 al 30).

Así cambian las primeras ventanas (miles de pesos):

```text
1: [320 410 280 390 510 620 700] → 3.230
2:  320 [410 280 390 510 620 700 300] → 3.210
3:  320  410 [280 390 510 620 700 300 290] → 3.090
```

Al mover la ventana: 3.230−320+300=3.210; luego 3.210−410+290=3.090. También probé 100.000 días aleatorios (enteros de 0 a 1.000): ambas dieron 6.159 e inicio 12.257. Tras 5 calentamientos y en 15 tandas de 20 llamadas, la mediana fue 0,348 ms para la bruta y 0,076 ms para la deslizante (≈4,6 veces más rápida). Generé los datos fuera del cronómetro; los tiempos varían.

## Par más cercano al presupuesto

`parMasCercano` ordena una copia del catálogo con comparación numérica (`a.precio-b.precio`) y usa dos índices, uno en cada extremo. Si la suma supera el presupuesto, mueve el índice derecho para bajarla. Si cabe, guarda el mejor par y mueve el izquierdo: con el derecho actual ya tiene el mayor precio posible para ese izquierdo. Devuelve dos productos distintos o `null`; nunca pasa el presupuesto. Ordenar cuesta O(n log n), recorrer O(n), total O(n log n); la copia usa O(n) de memoria. Si ya llega ordenado, recorrer cuesta O(n).

Resultados: $100.000 → filtros x100 + Huila 1 kg = $97.000; $140.000 → Sierra 500 g + prensa = $140.000; $40.000 → `null` porque los dos más baratos suman $44.000.

Traza para $100.000 (precios en miles; si pasa el presupuesto bajo el derecho; si cabe, avanzo el izquierdo para buscar una suma mayor):

| Izq. | Der. | Suma | Qué hice |
|---|---|---:|---|
| Filtros 18 | Molino 120 | 138 | Bajo derecho |
| Filtros 18 | Prensa 95 | 113 | Bajo derecho |
| Filtros 18 | Huila 1 kg 79 | 97 | Guardo 97; subo izquierdo |
| Nariño 26 | Huila 1 kg 79 | 105 | Bajo derecho |
| Nariño 26 | Sierra 45 | 71 | Conservo 97; subo izquierdo |
| Taza 35 | Sierra 45 | 80 | Conservo 97; subo izquierdo |
| Huila 500 g 42 | Sierra 45 | 87 | Conservo 97; se cruzan |

El par queda $3.000 por debajo del presupuesto.

## Resumen de los retos

- **Indicadores:** usé ciclos sobre ventas reales y arreglé ciudades con escritura distinta.
- **Rendimiento:** comparé varias formas de recorrer los datos y conté sus operaciones.
- **Clientes:** cambié comparar pares por contar con `Map` o `Set`.
- **Tarjeta regalo:** pasé de probar todos los pares a buscar el complemento con `Map`.
- **Estrella y cupón:** conté productos por ciudad y compras por cliente.
- **Mejor semana:** pasé de volver a sumar cada bloque a una ventana deslizante.
- **Presupuesto:** ordené precios y moví dos índices desde los extremos.
- **Reporte:** junté los análisis en un comando que acepta datos fijos o n ventas generadas. La comparación de v0.1 y v1.0 está en `RENDIMIENTO.md`; el reporte actual tarda algo más porque muestra más información.

## Método para resolver retos

Para optimizar clientes repetidos seguí estos pasos:

1. **Entender:** necesitaba devolver los clientes que aparecen en más de una venta válida.
2. **Ejemplos:** probé un arreglo vacío, C01 una sola vez, C01 varias veces y C01 con cantidad cero.
3. **Fuerza bruta:** comparé cada venta con las que venían después y usé `includes`. En el peor caso llegó a O(n²) o más.
4. **Optimizar:** decidí guardar cada cliente una sola vez mientras recorría las ventas.
5. **Implementar:** hice una versión con `Map` y otra con dos `Set`.
6. **Probar:** comparé las tres versiones con los datos del Día 1 y con 5.000 ventas generadas. Las listas podían tener otro orden, así que las ordené antes de compararlas.

## Cierre de los 12 MiniRetos

1. Representé las ventas y exploré sus casos especiales.
2. Hice los indicadores básicos con ciclos.
3. Reescribí cálculos con métodos y agregué agrupaciones.
4. Armé el primer reporte y corregí los errores.
5. Creé ventas aleatorias y medí operaciones.
6. Encontré que clientes recurrentes podía tardar mucho.
7. Comparé tiempo y memoria de varios recorridos.
8. Preparé el informe de rendimiento.
9. Cambié clientes recurrentes a `Map` y `Set`.
10. Agregué catálogo, combos y frecuencias.
11. Usé ventana deslizante y dos punteros.
12. Integré todo en el reporte v1.0 y revisé su resultado.
