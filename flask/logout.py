import os

import psycopg2


def invalidate_session(token):
    db_config = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']

    # Input has "" surrounding it as actual characters for some reason. This loop removes them. (I know, not very efficient, but it works.)
    data_token = ''
    for i in range(1, len(token) - 1):
        data_token = data_token + token[i]

    conn = psycopg2.connect(db_config)
    cur = conn.cursor()

    cur.execute("UPDATE accounts SET valid_session = %s WHERE token = %s;", (False,data_token))

    cur.execute("SELECT * FROM accounts;")

    data = cur.fetchall()

    conn.commit()

    cur.close()
    conn.close()

    # For debugging:
    users = [{"token": i[0], "valid session": i[1], "username": i[2], "password": i[3], "Games Won:": i[4],
              "Total Points:": i[5], "Win Ratio:": i[6], "Favorite Genre:": i[7]} for i in
             data]  # https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions
    print(users)

    return