from django.urls import path
from .views import LeaveApplicationView,ManagerPendingLeavesView,PendingLeaveDetailView

urlpatterns = [
 path('leave/apply', LeaveApplicationView.as_view(), name='leave_apply'),
 path("leave/pending/requests",ManagerPendingLeavesView.as_view(),name="pending_requests"),
 path("leave/pending/request/<int:leave_id>",PendingLeaveDetailView.as_view()),

]