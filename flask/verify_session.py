import os

import psycopg2


def verify_valid_session(token):

    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']

    # Input has "" surrounding it as actual characters for some reason. This loop removes them. (I know, not very efficient, but it works.)
    data_token = ''
    for i in range(1, len(token) - 1):
        data_token = data_token + token[i]

    conn = psycopg2.connect(db_config)
    cur = conn.cursor()

    cur.execute("SELECT EXISTS(SELECT * from accounts WHERE token=%s);", (data_token,))
    valid_token = cur.fetchall()[0][0]

    if not valid_token:
        return False

    if valid_token:
        cur.execute("SELECT * from accounts WHERE token=%s;", (data_token,))
        user_data = cur.fetchall()[0]
        if user_data[1] == "false":
            return False

    # cur.execute("SELECT * FROM accounts;")
    #
    # data = cur.fetchall()

    conn.commit()

    cur.close()
    conn.close()

    # For debugging:
    # users = [{"token": i[0], "valid session": i[1], "username": i[2], "password": i[3], "Games Won:": i[4],
    #           "Total Points:": i[5], "Win Ratio:": i[6], "Favorite Genre:": i[7]} for i in
    #          data]  # https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions
    # print(users)

    return True
