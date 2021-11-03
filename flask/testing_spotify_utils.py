"""

Running these function calls to test correctness.

"""

from spotify_utils import *

tracks_test_these = [
    ("call me maybe", "carly rae jepsen", 2012),
    ("last call", "plini", 2020),
    ("willow", "taylor swift", 2020)
]

albums_test_these = [
    ("call me maybe", "carly rae jepsen", 2012),
    ("impulse voices", "plini", 2020),
    ("evermore", "taylor swift", 2020)
]

testingPlaylist = "https://open.spotify.com/playlist/23ix3PPVfL1JGc4Zj1GpcL?si=f9207fe35cdb4a56"


# Test 1: Receive the correct release year for a given TRACK and artist
""" These are passing
for index in range(len(tracks_test_these)):
    track = tracks_test_these[index][0]
    artist = tracks_test_these[index][1]
    print(f"Expected: {tracks_test_these[index][2]} ----- Returned: {grabTrackYear(track, artist)}")
"""

# Test 2: Receive the correct release year for a given ALBUM and artist
""" These are passing
for index in range(len(albums_test_these)):
    album = albums_test_these[index][0]
    artist = albums_test_these[index][1]
    print(f"Expected: {albums_test_these[index][2]} ----- Returned: {grabAlbumYear(album, artist)}")
"""

# Test 3: Receive the correct album art for a given TRACK and artist
""" These are passing
for index in range(len(tracks_test_these)):
    track = tracks_test_these[index][0]
    artist = tracks_test_these[index][1]
    print(f"IMAGE URL: {grabTrackArt(track, artist)}")
"""

# Test 4: Receive the correct album art for a given ALBUM and artist
""" These are passing
for index in range(len(albums_test_these)):
    album = albums_test_these[index][0]
    artist = albums_test_these[index][1]
    print(f"IMAGE URL: {grabAlbumArt(album, artist)}")
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

