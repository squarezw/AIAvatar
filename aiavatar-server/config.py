import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, 'shared_data', 'face2face')
UPLOAD_FOLDER = os.path.join(UPLOAD_DIR, 'temp')

LOG_FILE = os.path.join(UPLOAD_DIR, 'log/dh.log')

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'mp4', 'avi', 'mov', 'm4a'}