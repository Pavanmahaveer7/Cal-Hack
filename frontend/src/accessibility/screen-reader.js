/**
 * Screen Reader Utilities
 * Provides utilities for screen reader compatibility and testing
 */

class ScreenReaderUtils {
  constructor() {
    this.announcements = [];
    this.isScreenReaderActive = false;
    this.setupScreenReaderDetection();
  }

  /**
   * Detect if a screen reader is active
   */
  setupScreenReaderDetection() {
    // Check for screen reader specific properties
    const hasScreenReader = 
      window.speechSynthesis ||
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.navigator.userAgent.includes('VoiceOver');

    this.isScreenReaderActive = hasScreenReader;
  }

  /**
   * Announce text to screen readers
   * @param {string} text - Text to announce
   * @param {string} priority - Priority level (polite, assertive, off)
   */
  announce(text, priority = 'polite') {
    const announcement = {
      text,
      priority,
      timestamp: Date.now()
    };

    this.announcements.push(announcement);

    // Create or update live region
    let liveRegion = document.getElementById('screen-reader-announcements');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'screen-reader-announcements';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = text;
    liveRegion.setAttribute('aria-live', priority);

    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }

  /**
   * Create accessible button with proper ARIA attributes
   * @param {string} text - Button text
   * @param {Function} onClick - Click handler
   * @param {Object} options - Additional options
   */
  createAccessibleButton(text, onClick, options = {}) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);

    // Set ARIA attributes
    if (options.ariaLabel) {
      button.setAttribute('aria-label', options.ariaLabel);
    }
    if (options.ariaDescribedBy) {
      button.setAttribute('aria-describedby', options.ariaDescribedBy);
    }
    if (options.role) {
      button.setAttribute('role', options.role);
    }

    return button;
  }

  /**
   * Create accessible form field
   * @param {string} type - Input type
   * @param {string} label - Field label
   * @param {Object} options - Additional options
   */
  createAccessibleInput(type, label, options = {}) {
    const container = document.createElement('div');
    container.className = 'form-field';

    const input = document.createElement('input');
    input.type = type;
    input.id = `input-${Date.now()}`;
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', input.id);

    // Set ARIA attributes
    if (options.required) {
      input.setAttribute('aria-required', 'true');
      input.required = true;
    }
    if (options.ariaDescribedBy) {
      input.setAttribute('aria-describedby', options.ariaDescribedBy);
    }

    container.appendChild(labelElement);
    container.appendChild(input);

    return container;
  }

  /**
   * Test screen reader compatibility
   * @param {HTMLElement} element - Element to test
   */
  testScreenReaderCompatibility(element) {
    const results = {
      hasRole: !!element.getAttribute('role'),
      hasAriaLabel: !!element.getAttribute('aria-label'),
      hasAriaLabelledBy: !!element.getAttribute('aria-labelledby'),
      hasAriaDescribedBy: !!element.getAttribute('aria-describedby'),
      isFocusable: element.tabIndex >= 0,
      hasKeyboardHandler: !!element.onkeydown || !!element.onkeyup || !!element.onkeypress
    };

    return results;
  }

  /**
   * Get screen reader information
   */
  getScreenReaderInfo() {
    return {
      isActive: this.isScreenReaderActive,
      announcements: this.announcements.length,
      userAgent: navigator.userAgent,
      speechSynthesis: !!window.speechSynthesis
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScreenReaderUtils;
} else {
  window.ScreenReaderUtils = ScreenReaderUtils;
}
