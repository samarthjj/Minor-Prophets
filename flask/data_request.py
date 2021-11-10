import json
import os
import appcode
import random
import psycopg2

from app import rooms_user_info # used on line 143, when get_answer() is called to the database for a room, it saves it accordingly

def get_cursor():
    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    conn = psycopg2.connect(db_config)
    cur = conn.cursor()
    return conn, cur

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
    # return profile


def get_existing_questions(rounds, roomcode):

    conn, cur = get_cursor()

    # conn.close()
    # return

    questionsPerRound = 1 # Changed for testing
    numQuestions = questionsPerRound * rounds
    print("numQuestions = " + str(numQuestions))

    # Creating the questions table if it doesn't exist
    # TESTING PURPOSES ONLY
    #cur.execute("DROP TABLE questions;")
    cur.execute("CREATE TABLE IF NOT EXISTS questions (question varchar, choice1 varchar, choice2 varchar, choice3 varchar, choice4 varchar, answer varchar, genre varchar, current boolean);")

    # Grabs all of the questions where the genre is labelled as "Pop" (all of them for now)
    cur.execute("SELECT * FROM questions WHERE genre=%s;", ("Pop",))

    data = cur.fetchall()

    # Creating the Rooms Table (storing the questions?)
    # TESTING PURPOSES ONLY
    # This is going to be included so it drops all of the prior rooms every restart / we can do this for sprints so we don't have to worry about performance
    cur.execute("CREATE TABLE IF NOT EXISTS rooms (roomcode varchar, question varchar);")
    cur.execute("DELETE FROM rooms;") # Changed, so it just empties all of the rows of the table on startup!

    # Checking the number of questions
    print("There are " + str(len(data)) + " questions in the database (for Pop genre)")

    # if there's not enough stored questions
    # if len(data)/5 < numQuestions:
    if len(data) < numQuestions: # Why was this being divided by 5? No reason for it?
        print("Getting data from Spotify and creating questions")
        print("Actually, this generating code is commented out for now.")
        # data = appcode.generate_questions(numQuestions)
        # new_questions_in_database(data, cur)
        # for question in data:
        #     cur.execute("INSERT INTO rooms (roomcode, question) VALUES (%s, %s)", (roomcode, question["question"]))

    else: # When there are enough stored questions
        print("Getting Existing Stored Data")

        # Randomize and select 5 questions to put into
        random.shuffle(data)
        # print("data", data)
        for i in range(numQuestions):
            question = data[i]

            print(question)

            # This stores the question string into the Rooms table --> Each question is uniquely associated by the Question String !
            cur.execute("INSERT INTO rooms (roomcode, question) VALUES (%s, %s);", (roomcode, question[0]))


    # Prints ALL of the current saved questions and ALL of the current rooms // do we need a table for the rooms? I don't think so?
    # test_questions(cur)
    # test_rooms(cur)

    # cur.commit() # I'm hoping this fixes the problems?
    conn.commit()
    cur.close()
    conn.close()



def get_question(roomcode):

    conn, cur = get_cursor()

    cur.execute("SELECT * FROM rooms WHERE roomcode=%s LIMIT 1;", (roomcode,))

    question = cur.fetchall()

    # This print is VERY important -- It allows for the question to be loaded completely before checking its length.
    # Otherwise, Python will continue on and say the length is 0 every time, even when there are questions!
    print("The Current Question Is ", question)

    if len(question) > 0: # i.e. if there exists a question for the room, serve it.

        question = question[0]

        cur.execute("SELECT * FROM questions WHERE question=%s LIMIT 1;", (question[1],))

        question = cur.fetchall()

        question = question[0]

        cur.execute("UPDATE questions SET current=%s WHERE question=%s;", (True, question[0]))

        output = {"question": question[0], "choices": [question[1], question[2], question[3], question[4]], "answer": question[5], "genre": question[6]}
    else:
        output = {"question" : "Game Over!", "choices": ["", "", "", ""], "answer": "", "genre": ""}

    conn.commit()
    cur.close()
    conn.close()
    return output


def get_answer(room):
    conn, cur = get_cursor()

    cur.execute("SELECT * FROM questions WHERE current=%s LIMIT 1;", (True,))

    question = cur.fetchall()

    # This print is VERY important -- It allows for the question to be loaded completely before checking its length.
    # Otherwise, Python will continue on and say the length is 0 every time, even when there are questions!
    print("The Current Question Is ", question)

    if len(question) > 0:

        question = question[0]

        cur.execute("UPDATE questions SET current=%s WHERE question=%s;", (False, question[0]))
        cur.execute("DELETE FROM rooms WHERE question=%s;", (question[0],))

        # Printing all of the current questions and existing rooms for testing purposes / I think this works fine.
        # test_questions(cur)
        # test_rooms(cur)

        # This will be needed for the Score calculations eventually
        # We might be able to deal with it in a new way...
        # Erroring for now because I haven't added the code to say "add this room to the rooms list" of the {}

        # todo
        # rooms_user_info[room]["correct_answer"] = question[5]

        # Right now though, there is a table for all of the rooms that's just filling up and not being deleted?
        # Perhaps write a function to delete the row associated with a Room key when the "Game Over" screen is reached!

        output = {'answer': question[5]}

    else:
        output = {"answer" : "No more questions!"}

    conn.commit()
    cur.close()
    conn.close()
    return output



def new_questions_in_database(data, cur):

    for question in data:

        cur.execute("SELECT 1 FROM questions WHERE question=%s;", (question['question'],))

        check = cur.fetchall()

        if len(check) == 0:

            cur.execute("INSERT INTO questions (question, choice1, choice2, choice3, choice4, answer, genre, current)"
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s);",
                        (question["question"], question["choices"][0], question["choices"][1], question["choices"][2], question["choices"][3], question["answer"], question["genre"], False))


def test_questions(cur):

    cur.execute("SELECT * FROM questions;")

    questions = cur.fetchall()

    print("questions: ")
    print(questions)
    print(len(questions))


def test_rooms(cur):

    cur.execute("SELECT * FROM rooms;")

    rooms = cur.fetchall()

    print("rooms: ")
    print(rooms)
    print("There are this many pending room questions in the table: " + str(len(rooms)))


