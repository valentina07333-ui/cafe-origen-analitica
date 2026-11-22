function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function totalVendido(ventas) {
  let total = 0;
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
    }
  }
  return total;
}

function unidadesVendidas(ventas) {
  let unidades = 0;
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      unidades += venta.cantidad;
    }
  }
  return unidades;
}

function ventaMayor(ventas) {
  let mayor = null;
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
        mayor = venta;
      }
    }
  }
  return mayor;
}

function ticketPromedio(ventas) {
  let suma = 0;
  let cantidadVentas = 0;
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      suma += valorVenta(venta);
      cantidadVentas += 1;
    }
  }
  if (cantidadVentas === 0) {
    return 0;
  }
  return suma / cantidadVentas;
}

function ventasPorCiudad(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();
  let total = 0;
  for (const venta of ventas) {
        if (venta.cantidad > 0 && venta.ciudad.trim().toLowerCase() === ciudadBuscada) {
    total += valorVenta(venta);
    }
  }
  return total;
}
function totalVendidoM(ventas) {
  return ventas
    .filter((venta) => venta.cantidad > 0)
    .reduce((total, venta) => total + valorVenta(venta), 0);
}

function unidadesVendidasM(ventas) {
  return ventas
    .filter((venta) => venta.cantidad > 0)
    .reduce((unidades, venta) => unidades + venta.cantidad, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();
  return ventas
    .filter((venta) => venta.cantidad > 0 && venta.ciudad.trim().toLowerCase() === ciudadBuscada)
    .reduce((total, venta) => total + valorVenta(venta), 0);
}

function totalPorCiudad(ventas) {
  const totales = {};
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      const ciudad = venta.ciudad.trim().toLowerCase();
      const nombre = ciudad.charAt(0).toUpperCase() + ciudad.slice(1);
      if (totales[nombre] === undefined) {
        totales[nombre] = 0;
      }
      totales[nombre] += valorVenta(venta);
    }
  }
  return totales;
}
function unidadesPorProducto(ventas) {
  const unidades = {};
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      if (unidades[venta.producto] === undefined) {
        unidades[venta.producto] = 0;
      }
      unidades[venta.producto] += venta.cantidad;
    }
  }
  return unidades;
}

function topProductosPorValor(ventas, k) {
  const valores = {};
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      if (valores[venta.producto] === undefined) {
        valores[venta.producto] = 0;
      }
      valores[venta.producto] += valorVenta(venta);
    }
  }

  const lista = Object.entries(valores).map(([producto, valor]) => ({ producto, valor }));
  return [...lista].sort((a, b) => b.valor - a.valor).slice(0, k);
}
function ventasDelDia(ventas, fecha) {
  const dia = fecha.trim();
  const delDia = [];
  for (const venta of ventas) {
    if (venta.cantidad > 0 && venta.fecha === dia) {
      delDia.push(venta);
    }
  }
  return delDia;
}
function totalVendidoConteo(ventas, contador) {
  let total = 0;
  for (const venta of ventas) {
    contador.operaciones += 1; // visita
    contador.operaciones += 1; // comparación: cantidad > 0
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
    }
  }
  return total;
}

function ventaMayorConteo(ventas, contador) {
  let mayor = null;
  for (const venta of ventas) {
    contador.operaciones += 1; // visita
    contador.operaciones += 1; // comparación: cantidad > 0
    if (venta.cantidad > 0) {
      contador.operaciones += 1; // comparación: mayor === null
      if (mayor === null) {
        mayor = venta;
      } else {
        contador.operaciones += 1; // comparación: valor contra el mayor
        if (valorVenta(venta) > valorVenta(mayor)) {
          mayor = venta;
        }
      }
    }
  }
  return mayor;
}

function totalPorCiudadConteo(ventas, contador) {
  const totales = {};
  for (const venta of ventas) {
    contador.operaciones += 1; // visita
    contador.operaciones += 1; // comparación: cantidad > 0
    if (venta.cantidad > 0) {
      const ciudad = venta.ciudad.trim().toLowerCase();
      const nombre = ciudad.charAt(0).toUpperCase() + ciudad.slice(1);
      contador.operaciones += 1; // comparación: ciudad nueva
      if (totales[nombre] === undefined) {
        totales[nombre] = 0;
      }
      totales[nombre] += valorVenta(venta);
    }
  }
  return totales;
}

function primeraVentaConteo(ventas, contador) {
  contador.operaciones += 1; // comparación: hay ventas
  if (ventas.length === 0) {
    return null;
  }
  contador.operaciones += 1; // visita: la primera venta
  return ventas[0];
}

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  totalVendidoConteo,
  ventaMayorConteo,
  totalPorCiudadConteo,
  primeraVentaConteo,

};