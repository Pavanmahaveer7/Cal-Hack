import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVolume2, FiCheck, FiX, FiRotateCcw, FiPlay } from 'react-icons/fi';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import './Test.css';

function Test() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [testCompleted, setTestCompleted] = useState(false);

  const handleVoiceCommand = useCallback((command) => {
    switch (command.toLowerCase()) {
      case 'go back':
      case 'return home':
        navigate('/');
        break;
      case 'next question':
      case 'next':
        handleNext();
        break;
      case 'previous question':
      case 'previous':
        handlePrevious();
        break;
      case 'select a':
      case 'option a':
        handleAnswer(0);
        break;
      case 'select b':
      case 'option b':
        handleAnswer(1);
        break;
      case 'select c':
      case 'option c':
        handleAnswer(2);
        break;
      case 'select d':
      case 'option d':
        handleAnswer(3);
        break;
      default:
        console.log('Command not recognized:', command);
    }
  }, [navigate, currentQuestion]);

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: handleVoiceCommand
  });

  // Sample test questions
  const [questions] = useState([
    {
      id: 1,
      question: 'What is the Spanish word for "Hello"?',
      options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
      correct: 0,
      explanation: 'Hola is the Spanish word for Hello.'
    },
    {
      id: 2,
      question: 'What does "Gracias" mean in English?',
      options: ['Please', 'Thank you', 'Goodbye', 'Hello'],
      correct: 1,
      explanation: 'Gracias means Thank you in English.'
    },
    {
      id: 3,
      question: 'How do you say "Good morning" in Spanish?',
      options: ['Buenas tardes', 'Buenos días', 'Buenas noches', 'Hola'],
      correct: 1,
      explanation: 'Buenos días means Good morning in Spanish.'
    }
  ]);

  useEffect(() => {
    if (timeLeft > 0 && !testCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setTestCompleted(true);
    }
  }, [timeLeft, testCompleted]);

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setTestCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (testCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="test-container">
        <div className="test-results">
          <h1 className="results-title">Test Completed!</h1>
          <div className="results-stats">
            <div className="stat-item">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}/{questions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Percentage</span>
              <span className="stat-value">{percentage}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time Left</span>
              <span className="stat-value">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="results-message">
            {percentage >= 80 ? (
              <p className="success-message">Excellent work! You've mastered this material.</p>
            ) : percentage >= 60 ? (
              <p className="good-message">Good job! Keep practicing to improve.</p>
            ) : (
              <p className="improve-message">Keep studying! Practice makes perfect.</p>
            )}
          </div>
          
          <div className="results-actions">
            <button
              onClick={() => navigate('/')}
              className="action-button primary"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="action-button secondary"
            >
              Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <div className="test-header">
        <h1 className="test-title">Test Mode</h1>
        <div className="test-info">
          <span className="time-remaining">Time: {formatTime(timeLeft)}</span>
          <span className="question-counter">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
      </div>

      <div className="test-content">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
              aria-label={`Progress: ${Math.round(progress)}%`}
            ></div>
          </div>
        </div>

        {/* Voice Interface */}
        <div className="voice-interface" role="region" aria-label="Voice Commands">
          <p className="voice-instructions">
            Say "Select A", "Select B", "Select C", "Select D", "Next Question", or "Previous Question"
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

        {/* Question */}
        <div className="question-container">
          <h2 className="question-text">{currentQuestionData.question}</h2>
          
          <div className="options-container">
            {currentQuestionData.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestionData.correct;
              const isWrong = isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`option-button ${isSelected ? 'selected' : ''} ${showResult && isCorrect ? 'correct' : ''} ${isWrong ? 'incorrect' : ''}`}
                >
                  <span className="option-label">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                  {showResult && isCorrect && <FiCheck className="option-icon" />}
                  {isWrong && <FiX className="option-icon" />}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="explanation">
              <p className="explanation-text">{currentQuestionData.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="test-navigation">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="nav-button"
          >
            <FiRotateCcw />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="nav-button primary"
            disabled={selectedAnswer === null}
          >
            {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Test;
