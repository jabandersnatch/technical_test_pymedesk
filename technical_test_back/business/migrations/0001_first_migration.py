# Generated by Django 4.2.3 on 2023-07-13 04:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('address', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=200)),
                ('email', models.CharField(max_length=200)),
                ('city', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField(auto_now_add=True)),
                ('status', models.CharField(choices=[('P', 'Pending'), ('R', 'In Progress'), ('D', 'Delivered'), ('C', 'Cancelled')], default='P', max_length=1)),
                ('paid', models.BooleanField(default=False)),
                ('delivery_rule', models.CharField(choices=[('H', 'Home Delivery'), ('P', 'Pickup')], default='H', max_length=1)),
                ('observations', models.CharField(blank=True, max_length=200)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='business.customer')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.IntegerField()),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='business.order')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='business.product')),
            ],
        ),
    ]
