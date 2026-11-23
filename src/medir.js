const { generarVentas } = require("./generador");
const {
  totalVendidoConteo,
  ventaMayorConteo,
  totalPorCiudadConteo,
  primeraVentaConteo,
  comprasPorCliente,
  clientesRecurrentes,
  clientesRecurrentesSet,
} = require("./analitica");

function clientesRecurrentesOriginal(ventas) {
  const recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (ventas[i].cliente === ventas[j].cliente &&
          !recurrentes.includes(ventas[i].cliente)) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

const tamanos = [100, 1000, 10000, 100000];
const tabla = [];

for (const n of tamanos) {
  const ventas = generarVentas(n);

  const contadorTotal = { operaciones: 0 };
  const contadorMayor = { operaciones: 0 };
  const contadorCiudad = { operaciones: 0 };
  const contadorPrimera = { operaciones: 0 };

  totalVendidoConteo(ventas, contadorTotal);
  ventaMayorConteo(ventas, contadorMayor);
  totalPorCiudadConteo(ventas, contadorCiudad);
  primeraVentaConteo(ventas, contadorPrimera);

  tabla.push({
    n,
    totalVendido: contadorTotal.operaciones,
    ventaMayor: contadorMayor.operaciones,
    totalPorCiudad: contadorCiudad.operaciones,
    primeraVenta: contadorPrimera.operaciones,
  });
}

console.table(tabla);

const crecimiento = [];
for (let i = 1; i < tabla.length; i++) {
  const antes = tabla[i - 1];
  const ahora = tabla[i];
  crecimiento.push({
    paso: antes.n + " -> " + ahora.n,
    totalVendido: "x" + (ahora.totalVendido / antes.totalVendido).toFixed(2),
    ventaMayor: "x" + (ahora.ventaMayor / antes.ventaMayor).toFixed(2),
    totalPorCiudad: "x" + (ahora.totalPorCiudad / antes.totalPorCiudad).toFixed(2),
    primeraVenta: "x" + (ahora.primeraVenta / antes.primeraVenta).toFixed(2),
  });
}

console.table(crecimiento);

const tamanosTiempo = [1000, 2000, 4000, 8000, 10000, 16000, 100000];

for (const n of tamanosTiempo) {
  const ventas = generarVentas(n);

  if (n <= 16000) {
    const etiquetaOriginal = `clientesRecurrentesOriginal n=${n}`;
    console.time(etiquetaOriginal);
    clientesRecurrentesOriginal(ventas);
    console.timeEnd(etiquetaOriginal);
  } else {
    console.log(`clientesRecurrentesOriginal n=${n}: no se ejecutó por el costo`);
  }

  const etiqueta = `clientesRecurrentes n=${n}`;
  console.time(etiqueta);
  clientesRecurrentes(ventas);
  console.timeEnd(etiqueta);

  const etiquetaSet = `clientesRecurrentesSet n=${n}`;
  console.time(etiquetaSet);
  clientesRecurrentesSet(ventas);
  console.timeEnd(etiquetaSet);

  const etiquetaCompras = `comprasPorCliente n=${n}`;
  console.time(etiquetaCompras);
  comprasPorCliente(ventas);
  console.timeEnd(etiquetaCompras);
}
