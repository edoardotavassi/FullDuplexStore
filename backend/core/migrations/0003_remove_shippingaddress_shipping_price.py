# Generated by Django 4.1 on 2022-08-29 09:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_product_image"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="shippingaddress",
            name="shipping_price",
        ),
    ]