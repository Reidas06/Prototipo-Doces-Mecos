from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('productos/', views.productos, name='productos'),
    path('productos/todos/', views.todos_productos, name='todos_productos'),
    path('descripcion/', views.descripcion, name='descripcion'),
    path('carrito/', views.carrito, name='carrito'),
    path('pago/', views.pago, name='pago'),
    path('formulario/', views.formulario, name='formulario'),
    
    # API PRODUCTOS (Estilo Arrivelo)
    path('api/producto/crear/', views.api_crear_producto, name='api_crear_producto'),
    path('api/producto/editar/<int:pk>/', views.api_producto_editar, name='api_producto_editar'),
    path('api/producto/delete/<int:pk>/', views.api_producto_soft_delete, name='api_producto_delete'),
    path('api/producto/restore/<int:pk>/', views.api_producto_restore, name='api_producto_restore'),
    path('api/producto/hard_delete/<int:pk>/', views.api_producto_hard_delete, name='api_producto_hard_delete'),
    path('api/producto/trash_list/', views.api_producto_trash_list, name='api_producto_trash_list'),
]
