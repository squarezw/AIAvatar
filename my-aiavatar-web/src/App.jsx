import React, { useState } from 'react'
import VoiceCloneForm from './components/VoiceCloneForm'
import AvatarGenerateForm from './components/AvatarGenerateForm'
import './App.css'

function App() {
  const [tab, setTab] = useState('voice')

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>AI Avatar Web</h1>
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setTab('voice')}>语音克隆</button>
        <button onClick={() => setTab('avatar')} style={{ marginLeft: 16 }}>数字人生成</button>
      </div>
      {tab === 'voice' ? <VoiceCloneForm /> : <AvatarGenerateForm />}
    </div>
  )
}

export default App
