from rest_framework import permissions

class Permissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_staff or request.user.is_superuser:
            return True

        allowed_actions = ['by_matricule', 'generate_badge']

        if view.action in allowed_actions:
            return True

        return False