"""

Utility functions to easily grab Spotify's info.

"""

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os

spotify_secret = os.environ['SPOTIFY_CLIENT_SECRET']
spotify_id = os.environ['SPOTIFY_CLIENT_ID']

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=spotify_id, client_secret=spotify_secret))

#Use str_val.upper() to convert the input artist's and the actual track artist's names to a fully capitalized string and compare the two
def grabTrackYear(track_name, artist_name, type='track', limit=30):
    results = sp.search(q=track_name, type=type, limit=limit)
    # Initialized to "" so that we can update the year when the correct track is found
    release_date = ""
    goal = artist_name.upper()
    for choice in results["tracks"]["items"]:
        found_artist_name = choice["artists"][0]["name"]
        if found_artist_name.upper() == goal:
            release_date = choice["album"]["release_date"]

    if len(release_date) < 4:
        print(f"SONG NOT FOUND in {limit} SEARCHES")
        return

    release_year = release_date[0:4]
    return release_year

#Duplicate code here
def grabAlbumYear(album_name, artist_name, type='album', limit=1):
    results = sp.search(q=album_name, type=type, limit=limit)
    # Initialized to "" so that we can update the year when the correct track is found
    release_date = ""
    goal = artist_name.upper()
    for choice in results["albums"]["items"]:
        found_artist_name = choice["artists"][0]["name"]
        if found_artist_name.upper() == goal:
            release_date = choice["release_date"]

    if len(release_date) < 4:
        print(f"ALBUM NOT FOUND in {limit} SEARCHES")
        print(release_date)
        return

    release_year = release_date[0:4]
    return release_year

#Duplicate code here
def grabTrackArt(track_name, artist_name, type='track', limit=30):
    results = sp.search(q=track_name, type=type, limit=limit)
    # Largest image pixel-wise from Spotify
    track_art = ""
    goal = artist_name.upper()
    for choice in results["tracks"]["items"]:
        found_artist_name = choice["artists"][0]["name"]
        if found_artist_name.upper() == goal:
            track_art = choice["album"]["images"][0]["url"]

    return track_art

#Duplicate code here
def grabAlbumArt(album_name, artist_name, type='album', limit=1):
    results = sp.search(q=album_name, type=type, limit=limit)
    # Largest image pixel-wise from Spotify
    album_art = ""
    goal = artist_name.upper()
    for choice in results["albums"]["items"]:
        found_artist_name = choice["artists"][0]["name"]
        if found_artist_name.upper() == goal:
            album_art = choice["images"][0]["url"]

    return album_art

def pickOutID(playlist_url):
    """
    Given a playlist url, this function will return the length-22 ID associated with the playlist
    to be used for exact lookup.
    """
    return playlist_url[34:56]

def listPlaylistTrackIDs(playlist_url):
    """
    Given a playlist url, this function will return a list of track IDs from that playlist that can later
    be used to grab whole track information.
    """
    playlist_ID = pickOutID(playlist_url)
    playlist_data = sp.playlist(playlist_ID)
    track_IDs = [song["track"]["id"] for song in playlist_data["tracks"]["items"]]
    return track_IDs

def grabTrackName(track_ID):
    """
    Given a track ID, return the track name associated with it.
    """
    return sp.track(track_ID)["name"]

def grabTrackPopularity(track_ID):
    """
    Given a track ID, return the popularity score associated with it as an integer between 0-100 inclusive.
    """
    return sp.track(track_ID)["popularity"]