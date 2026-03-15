from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeesViewSet

router = DefaultRouter()
router.register(r'employees', EmployeesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]