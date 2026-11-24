const { ventas, ventasDiarias } = require("./datos");
const { catalogo } = require("./catalogo");
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
  comboRegalo,
  comboRegaloOptimizado,
  productoEstrellaPorCiudad,
  primerClienteUnico,
  mejorSemanaBruta,
  mejorSemana,
  parMasCercano,
} = require("./analitica");

function comparar(nombre, resultadoCiclo, resultadoMetodos) {
  const estado = resultadoCiclo === resultadoMetodos ? "OK" : "DIFERENTE";
  console.log(nombre + ": " + resultadoCiclo + " y " + resultadoMetodos + " -> " + estado);
  if (estado !== "OK") process.exitCode = 1;
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

const comboEsperado = ["Origen Huila 500 g", "Origen Sierra 500 g"];
verificar(
  "Combo de regalo por fuerza bruta (87.000)",
  JSON.stringify(comboRegalo(catalogo, 87000)) === JSON.stringify([comboEsperado])
);
verificar(
  "Combo de regalo con Map (87.000)",
  JSON.stringify(comboRegaloOptimizado(catalogo, 87000)) === JSON.stringify(comboEsperado)
);
verificar(
  "Combo sin solución devuelve null",
  comboRegalo(catalogo, 62000) === null && comboRegaloOptimizado(catalogo, 62000) === null
);
verificar(
  "Catálogo vacío devuelve null en los dos combos",
  comboRegalo([], 87000) === null && comboRegaloOptimizado([], 87000) === null
);
verificar(
  "Combo por fuerza bruta (61.000)",
  JSON.stringify(comboRegalo(catalogo, 61000)) ===
    JSON.stringify([["Origen Nariño 250 g", "Taza de cerámica"]])
);
verificar(
  "Combo con Map (61.000)",
  JSON.stringify(comboRegaloOptimizado(catalogo, 61000)) ===
    JSON.stringify(["Origen Nariño 250 g", "Taza de cerámica"])
);

verificar(
  "Producto estrella en arreglo vacío",
  JSON.stringify(productoEstrellaPorCiudad([])) === "{}"
);
verificar(
  "Desempate de producto estrella conserva el primero",
  productoEstrellaPorCiudad([
    { ciudad: "Cali", producto: "Primero", cantidad: 1 },
    { ciudad: "Cali", producto: "Segundo", cantidad: 1 },
  ]).Cali === "Primero"
);
verificar("Cliente único en arreglo vacío devuelve null", primerClienteUnico([]) === null);
verificar("Cliente único del Día 1 es C04", primerClienteUnico(ventas) === "C04");

const presupuestoOriginal = JSON.stringify(catalogo);
const paresPresupuesto = [
  parMasCercano(catalogo, 100000),
  parMasCercano(catalogo, 140000),
];
verificar(
  "Par cercano no supera los presupuestos de 100.000 y 140.000",
  paresPresupuesto.every((par, indice) => par !== null &&
    par.total <= [100000, 140000][indice] && par.productos.length === 2)
);
verificar(
  "Par más cercano: 97.000 con presupuesto 100.000 y 140.000 con 140.000",
  paresPresupuesto[0].total === 97000 && paresPresupuesto[1].total === 140000
);
verificar(
  "Presupuesto insuficiente devuelve null",
  parMasCercano(catalogo, 40000) === null && parMasCercano([], 100000) === null
);
verificar(
  "Buscar par no cambia el orden del catálogo",
  JSON.stringify(catalogo) === presupuestoOriginal
);

const mejorSemanaMuestra = mejorSemana(ventasDiarias, 7);
verificar(
  "Ventana deslizante coincide con fuerza bruta en septiembre",
  JSON.stringify(mejorSemanaMuestra) === JSON.stringify(mejorSemanaBruta(ventasDiarias, 7))
);
verificar(
  "Semana inválida (k mayor que los días) devuelve null",
  mejorSemana([1, 2], 3) === null && mejorSemanaBruta([1, 2], 3) === null
);
verificar(
  "Semana vacía devuelve null y el empate conserva el primer inicio",
  mejorSemana([], 7) === null &&
    JSON.stringify(mejorSemana([10, 10, 10], 2)) === JSON.stringify({ total: 20, diaInicio: 1 })
);

const diasGenerados = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 1000));
console.time("mejorSemanaBruta 100.000 días");
const semanaBrutaGenerada = mejorSemanaBruta(diasGenerados, 7);
console.timeEnd("mejorSemanaBruta 100.000 días");
console.time("mejorSemana 100.000 días");
const semanaGenerada = mejorSemana(diasGenerados, 7);
console.timeEnd("mejorSemana 100.000 días");
verificar(
  "Ventana deslizante coincide con fuerza bruta en 100.000 días",
  JSON.stringify(semanaGenerada) === JSON.stringify(semanaBrutaGenerada)
);

console.log("Mejor semana de septiembre:", mejorSemanaMuestra);
console.log("Par de productos hasta 100.000:", parMasCercano(catalogo, 100000));
