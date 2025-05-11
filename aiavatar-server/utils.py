import os
from config import ALLOWED_EXTENSIONS

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def list_files(folder):
    try:
        return [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f))]
    except Exception:
        return []

def remove_file(folder, filename):
    path = os.path.join(folder, filename)
    if os.path.exists(path):
        os.remove(path)
        return True
    return False

def read_log(log_path, max_lines=100):
    if not os.path.exists(log_path):
        return ''
    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    return ''.join(lines[-max_lines:]) 