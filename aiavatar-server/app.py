from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from config import UPLOAD_FOLDER, LOG_FILE
from utils import allowed_file, list_files, remove_file, read_log
from flask_cors import CORS
import requests
import json
import uuid

app = Flask(__name__)

# 推荐用环境变量或命令行参数控制
debug_mode = os.environ.get('DEBUG', 'false') == 'true'
if debug_mode:
    CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 假设 voice_id 存储在本地文件 voice_ids.json
VOICE_ID_FILE = os.path.join(os.path.dirname(__file__), 'voice_ids.json')

MINIMAX_GROUP_ID = os.environ.get('MINIMAX_GROUP_ID')
if not MINIMAX_GROUP_ID:
    raise RuntimeError('请设置环境变量 MINIMAX_GROUP_ID')
MINIMAX_API_KEY = os.environ.get('MINIMAX_API_KEY')
if not MINIMAX_API_KEY:
    raise RuntimeError('请设置环境变量 MINIMAX_API_KEY')

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

@app.route('/voice-clone', methods=['POST'])
def voice_clone():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # 1. 上传文件到 minimax
    upload_url = f'https://api.minimaxi.chat/v1/files/upload?GroupId={MINIMAX_GROUP_ID}'
    headers1 = {
        'Authorization': f'Bearer {MINIMAX_API_KEY}'
    }
    data = {'purpose': 'voice_clone'}
    files = {'file': (file.filename, file.stream, file.mimetype)}
    resp1 = requests.post(upload_url, headers=headers1, data=data, files=files)
    print('上传minimax响应:', resp1.status_code, resp1.text)
    try:
        file_id = resp1.json().get('file', {}).get('file_id')
        print('file_id:', file_id)
    except Exception as e:
        print('解析file_id失败:', e)
        return jsonify({'error': f'文件上传失败: {str(e)}', 'raw': resp1.text}), 500
    if not file_id:
        print('未获取到 file_id, resp1:', resp1.text)
        return jsonify({'error': '未获取到 file_id', 'raw': resp1.text}), 500

    # 2. 调用 voice_clone
    clone_url = f'https://api.minimaxi.chat/v1/voice_clone?GroupId={MINIMAX_GROUP_ID}'
    unique_voice_id = f'voice_{uuid.uuid4().hex[:12]}'
    payload = json.dumps({
        'file_id': file_id,
        'voice_id': unique_voice_id
    })
    print('调用voice_clone payload:', payload)
    headers2 = {
        'Authorization': f'Bearer {MINIMAX_API_KEY}',
        'Content-Type': 'application/json'
    }
    resp2 = requests.post(clone_url, headers=headers2, data=payload)
    print('voice_clone响应:', resp2.status_code, resp2.text)
    try:
        data2 = resp2.json()
        print('voice_clone解析后:', data2)
    except Exception as e:
        print('解析voice_clone响应失败:', e)
        return jsonify({'error': f'克隆失败: {str(e)}', 'raw': resp2.text}), 500

    # 判断是否成功
    if data2.get('base_resp', {}).get('status_code') == 0:
        print('voice clone 成功, 使用 voice_id:', unique_voice_id)
        # 保存 voice_id
        voice_ids = {}
        if os.path.exists(VOICE_ID_FILE):
            with open(VOICE_ID_FILE, 'r', encoding='utf-8') as f:
                try:
                    voice_ids = json.load(f)
                except Exception:
                    voice_ids = {}
        voice_ids[file.filename] = unique_voice_id
        with open(VOICE_ID_FILE, 'w', encoding='utf-8') as f:
            json.dump(voice_ids, f, ensure_ascii=False, indent=2)
        return jsonify({'voice_id': unique_voice_id}), 200
    else:
        print('voice clone 失败, data2:', data2)
        return jsonify({'error': 'voice clone 失败', 'raw': resp2.text}), 500

@app.route('/voice-ids', methods=['GET'])
def get_voice_ids():
    # 返回所有 voice_id
    voice_ids = {}
    if os.path.exists(VOICE_ID_FILE):
        with open(VOICE_ID_FILE, 'r', encoding='utf-8') as f:
            try:
                voice_ids = json.load(f)
            except Exception:
                voice_ids = {}
    # 返回 {文件名: voice_id} 列表
    return jsonify({'voice_ids': list(voice_ids.values())})

@app.route('/t2a', methods=['POST'])
def text_to_audio():
    data = request.get_json()
    text = data.get('text')
    voice_id = data.get('voice_id')
    if not text or not voice_id:
        return jsonify({'error': 'text 和 voice_id 必填'}), 400
    # 构造 minimax t2a_v2 请求
    t2a_url = f'https://api.minimaxi.chat/v1/t2a_v2?GroupId={MINIMAX_GROUP_ID}'
    headers = {
        'Authorization': f'Bearer {MINIMAX_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        "model": "speech-02-hd",
        "text": text,
        "stream": False,
        "voice_setting": {
            "voice_id": voice_id,
            "speed": 1,
            "vol": 1,
            "pitch": 0
        },
        "audio_setting": {
            "sample_rate": 32000,
            "bitrate": 128000,
            "format": "mp3",
            "channel": 1
        },
        "output_format": "url"
    }
    print('t2a payload:', payload)
    resp = requests.post(t2a_url, headers=headers, data=json.dumps(payload))
    print('t2a响应:', resp.status_code, resp.text)
    try:
        resp_data = resp.json()
    except Exception as e:
        return jsonify({'error': f'解析t2a响应失败: {str(e)}', 'raw': resp.text}), 500
    # 检查返回
    if resp_data.get('base_resp', {}).get('status_code') == 0:
        # 优先用 subtitle_file 或 data.audio（url）
        audio_url = resp_data.get('data', {}).get('audio')
        if not audio_url:
            audio_url = resp_data.get('subtitle_file')
        if not audio_url:
            return jsonify({'error': '未获取到音频链接', 'raw': resp.text}), 500
        return jsonify({'audio_url': audio_url}), 200
    else:
        return jsonify({'error': '文本转语音失败', 'raw': resp.text}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=debug_mode) 