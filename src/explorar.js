let datos = require("./datos");
let ventas = datos.ventas;

let registros = ventas;
let primero = registros[0];
let ultimo = registros[registros.length - 1];

console.log("Cantidad de registros:", registros.length);
console.log("Primer registro:", primero);
console.log("Último registro:", ultimo);
console.log("Producto en la posición 4:", registros[4].producto);
console.table(registros);
