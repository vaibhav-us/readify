from django.urls import path
from . import views

urlpatterns = [
    path('signup/',views.signUp),
    path('signin/',views.signIn),
    path('bookcard/',views.bookCard),
    path('newrelease/',views.newRelease),
    path('sbg/<str:id>/',views.searchByGenre), 
    path('book/<str:id>/',views.book),
    path('book/<str:id>/review',views.review), 
    path('book/<str:id>/review/<str:rid>',views.comment),  
]
