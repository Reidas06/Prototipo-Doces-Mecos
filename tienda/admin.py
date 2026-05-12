from django.contrib import admin
from .models import Producto

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
