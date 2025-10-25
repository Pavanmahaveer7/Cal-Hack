/**
 * Keyboard Navigation Utilities
 * Provides utilities for keyboard-only navigation and accessibility
 */

class KeyboardNavigation {
  constructor() {
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.currentFocusIndex = 0;
    this.focusableElementsList = [];
    this.setupKeyboardHandlers();
  }

  /**
   * Setup keyboard event handlers
   */
  setupKeyboardHandlers() {
    document.addEventListener('keydown', (event) => {
      this.handleKeyboardNavigation(event);
    });

    // Update focusable elements when DOM changes
    this.updateFocusableElements();
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboardNavigation(event) {
    const { key, ctrlKey, altKey, shiftKey } = event;

    // Tab navigation
    if (key === 'Tab') {
      if (shiftKey) {
        this.focusPrevious();
      } else {
        this.focusNext();
      }
      event.preventDefault();
    }

    // Arrow key navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      this.handleArrowNavigation(key, event);
    }

    // Enter and Space activation
    if (key === 'Enter' || key === ' ') {
      this.activateFocusedElement(event);
    }

    // Escape key handling
    if (key === 'Escape') {
      this.handleEscapeKey(event);
    }
  }

  /**
   * Handle arrow key navigation
   * @param {string} direction - Arrow direction
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleArrowNavigation(direction, event) {
    const focusedElement = document.activeElement;
    const role = focusedElement.getAttribute('role');
    
    // Handle different widget types
    switch (role) {
      case 'menubar':
      case 'tablist':
        this.navigateHorizontal(direction, event);
        break;
      case 'menu':
      case 'listbox':
        this.navigateVertical(direction, event);
        break;
      case 'grid':
        this.navigateGrid(direction, event);
        break;
      default:
        // Default arrow key behavior
        break;
    }
  }

  /**
   * Navigate horizontally (left/right arrows)
   * @param {string} direction - Arrow direction
   * @param {KeyboardEvent} event - Keyboard event
   */
  navigateHorizontal(direction, event) {
    const currentIndex = this.getCurrentElementIndex();
    let nextIndex;

    if (direction === 'ArrowLeft') {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : this.focusableElementsList.length - 1;
    } else if (direction === 'ArrowRight') {
      nextIndex = currentIndex < this.focusableElementsList.length - 1 ? currentIndex + 1 : 0;
    }

    if (nextIndex !== undefined) {
      this.focusableElementsList[nextIndex].focus();
      event.preventDefault();
    }
  }

  /**
   * Navigate vertically (up/down arrows)
   * @param {string} direction - Arrow direction
   * @param {KeyboardEvent} event - Keyboard event
   */
  navigateVertical(direction, event) {
    const currentIndex = this.getCurrentElementIndex();
    let nextIndex;

    if (direction === 'ArrowUp') {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : this.focusableElementsList.length - 1;
    } else if (direction === 'ArrowDown') {
      nextIndex = currentIndex < this.focusableElementsList.length - 1 ? currentIndex + 1 : 0;
    }

    if (nextIndex !== undefined) {
      this.focusableElementsList[nextIndex].focus();
      event.preventDefault();
    }
  }

  /**
   * Navigate in grid layout
   * @param {string} direction - Arrow direction
   * @param {KeyboardEvent} event - Keyboard event
   */
  navigateGrid(direction, event) {
    // Implementation for grid navigation
    // This would depend on the specific grid layout
    console.log('Grid navigation:', direction);
  }

  /**
   * Focus next focusable element
   */
  focusNext() {
    this.updateFocusableElements();
    if (this.focusableElementsList.length === 0) return;

    this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElementsList.length;
    this.focusableElementsList[this.currentFocusIndex].focus();
  }

  /**
   * Focus previous focusable element
   */
  focusPrevious() {
    this.updateFocusableElements();
    if (this.focusableElementsList.length === 0) return;

    this.currentFocusIndex = this.currentFocusIndex === 0 
      ? this.focusableElementsList.length - 1 
      : this.currentFocusIndex - 1;
    this.focusableElementsList[this.currentFocusIndex].focus();
  }

  /**
   * Activate the currently focused element
   * @param {KeyboardEvent} event - Keyboard event
   */
  activateFocusedElement(event) {
    const focusedElement = document.activeElement;
    
    if (focusedElement && focusedElement.click) {
      focusedElement.click();
      event.preventDefault();
    }
  }

  /**
   * Handle escape key
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleEscapeKey(event) {
    // Close modals, dropdowns, etc.
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      if (modal.style.display !== 'none') {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /**
   * Update list of focusable elements
   */
  updateFocusableElements() {
    this.focusableElementsList = Array.from(
      document.querySelectorAll(this.focusableElements)
    ).filter(element => {
      return !element.disabled && 
             !element.hidden && 
             element.offsetParent !== null;
    });
  }

  /**
   * Get current element index in focusable list
   * @returns {number} Current index
   */
  getCurrentElementIndex() {
    const focusedElement = document.activeElement;
    return this.focusableElementsList.indexOf(focusedElement);
  }

  /**
   * Create keyboard trap for modal dialogs
   * @param {HTMLElement} container - Container element
   */
  createKeyboardTrap(container) {
    const focusableElements = container.querySelectorAll(this.focusableElements);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
        event.preventDefault();
      }
    });
  }

  /**
   * Test keyboard accessibility
   * @param {HTMLElement} element - Element to test
   */
  testKeyboardAccessibility(element) {
    const results = {
      isFocusable: element.tabIndex >= 0,
      hasKeyboardHandler: !!(element.onkeydown || element.onkeyup || element.onkeypress),
      hasRole: !!element.getAttribute('role'),
      hasAriaLabel: !!element.getAttribute('aria-label'),
      isVisible: element.offsetParent !== null,
      isEnabled: !element.disabled
    };

    return results;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KeyboardNavigation;
} else {
  window.KeyboardNavigation = KeyboardNavigation;
}
