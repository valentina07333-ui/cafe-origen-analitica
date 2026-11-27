let datos = require("./datos");
let catalogo = require("./catalogo").catalogo;
let generador = require("./generador");
let analitica = require("./analitica");

let ancho = 56;
let argumento = process.argv[2];
let ventas = datos.ventas;
let queDato = "Datos reales (" + ventas.length + " ventas)";

if (argumento != null) {
  let cantidad = Number(argumento);
  let esEntero = /^\d+$/.test(argumento);
  if (esEntero == false || Number.isSafeInteger(cantidad) == false || cantidad <= 0) {
    console.log("Uso: node src/reporte.js [n], con n como entero positivo.");
    process.exit(1);
  }
  ventas = generador.generarVentas(cantidad);
  queDato = "Datos generados (" + cantidad.toLocaleString("es-CO") + " ventas)";
}

let dias = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370
];

function pesos(valor) {
  valor = Math.round(valor);
  return "$" + valor.toLocaleString("es-CO");
}

console.log("=".repeat(ancho));
console.log("CAFÉ ORIGEN - REPORTE DE VENTAS");
console.log(queDato);
console.log("=".repeat(ancho));

console.log("");
console.log("RESUMEN GENERAL");
console.log("-".repeat(ancho));
let mayor = analitica.ventaMayor(ventas);
let totalGeneral = analitica.totalVendido(ventas);
console.log("Total vendido:", pesos(totalGeneral));
console.log("Unidades vendidas:", analitica.unidadesVendidas(ventas));
console.log("Venta más grande (id " + mayor.id + "):", pesos(mayor.cantidad * mayor.precio));
console.log("Ticket promedio:", pesos(analitica.ticketPromedio(ventas)));

console.log("");
console.log("VENTAS POR CIUDAD");
console.log("-".repeat(ancho));
let porCiudad = analitica.totalPorCiudad(ventas);
let ciudades = Object.keys(porCiudad);
for (let i = 0; i < ciudades.length; i++) {
  let ciudad = ciudades[i];
  console.log(ciudad + ":", pesos(porCiudad[ciudad]));
}

console.log("");
console.log("UNIDADES POR PRODUCTO");
console.log("-".repeat(ancho));
let porProducto = analitica.unidadesPorProducto(ventas);
let productos = Object.keys(porProducto);
for (let i = 0; i < productos.length; i++) {
  let producto = productos[i];
  console.log(producto + ":", porProducto[producto]);
}

console.log("");
console.log("TOP 3 PRODUCTOS POR VALOR");
console.log("-".repeat(ancho));
let top = analitica.topProductosPorValor(ventas, 3);
for (let i = 0; i < top.length; i++) {
  console.log(top[i].producto + ":", pesos(top[i].valor));
}

function resumenDia(fecha) {
  let ventasDia = analitica.ventasDelDia(ventas, fecha);
  console.log("");
  console.log("RESUMEN DEL DÍA " + fecha);
  console.log("-".repeat(ancho));
  console.log("Ventas:", ventasDia.length);
  console.log("Unidades vendidas:", analitica.unidadesVendidas(ventasDia));
  console.log("Total vendido:", pesos(analitica.totalVendido(ventasDia)));
  console.log("Ticket promedio:", pesos(analitica.ticketPromedio(ventasDia)));
}

resumenDia("2026-09-05");
resumenDia("2026-09-07");

console.log("");
console.log("CLIENTES RECURRENTES");
console.log("-".repeat(ancho));
let clientes = analitica.clientesRecurrentes(ventas);
console.log("Cantidad:", clientes.length);
if (clientes.length > 0) {
  let lista = [];
  let limite = 10;
  if (clientes.length < limite) limite = clientes.length;
  for (let i = 0; i < limite; i++) {
    lista.push(clientes[i]);
  }
  let muestra = "";
  for (let i = 0; i < lista.length; i++) {
    if (i > 0) muestra = muestra + ", ";
    muestra = muestra + lista[i];
  }
  if (clientes.length > 10) {
    console.log("Muestra (primeros 10):", muestra);
  } else {
    console.log("Clientes:", muestra);
  }
}

console.log("");
console.log("PRODUCTO ESTRELLA POR CIUDAD");
console.log("-".repeat(ancho));
let estrellas = analitica.productoEstrellaPorCiudad(ventas);
let nombresCiudades = Object.keys(estrellas);
for (let i = 0; i < nombresCiudades.length; i++) {
  let ciudad = nombresCiudades[i];
  console.log(ciudad + ":", estrellas[ciudad]);
}

console.log("");
console.log("COMBO DE REGALO (TARJETA $87.000)");
console.log("-".repeat(ancho));
let combo = analitica.comboRegalo(catalogo, 87000);
if (combo == null) {
  console.log("Productos:", "Sin combinación");
} else {
  console.log("Productos:", combo.join(" + "));
}

console.log("");
console.log("CLIENTE PARA CUPÓN DE REGRESO");
console.log("-".repeat(ancho));
let clienteUnico = analitica.primerClienteUnico(ventas);
if (clienteUnico == null) {
  console.log("Primer cliente con una compra:", "Ninguno");
} else {
  console.log("Primer cliente con una compra:", clienteUnico);
}

console.log("");
console.log("MEJOR SEMANA DE SEPTIEMBRE");
console.log("-".repeat(ancho));
let semana = analitica.mejorSemana(dias, 7);
if (semana == null) {
  console.log("Resultado:", "No hay suficientes días");
} else {
  let diasSemana = semana.diaInicio + "–" + (semana.diaInicio + 6);
  console.log("Días:", diasSemana);
  let totalSemana = pesos(semana.total * 1000);
  console.log("Total:", totalSemana);
}

console.log("");
console.log("PAR MÁS CERCANO A PRESUPUESTO ($100.000)");
console.log("-".repeat(ancho));
let par = analitica.parMasCercano(catalogo, 100000);
if (par == null) {
  console.log("Resultado:", "No hay una combinación bajo el presupuesto");
} else {
  let precios = {};
  for (let i = 0; i < catalogo.length; i++) {
    precios[catalogo[i].producto] = catalogo[i].precio;
  }
  let total = precios[par[0]] + precios[par[1]];
  console.log("Productos:", par.join(" + "));
  console.log("Total:", pesos(total));
}

console.log("");
