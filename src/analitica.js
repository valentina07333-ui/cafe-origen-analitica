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

module.exports = { valorVenta, totalVendido, unidadesVendidas, ventaMayor, ticketPromedio, ventasPorCiudad };