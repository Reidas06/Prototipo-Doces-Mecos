from django.db import models
from deep_translator import GoogleTranslator
from django.contrib.auth.models import User

class Producto(models.Model):
    CATEGORIAS = [
        ('ofertas', 'Ofertas'),
        ('vendido', 'Lo más vendido'),
        ('limitado', 'Por tiempo limitado'),
        ('ninguna', 'Ninguna'),
    ]

    titulo = models.CharField(max_length=200)
    titulo_gl = models.CharField(max_length=200, null=True, blank=True)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True)
    descripcion_gl = models.TextField(null=True, blank=True)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default='ninguna')
    in_trash = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Traducción automática del título si está vacío
        if self.titulo and not self.titulo_gl:
            try:
                self.titulo_gl = GoogleTranslator(source='es', target='gl').translate(self.titulo)
            except Exception as e:
                print(f"Error traduciendo título: {e}")
        
        # Traducción automática de la descripción si está vacía
        if self.descripcion and not self.descripcion_gl:
            try:
                self.descripcion_gl = GoogleTranslator(source='es', target='gl').translate(self.descripcion)
            except Exception as e:
                print(f"Error traduciendo descripción: {e}")
                
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titulo


class Cliente(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    nacionalidad = models.CharField(max_length=50)
    dni = models.CharField(max_length=20, primary_key=True)
    nombre_usuario = models.CharField(max_length=150, unique=True, default="usuario_generico")
    password = models.CharField(max_length=128, default="")
    email = models.EmailField()
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)
    codigo_postal = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.nombre_usuario} - {self.nombre} ({self.dni})"

class Buzon(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    asunto = models.CharField(max_length=200)
    detalle = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.asunto} - {self.usuario.username}"
