from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator
from django.db import connection as conn
import json
from datetime import date



@api_view(['POST'])
def get_book(request,book_id):
    if request.method == 'POST' :
        user_id = request.data.get("userid")
        
        with conn.cursor() as cur:
                cur.execute("SELECT * FROM book WHERE book_id = %s ;",(book_id,))
                book = cur.fetchone()
                cur.execute("SELECT *  FROM genre WHERE book_id = %s ;",(book_id,))
                genre = cur.fetchall()
                cur.execute("SELECT COUNT(review) FROM review WHERE book_id = %s AND review IS NOT NULL; ",(book_id,))
                review_count = cur.fetchone()
                cur.execute("SELECT COUNT(rating) FROM review WHERE book_id = %s AND rating!=0 AND rating IS NOT NULL ; ",(book_id,))
                rating_count = cur.fetchone()
                cur.execute("SELECT * FROM shelf WHERE user_id = %s and book_id = %s",(user_id,book_id))
                shelfItem = cur.fetchone()
        if (shelfItem):
            isShelf = 1
        else:
            isShelf= 0
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
            "ratingCount":rating_count[0],
            "isShelf" :isShelf ,
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
        count = len(row)
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
        return Response({"data":results,"totalbooks":count})
    else:
        return Response({"message":"error"})


@api_view(['POST','GET'])
def add_book(request,user_id):
    if request.method == 'POST':
         genres = request.data.get("genres", "").split(",")
         book_title = request.data.get("name")
         author = request.data.get("author")
         cover_pic = request.data.get("image")
         description = request.data.get("desc")
         date = request.data.get("publication")

         with conn.cursor() as cur:
              cur.execute('''
                INSERT INTO book(user_id,book_title,author,cover_pic,description,published_on) VALUES (%s,%s,%s,%s,%s,%s);
                ''',(user_id,book_title,author,cover_pic,description,date))
              cur.execute("SELECT book_id FROM book WHERE book_title = %s",(book_title,))
              book_id = cur.fetchone()[0]
              for genre in genres:
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
        user_id = request.data.get('userid') 
        getOneReview = request.data.get('getOneReview') 

        items_per_page = 10
        with conn.cursor() as cur:
            cur.execute(f"""
    SELECT user.user_name, review.review_id,review.review, review.rating,review.tags, review.spoiler, review.likes, COUNT(comment), review.date
    FROM review
    JOIN user ON user.user_id = review.user_id
    LEFT JOIN feedback ON feedback.review_id = review.review_id
    WHERE review.book_id = {book_id} {'AND review.user_id = '+ str(user_id) if getOneReview else 'AND review.review IS NOT NULL AND review.user_id != '+ str(user_id)} 
    GROUP BY review.review_id;
            """)
            row = cur.fetchall()
            total_count = len(row)
        with conn.cursor() as cur:
            cur.execute('''
                SELECT review_id
                FROM likes
                WHERE user_id = %s;
            ''', (user_id,))

            liked_review_ids = {row[0] for row in cur.fetchall()}
        paginator= Paginator(row,items_per_page)
        page = paginator.get_page(page_no)
        reviews=[]
        for i in page:
             if i[4] is not None:
                tags = json.loads(i[4])
             else:
                 tags = [""]
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
        return Response({"data":reviews,"totalCount":total_count,"isLiked": liked_review_ids})
    else:
        return Response({"message":"error"})


@api_view(['GET','POST'])
def comment(request,book_id,rid):
    if request.method =="POST":
        pageno = request.data.get("pageno")
        
        with conn.cursor() as cur:    
            cur.execute('''
                SELECT feedback_id,user_name,comment FROM feedback JOIN user ON user.user_id = feedback.user_id  WHERE feedback.book_id = %s AND feedback.review_id = %s ;
            ''',(book_id,rid,))
            comments = cur.fetchall()
        count = len(comments)
        paginator = Paginator(comments,10)
        page = paginator.get_page(pageno)
        results=[]
        for i in page:
            result = {
                "id":i[0],
                "name":i[1],
                "comment":i[2]
                }
            results.append(result)
        return Response({"comment":results,"totalCount":count})
    else:
        return Response({"message":"enter pageno"})

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
    
    if request.method == 'POST':
        isLiked = request.data.get("isliked")
        row = []
        if isLiked == True:
            with conn.cursor() as cur:
                cur.execute('''
                INSERT INTO likes(user_id,review_id) VALUES (%s,%s)
                ''',(user_id,review_id))
                cur.execute("SELECT * FROM likes WHERE review_id = %s ",(review_id,))
                row = cur.fetchall()  
        if isLiked == False:     
            with conn.cursor() as cur:
                cur.execute('''
                    DELETE FROM likes WHERE user_id = %s AND review_id = %s ;
                    ''',(user_id,review_id))
                cur.execute("SELECT * FROM likes WHERE review_id = %s ",(review_id,))
                row = cur.fetchall()
        total_likes = len(row)
        with conn.cursor() as cur:
            cur.execute('''
                UPDATE review SET likes = %s WHERE review_id = %s ;
            ''',(total_likes,review_id))
            return Response({"message":"success"})   
    else: 
        return Response({"message":"error"})

def setAvgRating(book_id):
    with conn.cursor() as cur:
        cur.execute('''SELECT rating FROM review WHERE book_id = %s ;''',(book_id,))
        rows = cur.fetchall()
    rating=[]
    total_rating = 0
    for row in rows:
        if row[0]:
            total_rating += row[0]
            rating.append(row[0])
    count = len(rating)

    avg_rating =total_rating/count if count else 0 


    with conn.cursor() as cur:
        cur.execute('''
            UPDATE book SET avg_rating = %s WHERE book_id = %s ;
            ''',(round(avg_rating,2),book_id))
        
def updateActivity(user_id,rate,review,rating,book_id,book_title,):
    activity =""
    if review and rating:
        activity = "reviewed and rated"
    elif review and rate is None:
        activity = "reviewed"
    else:
        activity = "rated"
    with conn.cursor() as cur:
        cur.execute("INSERT INTO activity(user_id,act,book_id,book_title,date,rating) VALUES(%s,%s,%s,%s,%s,%s)",(user_id,activity,book_id,book_title,date.today(),rating))

@api_view(['POST'])
def add_review(request,user_id,book_id):
    if request.method == 'POST':
        with conn.cursor() as cur:
            cur.execute("SELECT review_id,book_id FROM review WHERE user_id = %s AND book_id = %s  ;",(user_id,book_id))
            existingReview = cur.fetchone()
            if existingReview:
                cur.execute("SELECT book_title FROM book WHERE book_id = %s",(existingReview[1],))
                book_title = cur.fetchone()[0]
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
            if existingReview:
                with conn.cursor() as cur:
                    cur.execute('''
                        UPDATE review SET user_id = %s,book_id = %s,review = %s,rating =%s,tags=%s,spoiler=%s
                        WHERE user_id = %s AND book_id = %s;
                    ''',(user_id,book_id,review,rating,tags_str,spoiler,user_id,book_id))
                setAvgRating(book_id)
                updateActivity(user_id,rate,review,rating,book_id,book_title,)
                return Response({"message":"updated"})
            else:
                with conn.cursor() as cur:
                    cur.execute('''
                        INSERT INTO review(user_id,book_id,review,rating,tags,spoiler) VALUES (%s,%s,%s, %s,%s,%s);
                    ''',(user_id,book_id,review,rating,tags_str,spoiler))
                setAvgRating(book_id)
                updateActivity(user_id,rate,review,rating,book_id,book_title,)
                return Response({"message":"added"})
        if review and rate is None:
            if existingReview:
                with conn.cursor() as cur:
                    cur.execute('''
                        UPDATE review SET user_id = %s,book_id = %s,review = %s,tags=%s,spoiler=%s
                        WHERE user_id = %s AND book_id = %s;
                    ''',(user_id,book_id,review,tags_str,spoiler,user_id,book_id))
                updateActivity(user_id,rate,review,rating,book_id,book_title,)
                return Response({"message":"updated"})
            else:
                with conn.cursor() as cur:
                    cur.execute('''
                        INSERT INTO review(user_id,book_id,review,tags,spoiler) VALUES (%s,%s, %s,%s,%s);
                    ''',(user_id,book_id,review,tags_str,spoiler))
                updateActivity(user_id,rate,review,rating,book_id,book_title,)
                return Response({"message":"added"})
        if rate and review is None:
            if existingReview:
                with conn.cursor() as cur:
                    cur.execute('''
                        UPDATE review SET user_id = %s,book_id = %s,rating=%s
                        WHERE user_id = %s AND book_id = %s;
                    ''',(user_id,book_id,rating,user_id,book_id))
                setAvgRating(book_id)
                updateActivity(user_id,rate,review,rating,book_id,book_title,)
                return Response({"message":"updated"})
            else:
                with conn.cursor() as cur:
                    cur.execute('''
                      INSERT INTO review(user_id,book_id,rating) VALUES (%s,%s, %s);
                    ''',(user_id,book_id,rating))
                setAvgRating(book_id)
                updateActivity(user_id,rate,review,rating,book_id,book_title,)
                return Response({"message":"added"})

    else:
        return Response({"message":"enter details"})

@api_view(['GET'])
def add_shelf(request,user_id,book_id):
    with conn.cursor() as cur:
        cur.execute('''
                INSERT INTO shelf(user_id,book_id) VALUES (%s,%s)
            ''',(user_id,book_id))

    return Response({"message":"book added to shelf"})


@api_view(["GET"])
def rem_shelf(request,user_id,book_id):
    with conn.cursor() as cur:
        cur.execute('''
                DELETE FROM shelf WHERE user_id = %s AND book_id = %s ;
            ''',(user_id,book_id))

    return Response({"message":"book added to shelf"})






@api_view(['POST','GET'])
def all_books(request):
    if request.method=='GET':
        book_id = 1
        with conn.cursor() as cur:
            cur.execute('''SELECT rating FROM review WHERE rating is not null and book_id = %s  ;''',(book_id,))
            rows = cur.fetchall()
        rating=[]
        total_rating = 0
        for row in rows:
            if row[0] != 0:
                total_rating += row[0]
                rating.append(row[0])
        count = len(rating)
        avg_rating = total_rating/count
            
        return Response({"data":rating,"count":count,"avgrating":avg_rating})
    else :
        return Response({"message":"error"})

@api_view(['GET'])
def activity(request,user_id):
    with conn.cursor() as cur:
        cur.execute(
            '''
                SELECT * FROM activity WHERE user_id = %s ORDER BY date ;
            ''',(user_id,)
        )
        reviews = cur.fetchall()
        
    return Response({"activity":reviews})