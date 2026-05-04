from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Producto
import json
from deep_translator import GoogleTranslator

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
    return render(request, 'tienda/Formulario.html')

# --- API PRODUCTOS ---

def api_crear_producto(request):
    if request.method == 'POST':
        titulo = request.POST.get('titulo', '')
        descripcion = request.POST.get('descripcion', '')
        categoria = request.POST.get('categoria', 'ninguna')
        imagen = request.FILES.get('imagen', None)
        
        producto = Producto(
            titulo=titulo,
            descripcion=descripcion,
            categoria=categoria,
        )
        if imagen:
            producto.imagen = imagen
        producto.save()
        
        return JsonResponse({
            'status': 'ok',
            'id': producto.id,
            'titulo': producto.titulo,
            'categoria': producto.categoria,
        })
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def api_producto_editar(request, pk):
    if request.method == 'POST':
        try:
            producto = Producto.objects.get(pk=pk)
            # Manejamos tanto FormData como JSON
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                producto.titulo = data.get('titulo', producto.titulo)
                producto.descripcion = data.get('descripcion', producto.descripcion)
                producto.categoria = data.get('categoria', producto.categoria)
            else:
                producto.titulo = request.POST.get('titulo', producto.titulo)
                producto.descripcion = request.POST.get('descripcion', producto.descripcion)
                producto.categoria = request.POST.get('categoria', producto.categoria)
                if 'imagen' in request.FILES:
                    producto.imagen = request.FILES['imagen']
            
            producto.save()
            return JsonResponse({'status': 'ok', 'success': True})
        except Producto.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def api_producto_soft_delete(request, pk):
    """Envía el producto a la papelera."""
    if request.method == 'POST':
        try:
            producto = Producto.objects.get(pk=pk)
            producto.in_trash = True
            producto.save()
            return JsonResponse({'status': 'ok', 'success': True})
        except Producto.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def api_producto_restore(request, pk):
    """Restaura el producto de la papelera."""
    if request.method == 'POST':
        try:
            producto = Producto.objects.get(pk=pk)
            producto.in_trash = False
            producto.save()
            return JsonResponse({'status': 'ok', 'success': True})
        except Producto.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def api_producto_hard_delete(request, pk):
    """Elimina permanentemente el producto."""
    if request.method == 'POST':
        try:
            producto = Producto.objects.get(pk=pk)
            producto.delete()
            return JsonResponse({'status': 'ok', 'success': True})
        except Producto.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

def api_producto_trash_list(request):
    """Devuelve la lista de productos en la papelera."""
    productos_trash = Producto.objects.filter(in_trash=True)
    results = []
    for p in productos_trash:
        results.append({
            'id': p.id,
            'titulo': p.titulo,
            'imagen': p.imagen.url if p.imagen else None,
            'categoria': p.categoria,
        })
    return JsonResponse({'results': results, 'success': True})

def api_producto_detalle(request, pk):
    """Devuelve los detalles de un producto específico."""
    producto = get_object_or_404(Producto, pk=pk)
    return JsonResponse({
        'id': producto.id,
        'titulo': producto.titulo,
        'descripcion': producto.descripcion,
        'categoria': producto.categoria,
        'imagen': producto.imagen.url if producto.imagen else None,
        'in_trash': producto.in_trash
    })

@csrf_exempt
def api_translate(request):
    """API para traducir texto entre Castellano y Gallego."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text')
            target_lang = data.get('target', 'gl') # 'gl' para gallego, 'es' para castellano
            
            if not text:
                return JsonResponse({'status': 'error', 'message': 'No text provided'}, status=400)
            
            translated = GoogleTranslator(source='auto', target=target_lang).translate(text)
            return JsonResponse({'status': 'ok', 'translated': translated})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)
