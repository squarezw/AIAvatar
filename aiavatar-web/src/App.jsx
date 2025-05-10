import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import VoiceClonePanel from './components/VoiceClonePanel'
import AvatarGeneratePanel from './components/AvatarGeneratePanel'
import VoiceSynthesisPanel from './components/VoiceSynthesisPanel'
import './App.css'

function App() {
  const [tab, setTab] = useState('voice-synthesis')
  const [result, setResult] = useState(null)

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#18181c' }}>
      <Sidebar tab={tab} setTab={setTab} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#23232a' }}>
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ width: 400, padding: 32, background: '#23232a', color: '#fff' }}>
            {tab === 'voice-synthesis' ? (
              <VoiceSynthesisPanel />
            ) : tab === 'avatar' ? (
              <AvatarGeneratePanel setResult={setResult} />
            ) : (
              <VoiceClonePanel setResult={setResult} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
