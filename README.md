# Doces & Mecos

Plataforma de comercio electrónico desarrollada como proyecto intermodular de **2º DAW**. La aplicación permite gestionar y visualizar un catálogo de dulces artesanales, con un sistema completo de autenticación de usuarios, carrito de compras con persistencia en base de datos, buzón de contacto y un panel de administración profesional.

---

## Índice

1. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
2. [Requisitos Previos](#-requisitos-previos)
3. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Modelos de Base de Datos](#-modelos-de-base-de-datos)
6. [API REST — Endpoints](#-api-rest--endpoints)
7. [Sistema de Autenticación](#-sistema-de-autenticación)
8. [Gestión de Productos (Frontend)](#-gestión-de-productos-frontend)
9. [Carrito de Compras y Checkout](#-carrito-de-compras-y-checkout)
10. [Sistema de Contacto (Buzón)](#-sistema-de-contacto-buzón)
11. [Traducción Castellano / Gallego](#-traducción-castellano--gallego)
12. [Panel de Administración de Django](#-panel-de-administración-de-django)
13. [Snippets de Código Destacados](#-snippets-de-código-destacados)

---

## 🛠 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| **Python** | 3.x | Lenguaje base del backend |
| **Django** | 5.2.13 | Framework web principal (MVC/MVT) |
| **Django REST Framework** | 3.15.1 | Construcción de APIs RESTful |
| **SQLite3** | Integrada | Base de datos relacional local |
| **deep-translator** | 1.11.4 | Traducción automática Castellano ↔ Gallego |
| **django-cors-headers** | — | Gestión de políticas CORS |
| **HTML5 / CSS3** | — | Estructura y estilos del frontend |
| **JavaScript (ES6+)** | — | Lógica del lado del cliente (fetch API, DOM) |
| **Font Awesome** | 6.5.0 | Iconografía profesional |
| **SessionStorage** | Web API | Persistencia temporal del carrito en navegador |

---

## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Python 3.10+** → [Descargar Python](https://www.python.org/downloads/)
- **pip** (gestor de paquetes de Python, incluido con Python)
- **Git** (opcional, para clonar el repositorio)

Puedes verificar tu instalación ejecutando:

```bash
python --version
pip --version
```

---

## Instalación y Puesta en Marcha

Sigue estos pasos **en orden** para poner en marcha el proyecto desde cero:

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/Reidas06/Prototipo-Doces-Mecos.git
cd Prototipo-Doces-Mecos
```

O bien descarga el `.zip` desde GitHub y descomprímelo.

### Paso 2 — Crear un entorno virtual

Es **recomendable** trabajar dentro de un entorno virtual para aislar las dependencias:

```bash
# Crear el entorno virtual
python -m venv venv

# Activar en Windows (PowerShell)
.\venv\Scripts\activate

# Activar en Windows (CMD)
venv\Scripts\activate.bat

# Activar en Linux / macOS
source venv/bin/activate
```

> Una vez activado, verás `(venv)` al inicio de tu terminal.

### Paso 3 — Instalar las dependencias

```bash
pip install -r requirements.txt
```

Este comando instalará automáticamente todas las librerías necesarias. El archivo `requirements.txt` contiene:

```
asgiref==3.11.1
Django==5.2.13
sqlparse==0.5.5
tzdata==2026.1
deep-translator==1.11.4
djangorestframework==3.15.1
```

> Si `djangorestframework` da problemas al instalarse, puedes forzar su instalación con:
> ```bash
> pip install djangorestframework==3.15.1
> ```

### Paso 4 — Aplicar las migraciones de la base de datos

Las migraciones crean todas las tablas necesarias en SQLite (`db.sqlite3`):

```bash
python manage.py makemigrations
python manage.py migrate
```

Esto generará las tablas para los modelos: `Producto`, `Cliente`, `Buzon` y `Pedido`, además de las tablas internas de Django para autenticación y sesiones.

### Paso 5 — Crear un Superusuario (Administrador)

Para acceder al panel de administración de Django (`/admin/`) necesitas crear una cuenta de superusuario:

```bash
python manage.py createsuperuser
```

Se te pedirán los siguientes datos:

```
Nombre de usuario: admin
Dirección de correo electrónico: admin@docesmecos.com
Password: ********
Password (again): ********
```

> **Importante**: Recuerda estas credenciales. Las necesitarás para acceder al panel en `http://127.0.0.1:8000/admin/` y para gestionar productos desde el frontend.

### Paso 6 — Iniciar el servidor de desarrollo

```bash
python manage.py runserver
```

Accede a la aplicación en tu navegador:

| URL | Descripción |
|---|---|
| `http://127.0.0.1:8000/` | Página principal |
| `http://127.0.0.1:8000/productos/` | Catálogo de productos |
| `http://127.0.0.1:8000/admin/` | Panel de administración |

### Paso 7 — Detener el servidor

Para apagar el servidor, pulsa `Ctrl + C` en la terminal.

---

## Estructura del Proyecto

```text
Prototipo Doces&Mecos/
│
├── doces_mecos/                # Configuración global del proyecto Django
│   ├── settings.py             # Configuración (BBDD, apps, CORS, media)
│   ├── urls.py                 # Enrutamiento raíz (incluye admin y tienda)
│   └── wsgi.py                 # Punto de entrada WSGI
│
├── tienda/                     # Aplicación principal del negocio
│   ├── migrations/             # Historial de migraciones de la BBDD
│   ├── static/tienda/          # Archivos estáticos
│   │   ├── css/                # Hojas de estilo
│   │   │   ├── Principal.css
│   │   │   ├── Productos.css
│   │   │   ├── Formulario.css
│   │   │   ├── Carrito.css
│   │   │   ├── Pago.css
│   │   │   └── Contacta.css
│   │   ├── js/                 # Lógica frontend
│   │   │   ├── carrito.js      # Gestión del carrito (SessionStorage)
│   │   │   ├── buscador.js     # Filtrado en tiempo real
│   │   │   ├── gestion_productos.js  # CRUD modal de productos (admin)
│   │   │   └── traductor.js    # Sistema de traducción ES/GL
│   │   └── img/                # Imágenes estáticas (logo, favicon, etc.)
│   ├── templates/tienda/       # Plantillas HTML (Django Templates)
│   │   ├── Principal.html      # Página de inicio
│   │   ├── Productos.html      # Catálogo por categorías
│   │   ├── TodosProductos.html # Vista "Ver todos"
│   │   ├── Descripcion.html    # Detalle individual de producto
│   │   ├── Carrito.html        # Carrito de compras
│   │   ├── Pago.html           # Checkout y pago
│   │   ├── Formulario.html     # Registro / Login / Cambio de contraseña
│   │   └── Contacta.html       # Buzón de contacto
│   ├── models.py               # Modelos de la BBDD (Producto, Cliente, Buzon, Pedido)
│   ├── views.py                # Vistas y endpoints de la API
│   ├── urls.py                 # Enrutamiento de la app
│   ├── serializers.py          # Serializadores REST (DRF)
│   └── admin.py                # Configuración del panel de administración
│
├── media/                      # Imágenes subidas dinámicamente (productos)
├── db.sqlite3                  # Base de datos SQLite
├── requirements.txt            # Dependencias Python
├── manage.py                   # Comando de gestión Django
└── README.md                   # Este archivo
```

---

## 🗃 Modelos de Base de Datos

El sistema cuenta con **4 modelos** principales y utiliza **3 tipos de relaciones**:

### Diagrama de Relaciones

```
┌──────────────┐     1:1      ┌──────────────┐
│  Django User │◄────────────►│   Cliente     │
└──────┬───────┘              └──────┬────────┘
       │                             │
       │ 1:N                         │ 1:N
       ▼                             ▼
┌──────────────┐              ┌──────────────┐
│    Buzon     │              │    Pedido     │
└──────────────┘              └──────┬────────┘
                                     │
                                     │ N:M
                                     ▼
                              ┌──────────────┐
                              │   Producto   │
                              └──────────────┘
```

### Modelo `Producto`

Representa un dulce en el catálogo. Incluye traducción automática y papelera virtual (soft delete).

```python
class Producto(models.Model):
    CATEGORIAS = [
        ('ofertas', 'Ofertas'),
        ('vendido', 'Lo más vendido'),
        ('limitado', 'Por tiempo limitado'),
        ('ninguna', 'Ninguna'),
    ]

    titulo = models.CharField(max_length=200)
    titulo_gl = models.CharField(max_length=200, null=True, blank=True)
    precio = models.DecimalField(max_digits=6, decimal_places=2, default=2.50)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True)
    descripcion_gl = models.TextField(null=True, blank=True)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default='ninguna')
    in_trash = models.BooleanField(default=False)
```

**Características especiales:**
- `precio`: Campo decimal que permite a los administradores fijar el precio de cada producto en euros.
- `in_trash`: Implementa un sistema de **Soft Delete** (papelera de reciclaje). Los productos no se eliminan definitivamente, sino que se marcan como "en papelera" y pueden ser restaurados.
- `titulo_gl` / `descripcion_gl`: Se rellenan **automáticamente** al guardar el producto gracias a la librería `deep-translator`:

```python
def save(self, *args, **kwargs):
    if self.titulo and not self.titulo_gl:
        self.titulo_gl = GoogleTranslator(source='es', target='gl').translate(self.titulo)
    if self.descripcion and not self.descripcion_gl:
        self.descripcion_gl = GoogleTranslator(source='es', target='gl').translate(self.descripcion)
    super().save(*args, **kwargs)
```

### Modelo `Cliente`

Almacena los datos personales de cada usuario registrado. Se vincula al sistema nativo de autenticación de Django (`User`) mediante una relación **1:1**.

```python
class Cliente(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    nacionalidad = models.CharField(max_length=50)
    dni = models.CharField(max_length=20, primary_key=True)  # Clave primaria personalizada
    nombre_usuario = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    email = models.EmailField()
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)
    codigo_postal = models.CharField(max_length=10)
```

**Relación `1:1`**: Cada `Cliente` está enlazado exactamente a un `User` de Django. Esto permite utilizar el sistema de autenticación nativo (`login`, `logout`, `authenticate`) y a su vez tener campos extra como `dni`, `direccion` o `nacionalidad`.

### Modelo `Buzon`

Recibe las consultas y sugerencias de los usuarios. Solo accesible para usuarios autenticados. Relación **1:N** (un `User` puede tener muchos mensajes).

```python
class Buzon(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)  # Relación 1:N
    asunto = models.CharField(max_length=200)
    detalle = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
```

### Modelo `Pedido`

Representa una compra realizada. Contiene la relación **N:M** (Muchos a Muchos) con `Producto`. Un pedido puede contener múltiples productos, y un producto puede pertenecer a múltiples pedidos.

```python
class Pedido(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)  # Relación 1:N
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    productos = models.ManyToManyField(Producto, related_name='pedidos', blank=True)  # Relación N:M
```

**Relación `N:M` (ManyToMany):** Django genera automáticamente una tabla intermedia `tienda_pedido_productos` que vincula los IDs de cada pedido con los IDs de sus productos.

---

## 🌐 API REST — Endpoints

La API está construida con **Django REST Framework** y utiliza `Serializers` para transformar los modelos en JSON.

### Serializadores (`serializers.py`)

```python
from rest_framework import serializers
from .models import Producto, Cliente, Buzon, Pedido

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'titulo', 'titulo_gl', 'precio', 'descripcion',
                  'descripcion_gl', 'categoria', 'imagen', 'in_trash']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class BuzonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buzon
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'
```

### Tabla de Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| `POST` | `/api/producto/crear/` | Admin | Crear un nuevo producto |
| `PUT` | `/api/producto/editar/<id>/` | Admin | Editar un producto existente |
| `POST` | `/api/producto/delete/<id>/` | Admin | Enviar producto a la papelera |
| `POST` | `/api/producto/restore/<id>/` | Admin | Restaurar producto de la papelera |
| `DELETE` | `/api/producto/hard_delete/<id>/` | Admin | Eliminación permanente |
| `GET` | `/api/producto/trash_list/` | Admin | Listar productos en la papelera |
| `GET` | `/api/producto/<id>/` | Público | Obtener detalle de un producto |
| `GET` | `/api/traducciones/` | Público | Mapa de traducciones ES/GL |
| `POST` | `/api/translate/` | Público | Traducir texto genérico |
| `PATCH` | `/api/cliente/password/` | Público | Cambiar contraseña de usuario |
| `POST` | `/api/pedido/crear/` | Autenticado | Registrar un pedido en la BBDD |

### Ejemplo: Crear un producto (API)

```python
@api_view(['POST'])
@permission_classes([IsAdminUser])
def api_crear_producto(request):
    serializer = ProductoSerializer(data=request.data)
    if serializer.is_valid():
        producto = serializer.save()
        return Response({
            'status': 'ok',
            'id': producto.id,
            'titulo': producto.titulo,
            'titulo_gl': producto.titulo_gl,
            'categoria': producto.categoria,
        })
    return Response({'status': 'error', 'errors': serializer.errors}, status=400)
```

### Ejemplo: Crear un pedido (Checkout real)

```python
@api_view(['POST'])
def api_crear_pedido(request):
    if not request.user.is_authenticated:
        return Response({'status': 'error', 'msg': 'Debe iniciar sesión'}, status=401)
    
    cart = request.data.get('cart', [])
    total = request.data.get('total', 0)
    
    cliente = Cliente.objects.get(usuario=request.user)
    pedido = Pedido.objects.create(cliente=cliente, total=total)
    
    for item in cart:
        producto_obj = Producto.objects.get(id=item.get('id'))
        pedido.productos.add(producto_obj)  # Relación N:M
    
    return Response({'status': 'ok', 'msg': 'Pedido almacenado correctamente'})
```

---

## Sistema de Autenticación

El sistema ofrece **3 funcionalidades** de autenticación dentro de una misma vista (`Formulario.html`):

### Registro de Usuarios

El formulario de registro recoge todos los campos del modelo `Cliente` y crea simultáneamente un `User` de Django y un `Cliente` vinculado:

```python
# Vista de registro (views.py)
user = User.objects.create_user(username=nombre_usuario, email=email)
user.set_password(password)
user.save()

cliente = Cliente(usuario=user, nombre=nombre, dni=dni, ...)
cliente.save()

login(request, user)  # Inicio de sesión automático tras registro
```

**Validaciones implementadas:**
- Las contraseñas deben coincidir (validación servidor)
- DNI y nombre de usuario deben ser únicos (`IntegrityError`)
- Si hay error, los datos del formulario se conservan (`old_data`) para no tener que rellenarlos de nuevo

### Inicio de Sesión

```python
def iniciar_sesion(request):
    user = authenticate(request, username=login_username, password=password)
    if user is not None:
        login(request, user)
        return redirect('formulario')
    else:
        return render(request, 'tienda/Formulario.html', {
            'login_error': 'Nombre de usuario o contraseña incorrectos.',
            'login_username': login_username  # Conserva el campo
        })
```

### Cambio de Contraseña (API REST)

```python
@api_view(['PATCH'])
def api_cambiar_password(request):
    cliente = Cliente.objects.get(nombre_usuario=nombre_usuario, dni=dni)
    cliente.password = nueva_password
    cliente.save()

    user = cliente.usuario
    user.set_password(nueva_password)
    user.save()
```

---

## Gestión de Productos (Frontend)

Los administradores (`is_staff=True`) pueden gestionar el catálogo directamente desde la web sin necesidad de acceder a `/admin/`.

### Funcionalidades

- **Añadir productos**: Modal con campos para título, precio, imagen, descripción y categoría.
- **Editar productos**: Los datos actuales se pre-cargan en el modal al pulsar el botón de editar.
- **Papelera (Soft Delete)**: Los productos se mueven a una papelera visual desde donde pueden restaurarse o eliminarse definitivamente.
- **Buscador en tiempo real**: Filtrado por nombre sin necesidad de recargar la página.

### JavaScript: Fetch con FormData

```javascript
// Crear un producto (gestion_productos.js)
const res = await fetch('/api/producto/crear/', {
    method: 'POST',
    body: new FormData(formAdd),
    headers: { 'X-CSRFToken': getCookie('csrftoken') }
});
const data = await res.json();
if (data.status === 'ok') {
    grid.prepend(createProductElement(data.producto));
    closeModals();
}
```

### Buscador Predictivo

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

---

## 🛒 Carrito de Compras y Checkout

### Persistencia del Carrito

El carrito utiliza **`sessionStorage`** para que se vacíe automáticamente al cerrar el navegador:

```javascript
// carrito.js
function getCart() {
    const cart = sessionStorage.getItem('doces_e_mecos_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    sessionStorage.setItem('doces_e_mecos_cart', JSON.stringify(cart));
}
```

### Añadir al Carrito (Desde la vista de detalle)

```javascript
addToCartBtn.addEventListener('click', () => {
    const cartItem = {
        id: product.id,
        name: product.titulo,
        price: parseFloat(product.precio),  // Precio real desde la BBDD
        image: product.imagen,               // URL absoluta de la imagen
        quantity: quantity
    };
    addToCart(cartItem);
});
```

### Checkout Real (Pago.html → Django)

Al pulsar **"Pagar Agora"**, el frontend envía todo el carrito al backend mediante `fetch`:

```javascript
const response = await fetch('/api/pedido/crear/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: JSON.stringify({
        cart: cart,    // Array de productos con id, name, price, quantity
        total: total   // Precio total calculado
    })
});
const data = await response.json();
if (data.status === 'ok') {
    sessionStorage.removeItem('doces_e_mecos_cart');  // Vaciar carrito
    // Mostrar mensaje de éxito
}
```

> **Protección**: Si un usuario anónimo intenta acceder a `/pago/`, se le muestra una alerta y se le redirige al formulario de inicio de sesión.

---

## 📬 Sistema de Contacto (Buzón)

La página `/contacta/` permite a los usuarios autenticados enviar sugerencias o reportar errores.

### Comportamiento Condicional

```html
{% if user.is_authenticated %}
    <!-- Muestra el formulario de contacto -->
    <form method="POST" action="{% url 'contacta' %}">
        {% csrf_token %}
        <input type="text" name="asunto" required>
        <textarea name="detalle" rows="6" required></textarea>
        <button type="submit">Enviar Mensaje</button>
    </form>
{% else %}
    <!-- Muestra un mensaje y botón para iniciar sesión -->
    <p>Debes iniciar sesión para poder enviarnos sugerencias.</p>
    <a href="{% url 'formulario' %}">Ir a Iniciar Sesión</a>
{% endif %}
```

### Vista del Backend

```python
def contacta(request):
    if request.method == 'POST' and request.user.is_authenticated:
        asunto = request.POST.get('asunto')
        detalle = request.POST.get('detalle')
        if asunto and detalle:
            Buzon.objects.create(usuario=request.user, asunto=asunto, detalle=detalle)
            success = "Tu consulta ha sido enviada exitosamente."
    return render(request, 'tienda/Contacta.html', {'success': success, 'error': error})
```

---

## Traducción Castellano / Gallego

El sistema soporta cambio de idioma en tiempo real entre Castellano y Gallego.

### Backend: Traducción automática al guardar

Cada vez que se guarda un producto, si los campos gallegos (`titulo_gl`, `descripcion_gl`) están vacíos, se traducen automáticamente usando `deep-translator`:

```python
from deep_translator import GoogleTranslator

# Dentro de Producto.save()
self.titulo_gl = GoogleTranslator(source='es', target='gl').translate(self.titulo)
```

### Frontend: Cambio de idioma dinámico

```javascript
// traductor.js
const translateText = async (text, target) => {
    const res = await fetch('/api/translate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target })
    });
    const data = await res.json();
    return data.translated || text;
};
```

Los botones de bandera (España 🇪🇸 / Galicia) invocan esta función y sustituyen dinámicamente los textos de la interfaz.

---

## ⚙ Panel de Administración de Django

Accesible en `http://127.0.0.1:8000/admin/` con las credenciales del superusuario.

### Modelos Registrados

```python
# admin.py
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'precio', 'categoria', 'in_trash')
    list_filter = ('categoria', 'in_trash')
    search_fields = ('titulo', 'descripcion')

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre_usuario', 'nombre', 'dni', 'email', 'nacionalidad', 'usuario')
    search_fields = ('nombre_usuario', 'nombre', 'dni', 'email')
    list_filter = ('nacionalidad',)

@admin.register(Buzon)
class BuzonAdmin(admin.ModelAdmin):
    list_display = ('asunto', 'usuario', 'fecha_creacion')
    search_fields = ('asunto', 'detalle', 'usuario__username')
    list_filter = ('fecha_creacion',)

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'fecha_pedido', 'total')
    search_fields = ('cliente__nombre_usuario', 'id')
    list_filter = ('fecha_pedido',)
    filter_horizontal = ('productos',)  # Interfaz visual para la relación N:M
```

El panel permite:
- Crear, editar y eliminar productos con sus precios
- Ver los clientes registrados y sus datos
- Leer los mensajes del buzón de contacto
- Revisar los pedidos realizados y sus productos asociados (relación N:M)

---

## Snippets de Código Destacados

### Protección CSRF en Fetch (JavaScript)

Para que Django acepte peticiones `POST` / `PUT` / `DELETE` desde JavaScript, es necesario incluir el token CSRF:

```javascript
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

// Uso en una petición fetch
headers: { 'X-CSRFToken': getCookie('csrftoken') }
```

### Configuración CORS (`settings.py`)

Para permitir peticiones desde cualquier origen en desarrollo:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    'rest_framework',
    'tienda',
]

MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

### Servir archivos Media en desarrollo

Para que las imágenes subidas dinámicamente se visualicen correctamente:

```python
# doces_mecos/urls.py
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('tienda.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

```python
# settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).

---

**Doces & Mecos** — *Doce alegría en cada bocado!*
