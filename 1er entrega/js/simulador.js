// SIMULADOR MOTOCROSS PRO

console.log("Simulador iniciado");

// arrays
const motos = [
"Yamaha YZ450F",
"Honda CRF450R",
"Kawasaki KX450",
"KTM 450 SX-F",
"Suzuki RM-Z450"
];

const precios = [
12000,
11800,
11500,
12500,
11000
];

// variables
let carrito = [];
let total = 0;


// mostrar motos
function mostrarMotos(){

console.log("Listado de motos:");

for(let i=0;i<motos.length;i++){

console.log(i + " - " + motos[i] + " $" + precios[i]);

}

}


// elegir moto
function elegirMoto(){

let opcion = prompt(

"Seleccione una moto\n\n" +
"0 Yamaha YZ450F\n" +
"1 Honda CRF450R\n" +
"2 Kawasaki KX450\n" +
"3 KTM 450 SX-F\n" +
"4 Suzuki RM-Z450"

);

return parseInt(opcion);

}


// calcular precio
function calcularPrecio(indice){

let precio = precios[indice];

let financiar = confirm("¿Desea financiar la compra? (10% recargo)");

if(financiar){

precio = precio * 1.10;

}

return precio;

}


// agregar carrito
function agregarCarrito(moto,precio){

carrito.push(moto);

total += precio;

}


// aplicar descuento
function aplicarDescuento(){

if(carrito.length >= 3){

let descuento = total * 0.15;

total = total - descuento;

alert("Se aplicó un descuento del 15% por comprar 3 o más motos");

}

}


// mostrar resumen
function mostrarResumen(){

alert(

"Resumen de compra\n\n" +
"Motos compradas: " + carrito.join(", ") +
"\nCantidad: " + carrito.length +
"\nTotal a pagar: $" + total

);

console.log("Carrito:",carrito);
console.log("Total:",total);

}


// PROGRAMA PRINCIPAL
function iniciarSimulador(){

alert("Bienvenido al simulador de motocross");

let presupuesto = prompt("Ingrese su presupuesto en dólares");

let continuar = true;

while(continuar){

mostrarMotos();

let seleccion = elegirMoto();

if(seleccion >=0 && seleccion < motos.length){

let precioFinal = calcularPrecio(seleccion);

if(precioFinal <= presupuesto){

alert("Moto agregada al carrito");

agregarCarrito(motos[seleccion],precioFinal);

presupuesto -= precioFinal;

}else{

alert("No tienes suficiente presupuesto");

}

}else{

alert("Opción inválida");

}

continuar = confirm("¿Desea comprar otra moto?");

}

aplicarDescuento();

mostrarResumen();

}


// iniciar simulador
iniciarSimulador();
