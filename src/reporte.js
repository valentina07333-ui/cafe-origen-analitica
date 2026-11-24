const { ventas } = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
} = require("./analitica");

const ANCHO = 44;

function pesos(valor) {
  return "$" + valor.toLocaleString("es-CO", { maximumFractionDigits: 2 });
}

function titulo(texto) {
  console.log("");
  console.log(texto);
  console.log("-".repeat(ANCHO));
}

function linea(etiqueta, valor) {
  console.log(etiqueta.padEnd(ANCHO - valor.length) + valor);
}

console.log("=".repeat(ANCHO));
console.log("CAFÉ ORIGEN - REPORTE DE VENTAS");
console.log("=".repeat(ANCHO));

titulo("RESUMEN GENERAL");
const mayor = ventaMayor(ventas);
linea("Total vendido", pesos(totalVendido(ventas)));
linea("Unidades vendidas", String(unidadesVendidas(ventas)));
linea("Venta más grande (id " + mayor.id + ")", pesos(mayor.cantidad * mayor.precio));
linea("Ticket promedio", pesos(ticketPromedio(ventas)));

titulo("VENTAS POR CIUDAD");
const porCiudad = totalPorCiudad(ventas);
for (const ciudad in porCiudad) {
  linea(ciudad, pesos(porCiudad[ciudad]));
}

titulo("UNIDADES POR PRODUCTO");
const porProducto = unidadesPorProducto(ventas);
for (const producto in porProducto) {
  linea(producto, String(porProducto[producto]));
}

titulo("TOP 3 PRODUCTOS POR VALOR");
const top = topProductosPorValor(ventas, 3);
for (const item of top) {
  linea(item.producto, pesos(item.valor));
}
function resumenDia(fecha) {
  const delDia = ventasDelDia(ventas, fecha);
  titulo("RESUMEN DEL DÍA " + fecha);
  linea("Ventas", String(delDia.length));
  linea("Unidades vendidas", String(unidadesVendidas(delDia)));
  linea("Total vendido", pesos(totalVendido(delDia)));
  linea("Ticket promedio", pesos(ticketPromedio(delDia)));
}

resumenDia("2026-09-05");
resumenDia("2026-09-07");
console.log("");
