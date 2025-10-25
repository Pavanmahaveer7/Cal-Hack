import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVolume2, FiVolumeX, FiCheck, FiX, FiRotateCcw, FiPlay } from 'react-icons/fi';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import './Learn.css';

function Learn() {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [studyMode, setStudyMode] = useState('flashcards');
  const [progress, setProgress] = useState(0);

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
        speakText(cards[currentCard]?.word || '');
        break;
      default:
        console.log('Command not recognized:', command);
    }
  }, [navigate, currentCard]);

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: handleVoiceCommand
  });

  // Sample vocabulary data
  const [cards] = useState([
    {
      id: 1,
      word: 'Hello',
      translation: 'Hola',
      language: 'Spanish',
      pronunciation: '/ˈo.la/',
      example: 'Hola, ¿cómo estás?',
      exampleTranslation: 'Hello, how are you?',
      difficulty: 'beginner'
    },
    {
      id: 2,
      word: 'Thank you',
      translation: 'Gracias',
      language: 'Spanish',
      pronunciation: '/ˈɡɾa.θjas/',
      example: 'Muchas gracias por tu ayuda.',
      exampleTranslation: 'Thank you very much for your help.',
      difficulty: 'beginner'
    },
    {
      id: 3,
      word: 'Good morning',
      translation: 'Buenos días',
      language: 'Spanish',
      pronunciation: '/ˈbwe.nos ˈdi.as/',
      example: 'Buenos días, ¿cómo está usted?',
      exampleTranslation: 'Good morning, how are you?',
      difficulty: 'beginner'
    }
  ]);

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
      setProgress(((currentCard + 1) / cards.length) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
      setProgress((currentCard / cards.length) * 100);
    }
  };

  const speakText = (text) => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
    }
  };

  const handleCorrect = () => {
    // Mark as correct and move to next
    handleNext();
  };

  const handleIncorrect = () => {
    // Mark as incorrect and show answer
    setShowAnswer(true);
  };

  const currentCardData = cards[currentCard];

  return (
    <div className="learn-container">
      <div className="learn-header">
        <h1 className="learn-title">Learning Mode</h1>
        <div className="learn-controls">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="audio-toggle"
            aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
          >
            {audioEnabled ? <FiVolume2 /> : <FiVolumeX />}
          </button>
          
          {/* Voice Interface */}
          <div className="voice-interface" role="region" aria-label="Voice Commands">
            <button
              onClick={startListening}
              disabled={!isSupported}
              className="voice-button"
              aria-label="Start voice recognition"
            >
              <FiVolume2 className="voice-icon" />
              {isSupported ? 'Voice' : 'No Voice'}
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

      <div className="learn-content">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
              aria-label={`Progress: ${Math.round(progress)}%`}
            ></div>
          </div>
          <span className="progress-text">
            Card {currentCard + 1} of {cards.length}
          </span>
        </div>

        {/* Study Mode Selector */}
        <div className="mode-selector">
          <button
            className={`mode-button ${studyMode === 'flashcards' ? 'active' : ''}`}
            onClick={() => setStudyMode('flashcards')}
          >
            Flashcards
          </button>
          <button
            className={`mode-button ${studyMode === 'multiple-choice' ? 'active' : ''}`}
            onClick={() => setStudyMode('multiple-choice')}
          >
            Multiple Choice
          </button>
        </div>

        {/* Card Content */}
        <div className="card-container">
          <div className="flashcard">
            <div className="card-header">
              <span className="card-language">{currentCardData.language}</span>
              <span className="card-difficulty">{currentCardData.difficulty}</span>
            </div>
            
            <div className="card-content">
              <h2 className="card-word">{currentCardData.word}</h2>
              {audioEnabled && (
                <button
                  onClick={() => speakText(currentCardData.word)}
                  className="speak-button"
                  aria-label="Pronounce word"
                >
                  <FiPlay />
                </button>
              )}
            </div>

            {showAnswer && (
              <div className="card-answer">
                <h3 className="answer-translation">{currentCardData.translation}</h3>
                <p className="answer-pronunciation">{currentCardData.pronunciation}</p>
                <div className="answer-example">
                  <p className="example-text">{currentCardData.example}</p>
                  <p className="example-translation">{currentCardData.exampleTranslation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Controls */}
        <div className="card-controls">
          <button
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className="control-button"
          >
            <FiRotateCcw />
            Previous
          </button>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="control-button primary"
            >
              Show Answer
            </button>
          ) : (
            <div className="answer-controls">
              <button
                onClick={handleIncorrect}
                className="control-button incorrect"
              >
                <FiX />
                Incorrect
              </button>
              <button
                onClick={handleCorrect}
                className="control-button correct"
              >
                <FiCheck />
                Correct
              </button>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={currentCard === cards.length - 1}
            className="control-button"
          >
            Next
          </button>
        </div>

        {/* Study Instructions */}
        <div className="study-instructions">
          <p className="instructions-text">
            Use voice commands: "Show Answer", "Next Card", "Previous Card", "Repeat", or "Go Back"
          </p>
        </div>
      </div>
    </div>
  );
}

export default Learn;