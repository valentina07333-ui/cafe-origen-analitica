const { ventas: ventasMuestra, ventasDiarias } = require("./datos");
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
  comboRegaloOptimizado,
  primerClienteUnico,
  mejorSemana,
  parMasCercano,
} = require("./analitica");

const ANCHO = 54;
const ANCHO_ETIQUETA = 34;

function pesos(valor) {
  return "$" + valor.toLocaleString("es-CO", { maximumFractionDigits: 2 });
}

function crearReporte(ventas) {
  return {
    resumen: {
      total: totalVendido(ventas),
      unidades: unidadesVendidas(ventas),
      mayor: ventaMayor(ventas),
      promedio: ticketPromedio(ventas),
    },
    ciudades: totalPorCiudad(ventas),
    unidadesProducto: unidadesPorProducto(ventas),
    topProductos: topProductosPorValor(ventas, 3),
    recurrentes: clientesRecurrentes(ventas),
    productosEstrella: productoEstrellaPorCiudad(ventas),
    comboRegalo: comboRegaloOptimizado(catalogo, 87000),
    parPresupuesto: parMasCercano(catalogo, 100000),
    clienteUnico: primerClienteUnico(ventas),
    semana: mejorSemana(ventasDiarias, 7),
    dias: ["2026-09-05", "2026-09-07"].map((fecha) => {
      const ventasDia = ventasDelDia(ventas, fecha);
      return {
        fecha,
        cantidad: ventasDia.length,
        unidades: unidadesVendidas(ventasDia),
        total: totalVendido(ventasDia),
        promedio: ticketPromedio(ventasDia),
      };
    }),
  };
}

function imprimirTitulo(texto) {
  console.log("");
  console.log(texto);
  console.log("-".repeat(ANCHO));
}

function imprimirLinea(etiqueta, valor) {
  console.log(etiqueta.padEnd(ANCHO_ETIQUETA) + valor);
}

function imprimirReporte(reporte, cantidadGenerada) {
  console.log("=".repeat(ANCHO));
  console.log("CAFÉ ORIGEN - REPORTE DE VENTAS v1.0");
  console.log(cantidadGenerada === null
    ? "Datos reales del Día 1 (12 ventas)"
    : `Datos generados (${cantidadGenerada.toLocaleString("es-CO")} ventas)`);
  console.log("=".repeat(ANCHO));

  imprimirTitulo("RESUMEN GENERAL");
  imprimirLinea("Total vendido", pesos(reporte.resumen.total));
  imprimirLinea("Unidades vendidas", String(reporte.resumen.unidades));
  if (reporte.resumen.mayor === null) {
    imprimirLinea("Venta más grande", "Sin ventas");
  } else {
    imprimirLinea(
      `Venta más grande (id ${reporte.resumen.mayor.id})`,
      pesos(reporte.resumen.mayor.cantidad * reporte.resumen.mayor.precio),
    );
  }
  imprimirLinea("Ticket promedio", pesos(reporte.resumen.promedio));

  imprimirTitulo("VENTAS POR CIUDAD");
  for (const [ciudad, total] of Object.entries(reporte.ciudades)) {
    imprimirLinea(ciudad, pesos(total));
  }

  imprimirTitulo("UNIDADES POR PRODUCTO");
  for (const [producto, unidades] of Object.entries(reporte.unidadesProducto)) {
    imprimirLinea(producto, String(unidades));
  }

  imprimirTitulo("TOP 3 PRODUCTOS POR VALOR");
  for (const item of reporte.topProductos) {
    imprimirLinea(item.producto, pesos(item.valor));
  }

  imprimirTitulo("CLIENTES RECURRENTES");
  imprimirLinea("Cantidad de clientes", String(reporte.recurrentes.length));
  imprimirLinea(
    "Primeros clientes",
    reporte.recurrentes.length === 0 ? "Ninguno" : reporte.recurrentes.slice(0, 10).join(", "),
  );

  imprimirTitulo("PRODUCTO ESTRELLA POR CIUDAD");
  for (const [ciudad, producto] of Object.entries(reporte.productosEstrella)) {
    imprimirLinea(ciudad, producto);
  }

  imprimirTitulo("COMBO DE REGALO DE $87.000");
  imprimirLinea("Sugerencia", reporte.comboRegalo?.join(" + ") || "Sin combinación");

  imprimirTitulo("PAR DE PRODUCTOS HASTA $100.000");
  if (reporte.parPresupuesto === null) {
    imprimirLinea("Sugerencia", "Sin combinación");
  } else {
    imprimirLinea("Sugerencia", reporte.parPresupuesto.productos.join(" + "));
    imprimirLinea("Total", pesos(reporte.parPresupuesto.total));
  }

  imprimirTitulo("CLIENTE PARA CUPÓN");
  imprimirLinea("Primer cliente con una compra", reporte.clienteUnico || "No hay cliente único");

  imprimirTitulo("MEJOR SEMANA DE SEPTIEMBRE");
  if (reporte.semana === null) {
    imprimirLinea("Resultado", "No hay suficientes días");
  } else {
    imprimirLinea("Día de inicio", `${reporte.semana.diaInicio} de septiembre`);
    imprimirLinea("Total de siete días", pesos(reporte.semana.total * 1000));
  }

  for (const dia of reporte.dias) {
    imprimirTitulo(`RESUMEN DEL DÍA ${dia.fecha}`);
    imprimirLinea("Ventas", String(dia.cantidad));
    imprimirLinea("Unidades vendidas", String(dia.unidades));
    imprimirLinea("Total vendido", pesos(dia.total));
    imprimirLinea("Ticket promedio", pesos(dia.promedio));
  }
  console.log("");
}

function seleccionarVentas(argumento) {
  if (argumento === undefined) {
    return { ventas: ventasMuestra, cantidadGenerada: null };
  }

  const cantidad = Number(argumento);
  if (!Number.isSafeInteger(cantidad) || cantidad < 0) {
    throw new Error("Indica una cantidad entera de ventas igual o mayor que cero.");
  }

  return { ventas: generarVentas(cantidad), cantidadGenerada: cantidad };
}

function main() {
  try {
    const { ventas, cantidadGenerada } = seleccionarVentas(process.argv[2]);
    imprimirReporte(crearReporte(ventas), cantidadGenerada);
  } catch (error) {
    console.error("No se pudo generar el reporte:", error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { crearReporte, imprimirReporte, seleccionarVentas };
