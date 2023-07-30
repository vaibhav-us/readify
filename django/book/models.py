from django.db import models,connection


def createTable():
    with connection.cursor() as cur:
        cur.execute('''
            CREATE TABLE IF NOT EXISTS book 
                (book_id INTEGER PRIMARY KEY,user_id INTEGER,book_title TEXT, author TEXT,
                  cover_pic TEXT, description CLOB,published_on DATE ,avg_rating INTEGER DEFAULT NULL ,
                 FOREIGN KEY(user_id) REFERENCES user(user_id) );
            ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS review 
                (review_id INTEGER PRIMARY KEY,user_id INTEGER, book_id INTEGER, rating INTEGER, review CLOB,
                 tags TEXT,spoiler BOOLEAN ,likes INTEGER, date DATE DEFAULT(date('now')) ,
                 FOREIGN KEY(user_id) REFERENCES user(user_id), FOREIGN KEY(book_id) REFERENCES book(book_id) );
            ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS feedback 
                (feedback_id INTEGER PRIMARY KEY, user_id INTEGER, review_id INTEGER, book_id INTEGER,
                 comment TEXT, date DATE DEFAULT(date('now')),
                 FOREIGN KEY(user_id) REFERENCES user(user_id),FOREIGN KEY(review_id) REFERENCES review(review_id),
                 FOREIGN KEY(book_id) REFERENCES book(book_id) );
            ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS likes
            (id INTEGER PRIMARY KEY,user_id INTEGER, review_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES user(user_id),FOREIGN KEY(review_id) REFERENCES review(review_id)) ;  
                    ''')
        
        cur.execute('''
                CREATE TABLE IF NOT EXISTS genre  (genre_id INTEGER PRIMARY KEY,book_id INTEGER,genre TEXT,
                FOREIGN KEY(book_id) REFERENCES book(book_id) ON DELETE CASCADE)
            ''')
        cur.execute('''
        CREATE TABLE IF NOT EXISTS shelf (
            shelf_id INTEGER PRIMARY KEY,
            user_id INTEGER,
            book_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES user(user_id),
            FOREIGN KEY(book_id) REFERENCES book(book_id),
            UNIQUE(user_id, book_id) ON CONFLICT IGNORE
            );
                ''')
        cur.execute(
            '''
                CREATE TABLE IF NOT EXISTS activity(a_id PRIMARY KEY, act TEXT,book_id INTEGER, book_title TEXT, date DATE, rating INTEGER,
                FOREIGN KEY(book_id) REFERENCES book(book_id) ON DELETE CASCADE, FOREIGN KEY(book_title) REFERENCES book(book_title) ON DELETE CASCADE) ;
            
            '''
        )

        
        #cur.execute('DROP TABLE IF EXISTS shelf')
        # cur.execute('DROP TABLE IF EXISTS feedback')
        # cur.execute('DROP TABLE IF EXISTS review')
        # cur.execute('DROP TABLE IF EXISTS genre')
        # cur.execute('DROP TABLE IF EXISTS book')
createTable()
