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