import json
import random
import math
import spotify_utils
from datetime import date

'''
def generate_questions(numQuestions):

    f = open("questions.json")
    albumData = json.load(f)
    f.close()

    questionsPerRound = 3
    numberOfCategories = 3

    numberOfQuestionsPerCategory = math.ceil(numQuestions / numberOfCategories)

    questions = generate_artist_questions(albumData, numberOfQuestionsPerCategory) + generate_release_date_questions(albumData, numberOfQuestionsPerCategory) + generate_top_track_questions(albumData, numberOfQuestionsPerCategory)

    random.shuffle(questions)

    return questions

'''

def generate_questions(numQuestions):

    numberOfCategories = 3

    numberOfQuestionsPerCategory = math.ceil(numQuestions / numberOfCategories)

    #albums = ['MONTERO', 'SOUR', 'Planet Her', 'Happier Than Ever', 'Evolution', 'Future Nostalgia', 'folklore', 'Chromatica']
    #artists = ['Lil Nas X', 'Olivia Rodrigo', 'Doja Cat', 'Billie Eilish', 'Joyner Lucas', 'Dua Lipa', 'Taylor Swift', 'Lady Gaga']


    #albums = ['Nine Track Mind', 'The Truth About Love', 'BADLANDS', 'Beauty Behind The Madness', '1989', 'digital druglord', 'thank u, next', 'Pure Heroine', '25', 'The 20/20 Experience', 'Lemonade']
    #artists = ['Charlie Puth', 'P!nk', 'Halsey', 'The Weeknd', 'Taylor Swift', 'blackbear', 'Ariana Grande', 'Lorde', 'Adele', 'Justin Timberlake', 'Beyonce']


    #albums = ['if i could make it go quiet', 'Long Lost', 'lately I feel EVERYTHING', 'Be the Cowboy', 'If this Isn\'t Nice, I Don\'t Know What Is', 'Historian', 'Twin Fantasy']
    #artists =['girl in red', 'Lord Huron', 'WILLOW', 'Mitski', 'Still Woozy', 'Lucy Dacus', 'Car Seat Headrest']


    info = {'Albums': []}

    trackIDs = []

    with open('playlists.txt') as f:
        for playlist in f:

            playlist = playlist.rstrip('\r\n')

            trackIDs += spotify_utils.listPlaylistTrackIDs(playlist)


    usedIDs = []

    for i in range(10):

            track = random.choice(trackIDs)
            while track in usedIDs:

                track = random.choice(trackIDs)

            usedIDs.append(track)

            print("1")

            albumID = spotify_utils.grabAlbumID(track)

            print("2")

            releaseDate = spotify_utils.grabAlbumYear(albumID)

            print("3")

            name = spotify_utils.grabAlbumName(albumID)

            print("4")

            artist = spotify_utils.grabArtistNamesFromAlbum(albumID)

            print("5")


            albumTrackIDs = spotify_utils.listAlbumTrackIDs(albumID)

            print("6")

            albumDict = {'Name': name, 'Artist': artist[0], 'Release Date': int(releaseDate), 'Tracklist': {}}

            if len(artist) == 1:

                for albumTrack in albumTrackIDs:

                    trackName = spotify_utils.grabTrackName(albumTrack)

                    trackPopularity = spotify_utils.grabTrackPopularity(albumTrack)

                    albumDict['Tracklist'][trackName] = int(trackPopularity)

                info['Albums'].append(albumDict)

    questions = generate_artist_questions(info, numberOfQuestionsPerCategory) + generate_release_date_questions(info, numberOfQuestionsPerCategory) + generate_popularity_questions(info, numberOfQuestionsPerCategory)

    random.shuffle(questions)

    return questions



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

            questions.append({"question": "Which artist released " + album['Name'] + "?", "choices": choices, "answer": answer, "genre": "Pop"})

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

            questions.append({"question": "What year was " + album['Name'] + " by " + album['Artist'] + " released?", "choices": choices, "answer": answer, "genre": "Pop"})

    return questions


def generate_popularity_questions(albumData, numberOfQuestions):

    questions = []

    if len(albumData['Albums']) >= 4:

        albums = albumChooser(numberOfQuestions, albumData, True)

        for album in albums:

            top3Songs = findTopThree(album)

            if top3Songs[0][1] != top3Songs[1][1] != top3Songs[2][0]:

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

                questions.append({"question": "Which track off of " + album['Name'] + " by " + album['Artist'] + " is the most popular?", "choices": choices, "answer": answer, "genre": "Pop"})

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
