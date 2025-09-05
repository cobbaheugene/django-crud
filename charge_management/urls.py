from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/charge_management/', views.get_charges, name='get_charges'),
    path('api/charge_management/create/', views.create_charge, name='create_charge'),
    path('api/charge_management/<int:charge_id>/update/', views.update_charge, name='update_charge'),
    path('api/charge_management/<int:charge_id>/delete/', views.delete_charge, name='delete_charge'),
]