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

    cur.execute("CREATE TABLE IF NOT EXISTS questions (question varchar, choice1 varchar, choice2 varchar, choice3 varchar, choice4 varchar, answer varchar, genre varchar);")
    cur.execute("DELETE FROM questions")
    test_questions(cur)

    cur.execute("SELECT * FROM questions WHERE genre=%s LIMIT %s;", ("pop", rounds,))

    data = cur.fetchall()

    print(data)

    questionsPerRound = 3
    numQuestions = questionsPerRound * rounds

    cur.execute("CREATE TABLE IF NOT EXISTS rooms (roomcode varchar, question varchar);")
    cur.execute("DELETE FROM rooms")
    test_rooms(cur)

    # if there's not enough stored questions
    if len(data)/5 < numQuestions:

        print("generating")

        data = appcode.generate_questions(numQuestions)

        new_questions_in_database(data, cur)

        for question in data:

            print(question)

            cur.execute("SELECT 1 FROM questions WHERE question=%s;", (question['question'],))

            check = cur.fetchall()

            print(check)

            if len(check) == 0:

                cur.execute("INSERT INTO rooms (roomcode, question) VALUES (%s, %s)", (roomcode, question["question"]))
                #cur.execute("INSERT INTO questions (roomcode, question) VALUES (%s, %s)", (roomcode, question["question"]))



    else:

        for question in data:

            print(question)

            cur.execute("INSERT INTO rooms (roomcode, question) VALUES (%s, %s)", (roomcode, question[0]))

    conn.commit()
    cur.close()
    conn.close()



def get_question():

    conn, cur = get_cursor()

    cur.execute("SELECT * from rooms LIMIT 1;")
    question = cur.fetchall()
    cur.execute("DELETE * from rooms WHERE question=%s LIMIT 1;", (question[0],))

    conn.commit()
    cur.close()
    conn.close()

    return {"question": question[0], "choices": [question[1], question[2], question[3], question[4]], "answer": question[5], "genre": question[6]}


def new_questions_in_database(data, cur):

    for question in data:

        cur.execute("INSERT INTO questions (question, choice1, choice2, choice3, choice4, answer, genre) VALUES (%s, %s, %s, %s, %s, %s, %s)", (question["question"], question["choices"][0], question["choices"][1], question["choices"][2], question["choices"][3], question["answer"], question["genre"]))


def get_cursor():
    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    conn = psycopg2.connect(db_config)
    cur = conn.cursor()
    return conn, cur


def test_questions(cur):

    questions = cur.execute("SELECT * FROM questions")

    print("questions: ")
    print(questions)


def test_rooms(cur):

    rooms = cur.execute("SELECT * FROM rooms")

    print("rooms: ")
    print(rooms)


