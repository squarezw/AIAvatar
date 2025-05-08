import React, { useState } from 'react';

export default function VoiceClonePanel({ setResult }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file && !text) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    if (file) formData.append('audio', file);
    if (text) formData.append('text', text);

    // 替换为你的AI语音克隆API
    const response = await fetch('https://your-ai-api/voice-clone', {
      method: 'POST',
      body: formData,
    });
    const blob = await response.blob();
    setResult({ type: 'audio', url: URL.createObjectURL(blob) });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>文本转语音</h2>
      <div>
        <textarea
          placeholder="请输入要合成的文本"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: '100%', minHeight: 60, marginBottom: 12 }}
        />
      </div>
      <div>
        <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} />
        <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>可选：上传参考音频</div>
      </div>
      <button type="submit" disabled={loading || (!file && !text)}>生成语音</button>
      {loading && <div style={{ color: '#aaa' }}>处理中...</div>}
    </form>
  );
}