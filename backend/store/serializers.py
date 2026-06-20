from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Category,
    Product,
    ProductImage,
    ProductVariant,
    UserProfile,
    Address,
    CartItem,
    Order,
    OrderItem
)

# ============================
# USER SERIALIZERS
# ============================

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'user',
            'phone_number',
            'profile_image',
            'created_at',
            'updated_at'
        ]


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(required=False)

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        phone = validated_data.get("phone_number")

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        UserProfile.objects.create(
            user=user,
            phone_number=phone
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        }


# ============================
# ADDRESS SERIALIZER
# ============================

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


# ============================
# CATEGORY SERIALIZERS
# ============================

class CategoryChildSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'image',
            'display_order'
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class CategorySerializer(serializers.ModelSerializer):
    children = CategoryChildSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'image',
            'parent',
            'children',
            'is_active',
            'display_order'
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


# ============================
# PRODUCT IMAGE SERIALIZER
# ============================

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_default']

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


# ============================
# PRODUCT VARIANT SERIALIZER
# ============================

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            'id',
            'name',
            'price',
            'stock_quantity',
            'sku'
        ]


# ============================
# PRODUCT SERIALIZER
# ============================

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    final_price = serializers.SerializerMethodField()
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'sku',
            'category',
            'category_name',
            'description',
            'short_description',
            'price',
            'discount_price',
            'final_price',
            'stock_quantity',
            'is_in_stock',
            'is_active',
            'featured_image',
            'images',
            'variants',
            'created_at'
        ]

    def get_final_price(self, obj):
        return obj.get_price()

    def get_featured_image(self, obj):
        request = self.context.get("request")
        if obj.featured_image and request:
            return request.build_absolute_uri(obj.featured_image.url)
        return None


# ============================
# CART SERIALIZER
# ============================

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'product_name',
            'variant',
            'quantity',
            'price',
            'total_price',
            'product_image'
        ]

    def get_total_price(self, obj):
        return obj.price * obj.quantity

    def get_product_image(self, obj):
        request = self.context.get("request")
        if obj.product and obj.product.featured_image and request:
            return request.build_absolute_uri(obj.product.featured_image.url)
        return None


# ============================
# ORDER ITEM SERIALIZER
# ============================

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'variant',
            'quantity',
            'price',
            'total_price',
            'product_image'
        ]

    def get_product_image(self, obj):
        request = self.context.get("request")
        if obj.product and obj.product.featured_image and request:
            return request.build_absolute_uri(obj.product.featured_image.url)
        return None


# ============================
# ORDER SERIALIZER
# ============================

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(
        source='user_profile.user.email',
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'user_profile',
            'user_email',
            'shipping_address',
            'total_amount',
            'tax_amount',
            'discount_amount',
            'coupon_code',
            'payment_status',
            'payment_method',
            'status',
            'tracking_number',
            'is_returned',
            'notes',
            'items',
            'created_at'
        ]
