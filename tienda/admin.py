from django.contrib import admin
from .models import Producto, Cliente, Buzon

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'in_trash')
    list_filter = ('categoria', 'in_trash')
    search_fields = ('titulo', 'descripcion')
    
    fieldsets = (
        ('Información General', {
            'fields': ('titulo', 'titulo_gl', 'descripcion', 'descripcion_gl', 'categoria', 'imagen', 'in_trash')
        }),
    )

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
