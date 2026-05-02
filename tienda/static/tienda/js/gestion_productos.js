document.addEventListener('DOMContentLoaded', function () {
    console.log("Doces&Mecos Product Management - Style: Arrivelo");

    // --- Referencias ---
    const addModal = document.getElementById('add-news-modal');
    const editModal = document.getElementById('edit-news-modal');
    
    const btnAddProduct = document.getElementById('btn-add-news');
    const btnTrashView = document.getElementById('btn-trash-view');
    
    const btnCloseAdd = document.getElementById('btn-close-modal');
    const btnCloseEdit = document.getElementById('btn-close-edit');

    const formAdd = document.getElementById('add-news-form');
    const formEdit = document.getElementById('edit-news-form');

    const categoriasGrid = document.getElementById('categorias-productos');
    const trashGrid = document.getElementById('trash-grid');

    // --- Helper CSRF ---
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // --- Modales ---
    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', () => addModal.classList.add('active'));
    }
    if (btnCloseAdd) {
        btnCloseAdd.addEventListener('click', () => {
            addModal.classList.remove('active');
            formAdd.reset();
        });
    }
    if (btnCloseEdit) {
        btnCloseEdit.addEventListener('click', () => {
            editModal.classList.remove('active');
            formEdit.reset();
        });
    }

    // --- Edición (Populate Modal) ---
    document.querySelectorAll('.btn-edit-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = btn.closest('.producto-item');
            const id = item.getAttribute('data-id');
            const titulo = item.getAttribute('data-titulo');
            const desc = item.getAttribute('data-descripcion');
            const cat = item.getAttribute('data-categoria');

            document.getElementById('e-id').value = id;
            document.getElementById('e-titulo').value = titulo;
            document.getElementById('e-descripcion').value = desc;
            document.getElementById('e-categoria').value = cat;

            editModal.classList.add('active');
        });
    });

    // --- Peticiones API ---

    // Crear
    if (formAdd) {
        formAdd.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formAdd.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

            const formData = new FormData(formAdd);
            const res = await fetch('/api/producto/crear/', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.status === 'ok') {
                window.location.reload();
            } else {
                alert("Error al crear producto.");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // Editar
    if (formEdit) {
        formEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('e-id').value;
            const submitBtn = formEdit.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';

            const formData = new FormData(formEdit);
            const res = await fetch(`/api/producto/editar/${id}/`, {
                method: 'POST',
                body: formData,
                headers: { 'X-CSRFToken': getCookie('csrftoken') }
            });
            const data = await res.json();
            if (data.status === 'ok') {
                window.location.reload();
            } else {
                alert("Error al actualizar producto.");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // Soft Delete (Papelera)
    document.querySelectorAll('.btn-delete-item').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm("¿Enviar este producto a la papelera?")) {
                const id = btn.closest('.producto-item').getAttribute('data-id');
                const res = await fetch(`/api/producto/delete/${id}/`, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') }
                });
                const data = await res.json();
                if (data.success) {
                    window.location.reload();
                }
            }
        });
    });

    // --- Papelera View ---
    if (btnTrashView && trashGrid && categoriasGrid) {
        btnTrashView.addEventListener('click', async () => {
            if (categoriasGrid.style.display !== 'none') {
                // Ir a papelera
                categoriasGrid.style.display = 'none';
                trashGrid.style.display = 'grid';
                btnTrashView.innerHTML = '<i class="fas fa-arrow-left"></i> <span>Volver a Productos</span>';
                
                trashGrid.innerHTML = '<p style="grid-column: span 4; text-align: center;">Cargando papelera...</p>';
                
                try {
                    const res = await fetch('/api/producto/trash_list/');
                    const data = await res.json();
                    const list = data.results;
                    
                    if (list.length === 0) {
                        trashGrid.innerHTML = '<p style="grid-column: span 4; text-align: center; color: #888;">La papelera está vacía.</p>';
                    } else {
                        trashGrid.innerHTML = '';
                        list.forEach(item => {
                            const imgUrl = item.imagen ? item.imagen : '/static/tienda/img/sea-9983074_640.jpg';
                            trashGrid.innerHTML += `
                                <div class="producto-item">
                                    <img src="${imgUrl}" alt="${item.titulo}" class="producto-img-main">
                                    <h3 class="producto-nombre">${item.titulo}</h3>
                                    <div class="trash-actions">
                                        <button class="btn-restore" data-id="${item.id}" title="Restaurar"><i class="fas fa-undo"></i></button>
                                        <button class="btn-hard-delete" data-id="${item.id}" title="Eliminar permanentemente"><i class="fas fa-radiation"></i></button>
                                    </div>
                                </div>
                            `;
                        });
                        
                        // Listeners Restaurar
                        document.querySelectorAll('.btn-restore').forEach(b => {
                            b.addEventListener('click', async () => {
                                const id = b.getAttribute('data-id');
                                const r = await fetch(`/api/producto/restore/${id}/`, {
                                    method: 'POST',
                                    headers: { 'X-CSRFToken': getCookie('csrftoken') }
                                });
                                const d = await r.json();
                                if (d.success) window.location.reload();
                            });
                        });
                        
                        // Listeners Borrado Permanente
                        document.querySelectorAll('.btn-hard-delete').forEach(b => {
                            b.addEventListener('click', async () => {
                                if (confirm("¡ATENCIÓN! El producto se eliminará para siempre. ¿Continuar?")) {
                                    const id = b.getAttribute('data-id');
                                    const r = await fetch(`/api/producto/hard_delete/${id}/`, {
                                        method: 'POST',
                                        headers: { 'X-CSRFToken': getCookie('csrftoken') }
                                    });
                                    const d = await r.json();
                                    if (d.success) window.location.reload();
                                }
                            });
                        });
                    }
                } catch (e) {
                    trashGrid.innerHTML = '<p style="grid-column: span 4; text-align: center;">Error al cargar papelera.</p>';
                }
            } else {
                // Volver
                categoriasGrid.style.display = 'block';
                trashGrid.style.display = 'none';
                btnTrashView.innerHTML = '<i class="fas fa-trash"></i> <span>Papelera</span>';
                btnTrashView.style.backgroundColor = '#e74c3c';
            }
        });
    }
});
