import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVolume2, FiVolumeX, FiPhone, FiPhoneOff, FiPlay, FiPause, FiRotateCcw } from 'react-icons/fi';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import './VoiceLearning.css';

function VoiceLearning() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableFlashcards, setAvailableFlashcards] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleVoiceCommand = useCallback((command) => {
    switch (command.toLowerCase()) {
      case 'go back':
      case 'return home':
        navigate('/');
        break;
      case 'start learning':
        startVoiceLearning('learning');
        break;
      case 'start test':
        startVoiceLearning('test');
        break;
      case 'end call':
        endVoiceSession();
        break;
      default:
        console.log('Command not recognized:', command);
    }
  }, [navigate]);

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: handleVoiceCommand
  });

  // Fetch available flashcards on component mount
  useEffect(() => {
    fetchAvailableFlashcards();
  }, []);

  const fetchAvailableFlashcards = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/voice-learning/flashcards/demo-user');
      const result = await response.json();
      
      if (result.success) {
        setAvailableFlashcards(result.data.flashcards);
      }
    } catch (err) {
      console.error('Error fetching flashcards:', err);
    }
  };

  const startVoiceLearning = async (mode) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/voice-learning/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          mode: mode,
          documentId: selectedDocument
        })
      });

      const result = await response.json();

      if (result.success) {
        setSession(result.data);
        console.log(`🎤 Voice ${mode} session started:`, result.data);
      } else {
        setError(result.error || 'Failed to start voice session');
      }
    } catch (err) {
      console.error('Error starting voice session:', err);
      setError('Failed to start voice session');
    } finally {
      setLoading(false);
    }
  };

  const endVoiceSession = async () => {
    if (!session?.callId) return;

    try {
      const response = await fetch('http://localhost:3001/api/voice-learning/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callId: session.callId,
          sessionData: {
            endTime: new Date().toISOString(),
            duration: Date.now() - new Date(session.startTime).getTime()
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSession(null);
        console.log('🛑 Voice session ended');
      }
    } catch (err) {
      console.error('Error ending voice session:', err);
    }
  };

  const testVAPIConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/voice-learning/test');
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ VAPI connection test successful:', result.data);
        alert(`VAPI Test: ${result.data.instructions}`);
      } else {
        setError('VAPI connection test failed');
      }
    } catch (err) {
      console.error('Error testing VAPI connection:', err);
      setError('Failed to test VAPI connection');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (availableFlashcards.length === 0) {
    return (
      <div className="voice-learning-container">
        <div className="container">
          <div className="no-flashcards">
            <h2>No Flashcards Available</h2>
            <p>Upload a PDF first to generate flashcards for voice learning!</p>
            <button onClick={() => navigate('/upload')} className="upload-button">
              Upload PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-learning-container">
      <div className="container">
        <div className="voice-learning-header">
          <h1 className="voice-learning-title">Voice-Driven Learning</h1>
          <p className="voice-learning-subtitle">
            Study your flashcards through natural voice conversation with AI
          </p>

          {/* Voice Interface */}
          <div className="voice-interface" role="region" aria-label="Voice Commands">
            <p className="voice-instructions">
              Say "Start Learning", "Start Test", "End Call", or "Go Back" to navigate
            </p>
            <div className="voice-controls">
              <button
                onClick={startListening}
                disabled={!isSupported}
                className="voice-button"
                aria-label="Start voice recognition"
              >
                <FiVolume2 className="voice-icon" />
                {isSupported ? 'Start Listening' : 'Voice Not Supported'}
              </button>
              <button
                onClick={stopListening}
                className="voice-button stop"
                aria-label="Stop voice recognition"
              >
                Stop
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="dismiss-button">
              Dismiss
            </button>
          </div>
        )}

        {session ? (
          <div className="active-session">
            <div className="session-info">
              <h3>🎤 Active Voice Session</h3>
              <p><strong>Mode:</strong> {session.mode}</p>
              <p><strong>Flashcards:</strong> {session.flashcardsCount}</p>
              <p><strong>Status:</strong> {session.status}</p>
            </div>
            
            <div className="session-controls">
              <button onClick={endVoiceSession} className="end-call-button">
                <FiPhoneOff />
                End Call
              </button>
            </div>

            <div className="session-instructions">
              <h4>Voice Session Instructions:</h4>
              <p>{session.instructions}</p>
              <p><strong>First Message:</strong> "{session.firstMessage}"</p>
            </div>
          </div>
        ) : (
          <div className="learning-options">
            <div className="option-cards">
              <div className="option-card learning">
                <h3>🎓 Learning Mode</h3>
                <p>Interactive study session with hints and explanations</p>
                <button 
                  onClick={() => startVoiceLearning('learning')}
                  disabled={loading}
                  className="start-button learning"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <FiPlay />
                      Start Learning
                    </>
                  )}
                </button>
              </div>

              <div className="option-card testing">
                <h3>📝 Test Mode</h3>
                <p>Formal testing session with scoring</p>
                <button 
                  onClick={() => startVoiceLearning('test')}
                  disabled={loading}
                  className="start-button testing"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <FiPlay />
                      Start Test
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="session-info">
              <h4>Available Flashcards: {availableFlashcards.length}</h4>
              <p>Ready for voice-driven learning and testing</p>
            </div>

            <div className="test-connection">
              <button onClick={testVAPIConnection} className="test-button">
                Test VAPI Connection
              </button>
            </div>
          </div>
        )}

        <div className="features-info">
          <h3>Voice Learning Features:</h3>
          <ul>
            <li>🎤 <strong>Hands-free Learning:</strong> Complete voice interaction</li>
            <li>🤖 <strong>AI Assistant:</strong> Powered by Gemini for intelligent responses</li>
            <li>📚 <strong>Adaptive Learning:</strong> Adjusts to your pace and needs</li>
            <li>♿ <strong>Accessible:</strong> Designed specifically for blind users</li>
            <li>📊 <strong>Progress Tracking:</strong> Monitors your learning progress</li>
            <li>🎯 <strong>Two Modes:</strong> Learning (with hints) and Testing (formal assessment)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VoiceLearning;
