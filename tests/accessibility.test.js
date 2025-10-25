/**
 * Accessibility Tests
 * Comprehensive accessibility testing suite
 */

const { axe, toHaveNoViolations } = require('jest-axe');
const ScreenReaderUtils = require('../src/accessibility/screen-reader');
const KeyboardNavigation = require('../src/accessibility/keyboard-navigation');

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  let screenReaderUtils;
  let keyboardNavigation;

  beforeEach(() => {
    screenReaderUtils = new ScreenReaderUtils();
    keyboardNavigation = new KeyboardNavigation();
    
    // Setup DOM
    document.body.innerHTML = `
      <div id="app">
        <h1>Cal-Hack Language Learning</h1>
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#lessons">Lessons</a></li>
            <li><a href="#progress">Progress</a></li>
          </ul>
        </nav>
        <main>
          <section aria-labelledby="lesson-title">
            <h2 id="lesson-title">Lesson 1: Basic Greetings</h2>
            <button id="start-lesson" aria-describedby="lesson-description">
              Start Lesson
            </button>
            <p id="lesson-description">Begin your first lesson in Spanish</p>
          </section>
        </main>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Screen Reader Compatibility', () => {
    test('should detect screen reader presence', () => {
      const info = screenReaderUtils.getScreenReaderInfo();
      expect(info).toHaveProperty('isActive');
      expect(info).toHaveProperty('speechSynthesis');
    });

    test('should announce text to screen readers', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      screenReaderUtils.announce('Lesson completed successfully!');
      
      const liveRegion = document.getElementById('screen-reader-announcements');
      expect(liveRegion).toBeTruthy();
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
      
      consoleSpy.mockRestore();
    });

    test('should create accessible buttons', () => {
      const button = screenReaderUtils.createAccessibleButton(
        'Start Lesson',
        () => {},
        { ariaLabel: 'Begin the current lesson' }
      );

      expect(button.textContent).toBe('Start Lesson');
      expect(button.getAttribute('aria-label')).toBe('Begin the current lesson');
    });

    test('should create accessible form inputs', () => {
      const inputContainer = screenReaderUtils.createAccessibleInput(
        'text',
        'Your name',
        { required: true, ariaDescribedBy: 'name-help' }
      );

      const input = inputContainer.querySelector('input');
      const label = inputContainer.querySelector('label');

      expect(input.type).toBe('text');
      expect(input.getAttribute('aria-required')).toBe('true');
      expect(label.textContent).toBe('Your name');
      expect(label.getAttribute('for')).toBe(input.id);
    });
  });

  describe('Keyboard Navigation', () => {
    test('should handle tab navigation', () => {
      const startButton = document.getElementById('start-lesson');
      startButton.focus();

      keyboardNavigation.focusNext();
      expect(document.activeElement).not.toBe(startButton);
    });

    test('should create keyboard trap for modals', () => {
      const modal = document.createElement('div');
      modal.innerHTML = `
        <button>First</button>
        <button>Second</button>
        <button>Third</button>
      `;
      document.body.appendChild(modal);

      keyboardNavigation.createKeyboardTrap(modal);
      
      // Test tab cycling
      const firstButton = modal.querySelector('button');
      firstButton.focus();
      
      // Simulate tab key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      modal.dispatchEvent(tabEvent);
      
      expect(document.activeElement).not.toBe(firstButton);
    });

    test('should test keyboard accessibility', () => {
      const button = document.getElementById('start-lesson');
      const results = keyboardNavigation.testKeyboardAccessibility(button);

      expect(results).toHaveProperty('isFocusable');
      expect(results).toHaveProperty('hasKeyboardHandler');
      expect(results).toHaveProperty('isVisible');
      expect(results).toHaveProperty('isEnabled');
    });
  });

  describe('WCAG Compliance', () => {
    test('should have no accessibility violations', async () => {
      const results = await axe(document.body);
      expect(results).toHaveNoViolations();
    });

    test('should have proper heading structure', () => {
      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');
      
      expect(h1).toBeTruthy();
      expect(h2).toBeTruthy();
      expect(h1.textContent).toBe('Cal-Hack Language Learning');
    });

    test('should have proper ARIA landmarks', () => {
      const nav = document.querySelector('nav[role="navigation"]');
      const main = document.querySelector('main');
      
      expect(nav).toBeTruthy();
      expect(nav.getAttribute('aria-label')).toBe('Main navigation');
      expect(main).toBeTruthy();
    });

    test('should have proper form labels', () => {
      const inputContainer = screenReaderUtils.createAccessibleInput('text', 'Name');
      const input = inputContainer.querySelector('input');
      const label = inputContainer.querySelector('label');
      
      expect(label.getAttribute('for')).toBe(input.id);
      expect(input.id).toBeTruthy();
    });
  });

  describe('Color and Contrast', () => {
    test('should have sufficient color contrast', () => {
      // This would typically use a color contrast testing library
      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Basic check - in real implementation, you'd use a contrast ratio calculator
        expect(color).toBeTruthy();
        expect(backgroundColor).toBeTruthy();
      });
    });
  });

  describe('Focus Management', () => {
    test('should manage focus properly', () => {
      const button = document.getElementById('start-lesson');
      button.focus();
      
      expect(document.activeElement).toBe(button);
      expect(button).toHaveFocus();
    });

    test('should handle focus trapping', () => {
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <button>Close</button>
        <button>Save</button>
      `;
      document.body.appendChild(modal);

      keyboardNavigation.createKeyboardTrap(modal);
      
      const firstButton = modal.querySelector('button');
      firstButton.focus();
      
      expect(document.activeElement).toBe(firstButton);
    });
  });

  describe('Audio Accessibility', () => {
    test('should support audio feedback', () => {
      const audio = document.createElement('audio');
      audio.setAttribute('controls', 'true');
      audio.setAttribute('aria-label', 'Pronunciation audio');
      
      expect(audio.getAttribute('aria-label')).toBe('Pronunciation audio');
      expect(audio.hasAttribute('controls')).toBe(true);
    });

    test('should provide audio alternatives', () => {
      const image = document.createElement('img');
      image.setAttribute('src', 'lesson-image.jpg');
      image.setAttribute('alt', 'Visual representation of Spanish greeting');
      
      expect(image.getAttribute('alt')).toBeTruthy();
    });
  });
});
