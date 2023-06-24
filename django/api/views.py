from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db import connection as conn
from . import models

@api_view(['POST'])
def signUp(request):
    name = request.data.get('name')
    password = request.data.get('password')
    email = request.data.get('email')
    with conn.cursor() as cur:
        cur.execute("INSERT INTO user(user_email,user_name,password) VALUES (%s,%s,%s);",(email,name,password))
    
    token = {'message':'hello there'}
    return Response (token)


@api_view(['POST'])
def signIn(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        with conn.cursor() as cur:
            cur.execute("SELECT password FROM user WHERE user_email =%s ;",(email,))
            data = cur.fetchone()
            if data is not None and data[0] == password:
                token = {'message':'hello there'}
            return Response(token)
    return Response({"message":"error"})

@api_view(['GET'])
def book(request,id):
    with conn.cursor() as cur:
            cur.execute("SELECT * FROM book WHERE book_id = %s ;",(id,))
            book = cur.fetchone()
    data={
         "book":book,
        }
    return Response(data)

@api_view(['GET'])
def review(request,id):
      with conn.cursor() as cur:
            cur.execute('''
                SELECT user_name,review,rating FROM review JOIN user ON user.user_id = review.user_id WHERE book_id = %s ;
            ''',(id,))
            review = cur.fetchall()
      return Response({"review":review})

@api_view(['GET'])
def comment(request,id,rid):
      with conn.cursor() as cur:
            cur.execute('''
                SELECT user_name,comment,like FROM feedback JOIN user ON user.user_id = feedback.user_id WHERE feedback.book_id = %s AND feedback.review_id = %s ;
            ''',(id,rid,))
            comment = cur.fetchall()
      return Response({"comment":comment})  

@api_view(['GET'])
def bookCard(request):
    with conn.cursor() as cur:
            cur.execute('''
                SELECT book_title,author,cover_pic,avg_rating FROM book;
            ''')
            data = cur.fetchall()
            
    return Response({"data":data}) 


















@api_view(['GET'])
def newRelease(request):
    with conn.cursor() as cur:
            cur.execute("SELECT * FROM book;")
            data = cur.fetchall()
    return Response({"data":data})

@api_view(['GET'])
def searchByGenre(request,id):
    with conn.cursor() as cur:
            cur.execute("SELECT * FROM book WHERE genre = %s ;",(id,))
            data = cur.fetchall()
    return Response({"data":data})