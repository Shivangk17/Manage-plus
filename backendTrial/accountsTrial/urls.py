# urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', login, name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/home/', HomeView.as_view(), name='home'),
    path('api/getUser',  GetUserView.as_view(), name='get_user'),
    path('api/pets/', AddPetView.as_view(), name='add_pet'),
    path('api/pets/apartment/<int:resident_id>/', PetsByApartmentView.as_view(), name='pets_by_resident'),
    path('api/pets/<int:pk>/delete/', DeletePetView.as_view(), name='delete-pet'),
    path('api/addHelper/', AddHelperView.as_view(), name='add-helper'),
    path('api/viewHelpers/', ViewHelpersByApartment.as_view(), name='view-helper'),
    path('api/removeHelper/<int:pk>/', RemoveHelperView.as_view(), name='delete-helper'),
    path('api/addVehicle/', AddVehicleView.as_view(), name='add_vehicle'),
    path('api/viewVehicles/', ViewVehiclesByApartmentView.as_view(), name='view_vehicles'),
    path('api/removeVehicle/<int:pk>/', DeleteVehicleView.as_view(), name='delete_vehicle'),
    path('api/sendReminder/', SendReminderView.as_view(), name='send_reminder'),
    path('api/viewReminders/', ViewRemindersView.as_view(), name='view_reminders'),
    path('api/reminders/<int:pk>/markViewed/', MarkReminderAsViewedView.as_view(), name='mark_reminder_viewed'),
    path('api/notices/', NoticeBoardListView.as_view(), name='notice-list'),
    path('api/notices/create/', NoticeBoardCreateView.as_view(), name='notice-create'),
    path('api/notices/<int:pk>/delete/', NoticeBoardDeleteView.as_view(), name='notice-delete'),
    path('api/addBill/', AddBillView.as_view(), name='add-bill'),
    path('api/viewBills/', ViewBillsView.as_view(), name='view-bills'),
    path('api/deleteBill/<int:pk>/', DeleteBillView.as_view(), name='delete-bill'),
    path('api/helpersAll/', HelpersAll.as_view(), name='maids-by-apartment'),
    path('api/residentsAll/', ResidentsAll.as_view(), name='residents-by-apartment'),
    path('api/residentSameApartment/', PeopleInSameApartmentView.as_view(), name='people-in-same-apartment'),
]