// Voice command processing service
class VoiceService {
  constructor() {
    this.commands = {
      // Navigation commands
      'upload pdf': { action: 'navigate', target: '/upload', response: 'Taking you to the PDF upload page.' },
      'start learning': { action: 'navigate', target: '/learn', response: 'Starting your learning session.' },
      'take test': { action: 'navigate', target: '/test', response: 'Beginning your test session.' },
      'view profile': { action: 'navigate', target: '/profile', response: 'Opening your profile page.' },
      'go home': { action: 'navigate', target: '/', response: 'Returning to the home page.' },
      
      // Learning commands
      'next card': { action: 'learning', command: 'next', response: 'Moving to the next card.' },
      'previous card': { action: 'learning', command: 'previous', response: 'Going back to the previous card.' },
      'repeat question': { action: 'learning', command: 'repeat', response: 'Repeating the question.' },
      'give me a hint': { action: 'learning', command: 'hint', response: 'Here\'s a hint to help you.' },
      'show answer': { action: 'learning', command: 'show_answer', response: 'Showing the correct answer.' },
      
      // Test commands
      'submit answer': { action: 'test', command: 'submit', response: 'Submitting your answer.' },
      'skip question': { action: 'test', command: 'skip', response: 'Skipping this question.' },
      'finish test': { action: 'test', command: 'finish', response: 'Finishing your test.' },
      
      // General commands
      'help': { action: 'help', response: 'I can help you navigate, learn, and take tests. Try saying "start learning" or "take test".' },
      'stop': { action: 'stop', response: 'Stopping current action.' },
      'yes': { action: 'confirm', response: 'Confirmed.' },
      'no': { action: 'cancel', response: 'Cancelled.' }
    }
  }

  async processVoiceCommand(command, userId, context = {}) {
    try {
      const normalizedCommand = command.toLowerCase().trim()
      
      // Find matching command
      const matchedCommand = this.findMatchingCommand(normalizedCommand)
      
      if (matchedCommand) {
        return {
          text: matchedCommand.response,
          action: matchedCommand.action,
          command: matchedCommand.command,
          nextStep: this.getNextStep(matchedCommand.action, context)
        }
      }
      
      // Handle partial matches or similar commands
      const suggestions = this.getCommandSuggestions(normalizedCommand)
      
      return {
        text: `I didn't quite understand that. ${suggestions}`,
        action: 'clarify',
        command: null,
        nextStep: 'wait_for_clarification'
      }
      
    } catch (error) {
      console.error('Error processing voice command:', error)
      return {
        text: 'Sorry, I had trouble understanding that. Could you try again?',
        action: 'error',
        command: null,
        nextStep: 'retry'
      }
    }
  }

  findMatchingCommand(command) {
    // Exact match
    if (this.commands[command]) {
      return this.commands[command]
    }
    
    // Partial match
    for (const [key, value] of Object.entries(this.commands)) {
      if (command.includes(key) || key.includes(command)) {
        return value
      }
    }
    
    return null
  }

  getCommandSuggestions(command) {
    const suggestions = []
    
    if (command.includes('upload') || command.includes('pdf')) {
      suggestions.push('Try saying "upload PDF"')
    } else if (command.includes('learn') || command.includes('study')) {
      suggestions.push('Try saying "start learning"')
    } else if (command.includes('test') || command.includes('quiz')) {
      suggestions.push('Try saying "take test"')
    } else if (command.includes('profile') || command.includes('progress')) {
      suggestions.push('Try saying "view profile"')
    } else {
      suggestions.push('Try saying "help" for available commands')
    }
    
    return suggestions.join('. ')
  }

  getNextStep(action, context) {
    switch (action) {
      case 'navigate':
        return 'navigate_to_page'
      case 'learning':
        return 'continue_learning'
      case 'test':
        return 'continue_test'
      case 'help':
        return 'show_help'
      case 'confirm':
        return 'execute_confirmed_action'
      case 'cancel':
        return 'cancel_current_action'
      default:
        return 'wait_for_next_command'
    }
  }

  // Handle timeout scenarios
  async handleTimeout(userId, context, timeoutDuration) {
    const timeoutMessages = [
      "Are you still there? I can repeat the question or move on.",
      "Would you like me to repeat that or do you need some extra help?",
      "I'm here when you're ready. Should I repeat the question or continue?",
      "Take your time. I can repeat the question or provide a hint if you'd like."
    ]

    const randomMessage = timeoutMessages[Math.floor(Math.random() * timeoutMessages.length)]

    return {
      message: randomMessage,
      options: [
        { id: 'repeat', text: 'Repeat the question', action: 'repeat' },
        { id: 'hint', text: 'Give me a hint', action: 'hint' },
        { id: 'continue', text: 'Continue to next', action: 'continue' },
        { id: 'help', text: 'I need help', action: 'help' }
      ],
      action: 'timeout_handling'
    }
  }
}

module.exports = {
  processVoiceCommand: (command, userId, context) => new VoiceService().processVoiceCommand(command, userId, context),
  handleTimeout: (userId, context, timeoutDuration) => new VoiceService().handleTimeout(userId, context, timeoutDuration)
}
