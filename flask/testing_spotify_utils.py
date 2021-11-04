"""

Running these function calls to test correctness.

"""

from spotify_utils import *

testingPlaylist = "https://open.spotify.com/playlist/23ix3PPVfL1JGc4Zj1GpcL?si=f9207fe35cdb4a56"

# Test 1: Receive the correct release year for a given TRACK and artist
""" This is passing
single_track = listPlaylistTrackIDs(testingPlaylist)[0]
print(grabTrackYear(single_track))
"""

# Test 2: Receive the correct release year for a given ALBUM and artist
""" This is passing
single_album = "0zFqkobYDLzAAHbK2lgc68"
print(grabAlbumYear(single_album))
"""

# Test 3: Receive the correct album art for a given TRACK
""" This is passing
single_track = listPlaylistTrackIDs(testingPlaylist)[0]
print(grabTrackArt(single_track))
"""


# Test 4: Receive the correct album art for a given ALBUM
""" This is passing
single_album = "0zFqkobYDLzAAHbK2lgc68"
print(grabAlbumArt(single_album))
"""

# Test 5: Grabbing correct playlist ID from a playlist URL
""" This is passing
print(pickOutID(testingPlaylist))
"""

# Test 6: Returning a list of tracks from a playlist url
""" This is passing
print(listPlaylistTrackIDs(testingPlaylist))
"""

#Test 7: Returning the name of a track given a track ID
""" This is passing
for track in listPlaylistTrackIDs(testingPlaylist):
    print(grabTrackName(track))
"""

# Test 8: Returning the correct popularity of tracks
""" This is passing
for track in listPlaylistTrackIDs(testingPlaylist):
    print(grabTrackPopularity(track))
"""

# Test 9: Returning the album ID associated with a given track ID. Acceptance if we can return the correct album
# art using the returned album ID.
""" This is passing
single_track = listPlaylistTrackIDs(testingPlaylist)[0]
album_id = grabAlbumID(single_track)
print(grabAlbumArt(album_id))
"""

# Test 10: Returning a list of the track IDs for all tracks in a single album.
""" This is passing
album_id = "0zFqkobYDLzAAHbK2lgc68"
print(listAlbumTrackIDs(album_id))
"""

# Test 11: Returning a list of artists given a track ID.
""" This is passing
single_track = listPlaylistTrackIDs(testingPlaylist)[0]
print(grabArtistNamesFromTrack(single_track))
"""

#Test 12: Returning a list of artists given an album ID.
""" This is passing
single_album = "0zFqkobYDLzAAHbK2lgc68"
print(grabArtistNamesFromAlbum(single_album))
"""

# Test 13: Testing isSingle on a "single" and an "album"
albums = ["0zFqkobYDLzAAHbK2lgc68", "4gYRifAy47Kiw1k152e6hv", "1ORxRsK3MrSLvh7VQTF01F"]
for album_id in albums:
    print(f"{grabAlbumName(album_id)} -------- This is a single: {isSingle(album_id)}")