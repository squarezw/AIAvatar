import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import VoiceClonePanel from './components/VoiceClonePanel'
import AvatarGeneratePanel from './components/AvatarGeneratePanel'
import VoiceSynthesisPanel from './components/VoiceSynthesisPanel'
import './App.css'

// import DUIX from 'duix-guiji'


function App() {
  const [tab, setTab] = useState('voice-synthesis')
  const [result, setResult] = useState(null)

  // const duix = new DUIX()

  // duix.on('intialSucccess', () => {
  //   duix.start({
  //      conversationId: '1376976605951430656',    
  //      muted: true,
  //      wipeGreen: false,
  //  }).then(res => {
  //     console.log('res', res)
  //  })
  // })
  // // initialization
  // duix.init({
  //   sign: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEzNzY5NzY2MDYyNDkyMjYyNDAiLCJpYXQiOjE3NDgzNDAxNjEsImV4cCI6MTc0ODM0MTk2MX0.gKHQaXcYgDvaAWJO264y5Nf0PmlR5tqbceVVcdJW7ec',
  //   containerLable: '.remote-container',
  // })

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
          {/* <div className="remote-container" style={{ flex: 1 }}></div> */}
        </div>
      </div>
    </div>
  )
}

export default App
