from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from .pagination import StandardResultsSetPagination

class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    # Récuperer une liste
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        all_flag = request.query_params.get('all')
        if all_flag is not None and all_flag.lower() == 'true':
            serializer = self.get_serializer(queryset, many=True)
            return Response({'success': True, 'data': serializer.data, 'message': 'Données récupérées avec succès'})

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data, 'message': 'Données récupérées avec succès'})

    # Ajout d'un élément 
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'success': True, 'message': 'Ajout effectué avec succès', 'data': serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

    # Détail d'un élément
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({'success': True, 'data': serializer.data})

    # Modification 
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        response = super().update(request, *args, **kwargs)
        return Response({'success': True, 'message': 'Modification effectuée avec succès', 'data': response.data})
    
    # Suppression
    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({'success': True, 'message': 'Suppression effectuée avec succès'}, status=status.HTTP_200_OK)