import React from 'react';

export default function ResultPanel({ tab, result }) {
  if (!result) return <div style={{ color: '#aaa' }}>请在左侧操作生成内容</div>;

  if (tab === 'voice' && result.type === 'audio') {
    return (
      <div>
        <h3>生成结果</h3>
        <audio controls src={result.url} style={{ width: '100%' }} />
        <a href={result.url} download="cloned.wav" style={{ display: 'block', marginTop: 12 }}>下载音频</a>
      </div>
    );
  }

  if (tab === 'avatar' && result.type === 'video' && result.video_url) {
    return (
      <div>
        <h3>生成结果</h3>
        <video controls src={result.video_url} style={{ width: '100%' }} />
        <a href={result.video_url} download="avatar.mp4" style={{ display: 'block', marginTop: 12 }}>下载视频</a>
      </div>
    );
  }

  // 其它情况展示原始JSON
  return (
    <div>
      <h3>生成结果</h3>
      <pre style={{ background: '#222', color: '#fff', padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
