document.addEventListener('DOMContentLoaded', () => {
    console.log("Traductor Doces&Mecos iniciado");
    
    const langES = document.getElementById('lang-es');
    const langGL = document.getElementById('lang-gl');
    
    let currentLang = localStorage.getItem('appLang') || 'es';

    const updateUI = () => {
        if (!langES || !langGL) return;
        if (currentLang === 'es') {
            langES.style.opacity = '1';
            langGL.style.opacity = '0.5';
        } else {
            langES.style.opacity = '0.5';
            langGL.style.opacity = '1';
        }
    };

    /**
     * Traduce la página utilizando los datos persistentes en el DOM (data-attributes)
     * Esto evita llamadas a la API externa y mantiene el formato exacto de la DB.
     */
    const translatePage = () => {
        // Traducir nombres de productos
        const nombres = document.querySelectorAll('.producto-nombre');
        nombres.forEach(el => {
            const container = el.closest('.producto-item');
            if (container) {
                if (currentLang === 'gl') {
                    const glText = container.getAttribute('data-titulo-gl');
                    if (glText) el.textContent = glText;
                } else {
                    el.textContent = container.getAttribute('data-titulo');
                }
            }
        });

        // Traducir descripciones (si existen en la página actual)
        const descs = document.querySelectorAll('.producto-desc, .producto-descripcion p');
        descs.forEach(el => {
            const container = el.closest('.producto-item') || document.querySelector('.producto-detalle-container');
            if (container) {
                if (currentLang === 'gl') {
                    const glText = container.getAttribute('data-descripcion-gl');
                    if (glText) el.textContent = glText;
                } else {
                    el.textContent = container.getAttribute('data-descripcion');
                }
            }
        });
    };

    if (langES) {
        langES.addEventListener('click', () => {
            currentLang = 'es';
            localStorage.setItem('appLang', 'es');
            updateUI();
            translatePage();
        });
    }

    if (langGL) {
        langGL.addEventListener('click', () => {
            currentLang = 'gl';
            localStorage.setItem('appLang', 'gl');
            updateUI();
            translatePage();
        });
    }

    // Exponer la función globalmente para que otras páginas (como Descripcion.html) puedan llamarla
    window.translatePage = translatePage;

    // Inicializar
    updateUI();
    translatePage(); // Se ejecuta siempre para asegurar que el idioma persistido se aplique
});
