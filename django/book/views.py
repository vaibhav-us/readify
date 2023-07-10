from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator
from django.db import connection as conn
import json

@api_view(['GET'])
def get_book(request,book_id):
    if request.method == 'GET' :
        with conn.cursor() as cur:
                cur.execute("SELECT * FROM book WHERE book_id = %s ;",(book_id,))
                book = cur.fetchone()
                cur.execute("SELECT *  FROM genre WHERE book_id = %s ;",(book_id,))
                genre = cur.fetchall()
                cur.execute("SELECT COUNT(review) FROM review WHERE book_id = %s ; ",(book_id,))
                review_count = cur.fetchone()
                cur.execute("SELECT COUNT(rating) FROM review WHERE book_id = %s ; ",(book_id,))
                rating_count = cur.fetchone()
        genres=[]
        for i in genre:
            g = i[2]
            genres.append(g)
        data={
            "id":book[0],
            "name":book[2],
            "author":book[3],
            "image":book[4],
            "description":book[5],
            "publication":book[6],
            "rating":book[7],
            "genre":genres,
            "reviewCount": review_count[0],
            "ratingCount":rating_count[0]
            }
        return Response({"data":data})
    else :
        return Response({"message":"error"})

@api_view(['POST','GET'])
def search_books(request):
    if request.method=='POST':
        genre = request.data.get('genre')
        key = request.data.get('book')
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
            genres = book[7].split(",")
            result = {
                "id":book[0],
                "name":book[1],
                "author":book[2],
                "image":book[3],
                "description":book[4],
                "publication":book[5],
                "rating":book[6],
                "genre":genres
                }
            results.append(result) 
        return Response({"data":results})
    else:
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
    else:
        return Response({"messsage":"enter details"})      
         

@api_view(['GET','POST'])
def review(request,book_id):
    if request.method=='POST':
        page_no = request.data.get('pageno')
        items_per_page = 10
        with conn.cursor() as cur:
            cur.execute('''
    SELECT user.user_name, review.review_id, COALESCE(review.review, '') AS review, review.rating, COALESCE(review.tags, '[]') AS tags, review.spoiler, review.likes, COUNT(comment), review.date
    FROM review
    JOIN user ON user.user_id = review.user_id
    LEFT JOIN feedback ON feedback.review_id = review.review_id
    WHERE review.book_id = %s
    GROUP BY review.review_id;
            ''', (book_id,))

            row = cur.fetchall()
            total_count = len(row)
        paginator= Paginator(row,items_per_page)
        page = paginator.get_page(page_no)
        reviews=[]
        for i in page:
             tags = json.loads(i[4]) or ['']
             review = {
               "name":i[0],
               "id":i[1] ,
               "review":i[2],
               "rating":i[3],
               "tags":tags,
               "spoiler":i[5] ,
               "likes": i[6],
               "comments":i[7],
               "date":i[8]
                }
             reviews.append(review)
        return Response({"data":reviews,"totalCount":total_count})
    else:
        return Response({"message":"error"})


@api_view(['GET'])
def comment(request,book_id,rid):
      with conn.cursor() as cur:
            cur.execute('''
                SELECT feedback_id,user_name,comment FROM feedback JOIN user ON user.user_id = feedback.user_id  WHERE feedback.book_id = %s AND feedback.review_id = %s ;
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
    else:
        return Response({"message":"enter details"})


@api_view(['POST'])
def like_review(request,user_id,review_id):
    isLiked = request.data.get("isliked")
    if request.method == 'POST':
        row = []
        if isLiked == "true":
            with conn.cursor() as cur:
                cur.execute('''
                INSERT INTO likes(user_id,review_id) VALUES (%s,%s)
                ''',(user_id,review_id))
                cur.execute("SELECT * FROM likes WHERE review_id = %s ",(review_id,))
                row = cur.fetchall()  
        if isLiked == "false":     
            with conn.cursor() as cur:
                cur.execute('''
                    DELETE FROM likes WHERE user_id = %s AND review_id = %s ;
                    ''',(user_id,review_id))
                cur.execute("SELECT * FROM likes WHERE feeback_id = %s ",(review_id,))
                row = cur.fetchall()
        total_likes = len(row)
        with conn.cursor() as cur:
            cur.execute('''
                UPDATE review SET likes = %s WHERE review_id = %s ;
            ''',(total_likes,review_id))
            return Response({"message":"success"})   
    else: 
        return Response({"message":"error"})


@api_view(['POST'])
def add_review(request,user_id,book_id):
    if request.method == 'POST':
        review = request.data.get("review")
        rate = request.data.get("rating")
        tags = request.data.get("tags", "").split(",") 
        spoiler=request.data.get("spoiler")
        tags_str = json.dumps(tags)
        if rate == 6:
            rating = 0
        else:
            rating=rate
        if review and rate:
            with conn.cursor() as cur:
                cur.execute('''
                    INSERT INTO review(user_id,book_id,review,rating,tags,spoiler) VALUES (%s,%s,%s, %s,%s,%s);
                ''',(user_id,book_id,review,rating,tags_str,spoiler))
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
        if review and rate is None:
            with conn.cursor() as cur:
                cur.execute('''
                    INSERT INTO review(user_id,book_id,review,tags,spoiler) VALUES (%s,%s, %s,%s,%s);
                ''',(user_id,book_id,review,tags_str,spoiler))
            return Response({"message":"added"})
        if rate and review is None:
            with conn.cursor() as cur:
                cur.execute('''
                    INSERT INTO review(user_id,book_id,rating) VALUES (%s,%s, %s);
                ''',(user_id,book_id,rating))
                cur.execute('''SELECT rating FROM review WHERE book_id = %s ;''',(book_id,))
                rows = cur.fetchall()
            total_count = len(rows)
            total_rating = 0
            for row in rows:
                total_rating = total_rating +  (row[0] or 0)
            avg_rating = total_rating/total_count
            with conn.cursor() as cur:
                cur.execute('''
                    UPDATE book SET avg_rating = %s WHERE book_id = %s ;
                ''',(avg_rating,book_id))
            return Response({"message":"added"})

    else:
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
                "id":book[0],
                "name":book[1],
                "author":book[2],
                "image":book[3],
                "rating":book[4] 
            }
            results.append(result) 
        return Response({"data":results})
    else :
        return Response({"message":"error"})