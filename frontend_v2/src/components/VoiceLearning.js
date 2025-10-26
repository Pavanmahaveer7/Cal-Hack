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
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [voiceRecognition, setVoiceRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [learningProgress, setLearningProgress] = useState({
    currentIndex: 0,
    totalCards: 0,
    correctAnswers: 0,
    incorrectAnswers: 0
  });
  const [isAutoStarting, setIsAutoStarting] = useState(false);
  const [isStartingVoice, setIsStartingVoice] = useState(false);

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

  // Fetch available flashcards on component mount and auto-start voice
  useEffect(() => {
    fetchAvailableFlashcards();
  }, []);

  // Check speech synthesis support
  useEffect(() => {
    if ('speechSynthesis' in window) {
      console.log('✅ Speech synthesis supported');
      console.log('🔊 Available voices:', speechSynthesis.getVoices().length);
    } else {
      console.warn('❌ Speech synthesis not supported');
    }
  }, []);

  // Force start voice recognition when session is active (but only once)
  useEffect(() => {
    if (session && isVoiceActive && !isListening && !voiceRecognition && !isAutoStarting) {
      console.log('🎤 Session active but not listening, starting voice recognition...');
      startVoiceRecognition();
    }
  }, [session, isVoiceActive, isListening, voiceRecognition, isAutoStarting]);

  // Auto-start voice learning when flashcards are available
  useEffect(() => {
    if (availableFlashcards.length > 0 && !session && !isVoiceActive && !isAutoStarting) {
      console.log('🚀 Auto-start conditions met:', {
        flashcards: availableFlashcards.length,
        session: !!session,
        isVoiceActive,
        isAutoStarting
      });
      
      const autoStart = async () => {
        setIsAutoStarting(true);
        console.log('🚀 Auto-starting voice learning session...');
        try {
          await startVoiceLearning('learning');
          // Auto-start voice interaction after session is created
          setTimeout(() => {
            console.log('🎤 Auto-starting voice interaction...');
            startVoiceInteraction();
          }, 2000);
        } catch (error) {
          console.error('Auto-start failed:', error);
          setIsAutoStarting(false);
        }
      };
      
      // Auto-start after a short delay to allow component to mount
      const timer = setTimeout(autoStart, 2000);
      return () => clearTimeout(timer);
    }
  }, [availableFlashcards.length, session, isVoiceActive, isAutoStarting]);

  // Cleanup voice recognition on unmount
  useEffect(() => {
    return () => {
      if (voiceRecognition) {
        voiceRecognition.stop();
      }
      speechSynthesis.cancel();
    };
  }, [voiceRecognition]);

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
      console.log(`🎤 Starting voice learning session for mode: ${mode}`);
      
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🎤 Voice session response:', result);

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

  const speakText = (text, callback) => {
    console.log('🔊 Speaking text:', text);
    
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      // Wait a moment for cancel to complete
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';
        
        utterance.onstart = () => {
          console.log('🔊 Speech started:', text);
        };
        
        utterance.onend = () => {
          console.log('🔊 Speech ended');
          if (callback) callback();
        };
        
        utterance.onerror = (event) => {
          console.error('❌ Speech synthesis error:', event.error);
          console.error('❌ Error details:', event);
          if (callback) callback();
        };
        
        console.log('🔊 Starting speech synthesis...');
        speechSynthesis.speak(utterance);
      }, 100);
    } else {
      console.warn('❌ Speech synthesis not supported in this browser');
      if (callback) callback();
    }
  };

  const startVoiceRecognition = async () => {
    console.log('🎤 Starting voice recognition...');
    
    // Prevent multiple starts
    if (voiceRecognition || isStartingVoice) {
      console.log('🎤 Voice recognition already active or starting, skipping start');
      return;
    }

    setIsStartingVoice(true);

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error('❌ Speech recognition not supported');
      speakText('Speech recognition is not supported in this browser. Please use a modern browser like Chrome or Edge.');
      return;
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎤 Microphone permission granted');
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      speakText('Microphone access is required for voice learning. Please allow microphone access and try again.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setIsStartingVoice(false);
      console.log('🎤 Voice recognition started - ALWAYS LISTENING');
    };

    recognition.onresult = (event) => {
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

      if (finalTranscript) {
        console.log('🎤 User said:', finalTranscript);
        // Send to VAPI for processing
        sendToVAPI(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
      setIsListening(false);
      
      // Handle different error types
      switch (event.error) {
        case 'no-speech':
          console.log('🔄 No speech detected, continuing to listen...');
          // Don't restart if already running
          break;
        case 'audio-capture':
          speakText('Microphone not found. Please check your microphone and try again.');
          break;
        case 'not-allowed':
          speakText('Microphone access denied. Please allow microphone access and refresh the page.');
          break;
        case 'network':
          speakText('Network error. Please check your internet connection.');
          break;
        default:
          console.log('🔄 Speech recognition error, will restart on end...');
          // Let onend handle the restart
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('🎤 Voice recognition ended');
      
      // Clear the current recognition instance
      setVoiceRecognition(null);
      
      // Only auto-restart if voice is still active and not already restarting
      if (isVoiceActive && !isAutoStarting) {
        console.log('🔄 Auto-restarting voice recognition...');
        setTimeout(() => {
          if (isVoiceActive && !voiceRecognition) {
            startVoiceRecognition();
          }
        }, 2000); // Longer delay to prevent rapid restarts
      }
    };

    // Set the recognition object BEFORE starting
    setVoiceRecognition(recognition);
    console.log('🎤 Voice recognition object set, starting...');
    
    try {
      recognition.start();
      console.log('🎤 Voice recognition start() called');
    } catch (error) {
      console.error('❌ Error starting voice recognition:', error);
      setVoiceRecognition(null);
    }
  };

  const sendToVAPI = async (userInput) => {
    try {
      console.log('🤖 Sending to VAPI:', userInput);
      
      // Send user input to VAPI for processing
      const response = await fetch('http://localhost:3001/api/voice-learning/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          userInput: userInput,
          sessionId: session?.callId,
          currentFlashcard: currentFlashcard,
          learningProgress: learningProgress
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🤖 VAPI response:', result);
      
      if (result.success && result.data.response) {
        console.log('🔊 VAPI response received, speaking:', result.data.response);
        // Speak the VAPI response
        speakText(result.data.response);
        
        // VAPI controls everything - let it decide what to do
        if (result.data.nextFlashcard) {
          setCurrentFlashcard(result.data.nextFlashcard);
        }
        
        if (result.data.progress) {
          setLearningProgress(result.data.progress);
        }
        
        // VAPI can control session state
        if (result.data.sessionAction) {
          handleSessionAction(result.data.sessionAction);
        }
        
        // VAPI can control navigation
        if (result.data.navigation) {
          handleNavigation(result.data.navigation);
        }
      } else {
        console.error('❌ VAPI processing failed:', result);
        // Fallback to local processing
        handleUserResponse(userInput);
      }
    } catch (error) {
      console.error('Error sending to VAPI:', error);
      // Fallback to local processing
      handleUserResponse(userInput);
    }
  };

  const stopVoiceRecognition = () => {
    if (voiceRecognition) {
      voiceRecognition.stop();
      setVoiceRecognition(null);
      setIsListening(false);
    }
  };

  // VAPI controls session actions
  const handleSessionAction = (action) => {
    console.log('🎤 VAPI session action:', action);
    switch (action.type) {
      case 'start_learning':
        startLearningSession();
        break;
      case 'next_question':
        nextFlashcard();
        break;
      case 'repeat_question':
        if (currentFlashcard) {
          speakText(`The question is: ${currentFlashcard.front}`);
        }
        break;
      case 'end_session':
        endVoiceSession();
        break;
      case 'show_hint':
        if (currentFlashcard) {
          speakText(`Hint: ${currentFlashcard.back}`);
        }
        break;
      case 'show_answer':
        if (currentFlashcard) {
          speakText(`The answer is: ${currentFlashcard.back}`);
        }
        break;
      default:
        console.log('Unknown session action:', action);
    }
  };

  // VAPI controls navigation
  const handleNavigation = (navigation) => {
    console.log('🎤 VAPI navigation:', navigation);
    switch (navigation.action) {
      case 'go_to_dashboard':
        navigate('/');
        break;
      case 'go_to_upload':
        navigate('/upload');
        break;
      case 'go_to_flashcards':
        navigate('/flashcards');
        break;
      case 'go_to_learn':
        navigate('/learn');
        break;
      case 'go_to_test':
        navigate('/test');
        break;
      default:
        console.log('Unknown navigation action:', navigation);
    }
  };

  const handleUserResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Handle navigation commands
    if (input.includes('go back') || input.includes('return home') || input.includes('exit')) {
      speakText('Returning to dashboard.');
      navigate('/');
      return;
    }
    
    if (input.includes('end session') || input.includes('stop learning')) {
      speakText('Ending voice learning session.');
      endVoiceSession();
      return;
    }
    
    if (input.includes('repeat') || input.includes('say again')) {
      if (currentFlashcard) {
        speakText(`The question is: ${currentFlashcard.front}`);
      } else {
        speakText('No flashcard is currently active.');
      }
      return;
    }
    
    if (input.includes('next') || input.includes('next question')) {
      nextFlashcard();
      return;
    }
    
    if (input.includes('help') || input.includes('what can i say')) {
      speakText('You can say: repeat, next question, go back, end session, or answer the current question.');
      return;
    }
    
    // Handle flashcard responses
    if (currentFlashcard) {
      evaluateAnswer(input, currentFlashcard);
    } else {
      // Start with first flashcard
      startFlashcardSession();
    }
  };

  const startFlashcardSession = () => {
    if (availableFlashcards.length > 0) {
      const firstCard = availableFlashcards[0];
      setCurrentFlashcard(firstCard);
      speakText(`Let's begin! Here's your first question: ${firstCard.front}. Please answer when you're ready.`);
    } else {
      speakText('No flashcards available. Please upload a PDF first.');
    }
  };

  const nextFlashcard = () => {
    if (!currentFlashcard) return;
    
    const currentIndex = availableFlashcards.findIndex(card => card.id === currentFlashcard.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= availableFlashcards.length) {
      // Session complete
      completeLearningSession();
      return;
    }
    
    const nextCard = availableFlashcards[nextIndex];
    setCurrentFlashcard(nextCard);
    
    // Update progress
    setLearningProgress(prev => ({
      ...prev,
      currentIndex: nextIndex
    }));
    
    speakText(`Question ${nextIndex + 1} of ${availableFlashcards.length}: ${nextCard.front}. Please answer when you're ready.`);
  };

  const completeLearningSession = () => {
    const { correctAnswers, incorrectAnswers, totalCards } = learningProgress;
    const accuracy = Math.round((correctAnswers / totalCards) * 100);
    
    speakText(`Congratulations! You've completed the learning session! You got ${correctAnswers} out of ${totalCards} questions correct. That's ${accuracy}% accuracy. Great job!`, () => {
      speakText('Would you like to start a new session or return to the dashboard?');
    });
    
    // Reset progress
    setLearningProgress({
      currentIndex: 0,
      totalCards: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    });
  };

  const evaluateAnswer = (userAnswer, flashcard) => {
    // More intelligent answer evaluation
    const correctAnswer = flashcard.back.toLowerCase();
    const userAnswerLower = userAnswer.toLowerCase();
    
    // Check for exact matches or close matches
    const isExactMatch = userAnswerLower.includes(correctAnswer) || correctAnswer.includes(userAnswerLower);
    
    // Check for key concept matches
    const keyConcepts = extractKeyConcepts(correctAnswer);
    const userConcepts = extractKeyConcepts(userAnswerLower);
    
    const conceptMatches = keyConcepts.filter(concept => 
      userConcepts.some(userConcept => 
        concept.includes(userConcept) || userConcept.includes(concept)
      )
    );
    
    const accuracy = conceptMatches.length / keyConcepts.length;
    
    // Update progress tracking
    const isCorrect = isExactMatch || accuracy > 0.6;
    setLearningProgress(prev => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: !isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers
    }));

    // Provide intelligent feedback
    if (isCorrect) {
      speakText(`Excellent! That's correct. ${flashcard.back}. You understand this concept well!`, () => {
        setTimeout(() => {
          speakText('Would you like to continue to the next question?', () => {
            // Auto-advance after a moment
            setTimeout(() => {
              nextFlashcard();
            }, 2000);
          });
        }, 1000);
      });
    } else if (accuracy > 0.3) {
      speakText(`Good attempt! You're on the right track. The complete answer is: ${flashcard.back}.`, () => {
        setTimeout(() => {
          speakText('Would you like to try the next question?', () => {
            setTimeout(() => {
              nextFlashcard();
            }, 2000);
          });
        }, 1000);
      });
    } else {
      speakText(`Not quite right, but that's okay! The correct answer is: ${flashcard.back}.`, () => {
        setTimeout(() => {
          speakText('Let me explain this concept. ' + flashcard.back + '. Would you like to try the next question?', () => {
            setTimeout(() => {
              nextFlashcard();
            }, 2000);
          });
        }, 1000);
      });
    }
  };

  const extractKeyConcepts = (text) => {
    // Extract important concepts from text
    const words = text.split(/\s+/).filter(word => 
      word.length > 3 && 
      !['that', 'this', 'with', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'where', 'much', 'some', 'very', 'when', 'here', 'just', 'into', 'like', 'over', 'also', 'think', 'know', 'take', 'than', 'its', 'them', 'these', 'so', 'may', 'say', 'use', 'her', 'many', 'and', 'the', 'are', 'for', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word.toLowerCase())
    );
    
    return words.slice(0, 5); // Return top 5 key concepts
  };

  const startVoiceInteraction = async () => {
    if (session) {
      setIsVoiceActive(true);
      setIsAutoStarting(false); // Reset auto-starting state
      
      console.log('🎤 Starting voice interaction...');
      console.log('🔊 Session first message:', session.firstMessage);
      
      // Start with the AI assistant greeting FIRST
      speakText(session.firstMessage, () => {
        console.log('🔊 Greeting spoken, starting voice recognition...');
        // Start voice recognition after greeting - VAPI will control everything
        startVoiceRecognition();
        // Don't start learning session - let VAPI decide when to start
      });
    } else {
      console.log('❌ No session available for voice interaction');
    }
  };

  const startLearningSession = () => {
    if (availableFlashcards.length > 0) {
      const firstCard = availableFlashcards[0];
      setCurrentFlashcard(firstCard);
      
      // Initialize progress tracking
      setLearningProgress({
        currentIndex: 0,
        totalCards: availableFlashcards.length,
        correctAnswers: 0,
        incorrectAnswers: 0
      });
      
      // Speak the first question and start listening
      speakText(`Let's begin your learning session! You have ${availableFlashcards.length} flashcards to study. Here's your first question: ${firstCard.front}. Please answer when you're ready.`, () => {
        startVoiceRecognition();
      });
    } else {
      speakText('No flashcards available. Please upload a PDF first to generate flashcards.');
    }
  };

  const stopVoiceInteraction = () => {
    setIsVoiceActive(false);
    stopVoiceRecognition();
    speakText('Voice interaction stopped.');
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
                  <p><strong>Voice Active:</strong> {isVoiceActive ? 'Yes' : 'No'}</p>
                  <p><strong>Listening:</strong> {isListening ? 'Yes' : 'No'}</p>
                  <p><strong>Auto-Starting:</strong> {isAutoStarting ? 'Yes' : 'No'}</p>
                </div>
            
            <div className="session-controls">
              <div className="auto-start-notice">
                <p><strong>🎤 Auto-Started:</strong> Voice learning is automatically active and always listening!</p>
                <p>Just speak naturally - the system will understand and respond through VAPI.</p>
                {isAutoStarting && <p><strong>⏳ Starting up...</strong> Please wait a moment for the system to initialize.</p>}
              </div>
              
              {!isVoiceActive ? (
                <button onClick={startVoiceInteraction} className="start-voice-button">
                  <FiVolume2 />
                  Start Voice Interaction
                </button>
              ) : (
                <div className="voice-controls">
                  <button onClick={stopVoiceInteraction} className="stop-voice-button">
                    <FiVolumeX />
                    Stop Voice Interaction
                  </button>
                  {!isListening && (
                    <button onClick={startVoiceRecognition} className="restart-voice-button">
                      <FiVolume2 />
                      Restart Listening
                    </button>
                  )}
                  <button onClick={() => sendToVAPI('test message')} className="test-vapi-button">
                    Test VAPI
                  </button>
                  <button onClick={() => {
                    console.log('🔊 Testing speech synthesis...');
                    speakText('Hello, this is a test of speech synthesis. Can you hear me?');
                  }} className="test-speech-button">
                    Test Speech
                  </button>
                  <button onClick={() => {
                    console.log('🤖 Testing VAPI with speech...');
                    sendToVAPI('hello');
                  }} className="test-vapi-speech-button">
                    Test VAPI + Speech
                  </button>
                  <button onClick={() => {
                    console.log('🔊 Testing VAPI greeting...');
                    if (session && session.firstMessage) {
                      speakText(session.firstMessage);
                    } else {
                      speakText('Hello! Welcome to Braillience voice learning. I am your AI tutor and I am ready to help you learn!');
                    }
                  }} className="test-greeting-button">
                    Test Greeting
                  </button>
                  <button onClick={startVoiceRecognition} className="start-listening-button">
                    Start Listening
                  </button>
                  <button onClick={() => {
                    console.log('🔄 Force starting voice recognition...');
                    setVoiceRecognition(null);
                    setIsListening(false);
                    setTimeout(() => startVoiceRecognition(), 500);
                  }} className="force-start-button">
                    Force Start
                  </button>
                  <button onClick={() => {
                    console.log('🎤 Manual start voice interaction...');
                    startVoiceInteraction();
                  }} className="manual-start-button">
                    Start Voice
                  </button>
                </div>
              )}
              <button onClick={endVoiceSession} className="end-call-button">
                <FiPhoneOff />
                End Call
              </button>
            </div>
            
                    {isVoiceActive && (
                      <div className="voice-status">
                        <div className="voice-indicator">
                          <span className={`listening-indicator ${isListening ? 'active' : 'inactive'}`}>
                            {isListening ? '🎤 Listening...' : '🔇 Not listening'}
                          </span>
                          <div className="voice-debug">
                            <p><strong>Debug Info:</strong></p>
                            <p>Session: {session ? 'Active' : 'None'}</p>
                            <p>Voice Active: {isVoiceActive ? 'Yes' : 'No'}</p>
                            <p>Listening: {isListening ? 'Yes' : 'No'}</p>
                            <p>Recognition: {voiceRecognition ? 'Active' : 'None'}</p>
                            <p>Auto-Starting: {isAutoStarting ? 'Yes' : 'No'}</p>
                            <p><strong>VAPI Control:</strong> VAPI manages conversation flow</p>
                            <p><strong>Current Card:</strong> {currentFlashcard ? currentFlashcard.front : 'None'}</p>
                          </div>
                        </div>
                <div className="voice-instructions">
                  <p><strong>VAPI Voice Commands:</strong></p>
                  <ul>
                    <li>VAPI controls the conversation flow</li>
                    <li>Say "start learning" to begin flashcards</li>
                    <li>Say "next question" to move to next card</li>
                    <li>Say "repeat" to hear question again</li>
                    <li>Say "hint" to get a hint</li>
                    <li>Say "show answer" to see the answer</li>
                    <li>Say "go back" to return to dashboard</li>
                    <li>Say "end session" to stop learning</li>
                  </ul>
                </div>
              </div>
            )}
            
            {currentFlashcard && (
              <div className="current-flashcard">
                <h4>Current Question:</h4>
                <p><strong>Q:</strong> {currentFlashcard.front}</p>
                <p><strong>Type:</strong> {currentFlashcard.type}</p>
                <p><strong>Difficulty:</strong> {currentFlashcard.difficulty}</p>
              </div>
            )}
            
            {learningProgress.totalCards > 0 && (
              <div className="learning-progress">
                <h4>Learning Progress:</h4>
                <div className="progress-stats">
                  <div className="progress-item">
                    <span className="progress-label">Question:</span>
                    <span className="progress-value">{learningProgress.currentIndex + 1} of {learningProgress.totalCards}</span>
                  </div>
                  <div className="progress-item">
                    <span className="progress-label">Correct:</span>
                    <span className="progress-value correct">{learningProgress.correctAnswers}</span>
                  </div>
                  <div className="progress-item">
                    <span className="progress-label">Incorrect:</span>
                    <span className="progress-value incorrect">{learningProgress.incorrectAnswers}</span>
                  </div>
                  <div className="progress-item">
                    <span className="progress-label">Accuracy:</span>
                    <span className="progress-value accuracy">
                      {learningProgress.totalCards > 0 ? 
                        Math.round((learningProgress.correctAnswers / learningProgress.totalCards) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}

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
