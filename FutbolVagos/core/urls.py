from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, SedeViewSet, CanchaViewSet, ReservacionViewSet, FacturaViewSet, TrabajadorViewSet

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'sedes', SedeViewSet)
router.register(r'canchas', CanchaViewSet)
router.register(r'reservaciones', ReservacionViewSet)
router.register(r'facturas', FacturaViewSet)
router.register(r'trabajadores', TrabajadorViewSet)

urlpatterns = router.urls