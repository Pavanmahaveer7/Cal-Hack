'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VoiceInterface } from '@/components/voice/VoiceInterface'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'
import { useVoice } from '@/components/voice/VoiceProvider'

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [testSession, setTestSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [totalQuestions] = useState(5)
  const router = useRouter()
  const { speak } = useVoice()

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: (command: string) => {
      handleVoiceCommand(command)
    }
  })

  const handleVoiceCommand = (command: string) => {
    switch (command.toLowerCase()) {
      case 'submit answer':
      case 'submit':
        handleSubmitAnswer()
        break
      case 'skip question':
      case 'skip':
        handleSkipQuestion()
        break
      case 'finish test':
      case 'finish':
        handleFinishTest()
        break
      case 'repeat question':
      case 'repeat':
        speak(currentQuestion?.question || 'No question available')
        break
      case 'go back':
      case 'return home':
        router.push('/')
        break
      default:
        console.log('Command not recognized:', command)
    }
  }

  useEffect(() => {
    initializeTest()
  }, [])

  const initializeTest = async () => {
    try {
      // Mock test session
      const mockTestSession = {
        id: 'test-session-1',
        userId: 'demo-user',
        startTime: new Date().toISOString(),
        totalQuestions: 5,
        currentQuestion: 1
      }

      const mockQuestion = {
        id: 'q1',
        question: 'What is the primary function of mitochondria?',
        type: 'multiple_choice',
        options: [
          'Protein synthesis',
          'Energy production',
          'DNA replication',
          'Waste removal'
        ],
        correctAnswer: 'Energy production',
        explanation: 'Mitochondria are known as the powerhouse of the cell and are responsible for producing ATP (energy).'
      }

      setTestSession(mockTestSession)
      setCurrentQuestion(mockQuestion)
      setIsLoading(false)

      // Speak the question
      setTimeout(() => {
        speak(mockQuestion.question)
        speak('Options: ' + mockQuestion.options.join(', '))
      }, 500)

    } catch (error) {
      console.error('Error initializing test:', error)
      setIsLoading(false)
    }
  }

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      speak('Please provide an answer before submitting.')
      return
    }

    const isCorrect = userAnswer.toLowerCase().includes('energy')
    const newScore = isCorrect ? score + 1 : score
    setScore(newScore)
    setShowResult(true)

    if (isCorrect) {
      speak('Correct! Well done.')
    } else {
      speak('Incorrect. The correct answer is: Energy production.')
    }

    // Move to next question after 3 seconds
    setTimeout(() => {
      if (questionNumber < totalQuestions) {
        handleNextQuestion()
      } else {
        handleFinishTest()
      }
    }, 3000)
  }

  const handleSkipQuestion = () => {
    speak('Question skipped.')
    if (questionNumber < totalQuestions) {
      handleNextQuestion()
    } else {
      handleFinishTest()
    }
  }

  const handleNextQuestion = () => {
    setQuestionNumber(prev => prev + 1)
    setUserAnswer('')
    setShowResult(false)

    // Mock next question
    const nextQuestion = {
      id: `q${questionNumber + 1}`,
      question: 'Which organelle is responsible for protein synthesis?',
      type: 'multiple_choice',
      options: [
        'Mitochondria',
        'Ribosomes',
        'Nucleus',
        'Golgi apparatus'
      ],
      correctAnswer: 'Ribosomes',
      explanation: 'Ribosomes are the cellular structures responsible for protein synthesis.'
    }

    setCurrentQuestion(nextQuestion)
    speak(nextQuestion.question)
    speak('Options: ' + nextQuestion.options.join(', '))
  }

  const handleFinishTest = () => {
    const percentage = Math.round((score / totalQuestions) * 100)
    const resultMessage = `Test completed! You scored ${score} out of ${totalQuestions} questions. That's ${percentage}% correct.`
    
    speak(resultMessage)
    
    // Show final results
    setShowResult(true)
    setCurrentQuestion({
      ...currentQuestion,
      question: 'Test Completed!',
      isFinished: true,
      finalScore: score,
      percentage: percentage
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-semibold">Preparing your test...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Test Session</h1>
            <div className="text-sm text-gray-600">
              Question {questionNumber} of {totalQuestions}
            </div>
          </div>

          <VoiceInterface
            isListening={false}
            onToggleListening={() => {}}
            isSupported={isSupported}
          />

          {currentQuestion && !currentQuestion.isFinished && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                ></div>
              </div>

              {/* Current Question */}
              <div className="card">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Question {questionNumber}
                  </h2>
                  
                  <p className="text-lg text-gray-800">
                    {currentQuestion.question}
                  </p>

                  {currentQuestion.options && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-700">Options:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {currentQuestion.options.map((option: string, index: number) => (
                          <li key={index} className="text-gray-700">
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!showResult && (
                    <div className="mt-6">
                      <label htmlFor="answer" className="form-label">
                        Your Answer:
                      </label>
                      <textarea
                        id="answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="form-input"
                        rows={3}
                        placeholder="Type your answer here..."
                      />
                    </div>
                  )}

                  {showResult && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Result:</h3>
                      <p className="text-blue-700">
                        {userAnswer.toLowerCase().includes('energy') ? 'Correct!' : 'Incorrect.'}
                      </p>
                      <p className="text-sm text-blue-600 mt-2">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSubmitAnswer}
                  className="btn-primary"
                  disabled={!userAnswer.trim() || showResult}
                >
                  Submit Answer
                </button>
                
                <button
                  onClick={handleSkipQuestion}
                  className="btn-secondary"
                  disabled={showResult}
                >
                  Skip Question
                </button>
                
                <button
                  onClick={handleFinishTest}
                  className="btn-secondary"
                >
                  Finish Test
                </button>
              </div>

              {/* Score Display */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">
                  Score: {score} / {totalQuestions}
                </p>
              </div>
            </div>
          )}

          {currentQuestion?.isFinished && (
            <div className="card text-center">
              <div className="space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900">Test Completed!</h2>
                <div className="text-4xl font-bold text-primary-600">
                  {currentQuestion.percentage}%
                </div>
                <p className="text-lg text-gray-600">
                  You scored {currentQuestion.finalScore} out of {totalQuestions} questions correctly.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => router.push('/learn')}
                    className="btn-primary"
                  >
                    Study More
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="btn-secondary"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Voice commands: "Submit answer", "Skip question", "Repeat question", "Finish test"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
