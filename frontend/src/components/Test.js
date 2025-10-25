import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiRotateCcw, FiVolume2, FiVolumeX, FiAward, FiClock } from 'react-icons/fi';
import './Test.css';

function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [testMode, setTestMode] = useState('timed'); // timed, practice, speed

  // Sample test questions - replace with API call
  const [questions] = useState([
    {
      id: 1,
      question: 'What does "Hola" mean in English?',
      options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
      correct: 'Hello',
      explanation: 'Hola is the Spanish word for Hello.',
      difficulty: 'beginner'
    },
    {
      id: 2,
      question: 'What does "Gracias" mean in English?',
      options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
      correct: 'Thank you',
      explanation: 'Gracias is the Spanish word for Thank you.',
      difficulty: 'beginner'
    },
    {
      id: 3,
      question: 'What does "Buenos días" mean in English?',
      options: ['Good evening', 'Good morning', 'Good night', 'Good afternoon'],
      correct: 'Good morning',
      explanation: 'Buenos días is the Spanish phrase for Good morning.',
      difficulty: 'beginner'
    },
    {
      id: 4,
      question: 'What does "Adiós" mean in English?',
      options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
      correct: 'Goodbye',
      explanation: 'Adiós is the Spanish word for Goodbye.',
      difficulty: 'beginner'
    },
    {
      id: 5,
      question: 'What does "Por favor" mean in English?',
      options: ['Thank you', 'Please', 'You\'re welcome', 'Excuse me'],
      correct: 'Please',
      explanation: 'Por favor is the Spanish phrase for Please.',
      difficulty: 'beginner'
    }
  ]);

  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    // Shuffle questions for each test
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  useEffect(() => {
    let timer;
    if (testStarted && !testCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && testStarted) {
      handleTestComplete();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, testCompleted]);

  const speakText = (text, language = 'en') => {
    if (!audioEnabled) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setTestCompleted(false);
    setSelectedAnswer('');
    setShowResult(false);
    speakText('Test started. Good luck!');
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    speakText(answer);
  };

  const submitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === shuffledQuestions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
      speakText('Correct!');
    } else {
      speakText('Incorrect. The correct answer is ' + shuffledQuestions[currentQuestion].correct);
    }

    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      handleTestComplete();
    }
  };

  const handleTestComplete = () => {
    setTestCompleted(true);
    setTestStarted(false);
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    speakText(`Test completed. You scored ${score} out of ${shuffledQuestions.length}. That's ${percentage} percent.`);
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer('');
    setShowResult(false);
    // Reshuffle questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  };

  const getScoreMessage = () => {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    if (percentage >= 90) return { message: 'Excellent!', color: 'success' };
    if (percentage >= 70) return { message: 'Good job!', color: 'warning' };
    if (percentage >= 50) return { message: 'Not bad!', color: 'warning' };
    return { message: 'Keep practicing!', color: 'error' };
  };

  const currentQ = shuffledQuestions[currentQuestion];

  if (!testStarted && !testCompleted) {
    return (
      <div className="test">
        <div className="container">
          <div className="test-header">
            <h1 className="test-title">Test Yourself</h1>
            <p className="test-subtitle">
              Challenge your knowledge with interactive quizzes
            </p>
          </div>

          <div className="test-setup">
            <div className="setup-card">
              <h2>Test Configuration</h2>
              
              <div className="setup-options">
                <div className="option-group">
                  <label className="option-label">Test Mode</label>
                  <select
                    className="option-select"
                    value={testMode}
                    onChange={(e) => setTestMode(e.target.value)}
                    aria-label="Select test mode"
                  >
                    <option value="timed">Timed Test (30 seconds per question)</option>
                    <option value="practice">Practice Mode (No time limit)</option>
                    <option value="speed">Speed Test (10 seconds per question)</option>
                  </select>
                </div>

                <div className="option-group">
                  <label className="option-label">Audio Settings</label>
                  <div className="audio-toggle">
                    <button
                      className={`toggle-button ${audioEnabled ? 'active' : ''}`}
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
                    >
                      {audioEnabled ? <FiVolume2 /> : <FiVolumeX />}
                    </button>
                    <span className="toggle-label">
                      {audioEnabled ? 'Audio enabled' : 'Audio disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="test-info">
                <div className="info-item">
                  <FiClock className="info-icon" />
                  <span>Questions: {shuffledQuestions.length}</span>
                </div>
                <div className="info-item">
                  <FiAward className="info-icon" />
                  <span>Time: {testMode === 'speed' ? '10s' : testMode === 'timed' ? '30s' : '∞'} per question</span>
                </div>
              </div>

              <button
                className="start-button"
                onClick={startTest}
                aria-label="Start test"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    const scoreData = getScoreMessage();
    
    return (
      <div className="test">
        <div className="container">
          <div className="test-results">
            <div className="results-card">
              <div className="results-header">
                <h2>Test Completed!</h2>
                <div className={`score-badge ${scoreData.color}`}>
                  {Math.round((score / shuffledQuestions.length) * 100)}%
                </div>
              </div>

              <div className="results-content">
                <div className="score-details">
                  <div className="score-item">
                    <span className="score-label">Correct Answers</span>
                    <span className="score-value">{score} / {shuffledQuestions.length}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Accuracy</span>
                    <span className="score-value">{Math.round((score / shuffledQuestions.length) * 100)}%</span>
                  </div>
                </div>

                <div className={`score-message ${scoreData.color}`}>
                  {scoreData.message}
                </div>

                <div className="results-actions">
                  <button
                    className="action-button primary"
                    onClick={resetTest}
                  >
                    <FiRotateCcw />
                    Try Again
                  </button>
                  <button
                    className="action-button secondary"
                    onClick={() => window.location.href = '/learn'}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="test">
      <div className="container">
        <div className="test-header">
          <div className="test-progress">
            <div className="progress-info">
              <span>Question {currentQuestion + 1} of {shuffledQuestions.length}</span>
              <span className="score-display">Score: {score}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {testMode !== 'practice' && (
            <div className="timer">
              <FiClock className="timer-icon" />
              <span className="timer-text">{timeLeft}s</span>
            </div>
          )}
        </div>

        <div className="question-card">
          <div className="question-header">
            <span className="difficulty-badge">{currentQ?.difficulty}</span>
            <span className="question-number">Question {currentQuestion + 1}</span>
          </div>

          <div className="question-content">
            <h2 className="question-text">{currentQ?.question}</h2>

            <div className="options-container">
              {currentQ?.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedAnswer === option ? 'selected' : ''} ${
                    showResult ? (option === currentQ?.correct ? 'correct' : selectedAnswer === option ? 'incorrect' : '') : ''
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>

            {!showResult ? (
              <button
                className="submit-button"
                onClick={submitAnswer}
                disabled={!selectedAnswer}
              >
                Submit Answer
              </button>
            ) : (
              <div className="answer-feedback">
                <div className="feedback-content">
                  <div className={`feedback-icon ${selectedAnswer === currentQ?.correct ? 'correct' : 'incorrect'}`}>
                    {selectedAnswer === currentQ?.correct ? <FiCheck /> : <FiX />}
                  </div>
                  <div className="feedback-text">
                    <p className="feedback-result">
                      {selectedAnswer === currentQ?.correct ? 'Correct!' : 'Incorrect!'}
                    </p>
                    <p className="feedback-explanation">{currentQ?.explanation}</p>
                  </div>
                </div>
                <button
                  className="next-button"
                  onClick={nextQuestion}
                >
                  {currentQuestion < shuffledQuestions.length - 1 ? 'Next Question' : 'Finish Test'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;
