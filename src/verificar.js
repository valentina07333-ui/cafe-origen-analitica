let datos = require("./datos");
let generador = require("./generador");
let analitica = require("./analitica");

let ventas = datos.ventas;
let generarVentas = generador.generarVentas;
let totalVendido = analitica.totalVendido;
let unidadesVendidas = analitica.unidadesVendidas;
let ventasPorCiudad = analitica.ventasPorCiudad;
let totalVendidoM = analitica.totalVendidoM;
let unidadesVendidasM = analitica.unidadesVendidasM;
let ventasPorCiudadM = analitica.ventasPorCiudadM;
let totalCiudadCadena = analitica.totalCiudadCadena;
let totalCiudadUnaPasada = analitica.totalCiudadUnaPasada;
let clientesRecurrentes = analitica.clientesRecurrentes;
let clientesRecurrentesSet = analitica.clientesRecurrentesSet;

function comparar(nombre, resultadoCiclo, resultadoMetodos) {
  let estado = "DIFERENTE";
  if (resultadoCiclo == resultadoMetodos) {
    estado = "OK";
  }
  console.log(nombre + ": " + resultadoCiclo + " y " + resultadoMetodos + " -> " + estado);
}

comparar("totalVendido", totalVendido(ventas), totalVendidoM(ventas));
comparar("unidadesVendidas", unidadesVendidas(ventas), unidadesVendidasM(ventas));
comparar("ventasPorCiudad (Medellín)", ventasPorCiudad(ventas, "Medellín"), ventasPorCiudadM(ventas, "Medellín"));

let ventasGeneradas = generarVentas(10000);
comparar(
  "totalCiudad (Medellín, 10.000 ventas)",
  totalCiudadUnaPasada(ventasGeneradas, "Medellín"),
  totalCiudadCadena(ventasGeneradas, "Medellín")
);

function clientesRecurrentesOriginal(ventas) {
  let recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (ventas[i].cantidad > 0 && ventas[j].cantidad > 0 &&
          ventas[i].cliente == ventas[j].cliente &&
          !recurrentes.includes(ventas[i].cliente)) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

function compararClientesRecurrentes(nombre, arreglo) {
  let resultado1 = clientesRecurrentesOriginal(arreglo);
  let resultado2 = clientesRecurrentes(arreglo);
  let resultado3 = clientesRecurrentesSet(arreglo);

  resultado1.sort();
  resultado2.sort();
  resultado3.sort();

  let resultados = [];
  resultados.push(JSON.stringify(resultado1));
  resultados.push(JSON.stringify(resultado2));
  resultados.push(JSON.stringify(resultado3));

  let estado = "OK";
  for (let i = 0; i < resultados.length; i++) {
    if (resultados[i] != resultados[0]) {
      estado = "DIFERENTE";
    }
  }
  console.log(nombre + " -> " + estado);
  if (estado != "OK") {
    process.exitCode = 1;
  }
}

compararClientesRecurrentes("Clientes recurrentes (Día 1)", ventas);
compararClientesRecurrentes("Clientes recurrentes (5.000 ventas)", generarVentas(5000));
