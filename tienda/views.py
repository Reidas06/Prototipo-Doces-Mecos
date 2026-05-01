from django.shortcuts import render
from .models import Producto

def inicio(request):
    return render(request, 'tienda/Principal.html')

def productos(request):
    ofertas = Producto.objects.filter(categoria='ofertas')
    vendidos = Producto.objects.filter(categoria='vendido')
    limitado = Producto.objects.filter(categoria='limitado')
    
    context = {
        'ofertas': ofertas,
        'vendidos': vendidos,
        'limitado': limitado,
    }
    return render(request, 'tienda/Productos.html', context)

def descripcion(request):
    return render(request, 'tienda/Descripcion.html')

def carrito(request):
    return render(request, 'tienda/Carrito.html')

def pago(request):
    return render(request, 'tienda/Pago.html')

def formulario(request):
    return render(request, 'tienda/Formulario.html')
