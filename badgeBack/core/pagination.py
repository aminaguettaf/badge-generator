from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

# Pagination personnalisé 
class StandardResultsSetPagination(PageNumberPagination):
    # Nbre d'élements par défaut dans chaque page
    page_size = 10
    # Permet de spécifier le nbre d'éléments désirer
    page_size_query_param = 'page_size'
    # Empecher de demander plus de 100 éléments par page
    max_page_size = 100
    # Personnalisation
    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'Données récupérées avec succès',
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'data': data
        })