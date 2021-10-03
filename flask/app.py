# https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
import time
from flask import Flask

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/db')
def test_database():
    # todo <Add Database Functionality>
    return {
             "items": [
               { "id": 1, "name": "Apples",  "price": "$2" },
               { "id": 2, "name": "Peaches", "price": "$5" }
             ]
           }