from django.urls import path
from core.views import user_views, product_views, order_views


urlpatterns = []

urlpatterns = [
    path(
        "users/login/",
        user_views.MyTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path("users/register/", user_views.registerUser, name="register"),
    path("users/profile/", user_views.getUserProfile, name="users-profile"),
    path(
        "users/profile/update/",
        user_views.updateUserProfile,
        name="users-profile-update",
    ),
    path("users/", user_views.getUsers, name="users"),
    path("users/delete/<str:pk>/", user_views.deleteUser, name="user-delete"),
    path("users/update/<str:pk>/", user_views.updateUser, name="user-update"),
    path("users/<str:pk>/", user_views.getUserById, name="user"),
    path("prodotti/top", product_views.getTopProducts, name="top-products"),
    path("prodotti/", product_views.getProducts, name="products"),
    path(
        "prodotti/create/",
        product_views.createProduct,
        name="product-create",
    ),
    path(
        "prodotti/upload/",
        product_views.uploadImage,
        name="product-upload",
    ),
    path("prodotti/<str:pk>/", product_views.getProduct, name="product"),
    path(
        "prodotti/<str:pk>/reviews/",
        product_views.createProductReview,
        name="create-review",
    ),
    path(
        "prodotti/delete/<str:pk>/",
        product_views.deleteProduct,
        name="product-delete",
    ),
    path(
        "prodotti/update/<str:pk>/",
        product_views.updateProduct,
        name="product-update",
    ),
    path("ordini/aggiungi/", order_views.addOrderItems, name="orders-add"),
    path("ordini/", order_views.getOrders, name="get-orders"),
    path("ordini/mieiordini/", order_views.getMyOrders, name="myorders"),
    path(
        "ordini/<str:pk>/consegna/",
        order_views.updateOrderToDelivered,
        name="order-delivered",
    ),
    path("ordini/<str:pk>/", order_views.getOrderById, name="user-order"),
    path("ordini/<str:pk>/paga/", order_views.updateOrderToPaid, name="pay"),
]
