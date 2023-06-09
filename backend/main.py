from flask import Flask,request,session,redirect,jsonify
import sqlite3 as sql
import hashlib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.secret_key = 'gywaguuv84$^$^&*(*&^%$#)'

def db():
    db = sql.connect('database.db')
    return db

def init_db():
    conn = db()
    cur = conn.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name TEXT,email TEXT, password TEXT);')
    cur.execute('CREATE TABLE IF NOT EXISTS books(book_id INTEGER PRIMARY KEY AUTOINCREMENT, book_name TEXT, author TEXT,url TEXT, description TEXT);')
    conn.commit()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def create_user(user_name,email,password):
    hashed_password=hash_password(password)
    conn = db()
    cur = conn.cursor()
    cur.execute('INSERT INTO users(user_name,email,password) VALUES(?,?,?)' , (user_name,email,hashed_password))
    conn.commit()
 
@app.route('/signup', methods=['POST','GET'])
def signup():
    
    if request.method == 'POST':
        json_data = request.get_json()
        user_name = json_data['user_name']
        email = json_data['email']
        password = json_data['password']
        
        #cword = data.get('cp')
        #if cword == password:
        create_user(user_name,email,password)
        return jsonify({'message':'success'})
    
    return jsonify({'message':'error'})

def get_user(username):
    conn = db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM users WHERE username = ?',(username,))
    user = cur.fetchone()
    conn.commit()
    return user

def generate_token(email):
    token = {'username':email}
    return token

@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = get_user(email)
    if hash_password(password) == user[3]:
        token = generate_token(email)
        return jsonify({'token':token})
    
    return jsonify({'message':'error'})

@app.route('/new_release' , methods=['GET'])
def new_release():
    conn = db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM books')
    books = cur.fetchall()
    conn.commit()
    return jsonify({'books':books})

@app.route('/add', methods = ['POST'])
def add():
    data = request.get_json()
    book_name = data['book_name']
    author =data['abcd']
    url = data['url']
    description = 'abcd'
    conn = db()
    cur = conn.cursor()
    cur.execute('INSERT INTO book(book_name,author,url,description) VALUES(?,?,?,?)',(book_name,author,url,description))
    conn.commit()
    return jsonify({'message':'book added'})



if __name__== '__main__':
    init_db()
    app.run(debug=True)