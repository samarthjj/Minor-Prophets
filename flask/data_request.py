import json
import os
import appcode
import psycopg2


def get_stats(token):
    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']

    conn = psycopg2.connect(db_config)
    cur = conn.cursor()

    # Input has "" surrounding it as actual characters for some reason. This loop removes them. (I know, not very efficient, but it works.)
    data_token = ''
    for i in range(1, len(token)-1):
        data_token = data_token + token[i]

    cur.execute("SELECT * from accounts WHERE token=%s;", (data_token,))

    data = cur.fetchall()

    conn.commit()

    cur.close()
    conn.close()

    data = data[0]

    profile = {"GamesWon": data[3], "TotalPoints": data[4], "WinRatio": data[5], "FavoriteGenre": data[6]}

    return profile


def get_existing_questions(rounds, roomcode):

    conn, cur = get_cursor()

    cur.execute("SELECT from questions WHERE genre=%s LIMIT %s;", "rock", rounds,)

    data = cur.fetchall()

    print(data)

    questionsPerRound = 3
    numQuestions = questionsPerRound * rounds

    cur.execute("CREATE TABLE IF NOT EXISTS room (roomcode varchar, question varchar);")

    # if there's not enough stored questions
    if len(data)/5 < (numQuestions):

        data = appcode.generateQuestions(numQuestions)


    for question in data:

        cur.execute("INSERT INTO room (roomcode, question) VALUE (%s, %s)", (roomcode, question[0]))


    conn.commit()
    cur.close()
    conn.close()


def get_question():

    cur.execute("SELECT 1 from room WHERE id=%s;", (1,))
    cur.execute("DELETE 1 from room WHERE id=%s;", (1,))



def get_cursor():
    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    conn = psycopg2.connect(db_config)
    cur = conn.cursor()
    return conn, cur

