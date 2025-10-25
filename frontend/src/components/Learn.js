import React, { useState, useEffect } from 'react';
import { FiVolume2, FiVolumeX, FiCheck, FiX, FiRotateCcw, FiPlay } from 'react-icons/fi';
import './Learn.css';

function Learn() {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [studyMode, setStudyMode] = useState('flashcards'); // flashcards, multiple-choice, typing
  const [progress, setProgress] = useState(0);

  // Sample vocabulary data - replace with API call
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
      example: 'Buenos días, señor García.',
      exampleTranslation: 'Good morning, Mr. García.',
      difficulty: 'beginner'
    }
  ]);

  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);

  useEffect(() => {
    // Generate multiple choice options for current card
    if (studyMode === 'multiple-choice' && cards.length > 0) {
      const correctAnswer = cards[currentCard].translation;
      const wrongAnswers = cards
        .filter((_, index) => index !== currentCard)
        .map(card => card.translation)
        .slice(0, 3);
      
      const allOptions = [correctAnswer, ...wrongAnswers]
        .sort(() => Math.random() - 0.5);
      
      setMultipleChoiceOptions(allOptions);
    }
  }, [currentCard, studyMode, cards]);

  const speakText = (text, language = 'es') => {
    if (!audioEnabled) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

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

  const handleAnswer = (isCorrect) => {
    // Handle correct/incorrect answer
    if (isCorrect) {
      speakText('Correct!', 'en');
    } else {
      speakText('Try again', 'en');
    }
  };

  const handleMultipleChoice = (selectedAnswer) => {
    const isCorrect = selectedAnswer === cards[currentCard].translation;
    handleAnswer(isCorrect);
    setShowAnswer(true);
  };

  const resetProgress = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setProgress(0);
  };

  const currentCardData = cards[currentCard];

  return (
    <div className="learn">
      <div className="container">
        <div className="learn-header">
          <h1 className="learn-title">Learn New Words</h1>
          <div className="learn-controls">
            <button
              className={`control-button ${audioEnabled ? 'active' : ''}`}
              onClick={() => setAudioEnabled(!audioEnabled)}
              aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
            >
              {audioEnabled ? <FiVolume2 /> : <FiVolumeX />}
            </button>
            
            <select
              className="mode-selector"
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value)}
              aria-label="Select study mode"
            >
              <option value="flashcards">Flashcards</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="typing">Typing Practice</option>
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
              aria-label={`Progress: ${Math.round(progress)}%`}
            ></div>
          </div>
          <div className="progress-text">
            Card {currentCard + 1} of {cards.length}
          </div>
        </div>

        {/* Study Card */}
        <div className="study-card-container">
          <div className="study-card">
            <div className="card-header">
              <span className="card-language">{currentCardData?.language}</span>
              <span className="card-difficulty">{currentCardData?.difficulty}</span>
            </div>

            <div className="card-content">
              {studyMode === 'flashcards' && (
                <div className="flashcard-mode">
                  <div className="card-word">
                    <h2>{currentCardData?.word}</h2>
                    <button
                      className="pronunciation-button"
                      onClick={() => speakText(currentCardData?.word, 'en')}
                      aria-label="Pronounce word"
                    >
                      <FiPlay />
                    </button>
                  </div>
                  
                  {!showAnswer ? (
                    <button
                      className="reveal-button"
                      onClick={() => setShowAnswer(true)}
                    >
                      Show Translation
                    </button>
                  ) : (
                    <div className="card-answer">
                      <div className="translation">
                        <h3>{currentCardData?.translation}</h3>
                        <span className="pronunciation">{currentCardData?.pronunciation}</span>
                      </div>
                      
                      <div className="example">
                        <p className="example-text">{currentCardData?.example}</p>
                        <p className="example-translation">{currentCardData?.exampleTranslation}</p>
                      </div>
                      
                      <div className="card-actions">
                        <button
                          className="action-button correct"
                          onClick={() => handleAnswer(true)}
                        >
                          <FiCheck />
                          Got it!
                        </button>
                        <button
                          className="action-button incorrect"
                          onClick={() => handleAnswer(false)}
                        >
                          <FiX />
                          Need practice
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {studyMode === 'multiple-choice' && (
                <div className="multiple-choice-mode">
                  <h2 className="question">What does "{currentCardData?.word}" mean?</h2>
                  
                  <div className="options-grid">
                    {multipleChoiceOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${showAnswer && option === currentCardData?.translation ? 'correct' : ''}`}
                        onClick={() => handleMultipleChoice(option)}
                        disabled={showAnswer}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {showAnswer && (
                    <div className="answer-feedback">
                      <p className="feedback-text">
                        {multipleChoiceOptions.includes(currentCardData?.translation) 
                          ? 'Correct!' 
                          : `The correct answer is: ${currentCardData?.translation}`
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              {studyMode === 'typing' && (
                <div className="typing-mode">
                  <h2>Type the translation for "{currentCardData?.word}"</h2>
                  <input
                    type="text"
                    className="typing-input"
                    placeholder="Type your answer here..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const isCorrect = e.target.value.toLowerCase() === currentCardData?.translation.toLowerCase();
                        handleAnswer(isCorrect);
                        setShowAnswer(true);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="navigation">
          <button
            className="nav-button"
            onClick={handlePrevious}
            disabled={currentCard === 0}
            aria-label="Previous card"
          >
            Previous
          </button>
          
          <button
            className="nav-button reset"
            onClick={resetProgress}
            aria-label="Reset progress"
          >
            <FiRotateCcw />
            Reset
          </button>
          
          <button
            className="nav-button"
            onClick={handleNext}
            disabled={currentCard === cards.length - 1}
            aria-label="Next card"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Learn;
