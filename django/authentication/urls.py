from django.urls import path
from . import views

urlpatterns = [
    path('user/signup/',views.signUp),
    path('user/signin/',views.signIn),
    path('user/home/',views.home),
      
]
