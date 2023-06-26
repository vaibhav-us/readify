from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.sessions.backends.db import SessionStore 
from django.db import connection as conn
from . import models

@api_view(['POST'])
def signUp(request):
    name = request.data.get('name')
    password = request.data.get('password')
    email = request.data.get('email')
    with conn.cursor() as cur:
        cur.execute("INSERT INTO user(user_email,user_name,password) VALUES (%s,%s,%s);",(email,name,password))
    
    token = {'message':'hello there'}
    return Response (token)

def auth(email,password):
    with conn.cursor() as cur:
            cur.execute("SELECT password FROM user WHERE user_email =%s ;",(email,))
            data = cur.fetchone()
            if data is not None and data[0] == password:
                 return {"email":email}


@api_view(['POST'])
def signIn(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        user = auth(email,password)
        if user is not None:
            session = SessionStore()
            session['email']=email
            
            token = {'message':session}
            return Response(token)
    return Response({"message":"error"})

@api_view(['GET'])
def home(request):
     session=SessionStore()
     return Response(session)