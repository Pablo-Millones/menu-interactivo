// /js/carta.js

const productos = document.querySelectorAll('.producto');
const categorias = document.querySelectorAll('.categoria-tab');
const carritoContainer = document.getElementById('carrito');
const subtotalEl = document.getElementById('subtotal');
const finalizarBtn = document.getElementById('finalizar-pedido');

// --- Elementos móviles ---
const subtotalMovil = document.getElementById('subtotal-movil');
const totalMovil = document.getElementById('total-movil');
const carritoMovilContenido = document.getElementById('carrito-contenido');
const modalCarrito = document.getElementById('modalCarrito');
const abrirCarrito = document.getElementById('abrirCarrito');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const finalizarMovilBtn = document.getElementById('finalizar-pedido-movil');

let carrito = {};

// --- Formatear precio ---
function formatearPrecio(precio) {
  return `$${precio.toLocaleString('es-CL')}`;
}

// --- Actualizar carrito (desktop y móvil sincronizados) ---
function actualizarCarrito() {
  carritoContainer.innerHTML = '';
  carritoMovilContenido.innerHTML = '';
  let subtotal = 0;

  Object.values(carrito).forEach(item => {
    subtotal += item.precio * item.cantidad;

    // 🖥 Carrito escritorio
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

    // 📱 Carrito móvil
    const divMovil = div.cloneNode(true);

    // Eventos para escritorio
    div.querySelector('.sumar').addEventListener('click', () => {
      item.cantidad += 1;
      actualizarCarrito();
    });
    div.querySelector('.restar').addEventListener('click', () => {
      item.cantidad -= 1;
      if (item.cantidad <= 0) delete carrito[item.id];
      actualizarCarrito();
    });

    // Eventos para móvil
    divMovil.querySelector('.sumar').addEventListener('click', () => {
      item.cantidad += 1;
      actualizarCarrito();
    });
    divMovil.querySelector('.restar').addEventListener('click', () => {
      item.cantidad -= 1;
      if (item.cantidad <= 0) delete carrito[item.id];
      actualizarCarrito();
    });

    carritoContainer.appendChild(div);
    carritoMovilContenido.appendChild(divMovil);
  });

  subtotalEl.textContent = formatearPrecio(subtotal);
  subtotalMovil.textContent = formatearPrecio(subtotal);
  totalMovil.textContent = formatearPrecio(subtotal);
}

// --- Agregar producto ---
productos.forEach((prod, index) => {
  const btn = prod.querySelector('.agregar');
  btn.addEventListener('click', () => {
    const nombre = prod.querySelector('p.font-display').textContent;
    const precio = parseInt(prod.querySelector('p.font-semibold').textContent.replace(/\D/g, ''));
    const id = index;

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

    categorias.forEach(c => c.classList.remove('active-tab', 'text-primary', 'border-b-primary'));
    categorias.forEach(c => c.classList.add('text-gray-500', 'dark:text-gray-400', 'border-b-transparent'));
    cat.classList.add('active-tab', 'text-primary', 'border-b-primary');
    cat.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-b-transparent');

    productos.forEach(prod => {
      if (prod.dataset.categoria.includes(categoria)) {
        prod.classList.remove('hidden');
      } else {
        prod.classList.add('hidden');
      }
    });
  });
});

// --- Modal de confirmación escritorio ---
const modal = document.getElementById('modalPedido');
const nombreInput = document.getElementById('nombreCliente');
const direccionInput = document.getElementById('direccionCliente');
const cancelarBtn = document.getElementById('cancelarPedido');
const confirmarBtn = document.getElementById('confirmarPedido');

finalizarBtn.addEventListener('click', () => {
  if (Object.keys(carrito).length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  modal.classList.remove('hidden');
});

cancelarBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// --- Confirmar pedido ---
function enviarPedido(nombre, direccion) {
  let mensaje = `¡Hola! Soy ${nombre}, quiero hacer este pedido:\n\n`;
  Object.values(carrito).forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad}: ${formatearPrecio(item.precio * item.cantidad)}\n`;
  });

  const subtotal = Object.values(carrito).reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  mensaje += `\nSubtotal: ${formatearPrecio(subtotal)}`;
  mensaje += `\nDirección de envío: ${direccion}`;

  const url = `https://wa.me/56935621667?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');

  carrito = {};
  actualizarCarrito();
}

confirmarBtn.addEventListener('click', () => {
  const nombre = nombreInput.value.trim();
  const direccion = direccionInput.value.trim();

  if (!nombre || !direccion) {
    alert('Por favor ingresa tu nombre y dirección');
    return;
  }

  enviarPedido(nombre, direccion);
  modal.classList.add('hidden');
  nombreInput.value = '';
  direccionInput.value = '';
});

// --- Carrito móvil ---
abrirCarrito?.addEventListener('click', () => {
  modalCarrito.classList.remove('hidden');
  setTimeout(() => modalCarrito.classList.add('show'), 10);
});
cerrarCarrito?.addEventListener('click', () => {
  modalCarrito.classList.remove('show');
  setTimeout(() => modalCarrito.classList.add('hidden'), 200);
});

finalizarMovilBtn?.addEventListener('click', () => {
  modalCarrito.classList.remove('show');
  setTimeout(() => modalCarrito.classList.add('hidden'), 200);
  modal.classList.remove('hidden');
});

// --- Mejorar sticky de barra de categorías ---
const barraCategorias = document.querySelector('.sticky');
if (barraCategorias) {
  barraCategorias.style.top = '0';
  barraCategorias.style.zIndex = '50';
  barraCategorias.style.paddingTop = '0.5rem';
}
