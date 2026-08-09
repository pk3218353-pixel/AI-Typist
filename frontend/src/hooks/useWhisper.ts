/**
 * Optional Whisper transcription hook — placeholder for local/paid upgrade.
 *
 * When USE_WHISPER is enabled on the backend, this can POST audio chunks
 * to a future /api/speech/transcribe endpoint. Currently unused (Web Speech is primary).
 */
import { useCallback, useState } from 'react';

export function useWhisper() {
  const [processing, setProcessing] = useState(false);

  const transcribe = useCallback(async (_audioBlob: Blob, _language: string): Promise<string> => {
    setProcessing(true);
    try {
      // Future: POST to backend Whisper endpoint when USE_WHISPER=true
      throw new Error('Whisper backend not configured. Use Web Speech API or enable USE_WHISPER.');
    } finally {
      setProcessing(false);
    }
  }, []);

  return { processing, transcribe };
}
