# from django.shortcuts import render

# from rest_framework import generics, status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from django.db import transaction
# from .serializers import LeaveApplicationSerializer
# from .models import EmployeeLeave

# class LeaveApplicationView(generics.CreateAPIView):
#     serializer_class = LeaveApplicationSerializer
#     permission_classes = [IsAuthenticated]
    
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(
#             data=request.data, 
#             context={'request': request}
#         )
        
#         try:
#             with transaction.atomic():
#                 if serializer.is_valid(raise_exception=True):
#                     self.perform_create(serializer)
                    
#                     return Response({
#                         'success': True,
#                         'message': 'Leave application submitted successfully',
#                         'data': serializer.data
#                     }, status=status.HTTP_201_CREATED)
                    
#         except serializer.ValidationError as e:
#             return Response({
#                 'success': False,
#                 'message': 'Validation failed',
#                 'errors': e.detail
#             }, status=status.HTTP_400_BAD_REQUEST)
            
#         except Exception as e:
#             return Response({
#                 'success': False,
#                 'message': str(e),
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# views.py
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction
from .serializers import LeaveApplicationSerializer
from .models import EmployeeLeave
from .serializers import ManagerLeaveRequestSerializer
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
            
            # Query for pending leave requests
            # Filter for pending status and future dates
            # pending_leaves = EmployeeLeave.objects.filter(
            #     status='pending',
            #     employee__department=request.user.department  # Assuming manager can only see their department's requests
            # ).select_related('employee').order_by('-created_at')
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