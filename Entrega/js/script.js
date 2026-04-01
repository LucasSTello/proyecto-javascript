/**
 * Yamaha MX Store - Simulator
 * Desarrollado con JavaScript puro (Vanilla JS).
 */

// --- 1. BASE DE DATOS DE PRODUCTOS (Array de Objetos) ---
const productos = [
    {
        id: 1,
        nombre: "Yamaha YZ450F 2024",
        precio: 9500,
        categoria: "motos",
        imagen: "img/Yamaha YZ450F 2024.webp"
    },
    {
        id: 2,
        nombre: "Yamaha YZ250F 2024",
        precio: 8500,
        categoria: "motos",
        imagen: "img/Yamaha YZ250F 2024.webp"
    },
    {
        id: 3,
        nombre: "Casco MX Airoh Aviator 3",
        precio: 750,
        categoria: "cascos",
        imagen: "img/Casco MX Airoh Aviator 3.webp"
    },
    {
        id: 4,
        nombre: "Casco Alpinestars Supertech S-M10",
        precio: 650,
        categoria: "cascos",
        imagen: "img/Casco Alpinestars Supertech S-M10.jpg"
    },
    {
        id: 5,
        nombre: "Conjunto Fox Racing 360",
        precio: 250,
        categoria: "equipamiento",
        imagen: "img/Conjunto Fox Racing 360.webp"
    },
    {
        id: 6,
        nombre: "Botas Alpinestars Tech 10",
        precio: 600,
        categoria: "equipamiento",
        imagen: "img/Botas Alpinestars Tech 10.webp"
    },
    {
        id: 7,
        nombre: "Guantes Yamaha Racing GYTR",
        precio: 45,
        categoria: "equipamiento",
        imagen: "img/Guantes Yamaha Racing GYTR.jpg"
    },
    {
        id: 8,
        nombre: "Escape FMF Factory 4.1",
        precio: 890,
        categoria: "accesorios",
        imagen: "img/accesorios.webp"
    },
    {
        id: 9,
        nombre: "Manubrio Renthal Twinwall",
        precio: 150,
        categoria: "accesorios",
        imagen: "img/Manubrio Renthal Twinwall.jpg"
    }
];

// --- 2. ESTADO DE LA APLICACIÓN (Persistencia con LocalStorage) ---
// Intentamos recuperar el carrito, si es null (primera vez), inicializamos array vacío.
let carrito = JSON.parse(localStorage.getItem('yamaha_carrito')) || [];

// --- 3. SELECCIÓN DE ELEMENTOS DEL DOM ---
const productsContainer = document.getElementById('products-container');
const filterBtns = document.querySelectorAll('.filter-btn');

const cartOverlay = document.getElementById('cart-overlay');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');

const checkoutBtn = document.getElementById('checkout-btn');
const checkoutMsg = document.getElementById('checkout-msg');


// --- 4. FUNCIONES DE RENDERIZADO VISUAL ---

/**
 * Función para dar formato a los números como Moneda USD ($x,xxx.xx)
 */
const formatPrice = (price) => {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Renderiza dinámicamente el HTML de las tarjetas de producto en base al catálogo
 * @param {string} categoriaFiltro - Categoría a mostrar ('todos', 'motos', etc)
 */
const renderProductos = (categoriaFiltro = 'todos') => {
    // 1. Vaciamos el contenedor físico
    productsContainer.innerHTML = '';

    // 2. Filtramos la base usando métodos de arrays abstractos
    const productosFiltrados = categoriaFiltro === 'todos' 
        ? productos 
        : productos.filter(p => p.categoria === categoriaFiltro);

    // 3. Iteramos para inyectar al DOM (Manipulación)
    productosFiltrados.forEach(producto => {
        const card = document.createElement('article');
        card.classList.add('product-card');

        // Contenido interno usando Template Strings
        card.innerHTML = `
            <img class="product-img" src="${producto.imagen}" alt="${producto.nombre}">
            <div class="product-info">
                <span class="product-category">${producto.categoria}</span>
                <h3 class="product-name">${producto.nombre}</h3>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(producto.precio)}</span>
                    <button class="btn-add" data-id="${producto.id}">Agregar</button>
                </div>
            </div>
        `;

        // 4. Asignamos Eventos al Instante (Evitando alert)
        const btnAdd = card.querySelector('.btn-add');
        btnAdd.addEventListener('click', () => agregarAlCarrito(producto.id));

        // 5. Appends al DOM Global
        productsContainer.appendChild(card);
    });
};


// --- 5. LÓGICA CORE: CARRITO DE COMPRAS ---

/**
 * Guarda el array JS puro en formato texto JSON persistente del Navegador.
 */
const guardarCarrito = () => {
    localStorage.setItem('yamaha_carrito', JSON.stringify(carrito));
};

/**
 * Evalua cantidad de items agregados y actualiza memoria.
 * @param {number} id - Identificador del producto a buscar.
 */
const agregarAlCarrito = (id) => {
    // Buscar si ya existe la coincidencia usando .find() de Array
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        // Enlaza por referencia de objeto JS, muta cantidad directo
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, buscamos el producto en BD e insertamos un nuevo objeto al carrito (Propiedad extra: cantidad)
        const productoDB = productos.find(p => p.id === id);
        carrito.push({
            ...productoDB,      // Spread operator para clonación parcial
            cantidad: 1
        });
    }

    // Guardado persistente inmediato y renderización visual
    guardarCarrito();
    actualizarCarritoUI();

    // Feedback Visual: Abrir panel lateral automáticamente 
    cartOverlay.classList.remove('hidden');
};

/**
 * Filter destructivo para erradicar un item de la orden.
 */
const eliminarDelCarrito = (id) => {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarritoUI();
};

/**
 * Suma y resta del sub-contador individual.
 */
const cambiarCantidad = (id, accion) => {
    const producto = carrito.find(item => item.id === id);
    if (!producto) return;

    if (accion === 'sumar') {
        producto.cantidad += 1;
    } else if (accion === 'restar') {
        producto.cantidad -= 1;
        if (producto.cantidad <= 0) {
            // Elimina si llega a 0
            eliminarDelCarrito(id);
            return;
        }
    }

    guardarCarrito();
    actualizarCarritoUI();
};


// --- 6. RENDERIZADO DEL INTERFACE DEL CARRITO ---

/**
 * Pinta visualmente los elementos HTML flotantes leyendo variables locales.
 */
const actualizarCarritoUI = () => {
    // 1. Reset
    cartItemsContainer.innerHTML = '';

    // Estado Default
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu carrito está vacío. Empieza a equiparte.</div>';
        cartCount.textContent = '0';
        cartTotalPrice.textContent = '$0.00';
        return;
    }

    // 2. Cálculo lógico (Reduce procedural)
    let totalItems = 0;
    let totalPrecio = 0;

    carrito.forEach(item => {
        totalItems += item.cantidad;
        totalPrecio += (item.precio * item.cantidad);

        // 3. Generación DOM dinámica
        const cartElement = document.createElement('div');
        cartElement.classList.add('cart-item');

        cartElement.innerHTML = `
            <img class="cart-item-img" src="${item.imagen}" alt="${item.nombre}">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.nombre}</h4>
                <div class="cart-item-price">${formatPrice(item.precio)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn btn-restar">-</button>
                <span class="cart-item-qty">${item.cantidad}</span>
                <button class="qty-btn btn-sumar">+</button>
                <button class="remove-btn" title="Eliminar">&times;</button>
            </div>
        `;

        // 4. Asignación Individual Funcional de click handlers
        cartElement.querySelector('.btn-restar').addEventListener('click', () => cambiarCantidad(item.id, 'restar'));
        cartElement.querySelector('.btn-sumar').addEventListener('click', () => cambiarCantidad(item.id, 'sumar'));
        cartElement.querySelector('.remove-btn').addEventListener('click', () => eliminarDelCarrito(item.id));

        cartItemsContainer.appendChild(cartElement);
    });

    // Actualiza Badge e Índices Generales
    cartCount.textContent = totalItems;
    cartTotalPrice.textContent = formatPrice(totalPrecio);
};


// --- 7. EVENTOS GENERALES GLOBALES (Botón Cierre, Navegación, Checkout) ---

// UI Control del Panel Overlay (Interacción libre de Alert)
cartBtn.addEventListener('click', () => cartOverlay.classList.remove('hidden'));
closeCartBtn.addEventListener('click', () => cartOverlay.classList.add('hidden'));

// Cierre haciendo click al oscuro exterior flotante
cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
        cartOverlay.classList.add('hidden');
    }
});

// Navegación de Categorías Activas con clase .active
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remover de los inactivos
        filterBtns.forEach(b => b.classList.remove('active'));
        // Agregar activo visual a actual objetivo
        e.target.classList.add('active');
        
        // Renderiza el Dataset particular presionado
        const categoria = e.target.getAttribute('data-category');
        renderProductos(categoria);
    });
});

// Confirmación transaccional Frontend Simulada (Event Submit / Click)
checkoutBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
        checkoutMsg.textContent = 'Tu carrito está vacío, agrega un subtotal primero.';
        checkoutMsg.className = 'msg error';
        checkoutMsg.classList.remove('hidden');
    } else {
        checkoutMsg.textContent = '¡Compra confirmada! Preparando tu equipo Yamaha.';
        checkoutMsg.className = 'msg success';
        checkoutMsg.classList.remove('hidden');

        // Limpiar la lógica y memoria
        carrito = [];
        guardarCarrito();
        
        // Timeout falso con efecto de recarga UI
        setTimeout(() => {
            actualizarCarritoUI();
            checkoutMsg.classList.add('hidden');
            cartOverlay.classList.add('hidden');
        }, 2200);
    }
});


// --- 8. INICIO BOOT APLICACIÓN ---
renderProductos('todos'); // Render de vista principal
actualizarCarritoUI();    // Verificación de caché previo para pintar Badge
