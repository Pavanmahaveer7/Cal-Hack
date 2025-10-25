import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVolume2, FiVolumeX, FiCheck, FiX, FiRotateCcw, FiPlay, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import './Flashcards.css';

function Flashcards() {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  const handleVoiceCommand = useCallback((command) => {
    switch (command.toLowerCase()) {
      case 'go back':
      case 'return home':
        navigate('/');
        break;
      case 'next card':
      case 'next':
        handleNext();
        break;
      case 'previous card':
      case 'previous':
        handlePrevious();
        break;
      case 'show answer':
      case 'answer':
        setShowAnswer(true);
        break;
      case 'hide answer':
        setShowAnswer(false);
        break;
      case 'repeat':
        speakText(flashcards[currentCard]?.front || '');
        break;
      case 'correct':
        handleCorrect();
        break;
      case 'incorrect':
        handleIncorrect();
        break;
      default:
        console.log('Command not recognized:', command);
    }
  }, [navigate, currentCard, flashcards]);

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: handleVoiceCommand
  });

  // Fetch flashcards from the backend
  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/flashcards/demo-user');
      const result = await response.json();
      
      if (result.success) {
        setFlashcards(result.data);
        setStudyStats(prev => ({ ...prev, total: result.data.length }));
      } else {
        setError('Failed to load flashcards');
      }
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const handleCorrect = () => {
    setStudyStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    handleNext();
  };

  const handleIncorrect = () => {
    setStudyStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    handleNext();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window && audioEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (audioEnabled) {
      speechSynthesis.cancel();
    }
  };

  const resetStudy = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setStudyStats({ correct: 0, incorrect: 0, total: flashcards.length });
  };

  if (loading) {
    return (
      <div className="flashcards-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashcards-container">
        <div className="error-container">
          <h2>Error Loading Flashcards</h2>
          <p>{error}</p>
          <button onClick={fetchFlashcards} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flashcards-container">
        <div className="no-flashcards">
          <h2>No Flashcards Found</h2>
          <p>Upload a PDF to generate flashcards first!</p>
          <button onClick={() => navigate('/upload')} className="upload-button">
            Upload PDF
          </button>
        </div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentCard];
  const progress = ((currentCard + 1) / flashcards.length) * 100;

  return (
    <div className="flashcards-container">
      <div className="container">
        <div className="flashcards-header">
          <h1 className="flashcards-title">Study Flashcards</h1>
          <p className="flashcards-subtitle">
            {flashcards.length} flashcards from your uploaded documents
          </p>

          {/* Voice Interface */}
          <div className="voice-interface" role="region" aria-label="Voice Commands">
            <p className="voice-instructions">
              Say "Next", "Previous", "Show Answer", "Correct", "Incorrect", or "Go Back"
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

        <div className="study-stats">
          <div className="stat">
            <span className="stat-label">Progress:</span>
            <span className="stat-value">{currentCard + 1} / {flashcards.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Correct:</span>
            <span className="stat-value correct">{studyStats.correct}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Incorrect:</span>
            <span className="stat-value incorrect">{studyStats.incorrect}</span>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flashcard-container">
          <div className="flashcard">
            <div className="flashcard-header">
              <span className="card-type">{currentFlashcard.type}</span>
              <span className="card-difficulty">{currentFlashcard.difficulty}</span>
            </div>
            
            <div className="flashcard-content">
              <div className="card-front">
                <h3 className="card-question">{currentFlashcard.front}</h3>
                <button 
                  onClick={() => speakText(currentFlashcard.front)}
                  className="speak-button"
                  aria-label="Speak question"
                >
                  <FiVolume2 />
                </button>
              </div>

              {showAnswer && (
                <div className="card-back">
                  <h4 className="card-answer">{currentFlashcard.back}</h4>
                  <button 
                    onClick={() => speakText(currentFlashcard.back)}
                    className="speak-button"
                    aria-label="Speak answer"
                  >
                    <FiVolume2 />
                  </button>
                </div>
              )}
            </div>

            <div className="flashcard-actions">
              {!showAnswer ? (
                <button 
                  onClick={() => setShowAnswer(true)}
                  className="show-answer-button"
                >
                  Show Answer
                </button>
              ) : (
                <div className="answer-actions">
                  <button 
                    onClick={handleIncorrect}
                    className="action-button incorrect"
                  >
                    <FiX />
                    Incorrect
                  </button>
                  <button 
                    onClick={handleCorrect}
                    className="action-button correct"
                  >
                    <FiCheck />
                    Correct
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="navigation-controls">
          <button 
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className="nav-button"
          >
            <FiArrowLeft />
            Previous
          </button>
          
          <button 
            onClick={resetStudy}
            className="reset-button"
          >
            <FiRotateCcw />
            Reset Study
          </button>
          
          <button 
            onClick={handleNext}
            disabled={currentCard === flashcards.length - 1}
            className="nav-button"
          >
            Next
            <FiArrowRight />
          </button>
        </div>

        <div className="audio-controls">
          <button 
            onClick={toggleAudio}
            className={`audio-button ${audioEnabled ? 'enabled' : 'disabled'}`}
          >
            {audioEnabled ? <FiVolume2 /> : <FiVolumeX />}
            {audioEnabled ? 'Audio On' : 'Audio Off'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Flashcards;
