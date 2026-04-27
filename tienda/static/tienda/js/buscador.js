document.addEventListener('DOMContentLoaded', () => {
    const inputBuscador = document.getElementById('buscador-input');
    const btnBuscar = document.getElementById('btn-buscar');

    function filtrarProductos() {
        const textoBusqueda = inputBuscador.value.toLowerCase().trim();
        const productosLinks = document.querySelectorAll('.grid-productos > a');

        productosLinks.forEach(link => {
            const nombreElement = link.querySelector('.producto-nombre');
            if (nombreElement) {
                const nombreProducto = nombreElement.textContent.toLowerCase();
                // Si el nombre incluye el texto buscado, se muestra, sino se oculta
                if (nombreProducto.includes(textoBusqueda)) {
                    link.style.display = '';
                } else {
                    link.style.display = 'none';
                }
            }
        });
    }

    // Filtrar al escribir
    inputBuscador.addEventListener('input', filtrarProductos);

    // Filtrar al pulsar el botón
    btnBuscar.addEventListener('click', (e) => {
        e.preventDefault();
        filtrarProductos();
    });
});
