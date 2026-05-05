document.addEventListener('DOMContentLoaded', () => {
    const inputBuscador = document.getElementById('buscador-input');
    const btnBuscar = document.getElementById('btn-buscar');

    function filtrarProductos() {
        const textoBusqueda = inputBuscador.value.toLowerCase().trim();
        // Seleccionamos todos los contenedores de producto
        const productosItems = document.querySelectorAll('.producto-item');

        productosItems.forEach(item => {
            const nombreElement = item.querySelector('.producto-nombre');
            if (nombreElement) {
                const nombreProducto = nombreElement.textContent.toLowerCase();
                // Si el nombre incluye el texto buscado, se muestra el contenedor, sino se oculta
                if (nombreProducto.includes(textoBusqueda)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
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
