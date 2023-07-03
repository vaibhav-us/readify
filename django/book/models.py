from django.db import models,connection


def createTable():
    with connection.cursor() as cur:
        cur.execute('''
            CREATE TABLE IF NOT EXISTS book 
                (book_id INTEGER PRIMARY KEY,user_id INTEGER,genre TEXT, book_title TEXT, author TEXT,
                  cover_pic TEXT, description TEXT,published_on DATE DEFAULT(date('now')),avg_rating INTEGER DEFAULT 5 ,
                 FOREIGN KEY(user_id) REFERENCES user(user_id) );
            ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS review 
                (review_id INTEGER PRIMARY KEY,user_id INTEGER, book_id INTEGER, rating INTEGER, review TEXT,
                 date DATE DEFAULT(date('now')),
                 FOREIGN KEY(user_id) REFERENCES user(user_id), FOREIGN KEY(book_id) REFERENCES book(book_id) );
            ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS feedback 
                (feedback_id INTEGER PRIMARY KEY, user_id INTEGER, review_id INTEGER, book_id INTEGER,
                 comment TEXT, likes INTEGER, date DATE DEFAULT(date('now')),
                 FOREIGN KEY(user_id) REFERENCES user(user_id),FOREIGN KEY(review_id) REFERENCES review(review_id),
                 FOREIGN KEY(book_id) REFERENCES book(book_id) );
            ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS likes
            (id INTEGER PRIMARY KEY,user_id INTEGER, feedback_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES user(user_id),FOREIGN KEY(feedback_id) REFERENCES feedback(feedback_id)) ;  
                    ''')
        
       
        
        
createTable()
