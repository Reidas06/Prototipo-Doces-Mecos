document.addEventListener('DOMContentLoaded', () => {
    console.log("Traductor Doces&Mecos iniciado (CSS Toggling Mode)");
    
    const langES = document.getElementById('lang-es');
    const langGL = document.getElementById('lang-gl');
    
    let currentLang = localStorage.getItem('appLang') || 'es';

    const updateUI = () => {
        if (!langES || !langGL) return;
        if (currentLang === 'es') {
            langES.style.opacity = '1';
            langGL.style.opacity = '0.5';
            document.body.classList.remove('lang-gl');
        } else {
            langES.style.opacity = '0.5';
            langGL.style.opacity = '1';
            document.body.classList.add('lang-gl');
        }
    };

    /**
     * Aplica el idioma guardado.
     * Al usar CSS Toggling, esto solo requiere manipular la clase del body.
     */
    const translatePage = () => {
        updateUI();
    };

    if (langES) {
        langES.addEventListener('click', () => {
            currentLang = 'es';
            localStorage.setItem('appLang', 'es');
            translatePage();
        });
    }

    if (langGL) {
        langGL.addEventListener('click', () => {
            currentLang = 'gl';
            localStorage.setItem('appLang', 'gl');
            translatePage();
        });
    }

    // Exponer la función globalmente
    window.translatePage = translatePage;

    // Inicializar
    translatePage();
});
