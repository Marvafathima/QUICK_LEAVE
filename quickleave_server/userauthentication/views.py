from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import logout


from .serializers import UserSignupSerializer, CustomTokenObtainPairSerializer
User = get_user_model()

class SignupView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response({
                    "message": "User created successfully",
                    "user": UserSignupSerializer(user).data
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Simply return success response
            # The frontend will handle clearing the tokens
            logout(request)
            return Response(
                {"message": "Successfully logged out."}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Something went wrong, please try again."}, 
                status=status.HTTP_400_BAD_REQUEST
            )