from django.db import models
from userauthentication.models import CustomUser
# Create your models here.
from django.db import models
from django.contrib.auth.models import User
# class LeaveType(models.Model):
#     LEAVE_CHOICES = [
#         ('annual', 'Annual Leave'),
#         ('casual', 'Casual Leave'),
#         ('maternity_paternity', 'Maternity/Paternity Leave'),
#         ('sick', 'Sick Leave'),
#     ]
  
#     leave_type = models.CharField(max_length=20, choices=LEAVE_CHOICES, unique=True)
#     max_days_allowed = models.PositiveIntegerField()  # e.g., Annual: 30, Casual: 15, etc.
    
#     def __str__(self):
#         return self.get_leave_type_display()

class EmployeeProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    total_leave_taken = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class EmployeeLeave(models.Model):
    LEAVE_CHOICES = [
        ('annual', 'Annual Leave'),
        ('casual', 'Casual Leave'),
        ('maternity_paternity', 'Maternity/Paternity Leave'),
        ('sick', 'Sick Leave'),
    ]

    LEAVE_ALLOWANCES = {
        'annual': 4,
        'casual': 3,
        'maternity_paternity': 15,
        'sick': 7,
    }
    employee = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=20, choices=LEAVE_CHOICES)
    reason = models.TextField()
    selected_dates = models.JSONField(unique=True)  # Stores multiple dates selected for leave
    total_days = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10, 
        choices=[('approved', 'Approved'), ('rejected', 'Rejected'), ('pending', 'Pending')],
        default='pending'
    )

    def save(self, *args, **kwargs):
        # Automatically calculate total leave days based on selected dates
        self.total_days = len(self.selected_dates)
        super().save(*args, **kwargs)
    @classmethod
    def get_max_days_for_leave_type(cls, leave_type):
        """Fetch the maximum days allowed for a specific leave type."""
        return cls.LEAVE_ALLOWANCES.get(leave_type, 0)
  
    def __str__(self):
        return f"{self.employee.username} - {self.leave_type}"

