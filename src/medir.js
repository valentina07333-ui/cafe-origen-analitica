let generador = require("./generador");
let analitica = require("./analitica");

let generarVentas = generador.generarVentas;
let totalVendidoConteo = analitica.totalVendidoConteo;
let ventaMayorConteo = analitica.ventaMayorConteo;
let totalPorCiudadConteo = analitica.totalPorCiudadConteo;
let primeraVentaConteo = analitica.primeraVentaConteo;
let comprasPorCliente = analitica.comprasPorCliente;
let clientesRecurrentes = analitica.clientesRecurrentes;
let clientesRecurrentesSet = analitica.clientesRecurrentesSet;

function clientesRecurrentesOriginal(ventas) {
  let recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (ventas[i].cliente == ventas[j].cliente &&
          !recurrentes.includes(ventas[i].cliente)) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

let tamanos = [100, 1000, 10000, 100000];
let tabla = [];

for (let i = 0; i < tamanos.length; i++) {
  let n = tamanos[i];
  let ventas = generarVentas(n);

  let contadorTotal = { operaciones: 0};

  let contadorMayor = {operaciones: 0};

  let contadorCiudad = {operaciones: 0};

  let contadorPrimera = {operaciones: 0};

  totalVendidoConteo(ventas, contadorTotal);
  ventaMayorConteo(ventas, contadorMayor);
  totalPorCiudadConteo(ventas, contadorCiudad);
  primeraVentaConteo(ventas, contadorPrimera);

  let fila = {};
  fila.n = n;
  fila.totalVendido = contadorTotal.operaciones;
  fila.ventaMayor = contadorMayor.operaciones;
  fila.totalPorCiudad = contadorCiudad.operaciones;
  fila.primeraVenta = contadorPrimera.operaciones;
  tabla.push(fila);
}

console.table(tabla);

let crecimiento = [];
for (let i = 1; i < tabla.length; i++) {
  let antes = tabla[i - 1];
  let ahora = tabla[i];
  let fila = {};
  fila.paso = antes.n + " -> " + ahora.n;
  fila.totalVendido = "x" + (ahora.totalVendido / antes.totalVendido).toFixed(2);
  fila.ventaMayor = "x" + (ahora.ventaMayor / antes.ventaMayor).toFixed(2);
  fila.totalPorCiudad = "x" + (ahora.totalPorCiudad / antes.totalPorCiudad).toFixed(2);
  fila.primeraVenta = "x" + (ahora.primeraVenta / antes.primeraVenta).toFixed(2);
  crecimiento.push(fila);
}

console.table(crecimiento);

let tamanosTiempo = [1000, 2000, 4000, 8000, 10000, 16000, 100000];

for (let i = 0; i < tamanosTiempo.length; i++) {
  let n = tamanosTiempo[i];
  let ventas = generarVentas(n);

  if (n <= 16000) {
    let etiquetaOriginal = `clientesRecurrentesOriginal n=${n}`;
    console.time(etiquetaOriginal);
    clientesRecurrentesOriginal(ventas);
    console.timeEnd(etiquetaOriginal);
  } else {
    console.log(`clientesRecurrentesOriginal n=${n}: no se ejecutó por el costo`);
  }

  let etiqueta = `clientesRecurrentes n=${n}`;
  console.time(etiqueta);
  clientesRecurrentes(ventas);
  console.timeEnd(etiqueta);

  let etiquetaSet = `clientesRecurrentesSet n=${n}`;
  console.time(etiquetaSet);
  clientesRecurrentesSet(ventas);
  console.timeEnd(etiquetaSet);

  let etiquetaCompras = `comprasPorCliente n=${n}`;
  console.time(etiquetaCompras);
  comprasPorCliente(ventas);
  console.timeEnd(etiquetaCompras);
}
