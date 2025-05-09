import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AvatarGeneratePanel({ setResult }) {
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [audioFilename, setAudioFilename] = useState('');
  const [videoFilename, setVideoFilename] = useState('');
  const [chaofen, setChaofen] = useState(0);
  const [pn, setPn] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  async function handleAudioUpload() {
    if (!audio) return;
    setUploadingAudio(true);
    const formData = new FormData();
    formData.append('file', audio);
    const uploadHost = `${window.location.protocol}//${window.location.hostname}/upload`;
    const res = await fetch(uploadHost, { method: 'POST', body: formData });
    const { filename } = await res.json();
    setAudioFilename(filename);
    setUploadingAudio(false);
  }

  async function handleVideoUpload() {
    if (!video) return;
    setUploadingVideo(true);
    const formData = new FormData();
    formData.append('file', video);
    const uploadHost = `${window.location.protocol}//${window.location.hostname}/upload`;
    const res = await fetch(uploadHost, { method: 'POST', body: formData });
    const { filename } = await res.json();
    setVideoFilename(filename);
    setUploadingVideo(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!audioFilename || !videoFilename) return;
    setLoading(true);
    setResult(null);
    const submitBody = {
      audio_url: audioFilename,
      video_url: videoFilename,
      code: uuidv4(),
      chaofen,
      watermark_switch: 0,
      pn,
    };
    const submitHost = `${window.location.protocol}//${window.location.hostname}/easy/submit`;
    const response = await fetch(submitHost, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitBody),
    });
    const data = await response.json();
    setResult({ type: 'video', ...data });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>数字人生成</h2>
      <div>
        <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files[0])} />
        <button type="button" onClick={handleAudioUpload} disabled={!audio || uploadingAudio} style={{ marginLeft: 8 }}>
          {uploadingAudio ? '上传中...' : '上传音频'}
        </button>
        <input type="text" value={audioFilename} readOnly placeholder="音频文件名" style={{ marginLeft: 8, width: 180 }} />
        <div style={{ fontSize: 12, color: '#aaa' }}>上传参考音频</div>
      </div>
      <div>
        <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} />
        <button type="button" onClick={handleVideoUpload} disabled={!video || uploadingVideo} style={{ marginLeft: 8 }}>
          {uploadingVideo ? '上传中...' : '上传视频'}
        </button>
        <input type="text" value={videoFilename} readOnly placeholder="视频文件名" style={{ marginLeft: 8, width: 180 }} />
        <div style={{ fontSize: 12, color: '#aaa' }}>上传参考视频</div>
      </div>
      <div>
        <label>超分（chaofen）:</label>
        <input type="number" value={chaofen} min={0} max={1} onChange={e => setChaofen(Number(e.target.value))} />
      </div>
      <div>
        <label>人物编号（pn）:</label>
        <input type="number" value={pn} min={1} onChange={e => setPn(Number(e.target.value))} />
      </div>
      <button type="submit" disabled={loading || !audioFilename || !videoFilename}>生成数字人</button>
      {loading && <div style={{ color: '#aaa' }}>处理中...</div>}
    </form>
  );
}