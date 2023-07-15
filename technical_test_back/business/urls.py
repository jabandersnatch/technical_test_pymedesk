from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, OrderViewSet, OrderItemViewSet, ProductViewSet, summary

router = DefaultRouter()
router.register(r'usuario', CustomerViewSet)
router.register(r'pedido', OrderViewSet)
router.register(r'producto', ProductViewSet)
router.register(r'pedido_productos', OrderItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('resumen/', summary),
]


