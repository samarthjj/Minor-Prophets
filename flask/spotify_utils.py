import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os

spotify_secret = os.environ['SPOTIFY_CLIENT_SECRET']
spotify_id = os.environ['SPOTIFY_CLIENT_ID']

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=spotify_id, client_secret=spotify_secret))

results = sp.search(q='plini', type='track', limit=5)
tracks = results['tracks']['items']

for idx, track in enumerate(tracks):
  print(idx, track['name'])
  print('-----album art-----')
  for image in track['album']['images']:
    print(image['url'])

results = sp.search(q='polyphia', type='artist', limit=2)
for artist in results['artists']['items']:
  print(artist['name'])