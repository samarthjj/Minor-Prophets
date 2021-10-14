import json
import random
from datetime import date


def generate_questions(albumData, rounds):

    allQuestions = [generate_artist_questions(albumData), generate_release_date_questions(albumData), generate_top_track_questions(albumData)]
    roundsPerGame = 3
    questions = []
    for i in range(rounds*roundsPerGame):
        choice = random.choice(allQuestions)
        allQuestions.remove(choice)
        questions.append(choice)

    return questions

def generate_artist_questions(albumData):

    questions = []

    if len(albumData) >= 4:

        for album in albumData.keys():

            artists = [albumData[album]["Artist"] for album in albumData.keys()]

            answer = albumData[album]['Artist']
            artists.remove(answer)

            choices = [answer]
            for i in range(3):
                choice = random.choice(artists)
                choices.append(choice)
                artists.remove(choice)

            random.shuffle(choices)

            questions.append({"question": "Which artist released " + album + "?", "choices": choices, "answer": answer, "album art": albumData[album]['Album Art']})

    return questions


def generate_release_date_questions(albumData):

    questions = []

    if len(albumData) >= 4:

        for album in albumData.keys():

            answer = albumData[album]['Release Date']

            choices = [answer]
            lowerBound, upperBound = bounds(answer)
            possibleYears = []

            for i in range(lowerBound, upperBound):
                if i != answer:
                    possibleYears.append(i)

            for i in range(3):
                choice = random.choice(possibleYears)
                choices.append(choice)
                possibleYears.remove(choice)

            random.shuffle(choices)

            questions.append({"question": "What year was " + album + " by " + albumData[album]['Artist'] + " released?", "choices": choices, "answer": answer, "album art": albumData[album]['Album Art']})

    return questions


def generate_top_track_questions(albumData):

    questions = []

    if len(albumData) >= 4:

        for album in albumData.keys():

            tracklistSortedByPlays = sorted(albumData[album]["Tracklist"], key=sortByPlays, reverse=True)
            answer = tracklistSortedByPlays[0]
            tracklistSortedByPlays.remove(answer)
            choices = [list(answer.keys())[0]]

            for i in range(1,3):
                choice = tracklistSortedByPlays[0]
                choices.append(list(choice.keys())[0])
                tracklistSortedByPlays.remove(choice)

            choices.append(list(random.choice(tracklistSortedByPlays).keys())[0])

            random.shuffle(choices)

            questions.append({"question": "Which track has the most plays?", "choices": choices, "answer": list(answer.keys())[0], "album art": albumData[album]['Album Art']})

    return questions


def bounds(answer):

    lower = answer - 4
    upper = answer + 2

    currentYear = date.today().year

    while upper > currentYear+1:
        upper -= 1

    return lower, upper


def sortByPlays(track):
    return list(track.values())[0]
