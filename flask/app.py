# https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
import time
from pydoc import html

import appcode
import werkzeug
from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
import json
import psycopg2
import uuid
import data_request
import random
import csv
import data_request
#import spotify_utils
from username_password_check import check_password, check_username
from verify_session import verify_valid_session
from logout import invalidate_session
from database_utils import retrieve_username


# This should load the local .env file properly now that running the flask server locally should be 'python app.py' NOT 'flask run' (won't affect digital-ocean)
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Dictionary[String, Dictionary[String, String]]
# Maps room code to dictionary of players, mapping token to username.
# Each room info will also contain keys for "owner", "rounds", "genre"
rooms_user_info = {}

@app.route('/api/stats')
def stats():
    # How to get json arguments: https://www.digitalocean.com/community/tutorials/processing-incoming-request-data-in-flask
    token = request.args.get('token')
    data = json.dumps({"GamesWon": "Invalid Login", "TotalPoints": "Invalid Login", "WinRatio": "Invalid Login", "FavoriteGenre": "Invalid Login"})
    if (verify_valid_session(token)):
        data = json.dumps(data_request.get_stats(token))
    return data

@app.route('/api/logout')
def logout():
    token = request.args.get('token')
    if verify_valid_session(token):
        invalidate_session(token)
    return json.dumps({})

@app.route('/api/login', methods=['POST'])
def attempt_login():
    # Get username and password
    # https://www.digitalocean.com/community/tutorials/processing-incoming-request-data-in-flask
    username_login = request.json['username']
    password_login = request.json['password']
    # print(request.json)

    if username_login == 0 or password_login == 0:
        return json.dumps({})

    username_login = html.escape(request.json['username'])
    password_login = html.escape(request.json['password'])

    valid_login = False

    # Generate random tokens: https://docs.python.org/2/library/uuid.html
    # uuid.uuid4() will generate a completely random ID to use as a token
    # (token is generated here so it can be stored in database if user is valid)
    token = str(uuid.uuid4())

    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']

    conn = psycopg2.connect(db_config)
    cur = conn.cursor()

    # https://www.postgresql.org/docs/8.2/sql-droptable.html, https://www.postgresql.org/docs/8.1/sql-delete.html
    # Delete all accounts [TESTING PURPOSES ONLY- REMOVE ONCE FUNCTIONALITY IS COMPLETE]
    # cur.execute("DROP TABLE accounts")


    cur.execute("CREATE TABLE IF NOT EXISTS accounts (token varchar, valid_session varchar, username varchar, password varchar, games_won varchar, total_points varchar, ratio varchar, fav_genre varchar);")
    # How to check for values in a row
    # https://www.tutorialspoint.com/best-way-to-test-if-a-row-exists-in-a-mysql-table
    # cur.prepare("SELECT EXISTS(SELECT * from accounts WHERE username=%s)")
    cur.execute("SELECT EXISTS(SELECT * from accounts WHERE username=%s)", (username_login,))

    #True/False value if login information is valid
    valid_username = cur.fetchall()[0][0]
    # print("Valid?", valid_username)

    valid_account = False
    # If the username is valid, fetch the password stored for that account and compare to the input
    if valid_username:
        cur.execute("SELECT * from accounts WHERE username=%s", (username_login,))
        password = cur.fetchall()[0][3]
        # Check if password matches database:https://werkzeug.palletsprojects.com/en/2.0.x/utils/
        valid_account = werkzeug.security.check_password_hash(password, password_login)

    # If the account is valid, update the user's token in the database
    if valid_account:
        valid_login = True
        # How to update values in table: https://www.postgresqltutorial.com/postgresql-update/
        cur.execute("UPDATE accounts SET token = %s WHERE username = %s", (token, username_login))
        cur.execute("UPDATE accounts SET valid_session = %s WHERE username = %s", (True, username_login))

    # cur.execute("SELECT * FROM accounts;")
    #
    # data = cur.fetchall()

    conn.commit()

    cur.close()
    conn.close()

    # For debugging:
    # users = [{"token": i[0], "username": i[1], "password": i[2], "Games Won:": i[3], "Total Points:":i[4], "Win Ratio:":i[5], "Favorite Genre:":i[6]} for i in
    #          data]  # https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions
    # print(users)

    # https://www.digitalocean.com/community/tutorials/processing-incoming-request-data-in-flask
    # Return token to be stored in session storage by setToken
    if valid_login:
        output = {"token": token}
        return json.dumps(output)
    else:
        # If the login information is invalid, return INVALID token to signal not to setToken
        return json.dumps({})


@app.route('/api/signup', methods=['POST'])
def attempt_signup():
    # Get username and password
    # https://www.digitalocean.com/community/tutorials/processing-incoming-request-data-in-flask
    username_signup = request.json['username']
    password_signup = request.json['password']
    password_repeat_signup = request.json['repeatPassword']
    # print(request.json)

    if username_signup == 0 or password_signup == 0 or password_repeat_signup == 0:
        return json.dumps({})

    username_signup = html.escape(request.json['username'])
    password_signup = html.escape(request.json['password'])
    password_repeat_signup = html.escape(request.json['repeatPassword'])

    # Check that username rmeets requirements
    if not check_username(username_signup):
        return json.dumps({"token": "invalidUsername"})

    # Check that password meets requirements
    if not check_password(password_signup):
        return json.dumps({"token": "badPassword"})

    valid_signup = False

    # Generate random tokens: https://docs.python.org/2/library/uuid.html
    # uuid.uuid4() will generate a completely random ID to use as a token
    # (token is generated here so it can be stored in database if user is valid)
    token = str(uuid.uuid4())

    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    conn = psycopg2.connect(db_config)
    cur = conn.cursor()

    # How to check for values in a row
    # https://www.tutorialspoint.com/best-way-to-test-if-a-row-exists-in-a-mysql-table
    cur.execute("CREATE TABLE IF NOT EXISTS accounts (token varchar, valid_session varchar, username varchar, password varchar, games_won varchar, total_points varchar, ratio varchar, fav_genre varchar);")
    cur.execute("SELECT EXISTS(SELECT * from accounts WHERE username=%s)", (username_signup,))
    # True/False value if username is not yet taken
    invalid_username = cur.fetchall()[0][0]
    # print("Invalid username?", invalid_username)
    # print("Passwords match?", password_signup == password_repeat_signup)

    if invalid_username:
        return json.dumps({"token": "badUsername"})
    if password_signup != password_repeat_signup:
        return json.dumps({"token": "passwordMatchError"})

    # If the username is valid and the passwords match, then create user account.
    if not invalid_username and password_signup == password_repeat_signup:
        valid_signup = True
        #Hash and salt password:https://werkzeug.palletsprojects.com/en/2.0.x/utils/
        hashed_password = werkzeug.security.generate_password_hash(password_signup, method='pbkdf2:sha256', salt_length=16)

        #Create account in table
        cur.execute("INSERT INTO accounts (token, valid_session, username, password, games_won, total_points, ratio, fav_genre) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (token, True, username_signup, hashed_password, "0", "0", "0", "Rock"))

    # cur.execute("SELECT * FROM accounts;")
    #
    # data = cur.fetchall()

    conn.commit()

    cur.close()
    conn.close()

    # For debugging:
    # users = [{"token": i[0], "valid session": i[1], "username": i[2], "password": i[3], "Games Won:": i[4], "Total Points:":i[5], "Win Ratio:":i[6], "Favorite Genre:":i[7]} for i in
    #          data]  # https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions
    # print(users)

    # https://www.digitalocean.com/community/tutorials/processing-incoming-request-data-in-flask
    # Return token to be stored in session storage by setToken
    if valid_signup:
        output = {"token": token}
        return json.dumps(output)
    else:
        # If the sign up username is invalid (already taken), return INVALID token to signal not to setToken
        return json.dumps({})


@app.route('/api/startGame')
def gen_questions():

    # https://www.digitalocean.com/community/tutorials/processing-incoming-request-data-in-flask
    rounds = int(request.args.get('rounds'))

    #roomcode = request.args.get('roomcode')
    roomcode = 'RUN1'


    data_request.get_existing_questions(rounds, roomcode)


    '''
    f = open("questions.json")
    questions = appcode.generate_questions(int(rounds))
    f.close()

    random.shuffle(questions)

    with open('store.json', 'w') as j:
        json.dump(questions, j)
    '''
    return json.dumps("done")

@app.route('/api/questionRequest')
def grab_question():

    # roomcode = request.args.get('roomcode')
    roomcode = 'RUN1'

    '''
    f = open("store.json")
    questions = json.loads(f.read())
    question = random.choice(questions)

    with open('temp_question_storage.json', 'w') as j:
        json.dump(question, j)
    '''

    question = data_request.get_question(roomcode)

    return json.dumps(question)

@app.route('/api/answerRequest')
def grab_answer():

    '''
    with open("temp_question_storage.json", 'r') as f:
        question = json.loads(f.read())
    '''

    return data_request.get_answer()

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/api/db')
def test_database():
    # todo <Add Database Functionality>

    # Now, add functionality so that every time this route is called (by React), we'll add an entry to a database
    # Work in the PostgreSQL Heroku database w/ examples from lecture!

    # In the 'flask' folder create a file called '.env' and add 'DATABASE_URL_LOCAL=<insert heroku link>'
    # DO NOT ADD TO GIT
    # https://www.twilio.com/blog/environment-variables-python --> Source
    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']

    print(db_config)

    # https://www.psycopg.org/docs/usage.html --> Great PostgreSQL Source

    conn = psycopg2.connect(db_config)
    cur = conn.cursor()

    cur.execute("CREATE TABLE IF NOT EXISTS users (username varchar, name varchar);")
    cur.execute("INSERT INTO users (username, name) VALUES (%s, %s)", ("jmcaskie", "Josh"))
    # Wow - don't forget Python syntax when working in a non-python IDE... 30 min debug for missing a ')'

    cur.execute("SELECT * FROM users;")

    data = cur.fetchall()

    conn.commit()

    cur.close()
    conn.close()

#     print(json.dumps(data))

    users = [{"username" : i[0], "name" : i[1]} for i in data] # https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions
    print(users)

#     for row in data:
#         print(row)

    return {"users" : users}

#         {
#              "items": [
#                { "id": 1, "name": "Apples",  "price": "$2" },
#                { "id": 2, "name": "Peaches", "price": "$5" }
#              ]
#         }


@app.route("/api/validateRoom")
def validate_room():
    print("Validate Room")
    room = request.args.get('roomcode')
    token = request.args.get('token')
    retrieve_username(token)
    print("Room Code: " + room)
    if room in rooms_user_info:
        return json.dumps({"response": "goodRoom"})
    else:
        return json.dumps({"response": "badRoom"})


@socket_server.on('join_room')
def on_join(info):
    room = info['room']
    token = info["token"]
    # print(room, token)
    # Register room & owner
    if not room in rooms_user_info:
        rooms_user_info[room] = {}
        rooms_user_info[room]["owner"] = token
    
    # Add user to that room
    username = retrieve_username(token)
    rooms_user_info[room][token] = username

    join_room(room)
    # print(rooms_user_info[room])
    emit("join_room", username + ' has joined the game.', to=room)


@socket_server.on('leave_room')
def on_leave(info):
    room = info['room']
    token = info["token"]
    username = rooms_user_info[room][token]
    # print(room, token, username)

    rooms_user_info[room].pop(token, None) 
    leave_room(room)
    # print(rooms_user_info[room])
    emit("leave_room", username + ' has left the game.', to=room)


@socket_server.on('message')
def broadcast_message(msg):
    emit("message", msg, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000)
