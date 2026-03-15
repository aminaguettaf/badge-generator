from django.urls import path
from . import views

urlpatterns = [
    path('sanctum/csrf-cookie/', views.GetCSRFToken.as_view(), name='csrf-cookie'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('user/', views.UserView.as_view(), name='user'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
]