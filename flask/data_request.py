import json
import os
import appcode
import random
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

    profile = {"GamesWon": data[4], "TotalPoints": data[5], "WinRatio": data[6], "FavoriteGenre": data[7]}

    return profile
    return profile


def get_existing_questions(rounds, roomcode):

    conn, cur = get_cursor()

    questionsPerRound = 3
    numQuestions = questionsPerRound * rounds

    # TESTING PURPOSES ONLY
    cur.execute("DROP TABLE questions")
    cur.execute("CREATE TABLE IF NOT EXISTS questions (question varchar, choice1 varchar, choice2 varchar, choice3 varchar, choice4 varchar, answer varchar, genre varchar, current boolean);")

    cur.execute("SELECT * FROM questions WHERE genre=%s;", ("Pop",))

    data = cur.fetchall()


    # TESTING PURPOSES ONLY
    cur.execute("DROP TABLE rooms")
    cur.execute("CREATE TABLE IF NOT EXISTS rooms (roomcode varchar, question varchar);")


    # if there's not enough stored questions
    if len(data)/5 < numQuestions:

        print("generating")

        data = appcode.generate_questions(numQuestions)

        new_questions_in_database(data, cur)

        for question in data:

            cur.execute("INSERT INTO rooms (roomcode, question) VALUES (%s, %s)", (roomcode, question["question"]))


    else:

        print("getting existing")

        random.shuffle(data)

        print("data", data)

        for i in range(numQuestions):

            question = data[i]

            cur.execute("INSERT INTO rooms (roomcode, question) VALUES (%s, %s)", (roomcode, question[0]))


    test_questions(cur)
    test_rooms(cur)

    conn.commit()
    cur.close()
    conn.close()



def get_question(roomcode):

    conn, cur = get_cursor()

    cur.execute("SELECT * FROM rooms WHERE roomcode=%s LIMIT 1;", (roomcode,))

    question = cur.fetchall()

    question = question[0]

    cur.execute("SELECT * FROM questions WHERE question=%s LIMIT 1;", (question[1],))

    question = cur.fetchall()

    question = question[0]

    cur.execute("UPDATE questions SET current=%s WHERE question=%s;", (True, question[0]))

    conn.commit()
    cur.close()
    conn.close()

    return {"question": question[0], "choices": [question[1], question[2], question[3], question[4]], "answer": question[5], "genre": question[6]}


def get_answer():

      conn, cur = get_cursor()

      cur.execute("SELECT * FROM questions WHERE current=%s LIMIT 1;", (True,))

      question = cur.fetchall()

      question = question[0]

      cur.execute("UPDATE questions SET current=%s WHERE question=%s;", (False, question[0]))
      cur.execute("DELETE FROM rooms WHERE question=%s;", (question[0],))

      test_questions(cur)
      test_rooms(cur)

      conn.commit()
      cur.close()
      conn.close()

      return {'answer': question[5]}


def new_questions_in_database(data, cur):

    for question in data:

        cur.execute("SELECT 1 FROM questions WHERE question=%s;", (question['question'],))

        check = cur.fetchall()

        if len(check) == 0:

            cur.execute("INSERT INTO questions (question, choice1, choice2, choice3, choice4, answer, genre, current) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                        (question["question"], question["choices"][0], question["choices"][1], question["choices"][2], question["choices"][3], question["answer"], question["genre"], False))


def get_cursor():
    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    conn = psycopg2.connect(db_config)
    cur = conn.cursor()
    return conn, cur


def test_questions(cur):

    cur.execute("SELECT * FROM questions")

    questions = cur.fetchall()

    print("questions: ")
    print(questions)
    print(len(questions))


def test_rooms(cur):

    cur.execute("SELECT * FROM rooms")

    rooms = cur.fetchall()

    print("rooms: ")
    print(rooms)
    print(len(rooms))


