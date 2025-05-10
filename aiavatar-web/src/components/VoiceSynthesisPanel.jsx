import React, { useState, useEffect } from 'react';

export default function VoiceSynthesisPanel() {
  const [text, setText] = useState('');
  const [voiceIds, setVoiceIds] = useState([]);
  const [voiceId, setVoiceId] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const uploadHost = `${window.location.protocol}//${window.location.hostname}:3000`;

  useEffect(() => {
    // 获取 voice_id 列表
    fetch(`${uploadHost}/voice-ids`)
      .then(res => res.json())
      .then(data => {
        setVoiceIds(data.voice_ids || []);
        if (data.voice_ids && data.voice_ids.length > 0) {
          setVoiceId(data.voice_ids[0]);
        }
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setAudioUrl('');
    if (!text.trim()) {
      setError('请输入要合成的文本');
      return;
    }
    if (!voiceId) {
      setError('请选择 voice_id');
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${uploadHost}/t2a`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice_id: voiceId })
      });
      const data = await resp.json();
      if (data.audio_url) {
        setAudioUrl(data.audio_url);
      } else {
        setError(data.error || '生成失败');
      }
    } catch (e) {
      setError('请求失败');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>文本转语音</h2>
      <div style={{ marginBottom: 12 }}>
        <textarea
          placeholder="请输入要合成的文本"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: '100%', minHeight: 60, marginBottom: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>选择 voice_id：</label>
        <select value={voiceId} onChange={e => setVoiceId(e.target.value)}>
          {voiceIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading || !text.trim() || !voiceId}>生成语音</button>
      {loading && <div style={{ color: '#aaa' }}>处理中...</div>}
      {audioUrl && (
        <div style={{ marginTop: 16 }}>
          <audio src={audioUrl} controls style={{ width: 320 }} />
          <div>
            <a href={audioUrl} download style={{ marginTop: 8, display: 'inline-block' }}>
              下载音频
            </a>
          </div>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </form>
  );
} 