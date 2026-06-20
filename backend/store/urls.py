from django.urls import path
from . import views
from .views import RegisterView,LoginView,search_products,get_cart,add_to_cart,remove_cart_item,checkout


urlpatterns = [
    # Product Related 
    path("products/search/", search_products, name="product-search"),
    path('products/',views.get_products,name='product-list'),
    path('products/<slug:slug>/', views.get_product_by_slug, name='product-detail'),

    # Cart 
    path("cart/", get_cart),
    path("cart/add/", add_to_cart),
    path("cart/remove/<int:id>/", remove_cart_item), 
    path("checkout/", checkout),

# Category related
    path('categories/',views.get_categories,name='category-list'),

    # User related 
    path('auth/register/',RegisterView.as_view(),name="register"),
    path('auth/login/',LoginView.as_view(),name="login"),
]


