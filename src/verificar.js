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
  clientesRecurrentes,
  clientesRecurrentesSet,
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

function clientesRecurrentesOriginal(ventas) {
  const recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (ventas[i].cantidad > 0 && ventas[j].cantidad > 0 &&
          ventas[i].cliente === ventas[j].cliente &&
          !recurrentes.includes(ventas[i].cliente)) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

function compararClientesRecurrentes(nombre, arreglo) {
  const resultados = [
    clientesRecurrentesOriginal(arreglo),
    clientesRecurrentes(arreglo),
    clientesRecurrentesSet(arreglo),
  ].map((clientes) => JSON.stringify(clientes.sort()));
  const estado = resultados.every((resultado) => resultado === resultados[0]) ? "OK" : "DIFERENTE";
  console.log(nombre + " -> " + estado);
  if (estado !== "OK") process.exitCode = 1;
}

compararClientesRecurrentes("Clientes recurrentes (Día 1)", ventas);
compararClientesRecurrentes("Clientes recurrentes (5.000 ventas)", generarVentas(5000));
