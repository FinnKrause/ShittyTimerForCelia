import requests
import os
import sys
import spotipy
import socket
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from flask import Flask, request, jsonify
from flask_cors import CORS

from spotipy.oauth2 import SpotifyOAuth
from spotipy import SpotifyOAuth
from pprint import pprint

os.environ["SPOTIPY_CLIENT_ID"] = "51ec7ffc4578466a9f19d9c4934671d6"
os.environ["SPOTIPY_CLIENT_SECRET"] = "0629b1edada74506b0b0a4efd52b1ab3"
os.environ["SPOTIPY_CLIENT_USERNAME"] = "31k7p3joxqtwca7opwgqicvq5kla"
os.environ["SPOTIPY_REDIRECT_URI"] = "https://celia.finnkrause.com/"

scope = "user-read-playback-state,user-modify-playback-state"
sp = spotipy.Spotify(
    client_credentials_manager=SpotifyOAuth(scope=scope, open_browser=False)
)


def handle_function(cmd):
    global scope

    if cmd == "CUser":
        return sp.current_user()

    elif cmd == "track":
        cTrack = sp.current_user_playing_track()
        # imageURL = cTrack["item"]["album"]["images"][0]["url"]
        # print("{\"url\": \"" + imageURL + "\"}")
        # return "{\"url\": \"" + imageURL + "\"}"
        return cTrack

    elif cmd == "relavantStuffForMeLOL":
        cTrack = sp.current_user_playing_track()

        if cTrack is None:
            return {
                "songTitle": None,
                "songArtist": None,
                "image": None,
                "isPlaying": None,
            }

        imageURL = cTrack["item"]["album"]["images"][0]["url"]
        artist = cTrack["item"]["album"]["artists"][0]["name"]
        songTitle = cTrack["item"]["name"]
        isPlaying = cTrack["is_playing"]

        relavantData = {
            "songTitle": songTitle,
            "songArtist": artist,
            "image": imageURL,
            "isPlaying": isPlaying,
        }

        # imageURL = cTrack["item"]["album"]["images"][0]["url"]
        # print("{\"url\": \"" + imageURL + "\"}")
        # return "{\"url\": \"" + imageURL + "\"}"
        return relavantData


app = Flask(__name__)
CORS(app)


@app.route("/")
def handle_request():
    cmd = request.args.get("cmd", "")
    res = {}
    try:
        res = handle_function(cmd)
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(port=6973, host="192.168.178.62")
