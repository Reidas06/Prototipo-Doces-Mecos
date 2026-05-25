from rest_framework import serializers
from .models import Producto, Cliente, Buzon, Pedido

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'titulo', 'titulo_gl', 'precio', 'descripcion', 'descripcion_gl', 'categoria', 'imagen', 'in_trash']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class BuzonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buzon
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'
