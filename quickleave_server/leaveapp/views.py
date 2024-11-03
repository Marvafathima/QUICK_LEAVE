
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction
from .serializers import LeaveApplicationSerializer
from .models import EmployeeLeave
from .serializers import ManagerLeaveRequestSerializer,EmployeeLeaveSerializer
from django.db.models import Q
from django.utils import timezone
import logging
from rest_framework.views import APIView 
from django.db.models import Sum
logger = logging.getLogger(__name__)
class LeaveApplicationView(generics.CreateAPIView):
    serializer_class = LeaveApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, 
            context={'request': request}
        )
        
        try:
            with transaction.atomic():
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                
                return Response({
                    'success': True,
                    'message': 'Leave application submitted successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
                    
        except ValidationError as e:
            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ManagerPendingLeavesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Get all pending leave requests for the manager.
        Returns leave requests that are in 'pending' status.
        """
        try:
            logger.info(f"Fetching pending leave requests for manager: {request.user.username}")
            
            # Get current date
            current_date = timezone.now().date()
            
            pending_leaves = EmployeeLeave.objects.filter(
                status='pending'
            ).select_related('employee').order_by('-created_at')
            
            # Serialize the data
            serializer = ManagerLeaveRequestSerializer(pending_leaves, many=True)
            
            logger.info(f"Found {len(serializer.data)} pending leave requests")
            
            return Response({
                'status': 'success',
                'message': 'Pending leave requests retrieved successfully',
                'data': {
                    'total_requests': len(serializer.data),
                    'requests': serializer.data
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching pending leave requests: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching pending leave requests'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PendingLeaveDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, leave_id):
        """
        Get detailed information about a specific pending leave request
        """
        try:
            logger.info(f"Fetching details for leave request ID: {leave_id}")
            
           
            leave_request = EmployeeLeave.objects.filter(
                id=leave_id
            ).select_related('employee').first()
            if not leave_request:
                logger.warning(f"Leave request not found or access denied. ID: {leave_id}")
                return Response({
                    'status': 'error',
                    'message': 'Leave request not found or access denied'
                }, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ManagerLeaveRequestSerializer(leave_request)
            
            # Get additional information about employee's leave history
            employee = leave_request.employee
            leave_type = leave_request.leave_type
            
            # Get total leaves taken of this type in current year
            start_of_year = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0)
            leaves_taken = EmployeeLeave.objects.filter(
                employee=employee,
                leave_type=leave_type,
                status='approved',
                created_at__gte=start_of_year
            ).aggregate(total_days=Sum('total_days'))['total_days'] or 0
            print("\n\n\n\n\n\n\n\n",serializer.data)
            # Get leave balance
            max_allowed = EmployeeLeave.get_max_days_for_leave_type(leave_type)
            remaining_balance = max_allowed - leaves_taken
            
            return Response({
                'status': 'success',
                'data': {
                    'leave_request': serializer.data,
                    'employee_info': {
                        'total_leaves_taken': leaves_taken,
                        'leave_balance': remaining_balance,
                        'max_allowed': max_allowed
                    }
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching leave request details: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching leave request details'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, leave_id):
        """
        Update the status of a leave request (approve/reject)
        """
        try:
            logger.info(f"Updating leave request ID: {leave_id}")
            
            # Get the leave request
            leave_request = EmployeeLeave.objects.filter(
                id=leave_id
            ).select_related('employee').first()
            
            if not leave_request:
                logger.warning(f"Leave request not found or access denied. ID: {leave_id}")
                return Response({
                    'status': 'error',
                    'message': 'Leave request not found or access denied'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Validate the new status
            new_status = request.data.get('status')
            if new_status not in ['approved', 'rejected']:
                return Response({
                    'status': 'error',
                    'message': 'Invalid status. Must be either "approved" or "rejected"'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # If approving, check if employee still has sufficient leave balance
            if new_status == 'approved':
                leave_type = leave_request.leave_type
                start_of_year = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0)
                
                leaves_taken = EmployeeLeave.objects.filter(
                    employee=leave_request.employee,
                    leave_type=leave_type,
                    status='approved',
                    created_at__gte=start_of_year
                ).aggregate(total_days=Sum('total_days'))['total_days'] or 0
                
                max_allowed = EmployeeLeave.get_max_days_for_leave_type(leave_type)
                
                if leaves_taken + leave_request.total_days > max_allowed:
                    return Response({
                        'status': 'error',
                        'message': f'Employee has insufficient leave balance. Available: {max_allowed - leaves_taken}, Required: {leave_request.total_days}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Update the status
            leave_request.status = new_status
            leave_request.save()
            
            # If approved, update the employee's total leave taken
            if new_status == 'approved':
                profile = leave_request.employee.employeeprofile
                profile.total_leave_taken += leave_request.total_days
                profile.save()
            
            return Response({
                'status': 'success',
                'message': f'Leave request {new_status} successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error updating leave request: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while updating the leave request'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FetchAllRejectedLeaves(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """
        Get all rejected leave requests for the manager.
        Returns leave requests that are in 'rejected' status.
        """
        try:
            logger.info(f"Fetching rejected leave requests for manager: {request.user.username}")
            
            # Get current date
            current_date = timezone.now().date()
            
            rejected_leaves = EmployeeLeave.objects.filter(
                status='rejected'
            ).select_related('employee').order_by('-created_at')
            
            # Serialize the data
            serializer = ManagerLeaveRequestSerializer(rejected_leaves, many=True)
            
            logger.info(f"Found {len(serializer.data)} rejected leave requests")
            
            return Response({
                'status': 'success',
                'message': 'Rejected leave requests retrieved successfully',
                'data': {
                    'total_requests': len(serializer.data),
                    'requests': serializer.data
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching rejected leave requests: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching rejected leave requests'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FetchAllApprovedLeaves(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """
        Get all approved leave requests for the manager.
        Returns leave requests that are in 'approved' status.
        """
        try:
            logger.info(f"Fetching approved leave requests for manager: {request.user.username}")
            
            # Get current date
            current_date = timezone.now().date()
            
            approved_leaves = EmployeeLeave.objects.filter(
                status='approved'
            ).select_related('employee').order_by('-created_at')
            
            # Serialize the data
            serializer = ManagerLeaveRequestSerializer(approved_leaves, many=True)
            
            logger.info(f"Found {len(serializer.data)} approved leave requests")
            
            return Response({
                'status': 'success',
                'message': 'Approved leave requests retrieved successfully',
                'data': {
                    'total_requests': len(serializer.data),
                    'requests': serializer.data
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching approved leave requests: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching approved leave requests'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class RejectedLeavesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Get all rejected leave requests for the logged-in user.
        """
        try:
            logger.info(f"Fetching rejected leaves for user: {request.user.username}")
            
            rejected_leaves = EmployeeLeave.objects.filter(
                employee=request.user,
                status='rejected'
            ).order_by('-created_at')
            
            serializer = EmployeeLeaveSerializer(rejected_leaves, many=True)
            
            logger.info(f"Found {len(serializer.data)} rejected leave requests")
            
            return Response({
                'status': 'success',
                'message': 'Rejected leave requests retrieved successfully',
                'data': {
                    'total_requests': len(serializer.data),
                    'requests': serializer.data
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching rejected leave requests: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching rejected leave requests'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PendingLeavesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Get all pending leave requests for the logged-in user.
        Also includes leave balance information.
        """
        try:
            logger.info(f"Fetching pending leaves for user: {request.user.username}")
            
            pending_leaves = EmployeeLeave.objects.filter(
                employee=request.user,
                status='pending'
            ).order_by('-created_at')
            
            serializer = EmployeeLeaveSerializer(pending_leaves, many=True)
            
            # Calculate leave balances for each type
            start_of_year = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0)
            leave_balances = {}
            
            for leave_type, _ in EmployeeLeave.LEAVE_CHOICES:
                taken = EmployeeLeave.objects.filter(
                    employee=request.user,
                    leave_type=leave_type,
                    status='pending',
                    created_at__gte=start_of_year
                ).aggregate(total=Sum('total_days'))['total'] or 0
                
                max_allowed = EmployeeLeave.get_max_days_for_leave_type(leave_type)
                remaining = max_allowed - taken
                
                leave_balances[leave_type] = {
                    'taken': taken,
                    'max_allowed': max_allowed,
                    'remaining': remaining
                }
            
            logger.info(f"Found {len(serializer.data)} pending leave requests")
            
            return Response({
                'status': 'success',
                'message': 'Pending leave requests retrieved successfully',
                'data': {
                    'total_requests': len(serializer.data),
                    'requests': serializer.data,
                    'leave_balances': leave_balances
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching pending leave requests: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching pending leave requests'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class ApprovedLeavesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Get all approved leave requests for the logged-in user.
        Also includes leave balance information.
        """
        try:
            logger.info(f"Fetching approved leaves for user: {request.user.username}")
            
            approved_leaves = EmployeeLeave.objects.filter(
                employee=request.user,
                status='approved'
            ).order_by('-created_at')
            
            serializer = EmployeeLeaveSerializer(approved_leaves, many=True)
            
            # Calculate leave balances for each type
            start_of_year = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0)
            leave_balances = {}
            
            for leave_type, _ in EmployeeLeave.LEAVE_CHOICES:
                taken = EmployeeLeave.objects.filter(
                    employee=request.user,
                    leave_type=leave_type,
                    status='approved',
                    created_at__gte=start_of_year
                ).aggregate(total=Sum('total_days'))['total'] or 0
                
                max_allowed = EmployeeLeave.get_max_days_for_leave_type(leave_type)
                remaining = max_allowed - taken
                
                leave_balances[leave_type] = {
                    'taken': taken,
                    'max_allowed': max_allowed,
                    'remaining': remaining
                }
            
            logger.info(f"Found {len(serializer.data)} approved leave requests")
            
            return Response({
                'status': 'success',
                'message': 'Approved leave requests retrieved successfully',
                'data': {
                    'total_requests': len(serializer.data),
                    'requests': serializer.data,
                    'leave_balances': leave_balances
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching approved leave requests: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching approved leave requests'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class AllLeavesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Get all leave requests for the logged-in user regardless of status.
        Includes summary statistics.
        """
        try:
            logger.info(f"Fetching all leaves for user: {request.user.username}")
            
            # Get all leaves
            all_leaves = EmployeeLeave.objects.filter(
                employee=request.user
            ).order_by('-created_at')
            
            serializer = EmployeeLeaveSerializer(all_leaves, many=True)
            
            # Calculate summary statistics
            start_of_year = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0)
            
            summary = {
                'total_requests': len(serializer.data),
                'status_counts': {
                    'pending': all_leaves.filter(status='pending').count(),
                    'approved': all_leaves.filter(status='approved').count(),
                    'rejected': all_leaves.filter(status='rejected').count()
                },
                'leave_type_breakdown': {},
                'yearly_statistics': {
                    'total_leaves_taken': 0,
                    'leave_type_usage': {}
                }
            }
            
            # Calculate leave type breakdown
            for leave_type, name in EmployeeLeave.LEAVE_CHOICES:
                type_count = all_leaves.filter(leave_type=leave_type).count()
                taken_this_year = all_leaves.filter(
                    leave_type=leave_type,
                    status='approved',
                    created_at__gte=start_of_year
                ).aggregate(total=Sum('total_days'))['total'] or 0
                
                max_allowed = EmployeeLeave.get_max_days_for_leave_type(leave_type)
                
                summary['leave_type_breakdown'][leave_type] = {
                    'name': name,
                    'total_requests': type_count,
                    'taken_this_year': taken_this_year,
                    'max_allowed': max_allowed,
                    'remaining': max_allowed - taken_this_year
                }
                
                summary['yearly_statistics']['total_leaves_taken'] += taken_this_year
                summary['yearly_statistics']['leave_type_usage'][leave_type] = taken_this_year
            
            logger.info(f"Successfully retrieved all leave requests with summary")
            
            return Response({
                'status': 'success',
                'message': 'All leave requests retrieved successfully',
                'data': {
                    'summary': summary,
                    'requests': serializer.data
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching all leave requests: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching leave requests'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.db.models import Count, Q, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import Coalesce
from django.utils import timezone
from userauthentication.models import CustomUser
import logging

logger = logging.getLogger(__name__)

class EmployeeLeaveStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Get comprehensive leave statistics for all employees.
        """
        try:
            logger.info("Fetching employee leave statistics")
            
            # Get current year for filtering
            current_year = timezone.now().year
            
            # Get all employees with their profiles
            employees = CustomUser.objects.filter(is_active=True,role='employee').select_related('employeeprofile')
            
            employee_stats = []
            
            for employee in employees:
                # Get all approved leaves for the employee in current year
                approved_leaves = EmployeeLeave.objects.filter(
                    employee=employee,
                    status='approved',
                    created_at__year=current_year
                )
                
                # Initialize leave type stats
                leave_type_stats = {}
                
                # Calculate stats for each leave type
                for leave_type, display_name in EmployeeLeave.LEAVE_CHOICES:
                    max_allowed = EmployeeLeave.LEAVE_ALLOWANCES[leave_type]
                    
                    # Get taken leaves for this type
                    taken_leaves = approved_leaves.filter(
                        leave_type=leave_type
                    ).aggregate(
                        total_days=Coalesce(Sum('total_days'), 0)
                    )['total_days']
                    
                    leave_type_stats[leave_type] = {
                        'type_display': display_name,
                        'max_allowed': max_allowed,
                        'taken': taken_leaves,
                        'balance': max_allowed - taken_leaves
                    }
                
                # Calculate overall statistics
                total_leaves_taken = sum(stat['taken'] for stat in leave_type_stats.values())
                total_leaves_allowed = sum(EmployeeLeave.LEAVE_ALLOWANCES.values())
                
                # Get pending leaves count
                pending_leaves = EmployeeLeave.objects.filter(
                    employee=employee,
                    status='pending'
                ).count()
                
                # Create employee stats dictionary
                employee_data = {
                    'employee_id': employee.id,
                    'employee_name': employee.username,
                    'overall_stats': {
                        'total_allowed': total_leaves_allowed,
                        'total_taken': total_leaves_taken,
                        'total_balance': total_leaves_allowed - total_leaves_taken,
                        'pending_requests': pending_leaves
                    },
                    'leave_type_breakdown': leave_type_stats,
                    # Get recent leave requests (last 5)
                    'recent_leaves': [{
                        'type': leave.leave_type,
                        'type_display': leave.get_leave_type_display(),
                        'status': leave.status,
                        'status_display': leave.get_status_display(),
                        'days': leave.total_days,
                        'created_at': leave.created_at
                    } for leave in EmployeeLeave.objects.filter(
                        employee=employee
                    ).order_by('-created_at')[:5]]
                }
                
                employee_stats.append(employee_data)
            
            return Response({
                'status': 'success',
                'message': 'Employee leave statistics retrieved successfully',
                'data': {
                    'total_employees': len(employee_stats),
                    'employees': employee_stats
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching employee leave statistics: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching employee leave statistics'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserLeaveStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Get comprehensive leave statistics for the authenticated user.
        """
        try:
            logger.info(f"Fetching leave statistics for user: {request.user.id}")
            
            # Get current year for filtering
            current_year = timezone.now().year
            
            # Get the employee (authenticated user)
            employee = request.user
            
            # Check if the user is an active employee
            if not (employee.is_active and employee.role == 'employee'):
                return Response({
                    'status': 'error',
                    'message': 'You do not have permission to view leave statistics.'
                }, status=status.HTTP_403_FORBIDDEN)

            # Get all approved leaves for the user in the current year
            approved_leaves = EmployeeLeave.objects.filter(
                employee=employee,
                status='approved',
                created_at__year=current_year
            )
            
            # Initialize leave type stats
            leave_type_stats = {}
            
            # Calculate stats for each leave type
            for leave_type, display_name in EmployeeLeave.LEAVE_CHOICES:
                max_allowed = EmployeeLeave.LEAVE_ALLOWANCES[leave_type]
                
                # Get taken leaves for this type
                taken_leaves = approved_leaves.filter(
                    leave_type=leave_type
                ).aggregate(
                    total_days=Coalesce(Sum('total_days'), 0)
                )['total_days']
                
                leave_type_stats[leave_type] = {
                    'type_display': display_name,
                    'max_allowed': max_allowed,
                    'taken': taken_leaves,
                    'balance': max_allowed - taken_leaves
                }
            
            # Calculate overall statistics
            total_leaves_taken = sum(stat['taken'] for stat in leave_type_stats.values())
            total_leaves_allowed = sum(EmployeeLeave.LEAVE_ALLOWANCES.values())
            
            # Get pending leaves count
            pending_leaves = EmployeeLeave.objects.filter(
                employee=employee,
                status='pending'
            ).count()
            
            # Create user stats dictionary
            user_data = {
                'employee_id': employee.id,
                'employee_name': employee.username,
                'overall_stats': {
                    'total_allowed': total_leaves_allowed,
                    'total_taken': total_leaves_taken,
                    'total_balance': total_leaves_allowed - total_leaves_taken,
                    'pending_requests': pending_leaves
                },
                'leave_type_breakdown': leave_type_stats,
                # Get recent leave requests (last 5)
                'recent_leaves': [{
                    'type': leave.leave_type,
                    'type_display': leave.get_leave_type_display(),
                    'status': leave.status,
                    'status_display': leave.get_status_display(),
                    'days': leave.total_days,
                    'created_at': leave.created_at
                } for leave in EmployeeLeave.objects.filter(
                    employee=employee
                ).order_by('-created_at')[:5]]
            }
            
            return Response({
                'status': 'success',
                'message': 'User leave statistics retrieved successfully',
                'data': user_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching user leave statistics: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'An error occurred while fetching user leave statistics'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)