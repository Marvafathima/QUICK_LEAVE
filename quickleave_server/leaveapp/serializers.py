# from rest_framework import serializers
# from django.utils import timezone
# from datetime import datetime
# from .models import EmployeeLeave, EmployeeProfile

# class LeaveApplicationSerializer(serializers.ModelSerializer):
#     dates = serializers.ListField(
#         child=serializers.DateField(),
#         write_only=True
#     )
    
#     class Meta:
#         model = EmployeeLeave
#         fields = ['leave_type', 'reason', 'dates']
        
#     def validate(self, data):
#         # Get the employee (user) from the context
#         employee = self.context['request'].user
#         leave_type = data['leave_type']
#         dates = data['dates']
        
#         # Convert dates to string format for JSON storage
#         dates_str = [date.strftime('%Y-%m-%d') for date in dates]
        
#         # Check if dates are in the future
#         today = timezone.now().date()
#         if any(date <= today for date in dates):
#             raise serializers.ValidationError(
#                 {"dates": "Leave can only be applied for future dates"}
#             )
        
#         # Check for weekends
#         if any(date.weekday() in [5, 6] for date in dates):
#             raise serializers.ValidationError(
#                 {"dates": "Leave cannot be applied for weekends"}
#             )
        
#         # Check for duplicate dates
#         if len(dates) != len(set(dates)):
#             raise serializers.ValidationError(
#                 {"dates": "Duplicate dates are not allowed"}
#             )
        
#         # Check for overlapping leaves
#         existing_leaves = EmployeeLeave.objects.filter(
#             employee=employee,
#             status__in=['approved', 'pending']
#         )
        
#         for leave in existing_leaves:
#             existing_dates = set(datetime.strptime(date, '%Y-%m-%d').date() 
#                                for date in leave.selected_dates)
#             if any(date in existing_dates for date in dates):
#                 raise serializers.ValidationError(
#                     {"dates": "You already have leave applications for some of these dates"}
#                 )
        
#         # Check leave balance
#         max_allowed_days = EmployeeLeave.get_max_days_for_leave_type(leave_type)
        
#         # Get total leaves taken of this type in the current year
#         start_of_year = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0)
#         leaves_taken = EmployeeLeave.objects.filter(
#             employee=employee,
#             leave_type=leave_type,
#             status='approved',
#             created_at__gte=start_of_year
#         ).aggregate(total_days=models.Sum('total_days'))['total_days'] or 0
        
#         if leaves_taken + len(dates) > max_allowed_days:
#             raise serializers.ValidationError(
#                 {
#                     "leave_type": f"Insufficient leave balance. You have {max_allowed_days - leaves_taken} days remaining for {leave_type} leave"
#                 }
#             )
        
#         # Store the validated dates in the format needed by the model
#         data['selected_dates'] = dates_str
#         return data
    
#     def create(self, validated_data):
#         dates = validated_data.pop('dates')  # Remove dates from validated_data
#         employee = self.context['request'].user
        
#         # Create leave application
#         leave = EmployeeLeave.objects.create(
#             employee=employee,
#             selected_dates=validated_data['selected_dates'],
#             **validated_data
#         )
#         return leave
# serializers.py
from rest_framework import serializers
from django.utils import timezone
from datetime import datetime
from django.db.models import Sum
import logging
from .models import EmployeeLeave, EmployeeProfile

# Configure logger
logger = logging.getLogger(__name__)

class LeaveApplicationSerializer(serializers.ModelSerializer):
    dates = serializers.ListField(
        child=serializers.DateField(),
        write_only=True
    )
    leaveType = serializers.CharField(source='leave_type')
    employeeId = serializers.IntegerField(write_only=True)

    class Meta:
        model = EmployeeLeave
        fields = ['leaveType', 'reason', 'dates', 'employeeId']

    def validate(self, data):
        try:
            logger.info(f"Starting validation for leave application. Data received: {data}")
            
            # Get the employee (user) from the context
            employee = self.context['request'].user
            logger.info(f"Processing leave application for employee: {employee.username}")
            
            # Map leaveType to leave_type
            leave_type = data.get('leave_type')
            dates = data.get('dates')

            if not dates:
                logger.error("No dates provided in the request")
                raise serializers.ValidationError({"dates": "No dates provided"})

            logger.info(f"Validating {len(dates)} dates for leave type: {leave_type}")
            
            # Convert string dates to date objects if they aren't already
            try:
                if isinstance(dates[0], str):
                    dates = [datetime.strptime(date, '%Y-%m-%d').date() for date in dates]
            except (ValueError, IndexError) as e:
                logger.error(f"Date parsing error: {str(e)}")
                raise serializers.ValidationError({"dates": "Invalid date format"})

            # Convert dates to string format for JSON storage
            dates_str = [date.strftime('%Y-%m-%d') for date in dates]
            
            # Check if dates are in the future
            today = timezone.now().date()
            if any(date <= today for date in dates):
                logger.warning(f"Past dates detected in request: {dates}")
                raise serializers.ValidationError(
                    {"dates": "Leave can only be applied for future dates"}
                )
            
            # Check for weekends
            weekend_dates = [date for date in dates if date.weekday() in [5, 6]]
            if weekend_dates:
                logger.warning(f"Weekend dates detected: {weekend_dates}")
                raise serializers.ValidationError(
                    {"dates": "Leave cannot be applied for weekends"}
                )
            
            # Check for duplicate dates
            if len(dates) != len(set(dates)):
                logger.warning("Duplicate dates detected in request")
                raise serializers.ValidationError(
                    {"dates": "Duplicate dates are not allowed"}
                )
            
            # Check for overlapping leaves
            existing_leaves = EmployeeLeave.objects.filter(
                employee=employee,
                status__in=['approved', 'pending']
            )
            
            logger.info(f"Checking for overlapping leaves. Found {existing_leaves.count()} existing applications")
            
            for leave in existing_leaves:
                existing_dates = set(datetime.strptime(date, '%Y-%m-%d').date() 
                                   for date in leave.selected_dates)
                overlapping_dates = [date for date in dates if date in existing_dates]
                if overlapping_dates:
                    logger.warning(f"Overlapping dates found: {overlapping_dates}")
                    raise serializers.ValidationError(
                        {"dates": "You already have leave applications for some of these dates"}
                    )
            
            # Check leave balance
            max_allowed_days = EmployeeLeave.get_max_days_for_leave_type(leave_type)
            
            # Get total leaves taken of this type in the current year
            start_of_year = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0)
            leaves_taken = EmployeeLeave.objects.filter(
                employee=employee,
                leave_type=leave_type,
                status='approved',
                created_at__gte=start_of_year
            ).aggregate(total_days=Sum('total_days'))['total_days'] or 0
            
            logger.info(f"Leave balance check - Max allowed: {max_allowed_days}, Already taken: {leaves_taken}, Requested: {len(dates)}")
            
            if leaves_taken + len(dates) > max_allowed_days:
                logger.warning(f"Insufficient leave balance. Required: {len(dates)}, Available: {max_allowed_days - leaves_taken}")
                raise serializers.ValidationError(
                    {
                        "leave_type": f"Insufficient leave balance. You have {max_allowed_days - leaves_taken} days remaining for {leave_type} leave"
                    }
                )
            
            # Store the validated dates in the format needed by the model
            data['selected_dates'] = dates_str
            return data

        except Exception as e:
            logger.error(f"Validation error occurred: {str(e)}", exc_info=True)
            raise

    def create(self, validated_data):
        try:
            logger.info("Starting leave application creation")
            
            # Remove write_only fields that shouldn't be passed to create
            dates = validated_data.pop('dates')
            employee_id = validated_data.pop('employeeId', None)
            
            # Get the employee from the context
            employee = self.context['request'].user
            
            logger.info(f"Creating leave application for employee: {employee.username}, dates: {dates}")
            
            # Create leave application with the correct fields
            leave = EmployeeLeave.objects.create(
                employee=employee,
                leave_type=validated_data['leave_type'],
                reason=validated_data['reason'],
                selected_dates=validated_data['selected_dates']
            )
            
            logger.info(f"Leave application created successfully. ID: {leave.id}")
            return leave

        except Exception as e:
            logger.error(f"Error creating leave application: {str(e)}", exc_info=True)
            raise