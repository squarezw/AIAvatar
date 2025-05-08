import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import VoiceClonePanel from './components/VoiceClonePanel'
import AvatarGeneratePanel from './components/AvatarGeneratePanel'
import ResultPanel from './ResultPanel'
import './App.css'

function App() {
  const [tab, setTab] = useState('voice')
  const [result, setResult] = useState(null)

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#18181c' }}>
      <Sidebar tab={tab} setTab={setTab} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#23232a' }}>
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ width: 400, padding: 32, background: '#23232a', color: '#fff' }}>
            {tab === 'voice' ? (
              <VoiceClonePanel setResult={setResult} />
            ) : (
              <AvatarGeneratePanel setResult={setResult} />
            )}
          </div>
          <div style={{ flex: 1, padding: 32, background: '#1a1a1f' }}>
            <ResultPanel tab={tab} result={result} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
