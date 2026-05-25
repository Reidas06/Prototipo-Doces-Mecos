from django.contrib import admin
from .models import Producto, Cliente, Buzon, Pedido

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
    filter_horizontal = ('productos',)
