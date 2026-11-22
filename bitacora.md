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