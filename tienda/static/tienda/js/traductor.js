document.addEventListener('DOMContentLoaded', () => {
    console.log("Traductor Doces&Mecos iniciado (Bulk Fetch & Cache Mode)");
    
    const langES = document.getElementById('lang-es');
    const langGL = document.getElementById('lang-gl');
    
    let currentLang = localStorage.getItem('appLang') || 'es';
    let translationsCache = null;

    // Traducciones estáticas para elementos comunes
    const staticTranslations = {
        'gl': {
            'slogan': 'Doce alegría en cada bocado!',
            'acerca_h4': 'Acerca de nós',
            'donde_h4': 'Onde nos podes atopar',
            'desc_1': 'A nosa pasión é endulzar a vida de pequenos como grandes, ofrezemos unha amplía variedade de doces e larpeiradas que despertan recordos da infancia. Temos desde caramelos clásicos hasta as últimas novedades. A nosa misión e que o cliente marche cun sorriso na cara como o que nós temos cando entran.',
            'desc_2': 'Podes atoparnos no centro de Malpica de Bergantiños, nun espazo cheo de cor, doces e alegría. Enderezo: Rúa Eduardo Vila Fano 2, Malpica de Bergantiños. Horario: 10:30-1:30 || 5:00-8:30. Achégate a coñecernos e déixate levar polo sabor das nosas lambetadas en Doces & Mecos.'
        },
        'es': {
            'slogan': 'Doce alegría en cada bocado!',
            'acerca_h4': 'Acerca de nosotros',
            'donde_h4': 'Dónde nos puedes encontrar',
            'desc_1': 'Nuestra pasión es endulzar la vida de pequeños y grandes, ofrecemos una amplia variedad de dulces y golosinas que despiertan recuerdos de la infancia. Tenemos desde caramelos clásicos hasta las últimas novedades. Nuestra misión es que el cliente se vaya con una sonrisa en la cara como la que nosotros tenemos cuando entran.',
            'desc_2': 'Puedes encontrarnos en el centro de Malpica de Bergantiños, en un espacio lleno de color, dulces y alegría. Dirección: Rúa Eduardo Vila Fano 2, Malpica de Bergantiños. Horario: 10:30-1:30 || 5:00-8:30. Acércate a conocernos y déjate llevar por el sabor de nuestras golosinas en Doces & Mecos.'
        }
    };

    const fetchTranslations = async () => {
        try {
            const res = await fetch('/api/traducciones/');
            const data = await res.json();
            translationsCache = data.traducciones;
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
        // 1. Traducir productos en catálogo
        const products = document.querySelectorAll('.producto-item');
        products.forEach(el => {
            const id = el.getAttribute('data-id');
            const nameEl = el.querySelector('.producto-nombre');
            if (id && nameEl && translationsCache && translationsCache[id]) {
                nameEl.textContent = (currentLang === 'gl') ? translationsCache[id].titulo_gl : translationsCache[id].titulo_es;
            }
        });

        // 2. Traducir página de detalle (si estamos en ella)
        const detailContainer = document.getElementById('product-detail-container');
        if (detailContainer) {
            const pTitulo = document.getElementById('p-titulo');
            const pDesc = document.getElementById('p-desc');
            const id = new URLSearchParams(window.location.search).get('id');
            
            if (id && translationsCache && translationsCache[id]) {
                if (pTitulo) pTitulo.textContent = (currentLang === 'gl') ? translationsCache[id].titulo_gl : translationsCache[id].titulo_es;
                if (pDesc) {
                    const descText = (currentLang === 'gl') ? translationsCache[id].descripcion_gl : translationsCache[id].descripcion_es;
                    pDesc.innerHTML = descText ? descText.split('\n').map(line => `<p>${line}</p>`).join('') : '';
                }
            }
        }

        // 3. Traducir textos estáticos
        const slogan = document.querySelector('.cabecera-center p');
        if (slogan) slogan.textContent = staticTranslations[currentLang].slogan;

        const acercaH4 = document.querySelector('.cuerpo-up h4'); // Simplificado, mejor usar IDs
        if (acercaH4) acercaH4.textContent = staticTranslations[currentLang].acerca_h4;

        const desc1 = document.getElementById('desc-1');
        if (desc1) desc1.textContent = staticTranslations[currentLang].desc_1;

        const desc2 = document.getElementById('desc-2');
        if (desc2) desc2.textContent = staticTranslations[currentLang].desc_2;
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
    if (currentLang === 'gl') {
        fetchTranslations().then(success => {
            if (success) applyTranslations();
        });
    }
});
