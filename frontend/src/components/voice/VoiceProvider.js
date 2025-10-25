import React, { createContext, useContext, useState, useCallback } from 'react';

const VoiceContext = createContext(undefined);

export const VoiceProvider = ({ children }) => {
  const [voiceState, setVoiceState] = useState({
    isListening: false,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    transcript: '',
    error: null
  });

  const [commandHandler, setCommandHandler] = useState(null);
  const [recognition, setRecognition] = useState(null);

  const startListening = useCallback(() => {
    if (!voiceState.isSupported) {
      setVoiceState(prev => ({ ...prev, error: 'Speech recognition is not supported' }));
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setVoiceState(prev => ({ ...prev, isListening: true, error: null }));
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setVoiceState(prev => ({ ...prev, transcript: currentTranscript }));

        if (finalTranscript && commandHandler) {
          commandHandler(finalTranscript.trim().toLowerCase());
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceState(prev => ({ 
          ...prev, 
          error: `Speech recognition error: ${event.error}`,
          isListening: false 
        }));
      };

      recognitionInstance.onend = () => {
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };

      recognitionInstance.start();
      setRecognition(recognitionInstance);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setVoiceState(prev => ({ 
        ...prev, 
        error: 'Failed to start speech recognition' 
      }));
    }
  }, [voiceState.isSupported, commandHandler]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setVoiceState(prev => ({ ...prev, isListening: false }));
  }, [recognition]);

  const speak = useCallback((text, options = {}) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }, []);

  const registerCommandHandler = useCallback((handler) => {
    setCommandHandler(() => handler);
  }, []);

  const unregisterCommandHandler = useCallback(() => {
    setCommandHandler(null);
  }, []);

  const voiceCommands: VoiceCommands = {
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };

  const value = {
    voiceState,
    voiceCommands,
    registerCommandHandler,
    unregisterCommandHandler
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
