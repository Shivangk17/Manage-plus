# Generated by Django 5.1 on 2024-09-16 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accountsTrial', '0003_alter_commonuser_house_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='Security',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('phoneNumber', models.CharField(max_length=10)),
                ('password', models.CharField(max_length=255)),
                ('shift', models.CharField(max_length=20)),
                ('gateno_duty', models.CharField(max_length=50)),
            ],
        ),
    ]