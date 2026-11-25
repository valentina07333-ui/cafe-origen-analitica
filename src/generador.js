let productos = [
  { nombre: "Origen Huila 500 g", precio: 42000 },
  { nombre: "Origen Nariño 250 g", precio: 26000 },
  { nombre: "Origen Sierra 500 g", precio: 45000 },
  { nombre: "Prensa francesa", precio: 95000 },
  { nombre: "Molino manual", precio: 120000 },
];

let ciudades = ["Medellín", "Bogotá", "Cali", "Pereira"];

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uno(lista) {
  let n = aleatorio(0, lista.length - 1);
  let elegido = lista[n];
  return elegido;
}

function generarVentas(n) {
  let maxClientes = n / 3;
  if (maxClientes < 1) {
    maxClientes = 1;
  }
  maxClientes = Math.floor(maxClientes);

  let ventas = [];
  for (let i = 0; i < n; i++) {
    let producto = uno(productos);
    let venta = {};
    venta.id = i + 1;
    venta.fecha = "2026-09-0" + aleatorio(1, 6);
    venta.cliente = "C" + String(aleatorio(1, maxClientes)).padStart(2, "0");
    venta.producto = producto.nombre;
    venta.ciudad = uno(ciudades);
    venta.cantidad = aleatorio(1, 5);
    venta.precio = producto.precio;
    ventas.push(venta);
  }
  return ventas;
}

module.exports = { generarVentas };