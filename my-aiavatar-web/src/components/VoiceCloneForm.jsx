import React, { useState } from 'react';

export default function VoiceCloneForm() {
  const [file, setFile] = useState(null);
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResultUrl('');
    const formData = new FormData();
    formData.append('audio', file);

    // 替换为你的线上AI语音克隆API地址
    const response = await fetch('https://your-ai-api/voice-clone', {
      method: 'POST',
      body: formData,
    });
    const blob = await response.blob();
    setResultUrl(URL.createObjectURL(blob));
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>语音克隆</h2>
      <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} />
      <button type="submit" disabled={loading || !file}>上传并克隆</button>
      {loading && <div>处理中...</div>}
      {resultUrl && (
        <div>
          <audio controls src={resultUrl} />
          <a href={resultUrl} download="cloned.wav">下载音频</a>
        </div>
      )}
    </form>
  );
}
