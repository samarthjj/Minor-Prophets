# https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
import time
from flask import Flask, request
import os
import json
import psycopg2
# from flask_cors import CORS

app = Flask(__name__)
# CORS(app)



@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/api/login', methods=['POST'])
def attempt_signup():
    # https://www.digitalocean.com/community/tutorials/processing-incoming-request-data-in-flask
    username = request.form.get('username')
    password = request.form.get('password')
    output = {"token": "test1234"}
    return json.dumps(output)


@app.route('/startGame')
def generate_questions():


@app.route('/questionRequest')
def grab_question():


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
    cur.execute("INSERT INTO users (username, name) VALUES (%s, %s)", ("jmcaskie", "Josh")) # Wow - don't forget Python syntax when working in a non-python IDE... 30 min debug for missing a ')'

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