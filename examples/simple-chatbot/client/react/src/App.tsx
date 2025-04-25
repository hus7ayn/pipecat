import {
  RTVIClientAudio,
  RTVIClientVideo,
  useRTVIClientTransportState,
} from '@pipecat-ai/client-react';
import { RTVIProvider } from './providers/RTVIProvider';
import { ConnectButton } from './components/ConnectButton';
import { StatusDisplay } from './components/StatusDisplay';
import { DebugDisplay } from './components/DebugDisplay';
// newly added imports
import { TranscriptDisplay } from './components/TranscriptDisplay'; // ✅ Already present
import './components/TranscriptDisplay.css'; // ✅ Already present

// ✅ Newly added imports below
import { RecordingDisplay } from './components/RecordingDisplay';
import './components/RecordingDisplay.css';

import './App.css';

function BotVideo() {
  const transportState = useRTVIClientTransportState();
  const isConnected = transportState !== 'disconnected';

  return (
    <div className="bot-container">
      <div className="video-container">
        {isConnected && <RTVIClientVideo participant="bot" fit="cover" />}
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <div className="app">
      <div className="status-bar">
        <StatusDisplay />
        <ConnectButton />
      </div>

      <div className="main-content">
        <BotVideo />
        <TranscriptDisplay />
      </div>

      <DebugDisplay />
      <RecordingDisplay /> {/* ✅ Added here exactly as requested */}
      <RTVIClientAudio />
    </div>
  );
}

function App() {
  return (
    <RTVIProvider>
      <AppContent />
    </RTVIProvider>
  );
}

export default App;
