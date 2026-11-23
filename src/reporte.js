const { ventas } = require("./datos");
const { catalogo } = require("./catalogo");
const { generarVentas } = require("./generador");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  clientesRecurrentes,
  productoEstrellaPorCiudad,
  comboRegalo,
  primerClienteUnico,
  mejorSemana,
  parMasCercano,
} = require("./analitica");

const ANCHO = 56;
const argumento = process.argv[2];
let ventasReporte = ventas;
let fuenteDatos = "Día 1: datos reales (" + ventas.length + " ventas)";

if (argumento !== undefined) {
  const cantidad = Number(argumento);
  if (!/^\d+$/.test(argumento) || !Number.isSafeInteger(cantidad) || cantidad <= 0) {
    console.error("Uso: node src/reporte.js [n], con n como entero positivo.");
    process.exit(1);
  }
  ventasReporte = generarVentas(cantidad);
  fuenteDatos = "Datos generados (" + cantidad.toLocaleString("es-CO") + " ventas)";
}

const ventasDiariasSeptiembre = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370,
];

function pesos(valor) {
  return "$" + Math.round(valor).toLocaleString("es-CO");
}

function titulo(texto) {
  console.log("");
  console.log(texto);
  console.log("-".repeat(ANCHO));
}

function linea(etiqueta, valor) {
  const anchoEtiqueta = Math.max(ANCHO - valor.length, etiqueta.length + 2);
  console.log(etiqueta.padEnd(anchoEtiqueta) + valor);
}

console.log("=".repeat(ANCHO));
console.log("CAFÉ ORIGEN - REPORTE DE VENTAS");
console.log(fuenteDatos);
console.log("=".repeat(ANCHO));

titulo("RESUMEN GENERAL");
const mayor = ventaMayor(ventasReporte);
linea("Total vendido", pesos(totalVendido(ventasReporte)));
linea("Unidades vendidas", String(unidadesVendidas(ventasReporte)));
linea("Venta más grande (id " + mayor.id + ")", pesos(mayor.cantidad * mayor.precio));
linea("Ticket promedio", pesos(ticketPromedio(ventasReporte)));

titulo("VENTAS POR CIUDAD");
const porCiudad = totalPorCiudad(ventasReporte);
for (const ciudad in porCiudad) {
  linea(ciudad, pesos(porCiudad[ciudad]));
}

titulo("UNIDADES POR PRODUCTO");
const porProducto = unidadesPorProducto(ventasReporte);
for (const producto in porProducto) {
  linea(producto, String(porProducto[producto]));
}

titulo("TOP 3 PRODUCTOS POR VALOR");
const top = topProductosPorValor(ventasReporte, 3);
for (const item of top) {
  linea(item.producto, pesos(item.valor));
}
function resumenDia(fecha) {
  const delDia = ventasDelDia(ventasReporte, fecha);
  titulo("RESUMEN DEL DÍA " + fecha);
  linea("Ventas", String(delDia.length));
  linea("Unidades vendidas", String(unidadesVendidas(delDia)));
  linea("Total vendido", pesos(totalVendido(delDia)));
  linea("Ticket promedio", pesos(ticketPromedio(delDia)));
}

resumenDia("2026-09-05");
resumenDia("2026-09-07");

titulo("CLIENTES RECURRENTES");
const recurrentes = clientesRecurrentes(ventasReporte);
linea("Cantidad", String(recurrentes.length));
if (recurrentes.length > 0) {
  const muestra = recurrentes.slice(0, 10).join(", ");
  linea(recurrentes.length > 10 ? "Muestra (primeros 10)" : "Clientes", muestra);
}

titulo("PRODUCTO ESTRELLA POR CIUDAD");
const estrellas = productoEstrellaPorCiudad(ventasReporte);
for (const [ciudad, producto] of Object.entries(estrellas)) {
  linea(ciudad, producto);
}

titulo("COMBO DE REGALO (TARJETA $87.000)");
const combo = comboRegalo(catalogo, 87000);
linea("Productos", combo ? combo.join(" + ") : "Sin combinación");

titulo("CLIENTE PARA CUPÓN DE REGRESO");
linea("Primer cliente con una compra", primerClienteUnico(ventasReporte) || "Ninguno");

titulo("MEJOR SEMANA DE SEPTIEMBRE");
const semana = mejorSemana(ventasDiariasSeptiembre, 7);
if (semana) {
  linea("Días", semana.diaInicio + "–" + (semana.diaInicio + 6));
  linea("Total", pesos(semana.total * 1000));
} else {
  linea("Resultado", "No hay suficientes días");
}

titulo("PAR MÁS CERCANO A PRESUPUESTO ($100.000)");
const par = parMasCercano(catalogo, 100000);
if (par) {
  const precioPorProducto = new Map(catalogo.map(({ producto, precio }) => [producto, precio]));
  const totalPar = par.reduce((total, producto) => total + precioPorProducto.get(producto), 0);
  linea("Productos", par.join(" + "));
  linea("Total", pesos(totalPar));
} else {
  linea("Resultado", "No hay una combinación bajo el presupuesto");
}

console.log("");
