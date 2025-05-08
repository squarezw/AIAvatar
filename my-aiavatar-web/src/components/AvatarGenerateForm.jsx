import React, { useState } from 'react';

export default function AvatarGenerateForm() {
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!audio || !video) return;
    setLoading(true);
    setResult('');

    // 你需要先将音频和视频上传到本地服务器可访问的目录，然后传递路径给API
    // 这里假设后端支持直接接收文件（如不支持，需先上传到静态服务器，再传路径）
    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('video', video);

    // 其它参数可根据需要添加
    formData.append('chaofen', 0);
    formData.append('watermark_switch', 0);
    formData.append('pn', 1);

    const response = await fetch('http://127.0.0.1:8383/easy/submit', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setResult(JSON.stringify(data, null, 2));
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>数字人生成</h2>
      <div>
        <label>上传参考音频：</label>
        <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files[0])} />
      </div>
      <div>
        <label>上传参考视频：</label>
        <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} />
      </div>
      <button type="submit" disabled={loading || !audio || !video}>生成数字人</button>
      {loading && <div>处理中...</div>}
      {result && (
        <pre style={{ background: '#eee', padding: 12 }}>{result}</pre>
      )}
    </form>
  );
}
