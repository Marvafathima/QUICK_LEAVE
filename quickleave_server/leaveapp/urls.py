from django.urls import path
from .views import LeaveApplicationView

urlpatterns = [
 path('leave/apply', LeaveApplicationView.as_view(), name='leave_apply'),

]