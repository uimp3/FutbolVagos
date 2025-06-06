from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, SedeViewSet, CanchaViewSet, ReservacionViewSet, FacturaViewSet, TrabajadorViewSet, check_auth_and_redirect
from django.urls import path, include

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'sedes', SedeViewSet)
router.register(r'canchas', CanchaViewSet)
router.register(r'reservaciones', ReservacionViewSet)
router.register(r'facturas', FacturaViewSet)
router.register(r'trabajadores', TrabajadorViewSet)

urlpatterns = [
    path('', include(router.urls)), # Incluye las rutas de la API REST
    path('futbolvagos/', check_auth_and_redirect, name='auth-redirect'),  # Nueva ruta para la redirección de autenticación
    # Swagger URLs
    re_path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] 