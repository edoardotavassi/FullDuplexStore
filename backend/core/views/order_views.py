from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.hashers import make_password
from rest_framework import status

from ..models import Product, Order, OrderItem, ShippingAddress
from django.contrib.auth.models import User
from ..serializers import ProductSerializer, OrderSerializer
from datetime import datetime


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data["orderItems"]

    if orderItems and len(orderItems) == 0:
        return Response(
            {"detail": "Nessun Prodotto"}, status=status.HTTP_400_BAD_REQUEST
        )
    else:
        # crea ordine

        order = Order.objects.create(
            user=user,
            payment_method=data["paymentMethod"],
            tax_price=data["taxPrice"],
            shipping_price=data["shippingPrice"],
            total_price=data["totalPrice"],
        )
        # crea indirizzo

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data["shippingAddress"]["address"],
            city=data["shippingAddress"]["city"],
            postal_code=data["shippingAddress"]["postalCode"],
            country=data["shippingAddress"]["country"],
        )
        # crea prodotti dell'ordine e crea la relazione

        for _item in orderItems:
            product = Product.objects.get(id=_item["product"])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                quantity=_item["quantity"],
                price=_item["price"],
                image=product.image.url,
            )
            # update dell'inventario

            product.count_in_stock -= item.quantity
            product.save()
        serializer = OrderSerializer(order, many=False)

        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user

    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response(
                {"detail": "Non autorizzato"}, status=status.HTTP_400_BAD_REQUEST
            )
    except:
        return Response(
            {"detail": "L'ordine non esiste"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(id=pk)

    order.is_paid = True
    order.paid_at = datetime.now()
    order.save()

    return Response("Ordine Pagato")


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(id=pk)

    order.is_delivered = True
    order.delivered_at = datetime.now()
    order.save()

    return Response("Ordine Consegnato")
