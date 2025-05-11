import os

UPLOAD_DIR = '../shared_data/face2face/';
UPLOAD_FOLDER = os.path.join(UPLOAD_DIR,'temp');

LOG_FILE = os.path.join(UPLOAD_DIR, 'log/dh.log')

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'mp4', 'avi', 'mov'} 