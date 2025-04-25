import { useEffect, useState, useRef } from 'react';
import { useRTVIClientTransportState, useRTVIClient } from '@pipecat-ai/client-react';

export function RecordingDisplay() {
  const [recordingUrl, setRecordingUrl] = useState<string>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const chunksRef = useRef<Blob[]>([]);
  const transportState = useRTVIClientTransportState();
  const client = useRTVIClient();

  useEffect(() => {
    if (transportState === 'connected' && client) {
      const tracks = [];
      if (client.tracks().local.audio) {
        tracks.push(client.tracks().local.audio);
      }
      if (client.tracks().bot?.audio) {
        tracks.push(client.tracks().bot?.audio);
        

      }
      if (tracks.length > 0) {
        const stream = new MediaStream(tracks as MediaStreamTrack[]);
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = event => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.start();
      }
    }

    if (transportState === 'disconnected' && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
      };
    }
  }, [transportState, client]);

  if (!recordingUrl) return null;

  return (
    <div className="recording-panel">
      <h3>Call Recording</h3>
      <audio controls src={recordingUrl}></audio>
    </div>
  );
}
