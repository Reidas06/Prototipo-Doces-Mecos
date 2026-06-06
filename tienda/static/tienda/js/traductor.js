document.addEventListener('DOMContentLoaded', () => {
    console.log("Traductor Doces&Mecos iniciado");

    const langES = document.getElementById('lang-es');
    const langGL = document.getElementById('lang-gl');

    let currentLang = localStorage.getItem('appLang') || 'es';
    let translationsCache = null;

    // Traducciones estáticas para elementos comunes y secciones
    const staticTranslations = {
        'gl': {
            'slogan': 'Doce alegría en cada bocado!',
            'acerca_h4': 'Acerca de nós',
            'donde_h4': 'Onde nos podes atopar',
            'desc_1': 'A nosa pasión é endulzar a vida de pequenos como grandes, ofrezemos unha amplía variedade de doces e larpeiradas que despertan recordos da infancia. Temos desde caramelos clásicos hasta as últimas novedades. A nosa misión e que o cliente marche cun sorriso na cara como o que nós temos cando entran.',
            'desc_2': 'Podes atoparnos no centro de Malpica de Bergantiños, nun espazo cheo de cor, doces e alegría. Enderezo: Rúa Eduardo Vila Fano 2, Malpica de Bergantiños. Horario: 10:30-1:30 || 5:00-8:30. Achégate a coñecernos e déixate levar polo sabor das nosas lambetadas en Doces & Mecos.',
            'h2_ofertas': 'Ofertas',
            'h2_vendido': 'O máis vendido',
            'h2_limitado': 'Por tempo limitado',
            'h2_todos': 'Todos os produtos',
            
            // Navegación y Footer
            'nav_inicio': 'Inicio',
            'nav_productos': 'Produtos',
            'nav_contacta': 'Contacta',
            'footer_policy': 'Política e privacidade da empresa',

            // Descripcion
            'lbl_cantidad': 'Cantidade',
            'btn_add_cart': '<i class="fa-solid fa-cart-shopping" style="margin-right: 8px;"></i> Engadir ao carriño',

            // Carrito
            'carrito_title': 'Carriño',
            'btn_pago': 'Realizar pago',
            
            // Buscador y Varios
            'buscar_placeholder': 'Buscar produtos...',
            'btn_ver_todos': 'Ver todos os produtos',
            'btn_volver_cats': 'Volver a categorías',
            
            // Login / Registro / Contacta basic
            'login_title': 'Iniciar Sesión',
            'register_title': 'Rexistrarse',
            'contacta_title': 'Contacta connosco',
            
            // Formularios (Login, Register, Password, Contacta)
            'lbl_username': 'Nome de Usuario',
            'lbl_password': 'Contrasinal',
            'btn_entrar': 'Entrar',
            'lnk_olvidado': 'Esqueciches ou queres cambiar o teu contrasinal?',
            'lbl_nombre_apellidos': 'Nome e Apelidos',
            'lbl_nacionalidad': 'Nacionalidade',
            'lbl_dni': 'DNI',
            'lbl_email': 'Correo electrónico',
            'lbl_telefono': 'Teléfono',
            'lbl_direccion': 'Enderezo',
            'lbl_cp': 'Código Postal',
            'lbl_repeat_pass': 'Repetir Contrasinal',
            'btn_registro': 'Rexistrarse',
            'h2_cambio_pass': 'Cambio de Contrasinal',
            'lbl_dni_reg': 'DNI rexistrado',
            'lbl_new_pass': 'Novo Contrasinal',
            'btn_actualizar_pass': 'Actualizar Contrasinal',
            'lnk_volver_login': 'Volver a Inicio de Sesión',
            'msg_sesion': 'Iniciaches sesión correctamente.',
            'btn_cerrar_sesion': 'Pechar Sesión',
            'h2_sugerencias': 'Suxerencias e Contacto',
            'lbl_asunto': 'Asunto da petición',
            'ph_asunto': 'Ex: Suxerencia de novos doces',
            'lbl_detalle': 'Describe máis detalladamente a túa consulta',
            'ph_detalle': 'Explícanos como podemos axudarche ou que melloras suxires...',
            'btn_enviar_msg': 'Enviar Mensaxe',
            'msg_bloqueo': 'Debes iniciar sesión para poder enviarnos suxerencias ou contactar co soporte de Doces&Mecos.',
            'btn_ir_inicio': 'Ir a Iniciar Sesión',
            
            // Carrito extra
            'carriño_valeiro': 'O teu carriño está valeiro.',
            'pago_title': 'Realizar Pago',
            'tu_pedido': 'O teu pedido',
            'datos_tarxeta': '<i class="fa-regular fa-credit-card"></i> Datos da tarxeta',
            'lbl_titular': 'Titular da tarxeta',
            'ph_titular': 'Nome no cartón',
            'lbl_tarjeta': 'Número da tarxeta',
            'lbl_caducidad': 'Caducidade',
            'btn_pagar_agora': 'Pagar Agora'
        },
        'es': {
            'slogan': 'Dulce alegría en cada bocado!',
            'acerca_h4': 'Acerca de nosotros',
            'donde_h4': 'Dónde nos puedes encontrar',
            'desc_1': 'Nuestra pasión es endulzar la vida de pequeños y grandes, ofrecemos una amplia variedad de dulces y golosinas que despiertan recuerdos de la infancia. Tenemos desde caramelos clásicos hasta las últimas novedades. Nuestra misión es que el cliente se vaya con una sonrisa en la cara como la que nosotros tenemos cuando entran.',
            'desc_2': 'Puedes encontrarnos en el centro de Malpica de Bergantiños, en un espacio lleno de color, dulces y alegría. Dirección: Rúa Eduardo Vila Fano 2, Malpica de Bergantiños. Horario: 10:30-1:30 || 5:00-8:30. Acércate a conocernos y déjate llevar por el sabor de nuestras golosinas en Doces & Mecos.',
            'h2_ofertas': 'Ofertas',
            'h2_vendido': 'Lo más vendido',
            'h2_limitado': 'Por tiempo limitado',
            'h2_todos': 'Todos los productos',

            // Navegación y Footer
            'nav_inicio': 'Inicio',
            'nav_productos': 'Productos',
            'nav_contacta': 'Contacta',
            'footer_policy': 'Política y privacidad de la empresa',

            // Descripcion
            'lbl_cantidad': 'Cantidad',
            'btn_add_cart': '<i class="fa-solid fa-cart-shopping" style="margin-right: 8px;"></i> Añadir al carrito',

            // Carrito 
            'carrito_title': 'Carrito',
            'btn_pago': 'Realizar pago',
            
            // Buscador y Varios
            'buscar_placeholder': 'Buscar productos...',
            'btn_ver_todos': 'Ver todos los productos',
            'btn_volver_cats': 'Volver a categorías',
            
            // Login / Registro / Contacta basic
            'login_title': 'Iniciar Sesión',
            'register_title': 'Registrarse',
            'contacta_title': 'Contacta con nosotros',
            
            // Formularios (Login, Register, Password, Contacta)
            'lbl_username': 'Nombre de Usuario',
            'lbl_password': 'Contraseña',
            'btn_entrar': 'Entrar',
            'lnk_olvidado': '¿Has olvidado o quieres cambiar tu contraseña?',
            'lbl_nombre_apellidos': 'Nombre y Apellidos',
            'lbl_nacionalidad': 'Nacionalidad',
            'lbl_dni': 'DNI',
            'lbl_email': 'Correo electrónico',
            'lbl_telefono': 'Teléfono',
            'lbl_direccion': 'Dirección',
            'lbl_cp': 'Código Postal',
            'lbl_repeat_pass': 'Repetir Contraseña',
            'btn_registro': 'Registrarse',
            'h2_cambio_pass': 'Cambio de Contraseña',
            'lbl_dni_reg': 'DNI registrado',
            'lbl_new_pass': 'Nueva Contraseña',
            'btn_actualizar_pass': 'Actualizar Contraseña',
            'lnk_volver_login': 'Volver a Inicio de Sesión',
            'msg_sesion': 'Has iniciado sesión correctamente.',
            'btn_cerrar_sesion': 'Cerrar Sesión',
            'h2_sugerencias': 'Sugerencias y Contacto',
            'lbl_asunto': 'Asunto de la petición',
            'ph_asunto': 'Ej: Sugerencia de nuevos dulces',
            'lbl_detalle': 'Describe más detalladamente tu consulta',
            'ph_detalle': 'Explícanos cómo podemos ayudarte o qué mejoras sugieres...',
            'btn_enviar_msg': 'Enviar Mensaje',
            'msg_bloqueo': 'Debes iniciar sesión para poder enviarnos sugerencias o contactar con el soporte de Doces&Mecos.',
            'btn_ir_inicio': 'Ir a Iniciar Sesión',
            
            // Carrito extra
            'carriño_valeiro': 'Tu carrito está vacío.',
            'pago_title': 'Realizar Pago',
            'tu_pedido': 'Tu pedido',
            'datos_tarxeta': '<i class="fa-regular fa-credit-card"></i> Datos de la tarjeta',
            'lbl_titular': 'Titular de la tarjeta',
            'ph_titular': 'Nombre en la tarjeta',
            'lbl_tarjeta': 'Número de la tarjeta',
            'lbl_caducidad': 'Caducidad',
            'btn_pagar_agora': 'Pagar Ahora'
        }
    };

    const fetchTranslations = async () => {
        console.log("Solicitando traducciones al servidor...");
        try {
            const res = await fetch('/api/traducciones/');
            if (!res.ok) throw new Error("Error en la respuesta del servidor");
            const data = await res.json();
            translationsCache = data.traducciones;
            console.log("Traducciones cargadas en cache:", Object.keys(translationsCache).length, "productos encontrados.");
            console.dir(translationsCache); // Mostrar el objeto detallado
            return true;
        } catch (error) {
            console.error("Error cargando traducciones:", error);
            return false;
        }
    };

    const updateUI = () => {
        if (!langES || !langGL) return;
        langES.style.opacity = (currentLang === 'es') ? '1' : '0.5';
        langGL.style.opacity = (currentLang === 'gl') ? '1' : '0.5';
    };

    const applyTranslations = () => {
        console.log(`Aplicando idioma: ${currentLang}`);

        // 1. Traducir productos en catálogo
        const products = document.querySelectorAll('.producto-item');
        console.log(`Buscando traducciones para ${products.length} elementos en el DOM.`);

        products.forEach(el => {
            const id = el.getAttribute('data-id');
            const nameEl = el.querySelector('.producto-nombre');
            if (id && nameEl) {
                if (translationsCache && translationsCache[id]) {
                    const traducido = (currentLang === 'gl') ? translationsCache[id].titulo_gl : translationsCache[id].titulo_es;
                    nameEl.textContent = traducido;
                } else {
                    console.warn(`ID ${id} no encontrado en el cache de traducciones.`);
                }
            }
        });

        // 2. Traducir página de detalle
        const pTitulo = document.getElementById('p-titulo');
        const pDesc = document.getElementById('p-desc');
        if (pTitulo || pDesc) {
            const id = new URLSearchParams(window.location.search).get('id');
            if (id && translationsCache && translationsCache[id]) {
                if (pTitulo) pTitulo.textContent = (currentLang === 'gl') ? translationsCache[id].titulo_gl : translationsCache[id].titulo_es;
                if (pDesc) {
                    const descText = (currentLang === 'gl') ? translationsCache[id].descripcion_gl : translationsCache[id].descripcion_es;
                    pDesc.innerHTML = descText ? descText.split('\n').map(line => `<p>${line}</p>`).join('') : '';
                }
            }
        }

        // 3. Traducir textos estáticos y cabeceras
        const slogan = document.querySelector('.cabecera-center p');
        if (slogan) slogan.textContent = staticTranslations[currentLang].slogan;

        const sections = document.querySelectorAll('.seccion-productos');
        sections.forEach(sec => {
            const h2 = sec.querySelector('h2');
            if (!h2) return;
            const gridId = sec.querySelector('.grid-productos')?.id;

            if (gridId === 'grid-ofertas') h2.textContent = staticTranslations[currentLang].h2_ofertas;
            else if (gridId === 'grid-vendido') h2.textContent = staticTranslations[currentLang].h2_vendido;
            else if (gridId === 'grid-limitado') h2.textContent = staticTranslations[currentLang].h2_limitado;
            else if (sec.closest('#categorias-productos')) {
                if (h2.textContent.toLowerCase().includes('todos')) h2.textContent = staticTranslations[currentLang].h2_todos;
            }
        });

        const desc1 = document.getElementById('desc-1');
        if (desc1) {
            desc1.textContent = staticTranslations[currentLang].desc_1;
            const h4 = desc1.closest('.cuerpo-up')?.querySelector('h4');
            if (h4) h4.textContent = staticTranslations[currentLang].acerca_h4;
        }

        const desc2 = document.getElementById('desc-2');
        if (desc2) {
            desc2.textContent = staticTranslations[currentLang].desc_2;
            const h4 = desc2.closest('.cuerpo-up')?.querySelector('h4');
            if (h4) h4.textContent = staticTranslations[currentLang].donde_h4;
        }

        // Navegación
        const navLinks = document.querySelectorAll('.desplegable li a');
        if (navLinks.length >= 3) {
            if(navLinks[0]) navLinks[0].textContent = staticTranslations[currentLang].nav_inicio;
            if(navLinks[1]) navLinks[1].textContent = staticTranslations[currentLang].nav_productos;
            if(navLinks[2]) navLinks[2].textContent = staticTranslations[currentLang].nav_contacta;
        }

        // Pie de página (Footer)
        const footerPolicy = document.querySelector('.pie-left p');
        if (footerPolicy) {
            footerPolicy.textContent = staticTranslations[currentLang].footer_policy;
        }

        // Buscador
        const buscador = document.getElementById('buscador-input');
        if (buscador) {
            buscador.placeholder = staticTranslations[currentLang].buscar_placeholder;
        }

        // Boton Todos Productos / volver categorias
        const btnVerTodos = document.querySelector('.btn-ver-todos');
        if (btnVerTodos) {
            if (btnVerTodos.getAttribute('href').includes('todos-productos')) {
                btnVerTodos.textContent = staticTranslations[currentLang].btn_ver_todos;
            } else {
                btnVerTodos.textContent = staticTranslations[currentLang].btn_volver_cats;
            }
        }

        // Descripcion.html - Botón y Cantidad
        const lblCantidad = document.querySelector('.lbl-cantidad');
        if (lblCantidad) lblCantidad.textContent = staticTranslations[currentLang].lbl_cantidad;
        
        const btnAddCart = document.getElementById('add-to-cart-btn');
        if (btnAddCart) btnAddCart.innerHTML = staticTranslations[currentLang].btn_add_cart;

        // Carrito.html - Título y Botón pago
        const formPrincipalDesc = document.querySelector('.form-principal h2');
        if (formPrincipalDesc && (formPrincipalDesc.textContent === 'Carrito' || formPrincipalDesc.textContent === 'Carriño')) {
            formPrincipalDesc.textContent = staticTranslations[currentLang].carrito_title;
        }

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) checkoutBtn.textContent = staticTranslations[currentLang].btn_pago;

        // Carrito.html - extra texts
        const cartItemsDiv = document.getElementById('cart-items');
        if (cartItemsDiv && cartItemsDiv.innerHTML.includes('O teu carriño está valeiro.') || (cartItemsDiv && cartItemsDiv.innerHTML.includes('Tu carrito está vacío.'))) {
            cartItemsDiv.innerHTML = `<p style="text-align:center; padding: 20px;">${staticTranslations[currentLang].carriño_valeiro}</p>`;
        }

        // Pago.html - extra texts
        const headerPago = document.querySelector('.pago-header h2');
        if (headerPago) headerPago.textContent = staticTranslations[currentLang].pago_title;
        
        const h3TuPedido = document.querySelector('.pago-resumen h3');
        if (h3TuPedido) h3TuPedido.textContent = staticTranslations[currentLang].tu_pedido;

        const h3DatosT = document.querySelector('.formulario-pago .form-section h3');
        if (h3DatosT) h3DatosT.innerHTML = staticTranslations[currentLang].datos_tarxeta;
        
        const btnPagarAhora = document.querySelector('.boton-pagar');
        if (btnPagarAhora) btnPagarAhora.textContent = staticTranslations[currentLang].btn_pagar_agora;

        // Login / Register / Contacta (títulos de H2 base)
        const formH2s = document.querySelectorAll('.form-principal h2');
        formH2s.forEach(h2 => {
            if (h2.textContent.includes('Iniciar') || h2.textContent.includes('Iniciar Sesión')) h2.textContent = staticTranslations[currentLang].login_title;
            if (h2.textContent.includes('Registrarse') || h2.textContent.includes('Rexistrarse')) h2.textContent = staticTranslations[currentLang].register_title;
            if (h2.textContent.includes('Contacta con nosotros') || h2.textContent.includes('Contacta connosco')) h2.textContent = staticTranslations[currentLang].contacta_title;
            if (h2.textContent.includes('Sugerencias y Contacto') || h2.textContent.includes('Suxerencias e Contacto')) h2.textContent = staticTranslations[currentLang].h2_sugerencias;
            if (h2.textContent.includes('Cambio de Contrase') || h2.textContent.includes('Cambio de Contrasin')) h2.textContent = staticTranslations[currentLang].h2_cambio_pass;
        });

        // Mapeo genérico de labels y placeholders usando selectores seguros
        const translateMap = [
            { q: 'label[for="login_username"], label[for="rec_usuario"], label[for="nombre_usuario"]', k: 'lbl_username' },
            { q: 'label[for="login_password"], label[for="password"]', k: 'lbl_password' },
            { q: 'label[for="nombre"]', k: 'lbl_nombre_apellidos' },
            { q: 'label[for="nacionalidad"]', k: 'lbl_nacionalidad' },
            { q: 'label[for="dni"]', k: 'lbl_dni' },
            { q: 'label[for="rec_dni"]', k: 'lbl_dni_reg' },
            { q: 'label[for="email"]', k: 'lbl_email' },
            { q: 'label[for="telefono"]', k: 'lbl_telefono' },
            { q: 'label[for="direccion"]', k: 'lbl_direccion' },
            { q: 'label[for="codigo_postal"]', k: 'lbl_cp' },
            { q: 'label[for="repeat_password"], label[for="rec_pass2"]', k: 'lbl_repeat_pass' },
            { q: 'label[for="rec_pass"]', k: 'lbl_new_pass' },
            { q: 'label[for="asunto"]', k: 'lbl_asunto' },
            { q: 'label[for="detalle"]', k: 'lbl_detalle' },
            { q: 'label[for="titular"]', k: 'lbl_titular' },
            { q: 'label[for="tarjeta"]', k: 'lbl_tarjeta' },
            { q: 'label[for="caducidad"]', k: 'lbl_caducidad' }
        ];

        translateMap.forEach(item => {
            const els = document.querySelectorAll(item.q);
            els.forEach(el => {
                if(staticTranslations[currentLang][item.k]) el.textContent = staticTranslations[currentLang][item.k];
            });
        });

        // Placeholders
        const phMap = [
            { q: '#asunto', k: 'ph_asunto' },
            { q: '#detalle', k: 'ph_detalle' },
            { q: '#titular', k: 'ph_titular' }
        ];
        phMap.forEach(item => {
            const el = document.querySelector(item.q);
            if (el && staticTranslations[currentLang][item.k]) el.placeholder = staticTranslations[currentLang][item.k];
        });

        // Textos directos sueltos y botones de forms
        const formSubmitBtns = document.querySelectorAll('.form-principal form button[type="submit"]');
        formSubmitBtns.forEach(btn => {
            if (btn.classList.contains('btn-cerrar-sesion')) btn.textContent = staticTranslations[currentLang].btn_cerrar_sesion;
            else if (btn.id === 'btn-recuperar') btn.textContent = staticTranslations[currentLang].btn_actualizar_pass;
            else if (btn.classList.contains('btn-enviar')) btn.textContent = staticTranslations[currentLang].btn_enviar_msg;
            else if (btn.closest('#login-box')) btn.textContent = staticTranslations[currentLang].btn_entrar;
            else if (btn.closest('#register-box')) btn.textContent = staticTranslations[currentLang].btn_registro;
        });

        const togglePassword = document.getElementById('toggle-password-form');
        if (togglePassword) togglePassword.textContent = staticTranslations[currentLang].lnk_olvidado;

        const toggleBack = document.getElementById('toggle-back');
        if (toggleBack) toggleBack.textContent = staticTranslations[currentLang].lnk_volver_login;

        const pMsgSesion = document.querySelector('.txt-margin-vertical');
        if (pMsgSesion) pMsgSesion.textContent = staticTranslations[currentLang].msg_sesion;

        const pBloqueo = document.querySelector('.mensaje-bloqueo');
        if (pBloqueo) pBloqueo.textContent = staticTranslations[currentLang].msg_bloqueo;

        const btnIrInicio = document.querySelector('.btn-iniciar-sesion');
        if (btnIrInicio) btnIrInicio.textContent = staticTranslations[currentLang].btn_ir_inicio;

    };

    const switchLanguage = async (lang) => {
        currentLang = lang;
        localStorage.setItem('appLang', lang);
        updateUI();

        if (lang === 'gl' && !translationsCache) {
            const success = await fetchTranslations();
            if (success) applyTranslations();
        } else {
            applyTranslations();
        }
    };

    if (langES) langES.addEventListener('click', () => switchLanguage('es'));
    if (langGL) langGL.addEventListener('click', () => switchLanguage('gl'));

    // Exponer para Descripcion.html
    window.translatePage = applyTranslations;

    // Inicializar
    updateUI();

    // Si el idioma es Gallego, cargamos el cache inmediatamente
    if (currentLang === 'gl') {
        fetchTranslations().then(success => {
            if (success) applyTranslations();
        });
    } else {
        // Si es Español, igual cargamos el cache en segundo plano para que el cambio sea instantáneo después
        fetchTranslations().then(() => {
            applyTranslations();
        });
    }
});
