# serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import *

class CommonUserSerializer(serializers.ModelSerializer):
    house_number_temp = serializers.CharField(write_only=True)
    class Meta:
        model = CommonUser
        fields = ['id', 'name', 'email', 'phoneNumber', 'password', 'house_number_temp', 'no_family_memebers', 'is_active', 'is_committee', 'is_resident']
        extra_kwargs = {'password': {'write_only': True}}  # Ensure password is write-only

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        
        house_number_str = validated_data.pop('house_number_temp')
        
        apartment_number, created = Apartment_numbers.objects.get_or_create(apartment_number=house_number_str)
        
        user = CommonUser(**validated_data, house_number=apartment_number)
        user.save()

        family_members_count = CommonUser.objects.filter(house_number=apartment_number).count()
        user.no_family_memebers = family_members_count
        user.save()
        CommonUser.objects.filter(house_number=apartment_number).update(no_family_memebers=family_members_count)

        apartment, created = Apartment.objects.get_or_create(apartment_number=apartment_number)
        if created:
            apartment.total_members = CommonUser.objects.filter(house_number=apartment_number).count()
            apartment.total_vehicels = 0
            apartment.total_workers = 0
            apartment.total_pets = Pet.objects.filter(resident__house_number=apartment_number).count()
            apartment.save()
        else:
            apartment.total_members = CommonUser.objects.filter(house_number=apartment_number).count()
            apartment.total_pets = Pet.objects.filter(resident__house_number=apartment_number).count()
            apartment.save()

        if validated_data.get('is_resident'):
            Resident.objects.create(cuser=user)
        if validated_data.get('is_committee'):
            Committee.objects.create(cuser=user)

        return user

class ResidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resident
        fields = ['id', 'cuser']

class CommitteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Committee
        fields = ['id', 'cuser']
        
class SecuritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Security
        fields = ['id', 'name', 'phoneNumber', 'password', 'shift', 'gateno_duty']

class getUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonUser
        fields = ['id', 'email', 'name', 'phoneNumber', 'house_number', 'no_family_memebers', 'is_resident', 'is_committee']

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ['id', 'name', 'animal_type', 'resident', 'apartment']
        
class ApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = ['id', 'apartment_number', 'total_members', 'total_vehicels', 'total_workers', 'total_pets']
        
class Apartment_numberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment_numbers
        fields = ['id', 'apartment_number']       
    
class DailyHelpSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyHelp
        fields = ['id', 'added_by', 'apartment', 'name', 'job', 'phone_number']
        read_only_fields = ['added_by', 'apartment'] 


class VehicleSerializer(serializers.ModelSerializer):
    resident = serializers.StringRelatedField(read_only=True)  # To show resident user string representation
    house_no = serializers.StringRelatedField(read_only=True)  # To show house_no (apartment) string representation

    class Meta:
        model = Vehicle
        fields = ['id', 'resident', 'house_no', 'vehicle_type', 'license_plate']

class ReminderSerializer(serializers.ModelSerializer):
    resident = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Reminder
        fields = ['id', 'resident', 'message', 'created_at', 'viewed']
        
class NoticeBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeBoard
        fields = ['id', 'title', 'content', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = ['id', 'added_by', 'apartment', 'bill_type', 'amount', 'description', 'due_date', 'created_at']
        read_only_fields = ['added_by', 'apartment', 'created_at']
