from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, SedeViewSet, CanchaViewSet, ReservacionViewSet, FacturaViewSet, TrabajadorViewSet
from django.urls import path, include

#Importaciones para swagger
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Variable que es resultado de la función get_schema_view
# que genera la vista de la documentación de la API
schema_view = get_schema_view(
   openapi.Info(
      title="Documentacion API",
      default_version='v0.1',
      description="Documentacion API de Futbol Vagos, un sistema de reservas de canchas de futbol",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="futbolvagos@gmail.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'sedes', SedeViewSet)
router.register(r'canchas', CanchaViewSet)
router.register(r'reservaciones', ReservacionViewSet)
router.register(r'facturas', FacturaViewSet)
router.register(r'trabajadores', TrabajadorViewSet)

urlpatterns = [
    path('', include(router.urls)), # Incluye las rutas de la API REST
    path('reservaciones/by_cliente/<int:cliente_id>/', ReservacionViewSet.as_view({'get': 'list_by_cliente'}), name='reservaciones-by-cliente'),
    path('reservaciones/by_cancha_fecha/', ReservacionViewSet.as_view({'get': 'list_by_cancha_fecha'}), name='reservaciones-by-cancha-fecha'),
    # Swagger URLs
    re_path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

