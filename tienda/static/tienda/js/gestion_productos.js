document.addEventListener('DOMContentLoaded', function () {
    console.log("Doces&Mecos Product Management");

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

    // Mapeo de categorías a IDs de grid
    const categoryGridMap = {
        'ofertas': 'grid-ofertas',
        'vendido': 'grid-vendido',
        'limitado': 'grid-limitado'
    };

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

    // --- Helper UI ---
    function createProductElement(item, isTrash = false) {
        const div = document.createElement('div');
        div.className = 'producto-item';
        div.dataset.id = item.id;
        div.dataset.titulo = item.titulo;
        div.dataset.precio = item.precio || '2.50';
        div.dataset.descripcion = item.descripcion || '';
        div.dataset.categoria = item.categoria || 'ninguna';

        const img = document.createElement('img');
        img.src = item.imagen ? item.imagen : '/static/tienda/img/sea-9983074_640.jpg';
        img.alt = item.titulo;
        img.className = 'producto-img-main';

        const title = document.createElement('h3');
        title.className = 'producto-nombre';
        title.textContent = item.titulo;

        if (isTrash) {
            const actions = document.createElement('div');
            actions.className = 'trash-actions';

            const restoreBtn = document.createElement('button');
            restoreBtn.className = 'btn-restore';
            restoreBtn.title = 'Restaurar';
            restoreBtn.innerHTML = '<i class="fas fa-undo"></i>';
            restoreBtn.dataset.id = item.id;

            const hardDeleteBtn = document.createElement('button');
            hardDeleteBtn.className = 'btn-hard-delete';
            hardDeleteBtn.title = 'Eliminar permanentemente';
            hardDeleteBtn.innerHTML = '<i class="fas fa-radiation"></i>';
            hardDeleteBtn.dataset.id = item.id;

            actions.appendChild(restoreBtn);
            actions.appendChild(hardDeleteBtn);

            div.appendChild(img);
            div.appendChild(title);
            div.appendChild(actions);
        } else {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'producto-enlace';
            link.appendChild(img);
            link.appendChild(title);

            const adminBtns = document.createElement('div');
            adminBtns.className = 'producto-admin-btns';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn-edit-item';
            editBtn.title = 'Editar';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete-item';
            deleteBtn.title = 'Eliminar';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

            adminBtns.appendChild(editBtn);
            adminBtns.appendChild(deleteBtn);

            div.appendChild(link);
            div.appendChild(adminBtns);
        }

        return div;
    }

    // --- Modales ---
    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', () => addModal.classList.add('active'));
    }
    const closeModals = () => {
        if (addModal) addModal.classList.remove('active');
        if (editModal) editModal.classList.remove('active');
        if (formAdd) formAdd.reset();
        if (formEdit) formEdit.reset();
    };
    if (btnCloseAdd) btnCloseAdd.addEventListener('click', closeModals);
    if (btnCloseEdit) btnCloseEdit.addEventListener('click', closeModals);

    // --- Event Delegation (Main Grid) ---
    if (categoriasGrid) {
        categoriasGrid.addEventListener('click', async (e) => {
            const editBtn = e.target.closest('.btn-edit-item');
            if (editBtn) {
                const item = editBtn.closest('.producto-item');
                document.getElementById('e-id').value = item.dataset.id;
                document.getElementById('e-titulo').value = item.dataset.titulo;
                document.getElementById('e-precio').value = item.dataset.precio;
                document.getElementById('e-descripcion').value = item.dataset.descripcion;
                document.getElementById('e-categoria').value = item.dataset.categoria;
                editModal.classList.add('active');
                return;
            }

            const deleteBtn = e.target.closest('.btn-delete-item');
            if (deleteBtn && confirm("¿Enviar este producto a la papelera?")) {
                const item = deleteBtn.closest('.producto-item');
                try {
                    const res = await fetch(`/api/producto/delete/${item.dataset.id}/`, {
                        method: 'POST',
                        headers: { 'X-CSRFToken': getCookie('csrftoken') }
                    });
                    if ((await res.json()).success) {
                        item.classList.add('fade-out');
                        setTimeout(() => item.remove(), 300);
                    }
                } catch (error) {
                    alert("Fallo al conectar con el servidor.");
                }
            }
        });
    }

    // --- Peticiones API ---

    // Crear
    if (formAdd) {
        formAdd.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formAdd.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

            try {
                const res = await fetch('/api/producto/crear/', {
                    method: 'POST',
                    body: new FormData(formAdd),
                    headers: { 'X-CSRFToken': getCookie('csrftoken') }
                });
                const data = await res.json();
                if (data.status === 'ok') {
                    if (data.producto) {
                        // Buscar el grid destino
                        const targetGridId = categoryGridMap[data.producto.categoria];
                        const grid = document.getElementById(targetGridId) || document.querySelector('.grid-productos') || categoriasGrid;
                        grid.prepend(createProductElement(data.producto));
                    } else {
                        window.location.reload();
                    }
                    closeModals();
                } else {
                    alert("Error: " + (data.error || "Desconocido"));
                }
            } catch (error) {
                alert("Error de conexión.");
            } finally {
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
            if (document.getElementById('e-imagen').files.length === 0) {
                formData.delete('imagen');
            }

            try {
                const res = await fetch(`/api/producto/editar/${id}/`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });

                // Añadimos esto para depurar qué responde DRF si algo falla
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Error del servidor:", res.status, errorText);
                    throw new Error(`Error HTTP: ${res.status}`);
                }

                const data = await res.json();

                if (data.status === 'ok') {
                    const item = document.querySelector(`.producto-item[data-id="${id}"]`);
                    if (item) {
                        const oldCat = item.dataset.categoria;
                        const newCat = document.getElementById('e-categoria').value;

                        item.dataset.titulo = document.getElementById('e-titulo').value;
                        item.dataset.precio = document.getElementById('e-precio').value;
                        item.dataset.descripcion = document.getElementById('e-descripcion').value;
                        item.dataset.categoria = newCat;
                        item.querySelector('.producto-nombre').textContent = item.dataset.titulo;

                        if (data.producto && data.producto.imagen) {
                            item.querySelector('.producto-img-main').src = data.producto.imagen;
                        }

                        if (oldCat !== newCat) {
                            const targetGridId = categoryGridMap[newCat];
                            const targetGrid = document.getElementById(targetGridId);
                            if (targetGrid) {
                                targetGrid.appendChild(item);
                            }
                        }
                    }
                    closeModals();
                } else {
                    alert("Error al actualizar: " + (data.mensaje || "Revisa los datos"));
                }
            } catch (error) {
                console.error("Error capturado:", error);
                alert("Error de conexión o el servidor rechazó la petición.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // --- Papelera ---
    async function loadTrash() {
        if (!trashGrid) return;
        trashGrid.textContent = 'Cargando papelera...';
        try {
            const res = await fetch('/api/producto/trash_list/');
            const data = await res.json();
            trashGrid.textContent = '';
            if (data.results.length === 0) {
                trashGrid.textContent = 'La papelera está vacía.';
            } else {
                data.results.forEach(item => trashGrid.appendChild(createProductElement(item, true)));
            }
        } catch (e) {
            trashGrid.textContent = 'Error al cargar.';
        }
    }

    if (btnTrashView) {
        btnTrashView.addEventListener('click', () => {
            const isVisible = categoriasGrid.style.display !== 'none';
            categoriasGrid.style.display = isVisible ? 'none' : 'block';
            trashGrid.style.display = isVisible ? 'grid' : 'none';
            btnTrashView.innerHTML = isVisible ? '<i class="fas fa-arrow-left"></i> <span>Volver</span>' : '<i class="fas fa-trash"></i> <span>Papelera</span>';
            if (isVisible) loadTrash();
        });
    }

    //Restaurar y eliminar permanentemente
    if (trashGrid) {
        trashGrid.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-restore, .btn-hard-delete');
            if (!btn) return;
            const isRestore = btn.classList.contains('btn-restore');
            const item = btn.closest('.producto-item');
            if (!isRestore && !confirm("¿Eliminar permanentemente?")) return;

            try {
                const action = isRestore ? 'restore' : 'hard_delete';
                const reqMethod = isRestore ? 'POST' : 'DELETE';

                const res = await fetch(`/api/producto/${action}/${btn.dataset.id}/`, {
                    method: reqMethod,
                    headers: { 'X-CSRFToken': getCookie('csrftoken') }
                });

                if ((await res.json()).success) {
                    item.remove();
                    if (isRestore && !window.location.href.includes('todos_productos')) {
                        // En la página principal, recargamos para que aparezca en su categoría
                        window.location.reload();
                    }
                }
            } catch (error) {
                alert("Error.");
            }
        });
    }
});