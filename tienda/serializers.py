from rest_framework import serializers
from .models import Producto, Cliente

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'titulo', 'titulo_gl', 'descripcion', 'descripcion_gl', 'categoria', 'imagen', 'in_trash']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
