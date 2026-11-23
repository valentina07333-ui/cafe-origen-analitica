const { ventas } = require("./datos");
const { generarVentas } = require("./generador");
const {
  totalVendido,
  unidadesVendidas,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalCiudadCadena,
  totalCiudadUnaPasada,
} = require("./analitica");

function comparar(nombre, resultadoCiclo, resultadoMetodos) {
  const estado = resultadoCiclo === resultadoMetodos ? "OK" : "DIFERENTE";
  console.log(nombre + ": " + resultadoCiclo + " y " + resultadoMetodos + " -> " + estado);
}

comparar("totalVendido", totalVendido(ventas), totalVendidoM(ventas));
comparar("unidadesVendidas", unidadesVendidas(ventas), unidadesVendidasM(ventas));
comparar("ventasPorCiudad (Medellín)", ventasPorCiudad(ventas, "Medellín"), ventasPorCiudadM(ventas, "Medellín"));

const ventasGeneradas = generarVentas(10000);
comparar(
  "totalCiudad (Medellín, 10.000 ventas)",
  totalCiudadUnaPasada(ventasGeneradas, "Medellín"),
  totalCiudadCadena(ventasGeneradas, "Medellín")
);
