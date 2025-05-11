import React from 'react';

export default function Sidebar({ tab, setTab }) {
  return (
    <nav className="sidebar">
      <button
        className={`sidebar-btn${tab === 'voice-clone' ? ' active' : ''}`}
        onClick={() => setTab('voice-clone')}
      >
        语音克隆
      </button>
      <button
        className={`sidebar-btn${tab === 'voice-synthesis' ? ' active' : ''}`}
        onClick={() => setTab('voice-synthesis')}
      >
        文本转语音
      </button>            
      <button
        className={`sidebar-btn${tab === 'avatar' ? ' active' : ''}`}
        onClick={() => setTab('avatar')}
      >
        数字人生成
      </button>
    </nav>
  );
}
