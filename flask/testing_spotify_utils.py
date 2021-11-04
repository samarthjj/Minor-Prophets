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
single_track = listPlaylistTrackIDs(testingPlaylist)[0]
album_id = grabAlbumID(single_track)
print(grabAlbumArt(album_id))