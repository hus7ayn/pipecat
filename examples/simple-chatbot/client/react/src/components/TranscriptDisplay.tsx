import { useState, useCallback } from 'react';
import { RTVIEvent, TranscriptData, BotLLMTextData } from '@pipecat-ai/client-js';
import { useRTVIClientEvent } from '@pipecat-ai/client-react';

export function TranscriptDisplay() {
  const [lines, setLines] = useState<string[]>([]);

  const append = useCallback((prefix: string, text: string) => {
    setLines(prev => [...prev, `${prefix}: ${text}`]);
  }, []);

  useRTVIClientEvent(
    RTVIEvent.UserTranscript,
    useCallback((data: TranscriptData) => {
      if (data.final) {
        append('You', data.text);
      }
    }, [append])
  );

  useRTVIClientEvent(
    RTVIEvent.BotTranscript,
    useCallback((data: BotLLMTextData) => {
      append('Bot', data.text);
    }, [append])
  );

  return (
    <div className="transcript-panel">
      <h3>Live Transcript</h3>
      <div className="transcript-log">
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
}
