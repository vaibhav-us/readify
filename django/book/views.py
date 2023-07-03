from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator
from django.db import connection as conn

@api_view(['GET'])
def get_book(request,book_id):
    with conn.cursor() as cur:
            cur.execute("SELECT * FROM book WHERE book_id = %s ;",(book_id,))
            book = cur.fetchone()
    data={
         "book_id":book[0],
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
def search_books(request):
    if request.method=='POST':
        genre = request.data.get('genre')
        key = request.data.get('keyword')
        page_no= request.data.get('pageno')
        items_per_page = 10
        query = "SELECT * FROM book"
        if genre and key is None:
            pass
        if  key:
             query += f" WHERE book_title LIKE '%{key}%' OR author LIKE '%{key}%' "
        if genre:
             query += f" WHERE genre = '{genre}' "
        with conn.cursor() as cur:
            cur.execute(query)
            row = cur.fetchall()

        paginator=Paginator(row,items_per_page)
        page=paginator.get_page(page_no)
        results = []
        for book in page:
            result = {
                "book_id":book[0],
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


@api_view(['POST','GET'])
def add_book(request,user_id):
    if request.method == 'POST':
         genre = request.data.get("genre")
         book_title = request.data.get("book_title")
         author = request.data.get("author")
         cover_pic = request.data.get("cover_pic")
         description = request.data.get("description")

         with conn.cursor() as cur:
              cur.execute('''
                INSERT INTO book(user_id,genre,book_title,author,cover_pic,description) VALUES (%s,%s,%s,%s,%s,%s);
                ''',(user_id,genre,book_title,author,cover_pic,description))
              
         return Response({"messsage":"added successfully"})
    return Response({"messsage":"enter details"})      
         

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
            total_count = len(row)
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
        return Response({"data":reviews,"count":total_count})
    return Response({"message":"error"})


@api_view(['GET'])
def comment(request,book_id,rid):
      with conn.cursor() as cur:
            cur.execute('''
                SELECT feedback_id,user_name,comment,likes FROM feedback JOIN user ON user.user_id = feedback.user_id  WHERE feedback.book_id = %s AND feedback.review_id = %s ;
            ''',(book_id,rid,))
            comment = cur.fetchall()
      return Response({"comment":comment}) 


@api_view(['POST'])
def add_comment(request,user_id,book_id,rid):
    if request.method == 'POST':
        comment = request.data.get("comment")
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO feedback(user_id,book_id,review_id,comment) VALUES(%s,%s,%s,%s)
            ''',(user_id,book_id,rid,comment))
        return Response({"message":"addded"})
    return Response({"message":"enter details"})


@api_view(['POST'])
def like_comments(request,user_id,feedback_id):
    isLiked = request.data.get("isliked")
    if request.method == 'POST':
        row = []
        if isLiked == "true":
            with conn.cursor() as cur:
                cur.execute('''
                INSERT INTO likes(user_id,feedback_id) VALUES (%s,%s)
                ''',(user_id,feedback_id))
                cur.execute("SELECT * FROM likes WHERE feedback_id = %s ",(feedback_id,))
                row = cur.fetchall()  
        if isLiked == "false":     
            with conn.cursor() as cur:
                cur.execute('''
                    DELETE FROM likes WHERE user_id = %s AND feedback_id = %s ;
                    ''',(user_id,feedback_id))
                cur.execute("SELECT * FROM likes WHERE feeback_id = %s ",(feedback_id,))
                row = cur.fetchall()
        total_likes = len(row)
        with conn.cursor() as cur:
            cur.execute('''
                UPDATE feedback SET likes = %s WHERE feedback_id = %s ;
            ''',(total_likes,feedback_id))
            return Response({"message":"success"})    
    return Response({"message":"error"})


@api_view(['POST'])
def add_review(request,user_id,book_id):
    if request.method == 'POST':
        review = request.data.get("review")
        rating = request.data.get("rating")
        with conn.cursor() as cur:
            cur.execute('''
          INSERT INTO review(user_id,book_id,review,rating) VALUES (%s,%s,%s, %s);
            ''',(user_id,book_id,review,rating))
            cur.execute('''SELECT rating FROM review WHERE book_id = %s ;''',(book_id,))
            rows = cur.fetchall()
            total_count = len(rows)
            total_rating = 0
        for row in rows:
            total_rating = total_rating +  row[0]
        avg_rating = total_rating/total_count
        with conn.cursor() as cur:
            cur.execute('''
          UPDATE book SET avg_rating = %s WHERE book_id = %s ;
            ''',(avg_rating,book_id))
        return Response({"message":"added"})
    return Response({"message":"enter details"})

