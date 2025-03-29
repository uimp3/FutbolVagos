from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, SedeViewSet, CanchaViewSet, HorarioViewSet, ReservacionViewSet, FacturaViewSet

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'sedes', SedeViewSet)
router.register(r'canchas', CanchaViewSet)
router.register(r'horarios', HorarioViewSet)
router.register(r'reservaciones', ReservacionViewSet)
router.register(r'facturas', FacturaViewSet)

urlpatterns = router.urls