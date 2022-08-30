from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.hashers import make_password
from rest_framework import status

from ..models import Product, Review
from django.contrib.auth.models import User
from ..serializers import ProductSerializer


@api_view(["GET"])
def getProducts(request):
    query = request.query_params.get("keyword")
    if query == None:
        query = ""

    products = Product.objects.filter(name__icontains=query)

    # paginazione
    page = request.query_params.get("page")
    paginator = Paginator(products, 8)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response(
        {"products": serializer.data, "page": page, "pages": paginator.num_pages}
    )


@api_view(["GET"])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by("-rating")[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getProduct(request, pk):
    product = Product.objects.get(id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name="Nome",
        price=0,
        brand="Brand",
        count_in_stock=0,
        category="Categoria",
        description="",
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)

    product.name = data["name"]
    product.price = data["price"]
    product.brand = data["brand"]
    product.count_in_stock = data["count_in_stock"]
    product.category = data["category"]
    product.description = data["description"]

    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(id=pk)
    product.delete()
    return Response("Prodotto eliminato.")


@api_view(["POST"])
def uploadImage(request):
    data = request.data

    product_id = data["product_id"]
    product = Product.objects.get(id=product_id)

    product.image = request.FILES.get("image")
    product.save()
    return Response("Upload Completato.")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)
    data = request.data

    # review già esistente
    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {"detail": "Prodotto già valutato."}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # no rating
    elif data["rating"] == 0:
        content = {"detail": "Selezionare un voto."}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # crea
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data["rating"],
            comment=data["comment"],
        )
        reviews = product.review_set.all()
        product.num_reviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response("Commento aggiunto")
