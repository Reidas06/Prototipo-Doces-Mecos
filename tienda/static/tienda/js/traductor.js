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
            'h2_todos': 'Todos os produtos'
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
            'h2_todos': 'Todos los productos'
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
