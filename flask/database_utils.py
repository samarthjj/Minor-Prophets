import os
import psycopg2


def retrieve_username(token):
    db_url = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    token = token[1:-1]

    cur.execute("SELECT username from accounts WHERE token=%s;", (token,))


    username = cur.fetchall()[0][0]

    conn.commit()

    cur.close()
    conn.close()

    return username
