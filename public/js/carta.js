// /js/carta.js
const productos = document.querySelectorAll('.producto');
const categorias = document.querySelectorAll('.categoria-tab');
const carritoContainer = document.getElementById('carrito');
const subtotalEl = document.getElementById('subtotal');
const finalizarBtn = document.getElementById('finalizar-pedido');

let carrito = {};

// --- Formatear precio ---
function formatearPrecio(precio) {
  return `$${precio.toLocaleString('es-CL')}`;
}

// --- Actualizar carrito ---
function actualizarCarrito() {
  carritoContainer.innerHTML = '';
  let subtotal = 0;

  Object.values(carrito).forEach(item => {
    subtotal += item.precio * item.cantidad;

    const div = document.createElement('div');
    div.className = 'flex justify-between items-center bg-primary/10 dark:bg-primary/20 p-2 rounded-lg';
    div.innerHTML = `
      <span>${item.nombre}</span>
      <div class="flex items-center gap-2">
        <button class="restar text-red-500 font-bold px-2">-</button>
        <span>${item.cantidad}</span>
        <button class="sumar text-green-500 font-bold px-2">+</button>
        <span>${formatearPrecio(item.precio * item.cantidad)}</span>
      </div>
    `;

    // Botones +
    div.querySelector('.sumar').addEventListener('click', () => {
      item.cantidad += 1;
      actualizarCarrito();
    });

    // Botones -
    div.querySelector('.restar').addEventListener('click', () => {
      item.cantidad -= 1;
      if (item.cantidad <= 0) delete carrito[item.id];
      actualizarCarrito();
    });

    carritoContainer.appendChild(div);
  });

  subtotalEl.textContent = formatearPrecio(subtotal);
}

// --- Agregar producto al carrito ---
productos.forEach((prod, index) => {
  const btn = prod.querySelector('.agregar');
  btn.addEventListener('click', () => {
    const nombre = prod.querySelector('p.font-display').textContent;
    const precio = parseInt(prod.querySelector('p.font-semibold').textContent.replace(/\D/g, ''));
    const id = index; // id único por producto

    if (carrito[id]) {
      carrito[id].cantidad += 1;
    } else {
      carrito[id] = { id, nombre, precio, cantidad: 1 };
    }

    actualizarCarrito();
  });
});

// --- Filtrar por categoría ---
categorias.forEach(cat => {
  cat.addEventListener('click', (e) => {
    e.preventDefault();
    const categoria = cat.dataset.categoria;

    // Activar pestaña
    categorias.forEach(c => c.classList.remove('active-tab', 'text-primary', 'border-b-primary'));
    categorias.forEach(c => c.classList.add('text-gray-500', 'dark:text-gray-400', 'border-b-transparent'));
    cat.classList.add('active-tab', 'text-primary', 'border-b-primary');
    cat.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-b-transparent');

    // Mostrar productos
    productos.forEach(prod => {
      if (prod.dataset.categoria.includes(categoria)) {
        prod.classList.remove('hidden');
      } else {
        prod.classList.add('hidden');
      }
    });
  });
});

// --- Finalizar pedido por WhatsApp ---
finalizarBtn.addEventListener('click', () => {
  if (Object.keys(carrito).length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  let mensaje = '¡Hola! Quiero hacer este pedido:\n\n';
  Object.values(carrito).forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad}: ${formatearPrecio(item.precio * item.cantidad)}\n`;
  });
  const subtotal = Object.values(carrito).reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  mensaje += `\nSubtotal: ${formatearPrecio(subtotal)}`;

});

// --- Mejorar sticky de barra de categorías ---
const barraCategorias = document.querySelector('.sticky');
barraCategorias.style.top = '0';
barraCategorias.style.zIndex = '50';
barraCategorias.style.paddingTop = '0.5rem';
// --- Modal de confirmación ---
const modal = document.getElementById('modalPedido');
const nombreInput = document.getElementById('nombreCliente');
const direccionInput = document.getElementById('direccionCliente');
const cancelarBtn = document.getElementById('cancelarPedido');
const confirmarBtn = document.getElementById('confirmarPedido');

// Abrir modal al finalizar pedido
finalizarBtn.addEventListener('click', () => {
  if (Object.keys(carrito).length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  modal.classList.remove('hidden');
});

// Cerrar modal
cancelarBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Confirmar pedido y enviar WhatsApp
confirmarBtn.addEventListener('click', () => {
  const nombre = nombreInput.value.trim();
  const direccion = direccionInput.value.trim();

  if (!nombre || !direccion) {
    alert('Por favor ingresa tu nombre y dirección');
    return;
  }

  let mensaje = `¡Hola! Soy ${nombre}, quiero hacer este pedido:\n\n`;
  Object.values(carrito).forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad}: ${formatearPrecio(item.precio * item.cantidad)}\n`;
  });

  const subtotal = Object.values(carrito).reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  mensaje += `\nSubtotal: ${formatearPrecio(subtotal)}`;
  mensaje += `\nDirección de envío: ${direccion}`;

  const url = `https://wa.me/56935621667?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');

  // Limpiar modal y carrito
  modal.classList.add('hidden');
  nombreInput.value = '';
  direccionInput.value = '';
  carrito = {};
  actualizarCarrito();
});
