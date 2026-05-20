from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from .models import Producto, Cliente
from django.db import IntegrityError
from django.contrib.auth.models import User
import json
from deep_translator import GoogleTranslator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductoSerializer

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
    return render(request, 'tienda/Pago.html')

def formulario(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        nacionalidad = request.POST.get('nacionalidad')
        apellidos = request.POST.get('apellidos')
        dni = request.POST.get('dni')
        email = request.POST.get('email')
        direccion = request.POST.get('direccion')
        telefono = request.POST.get('telefono')
        codigo_postal = request.POST.get('codigo_postal')

        try:
            # Create Django User
            user = User.objects.create_user(username=dni, email=email)
            user.set_unusable_password()
            user.save()

            cliente = Cliente(
                usuario=user,
                nombre=nombre,
                apellidos=apellidos,
                nacionalidad=nacionalidad,
                dni=dni,
                email=email,
                direccion=direccion,
                telefono=telefono,
                codigo_postal=codigo_postal
            )
            cliente.save()
            # Manda que todo esta correcto al HTML
            return render(request, 'tienda/Formulario.html', {'success': True})
        except IntegrityError:
            # Maneja que no haya duplicidades en el DNI
            return render(request, 'tienda/Formulario.html', {
                'error': 'Ya existe una cuenta registrada con este DNI.'
            })
            
    return render(request, 'tienda/Formulario.html')

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

@api_view(['POST'])
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
        return Response({'status': 'ok', 'success': True})
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

@api_view(['POST'])
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
