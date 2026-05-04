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

    const translateText = async (text, target) => {
        try {
            const res = await fetch('/api/translate/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, target })
            });
            const data = await res.json();
            return data.translated || text;
        } catch (error) {
            console.error("Error al traducir:", error);
            return text;
        }
    };

    const translatePage = async () => {
        // Por ahora solo traducimos descripciones de productos/noticias
        // Buscamos elementos con la clase 'translatable' o específicos
        const elements = document.querySelectorAll('.producto-desc, .producto-descripcion p, .producto-nombre');
        
        for (let el of elements) {
            const originalText = el.getAttribute('data-original-text') || el.textContent;
            if (!el.getAttribute('data-original-text')) {
                el.setAttribute('data-original-text', originalText);
            }
            
            if (currentLang === 'gl') {
                el.textContent = await translateText(originalText, 'gl');
            } else {
                el.textContent = originalText;
            }
        }
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

    // Inicializar
    updateUI();
    if (currentLang === 'gl') translatePage();
});
