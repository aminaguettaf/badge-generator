from django.db import models
from core.models import TimestampedModel

class Employees(TimestampedModel):
    BLOOD_TYPE_CHOICES = [
        ('AP', 'AP'),
        ('AN', 'AN'),
        ('BP', 'BP'),
        ('BN', 'BN'),
        ('ABP', 'ABP'),
        ('ABN', 'ABN'),
        ('OP', 'OP'),
        ('ON', 'ON'),
    ]

    old_matricule = models.CharField(max_length=50, unique=True, null=True, blank=True)
    new_matricule = models.CharField(max_length=50, unique=True)
    ssn = models.CharField(max_length=30, unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100) 
    function = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    blood_type = models.CharField(max_length=5, choices=BLOOD_TYPE_CHOICES, null=True, blank=True)
    category = models.IntegerField(default=20)
    photo = models.ImageField(upload_to='employee_photos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.new_matricule} - {self.first_name} {self.last_name}"
