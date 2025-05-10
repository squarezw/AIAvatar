import React, { useState } from 'react';

export default function VoiceClonePanel({ setResult }) {
  const [file, setFile] = useState(null);
  const [voiceId, setVoiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const uploadHost = `${window.location.protocol}//${window.location.hostname}:3000`;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setVoiceId('');
    if (!file) {
      setError('请上传语音文件');
      return;
    }
    setLoading(true);
    setResult && setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${uploadHost}/voice-clone`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.voice_id) {
        setVoiceId(data.voice_id);
      } else {
        setError(data.error || '语音克隆失败');
      }
    } catch (e) {
      setError('请求失败');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>语音克隆</h2>
      <div>
        <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} />
        <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>请上传一段清晰的语音样本</div>
      </div>
      <button type="submit" disabled={loading || !file}>克隆语音</button>
      {loading && <div style={{ color: '#aaa' }}>处理中...</div>}
      {voiceId && (
        <div style={{ marginTop: 16, color: '#4caf50' }}>
          克隆成功！voice_id: <span style={{ fontWeight: 'bold' }}>{voiceId}</span>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </form>
  );
}