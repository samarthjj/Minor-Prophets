import json
import random
import math
from datetime import date


def generate_questions(albumData, rounds):

    questionsPerRound = 3
    numberOfCategories = 3

    numberOfQuestionsPerCategory = math.ceil((rounds * questionsPerRound) / numberOfCategories)

    questions = generate_artist_questions(albumData, numberOfQuestionsPerCategory) + generate_release_date_questions(albumData, numberOfQuestionsPerCategory) + generate_top_track_questions(albumData, numberOfQuestionsPerCategory)

    return questions

 '''
 def generate_questions(rounds)



def generate_artist_questions(albumData, numberOfQuestions):

    questions = []


    if len(albumData['Albums']) >= 4:

        albums = albumChooser(numberOfQuestions, albumData, False)

        for album in albums:

            artists = [eachAlbum['Artist'] for eachAlbum in albumData['Albums']]

            answer = album['Artist']
            artists.remove(answer)

            choices = [answer]
            for i in range(3):
                choice = random.choice(artists)
                choices.append(choice)
                artists.remove(choice)

            random.shuffle(choices)

            questions.append({"question": "Which artist released " + album['Name'] + "?", "choices": choices, "answer": answer, "album art": album['Album Art']})

    return questions


def generate_release_date_questions(albumData, numberOfQuestions):

    questions = []

    if len(albumData['Albums']) >= 4:

        albums = albumChooser(numberOfQuestions, albumData, False)

        for album in albums:

            answer = album['Release Date']

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

            questions.append({"question": "What year was " + album['Name'] + " by " + album['Artist'] + " released?", "choices": choices, "answer": answer, "album art": album['Album Art']})

    return questions


def generate_top_track_questions(albumData, numberOfQuestions):

    questions = []

    if len(albumData['Albums']) >= 4:

        albums = albumChooser(numberOfQuestions, albumData, True)

        for album in albums:

            top3Songs = findTopThree(album)

            answer = top3Songs[0][0]
            top3Songs.pop(0)
            choices = [answer]

            for i in range(1,3):
                choice = top3Songs[0][0]
                choices.append(choice)
                top3Songs.pop(0)

            possibleTracks = getTracks(album['Tracklist'], choices)

            choices.append(random.choice(possibleTracks))

            random.shuffle(choices)

            questions.append({"question": "Which track has the most plays?", "choices": choices, "answer": answer, "album art": album['Album Art']})


    return questions


def bounds(answer):

    lower = answer - 4
    upper = answer + 2

    currentYear = date.today().year

    while upper > currentYear+1:
        upper -= 1

    return lower, upper



def albumChooser(numberOfQuestions, albumData, isTracks):

    possibleAlbums = albumData['Albums'].copy()
    albums = []
    count = 0
    while count < numberOfQuestions:
        album = random.choice(possibleAlbums)
        if isTracks:
            if len(album['Tracklist']) >= 4:
                albums.append(album)
                possibleAlbums.remove(album)
                count += 1
        else:
            albums.append(album)
            possibleAlbums.remove(album)
            count += 1

    return albums


def getTracks(tracks, choices):

    possibleTracks = []
    for track in tracks.keys():
        if track not in choices:
            possibleTracks.append(track)

    return possibleTracks


def findTopThree(album):

    top3 = []
    for key in album['Tracklist'].keys():
        top3.append((key, album['Tracklist'][key]))

    top3 = sorted(top3, key=sortByPlays, reverse=True)

    return top3[0:3]


def sortByPlays(tup):
    return tup[1]
