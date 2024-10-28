from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CommonUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_superuser'):
            return self.create_user(email, password, house_number=None, **extra_fields)

        return self.create_user(email, password, **extra_fields)

class Apartment_numbers(models.Model):
    apartment_number = models.CharField(max_length=50) 
    def __str__(self):
        return f"{self.apartment_number}"
    
class CommonUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    phoneNumber = models.CharField(max_length=10)
    house_number = models.ForeignKey(Apartment_numbers, on_delete=models.CASCADE, related_name="users_flat", null=True)
    no_family_memebers = models.BigIntegerField(default=0, null=True)

    is_active = models.BooleanField(default=True)
    is_committee = models.BooleanField(default=False)
    is_resident = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = CommonUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class Resident(models.Model):
    cuser = models.OneToOneField(CommonUser, on_delete=models.CASCADE, related_name='resident_profile')

    def str(self):
        return f"{self.cuser.name} - {self.cuser.house_number}"

class Committee(models.Model):
    cuser = models.OneToOneField(CommonUser, on_delete=models.CASCADE, related_name='committee_profile')
    
    def str(self):
        return f"{self.cuser.name}"

class Security(models.Model):
    name = models.CharField(max_length=100)
    phoneNumber = models.CharField(max_length=10)
    password = models.CharField(max_length=255)
    shift = models.CharField(max_length=20)
    gateno_duty = models.CharField(max_length=50)

    def str(self):
        return f"{self.name}"

class Apartment(models.Model):
    apartment_number = models.ForeignKey(Apartment_numbers, on_delete=models.CASCADE, related_name='apartment_values', default=0)
    total_members = models.BigIntegerField(default=0)
    total_vehicels = models.BigIntegerField(default=0)
    total_workers = models.BigIntegerField(default=0)
    total_pets = models.BigIntegerField(default=0)    
    
class Pet(models.Model):
    resident = models.ForeignKey(CommonUser, on_delete=models.SET_NULL, null=True, related_name='pets')
    name = models.CharField(max_length=50)
    apartment = models.ForeignKey(Apartment_numbers, on_delete=models.CASCADE, related_name='pets_total', default=0)
    animal_type = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.name} - {self.apartment.apartment_number}"
    
class DailyHelp(models.Model):
    added_by = models.ForeignKey(CommonUser, on_delete=models.CASCADE, related_name='daily_help_added')
    apartment = models.ForeignKey(Apartment_numbers, on_delete=models.CASCADE, related_name='daily_help_working', default=0)
    name = models.CharField(max_length=100)
    job = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    
class Vehicle(models.Model):
    resident = models.ForeignKey(CommonUser, on_delete=models.CASCADE, related_name='vehicles')
    house_no = models.ForeignKey(Apartment_numbers, on_delete=models.CASCADE, related_name='vechicles')
    vehicle_type = models.CharField(max_length=20)
    license_plate = models.CharField(max_length=20, unique=True)
    
class Reminder(models.Model):
    resident = models.ForeignKey(CommonUser, on_delete=models.CASCADE, related_name='reminders')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    viewed = models.BooleanField(default=False)
    def __str__(self):
        return f"Reminder for {self.resident.name}: {self.message}"
    
class NoticeBoard(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_by = models.ForeignKey(CommonUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Bill(models.Model):
    added_by = models.ForeignKey(CommonUser, on_delete=models.CASCADE, related_name='bills')
    apartment = models.ForeignKey(Apartment_numbers, on_delete=models.CASCADE, related_name='apartment_bills')  # FK to Apartment_numbers
    bill_type = models.CharField(max_length=100)  # Removed choices, allowing free text input
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bill of {self.amount} by {self.added_by.name} for {self.bill_type}"
      
# class FrequentGuest(models.Model):
#     resident = models.ForeignKey(CommonUser, on_delete=models.CASCADE, related_name='frequent_guests')
#     name = models.CharField(max_length=100)
#     relationship = models.CharField(max_length=50)
#     phone_number = models.CharField(max_length=15)