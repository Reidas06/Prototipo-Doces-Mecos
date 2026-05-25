from django.shortcuts import render, get_object_or_404, redirect
from .models import Producto, Cliente, Buzon, Pedido
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from .models import Producto, Cliente, Buzon
from django.db import IntegrityError
from django.contrib.auth.models import User
import json
from deep_translator import GoogleTranslator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductoSerializer
from django.contrib.auth import authenticate, login, logout

def inicio(request):
    return render(request, 'tienda/Principal.html')

def productos(request):
    # Solo mostramos productos que NO estén en la papelera
    ofertas = Producto.objects.filter(categoria='ofertas', in_trash=False)
    vendidos = Producto.objects.filter(categoria='vendido', in_trash=False)
    limitado = Producto.objects.filter(categoria='limitado', in_trash=False)
    
    context = {
        'ofertas': ofertas,
        'vendidos': vendidos,
        'limitado': limitado,
    }
    return render(request, 'tienda/Productos.html', context)

def todos_productos(request):
    # Solo mostramos productos que NO estén en la papelera
    productos_lista = Producto.objects.filter(in_trash=False)
    return render(request, 'tienda/TodosProductos.html', {'productos': productos_lista})

def descripcion(request):
    return render(request, 'tienda/Descripcion.html')

def carrito(request):
    return render(request, 'tienda/Carrito.html')

def pago(request):
    if not request.user.is_authenticated:
        return render(request, 'tienda/Pago.html', {'auth_required': True})
    return render(request, 'tienda/Pago.html')

def formulario(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        nombre_usuario = request.POST.get('nombre_usuario')
        nacionalidad = request.POST.get('nacionalidad')
        dni = request.POST.get('dni')
        email = request.POST.get('email')
        direccion = request.POST.get('direccion')
        telefono = request.POST.get('telefono')
        codigo_postal = request.POST.get('codigo_postal')
        password = request.POST.get('password')
        repeat_password = request.POST.get('repeat_password')

        if not password or password != repeat_password:
            return render(request, 'tienda/Formulario.html', {
                'error': 'Las contraseñas no coinciden o están vacías.',
                'old_data': request.POST
            })

        try:
            # Create Django User
            user = User.objects.create_user(username=nombre_usuario, email=email)
            user.set_password(password)
            user.save()

            cliente = Cliente(
                usuario=user,
                nombre=nombre,
                nacionalidad=nacionalidad,
                dni=dni,
                nombre_usuario=nombre_usuario,
                password=password,
                email=email,
                direccion=direccion,
                telefono=telefono,
                codigo_postal=codigo_postal
            )
            cliente.save()
            
            # Iniciar sesión automáticamente
            login(request, user)
            
            # Manda que todo esta correcto al HTML
            return render(request, 'tienda/Formulario.html', {'success': '¡Cuenta creada y sesión iniciada exitosamente!'})
        except IntegrityError:
            # Maneja que no haya duplicidades
            return render(request, 'tienda/Formulario.html', {
                'error': 'Ya existe una cuenta con este DNI o Nombre de Usuario.',
                'old_data': request.POST
            })
            
    return render(request, 'tienda/Formulario.html')

def iniciar_sesion(request):
    if request.method == 'POST':
        login_username = request.POST.get('login_username')
        password = request.POST.get('login_password')
        user = authenticate(request, username=login_username, password=password)
        if user is not None:
            login(request, user)
            return redirect('formulario')
        else:
            return render(request, 'tienda/Formulario.html', {
                'login_error': 'Nombre de usuario o contraseña incorrectos.',
                'login_username': login_username
            })
    return redirect('formulario')

def cerrar_sesion(request):
    logout(request)
    return redirect('formulario')

def contacta(request):
    success = None
    error = None
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('formulario')

        asunto = request.POST.get('asunto')
        detalle = request.POST.get('detalle')

        if asunto and detalle:
            Buzon.objects.create(usuario=request.user, asunto=asunto, detalle=detalle)
            success = "Tu consulta ha sido enviada exitosamente. ¡Nos pondremos en contacto contigo pronto!"
        else:
            error = "Por favor, completa todos los campos."
            
    return render(request, 'tienda/Contacta.html', {'success': success, 'error': error})

# --- API PRODUCTOS ---

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
    return Response({'status': 'error', 'message': 'Datos inválidos', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def api_producto_editar(request, pk):
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response({'status': 'error', 'message': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
    # 'partial=True' permite actualizaciones parciales de los campos
    serializer = ProductoSerializer(producto, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        # actualizar la imagen y los textos sin recargar la página.
        return Response({
            'status': 'ok', 
            'success': True,
            'producto': serializer.data
        })
    return Response({'status': 'error', 'message': 'Datos inválidos', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def api_producto_soft_delete(request, pk):
    """Envía el producto a la papelera."""
    try:
        producto = Producto.objects.get(pk=pk)
        producto.in_trash = True
        producto.save()
        return Response({'status': 'ok', 'success': True})
    except Producto.DoesNotExist:
        return Response({'status': 'error', 'message': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def api_producto_restore(request, pk):
    """Restaura el producto de la papelera."""
    try:
        producto = Producto.objects.get(pk=pk)
        producto.in_trash = False
        producto.save()
        return Response({'status': 'ok', 'success': True})
    except Producto.DoesNotExist:
        return Response({'status': 'error', 'message': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def api_producto_hard_delete(request, pk):
    """Elimina permanentemente el producto."""
    try:
        producto = Producto.objects.get(pk=pk)
        producto.delete()
        return Response({'status': 'ok', 'success': True})
    except Producto.DoesNotExist:
        return Response({'status': 'error', 'message': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def api_producto_trash_list(request):
    """Devuelve la lista de productos en la papelera."""
    productos_trash = Producto.objects.filter(in_trash=True)
    # Mantenemos el formato exacto devuelto por la API anterior para no romper el frontend
    results = []
    for p in productos_trash:
        results.append({
            'id': p.id,
            'titulo': p.titulo,
            'titulo_gl': p.titulo_gl,
            'imagen': p.imagen.url if p.imagen else None,
            'categoria': p.categoria,
        })
    return Response({'results': results, 'success': True})

@api_view(['GET'])
@permission_classes([AllowAny])
def api_producto_detalle(request, pk):
    """Devuelve los detalles de un producto específico."""
    try:
        producto = Producto.objects.get(pk=pk)
        serializer = ProductoSerializer(producto)
        return Response(serializer.data)
    except Producto.DoesNotExist:
        return Response({'status': 'error', 'message': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_productos_traducciones(request):
    """Devuelve un mapa de traducciones para todos los productos activos."""
    productos = Producto.objects.filter(in_trash=False)
    traducciones = {}
    for p in productos:
        traducciones[str(p.id)] = {
            'titulo_gl': p.titulo_gl or p.titulo,
            'descripcion_gl': p.descripcion_gl or p.descripcion,
            'titulo_es': p.titulo,
            'descripcion_es': p.descripcion
        }
    return Response({'traducciones': traducciones})

@api_view(['POST'])
@permission_classes([AllowAny])
def api_translate(request):
    """API para traducir texto genérico."""
    try:
        text = request.data.get('text')
        target_lang = request.data.get('target', 'gl')
        
        if not text:
            return Response({'status': 'error', 'message': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        translated = GoogleTranslator(source='auto', target=target_lang).translate(text)
        return Response({'status': 'ok', 'translated': translated})
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- API CLIENTES ---

@api_view(['PATCH'])
@permission_classes([AllowAny])
def api_cambiar_password(request):
    nombre_usuario = request.data.get('nombre_usuario')
    dni = request.data.get('dni')
    nueva_password = request.data.get('nueva_password')
    repetir_password = request.data.get('repetir_password')

    if not all([nombre_usuario, dni, nueva_password, repetir_password]):
        return Response({'status': 'error', 'msg': 'Faltan datos obligatorios.'}, status=status.HTTP_400_BAD_REQUEST)

    if nueva_password != repetir_password:
        return Response({'status': 'error', 'msg': 'Las contraseñas no coinciden.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cliente = Cliente.objects.get(nombre_usuario=nombre_usuario, dni=dni)
        # Update custom Cliente password
        cliente.password = nueva_password
        cliente.save()

        # Update Django User password
        user = cliente.usuario
        if user:
            user.set_password(nueva_password)
            user.save()

        return Response({'status': 'ok', 'msg': 'Contraseña actualizada de manera exitosa.'}, status=status.HTTP_200_OK)
    except Cliente.DoesNotExist:
        return Response({'status': 'error', 'msg': 'El usuario o DNI proporcionado no es correcto.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def api_crear_pedido(request):
    if not request.user.is_authenticated:
        return Response({'status': 'error', 'msg': 'Debe iniciar sesión para realizar pedidos'}, status=status.HTTP_401_UNAUTHORIZED)
        
    try:
        cart = request.data.get('cart', [])
        total = request.data.get('total', 0)
        
        if not cart:
            return Response({'status': 'error', 'msg': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)

        # Conectar con el Cliente (registrado en formulario)
        cliente = Cliente.objects.get(usuario=request.user)
        
        # Guardar en base de datos el objeto genérico Pedido
        pedido = Pedido.objects.create(cliente=cliente, total=total)
        
        # Iterar los productos insertados y rellenar relacción N:M
        for item in cart:
            prod_id = item.get('id')
            if prod_id:
                try:
                    producto_obj = Producto.objects.get(id=prod_id)
                    pedido.productos.add(producto_obj)
                except Producto.DoesNotExist:
                    continue # Omite items que han sido borrados de tienda temporalmente
                    
        return Response({'status': 'ok', 'msg': 'Pedido almacenado correctamente en base de datos'})

    except Cliente.DoesNotExist:
        return Response({'status': 'error', 'msg': 'No se encontró el perfil de cliente asociado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'status': 'error', 'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
