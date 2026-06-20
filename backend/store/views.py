from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from .models import Product,Category,CartItem,Order,OrderItem,Address
from .serializers import ProductSerializer , CategorySerializer,CartItemSerializer,OrderSerializer
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated
from .serializers import RegisterSerializer
from rest_framework.views import APIView
from .serializers import LoginSerializer
from django.db.models import Q
from .pagination import ProductPagination
import uuid
from django.db import transaction


#  Product ReleaTED API

@api_view(['GET'])
@permission_classes([AllowAny])
def get_products(request):
    products=Product.objects.all()
    serializer=ProductSerializer(products,many=True,context={"request": request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_product_by_slug(request, slug):
    try:
        product = Product.objects.get(slug=slug)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProductSerializer(
        product,
        context={"request": request}
    )
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([AllowAny])
def search_products(request):
    search_query = request.GET.get("query", "").strip()

    products = Product.objects.filter(is_active=True)

    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) |
            Q(sku__icontains=search_query) |
            Q(category__name__icontains=search_query)
        )

    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products, request)

    serializer = ProductSerializer(
        paginated_products,
        many=True,
        context={"request": request}
    )

    return paginator.get_paginated_response(serializer.data)

# ----------------------------
# ADD TO CART
# ----------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    profile = request.user.profile
    product_id = request.data.get("product_id")
    variant = request.data.get("variant")
    quantity = int(request.data.get("quantity", 1))

    item, created = CartItem.objects.get_or_create(
        user_profile=profile,
        product_id=product_id,
        variant=variant,
        defaults={"quantity": quantity}
    )

    if not created:
        item.quantity += quantity
        item.save()

    serializer = CartItemSerializer(item, context={"request": request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# ----------------------------
# GET CART
# ----------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request):
    items = CartItem.objects.filter(user_profile=request.user.profile)
    serializer = CartItemSerializer(items, many=True, context={"request": request})

    total = sum(i.product.get_price() * i.quantity for i in items)

    return Response({
        "items": serializer.data,
        "total": total
    })


# ----------------------------
# REMOVE FROM CART
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, id):
    CartItem.objects.filter(
        id=id,
        user_profile=request.user.profile
    ).delete()

    return Response({"success": True})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def checkout(request):
    profile = request.user.profile
    address_id = request.data.get("address_id")

    if not address_id:
        return Response({"error": "Address required"}, status=400)

    address = Address.objects.get(id=address_id, user_profile=profile)
    cart_items = CartItem.objects.filter(user_profile=profile)

    if not cart_items.exists():
        return Response({"error": "Cart empty"}, status=400)

    total = sum(i.product.get_price() * i.quantity for i in cart_items)

    order = Order.objects.create(
        user_profile=profile,
        shipping_address=address,
        order_number=str(uuid.uuid4()).split("-")[0].upper(),
        total_amount=total,
        payment_method="COD",
        payment_status=False
    )

    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            variant=item.variant,
            quantity=item.quantity,
            price=item.product.get_price(),
            total_price=item.product.get_price() * item.quantity
        )

    cart_items.delete()

    serializer = OrderSerializer(order, context={"request": request})
    return Response(serializer.data, status=201)


  

#  Category related API
@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):
    # categories=Category.objects.filter(parent__isnull=True, is_active=True)
    categories=Category.objects.all()
    serializer=CategorySerializer(categories , many=True, context={"request": request})
    return Response(serializer.data)


# User releted View Api


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)