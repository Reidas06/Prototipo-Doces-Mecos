from django.db import models

class Producto(models.Model):
    CATEGORIAS_CHOICES = [
        ('ofertas', 'Ofertas'),
        ('limitado', 'Por tiempo limitado'),
        ('vendido', 'Lo mas vendido'),
        ('ninguna', 'Ninguna'),
    ]
    titulo = models.CharField(max_length=200)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    descripcion = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS_CHOICES, default='ninguna')

    def __str__(self):
        return self.titulo
