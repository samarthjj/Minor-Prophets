# https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
import time
from pydoc import html

import appcode
import werkzeug
from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room, send
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
import threading
import time
import statistics
startGameSem = threading.Semaphore()
getAnswerSem = threading.Semaphore()
gameOverSem = threading.Semaphore()


# This should load the local .env file properly now that running the flask server locally should be 'python app.py' NOT 'flask run' (won't affect digital-ocean)
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
socket_server = SocketIO(app, cors_allowed_origins="*")

# Dictionary[String, Dictionary[String, String]]
# Maps room code to dictionary of players, mapping token to username.
# Each room info will also contain keys for "owner", "rounds", "genre", "answer", "correct_answer", "score"
# rooms_user_info = {"TEST":
#                        {"owner": "test",
#                         "users": {<token> : <username>},
#                         "rounds": 5,
#                         "current_round": 1,
#                         "round_counter: 1,
#                         "genre": "test",
#                         "answer": {
#                             "token1" : "1",
#                             "token2" : "3"
#                         },
#                         "correct_answer": "",
#                         "score": {
#                             "token1" : "score1",
#                             "token2" : "score2",
#                             }
#                         }
#                    }
rooms_user_info = {}

# Runs on each startup, cleans out db.
def clear_db():
    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    conn = psycopg2.connect(db_config)
    cur = conn.cursor()

    cur.execute("DROP TABLE IF EXISTS rooms;")
    cur.execute("CREATE TABLE IF NOT EXISTS newrooms (roomcode varchar, question varchar, choice1 varchar, choice2 varchar, choice3 varchar, choice4 varchar, answer varchar, genre varchar, current boolean);")
    cur.execute("DELETE FROM newrooms;")

    conn.commit()
    cur.close()
    conn.close()

# Start the game, generate the questions for the game
@app.route('/api/startGame')
def gen_questions():

    print("starting!!")

    startGameSem.acquire()

    # https://www.digitalocean.com/community/tutorials/processing-incoming-request-data-in-flask

    roomcode = request.args.get('roomcode')
    genre = "" # TBD


    # calculate the number of questions to generate
    num_rounds = rooms_user_info[roomcode]['rounds']
    questions_per_round = 3
    num_questions = num_rounds * questions_per_round

    print("generating questions", rooms_user_info)

    output = ""

    # if the game has started, just don't do anything
    if rooms_user_info[roomcode]["started"]:
        output = "game already started"
    else:
        if num_rounds < 0 or num_rounds > 5:
            return json.dumps("failed input")

        # Only generate the questions once the room is validated
        data_request.get_existing_questions(num_questions, roomcode)

        # Start the game
        rooms_user_info[roomcode]["started"] = True

        # Increment the "# of games" statistic for the players in the lobby
            # I don't believe the tokens are checked for validity before attempting to add them to a room... But I think the server would error if that occurs anyway?
        for token in rooms_user_info[roomcode]["users"].keys():
            statistics.incrementGamesPlayed(token)

        output = "done"

    startGameSem.release()
    print("ending question generation")
    return json.dumps({"response": output})

# Ask for a question for the game
@app.route('/api/questionRequest')
def grab_question():

    # Found error, the roomcode is not being saved/the way the request is getting the roomcode is bricked

    roomcode = request.args.get('roomcode')
    # roomcode = 'RUN1' # why was this set ?

    # print("The Current Roomcode is " + str(roomcode))

    # Grabs a question for the specified Roomcode
    # Need to add checks that this is a valid room code
    question = data_request.get_question(roomcode)
    # question = {"hi":"there"}

    # Reset the flag so a new answer will be grabbed next time.
    rooms_user_info[roomcode]["answer_grabbed"] = False

    return json.dumps(question)

# Grabs the answer for the question
@app.route('/api/answerRequest')
def grab_answer():

    getAnswerSem.acquire()

    roomcode = request.args.get('roomcode')
    token = request.args.get('token')

    output = {}

    # If the answer has already been grabbed based on the flag, just return it! Otherwise, get the new one
    if rooms_user_info[roomcode]["answer_grabbed"]:
        output = {"answer" : rooms_user_info[roomcode]["correct_answer"]} # Specific format for the answer in front end
    else:
        answer = data_request.get_answer(request.args.get('roomcode'))

        # Mark that the answer has been grabbed
        rooms_user_info[roomcode]["answer_grabbed"] = True

        print("THE ANSWER IS: ", answer)

        # print(answer['answer'])

        # Save the answer for calculation
        rooms_user_info[roomcode]["correct_answer"] = answer["answer"]

        # print(rooms_user_info[roomcode])

        # todo Calculate the scores here? --> Then users can press the button to "reveal" the scores as well
        # Then, a hidden button will appear to view the scores! This is really good!
        # Can potentially set a flag to not calculate scores for the X amount of people in the lobby, but it's probably okay to do it runtime wise

        output = answer

    # updates round related info
    if token == rooms_user_info[roomcode]['owner']:
        # this keeps the round we are in up to date
        if rooms_user_info[roomcode]['round_counter'] >= 3:   # 6 is the number of questions per round x2 because this executes for both q and a
            rooms_user_info[roomcode]['round_counter'] = 1
            if rooms_user_info[roomcode]['current_round'] < rooms_user_info[roomcode]['rounds']:
                print("incrementing")
                rooms_user_info[roomcode]['current_round'] += 1
        else:
            rooms_user_info[roomcode]['round_counter'] += 1


    getAnswerSem.release()
    return output

# Save the answer chosen by the player
@app.route('/api/saveAnswer')
def save_answer():
    answer = request.args.get('answer')
    owner_token = request.args.get('token')
    roomcode = request.args.get('roomcode')
    print("player answer: ", answer)

    # if len(answer) > 1000:
    #     return "nice overflow attempt :)"

    username = rooms_user_info[roomcode]['users'][owner_token]

    rooms_user_info[roomcode]['answer'][username] = answer

    print("saved answer", rooms_user_info[roomcode])

    return "answered"



# Updates the scores of each user --> Josh needs to call this when the people move to the Answer screen, and it can be calculated for each user
@app.route('/api/scores')
def update_scores():
    room = request.args.get('roomcode')

    # Grab current answers of users (that answered
    user_answers = rooms_user_info[room]['answer']
    correct_answer = rooms_user_info[room]['correct_answer']

    # have a key to check if the scores have already been updated for this round?
    # introduce race conditions though!

    # There will always be a blank "" answer for new joiners, so we don't need to worry about checking for existence
    for (username, ans) in user_answers.items():
        if ans == correct_answer:
            rooms_user_info[room]["score"][username] += 1
            print(username, " got it right!")

            # Update their statistic --> inefficient method of getting things / should have better data storage.
            for (token, user) in rooms_user_info[room]['users'].items():
                if user == username:
                    statistics.incrementTotalPoints(token) # Uses the username of the person who got it right to find their token


    # answers = rooms_user_info[room]["answer"]
    # correct_answer = rooms_user_info[room]["correct_answer"]
    # rooms_user_info[room]["score"] = {"test": 0, "yuh": 0}
    # rooms_user_info[room]["answer"] = {"test": "", "yuh": ""}
    # answers = {"test": 1, "yuh": 2}

    # Reworked (keeping scores as k/v pairs)

    # answers = {"test": 2}
    # correct_answer = 2
    # for user in answers.keys():
    #     print(rooms_user_info[room]["score"][user])
    #     if answers[user] == correct_answer:
    #         rooms_user_info[room]["score"][user] += 1
    #     print(rooms_user_info[room]["score"][user])

    return json.dumps("")

# Dumps the scores for each user
@app.route('/api/get_scores')
def get_scores():

    room = request.args.get('roomcode')

    curr_scores = rooms_user_info[room]["score"]

    scores = {"User": [], "Score": []}

    # iterate through the keys, create an array, pass that to the front end for rendering properly
    for user in curr_scores.keys():
        scores["User"] = scores["User"] + [user]
        scores["Score"] = scores["Score"] + [rooms_user_info[room]["score"][user]]
    rooms_user_info[room]["scores"] = scores

    return json.dumps(scores)

@app.route('/api/gameOver')
def game_over_statistics():

    gameOverSem.acquire()

    # Brought down from /api/get_scores
    room = request.args.get('roomcode')

    # End early if we're done early
    if rooms_user_info[room]["gameover"] == True:
        gameOverSem.release()
        return "Someone else ended the game"

    curr_scores = rooms_user_info[room]["score"]
    scores = {"User": [], "Score": []}
    # iterate through the keys, create an array, pass that to the front end for rendering properly
    for user in curr_scores.keys():
        scores["User"] = scores["User"] + [user]
        scores["Score"] = scores["Score"] + [rooms_user_info[room]["score"][user]]
    # This is left out because semaphore usage
    # rooms_user_info[room]["scores"] = scores


    # Save the winner to the database for statistics
    # First find the highest score
    top_score = 0
    for i in scores["Score"]:
        if i > top_score:
            top_score = i

    print("The Highest Score is ", top_score)

    # Then find all of the users with that score (there might be a tie)
    top_users = []
    for (user, score) in curr_scores.items():
        if score == top_score:
            top_users.append(user)

    print("The Winners Are ", top_users)

    # Then get all usernames --> tokens and increment their # games won!
    for user in top_users:
        for (token, name) in rooms_user_info[room]['users'].items():
            if name == user:
                statistics.incrementGameWinner(token)

    # Update the game to be finished in the game report
    rooms_user_info[room]["gameover"] = True

    gameOverSem.release()

    return "I ended the game"

# Used to determine different screens for an owner or a player // Specifically for the Answer.jsx file (temporarily so only owner can press "calculate scores" once)
@app.route('/api/ownerOrPlayer')
def owner_or_player():
    roomcode = request.args.get('roomcode')
    token = request.args.get('token')
    print(roomcode)
    print(token)

    print("right here", rooms_user_info[roomcode]["owner"])

    if rooms_user_info[roomcode]["owner"] == token:
        output = "Owner"
    else:
        output = "Player"

    print(output)
    return json.dumps({"response": output})


# Validates the room
@app.route("/api/validateRoom")
def validate_room():
    # print("Validate Room")
    room = request.args.get('roomcode')
    token = request.args.get('token')
    # retrieve_username(token)
    # print("Room Code: " + room)
    if room in rooms_user_info and rooms_user_info[room]["started"] == False:   # If the game has started, don't let them in (they can still go to the room code w/ link manually, how to prevent?)
        return json.dumps({"response": "goodRoom"})
    else:
        return json.dumps({"response": "badRoom"})


@socket_server.on('join_room')
def on_join(info):
    room = info['room']
    token = info["token"]
    # print(room, token)
    # Register room & owner
    if room not in rooms_user_info:
        rooms_user_info[room] = {}
        rooms_user_info[room]["owner"] = token
        rooms_user_info[room]["users"] = {}     # Initialize with an empty dict to store people
        rooms_user_info[room]["started"] = False    # Sets the game to "not have started yet"
        rooms_user_info[room]["answer_grabbed"] = False     # Track if the answer has been grabbed yet.. improvement
        rooms_user_info[room]["gameover"] = False   # Becomes True when the game is over so winners are not calculated multiple times

    # Add user to that room
    username = retrieve_username(token)
    rooms_user_info[room]["users"][token] = username  # Adjusted to make the organization neater

    if "answer" not in rooms_user_info[room].keys():
        rooms_user_info[room]["answer"] = {}
    if "score" not in rooms_user_info[room].keys():
        rooms_user_info[room]["score"] = {}
    if "correct_answer" not in rooms_user_info[room].keys():
        rooms_user_info[room]["correct_answer"] = ""
    if retrieve_username(token) not in rooms_user_info[room]["score"].keys():
        rooms_user_info[room]["answer"][retrieve_username(token)] = ""
        rooms_user_info[room]["score"][retrieve_username(token)] = 0

    join_room(room)
    # print(rooms_user_info[room])
    print("Joining a room: ", rooms_user_info[room])

    dic = json.dumps({'username': username, 'token': token})

    emit('join_room', dic, room=room)



@socket_server.on('leave_room')
def on_leave(info):
    room = info['room']
    token = info["token"]
    username = rooms_user_info[room]["users"][token]
    # print(room, token, username)

    rooms_user_info[room]["users"].pop(token, None)
    leave_room(room)
    # print(rooms_user_info[room])
    print("Leaving a room: ", rooms_user_info[room])

    emit('leave_room', username, room=room)


# Stats
@app.route('/api/stats')
def stats():
    # How to get json arguments: https://www.digitalocean.com/community/tutorials/processing-incoming-request-data-in-flask
    token = request.args.get('token')
    data = json.dumps({"GamesWon": "Invalid Login", "TotalPoints": "Invalid Login", "WinRatio": "Invalid Login", "FavoriteGenre": "Invalid Login"})
    if (verify_valid_session(token)):
        # data = json.dumps(data_request.get_stats(token))
        data = data_request.get_stats(token)
        data["Username"] = retrieve_username(token)
        data = json.dumps(data)
    return data


@app.route('/api/logout')
def logout():
    token = request.args.get('token')

    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    conn = psycopg2.connect(db_config)
    cur = conn.cursor()

    guest = False
    data_token = ''
    for i in range(1, len(token) - 1):
        data_token = data_token + token[i]
    cur.execute("CREATE TABLE IF NOT EXISTS guestAccounts (token varchar);")

    cur.execute("SELECT EXISTS(SELECT * from guestAccounts WHERE token=%s);", (data_token,))

    # True/False value if login information is valid
    guest_token = cur.fetchall()[0][0]

    conn.commit()

    cur.close()
    conn.close()

    if guest_token:
        db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
        conn = psycopg2.connect(db_config)
        cur = conn.cursor()

        cur.execute("DELETE from guestAccounts WHERE token=%s;", (data_token,))
        # Delete a row: https://www.postgresqltutorial.com/postgresql-delete/
        cur.execute("DELETE from accounts WHERE token=%s;", (data_token,))

        conn.commit()

        cur.close()
        conn.close()

    if verify_valid_session(token):
        invalidate_session(token)
    return json.dumps({})

@app.route('/api/signupGuest', methods=['POST'])
def signup_guest():

    valid_signup = False

    # Generate random tokens: https://docs.python.org/2/library/uuid.html
    # uuid.uuid4() will generate a completely random ID to use as a token
    # (token is generated here so it can be stored in database if user is valid)
    token = str(uuid.uuid1())
    print(token, type(token))

    while not valid_signup:
        username = "Guest" + str(uuid.uuid4())[0:7]

        db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
        conn = psycopg2.connect(db_config)
        cur = conn.cursor()

        # How to check for values in a row
        # https://www.tutorialspoint.com/best-way-to-test-if-a-row-exists-in-a-mysql-table
        cur.execute("CREATE TABLE IF NOT EXISTS accounts (token varchar, valid_session varchar, username varchar, password varchar, games_won varchar, total_points varchar, ratio varchar, fav_genre varchar);")
        cur.execute("SELECT EXISTS(SELECT * from accounts WHERE username=%s);", (username,))
        # True/False value if username is not yet taken
        invalid_username = cur.fetchall()[0][0]

        conn.commit()

        cur.close()
        conn.close()

        if invalid_username:
            continue
        else:
            db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
            conn = psycopg2.connect(db_config)
            cur = conn.cursor()

            hashed_password = werkzeug.security.generate_password_hash(str(uuid.uuid4()), method='pbkdf2:sha256',
                                                                       salt_length=16)

            # Create account in table
            cur.execute("INSERT INTO accounts (token, valid_session, username, password, games_won, total_points, ratio, fav_genre) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);",
                (token, True, username, hashed_password, "0", "0", "0", "N/A"))

            cur.execute("CREATE TABLE IF NOT EXISTS guestAccounts (token varchar);")
            cur.execute("INSERT INTO guestAccounts (token) VALUES (%s);", (token,))

            conn.commit()

            cur.close()
            conn.close()

            valid_signup = True

    # db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    # conn = psycopg2.connect(db_config)
    # cur = conn.cursor()

    # cur.execute("SELECT * FROM accounts;")
    #
    # data = cur.fetchall()

    # conn.commit()
    #
    # cur.close()
    # conn.close()

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
    cur.execute("SELECT EXISTS(SELECT * from accounts WHERE username=%s);", (username_login,))

    #True/False value if login information is valid
    valid_username = cur.fetchall()[0][0]
    # print("Valid?", valid_username)

    valid_account = False
    # If the username is valid, fetch the password stored for that account and compare to the input
    if valid_username:
        cur.execute("SELECT * from accounts WHERE username=%s;", (username_login,))
        password = cur.fetchall()[0][3]
        # Check if password matches database:https://werkzeug.palletsprojects.com/en/2.0.x/utils/
        valid_account = werkzeug.security.check_password_hash(password, password_login)

    # If the account is valid, update the user's token in the database
    if valid_account:
        valid_login = True
        # How to update values in table: https://www.postgresqltutorial.com/postgresql-update/
        cur.execute("UPDATE accounts SET token = %s WHERE username = %s;", (token, username_login))
        cur.execute("UPDATE accounts SET valid_session = %s WHERE username = %s;", (True, username_login))

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
    cur.execute("SELECT EXISTS(SELECT * from accounts WHERE username=%s);", (username_signup,))
    # True/False value if username is not yet taken
    invalid_username = cur.fetchall()[0][0]
    # print("Invalid username?", invalid_username)
    # print("Passwords match?", password_signup == password_repeat_signup)

    if invalid_username:
        conn.commit()

        cur.close()
        conn.close()
        return json.dumps({"token": "badUsername"})
    if password_signup != password_repeat_signup:
        conn.commit()

        cur.close()
        conn.close()
        return json.dumps({"token": "passwordMatchError"})

    # If the username is valid and the passwords match, then create user account.
    if not invalid_username and password_signup == password_repeat_signup:
        valid_signup = True
        #Hash and salt password:https://werkzeug.palletsprojects.com/en/2.0.x/utils/
        hashed_password = werkzeug.security.generate_password_hash(password_signup, method='pbkdf2:sha256', salt_length=16)

        #Create account in table
        cur.execute("INSERT INTO accounts (token, valid_session, username, password, games_won, total_points, ratio, fav_genre) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);", (token, True, username_signup, hashed_password, "0", "0", "0", "Rock"))

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
    cur.execute("INSERT INTO users (username, name) VALUES (%s, %s);", ("jmcaskie", "Josh"))
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


# grabs usernames of all players already in the room
@app.route('/api/initialize_table')
def get_users():

    room = request.args.get('roomcode')

    if room not in rooms_user_info.keys():
        return json.dumps({"response" : "room not initiated"})

    users = []
    for token,user in rooms_user_info[room]['users'].items():
        users.append(user)

    return json.dumps({"users": users, "response" : "room ready"})



@app.route('/api/initializeRounds')
def set_rounds():

    roomcode = request.args.get('roomcode')
    rounds = request.args.get('rounds')

    rooms_user_info[roomcode]['rounds'] = int(rounds)
    rooms_user_info[roomcode]['current_round'] = 1
    rooms_user_info[roomcode]['round_counter'] = 1

    return {'rounds': rounds}


@app.route('/api/rounds')
def rounds():


    roomcode = request.args.get('roomcode')

    rounds = rooms_user_info[roomcode]['rounds']
    current_round = rooms_user_info[roomcode]['current_round']

    print("sending back round info")
    round_info = {'rounds': rounds, 'current_round': current_round}
    print(round_info)

    return json.dumps(round_info)




# broadcasts to all players in a room that the host has started the game
@socket_server.on('question')
def on_start(info):

    emit("question", room=info)


@socket_server.on('message')
def broadcast_message(info):
    room = info['room']
    username = rooms_user_info[room]['users'][info["token"]]
    # username = retrieve_username(info["token"])
    message = info['message']
    emit("message", {"username": username, "message": message}, broadcast=True)


if __name__ == '__main__':
    clear_db() # Clear the rooms database
    socket_server.run(app, host="0.0.0.0", port=5000, use_reloader=False)
