# Bitácora — Café Origen Analítica

## Datos y reglas

Cada fila es una venta. `id`: número único (1–12); `fecha`: texto `AAAA-MM-DD`; `cliente`: código de texto repetible (C01); `producto`: nombre con presentación (también hay prensa francesa y molino manual); `ciudad`: lugar; `cantidad`: unidades; `precio`: pesos colombianos por unidad. La fecha queda como texto porque aún no se calcula con ella.

- Id 5 trae `medellín`; se normalizan espacios y mayúsculas al procesar en `analitica.js`, sin editar `datos.js`.
- Id 8 tiene cantidad 0: se conserva en `datos.js`, pero se excluye de cálculos porque no es compra real y afecta conteos/promedios. C06 solo aparece allí y no cuenta como comprador.
- C01 aparece en ids 1, 4 y 11; C02 y C03, dos veces. Se cuentan clientes únicos después de excluir filas con cantidad 0.

## Indicadores base

Las seis funciones iniciales usan `for...of` (no `map`/`filter`/`reduce`; estos aparecen en ejercicios posteriores).

| Función | Cálculo |
|---|---|
| `valorVenta` | Una fila: cantidad × precio. Id 1 = 84.000. |
| `totalVendido` | Suma valores de filas con cantidad > 0, desde 0. |
| `unidadesVendidas` | Suma sus cantidades, desde 0. |
| `ventaMayor` | Conserva la fila válida de mayor valor; parte de `null` y devuelve `null` si no hay ninguna. |
| `ticketPromedio` | Suma valores / número de filas válidas; sin ventas devuelve 0 (evita 0/0 = `NaN`). |
| `ventasPorCiudad` | Suma valores válidos tras comparar ciudad con `trim` y minúsculas. |
| `totalPorCiudad` | Objeto de totales válidos por ciudad normalizada (trim, minúsculas, primera letra mayúscula). |

Resultados (arreglo completo / solo id 1 / vacío):

| Función | Resultado |
|---|---|
| `totalVendido` | 985.000 / 84.000 / 0 |
| `unidadesVendidas` | 21 / 2 / 0 |
| `ventaMayor` | id 10 / id 1 / `null` |
| `ticketPromedio` | 89.545,45 / 84.000 / 0 |
| `ventasPorCiudad` (Medellín) | 356.000 / 84.000 / 0 |

Traza de `totalVendido` (id 8 se omite; columnas: id, cantidad, precio, valor, acumulado):

| id | Cant. | Precio | Valor | Total |
|---:|---:|---:|---:|---:|
| 1 | 2 | 42.000 | 84.000 | 84.000 |
| 2 | 1 | 26.000 | 26.000 | 110.000 |
| 3 | 1 | 95.000 | 95.000 | 205.000 |
| 4 | 1 | 42.000 | 42.000 | 247.000 |
| 5 | 3 | 45.000 | 135.000 | 382.000 |
| 6 | 2 | 26.000 | 52.000 | 434.000 |
| 7 | 1 | 120.000 | 120.000 | 554.000 |
| 8 | 0 | 42.000 | — | 554.000 |
| 9 | 2 | 45.000 | 90.000 | 644.000 |
| 10 | 4 | 42.000 | 168.000 | 812.000 |
| 11 | 1 | 95.000 | 95.000 | 907.000 |
| 12 | 3 | 26.000 | 78.000 | 985.000 |

Traza de `ventaMayor` (parte de `null`; compara valor y conserva el id):

| id | Valor | Decisión | Mayor |
|---:|---:|---|---|
| 1 | 84.000 | Inicial | 1 |
| 2 | 26.000 | No supera 84.000 | 1 |
| 3 | 95.000 | Supera 84.000 | 3 |
| 4 | 42.000 | No supera 95.000 | 3 |
| 5 | 135.000 | Supera 95.000 | 5 |
| 6 | 52.000 | No supera 135.000 | 5 |
| 7 | 120.000 | No supera 135.000 | 5 |
| 8 | — | Cantidad 0; se omite | 5 |
| 9 | 90.000 | No supera 135.000 | 5 |
| 10 | 168.000 | Supera 135.000 | 10 |
| 11 | 95.000 | No supera 168.000 | 10 |
| 12 | 78.000 | No supera 168.000 | 10 |

Ambas trazas coinciden con el programa: total 985.000 y mayor id 10, valor 168.000.

Variantes: `totalVendidoM`, `unidadesVendidasM` y `ventasPorCiudadM` usan `filter` + `reduce`, crean arreglos O(n); las versiones base recorren una vez y usan O(1) extra. `totalCiudadCadena` aplica `map` → `filter` → `map` → `reduce`, crea tres arreglos (las dos últimas etapas solo ven las filas filtradas) y usa O(n); `totalCiudadUnaPasada` lo hace en un ciclo y O(1) extra. Ambas son O(n); se eligió la segunda para el reporte y se conserva la cadena para comparar legibilidad/memoria. `unidadesPorProducto` agrupa cantidades; `topProductosPorValor` suma por producto, transforma con `Object.entries`, ordena copia descendente y devuelve primeros `k` (`slice`): O(n+p log p) tiempo. `ventasDelDia` devuelve filas válidas de una fecha.

## Errores corregidos

1. **Bogotá separada en grupos:** tres ventas de valor unitario 1.000, cantidades 1, 2 y 3 y ciudades `Bogotá`, `Bogotá `, `bogotá` producían claves distintas (como `medellín`, id 5). `totalPorCiudad` normaliza y devuelve una clave `Bogotá`: 6.000.
2. **Promedio `NaN` sin ventas:** 2026-09-07 está vacío (la muestra va del 1 al 6). `ventasDelDia` devuelve `[]`; `ticketPromedio` protege el 0/0 y da 0.

## Conteos y complejidad

Predicción para las funciones instrumentadas: un ciclo, sin anidamiento; al multiplicar `n` por 10, trabajo ×10. `totalVendidoConteo` hace 2n (visita + cantidad > 0). `ventaMayorConteo` hace entre 2n y 4n; primera válida ahorra comparación. `totalPorCiudadConteo` hace hasta 3n (visita, cantidad y ciudad válida); pocas ciudades no cambian el orden. `primeraVentaConteo` no depende de n.

| n | Total vendido | Venta mayor | Total por ciudad | Primera venta |
|---:|---:|---:|---:|---:|
| 100 | 200 | 399 | 300 | 2 |
| 1.000 | 2.000 | 3.999 | 3.000 | 2 |
| 10.000 | 20.000 | 39.999 | 30.000 | 2 |
| 100.000 | 200.000 | 399.999 | 300.000 | 2 |

Coincide la predicción; `ventaMayor` da 4n−1 porque todas las filas generadas eran válidas. Complejidades: las tres funciones Conteo son O(n) (2n, ≤4n y ≤3n); `primeraVentaConteo` es O(1), 2 operaciones. No son O(n²): ×10 en n no produjo ×100 operaciones.

Espacio adicional (sin contar la entrada): O(1) para `valorVenta`, `totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `ventasPorCiudad`, `totalCiudadUnaPasada`, `totalVendidoConteo`, `ventaMayorConteo` y `primeraVentaConteo`. O(n) para versiones `M`, `totalCiudadCadena`, `ventasDelDia`, `comprasPorCliente` y funciones de clientes (`u` distintos). `totalPorCiudad`/`totalPorCiudadConteo` usan O(c); `unidadesPorProducto` y `topProductosPorValor`, O(p), hasta O(n). `topProductosPorValor` agrupa y ordena todos los productos aunque devuelva solo `k`. c, p y u ≤ n.

## Clientes recurrentes

Cuenta filas con cantidad > 0 (cada fila es una compra, aunque tenga varias unidades), devuelve clientes con más de una compra sin repetir y en orden de primera aparición; no modifica ventas. `C01` y `c01` son códigos distintos. Meta: <1 s con 100.000 ventas.

| Clientes de entrada | Esperado |
|---|---|
| Vacío; `C01`; `C01,C02` | `[]` |
| `C01,C01,C01` | `[C01]` |
| `C02,C01,C02,C01` | `[C02,C01]` |
| `C01` cantidad 0 y `C01` cantidad 1 | `[]` |

La versión original comparaba cada venta con las siguientes. Para ids 1–5 (C01,C02,C03,C01,C04), hizo estas 10 comparaciones:

| Venta exterior | Comparaciones en orden |
|---|---|
| id 1 (C01) | id 2 no; id 3 no; id 4 sí (agrega C01); id 5 no |
| id 2 (C02) | id 3 no; id 4 no; id 5 no |
| id 3 (C03) | id 4 no; id 5 no |
| id 4 (C01) | id 5 no |

La traza devuelve C01.

Para n ventas compara (n−1)+(n−2)+…+1 = n(n−1)/2 (con 5: 5×4/2=10), O(n²). Además, `includes` vuelve a buscar clientes repetidos: el peor caso total puede llegar a O(n³); espacio O(n). La versión con `Map` cuenta compras válidas (`comprasPorCliente`) y `clientesRecurrentes` filtra conteo >1. `clientesRecurrentesSet` usa conjuntos de vistos/repetidos y devuelve `[]` enseguida si no hay repetidos. Las nuevas versiones conservan orden, no mutan datos, son O(n) promedio y usan O(u) espacio (peor O(n)); `Map`/`Set` operan O(1) promedio.

Comparaciones verificadas: con Día 1 (12 ventas), las tres versiones devolvieron 3 clientes; con 5.000 ventas generadas, 1.324. Se compararon salidas ordenadas y casos borde.

Medición original con `console.time`/`console.timeEnd`, generador MiniReto 5 fuera del cronómetro y corridas repetidas para reducir el efecto de la primera; tiempos aproximados, varían con datos aleatorios:

| n | Original | Factor aprox. |
|---:|---:|---:|
| 1.000 | 0,002 s | — |
| 2.000 | 0,009 s | 4× |
| 4.000 | 0,032 s | 4× |
| 8.000 | 0,139 s | 4× |
| 16.000 | 0,70 s | 5× |

Duplicar n cuadruplica pares; `includes` y aleatoriedad explican desvíos. Desde 16.000 se estimaron ~27 s para 100.000; se midieron 40,3 s. Extrapolando cuadráticamente, 1.000.000 ≈67 min (proyección dependiente de datos). Un compañero señaló esa dependencia y se aclaró en el informe.

Con 100.000 ventas generadas: `comprasPorCliente` ~0,004 s; `clientesRecurrentes` ~0,010; `clientesRecurrentesSet` ~0,007. Otra tabla de corridas:

| n | Original | Map | Set |
|---:|---:|---:|---:|
| 1.000 | 3,6 ms | 0,3 ms | 0,2 ms |
| 10.000 | 213 ms | 1,3 ms | 0,7 ms |
| 100.000 | ~40 s (medición anterior) | 10 ms | 7 ms |

No se volvió a medir la original a 100.000; otro registro fue 40,3 s. Las nuevas cumplen <1 s.

| n | Pares original | Trabajo Map | Trabajo Set |
|---:|---:|---|---|
| 1.000 | 499.500 | O(1.000+u), lineal | O(1.000+u), lineal |
| 10.000 | 49.995.000 | O(10.000+u), lineal | O(10.000+u), lineal |
| 100.000 | 4.999.950.000 | O(100.000+u), lineal | O(100.000+u), lineal |

Como u≤n, n+u es O(n). Con Map, 1.000.000 se estimó en ~0,04 s para conteo, ~0,10 s para recurrentes y ~0,07 s con Set. La mejora evita comparaciones por pares; la original, con `includes`, puede llegar a O(n³).

## Campaña: tarjeta regalo y análisis por ciudad/cliente

Catálogo (producto: precio): Origen Nariño 250 g: 26.000; Origen Huila 500 g: 42.000; Origen Sierra 500 g: 45.000; Filtros de papel x100: 18.000; Taza de cerámica: 35.000; Origen Huila 1 kg: 79.000; Prensa francesa: 95.000; Molino manual: 120.000.

`comboRegaloFuerzaBruta` prueba pares `i<j` (no repite pares ni usa un producto dos veces), devuelve todos los nombres que suman el objetivo. Hace n(n−1)/2 comparaciones: O(n²) tiempo, O(1) auxiliar + O(m) resultados (m puede ser O(n²)). Para 87.000 devuelve `[[Origen Huila 500 g, Origen Sierra 500 g]]`.

`comboRegalo` usa `Map` precio→producto: por cada elemento busca `objetivo−precio` antes de guardarlo; devuelve el primer par o `null`. Una pasada, O(n) promedio y O(n) espacio. `comboRegaloOptimizado` es alias. Salidas: 87.000 → `[Origen Huila 500 g, Origen Sierra 500 g]`; 61.000 → `[Origen Nariño 250 g, Taza de cerámica]`; 62.000 y catálogo vacío → `null`.

Traza para 87.000 (precios en miles): Nariño 26 busca 61, no está y guarda 26→Nariño; Huila 42 busca 45, no está y guarda 42→Huila; Sierra 45 busca 42, lo encuentra y devuelve Huila+Sierra. Se detiene en producto 3.

`productoEstrellaPorCiudad` usa `Map` ciudad→`Map` producto→frecuencia de filas válidas; devuelve un objeto ciudad→producto más frecuente. En empate conserva el primero visto. Día 1: Medellín Huila 500 g; Bogotá Nariño 250 g; Cali Prensa francesa (empata con Sierra 500 g y aparece primero); Pereira Huila 500 g. Vacío → `{}`. Tiempo O(n) promedio, espacio O(n).

`primerClienteUnico` cuenta compras válidas por cliente en un `Map`, luego recorre en orden y devuelve el primero con frecuencia 1; vacío o sin candidato → `null`. Día 1 → C04. Tiempo O(n) promedio, espacio O(u) (hasta O(n)). Estas tres funciones requeridas (`comboRegalo`, `productoEstrellaPorCiudad`, `primerClienteUnico`) son O(n) promedio; `Map` da operaciones O(1) promedio.

## Mejor semana de septiembre

Totales diarios (miles de pesos): 320, 410, 280, 390, 510, 620, 700, 300, 290, 450, 480, 530, 610, 680, 350, 330, 420, 470, 560, 640, 710, 380, 360, 440, 500, 590, 650, 720, 400, 370.

`mejorSemanaBruta(dias,k)` suma desde cero cada bloque y devuelve el máximo. Hay n−k+1 bloques de k valores: O((n−k+1)k)=O(nk), hasta O(n²) si k crece con n; espacio O(1). k inválido (no entero positivo o mayor que n) → `null`. Para k=7 da 3.670, días 24–30.

`mejorSemana(dias,k)` suma los primeros k; al avanzar suma el día que entra y resta el que sale. Devuelve `{ total, diaInicio }` (día desde 1); empate conserva el inicio más temprano. k inválido → `null`. Tiempo O(n), espacio O(1); resultado septiembre: `{ total: 3670, diaInicio: 24 }`.

Primeras tres ventanas de 7 días (corchetes = días incluidos; valores en miles):

```text
1: [320 410 280 390 510 620 700] 300 290 ... → 3.230
2:  320 [410 280 390 510 620 700 300] 290 ... → 3.210
3:  320  410 [280 390 510 620 700 300 290] ... → 3.090
```

Deslizamientos: 3.230−320+300=3.210; luego 3.210−410+290=3.090.

Comprobación y tiempos: con septiembre, ambas dieron 3.670; `mejorSemana` indicó día 24. Con 100.000 valores aleatorios enteros entre 0 y 1.000, k=7, ambas dieron 6.159 y la ventana indicó día 12.257. Generé los datos fuera del cronómetro, calenté cada función 5 veces y medí 15 tandas de 20 llamadas; mediana por llamada: fuerza bruta 0,348 ms, ventana 0,076 ms (≈4,6× más rápida). Los tiempos varían según la máquina y los datos.

## Par que más se acerca al presupuesto

`parMasCercano(precios, presupuesto)` ordena una copia del catálogo por precio ascendente (sin mutar el original) y mueve dos punteros desde los extremos. Si la suma supera el presupuesto, baja el puntero derecho; si cabe, guarda el par si mejora el total y avanza el izquierdo. Devuelve los nombres de dos productos distintos, o `null` si no hay par posible. En empate conserva el primer par encontrado. Ordenar cuesta O(n log n) y el recorrido O(n); espacio O(n) por la copia. Si los precios ya llegan ordenados, el recorrido de dos punteros es O(n).

Complejidad resumida:

| Función | Tiempo | Espacio extra |
|---|---|---|
| `mejorSemanaBruta` | O((n−k+1)k), o O(nk); O(n²) si k crece con n | O(1) |
| `mejorSemana` | O(n) | O(1) |
| `parMasCercano` | O(n log n) total: ordenar O(n log n) + dos punteros O(n); si ya está ordenado, O(n) | O(n) por la copia ordenada |

Pruebas: presupuesto 100.000 → Filtros de papel x100 + Origen Huila 1 kg (97.000); 140.000 → Origen Sierra 500 g + Prensa francesa (140.000); 40.000 → `null` (los dos productos más baratos suman 44.000).

Traza para 100.000 (precios en miles; catálogo ordenado):

| Izquierdo | Derecho | Suma | Acción; mejor hasta ahora |
|---|---|---:|---|
| Filtros 18 | Molino 120 | 138 | Supera presupuesto; baja derecho |
| Filtros 18 | Prensa 95 | 113 | Supera; baja derecho |
| Filtros 18 | Huila 1 kg 79 | 97 | Cabe; guarda 97; sube izquierdo |
| Nariño 26 | Huila 1 kg 79 | 105 | Supera; baja derecho |
| Nariño 26 | Sierra 45 | 71 | Cabe; conserva 97; sube izquierdo |
| Taza 35 | Sierra 45 | 80 | Cabe; conserva 97; sube izquierdo |
| Huila 500 g 42 | Sierra 45 | 87 | Cabe; conserva 97; punteros se cruzan |

El mejor par suma 97.000, queda 3.000 por debajo del presupuesto.
