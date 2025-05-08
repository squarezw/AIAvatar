import React, { useState } from 'react';

export default function AvatarGeneratePanel({ setResult }) {
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [chaofen, setChaofen] = useState(0);
  const [pn, setPn] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!audio || !video) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('video', video);
    formData.append('chaofen', chaofen);
    formData.append('pn', pn);

    const response = await fetch('http://127.0.0.1:8383/easy/submit', {
      method: 'POST',
      body: formData,
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
        <div style={{ fontSize: 12, color: '#aaa' }}>上传参考音频</div>
      </div>
      <div>
        <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} />
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
      <button type="submit" disabled={loading || !audio || !video}>生成数字人</button>
      {loading && <div style={{ color: '#aaa' }}>处理中...</div>}
    </form>
  );
}