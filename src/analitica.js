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
};