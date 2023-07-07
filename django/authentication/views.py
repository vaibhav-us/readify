from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import login 
from django.db import connection as conn
from . import models
import re

def validate_reg(cp,password,email):
    error = []
    is_valid = True
    if email is not None:
        with conn.cursor() as cur:
                cur.execute("SELECT user_id FROM user WHERE user_email =%s ;",(email,))
                user = cur.fetchone()
                if user is not None:
                    is_valid = False
                    error.append("user already registered")
        regex = re.compile(r"^[a-zA-Z]+(?:(?:_[a-zA-Z0-9]+)+\.[A-Za-z0-9]+|\.[a-zA-Z][a-zA-Z0-9]*)?@(?:[a-zA-Z0-9]+\.)*[a-zA-Z0-9]{2,}$")
        if re.fullmatch(regex,email):
            pass
        else:
            is_valid = False
            error.append("invalid email")
    if cp != password:
        is_valid=False
        error.append('passwords are not matching')
    if len(password) < 8:
        is_valid=False
        error.append("password must contain atleast 8 characters")
    
    for char in password:
         if char.isupper():
              break
    else:
        is_valid = False
        error.append("password should contain atleast one uppercase")
    return is_valid,error


@api_view(['POST'])
def signUp(request):
    cred = request.data
    name = cred.get('name')
    cp = cred.get('confirmPassword')
    password = cred.get('password')
    email = cred.get('email')
    
    is_valid,error = validate_reg(cp,password,email)
    
    if is_valid ==True: 
        with conn.cursor() as cur:
            cur.execute("INSERT INTO user(user_email,user_name,password) VALUES (%s,%s,%s);",(email,name,password))
        return Response ({'message':'hello there'})
    return Response({'error':error})


def auth(email,password):
    with conn.cursor() as cur:
            cur.execute("SELECT password,user_name FROM user WHERE user_email =%s ;",(email,))
            data = cur.fetchone()
            if data is not None and data[0] == password:
                 return {"email":email,"user_name":data[1]}


@api_view(['POST'])
def signIn(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        user = auth(email,password)
        if user is not None:
            request.session['user_name']=user.get("user_name")
            token = {'message':request.session['user_name']}
            return Response(token)
    return Response({"message":"error"})

@api_view(['GET'])
def logout(request):
    request.session.clear()
    return Response({"meassage":"logged out"})


@api_view(['POST'])
def forgotPassword(request):
    username = request.data.get("name")
    password = request.data.get("password")
    cp = request.data.get("confirmPassword")
    email = None
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM user WHERE user_name =%s ;",(username,))
        user = cur.fetchone()
    
    
    is_valid,error = validate_reg(cp,password,email)
    if user is  None:
        is_valid = False
        error.append("user doesnt exist")
        

    
    
    if is_valid ==True: 
        with conn.cursor() as cur:
            cur.execute("UPDATE user SET password = %s WHERE user_id =%s ;",(password,user[0],))
            return Response ({'message':'hello there'})
    return Response({'error':error})
        
        
@api_view(['GET'])
def home(request):
     sess=request.session
     return Response(sess)