from django.contrib import admin
from django.contrib.auth.models import User
from django.utils.html import format_html
from .models import (
    Category, Product, ProductImage, ProductVariant,
    UserProfile, Address, CartItem,Order, OrderItem,
)


# ---------------------------
# CATEGORY ADMIN
# ---------------------------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'is_active', 'display_order', 'image_tag', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('display_order', 'name')
    list_editable = ('is_active', 'display_order')

     # Show parent as a dropdown (or search if many categories)
    raw_id_fields = ()  # Use ('parent',) if you have many categories

    


    def image_tag(self, obj):
        """Display image thumbnail in admin"""
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "-"
    image_tag.short_description = 'Image'


# ---------------------------
# PRODUCT IMAGE INLINE
# ---------------------------
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ('image_tag',)
    fields = ('image', 'image_tag', 'alt_text', 'is_default')

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "-"
    image_tag.short_description = 'Image'


# ---------------------------
# PRODUCT VARIANT INLINE
# ---------------------------
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


# ---------------------------
# PRODUCT ADMIN
# ---------------------------
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'discount_price', 'stock_quantity', 'is_in_stock', 'is_active', 'featured_image_tag', 'created_at')
    list_filter = ('category', 'is_active', 'is_in_stock')
    search_fields = ('name', 'sku', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at', 'featured_image_tag')
    inlines = [ProductImageInline, ProductVariantInline]

    fieldsets = (
        ('Basic Information', {'fields': ('category', 'name', 'slug', 'sku', 'description', 'short_description')}),
        ('Pricing', {'fields': ('price', 'discount_price')}),
        ('Inventory', {'fields': ('stock_quantity', 'is_in_stock', 'is_active')}),
        ('Images', {'fields': ('featured_image', 'featured_image_tag')}),
        ('SEO', {'fields': ('meta_title', 'meta_description')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    def featured_image_tag(self, obj):
        if obj.featured_image:
            return format_html('<img src="{}" width="50" height="50" />', obj.featured_image.url)
        return "-"
    featured_image_tag.short_description = 'Featured Image'


# ---------------------------
# USER PROFILE INLINE ADMIN
# ---------------------------
class AddressInline(admin.TabularInline):
    model = Address
    extra = 1
    readonly_fields = ('created_at', 'updated_at')


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1
    readonly_fields = ('added_at',)


# ---------------------------
# USER PROFILE ADMIN
# ---------------------------
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'phone_number', 'is_verified', 'profile_image_tag', 'created_at')
    search_fields = ('user__email', 'phone_number')
    readonly_fields = ('created_at', 'updated_at', 'profile_image_tag')
    inlines = [AddressInline, CartItemInline]

    # Display profile image thumbnail
    def profile_image_tag(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" width="50" height="50" />', obj.profile_image.url)
        return "-"
    profile_image_tag.short_description = 'Profile Image'

    # Display user email
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'

    # Wishlist clickable links
    def wishlist_products(self, obj):
        products = obj.wishlist.all()
        if products:
            links = []
            for p in products:
                links.append(f'<a href="/admin/yourapp/product/{p.id}/change/">{p.name}</a>')
            return format_html(", ".join(links))
        return "-"
    wishlist_products.short_description = "Wishlist"


# ---------------------------
# ADDRESS ADMIN
# ---------------------------
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'label', 'line1', 'city', 'state', 'country', 'is_default')
    list_filter = ('is_default', 'city', 'state', 'country')
    search_fields = ('line1', 'line2', 'city', 'state', 'country')


# ---------------------------
# CART ITEM ADMIN
# ---------------------------
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'product', 'variant', 'quantity', 'added_at')
    search_fields = ('user_profile__user__email', 'product__name', 'variant')


# ---------------------------
# ORDER ITEM INLINE WITH THUMBNAIL
# ---------------------------
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_thumbnail', 'product_name', 'variant', 'quantity', 'price', 'total_price')
    fields = ('product_thumbnail', 'product_name', 'variant', 'quantity', 'price', 'total_price')

    def product_thumbnail(self, obj):
        if obj.product and obj.product.featured_image:
            return format_html('<img src="{}" width="50" height="50" />', obj.product.featured_image.url)
        return "-"
    product_thumbnail.short_description = 'Image'

    def product_name(self, obj):
        if obj.product:
            return format_html('<a href="/admin/yourapp/product/{}/change/">{}</a>', obj.product.id, obj.product.name)
        return "Deleted Product"
    product_name.short_description = "Product"


# ---------------------------
# ORDER ADMIN
# ---------------------------
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user_email', 'total_amount', 'status', 'payment_status', 'is_returned', 'created_at')
    list_filter = ('status', 'payment_status', 'is_returned', 'created_at')
    search_fields = ('order_number', 'user_profile__user__email')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [OrderItemInline]

    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user_profile', 'shipping_address')
        }),
        ('Payment & Pricing', {
            'fields': ('total_amount', 'tax_amount', 'discount_amount', 'payment_status', 'payment_method', 'coupon_code')
        }),
        ('Status & Shipment', {
            'fields': ('status', 'tracking_number', 'is_returned', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def user_email(self, obj):
        return obj.user_profile.user.email
    user_email.short_description = 'User Email'


# ---------------------------
# OPTIONAL: OrderItem admin standalone (if needed)
# ---------------------------
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('product_thumbnail', 'order', 'product_name', 'variant', 'quantity', 'price', 'total_price')
    search_fields = ('order__order_number', 'product__name', 'variant')
    readonly_fields = ('product_thumbnail', 'product_name')

    def product_thumbnail(self, obj):
        if obj.product and obj.product.featured_image:
            return format_html('<img src="{}" width="50" height="50" />', obj.product.featured_image.url)
        return "-"
    product_thumbnail.short_description = 'Image'

    def product_name(self, obj):
        if obj.product:
            return obj.product.name
        return "Deleted Product"
