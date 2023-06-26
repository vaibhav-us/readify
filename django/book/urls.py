from django.urls import path
from . import views

urlpatterns = [
    path('bookcard/',views.bookCard),
    path('newrelease/',views.newRelease),
    path('genre/<str:id>/',views.searchByGenre),
    path('search/',views.searchBook), 
    path('book/<str:book_id>/',views.book),
    path('<str:user_id>/book/<str:book_id>/addreview/',views.addReview),
    path('book/<str:book_id>/review',views.review), 
    path('book/<str:book_id>/review/<str:rid>',views.comment),
]
