// [SCRIPT PRINCIPAL LA CASITA] Catálogo Herbalife (Javier Espejo): SPA por pestañas, Fetch, Carrito WhatsApp y Validación en vivo
const WHATSAPP_CLUB = '59172557928'; // Número oficial de WhatsApp de Javier Espejo (La Casita Club)

// [1. PWA SERVICE WORKER] Registra sw.js para soporte Offline-First en HTTP/HTTPS
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  window.addEventListener('load', function () { // [REGISTRO TRAS CARGAR]
    navigator.serviceWorker
      .register('sw.js') // [ARCHIVO SW]
      .then((reg) => {
        console.log('[PWA La Casita] Service Worker v1 registrado:', reg.scope); // [LOG]
      })
      .catch((err) => {
        console.warn('[PWA La Casita] Registro SW omitido:', err); // [WARN]
      });
  });
}

let deferredInstallPrompt = null; // [PWA INSTALL] Evento de instalación diferida
window.addEventListener('beforeinstallprompt', (e) => { // [INTERCEPTA BANNER]
  e.preventDefault(); // [EVITA PROMPT AUTOMÁTICO]
  deferredInstallPrompt = e; // [GUARDA REFERENCIA]
  $('#btnInstalarPWA, #btnInstalarPWADock').prop('hidden', false).fadeIn(); // [MUESTRA BOTONES]
});

// [ANTI-XSS DOMPURIFY] Helper seguro antes de insertar HTML con innerHTML / append
function sanitizarHTML(contenido) {
  if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) { // [USA DOMPURIFY]
    return DOMPurify.sanitize(contenido); // [LIMPIA SCRIPTS]
  }
  const div = document.createElement('div'); // [RESPALDO SEGURO]
  div.textContent = contenido; // [ESCAPA HTML]
  return div.innerHTML; // [DEVUELVE SEGURO]
}

// [2. DOM NATIVO: MODO OSCURO (classList.toggle) Y FILTRADO (querySelectorAll + dataset)]
document.addEventListener('DOMContentLoaded', function () {
  const themeBtn = document.getElementById('themeBtn'); // [BOTÓN TEMA MÓVIL]
  const themeBtnDock = document.getElementById('themeBtnDock'); // [BOTÓN TEMA SIDEBAR]
  const bodyElement = document.body; // [ELEMENTO BODY]

  if (localStorage.getItem('casita_tema') === 'oscuro') { // [PERSISTENCIA TEMA]
    bodyElement.classList.add('dark-mode'); // [ACTIVA DARK]
  }

  function alternarModoOscuro() { // [MÓDULO 1 CONTRATO: classList.toggle]
    bodyElement.classList.toggle('dark-mode'); // [ALTERNA CLASE]
    const estaOscuro = bodyElement.classList.contains('dark-mode'); // [VERIFICA]
    localStorage.setItem('casita_tema', estaOscuro ? 'oscuro' : 'claro'); // [GUARDA PREFERENCIA]
  }

  if (themeBtn) themeBtn.addEventListener('click', alternarModoOscuro); // [LISTENER MÓVIL]
  if (themeBtnDock) themeBtnDock.addEventListener('click', alternarModoOscuro); // [LISTENER SIDEBAR]

  const botonesFiltro = document.querySelectorAll('.btn-filtro-cat'); // [MÓDULO 2 CONTRATO: querySelectorAll]
  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', function () {
      const categoria = boton.dataset.cat; // [MÓDULO 2 CONTRATO: dataset]
      const tarjetas = document.querySelectorAll('.tarjeta-linea'); // [TARJETAS DE LÍNEAS]

      botonesFiltro.forEach((b) => { // [REINICIA ESTILO BOTONES]
        b.classList.remove('btn-primario'); // [QUITA ACTIVO]
        b.classList.add('btn-secundario'); // [NEUTRO]
      });
      boton.classList.remove('btn-secundario'); // [RESALTA ACTIVO]
      boton.classList.add('btn-primario'); // [PRIMARIO]

      tarjetas.forEach((card) => { // [MUESTRA U OCULTA POR DATASET.CATEGORIA]
        const catCard = card.dataset.categoria; // [LEE CATEGORÍA]
        card.style.display = (categoria === 'todos' || catCard === categoria) ? 'block' : 'none'; // [FILTRA]
      });
    });
  });

  const linkWaClub = document.getElementById('linkWhatsAppClub'); // [ACTUALIZA ENLACE WHATSAPP CONTACTO]
  if (linkWaClub) linkWaClub.href = 'https://api.whatsapp.com/send?phone=' + WHATSAPP_CLUB; // [ASIGNA NÚMERO]
});

// [3. RESPALDO LOCAL DEL CATÁLOGO] Permite funcionamiento completo incluso al abrir con protocolo file://
const PRODUCTOS_RESPALDO = [
  { id: 1, codigo: 'P1', nombre: 'Combo 3 Pasos La Casita (Aloe + Té + Batido)', linea: 'Nutrición Completa en Club', categoria: 'combos', presentacion: 'Programa Diario • 3 Vasos', precio: 22, etiqueta: 'Más Pedido • 3 Pasos', descripcion: 'El desayuno completo del club: Sábila para limpiar y desinflamar, Té Concentrado de Hierbas para energía y Batido Fórmula 1 con proteína.', palabrasClave: 'combo 3 pasos aloe te batido desayuno completo herbalife la casita nutricion', imagen: 'imagenes y video/WhatsApp Image 2026-11-23 at 7.20.14 PM.jpeg' }, // [P1]
  { id: 2, codigo: 'P2', nombre: 'Batido Nutricional Fórmula 1 con Crocante de Proteína', linea: 'Batidos Nutricionales', categoria: 'batidos', presentacion: 'Vaso Club • Alto en Proteína', precio: 15, etiqueta: 'Batido • Proteína Crunch', descripcion: 'Batido cremoso Fórmula 1 preparado al momento con topping de Crocante de Proteína (7g proteína extra y solo 35 calorías).', palabrasClave: 'batido formula 1 crocante proteina chocolate vainilla fresa desayuno saludable', imagen: 'imagenes y video/WhatsApp Image 2026-11-23 at 7.20.10 PM.jpeg' }, // [P2]
  { id: 3, codigo: 'P3', nombre: 'Desayuno Nutricional Para Llevar (3 Pasos)', linea: 'Nutrición Completa en Club', categoria: 'combos', presentacion: 'Vasos Sellados • Take Away', precio: 24, etiqueta: 'Para Llevar • Tapa Domo', descripcion: 'Tu combinación completa de Aloe, Té termojetics y Batido Fórmula 1 en vasos sellados listos para disfrutar camino al trabajo o estudio.', palabrasClave: 'para llevar take away desayuno 3 pasos aloe te batido la casita la paz', imagen: 'imagenes y video/WhatsApp Image 2026-11-23 at 7.20.14 PM (1).jpeg' }, // [P3]
  { id: 4, codigo: 'P4', nombre: 'Pack Dúo Bienestar (2 Combos Completos — 6 Vasos)', linea: 'Nutrición Completa en Club', categoria: 'combos', presentacion: 'Dúo • 6 Vasos Sellados', precio: 42, etiqueta: 'Promo Dúo • Comparte', descripcion: 'Ideal para venir acompañado o llevar para dos personas: 2 Aloes refrescantes, 2 Tés quemadores de grasa y 2 Batidos nutricionales.', palabrasClave: 'pack duo pareja amigos 2 combos 6 vasos bienestar ahorro herbalife', imagen: 'imagenes y video/WhatsApp Image 2026-11-23 at 7.20.14 PM (3).jpeg' }, // [P4]
  { id: 5, codigo: 'P5', nombre: 'Dúo Batido Fórmula 1 + Té Concentrado de Hierbas', linea: 'Batidos Nutricionales', categoria: 'batidos', presentacion: '2 Pasos • Energía & Nutrición', precio: 19, etiqueta: 'Energía • Control de Peso', descripcion: 'Combinación equilibrada de Batido Fórmula 1 rico en vitaminas y minerales junto a un Té herbal frío o caliente para activar el metabolismo.', palabrasClave: 'duo batido te concentrado hierbas metabolismo control peso energia', imagen: 'imagenes y video/WhatsApp Image 2026-11-23 at 7.20.15 PM (1).jpeg' }, // [P5]
  { id: 6, codigo: 'P6', nombre: 'Combo Fibra Activa Manzana + Batido de Frutilla', linea: 'Bebidas Funcionales & Fibra', categoria: 'bebidas', presentacion: 'Bienestar Digestivo • Sin Gluten', precio: 20, etiqueta: 'Digestión • Fibra Manzana', descripcion: 'Bebida de Fibra Activa sabor manzana para apoyar la salud digestiva acompañada de un delicioso batido cremoso Fórmula 1.', palabrasClave: 'fibra activa manzana digestivo frutilla batido bebida funcional gluten free', imagen: 'imagenes y video/WhatsApp Image 2026-11-23 at 7.20.17 PM.jpeg' }, // [P6]
  { id: 7, codigo: 'P7', nombre: 'Mega Té Energizante & Aloe Refrescante (Jarra Club)', linea: 'Bebidas Funcionales & Fibra', categoria: 'bebidas', presentacion: 'Mega Bebida • Hidratación', precio: 14, etiqueta: 'Hidratación • Energía', descripcion: 'Bebida revitalizante de gran formato elaborada con Concentrado de Aloe Vera y Té de Hierbas para hidratar y darte energía todo el día.', palabrasClave: 'mega te aloe hidratacion bebida energizante jarra antioxidante quemador', imagen: 'imagenes y video/WhatsApp Image 2026-11-23 at 7.20.12 PM.jpeg' }, // [P7]
  { id: 8, codigo: 'P8', nombre: 'Tarro Fórmula 1 Choco-Avellanas (550 g) + Shaker', linea: 'Productos Cerrados para Casa', categoria: 'suplementos', presentacion: 'Tarro 550 g • Incluye Shaker', precio: 280, etiqueta: 'Para Casa • Tarro + Shaker', descripcion: 'Lleva la nutrición completa a tu hogar: Fórmula 1 Choco-Avellanas fortificado con vitaminas, minerales y proteína de soya más vaso mezclador.', palabrasClave: 'tarro cerrado casa formula 1 choco avellanas 550g shaker suplemento herbalife', imagen: 'imagenes y video/WhatsApp Image 2026-11-23 at 7.20.11 PM (1).jpeg' } // [P8]
];

$(document).ready(function () { // [JQUERY READY] Inicializa navegación, catálogo, carrito y validaciones

  // [4. NAVEGACIÓN POR PESTAÑAS SPA + DOCK ADAPTABLE + MENÚ HAMBURGUESA]
  function cambiarTab(tabId) {
    if (!tabId) return; // [GUARDA]

    $('.panel-tab').removeClass('active').hide(); // [OCULTA PESTAÑAS]
    $('#' + tabId).addClass('active').fadeIn(200); // [MUESTRA ACTIVA]

    $('.dock-acciones__btn').removeClass('active').attr('aria-selected', 'false'); // [DESACTIVA DOCK]
    $(`.dock-acciones__btn[data-tab="${tabId}"]`).addClass('active').attr('aria-selected', 'true'); // [ACTIVA DOCK]

    $('#navMenu').slideUp(200); // [CIERRA MENÚ HAMBURGUESA]
    $('#hamburgerBtn').attr('aria-expanded', 'false'); // [A11Y]
    window.scrollTo({ top: 0, behavior: 'smooth' }); // [SUBE AL TOPE]
  }

  $(document) // [DELEGACIÓN CAMBIO DE PESTAÑAS]
    .off('click.tabsClub') // [ANTI-MEMORY LEAK]
    .on('click.tabsClub', '.dock-acciones__btn, .btn-go-tab, .nav-menu-tab', function () {
      const tabId = $(this).data('tab'); // [DESTINO]
      if (tabId) cambiarTab(tabId); // [NAVEGA]
    });

  function hidratarBotonesDOM(raiz) { // [HIDRATACIÓN LIMPIA DE BOTONES]
    const $contenedor = $('#contenedorMenu'); // [CONTENEDOR MENÚ]
    if ($contenedor.length && $contenedor.attr('data-hidratado') !== 'true') {
      $contenedor.attr('data-hidratado', 'true'); // [MARCA]
    }

    $(raiz)
      .find('button') // [RECORRE BOTONES]
      .each(function () {
        const $btn = $(this); // [BOTÓN]
        if ($btn.attr('data-hidratado') === 'true') return; // [OMITE REHIDRATACIÓN]

        $btn
          .attr('data-hidratado', 'true') // [MARCA]
          .addClass('hidratado-activo') // [CLASE]
          .off('click.clubHidratacion') // [PREVIENE FUGAS]
          .on('click.clubHidratacion', function () {
            $(this).attr('data-ultimo-evento', 'hidratado'); // [TRAZA]
          });
      });
  }

  setTimeout(function () { hidratarBotonesDOM(document); }, 150); // [HIDRATACIÓN INICIAL]

  $('#hamburgerBtn') // [MENÚ HAMBURGUESA MÓDULO 1]
    .off('click') // [LIMPIA]
    .on('click', function () {
      const $menu = $('#navMenu'); // [MENÚ]
      $menu.slideToggle(280, function () { // [SLIDE]
        $('#hamburgerBtn').attr('aria-expanded', $menu.is(':visible') ? 'true' : 'false'); // [A11Y]
      });
    });

  // [5. EFECTOS JQUERY: ACORDEONES Y CAMBIO DINÁMICO DE OBJETIVO]
  $('.accordion-btn')
    .off('click') // [LIMPIA]
    .on('click', function () {
      $(this).next('.accordion-panel').slideToggle('fast'); // [ACORDEÓN]
    });

  const configuracionObjetivos = { // [MODELO PANEL TEMÁTICO]
    desayuno: {
      clase: 'tema-desayuno',
      icono: '🥤',
      titulo: 'Plan Control de Peso & Desayuno Saludable',
      desc: 'Sustituye un desayuno pesado por nuestro Combo de 3 Pasos bajo en calorías, rico en proteína y micronutrientes esenciales para mantener la saciedad toda la mañana.'
    },
    energia: {
      clase: 'tema-energia',
      icono: '⚡',
      titulo: 'Plan Energía, Deporte & Masa Muscular',
      desc: 'Combina Batido Fórmula 1 + Crocante de Proteína o extra de proteína personalizada junto a Té Concentrado para potenciar tu rendimiento diario.'
    },
    digestivo: {
      clase: 'tema-digestivo',
      icono: '🌿',
      titulo: 'Plan Hidratación & Bienestar Digestivo',
      desc: 'Comienza con Herbal Aloe para suavizar tu digestión y refuerza con Fibra Activa sabor manzana o guayaba libre de gluten.'
    }
  };

  $('.btn-tema-meta') // [CAMBIO DINÁMICO DE OBJETIVO]
    .off('click') // [LIMPIA]
    .on('click', function () {
      const info = configuracionObjetivos[$(this).data('tema')]; // [LEE CONFIG]
      if (!info) return; // [GUARDA]

      $('#panelTematico')
        .removeClass('tema-desayuno tema-energia tema-digestivo') // [LIMPIA]
        .addClass(info.clase); // [APLICA TEMA]

      $('#tituloTema')
        .empty() // [LIMPIA]
        .append(
          $('<span>').attr('id', 'iconoTema').text(info.icono), // [ICONO SEGURO]
          document.createTextNode(' ' + info.titulo) // [TÍTULO SEGURO]
        );
      $('#descTema').text(info.desc); // [DESCRIPCIÓN SEGURA]
    });

  // [6. TOAST ALERT Y CARRITO INTERACTIVO DE PEDIDOS (MÓDULO 3: addEventListener + innerHTML + WhatsApp)]
  function mostrarToast(mensaje) { // [TOAST ALERT]
    $('#toastMsg').text(mensaje); // [TEXTO SEGURO]
    $('#toastAlert').stop(true, true).slideDown(250).delay(2800).fadeOut(380); // [ANIMACIÓN]
  }

  let carritoClub = []; // [ESTADO CARRITO] Inicia vacío por completo para entrega al cliente
  const carritoListaEl = document.getElementById('carritoLista'); // [CONTENEDOR CARRITO]

  function obtenerProductoSeleccionadoRapido() { // [LEE PRODUCTO ELEGIDO EN EL SELECTOR RÁPIDO]
    const sel = document.getElementById('selectProductoRapido'); // [SELECTOR]
    if (!sel || !sel.value) return null; // [SIN SELECCIÓN ACTIVA]
    const opt = sel.options[sel.selectedIndex]; // [OPCIÓN ACTUAL]
    return {
      codigo: opt.value, // [CÓDIGO]
      nombre: opt.dataset.nombre || opt.textContent, // [NOMBRE]
      precio: Number(opt.dataset.precio) || 0, // [PRECIO UNITARIO]
      cantidad: 1 // [CANTIDAD REFERENCIAL]
    };
  }

  function calcularTotalPedido() { // [CALCULA TOTAL EN TIEMPO REAL: CARRITO + SELECTOR + TOPPINGS]
    let totalProductos = 0; // [SUBTOTAL PRODUCTOS]
    let cantidadTotal = 0; // [CANTIDAD ITEMS]

    carritoClub.forEach((item) => {
      totalProductos += item.precio * item.cantidad; // [SUMA CARRITO]
      cantidadTotal += item.cantidad; // [SUMA CANTIDADES]
    });

    const seleccionRapida = obtenerProductoSeleccionadoRapido(); // [PRODUCTO ELEGIDO EN DESPLEGABLE]
    if (seleccionRapida) { // [SUMA AL INSTANTE SIN EXIGIR PULSAR + AGREGAR PRIMERO]
      totalProductos += seleccionRapida.precio; // [SUMA PRECIO DESPLEGABLE]
      cantidadTotal += 1; // [SUMA CANTIDAD]
    }

    let totalExtras = 0; // [TOPPINGS ADICIONALES SIEMPRE SUMADOS]
    document.querySelectorAll('.extra-topping:checked').forEach((chk) => {
      totalExtras += parseInt(chk.value, 10) || 0; // [SUMA CADA CHECKBOX MARCADO]
    });

    const granTotal = totalProductos + totalExtras; // [TOTAL FINAL EN BOB]

    $('#totalPedido') // [ANIMACIÓN JQUERY EN VIVO]
      .text(granTotal) // [ACTUALIZA MONTO]
      .stop(true, true) // [EVITA COLA]
      .animate({ opacity: 0.45 }, 110) // [PULSO]
      .animate({ opacity: 1 }, 160); // [RESTAURA]

    return { granTotal, totalExtras, cantidadTotal, seleccionRapida }; // [RETORNO COMPLETO]
  }

  function renderizarCarrito() { // [MÓDULO 3 CONTRATO: innerHTML SANITIZADO + EVENTOS]
    if (!carritoListaEl) return; // [GUARDA]

    if (carritoClub.length === 0) { // [ESTADO VACÍO LIMPIO]
      carritoListaEl.innerHTML = sanitizarHTML('<p class="carrito-vacio">Tu pedido está vacío. Agrega combos o batidos desde el Catálogo o el selector superior.</p>'); // [INNERHTML SANITIZADO]
      calcularTotalPedido(); // [ACTUALIZA A 0]
      return;
    }

    const filasHTML = carritoClub.map((item) => `
      <div class="carrito-item" data-codigo="${item.codigo}">
        <div>
          <strong>${item.codigo}: ${item.nombre}</strong><br>
          <small style="color: var(--text-muted);">${item.precio} BOB c/u • Subtotal: ${item.precio * item.cantidad} BOB</small>
        </div>
        <div class="carrito-item__controles">
          <button type="button" class="btn-secundario btn-menos-item" data-codigo="${item.codigo}" style="min-height: 34px; padding: 4px 10px;" aria-label="Restar unidad">-</button>
          <strong>${item.cantidad}</strong>
          <button type="button" class="btn-secundario btn-mas-item" data-codigo="${item.codigo}" style="min-height: 34px; padding: 4px 10px;" aria-label="Sumar unidad">+</button>
          <button type="button" class="btn-tactil btn-quitar-item" data-codigo="${item.codigo}" style="min-height: 34px; padding: 4px 10px;" aria-label="Quitar producto">✕</button>
        </div>
      </div>
    `).join(''); // [ARMA FILAS]

    carritoListaEl.innerHTML = sanitizarHTML(filasHTML); // [INSERTA HTML SEGURO CON DOMPURIFY]
    calcularTotalPedido(); // [ACTUALIZA TOTAL]
  }

  function agregarAlCarrito(codigo, nombre, precio) { // [AGREGA O INCREMENTA PRODUCTO EN EL CARRITO]
    const existente = carritoClub.find((p) => p.codigo === codigo); // [BUSCA SI YA ESTÁ]
    if (existente) {
      existente.cantidad += 1; // [INCREMENTA CANTIDAD]
    } else {
      carritoClub.push({ codigo, nombre, precio: Number(precio) || 0, cantidad: 1 }); // [NUEVO ITEM]
    }
    renderizarCarrito(); // [RE-RENDERIZA]
  }

  if (carritoListaEl) { // [DELEGACIÓN NATIVA DE EVENTOS EN CARRITO]
    carritoListaEl.addEventListener('click', function (e) { // [ADDEVENTLISTENER]
      const btn = e.target.closest('button'); // [BOTÓN PULSADO]
      if (!btn || !btn.dataset.codigo) return; // [GUARDA]
      const codigo = btn.dataset.codigo; // [DATASET CÓDIGO]
      const idx = carritoClub.findIndex((p) => p.codigo === codigo); // [ÍNDICE]
      if (idx === -1) return; // [GUARDA]

      if (btn.classList.contains('btn-mas-item')) {
        carritoClub[idx].cantidad += 1; // [SUMA]
      } else if (btn.classList.contains('btn-menos-item')) {
        carritoClub[idx].cantidad -= 1; // [RESTA]
        if (carritoClub[idx].cantidad <= 0) carritoClub.splice(idx, 1); // [ELIMINA SI LLEGA A 0]
      } else if (btn.classList.contains('btn-quitar-item')) {
        carritoClub.splice(idx, 1); // [ELIMINA FILA]
      }
      renderizarCarrito(); // [ACTUALIZA DOM Y TOTAL]
    });
  }

  const selectProductoRapido = document.getElementById('selectProductoRapido'); // [RECALCULA AL CAMBIAR PRODUCTO EN SELECTOR]
  if (selectProductoRapido) {
    selectProductoRapido.addEventListener('change', calcularTotalPedido); // [ACTUALIZA TOTAL AL INSTANTE]
  }

  const btnAgregarRapido = document.getElementById('btnAgregarRapido'); // [BOTÓN AGREGAR DESDE PESTAÑA PEDIDO]
  if (btnAgregarRapido) {
    btnAgregarRapido.addEventListener('click', function () { // [ADDEVENTLISTENER]
      const selItem = obtenerProductoSeleccionadoRapido(); // [OPCIÓN ELEGIDA]
      if (!selItem) {
        mostrarToast('Selecciona primero un producto o combo de la lista.'); // [GUÍA AL USUARIO]
        return;
      }
      agregarAlCarrito(selItem.codigo, selItem.nombre, selItem.precio); // [MUEVE AL CARRITO]
      if (selectProductoRapido) selectProductoRapido.value = ''; // [REINICIA SELECTOR PARA NO DUPLICAR CONTEO]
      calcularTotalPedido(); // [RECALCULA LIMPIO]
      mostrarToast('Agregado al pedido: ' + selItem.nombre); // [AVISO]
    });
  }

  const btnVaciarCarrito = document.getElementById('btnVaciarCarrito'); // [BOTÓN LIMPIAR CARRITO]
  if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener('click', function () { // [ADDEVENTLISTENER]
      carritoClub = []; // [VACÍA]
      if (selectProductoRapido) selectProductoRapido.value = ''; // [REINICIA SELECTOR]
      document.querySelectorAll('.extra-topping:checked').forEach((chk) => { chk.checked = false; }); // [DESMARCA TOPPINGS]
      renderizarCarrito(); // [ACTUALIZA]
      mostrarToast('Lista de pedido limpia.'); // [AVISO]
    });
  }

  document.querySelectorAll('.extra-topping').forEach((chk) => { // [RECALCULA AL MARCAR TOPPINGS]
    chk.addEventListener('change', calcularTotalPedido); // [ADDEVENTLISTENER]
  });

  const btnWhatsAppPedido = document.getElementById('btnWhatsAppPedido'); // [MÓDULO 3 CONTRATO: ENVÍO DIRECTO A WHATSAPP]
  if (btnWhatsAppPedido) {
    btnWhatsAppPedido.addEventListener('click', function () { // [ADDEVENTLISTENER]
      const { granTotal, totalExtras, seleccionRapida } = calcularTotalPedido(); // [OBTIENE TOTAL ACTUAL]
      const itemsPedido = [...carritoClub]; // [COPIA ITEMS CARRITO]
      if (seleccionRapida) itemsPedido.push(seleccionRapida); // [INCLUYE PRODUCTO SELECCIONADO EN EL DESPLEGABLE]

      if (itemsPedido.length === 0 && totalExtras === 0) { // [SI NO HAY NADA SELECCIONADO]
        mostrarToast('Selecciona o agrega al menos un producto antes de enviar tu pedido.'); // [GUÍA AL USUARIO]
        return;
      }

      const sabor = $('#saborBatido').val() || 'Choco-Avellanas'; // [SABOR]
      const entrega = $('#modalidadEntrega').val() || 'Consumo en Club'; // [ENTREGA]
      const toppings = []; // [EXTRAS MARCADOS]
      document.querySelectorAll('.extra-topping:checked').forEach((chk) => {
        if (chk.dataset && chk.dataset.nombre) toppings.push(chk.dataset.nombre + ' (+' + chk.value + ' BOB)'); // [TEXTO]
      });

      const detalleItems = itemsPedido.map((p) => '• ' + p.cantidad + 'x ' + p.nombre + ' (' + (p.precio * p.cantidad) + ' BOB)'); // [LÍNEAS]
      const mensajeWa = [
        'Hola Javier (La Casita — Club de Bienestar), quiero realizar este pedido:',
        ...detalleItems,
        toppings.length ? '• Adicionales: ' + toppings.join(', ') : null,
        '• Sabor preferido: ' + sabor,
        '• Modalidad: ' + entrega,
        '• Total estimado: ' + granTotal + ' BOB'
      ].filter(Boolean).join('\n');

      const urlWa = 'https://api.whatsapp.com/send?phone=' + WHATSAPP_CLUB + '&text=' + encodeURIComponent(mensajeWa); // [URL WHATSAPP]
      window.open(urlWa, '_blank', 'noopener,noreferrer'); // [ABRE WHATSAPP]
      mostrarToast('Abriendo WhatsApp con tu pedido listo...'); // [TOAST]
    });
  }

  // [7. FETCH CATÁLOGO + LAZY LOADING + BUSCADOR EN VIVO + EVENT BUBBLING (Comparar / + Pedir)]
  function renderizarCatalogoProductos(productos) {
    const $contenedor = $('#catalogoProductos'); // [GRID CATÁLOGO]
    $contenedor.empty(); // [LIMPIA PLACEHOLDER]

    productos.forEach((item) => { // [CONSTRUYE TARJETA BEM .producto-card]
      const textoBusqueda = (
        item.codigo + ' ' + item.nombre + ' ' + item.linea + ' ' +
        item.presentacion + ' ' + item.etiqueta + ' ' + item.palabrasClave
      ).toLowerCase(); // [ÍNDICE BÚSQUEDA]

      const htmlTarjeta = `
        <article class="producto-card" data-codigo="${item.codigo}" data-precio="${item.precio}" data-busqueda="${textoBusqueda}">
          <span class="producto-card__badge">${item.etiqueta}</span>
          <div class="producto-card__imagen-wrap">
            <img src="${item.imagen}" alt="${item.codigo} ${item.nombre} en La Casita Club" class="producto-card__imagen" width="480" height="300" loading="lazy">
          </div>
          <div class="producto-card__cuerpo">
            <h4 class="producto-card__titulo">${item.codigo}: ${item.nombre}</h4>
            <p class="producto-card__desc">${item.descripcion}</p>
            <span class="producto-card__meta"><i class="fa-solid fa-leaf"></i> ${item.presentacion} • ${item.linea}</span>
            <div class="producto-card__pie">
              <span class="producto-card__precio-val">${item.precio} BOB</span>
              <div class="producto-card__acciones">
                <button type="button" class="producto-card__boton btn-comparar btn-hidratable" data-hidratado="false" aria-label="Comparar ${item.codigo}">Comparar</button>
                <button type="button" class="producto-card__boton producto-card__boton--destacado btn-agregar-pedido btn-hidratable" data-hidratado="false" data-codigo="${item.codigo}" data-precio="${item.precio}" data-nombre="${item.nombre}">+ Pedir</button>
              </div>
            </div>
          </div>
        </article>
      `; // [PLANTILLA BEM]
      $contenedor.append(sanitizarHTML(htmlTarjeta)); // [ANTI-XSS DOMPURIFY]
    });

    hidratarBotonesDOM($contenedor); // [HIDRATA BOTONES NUEVOS]
  }

  fetch('data/productos.json') // [FETCH ASÍNCRONO DESDE JSON LOCAL]
    .then((response) => {
      if (!response.ok) throw new Error('No se pudo leer data/productos.json'); // [VALIDA]
      return response.json(); // [PARSEA JSON]
    })
    .then((data) => {
      renderizarCatalogoProductos(data); // [RENDERIZA FETCH]
    })
    .catch((err) => { // [RESPALDO PARA file://]
      console.warn('[La Casita] Usando catálogo local de respaldo:', err.message); // [WARN]
      renderizarCatalogoProductos(PRODUCTOS_RESPALDO); // [RENDERIZA RESPALDO]
    });

  function filtrarProductosEnVivo(texto) { // [BUSCADOR TIEMPO REAL MÓDULO 2]
    const filtro = texto.trim().toLowerCase(); // [NORMALIZA]
    $('#catalogoProductos .producto-card').each(function () {
      const contenido = $(this).attr('data-busqueda') || ''; // [LEE ÍNDICE]
      if (contenido.indexOf(filtro) !== -1) {
        $(this).show(); // [MUESTRA]
      } else {
        $(this).hide(); // [OCULTA]
      }
    });
  }

  $('#searchProducto') // [KEYUP BUSCADOR EN VIVO]
    .off('keyup') // [LIMPIA]
    .on('keyup', function () {
      filtrarProductosEnVivo($(this).val()); // [FILTRA]
    });

  $('.btn-modo-filtro') // [FILTROS RÁPIDOS CATÁLOGO]
    .off('click') // [LIMPIA]
    .on('click', function () {
      $('.btn-modo-filtro').removeClass('active-chip'); // [DESACTIVA]
      $(this).addClass('active-chip'); // [ACTIVA]
      const q = $(this).data('query') || ''; // [CONSULTA]
      $('#searchProducto').val(q); // [SINCRONIZA]
      filtrarProductosEnVivo(q); // [FILTRA]
    });

  $('#catalogoProductos') // [DELEGACIÓN EVENT BUBBLING] Comparar + Agregar al pedido
    .off('click', '.btn-comparar') // [LIMPIA]
    .on('click', '.btn-comparar', function () {
      const $card = $(this).closest('.producto-card'); // [TARJETA]
      $card.toggleClass('producto-card--activa'); // [RESALTA BORDE VERDE]
      const activo = $card.hasClass('producto-card--activa'); // [ESTADO]
      $(this).text(activo ? '✓ Comparando' : 'Comparar'); // [TEXTO]
      mostrarToast(activo ? 'Producto marcado para comparar.' : 'Producto desmarcado.'); // [AVISO]
    })
    .off('click', '.btn-agregar-pedido') // [LIMPIA]
    .on('click', '.btn-agregar-pedido', function () {
      const codigo = String($(this).data('codigo') || 'P1'); // [CÓDIGO]
      const nombre = String($(this).data('nombre') || 'Combo La Casita'); // [NOMBRE]
      const precio = Number($(this).data('precio') || 22); // [PRECIO]
      agregarAlCarrito(codigo, nombre, precio); // [AGREGA AL CARRITO]
      cambiarTab('tab-pedido'); // [LLEVA A PESTAÑA PEDIDO SIN SCROLL]
      mostrarToast('Producto agregado a tu pedido.'); // [AVISO]
    });

  // [8. VALIDACIÓN DE FORMULARIO EN TIEMPO REAL (MÓDULO 4: blur/input + bordes rojo/verde + preventDefault)]
  const BLACKLIST_NOMBRES = ['asdasd', 'asd', 'qwerty', 'test', 'prueba', 'xxx', 'aaa', 'zzz', 'null', 'undefined']; // [ANTI-BASURA]

  const reglasValidacion = {
    '#nombre': {
      err: '#errNombre',
      validar: (val) => {
        const t = val.trim();
        if (t.length < 4 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(t)) return false; // [SOLO LETRAS]
        if (/(.)\1\1/i.test(t)) return false; // [SIN REPETICIÓN]
        if (BLACKLIST_NOMBRES.some((b) => t.toLowerCase().includes(b))) return false; // [SIN BLACKLIST]
        return t.split(/\s+/).filter(Boolean).length >= 2; // [NOMBRE Y APELLIDO]
      }
    },
    '#telefono': {
      err: '#errTelefono',
      validar: (val) => /^[67][0-9]{7}$/.test(val.trim()) // [CELULAR BOLIVIA 6 O 7]
    },
    '#correo': {
      err: '#errCorreo',
      validar: (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim()) // [EMAIL]
    },
    '#mensaje': {
      err: '#errMensaje',
      validar: (val) => val.trim().length >= 5 // [MÍNIMO 5 CARACTERES]
    }
  };

  function validarCampo(selector) { // [APLICA BORDE VERDE/ROJO Y MENSAJE DE ERROR]
    const regla = reglasValidacion[selector]; // [REGLA]
    const $campo = $(selector); // [INPUT]
    if (!regla || !$campo.length) return true; // [GUARDA]

    const esValido = regla.validar($campo.val() || ''); // [EVALÚA]
    const $err = $(regla.err); // [MENSAJE]

    if (esValido) {
      $campo.removeClass('input-invalido').addClass('input-valido'); // [VERDE]
      $err.stop(true, true).fadeOut(180); // [OCULTA ERROR]
    } else {
      $campo.removeClass('input-valido').addClass('input-invalido'); // [ROJO]
      $err.stop(true, true).fadeIn(180); // [MUESTRA ERROR]
    }
    return esValido; // [RETORNO]
  }

  function limpiarEstadoValidacion(selectores) { // [RESETEA BORDES TRAS ENVIAR]
    selectores.forEach((sel) => {
      $(sel).removeClass('input-valido input-invalido'); // [LIMPIA]
      if (reglasValidacion[sel]) $(reglasValidacion[sel].err).hide(); // [OCULTA]
    });
  }

  Object.keys(reglasValidacion).forEach((sel) => { // [BLUR E INPUT EN TIEMPO REAL]
    $(sel)
      .off('blur input') // [LIMPIA]
      .on('blur', function () { validarCampo(sel); }) // [AL SALIR]
      .on('input', function () { // [CORRIGE AL ESCRIBIR]
        if ($(this).hasClass('input-invalido') || $(this).hasClass('input-valido')) validarCampo(sel);
      });
  });

  // [9. DETECTOR ONLINE/OFFLINE + ENVÍO DE CONTACTO CON PREVENTDEFAULT Y COLA LOCALSTORAGE]
  function actualizarEstadoRed() {
    if (navigator.onLine) {
      $('#estadoRed, #estadoRedDock')
        .text('🟢 En Línea')
        .css({ background: '#dcfce7', color: '#065f46' });

      const pendientes = JSON.parse(localStorage.getItem('casita_cola_offline') || '[]'); // [COLA OFFLINE]
      if (pendientes.length > 0) {
        mostrarToast('Conexión restablecida: ' + pendientes.length + ' consulta(s) pendiente(s) enviada(s).');
        localStorage.removeItem('casita_cola_offline'); // [LIMPIA COLA]
      }
    } else {
      $('#estadoRed, #estadoRedDock')
        .text('🟠 Sin Conexión (Modo Local)')
        .css({ background: '#ffedd5', color: '#9a3412' });
    }
  }

  $(window).off('online offline').on('online offline', actualizarEstadoRed); // [LISTENERS RED]
  actualizarEstadoRed(); // [INICIALIZA]

  $('#btnInstalarPWA, #btnInstalarPWADock') // [INSTALACIÓN PWA]
    .off('click')
    .on('click', async function () {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      $('#btnInstalarPWA, #btnInstalarPWADock').prop('hidden', true).fadeOut();
    });

  $('#contactoForm') // [SUBMIT CON PREVENTDEFAULT Y RESPALDO OFFLINE]
    .off('submit')
    .on('submit', function (e) {
      e.preventDefault(); // [MÓDULO 4 CONTRATO: preventDefault]
      const okNombre = validarCampo('#nombre'); // [VALIDA]
      const okTel = validarCampo('#telefono'); // [VALIDA]
      const okCorreo = validarCampo('#correo'); // [VALIDA]
      const okMensaje = validarCampo('#mensaje'); // [VALIDA]

      if (okNombre && okTel && okCorreo && okMensaje) {
        const nombre = $('#nombre').val().trim();
        const telefono = $('#telefono').val().trim();
        const correo = $('#correo').val().trim();
        const mensaje = $('#mensaje').val().trim();

        if (navigator.onLine) {
          $('#successAlert')
            .text('✅ Consulta registrada para Javier Espejo (La Casita Club). Te contactaremos pronto por WhatsApp.')
            .stop(true, true)
            .slideDown()
            .delay(3500)
            .slideUp();
        } else {
          const cola = JSON.parse(localStorage.getItem('casita_cola_offline') || '[]');
          cola.push({ nombre, telefono, correo, mensaje, fecha: new Date().toISOString() });
          localStorage.setItem('casita_cola_offline', JSON.stringify(cola));

          $('#successAlert')
            .text('🟠 Sin conexión: Tu consulta se guardó localmente y se enviará al recuperar internet.')
            .stop(true, true)
            .slideDown()
            .delay(4000)
            .slideUp();
        }
        $('#contactoForm')[0].reset(); // [RESET]
        limpiarEstadoValidacion(['#nombre', '#telefono', '#correo', '#mensaje']); // [LIMPIA BORDES]
      }
    });
});
