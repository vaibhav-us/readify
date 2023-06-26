from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.db import connection as conn

@api_view(['GET'])
def book(request,book_id):
    with conn.cursor() as cur:
            cur.execute("SELECT * FROM book WHERE book_id = %s ;",(book_id,))
            book = cur.fetchone()
    
    data={
         "genre":book[2],
         "book_title":book[3],
         "author":book[4],
         "cover_pic":book[5],
         "description":book[6],
         "published_on":book[7],
         "avg_rating":book[8]
        }
    return Response({"data":data})

@api_view(['POST','GET'])
def searchBook(request):
    if request.method=='POST':
        key = request.data.get('keyword')
        page_no= request.data.get('pageno')
        items_per_page = 10
        with conn.cursor() as cur:
            cur.execute('''
                SELECT book_title,author,cover_pic,avg_rating FROM book
                WHERE book_title LIKE %s OR author LIKE %s;
            ''',('%' + key + '%', '%' + key + '%'))
            row = cur.fetchall()
        paginator=Paginator(row,items_per_page)
        page=paginator.get_page(page_no)
        results = []
        for i in page:
            result = {
              "book_title":i[0],
              "author":i[1],
              "cover_pic":i[2],
              "avg_rating":i[3]
            }
            results.append(result) 
        return Response({"data":results})
    return Response({"message":"error"})


@api_view(['GET','POST'])
def review(request,book_id):
    if request.method=='POST':
        page_no = request.data.get('pageno')
        items_per_page = 10
        with conn.cursor() as cur:
            cur.execute('''
                SELECT user_name,review,rating FROM review JOIN user ON user.user_id = review.user_id
                WHERE book_id = %s ;
            ''',(book_id,))
            row = cur.fetchall()
        paginator= Paginator(row,items_per_page)
        page = paginator.get_page(page_no)
        reviews=[]
        for i in page:
             review = {
               "user_name":i[0],
               "review":i[1],
               "rating":i[2],
                }
             reviews.append(review)
        return Response({"data":reviews})
    return Response({"mess":"error"})


@api_view(['GET'])
def comment(request,book_id,rid):
      with conn.cursor() as cur:
            cur.execute('''
                SELECT user_name,comment,like FROM feedback JOIN user ON user.user_id = feedback.user_id WHERE feedback.book_id = %s AND feedback.review_id = %s ;
            ''',(book_id,rid,))
            comment = cur.fetchall()
      return Response({"comment":comment})  

@api_view(['POST'])
def bookCard(request):
    if request.method == 'POST':
        page_no = request.data.get('pageno')
        with conn.cursor() as cur:
            cur.execute('''
                SELECT * FROM book;
            ''')
            row = cur.fetchall()
        results=[]
        paginator=Paginator(row,10)
        page=paginator.get_page(page_no)
        for book in page:
            result = {
                "genre":book[2],
                "book_title":book[3],
                "author":book[4],
                "cover_pic":book[5],
                "description":book[6],
                "published_on":book[7],
                "avg_rating":book[8]
                }
            results.append(result)       
        return Response({"data":results})
    return Response({"message":"error"}) 

@login_required
@api_view(['POST'])
def addReview(request,user_id,book_id):
     review = request.data.get("review")
     rating = request.data.get("rating")
     with conn.cursor() as cur:
        cur.execute('''
          INSERT INTO review(user_id,book_id,review,rating) VALUES (%s,%s,%s, %s);
        ''',(user_id,book_id,review,rating))


     return Response({"message":"added"})













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
