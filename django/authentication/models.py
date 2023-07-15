from django.db import models,connection


def createTable():
    with connection.cursor() as cur:
        cur.execute('''CREATE TABLE IF NOT EXISTS user 
                    (user_id INTEGER PRIMARY KEY, user_email TEXT,user_name TEXT, password TEXT);
                    ''')
        
        cur.execute('''CREATE TABLE IF NOT EXISTS session 
                    (session_id INTEGER PRIMARY KEY,user_id INTEGER,user_name TEXT,
                    FOREIGN KEY(user_id) REFERENCES user(user_id)
                    
                    );
                    ''')
       
        #cur.execute("DROP TABLE IF EXISTS session")
       
createTable()


























#cur.execute('DROP TABLE IF EXISTS user')
#cur.execute('DROP TABLE IF EXISTS book')
#cur.execute('DROP TABLE IF EXISTS review')
#cur.execute('DROP TABLE IF EXISTS feedback')