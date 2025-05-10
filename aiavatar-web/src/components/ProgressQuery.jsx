import React, { useEffect, useState, useRef } from 'react';

export default function ProgressQuery({ code, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState('');
  const timerRef = useRef(null);
  const uploadHost = `${window.location.protocol}//${window.location.hostname}`;
  useEffect(() => {
    if (!code) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `${uploadHost}/easy/query?code=${code}`
        );
        const data = await res.json();
        if (data && data.data) {
          setProgress(data.data.progress || 0);
          setMsg(data.data.msg || '');
          setStatus(data.data.status);
          setResult(data.data.result || '');
          // 任务完成且有 result 时，停止轮询
          if (data.data.status === 2 && data.data.result) {
            clearInterval(timerRef.current);
            if (onComplete) onComplete(data.data);
          }
        }
      } catch (e) {
        setMsg('查询进度失败');
      }
    };

    fetchProgress();
    timerRef.current = setInterval(fetchProgress, 5000);

    return () => clearInterval(timerRef.current);
  }, [code, onComplete]);

  if (!code) return null;

  // 拼接视频播放地址
  const videoUrl = result ? `${uploadHost}/play/temp/${result}` : '';

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>进度：</strong>
        <progress value={progress} max={100} style={{ width: 200 }} />
        <span style={{ marginLeft: 8 }}>{progress}%</span>
      </div>
      <div>
        <strong>状态：</strong>
        <span>{msg}</span>
      </div>
      {status === 2 && result && (
        <div style={{ marginTop: 16 }}>
          <video src={videoUrl} controls style={{ width: 400 }} />
          <div>
            <a href={videoUrl} download style={{ marginTop: 8, display: 'inline-block' }}>
              下载视频
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
