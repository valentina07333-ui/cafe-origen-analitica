//DICCIONARIO DE DATOS

Propiedad,Tipo & Significado 

ID(number): Identificador único de la venta. Va de 1 a 12, sin repetirse. 

Fecha(string): Fecha de la venta en formato "AAAA-MM-DD" (por ejemplo, "2026-09-01"). Es texto, no un objeto tipo date.

Cliente(string) Código del cliente que hizo la compra (por ejemplo, "C01"). Un mismo cliente puede aparecer en varias ventas.

Producto(string):Nombre del producto vendido, con su presentación (por ejemplo, "Origen Huila 500 g", "Prensa francesa"). 

Ciudad(string):Ciudad de la venta. Puede traer inconsistencias de escritura: la venta 5 tiene "medellín" en minúscula. 

Cantidad(number)  Número de unidades vendidas en esa venta. La venta 8 tiene 0, que es un valor sospechoso. 

precio(number) Precio por unidad del producto, en pesos colombianos.

CASOS BORDES DETECTADOS

1:El primer caso Border detectado es el
