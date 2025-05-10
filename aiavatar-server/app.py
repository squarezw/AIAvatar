from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from config import UPLOAD_FOLDER, LOG_FILE
from utils import allowed_file, list_files, remove_file, read_log
from flask_cors import CORS

app = Flask(__name__)

# 推荐用环境变量或命令行参数控制
debug_mode = os.environ.get('DEBUG', 'false') == 'true'
if debug_mode:
    CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'filename': filename}), 200
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/files', methods=['GET'])
def files_list():
    files = list_files(app.config['UPLOAD_FOLDER'])
    return jsonify({'files': files})

@app.route('/delete', methods=['POST'])
def delete_file():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    result = remove_file(app.config['UPLOAD_FOLDER'], filename)
    if result:
        return jsonify({'msg': 'File deleted'}), 200
    else:
        return jsonify({'error': 'File not found'}), 404

@app.route('/log', methods=['GET'])
def get_log():
    log_content = read_log(LOG_FILE)
    return jsonify({'log': log_content})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=debug_mode) 