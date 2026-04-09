from django.shortcuts import render

def inicio(request):
    return render(request, 'tienda/Principal.html')

def productos(request):
    return render(request, 'tienda/Productos.html')

def descripcion(request):
    return render(request, 'tienda/Descripcion.html')

def carrito(request):
    return render(request, 'tienda/Carrito.html')

def pago(request):
    return render(request, 'tienda/Pago.html')

def formulario(request):
    return render(request, 'tienda/Formulario.html')
