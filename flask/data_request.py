import json
import os

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
    # cur.execute("SELECT * from accounts WHERE token=%s;", (str(token),))
    # cur.execute("SELECT * from accounts WHERE username=%s;", ("test",))
    # cur.execute("SELECT * from accounts WHERE token=%s;", ('f72b11e8-5a41-46e4-bc8f-14caa43ce7b6',))

    data = cur.fetchall()

    conn.commit()

    cur.close()
    conn.close()

    # token_test = 'f72b11e8-5a41-46e4-bc8f-14caa43ce7b6'
    # for i in range(len(token_test)):
    #     print(token_test[i])
    #
    # for i in range(len(token)):
    #     print(token[i])

    # print("token:", token, data_token)
    # print("data:", data)
    # print("token_data:", data[0][0])
    # print(token == str(data[0][0]))

    data = data[0]

    profile = {"GamesWon": data[3], "TotalPoints": data[4], "WinRatio": data[5], "FavoriteGenre": data[6]}

    # print(profile)

    return profile
