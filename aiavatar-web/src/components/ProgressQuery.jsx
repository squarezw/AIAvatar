import React, { useEffect, useState, useRef } from 'react';

export default function ProgressQuery({ code, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!code) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `${window.location.protocol}//${window.location.hostname}/easy/query?code=${code}`
        );
        const data = await res.json();
        if (data && data.data) {
          setProgress(data.data.progress || 0);
          setMsg(data.data.msg || '');
          setStatus(data.data.status);
          // 假如 status==2 表示完成，自动停止轮询
          if (data.data.status === 2) {
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
    </div>
  );
}
