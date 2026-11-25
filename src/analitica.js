function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function totalVendido(ventas) {
  let suma = 0;
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      suma = suma + valorVenta(venta);
    }
  }
  return suma;
}

function unidadesVendidas(ventas) {
  let suma = 0;
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      suma = suma + venta.cantidad;
    }
  }
  return suma;
}

function ventaMayor(ventas) {
  let mejor = null;
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      if (mejor == null) {
        mejor = venta;
      } else if (valorVenta(venta) > valorVenta(mejor)) {
        mejor = venta;
      }
    }
  }
  return mejor;
}

function ticketPromedio(ventas) {
  let suma = 0;
  let cantidad = 0;
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      suma = suma + valorVenta(venta);
      cantidad = cantidad + 1;
    }
  }
  if (cantidad == 0) {
    return 0;
  }
  return suma / cantidad;
}

function ventasPorCiudad(ventas, ciudad) {
  let buscada = ciudad.trim().toLowerCase();
  let suma = 0;
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      if (venta.ciudad.trim().toLowerCase() == buscada) {
        suma = suma + valorVenta(venta);
      }
    }
  }
  return suma;
}

function totalVendidoM(ventas) {
  let validas = ventas.filter(function (venta) {
    return venta.cantidad > 0;
  });

  let total = validas.reduce(function (suma, venta) {
    return suma + valorVenta(venta);
  }, 0);

  return total;
}

function unidadesVendidasM(ventas) {
  let validas = ventas.filter(function (venta) {
    return venta.cantidad > 0;
  });

  let total = validas.reduce(function (suma, venta) {
    return suma + venta.cantidad;
  }, 0);

  return total;
}

function ventasPorCiudadM(ventas, ciudad) {
  let buscada = ciudad.trim().toLowerCase();
  let validas = ventas.filter(function (venta) {
    return venta.cantidad > 0 && venta.ciudad.trim().toLowerCase() == buscada;
  });

  let total = validas.reduce(function (suma, venta) {
    return suma + valorVenta(venta);
  }, 0);

  return total;
}

function totalCiudadUnaPasada(ventas, ciudad) {
  let buscada = ciudad.trim().toLowerCase();
  let suma = 0;
  for (let i = 0; i < ventas.length; i++) {
    if (ventas[i].cantidad > 0 && ventas[i].ciudad.trim().toLowerCase() == buscada) {
      suma = suma + valorVenta(ventas[i]);
    }
  }
  return suma;
}

function totalCiudadCadena(ventas, ciudad) {
  let buscada = ciudad.trim().toLowerCase();
  let suma = ventas
    .map(function (venta) {
      return { ...venta, ciudad: venta.ciudad.trim().toLowerCase() };
    })
    .filter(function (venta) {
      return venta.cantidad > 0 && venta.ciudad == buscada;
    })
    .map(function (venta) {
      return valorVenta(venta);
    });

  let total = 0;
  for (let i = 0; i < suma.length; i++) total = total + suma[i];
  return total;
}

function totalPorCiudad(ventas) {
  let resultado = {};
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      let texto = venta.ciudad.trim().toLowerCase();
      let ciudad = texto.charAt(0).toUpperCase() + texto.slice(1);
      if (resultado[ciudad] == null) resultado[ciudad] = 0;
      resultado[ciudad] = resultado[ciudad] + valorVenta(venta);
    }
  }
  return resultado;
}

function productoEstrellaPorCiudad(ventas) {
  let ciudades = new Map();

  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      let texto = venta.ciudad.trim().toLowerCase();
      let ciudad = texto[0].toUpperCase() + texto.slice(1);

      let productos = new Map();
      if (ciudades.has(ciudad)) {
        productos = ciudades.get(ciudad);
      }

      let cantidad = 0;
      if (productos.has(venta.producto)) {
        cantidad = productos.get(venta.producto);
      }
      productos.set(venta.producto, cantidad + 1);
      ciudades.set(ciudad, productos);
    }
  }

  let respuesta = {};
  let nombresCiudades = ciudades.keys();
  for (let ciudad of nombresCiudades) {
    let productos = ciudades.get(ciudad);
    let nombresProductos = productos.keys();
    let estrella = null;
    let mayor = 0;

    for (let producto of nombresProductos) {
      let veces = productos.get(producto);
      if (estrella == null || veces > mayor) {
        estrella = producto;
        mayor = veces;
      }
    }
    respuesta[ciudad] = estrella;
  }
  return respuesta;
}

function primerClienteUnico(ventas) {
  let compras = new Map();
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      let cliente = venta.cliente;
      let cantidad = 0;
      if (compras.has(cliente)) {
        cantidad = compras.get(cliente);
      }
      compras.set(cliente, cantidad + 1);
    }
  }

  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      if (compras.get(venta.cliente) == 1) {
        return venta.cliente;
      }
    }
  }
  return null;
}

function unidadesPorProducto(ventas) {
  let resultado = {};
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      let producto = venta.producto;
      if (resultado[producto] == null) resultado[producto] = 0;
      resultado[producto] = resultado[producto] + venta.cantidad;
    }
  }
  return resultado;
}

function topProductosPorValor(ventas, k) {
  let valores = {};
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      let producto = venta.producto;
      if (valores[producto] == null) valores[producto] = 0;
      valores[producto] = valores[producto] + valorVenta(venta);
    }
  }

  let arreglo = [];
  let nombres = Object.keys(valores);
  for (let i = 0; i < nombres.length; i++) {
    arreglo.push({ producto: nombres[i], valor: valores[nombres[i]] });
  }

  arreglo.sort(function (a, b) {
    return b.valor - a.valor;
  });

  let resultado = arreglo.slice(0, k);
  return resultado;
}

function ventasDelDia(ventas, fecha) {
  let resultado = [];
  for (let venta of ventas) {
    if (venta.cantidad > 0 && venta.fecha == fecha.trim()) {
      resultado.push(venta);
    }
  }
  return resultado;
}

function totalVendidoConteo(ventas, contador) {
  let suma = 0;
  for (let venta of ventas) {
    contador.operaciones = contador.operaciones + 1;
    contador.operaciones = contador.operaciones + 1;
    if (venta.cantidad > 0) suma = suma + valorVenta(venta);
  }
  return suma;
}

function ventaMayorConteo(ventas, contador) {
  let mejor = null;
  for (let venta of ventas) {
    contador.operaciones = contador.operaciones + 1;
    contador.operaciones = contador.operaciones + 1;
    if (venta.cantidad > 0) {
      contador.operaciones = contador.operaciones + 1;
      if (mejor == null) {
        mejor = venta;
      } else {
        contador.operaciones = contador.operaciones + 1;
        if (valorVenta(venta) > valorVenta(mejor)) mejor = venta;
      }
    }
  }
  return mejor;
}

function totalPorCiudadConteo(ventas, contador) {
  let resultado = {};
  for (let venta of ventas) {
    contador.operaciones = contador.operaciones + 1;
    contador.operaciones = contador.operaciones + 1;
    if (venta.cantidad > 0) {
      let texto = venta.ciudad.trim().toLowerCase();
      let ciudad = texto.charAt(0).toUpperCase() + texto.slice(1);
      contador.operaciones = contador.operaciones + 1;
      if (resultado[ciudad] == null) resultado[ciudad] = 0;
      resultado[ciudad] = resultado[ciudad] + valorVenta(venta);
    }
  }
  return resultado;
}

function primeraVentaConteo(ventas, contador) {
  contador.operaciones = contador.operaciones + 1;
  if (ventas.length == 0) return null;
  contador.operaciones = contador.operaciones + 1;
  return ventas[0];
}

function comprasPorCliente(ventas) {
  let resultado = new Map();
  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      let cliente = venta.cliente;
      let numero = 0;
      if (resultado.has(cliente)) {
        numero = resultado.get(cliente);
      }
      resultado.set(cliente, numero + 1);
    }
  }
  return resultado;
}

function clientesRecurrentes(ventas) {
  let resultado = [];
  let compras = comprasPorCliente(ventas);
  let nombres = compras.keys();
  for (let cliente of nombres) {
    if (compras.get(cliente) > 1) resultado.push(cliente);
  }
  return resultado;
}

function clientesRecurrentesSet(ventas) {
  let vistos = new Set();
  let repetidos = new Set();

  for (let venta of ventas) {
    if (venta.cantidad > 0) {
      let cliente = venta.cliente;
      if (vistos.has(cliente)) repetidos.add(cliente);
      vistos.add(cliente);
    }
  }

  let resultado = [];
  let nombres = vistos.values();
  for (let cliente of nombres) {
    if (repetidos.has(cliente)) resultado.push(cliente);
  }
  return resultado;
}

function comboRegaloFuerzaBruta(catalogo, valor) {
  let resultado = [];
  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (catalogo[i].precio + catalogo[j].precio == valor) {
        resultado.push([catalogo[i].producto, catalogo[j].producto]);
      }
    }
  }
  return resultado;
}

function comboRegalo(catalogo, valor) {
  let guardados = new Map();
  for (let i = 0; i < catalogo.length; i++) {
    let faltante = valor - catalogo[i].precio;
    if (guardados.has(faltante)) {
      let anterior = guardados.get(faltante);
      if (anterior.indice != i) {
        return [anterior.producto, catalogo[i].producto];
      }
    }
    let actual = {};
    actual.indice = i;
    actual.producto = catalogo[i].producto;
    guardados.set(catalogo[i].precio, actual);
  }
  return null;
}

function comboRegaloOptimizado(catalogo, valor) {
  return comboRegalo(catalogo, valor);
}

function mejorSemanaBruta(dias, k) {
  if (!Number.isInteger(k) || k <= 0 || k > dias.length) return null;
  let mejor = -Infinity;
  for (let i = 0; i <= dias.length - k; i++) {
    let suma = 0;
    for (let j = i; j < i + k; j++) suma = suma + dias[j];
    if (suma > mejor) mejor = suma;
  }
  return mejor;
}

function mejorSemana(dias, k) {
  if (!Number.isInteger(k) || k <= 0 || k > dias.length) {
    return null;
  }
  let suma = 0;
  for (let i = 0; i < k; i++) {
    suma = suma + dias[i];
  }

  let mejor = suma;
  let inicio = 0;
  for (let i = k; i < dias.length; i++) {
    suma = suma - dias[i - k] + dias[i];
    if (suma > mejor) {
      mejor = suma;
      inicio = i - k + 1;
    }
  }
  return { total: mejor, diaInicio: inicio + 1 };
}

function parMasCercano(precios, presupuesto) {
  if (!Array.isArray(precios) || precios.length < 2) {
    return null;
  }
  let copia = precios.slice();
  copia.sort(function (a, b) {
    return a.precio - b.precio;
  });

  let izquierda = 0;
  let derecha = copia.length - 1;
  let mejorSuma = -Infinity;
  let mejorPar = null;

  while (izquierda < derecha) {
    let suma = copia[izquierda].precio + copia[derecha].precio;
    if (suma <= presupuesto) {
      if (suma > mejorSuma) {
        mejorSuma = suma;
        mejorPar = [copia[izquierda].producto, copia[derecha].producto];
      }
      izquierda = izquierda + 1;
    } else {
      derecha = derecha - 1;
    }
  }
  return mejorPar;
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
  totalCiudadUnaPasada,
  totalCiudadCadena,
  totalPorCiudad,
  productoEstrellaPorCiudad,
  primerClienteUnico,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  totalVendidoConteo,
  ventaMayorConteo,
  totalPorCiudadConteo,
  primeraVentaConteo,
  comprasPorCliente,
  clientesRecurrentes,
  clientesRecurrentesSet,
  comboRegalo,
  comboRegaloFuerzaBruta,
  comboRegaloOptimizado,
  mejorSemanaBruta,
  mejorSemana,
  parMasCercano,
};
