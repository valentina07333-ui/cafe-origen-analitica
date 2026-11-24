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

function totalCiudadUnaPasada(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();
  let total = 0;

  for (const venta of ventas) {
    const ciudadVenta = venta.ciudad.trim().toLowerCase();
    if (venta.cantidad > 0 && ciudadVenta === ciudadBuscada) {
      total += valorVenta(venta);
    }
  }

  return total;
}

function totalCiudadCadena(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();

  return ventas
    .map((venta) => ({
      ...venta,
      ciudad: venta.ciudad.trim().toLowerCase(),
    }))
    .filter((venta) => venta.cantidad > 0 && venta.ciudad === ciudadBuscada)
    .map((venta) => valorVenta(venta))
    .reduce((total, valor) => total + valor, 0);
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

function productoEstrellaPorCiudad(ventas) {
  const conteosPorCiudad = new Map();

  for (const venta of ventas) {
    if (venta.cantidad <= 0) continue;

    const ciudadTexto = venta.ciudad.trim().toLowerCase();
    const ciudad = ciudadTexto.charAt(0).toUpperCase() + ciudadTexto.slice(1);

    if (!conteosPorCiudad.has(ciudad)) {
      conteosPorCiudad.set(ciudad, new Map());
    }

    const conteosProductos = conteosPorCiudad.get(ciudad);
    conteosProductos.set(
      venta.producto,
      (conteosProductos.get(venta.producto) || 0) + 1,
    );
  }

  const estrellas = {};
  for (const [ciudad, conteosProductos] of conteosPorCiudad) {
    let productoEstrella = null;
    let maximo = 0;

    for (const [producto, frecuencia] of conteosProductos) {
      if (frecuencia > maximo) {
        productoEstrella = producto;
        maximo = frecuencia;
      }
    }

    estrellas[ciudad] = productoEstrella;
  }

  return estrellas;
}

function primerClienteUnico(ventas) {
  const comprasPorCliente = new Map();

  for (const venta of ventas) {
    if (venta.cantidad <= 0) continue;
    comprasPorCliente.set(
      venta.cliente,
      (comprasPorCliente.get(venta.cliente) || 0) + 1,
    );
  }

  for (const venta of ventas) {
    if (venta.cantidad > 0 && comprasPorCliente.get(venta.cliente) === 1) {
      return venta.cliente;
    }
  }

  return null;
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

function comprasPorCliente(ventas) {
  const conteos = new Map();

  for (const venta of ventas) {
    if (venta.cantidad <= 0) continue;

    const cliente = venta.cliente;
    const cantidad = conteos.has(cliente) ? conteos.get(cliente) : 0;
    conteos.set(cliente, cantidad + 1);
  }

  return conteos;
}

function clientesRecurrentes(ventas) {
  const recurrentes = [];
  for (const [cliente, compras] of comprasPorCliente(ventas)) {
    if (compras > 1) {
      recurrentes.push(cliente);
    }
  }

  return recurrentes;
}

function clientesRecurrentesSet(ventas) {
  const vistos = new Set();
  const recurrentes = new Set();

  for (const venta of ventas) {
    if (venta.cantidad <= 0) continue;

    const cliente = venta.cliente;
    if (vistos.has(cliente)) {
      recurrentes.add(cliente);
    } else {
      vistos.add(cliente);
    }
  }

  if (recurrentes.size === 0) {
    return [];
  }

  return [...vistos].filter((cliente) => recurrentes.has(cliente));
}

// Fuerza bruta: prueba cada par distinto de productos una sola vez.
// Tiempo O(n²); espacio O(1) auxiliar, más O(m) para los m combos devueltos.
function comboRegalo(catalogo, valor) {
  const combos = [];

  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (catalogo[i].precio + catalogo[j].precio === valor) {
        combos.push([catalogo[i].producto, catalogo[j].producto]);
      }
    }
  }

  return combos.length === 0 ? null : combos;
}

// Busca el primer complemento visto en una sola pasada.
// Tiempo O(n) promedio y espacio O(n) para los precios guardados.
function comboRegaloOptimizado(catalogo, valor) {
  const productosPorPrecio = new Map();

  for (const item of catalogo) {
    const complemento = valor - item.precio;

    if (productosPorPrecio.has(complemento)) {
      return [productosPorPrecio.get(complemento), item.producto];
    }

    productosPorPrecio.set(item.precio, item.producto);
  }

  return null;
}

function mejorSemanaBruta(dias, k) {
  if (!Number.isInteger(k) || k <= 0 || k > dias.length) {
    return null;
  }

  let mejorTotal = -Infinity;
  let diaInicio = 0;

  for (let inicio = 0; inicio <= dias.length - k; inicio++) {
    let total = 0;
    for (let posicion = inicio; posicion < inicio + k; posicion++) {
      total += dias[posicion];
    }

    if (total > mejorTotal) {
      mejorTotal = total;
      diaInicio = inicio + 1;
    }
  }

  return { total: mejorTotal, diaInicio };
}

function mejorSemana(dias, k) {
  if (!Number.isInteger(k) || k <= 0 || k > dias.length) {
    return null;
  }

  let total = 0;
  for (let i = 0; i < k; i++) {
    total += dias[i];
  }

  let mejorTotal = total;
  let diaInicio = 1;

  for (let fin = k; fin < dias.length; fin++) {
    total += dias[fin] - dias[fin - k];
    if (total > mejorTotal) {
      mejorTotal = total;
      diaInicio = fin - k + 2;
    }
  }

  return { total: mejorTotal, diaInicio };
}

function parMasCercano(catalogo, presupuesto) {
  if (catalogo.length < 2) {
    return null;
  }

  const ordenados = [...catalogo].sort((a, b) => a.precio - b.precio);
  let izquierda = 0;
  let derecha = ordenados.length - 1;
  let mejor = null;

  while (izquierda < derecha) {
    const total = ordenados[izquierda].precio + ordenados[derecha].precio;

    if (total > presupuesto) {
      derecha--;
    } else {
      if (mejor === null || total > mejor.total) {
        mejor = {
          productos: [ordenados[izquierda].producto, ordenados[derecha].producto],
          total,
        };
      }
      izquierda++;
    }
  }

  return mejor;
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
  comboRegaloOptimizado,
  mejorSemanaBruta,
  mejorSemana,
  parMasCercano,


};
