from django.urls import path
from . import views

urlpatterns = [
    path('searchbooks/',views.search_books), 
    path('book/<str:book_id>/',views.get_book),
    path('<str:user_id>/addbook/',views.add_book),
    path('<str:user_id>/book/<str:book_id>/addreview/',views.add_review),
    path('book/<str:book_id>/review',views.review), 
    path('book/<str:book_id>/review/<str:rid>',views.comment),
    path('<str:user_id>/book/<str:book_id>/review/<str:rid>/addcomment',views.add_comment),
    path('<str:user_id>/<str:review_id>/like',views.like_review),
    path('<str:user_id>/<str:book_id>/addshelf',views.add_shelf),
    path('<str:user_id>/<str:book_id>/remshelf',views.rem_shelf),
    path('<str:user_id>/activity/',views.activity),
    path('isbook/',views.isBook)
]
