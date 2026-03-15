from django.utils import timezone
from django.contrib.auth import logout
from django.http import JsonResponse


class SessionTimeoutMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            last_activity = request.session.get('last_activity')
            now = timezone.now().timestamp()

            if last_activity:
                inactive_time = now - last_activity
                
                if inactive_time > 1800:
                    logout(request)
                    request.session.flush()

                    return JsonResponse({'error': 'Session expirée pour inactivité', 'code': 'SESSION_EXPIRED'}, status=401)
            
            request.session['last_activity'] = now

        return self.get_response(request)