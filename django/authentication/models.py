from django.db import models,connection


def createTable():
    with connection.cursor() as cur:
        cur.execute('''CREATE TABLE IF NOT EXISTS user 
                    (user_id INTEGER PRIMARY KEY, user_email TEXT,user_name TEXT, password TEXT);
                    ''')
       
        
       
createTable()


























#cur.execute('DROP TABLE IF EXISTS user')
#cur.execute('DROP TABLE IF EXISTS book')
#cur.execute('DROP TABLE IF EXISTS review')
#cur.execute('DROP TABLE IF EXISTS feedback')