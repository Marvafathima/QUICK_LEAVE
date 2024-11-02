
from rest_framework import serializers
from django.utils import timezone
from datetime import datetime
from django.db.models import Sum
import logging
from .models import EmployeeLeave, EmployeeProfile
from django.db import transaction
# Configure logger
logger = logging.getLogger(__name__)

# class LeaveApplicationSerializer(serializers.ModelSerializer):
#     dates = serializers.ListField(
#         child=serializers.DateField(),
#         write_only=True
#     )
#     leaveType = serializers.CharField(source='leave_type')
#     employeeId = serializers.IntegerField(write_only=True)

#     class Meta:
#         model = EmployeeLeave
#         fields = ['leaveType', 'reason', 'dates', 'employeeId']

#     def validate(self, data):
#         try:
#             logger.info(f"Starting validation for leave application. Data received: {data}")
            
#             # Get the employee (user) from the context
#             employee = self.context['request'].user
#             logger.info(f"Processing leave application for employee: {employee.username}")
            
#             # Map leaveType to leave_type
#             leave_type = data.get('leave_type')
#             dates = data.get('dates')

#             if not dates:
#                 logger.error("No dates provided in the request")
#                 raise serializers.ValidationError({"dates": "No dates provided"})

#             logger.info(f"Validating {len(dates)} dates for leave type: {leave_type}")
            
#             # Convert string dates to date objects if they aren't already
#             try:
#                 if isinstance(dates[0], str):
#                     dates = [datetime.strptime(date, '%Y-%m-%d').date() for date in dates]
#             except (ValueError, IndexError) as e:
#                 logger.error(f"Date parsing error: {str(e)}")
#                 raise serializers.ValidationError({"dates": "Invalid date format"})

#             # Convert dates to string format for JSON storage
#             dates_str = [date.strftime('%Y-%m-%d') for date in dates]
            
#             # Check if dates are in the future
#             today = timezone.now().date()
#             if any(date <= today for date in dates):
#                 logger.warning(f"Past dates detected in request: {dates}")
#                 raise serializers.ValidationError(
#                     {"dates": "Leave can only be applied for future dates"}
#                 )
            
#             # Check for weekends
#             weekend_dates = [date for date in dates if date.weekday() in [5, 6]]
#             if weekend_dates:
#                 logger.warning(f"Weekend dates detected: {weekend_dates}")
#                 raise serializers.ValidationError(
#                     {"dates": "Leave cannot be applied for weekends"}
#                 )
            
#             # Check for duplicate dates
#             if len(dates) != len(set(dates)):
#                 logger.warning("Duplicate dates detected in request")
#                 raise serializers.ValidationError(
#                     {"dates": "Duplicate dates are not allowed"}
#                 )
            
#             # Check for overlapping leaves
#             existing_leaves = EmployeeLeave.objects.filter(
#                 employee=employee,
#                 status__in=['approved', 'pending']
#             )
            
#             logger.info(f"Checking for overlapping leaves. Found {existing_leaves.count()} existing applications")
            
#             for leave in existing_leaves:
#                 existing_dates = set(datetime.strptime(date, '%Y-%m-%d').date() 
#                                    for date in leave.selected_dates)
#                 overlapping_dates = [date for date in dates if date in existing_dates]
#                 if overlapping_dates:
#                     logger.warning(f"Overlapping dates found: {overlapping_dates}")
#                     raise serializers.ValidationError(
#                         {"dates": "You already have leave applications for some of these dates"}
#                     )
            
#             # Check leave balance
#             max_allowed_days = EmployeeLeave.get_max_days_for_leave_type(leave_type)
            
#             # Get total leaves taken of this type in the current year
#             start_of_year = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0)
#             leaves_taken = EmployeeLeave.objects.filter(
#                 employee=employee,
#                 leave_type=leave_type,
#                 status='approved',
#                 created_at__gte=start_of_year
#             ).aggregate(total_days=Sum('total_days'))['total_days'] or 0
            
#             logger.info(f"Leave balance check - Max allowed: {max_allowed_days}, Already taken: {leaves_taken}, Requested: {len(dates)}")
            
#             if leaves_taken + len(dates) > max_allowed_days:
#                 logger.warning(f"Insufficient leave balance. Required: {len(dates)}, Available: {max_allowed_days - leaves_taken}")
#                 raise serializers.ValidationError(
#                     {
#                         "leave_type": f"Insufficient leave balance. You have {max_allowed_days - leaves_taken} days remaining for {leave_type} leave"
#                     }
#                 )
            
#             # Store the validated dates in the format needed by the model
#             data['selected_dates'] = dates_str
#             return data

#         except Exception as e:
#             logger.error(f"Validation error occurred: {str(e)}", exc_info=True)
#             raise

#     def create(self, validated_data):
#         try:
#             logger.info("Starting leave application creation")
            
#             # Remove write_only fields that shouldn't be passed to create
#             dates = validated_data.pop('dates')
#             employee_id = validated_data.pop('employeeId', None)
            
#             # Get the employee from the context
#             employee = self.context['request'].user
            
#             logger.info(f"Creating leave application for employee: {employee.username}, dates: {dates}")
            
#             # Create leave application with the correct fields
#             leave = EmployeeLeave.objects.create(
#                 employee=employee,
#                 leave_type=validated_data['leave_type'],
#                 reason=validated_data['reason'],
#                 selected_dates=validated_data['selected_dates']
#             )
            
#             logger.info(f"Leave application created successfully. ID: {leave.id}")
#             return leave

#         except Exception as e:
#             logger.error(f"Error creating leave application: {str(e)}", exc_info=True)
#             raise
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
            
            # Get or create employee profile
            profile, created = EmployeeProfile.objects.get_or_create(user=employee)
            
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
            
            # Check specific leave type balance
            max_allowed_days = EmployeeLeave.get_max_days_for_leave_type(leave_type)
            
            # Get total leaves taken of this type in the current year
            start_of_year = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0)
            leaves_taken_by_type = EmployeeLeave.objects.filter(
                employee=employee,
                leave_type=leave_type,
                status='approved',
                created_at__gte=start_of_year
            ).aggregate(total_days=Sum('total_days'))['total_days'] or 0
            
            logger.info(f"Leave balance check - Max allowed for {leave_type}: {max_allowed_days}, Already taken: {leaves_taken_by_type}, Requested: {len(dates)}")
            
            if leaves_taken_by_type + len(dates) > max_allowed_days:
                logger.warning(f"Insufficient leave balance for {leave_type}. Required: {len(dates)}, Available: {max_allowed_days - leaves_taken_by_type}")
                raise serializers.ValidationError(
                    {
                        "leave_type": f"Insufficient leave balance. You have {max_allowed_days - leaves_taken_by_type} days remaining for {leave_type} leave"
                    }
                )
            
            # Check total leave balance for the year
            MAX_TOTAL_LEAVES_PER_YEAR = sum(EmployeeLeave.LEAVE_ALLOWANCES.values())
            current_total_leaves = profile.total_leave_taken
            
            if current_total_leaves + len(dates) > MAX_TOTAL_LEAVES_PER_YEAR:
                logger.warning(f"Exceeds total annual leave limit. Current: {current_total_leaves}, Requested: {len(dates)}, Max: {MAX_TOTAL_LEAVES_PER_YEAR}")
                raise serializers.ValidationError(
                    {
                        "dates": f"You have exceeded your total annual leave limit. You have {MAX_TOTAL_LEAVES_PER_YEAR - current_total_leaves} total leave days remaining for the year"
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
            
            # Start transaction to ensure both leave creation and profile update succeed or fail together
            with transaction.atomic():
                # Create leave application with the correct fields
                leave = EmployeeLeave.objects.create(
                    employee=employee,
                    leave_type=validated_data['leave_type'],
                    reason=validated_data['reason'],
                    selected_dates=validated_data['selected_dates']
                )
                
                # Update employee profile's total leave taken if the leave is approved
                if leave.status == 'approved':
                    profile, created = EmployeeProfile.objects.get_or_create(user=employee)
                    profile.total_leave_taken += len(dates)
                    profile.save()
                
                logger.info(f"Leave application created successfully. ID: {leave.id}")
                return leave

        except Exception as e:
            logger.error(f"Error creating leave application: {str(e)}", exc_info=True)
            raise

    @transaction.atomic
    def update(self, instance, validated_data):
        """
        Override update to handle status changes and update profile accordingly
        """
        try:
            old_status = instance.status
            new_status = validated_data.get('status', old_status)
            
            # If the status is changing to 'approved'
            if old_status != 'approved' and new_status == 'approved':
                profile = EmployeeProfile.objects.get(user=instance.employee)
                profile.total_leave_taken += len(instance.selected_dates)
                profile.save()
            
            # If the status is changing from 'approved' to something else
            elif old_status == 'approved' and new_status != 'approved':
                profile = EmployeeProfile.objects.get(user=instance.employee)
                profile.total_leave_taken -= len(instance.selected_dates)
                profile.save()
            
            return super().update(instance, validated_data)
            
        except Exception as e:
            logger.error(f"Error updating leave application: {str(e)}", exc_info=True)
            raise