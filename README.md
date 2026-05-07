# Doces & Mecos

Este proyecto es una plataforma de comercio electrónico desarrollada como prototipo para el proyecto intermodular de 2º DAW. La aplicación permite gestionar y visualizar un catálogo de dulces, ofreciendo una experiencia de usuario moderna y funcional.

## Instalación y Ejecución

Para poner en marcha el proyecto localmente, sigue estos pasos:

1. **Clonar el repositorio** (o descargar los archivos).
2. **Crear y activar un entorno virtual**:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # En Windows
   source venv/bin/activate # En Linux/macOS
   ```
3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Realizar migraciones**:
   ```bash
   python manage.py migrate
   ```
5. **Iniciar el servidor**:
   ```bash
   python manage.py runserver
   ```
   Accede a `http://127.0.0.1:8000/`.

---

## Características Principales

### 1. Gestión Avanzada de Productos
- **CRUD Dinámico**: Los administradores pueden crear, editar y gestionar productos directamente desde el frontend mediante modales interactivos.
- **Sistema de Papelera (Soft Delete)**: Implementación de un estado `in_trash` que permite enviar productos a una papelera de reciclaje antes de su eliminación definitiva, facilitando la recuperación de datos.
- **Categorización**: Organización automática en secciones como *Ofertas*, *Más Vendidos* y *Tiempo Limitado*.

### 2. Experiencia de Usuario y Diseño
- **Buscador Predictivo**: Filtrado dinámico de productos por nombre mediante JavaScript, ofreciendo resultados instantáneos.
- **Traducción Castellano/Gallego**: Integración de un sistema de traducción que utiliza `deep-translator` para adaptar las descripciones de los productos al idioma seleccionado.
- **Interfaz Moderna**: Uso de CSS avanzado para efectos de transparencia (glassmorphism), animaciones suaves y un diseño responsive.
- **Footer Social**: Integración de iconos de redes sociales (Instagram) para mejorar la presencia digital.

### 3. Funcionalidades de Tienda
- **Carrito de Compra**: Gestión de selección de productos.
- **Flujo de Pago**: Simulación de proceso de compra con formularios de contacto y validación.

---

## 📂 Estructura del Proyecto

A continuación se detalla la organización de los directorios principales:

```text
Prototipo Doces&Mecos/
│
├── doces_mecos/          # Configuración global de Django (settings, urls, wsgi)
├── tienda/               # Aplicación principal del negocio
│   ├── migrations/       # Historial de cambios en la base de datos
│   ├── static/           # Archivos estáticos (CSS, JS, Imágenes)
│   │   └── tienda/
│   │       ├── css/      # Estilos personalizados (Principal.css, Productos.css)
│   │       └── js/       # Lógica frontend (traductor.js, buscador.js, gestion_productos.js)
│   ├── templates/        # Vistas HTML (Django Templates)
│   ├── models.py         # Definición de la entidad Producto y sus estados
│   ├── views.py          # Lógica de negocio y endpoints de la API
│   └── urls.py           # Enrutamiento interno de la aplicación
├── media/                # Almacenamiento de imágenes subidas por el usuario
├── db.sqlite3            # Base de datos local
├── requirements.txt      # Listado de librerías necesarias
└── manage.py             # Comando de gestión de Django
```

---

## 💻 Snippets de Código Interesantes

### Modelo de Producto con Soft Delete
El modelo `Producto` incluye un campo booleano para gestionar la papelera de reciclaje sin perder datos permanentemente:

```python
class Producto(models.Model):
    titulo = models.CharField(max_length=200)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default='ninguna')
    in_trash = models.BooleanField(default=False) # Campo para la papelera

    def __str__(self):
        return self.titulo
```

### API de Traducción Dinámica
Fragmento de la lógica en JavaScript que conecta con el backend para traducir contenidos en tiempo real:

```javascript
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
```

### Buscador en Tiempo Real
Lógica sencilla pero efectiva para filtrar elementos en el DOM según la entrada del usuario:

```javascript
function filtrarProductos() {
    const textoBusqueda = inputBuscador.value.toLowerCase().trim();
    const productosItems = document.querySelectorAll('.producto-item');

    productosItems.forEach(item => {
        const nombreElement = item.querySelector('.producto-nombre');
        if (nombreElement) {
            const nombreProducto = nombreElement.textContent.toLowerCase();
            item.style.display = nombreProducto.includes(textoBusqueda) ? '' : 'none';
        }
    });
}
```
