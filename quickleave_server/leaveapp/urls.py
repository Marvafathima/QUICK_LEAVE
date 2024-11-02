from django.urls import path
from .views import LeaveApplicationView,ManagerPendingLeavesView,PendingLeaveDetailView\
    ,FetchAllRejectedLeaves,FetchAllApprovedLeaves,PendingLeavesView,RejectedLeavesView,ApprovedLeavesView\
    ,EmployeeLeaveStatsView

urlpatterns = [
 path('leave/apply', LeaveApplicationView.as_view(), name='leave_apply'),
 path("leave/pending/requests",ManagerPendingLeavesView.as_view(),name="pending_requests"),
 path("leave/pending/request/<int:leave_id>",PendingLeaveDetailView.as_view()),
 path("rejected/leave",FetchAllRejectedLeaves.as_view()),
 path("approved/leave",FetchAllApprovedLeaves.as_view()),
path("mypending/leave",PendingLeavesView.as_view()),
path("myapproved/leave",ApprovedLeavesView.as_view()),
path("myrejected/leave",RejectedLeavesView.as_view()),
path("employee_leave_stats",EmployeeLeaveStatsView.as_view())
]