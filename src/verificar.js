const { ventas } = require("./datos");
const { generarVentas } = require("./generador");
const {
  totalVendido,
  unidadesVendidas,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  ticketPromedio,
  totalCiudadCadena,
  totalCiudadUnaPasada,
  totalPorCiudad,
  topProductosPorValor,
  ventasDelDia,
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

function verificar(nombre, condicion) {
  const estado = condicion ? "OK" : "DIFERENTE";
  console.log(nombre + " -> " + estado);
  if (!condicion) process.exitCode = 1;
}

const ciudades = Object.keys(totalPorCiudad(ventas)).sort();
verificar(
  "totalPorCiudad (cuatro ciudades)",
  JSON.stringify(ciudades) === JSON.stringify(["Bogotá", "Cali", "Medellín", "Pereira"].sort())
);

const ordenOriginal = ventas.map((venta) => venta.id);
const topTres = topProductosPorValor(ventas, 3);
verificar(
  "topProductosPorValor (tres resultados ordenados)",
  topTres.length === 3 && topTres.every((producto, indice) =>
    indice === 0 || topTres[indice - 1].valor >= producto.valor
  )
);
verificar(
  "topProductosPorValor (conserva el orden de ventas)",
  JSON.stringify(ventas.map((venta) => venta.id)) === JSON.stringify(ordenOriginal)
);

const ventasBogotaVariada = [
  { ciudad: "Bogotá", cantidad: 1, precio: 1000 },
  { ciudad: "Bogotá ", cantidad: 2, precio: 1000 },
  { ciudad: "bogotá", cantidad: 3, precio: 1000 },
];
const bogotaNormalizada = totalPorCiudad(ventasBogotaVariada);
verificar(
  "Bogotá con variantes de escritura (un grupo, total 6000)",
  Object.keys(bogotaNormalizada).length === 1 && bogotaNormalizada.Bogotá === 6000
);

const ventasDiaVacio = ventasDelDia(ventas, "2026-09-07");
verificar(
  "Día sin ventas (ticket promedio cero)",
  ventasDiaVacio.length === 0 && ticketPromedio(ventasDiaVacio) === 0
);

const ventasPruebaGenerador = generarVentas(1000);
const camposVenta = ["cantidad", "ciudad", "cliente", "fecha", "id", "precio", "producto"];
const ciudadesValidas = ["Medellín", "Bogotá", "Cali", "Pereira"];
verificar(
  "Generador (1.000 ventas con estructura válida)",
  ventasPruebaGenerador.length === 1000 && ventasPruebaGenerador.every((venta, indice) =>
    JSON.stringify(Object.keys(venta).sort()) === JSON.stringify(camposVenta) &&
    venta.id === indice + 1 && venta.cantidad >= 1 && venta.cantidad <= 5 &&
    ciudadesValidas.includes(venta.ciudad) && typeof venta.cliente === "string" &&
    typeof venta.producto === "string" && typeof venta.precio === "number"
  )
);

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

verificar(
  "Clientes recurrentes del Día 1 (C01, C02 y C03)",
  JSON.stringify(clientesRecurrentes(ventas)) === JSON.stringify(["C01", "C02", "C03"])
);
