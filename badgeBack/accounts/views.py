from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    def get(self, request):
        return Response({'message': 'CSRF cookie set'})

class LoginView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return Response({'error': 'Nom d\'utilisateur et mot de passe requis'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            request.session['last_activity'] = timezone.now().timestamp()
            request.session['login_time'] = timezone.now().timestamp()
            return Response({'message': 'Connexion réussie', 'user': {'id': user.id, 'username': user.username, 'email': user.email, 'is_staff': user.is_staff}})

        else:
            return Response({'error': 'Nom d\'utilisateur ou mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)

class UserView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            last_activity = request.session.get('last_activity')
            remaining_time = None
            
            if last_activity:
                now = timezone.now().timestamp()
                elapsed = now - last_activity
                remaining_time = max(0, 1800 - elapsed)
            
            return Response({'user': {'id': request.user.id, 'username': request.user.username, 'email': request.user.email, 'is_staff': request.user.is_staff}, 'session_remaining': remaining_time})
        else:
            return Response({'error': 'Non authentifié'}, status=401)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Déconnexion réussie'})