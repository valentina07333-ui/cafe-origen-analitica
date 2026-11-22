const { ventas } = require("./datos");
const {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
} = require("./analitica");

const unaVenta = [ventas[0]];
const vacio = [];

console.log("valorVenta (recibe un registro, no un arreglo)");
console.log(valorVenta(ventas[0]));

console.log("totalVendido");
console.log(totalVendido(ventas), totalVendido(unaVenta), totalVendido(vacio));

console.log("unidadesVendidas");
console.log(unidadesVendidas(ventas), unidadesVendidas(unaVenta), unidadesVendidas(vacio));

console.log("ventaMayor");
console.log(ventaMayor(ventas).id, ventaMayor(unaVenta).id, ventaMayor(vacio));

console.log("ticketPromedio");
console.log(ticketPromedio(ventas), ticketPromedio(unaVenta), ticketPromedio(vacio));

console.log("ventasPorCiudad (Medellín)");
console.log(ventasPorCiudad(ventas, "Medellín"), ventasPorCiudad(unaVenta, "Medellín"), ventasPorCiudad(vacio, "Medellín"));