import psycopg2
import os

# Increments the # of games played for a designated user
def incrementGamesPlayed(token):
    db_url = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    token = token[1:-1]

    cur.execute("SELECT * from accounts WHERE token=%s;", (token,))

    data = cur.fetchall()
    data = data[0]

    gamesPlayed = int(data[6])
    gamesPlayed += 1
    gamesPlayed = str(gamesPlayed)

    cur.execute("UPDATE accounts SET ratio = %s WHERE token = %s;", (gamesPlayed,token))

    conn.commit()
    cur.close()
    conn.close()

def incrementTotalPoints(token):
    db_url = os.environ['DATABASE_URL'] if 'DATABASE_URL' in os.environ else os.environ['DATABASE_URL_LOCAL']
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    token = token[1:-1]

    cur.execute("SELECT * from accounts WHERE token=%s;", (token,))

    data = cur.fetchall()
    data = data[0]

    totalPoints = int(data[5])
    totalPoints += 1
    totalPoints = str(totalPoints)

    cur.execute("UPDATE accounts SET total_points = %s WHERE token = %s;", (totalPoints, token))

    conn.commit()
    cur.close()
    conn.close()