# views.py
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from .models import *
from django.contrib.auth.hashers import check_password
from .serializers import *
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework import viewsets
from rest_framework.views import APIView

class SignupView(generics.CreateAPIView):
    queryset = CommonUser.objects.all()
    serializer_class = CommonUserSerializer
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
@api_view(["POST"])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"detail": "Email and password are required."}, status=400)

    try:
        user = CommonUser.objects.get(email=email)
    except CommonUser.DoesNotExist:
        return Response({"detail": "No active account found with the given credentials."}, status=400)

    if not check_password(password, user.password):
        return Response({"detail": "Invalid email or password."}, status=400)

    if not user.is_active:
        return Response({"detail": "This account is inactive."}, status=400)

    refresh = RefreshToken.for_user(user)
    
    return Response({
        "detail": "Login successful",
        "username": user.name,
        "email": user.email,
        "is_committee": user.is_committee,
        "is_resident": user.is_resident,
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }, status=200)       

class HomeView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(request)
        if request.user.is_resident:
            return Response({'redirect': 'resident_home'})
        elif request.user.is_committee:
            return Response({'redirect': 'committee_home'})
        else:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

class GetUserView(generics.RetrieveAPIView) :
    queryset = CommonUser.objects.all()
    serializer_class = getUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class AddPetView(generics.CreateAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        apartment_number = Apartment_numbers.objects.get(apartment_number = self.request.user.house_number)
        serializer.save(resident=self.request.user, apartment = apartment_number)
        apartment = Apartment.objects.get(apartment_number = apartment_number)
        apartment.total_pets += 1
        apartment.save() 
        
class PetsByApartmentView(APIView):
    def get(self, request, resident_id):
        try:
            resident = CommonUser.objects.get(id=resident_id)
            pets = Pet.objects.filter(apartment=resident.house_number)
            serializer = PetSerializer(pets, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CommonUser.DoesNotExist:
            return Response({'detail': 'Resident not found'}, status=status.HTTP_404_NOT_FOUND)
        except Pet.DoesNotExist:
            return Response({'detail': 'No pets found for this resident'}, status=status.HTTP_404_NOT_FOUND)
        
class DeletePetView(generics.DestroyAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        pet_id = self.kwargs.get('pk')
        try:
            pet = Pet.objects.get(pk=pet_id, resident=request.user)
            pet.delete()
            apartment_number = Apartment_numbers.objects.get(apartment_number = self.request.user.house_number)
            apartment = Apartment.objects.get(apartment_number = apartment_number)
            apartment.total_pets -= 1
            apartment.save()
            return Response({'detail': 'Pet deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Pet.DoesNotExist:
            return Response({'detail': 'Pet not found.'}, status=status.HTTP_404_NOT_FOUND)
        
class AddHelperView(generics.CreateAPIView):
    queryset = DailyHelp.objects.all()
    serializer_class = DailyHelpSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        apartment_number = Apartment_numbers.objects.get(apartment_number = self.request.user.house_number)
        serializer.save(added_by=self.request.user, apartment=apartment_number)
        apartment = Apartment.objects.get(apartment_number = apartment_number)
        apartment.total_workers += 1
        apartment.save()
        
class ViewHelpersByApartment(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        apartment = request.user.house_number
        helpers = DailyHelp.objects.filter(apartment=apartment)
        serializer = DailyHelpSerializer(helpers, many=True)
        return Response(serializer.data)
 
class HelpersAll(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Grouping maids by apartment
        maids_data = {}
        maids = DailyHelp.objects.select_related('apartment').all()

        for maid in maids:
            apartment_number = maid.apartment.apartment_number
            if apartment_number not in maids_data:
                maids_data[apartment_number] = []
            maids_data[apartment_number].append({
                'name': maid.name,
                'job': maid.job,
                'phone_number': maid.phone_number,
            })

        return Response(maids_data) 
    
class RemoveHelperView(generics.DestroyAPIView):
    queryset = DailyHelp.objects.all()
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        helper_id = self.kwargs.get('pk')
        try:
            helper = DailyHelp.objects.get(pk=helper_id, apartment=request.user.house_number)
            helper.delete()
            apartment_number = Apartment_numbers.objects.get(apartment_number = self.request.user.house_number)
            apartment = Apartment.objects.get(apartment_number = apartment_number)
            apartment.total_workers -= 1
            apartment.save()
            return Response({'detail': 'Helper removed successfully.'}, status=204)
        except DailyHelp.DoesNotExist:
            return Response({'detail': 'Helper not found.'}, status=404)
        
class AddVehicleView(generics.CreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        apartment_number = Apartment_numbers.objects.get(apartment_number=self.request.user.house_number)
        serializer.save(resident=self.request.user, house_no=apartment_number)
        apartment = Apartment.objects.get(apartment_number = apartment_number)
        # Update the total_vehicles count in the Apartment model
        apartment.total_vehicels += 1
        apartment.save()
        
class ViewVehiclesByApartmentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            apartment_number = self.request.user.house_number
            vehicles = Vehicle.objects.filter(house_no=apartment_number)
            if vehicles.exists():
                serializer = VehicleSerializer(vehicles, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'No vehicles found in your apartment.'}, status=status.HTTP_404_NOT_FOUND)
        except Apartment_numbers.DoesNotExist:
            return Response({'detail': 'Apartment not found.'}, status=status.HTTP_404_NOT_FOUND)
        
class DeleteVehicleView(generics.DestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        vehicle_id = self.kwargs.get('pk')
        try:
            vehicle = Vehicle.objects.get(pk=vehicle_id, house_no=self.request.user.house_number)
            vehicle.delete()

            # Update the total_vehicles count in the Apartment model
            apartment_number = Apartment_numbers.objects.get(apartment_number = self.request.user.house_number)
            apartment = Apartment.objects.get(apartment_number = apartment_number)
            apartment.total_workers -= 1
            apartment.save()

            return Response({'detail': 'Vehicle deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Vehicle.DoesNotExist:
            return Response({'detail': 'Vehicle not found.'}, status=status.HTTP_404_NOT_FOUND)
        
class SendReminderView(generics.CreateAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Assuming all residents should receive the reminder
        residents = CommonUser.objects.all()
        message = self.request.data.get('message')
        for resident in residents:
            Reminder.objects.create(resident=resident, message=message)
        return Response({'detail': 'Reminder sent to all residents.'}, status=201)

class ViewRemindersView(generics.ListAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(resident=self.request.user)
    
class MarkReminderAsViewedView(generics.UpdateAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        reminder = self.get_object()
        reminder.viewed = True
        reminder.save()
        
class NoticeBoardListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notices = NoticeBoard.objects.all().order_by('-created_at')
        serializer = NoticeBoardSerializer(notices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class NoticeBoardCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Check if the user is a committee member
        if not request.user.is_committee:
            return Response({"detail": "Only committee members can create notices."}, status=status.HTTP_403_FORBIDDEN)

        # Validate and create notice
        serializer = NoticeBoardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class NoticeBoardDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            notice = NoticeBoard.objects.get(pk=pk)
        except NoticeBoard.DoesNotExist:
            return Response({"detail": "Notice not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the user is a committee member and the creator of the notice
        
        # if not request.user.is_committee or notice.created_by != request.user:
        if not request.user.is_committee:
            return Response({"detail": "You don't have permission to delete this notice."}, status=status.HTTP_403_FORBIDDEN)

        notice.delete()
        return Response({"detail": "Notice deleted successfully."}, status=status.HTTP_200_OK)
    
class AddBillView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BillSerializer(data=request.data)
        if serializer.is_valid():
            # Automatically assign the user's apartment (house_number) to the bill
            serializer.save(added_by=request.user, apartment=request.user.house_number)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ViewBillsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            apartment_number = self.request.user.house_number
            bills = Bill.objects.filter(apartment=apartment_number)
            if bills.exists():
                serializer = BillSerializer(bills, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'No vehicles found in your apartment.'}, status=status.HTTP_404_NOT_FOUND)
        except Apartment_numbers.DoesNotExist:
            return Response({'detail': 'Apartment not found.'}, status=status.HTTP_404_NOT_FOUND)
        
class DeleteBillView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            bill = Bill.objects.get(pk=pk)
            bill.delete()
            return Response({'detail': 'Bill deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Bill.DoesNotExist:
            return Response({'error': 'Bill not found or you do not have permission to delete it.'}, status=status.HTTP_404_NOT_FOUND)
        
class ResidentsAll(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        residents_data = {}
        users = CommonUser.objects.filter(is_committee=True) | CommonUser.objects.filter(is_resident=True)

        for user in users:
            apartment_number = user.house_number.apartment_number
            if apartment_number not in residents_data:
                residents_data[apartment_number] = []
            residents_data[apartment_number].append({
                'name': user.name,
                'phone_number': user.phoneNumber,
                'role': 'Resident' if user.is_resident else 'Committee'
            })

        return Response(residents_data)
    
class PeopleInSameApartmentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        residents_data = []
        
        user = request.user

        if not user.house_number:
            return Response({'error': 'User does not belong to any apartment.'}, status=400)

        # Fetch all CommonUser instances in the user's apartment
        users = CommonUser.objects.filter(house_number=user.house_number)
        for user in users:
            residents_data.append({
                'name': user.name,
                'phone_number': user.phoneNumber,
                'role': 'Resident' if user.is_resident else 'Committee'
            })

        return Response(residents_data)