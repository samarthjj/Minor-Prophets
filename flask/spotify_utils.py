"""

Utility functions to easily grab Spotify's info.

"""
#
# import spotipy
# from spotipy.oauth2 import SpotifyClientCredentials
# import os
#
# spotify_secret = os.environ['SPOTIFY_CLIENT_SECRET']
# spotify_id = os.environ['SPOTIFY_CLIENT_ID']
#
# sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=spotify_id, client_secret=spotify_secret))
#
#
# def listPlaylistTrackIDs(playlist_url):
#     """
#     Given a playlist url, this function will return a list of track IDs from that playlist that can later
#     be used to grab whole track information.
#     """
#     playlist_id = pickOutID(playlist_url)
#     playlist_data = sp.playlist(playlist_id)
#     track_ids = [song["track"]["id"] for song in playlist_data["tracks"]["items"]]
#     return track_ids
#
#
# def listAlbumTrackIDs(album_id):
#     """
#     Given an album ID, return a list of all the track IDs associated with the album.
#     """
#     album_data = sp.album(album_id)
#     track_ids = [track["id"] for track in album_data["tracks"]["items"]]
#     return track_ids
#
#
# def pickOutID(playlist_url):
#     """
#     Given a playlist url, this function will return the length-22 ID associated with the playlist
#     to be used for exact lookup.
#     """
#     return playlist_url[34:56]
#
#
# def grabAlbumID(track_id):
#     """
#     Given a track ID, return the album ID associated with it
#     """
#     track_data = sp.track(track_id)
#     album_id = track_data["album"]["id"]
#     return album_id
#
#
# def grabTrackYear(track_id):
#     """
#     Given a track ID, return the year related to the release date of this track as a string.
#     """
#     track_data = sp.track(track_id)
#     release_year = track_data["album"]["release_date"][0:4]
#     return release_year
#
#
# def grabAlbumYear(album_id):
#     """
#     Given an album ID, return the year related to the release date of this album as a string.
#     """
#     album_data = sp.album(album_id)
#     release_year = album_data["release_date"][0:4]
#     return release_year
#
#
# def grabTrackArt(track_id):
#     """
#     Given a track ID, return a temporary URl to the 640x640 image associated with the track. The URL expires in
#     under 24 hours from the time of conception.
#     """
#     track_data = sp.track(track_id)
#     art = track_data["album"]["images"][0]["url"]
#     return art
#
#
# def grabAlbumArt(album_id):
#     """
#     Given an album ID, return a temporary URL to the 640x640 image associated with the album. The URL expires in
#     under 24 hours from the time of conception.
#     """
#     album_data = sp.album(album_id)
#     art = album_data["images"][0]["url"]
#     return art
#
#
# def grabTrackName(track_id):
#     """
#     Given a track ID, return the track name associated with it.
#     """
#     return sp.track(track_id)["name"]
#
#
# def grabAlbumName(album_id):
#     """
#     Given an album ID, return the album name associated with it.
#     """
#     return sp.album(album_id)["name"]
#
#
# def grabArtistNamesFromTrack(track_id):
#     """
#     Given a track ID, return a list of artists associated with it.
#     """
#     track_data = sp.track(track_id)
#     artists = [artist["name"] for artist in track_data["album"]["artists"]]
#     return artists
#
#
# def grabArtistNamesFromAlbum(album_id):
#     """
#     Given an album ID, return a list of artists associated with it.
#     """
#     album_data = sp.album(album_id)
#     artists = [artist["name"] for artist in album_data["artists"]]
#     return artists
#
#
# def grabTrackPopularity(track_id):
#     """
#     Given a track ID, return the popularity score associated with it as an integer between 0-100 inclusive.
#     """
#     return sp.track(track_id)["popularity"]