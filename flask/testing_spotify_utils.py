"""

Running these function calls to test correctness.

"""

from spotify_utils import *

test_these = [
    ("call me maybe", "carly rae jepsen", 2012),
    ("last call", "plini", 2020),
    ("willow", "taylor swift", 2020)
]

for index in range(len(test_these)):
    track = test_these[index][0]
    artist = test_these[index][1]
    print(f"Expected: {test_these[index][2]} ----- Returned: {grabTrackYear(track, artist)}")

