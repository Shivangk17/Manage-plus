# admin.py
from django.contrib import admin
from .models import *

admin.site.register(CommonUser)
admin.site.register(Resident)
admin.site.register(Committee)
admin.site.register(Security)
admin.site.register(Pet)
admin.site.register(Apartment_numbers)
admin.site.register(Apartment)
admin.site.register(DailyHelp)
admin.site.register(Vehicle)
admin.site.register(Reminder)
admin.site.register(NoticeBoard)
admin.site.register(Bill)