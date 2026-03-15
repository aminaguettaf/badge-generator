import os
import traceback 
from django.conf import settings
from docxtpl import DocxTemplate, InlineImage, RichText
from docx.shared import Mm
from rest_framework import status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import HttpResponse
from django.utils import timezone
from django.db.models import Q
from core.views import BaseViewSet
from rest_framework.permissions import IsAuthenticated
from core.permissions import Permissions
from .serializers import EmployeesSerializer
from .models import Employees


class EmployeesViewSet(BaseViewSet):
    queryset = Employees.objects.all().order_by('-updated_at')
    serializer_class = EmployeesSerializer

    permission_classes = [IsAuthenticated, Permissions]

    search_fields = ['first_name', 'last_name', 'old_matricule', 'new_matricule', 'ssn', 'function']

    @action(detail=False, methods=['get'], url_path=r'by-matricule/(?P<matricule>[^/.]+)')
    def by_matricule(self, request, matricule=None):
        try:
            employee = Employees.objects.get(Q(new_matricule=matricule) | Q(old_matricule=matricule))
            serializer = self.get_serializer(employee)

            return Response({ 'success': True, 'data': serializer.data }, status=status.HTTP_200_OK)
            
        except Employees.DoesNotExist:
            return Response({ 'success': False, 'message': 'Employé non trouvé avec ce matricule.' }, status=status.HTTP_404_NOT_FOUND)

    
    @action(detail=False, methods=['get', 'post'], url_path=r'generate-badge/(?P<matricule>[^/.]+)')
    def generate_badge(self, request, matricule=None):
        try:
            employee = Employees.objects.get(Q(new_matricule=matricule) | Q(old_matricule=matricule))

            if request.method == 'POST' and request.FILES.get('photo'):
                employee.photo = request.FILES['photo']
                employee.save()

            template_path = os.path.join(settings.BASE_DIR, 'core', 'templates', 'core', 'badge_template.docx')

            doc = DocxTemplate(template_path)
            slash_color = '000000'

            try:
                category = int(employee.category) if employee.category else 0
                
                if category < 16:
                    slash_color = 'FFFF00'  
                elif 16 <= category <= 20:
                    slash_color = 'FF0000'  
                elif category > 20:
                    slash_color = '000000'
            except (ValueError, TypeError):
                pass

            colored_slashes = RichText('//', color=slash_color, bold=True)

            context = {
                'name': employee.last_name.upper() if employee.last_name else "",
                'l_name': employee.first_name.upper() if employee.first_name else "",
                'function': employee.function.upper() if employee.function else "",
                'department': employee.department.upper() if employee.department else "",
                'matricule': employee.new_matricule.upper() if employee.new_matricule else "", 
                's': employee.blood_type.upper() if employee.blood_type else "",  
                'ssn':  employee.ssn if employee.ssn else "",
                'slashes': colored_slashes,
            }

            if employee.photo:
                image = InlineImage(doc, employee.photo.path, width=Mm(18), height=Mm(25)) 
                context['photo'] = image
            else:
                context['photo'] = ""

            doc.render(context)

            response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            response['Content-Disposition'] = f'attachment; filename="Badge_{employee.new_matricule}.docx"'

            doc.save(response)
            return response

        except Employees.DoesNotExist:
            return Response({'success': False, 'message': 'Employé non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            traceback.print_exc()
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  