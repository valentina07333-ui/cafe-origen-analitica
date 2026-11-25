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

function titulo(texto) {
  console.log("");
  console.log(texto);
  console.log("-".repeat(ancho));
}

function linea(nombre, valor) {
  let espacios = Math.max(ancho - valor.length, nombre.length + 2);
  console.log(nombre.padEnd(espacios) + valor);
}

console.log("=".repeat(ancho));
console.log("CAFÉ ORIGEN - REPORTE DE VENTAS");
console.log(queDato);
console.log("=".repeat(ancho));

titulo("RESUMEN GENERAL");
let mayor = analitica.ventaMayor(ventas);
let totalGeneral = analitica.totalVendido(ventas);
linea("Total vendido", pesos(totalGeneral));
linea("Unidades vendidas", String(analitica.unidadesVendidas(ventas)));
linea("Venta más grande (id " + mayor.id + ")", pesos(mayor.cantidad * mayor.precio));
linea("Ticket promedio", pesos(analitica.ticketPromedio(ventas)));

titulo("VENTAS POR CIUDAD");
let porCiudad = analitica.totalPorCiudad(ventas);
let ciudades = Object.keys(porCiudad);
for (let i = 0; i < ciudades.length; i++) {
  let ciudad = ciudades[i];
  linea(ciudad, pesos(porCiudad[ciudad]));
}

titulo("UNIDADES POR PRODUCTO");
let porProducto = analitica.unidadesPorProducto(ventas);
let productos = Object.keys(porProducto);
for (let i = 0; i < productos.length; i++) {
  let producto = productos[i];
  linea(producto, String(porProducto[producto]));
}

titulo("TOP 3 PRODUCTOS POR VALOR");
let top = analitica.topProductosPorValor(ventas, 3);
for (let i = 0; i < top.length; i++) {
  linea(top[i].producto, pesos(top[i].valor));
}

function resumenDia(fecha) {
  let ventasDia = analitica.ventasDelDia(ventas, fecha);
  titulo("RESUMEN DEL DÍA " + fecha);
  linea("Ventas", String(ventasDia.length));
  linea("Unidades vendidas", String(analitica.unidadesVendidas(ventasDia)));
  linea("Total vendido", pesos(analitica.totalVendido(ventasDia)));
  linea("Ticket promedio", pesos(analitica.ticketPromedio(ventasDia)));
}

resumenDia("2026-09-05");
resumenDia("2026-09-07");

titulo("CLIENTES RECURRENTES");
let clientes = analitica.clientesRecurrentes(ventas);
linea("Cantidad", String(clientes.length));
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
    linea("Muestra (primeros 10)", muestra);
  } else {
    linea("Clientes", muestra);
  }
}

titulo("PRODUCTO ESTRELLA POR CIUDAD");
let estrellas = analitica.productoEstrellaPorCiudad(ventas);
let nombresCiudades = Object.keys(estrellas);
for (let i = 0; i < nombresCiudades.length; i++) {
  let ciudad = nombresCiudades[i];
  linea(ciudad, estrellas[ciudad]);
}

titulo("COMBO DE REGALO (TARJETA $87.000)");
let combo = analitica.comboRegalo(catalogo, 87000);
if (combo == null) {
  linea("Productos", "Sin combinación");
} else {
  linea("Productos", combo.join(" + "));
}

titulo("CLIENTE PARA CUPÓN DE REGRESO");
let clienteUnico = analitica.primerClienteUnico(ventas);
if (clienteUnico == null) {
  linea("Primer cliente con una compra", "Ninguno");
} else {
  linea("Primer cliente con una compra", clienteUnico);
}

titulo("MEJOR SEMANA DE SEPTIEMBRE");
let semana = analitica.mejorSemana(dias, 7);
if (semana == null) {
  linea("Resultado", "No hay suficientes días");
} else {
  linea("Días", semana.diaInicio + "–" + (semana.diaInicio + 6));
  linea("Total", pesos(semana.total * 1000));
}

titulo("PAR MÁS CERCANO A PRESUPUESTO ($100.000)");
let par = analitica.parMasCercano(catalogo, 100000);
if (par == null) {
  linea("Resultado", "No hay una combinación bajo el presupuesto");
} else {
  let precios = {};
  for (let i = 0; i < catalogo.length; i++) {
    precios[catalogo[i].producto] = catalogo[i].precio;
  }
  let total = precios[par[0]] + precios[par[1]];
  linea("Productos", par.join(" + "));
  linea("Total", pesos(total));
}

console.log("");
