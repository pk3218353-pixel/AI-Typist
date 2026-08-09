/**
 * Web Speech API hook — FREE, browser-native live transcription.
 *
 * No server round-trip for basic voice typing. Works well for Hindi + English in Chrome/Edge.
 */
import { useCallback, useRef, useState } from 'react';
import type { SpeechLang } from '../types';

interface UseWebSpeechOptions {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (message: string) => void;
}

/**
 * Manage continuous speech recognition with interim and final results.
 */
export function useWebSpeech({ onInterim, onFinal, onError }: UseWebSpeechOptions) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  const start = useCallback(
    (lang: SpeechLang) => {
      const SpeechRecognitionCtor =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionCtor) {
        setSupported(false);
        onError?.('Web Speech API is not supported in this browser. Use Chrome or Edge.');
        return;
      }

      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        if (interim) onInterim(interim);
        if (final) onFinal(final);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        onError?.(event.error);
        setListening(false);
      };

      recognition.onend = () => setListening(false);

      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    },
    [onInterim, onFinal, onError],
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  return { listening, supported, start, stop };
}
