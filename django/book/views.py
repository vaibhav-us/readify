from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator
from django.db import connection as conn

@api_view(['GET'])
def get_book(request,book_id):
    with conn.cursor() as cur:
            cur.execute("SELECT * FROM book WHERE book_id = %s ;",(book_id,))
            book = cur.fetchone()
            cur.execute("SELECT * FROM genre WHERE book_id = %s ;",(book_id,))
            genre = cur.fetchall()
            genres=[]
    for i in genre:
        g = i[2]
        genres.append(g)
    data={
         "book_id":book[0],
         
         "book_title":book[2],
         "author":book[3],
         "cover_pic":book[4],
         "description":book[5],
         "published_on":book[6],
         "avg_rating":book[7],
         "genre":genres
        }
    return Response({"data":data})

@api_view(['POST','GET'])
def search_books(request):
    if request.method=='POST':
        genre = request.data.get('genre')
        key = request.data.get('keyword')
        page_no= request.data.get('pageno')
        items_per_page = 10
        query = "SELECT book.book_id,book.book_title,book.author,book.cover_pic,book.description,book.published_on,book.avg_rating,GROUP_CONCAT(genre.genre) FROM book JOIN genre ON book.book_id = genre.book_id "
        if genre and key is None:
            pass
        if  key:
             query += f" WHERE book.book_title LIKE '%{key}%' OR book.author LIKE '%{key}%' "
        if genre:
             query += f" WHERE book.book_id IN (SELECT genre.book_id FROM genre WHERE genre.genre LIKE '%{genre}%') "
        query += f" GROUP BY book.book_id,book.book_title,book.author,book.cover_pic,book.description,book.published_on,book.avg_rating "
        with conn.cursor() as cur:
            cur.execute(query)
            row = cur.fetchall()

        paginator=Paginator(row,items_per_page)
        page=paginator.get_page(page_no)
        results = []
        for book in page:
            result = {
                "book_id":book[0],
                "book_title":book[1],
                "author":book[2],
                "cover_pic":book[3],
                "description":book[4],
                "published_on":book[5],
                "avg_rating":book[6],
                "genre":book[7]
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
                INSERT INTO book(user_id,book_title,author,cover_pic,description) VALUES (%s,%s,%s,%s,%s);
                ''',(user_id,book_title,author,cover_pic,description))
              cur.execute("SELECT book_id FROM book WHERE book_title = %s",(book_title))
              book_id = cur.fetchone()
              cur.execute('''
                    INSERT INTO genre(book_id,genre) VALUES(%s,%s)
                    ''',(book_id,genre))
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

@api_view(['POST','GET'])
def all_books(request):
    if request.method=='POST':
        page_no= request.data.get('pageno')
        items_per_page = 10
        query = " SELECT book.book_id,book.book_title,book.author,book.cover_pic,book.avg_rating FROM book ; "
        with conn.cursor() as cur:
            cur.execute(query)
            row = cur.fetchall()

        paginator=Paginator(row,items_per_page)
        page=paginator.get_page(page_no)
        results = []
        for book in page:
            result = {
                "book_id":book[0],
                "book_title":book[1],
                "author":book[2],
                "cover_pic":book[3],
                "avg_rating":book[4]
                
                }
            results.append(result) 
        return Response({"data":results})
    return Response({"message":"error"})