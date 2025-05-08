import React from 'react';

export default function Sidebar({ tab, setTab }) {
  return (
    <div style={{
      width: 120,
      background: '#202024',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 40
    }}>
      <button
        style={{
          background: tab === 'voice' ? '#444' : 'none',
          color: '#fff',
          border: 'none',
          marginBottom: 20,
          padding: '12px 0',
          width: '100%',
          cursor: 'pointer'
        }}
        onClick={() => setTab('voice')}
      >
        文本转语音
      </button>
      <button
        style={{
          background: tab === 'avatar' ? '#444' : 'none',
          color: '#fff',
          border: 'none',
          padding: '12px 0',
          width: '100%',
          cursor: 'pointer'
        }}
        onClick={() => setTab('avatar')}
      >
        数字人生成
      </button>
    </div>
  );
}
