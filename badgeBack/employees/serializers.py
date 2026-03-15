from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Employees

class EmployeesSerializer(serializers.ModelSerializer):
    old_matricule = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True, validators=[UniqueValidator(queryset=Employees.objects.all(), message="Un employé avec ce matricule existe déjà")])
    new_matricule = serializers.CharField(max_length=50, validators=[UniqueValidator(queryset=Employees.objects.all(), message="Un employé avec ce matricule existe déjà")])
    ssn = serializers.CharField(max_length=50, validators=[UniqueValidator(queryset=Employees.objects.all(), message="Un employé avec ce NSS existe déjà")])
    class Meta:
        model = Employees
        fields = '__all__'
        ordering = ['-updated_at']
