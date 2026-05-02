from django.db import models

class Producto(models.Model):
    CATEGORIAS = [
        ('ofertas', 'Ofertas'),
        ('vendido', 'Lo más vendido'),
        ('limitado', 'Por tiempo limitado'),
        ('ninguna', 'Ninguna'),
    ]

    titulo = models.CharField(max_length=200)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default='ninguna')
    in_trash = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo
