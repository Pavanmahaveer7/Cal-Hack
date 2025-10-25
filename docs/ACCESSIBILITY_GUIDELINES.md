# Accessibility Guidelines for Cal-Hack

## Overview
This document outlines the accessibility guidelines and standards for the Cal-Hack language learning platform. Our goal is to create an inclusive experience that works seamlessly with assistive technologies.

## WCAG 2.1 AA Compliance
We aim to meet or exceed WCAG 2.1 AA standards across all four principles:

### 1. Perceivable
- **Text Alternatives**: All non-text content has text alternatives
- **Captions**: Audio content includes captions
- **Adaptable**: Content can be presented in different ways without losing information
- **Distinguishable**: Users can see and hear content

### 2. Operable
- **Keyboard Accessible**: All functionality available from keyboard
- **No Seizures**: Content doesn't cause seizures
- **Navigable**: Users can navigate and find content

### 3. Understandable
- **Readable**: Text is readable and understandable
- **Predictable**: Web pages appear and operate in predictable ways
- **Input Assistance**: Users are helped to avoid and correct mistakes

### 4. Robust
- **Compatible**: Content is compatible with current and future assistive technologies

## Screen Reader Support

### Supported Screen Readers
- **NVDA** (Windows) - Primary testing platform
- **JAWS** (Windows) - Secondary testing platform
- **VoiceOver** (macOS/iOS) - Mobile and desktop testing
- **TalkBack** (Android) - Mobile testing
- **Orca** (Linux) - Linux testing

### Screen Reader Best Practices
1. **Semantic HTML**: Use proper HTML elements (h1, h2, nav, main, etc.)
2. **ARIA Labels**: Provide descriptive labels for interactive elements
3. **Live Regions**: Use aria-live for dynamic content updates
4. **Focus Management**: Ensure logical focus order
5. **Skip Links**: Provide skip navigation links

## Keyboard Navigation

### Keyboard Shortcuts
- **Tab**: Move to next focusable element
- **Shift + Tab**: Move to previous focusable element
- **Enter/Space**: Activate focused element
- **Arrow Keys**: Navigate within widgets (menus, lists, grids)
- **Escape**: Close modals and return focus

### Focus Management
- Visible focus indicators on all interactive elements
- Logical tab order throughout the application
- Focus trapping in modal dialogs
- Focus restoration when closing modals

## Audio Design

### Audio Feedback
- **Pronunciation**: Clear audio for word pronunciation
- **Progress**: Audio cues for lesson progress
- **Errors**: Distinctive audio for incorrect answers
- **Success**: Positive audio feedback for correct answers

### Audio Controls
- Play/pause controls for all audio content
- Volume controls
- Speed controls for speech
- Audio descriptions for visual content

## Visual Design

### Color and Contrast
- **Minimum Contrast Ratio**: 4.5:1 for normal text, 3:1 for large text
- **Color Independence**: Information not conveyed by color alone
- **High Contrast Mode**: Support for system high contrast themes

### Typography
- **Readable Fonts**: Clear, sans-serif fonts
- **Scalable Text**: Support for zoom up to 200%
- **Line Spacing**: Adequate line height for readability

## Mobile Accessibility

### Touch Targets
- **Minimum Size**: 44px x 44px touch targets
- **Spacing**: Adequate spacing between interactive elements
- **Gesture Support**: Alternative methods for complex gestures

### Mobile Screen Readers
- **VoiceOver** (iOS): Full compatibility
- **TalkBack** (Android): Full compatibility
- **Switch Control**: Support for switch navigation

## Testing Guidelines

### Automated Testing
- **axe-core**: Automated accessibility testing
- **Lighthouse**: Performance and accessibility audits
- **WAVE**: Web accessibility evaluation

### Manual Testing
- **Screen Reader Testing**: Test with actual screen readers
- **Keyboard Testing**: Complete keyboard-only navigation
- **Zoom Testing**: Test at 200% zoom
- **Color Testing**: Test with color vision simulators

### Testing Checklist
- [ ] All images have alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators are visible
- [ ] Screen reader announces content correctly
- [ ] Audio content has controls
- [ ] Forms have proper labels
- [ ] Headings follow logical hierarchy

## Development Guidelines

### HTML Structure
```html
<!-- Use semantic HTML -->
<main>
  <h1>Page Title</h1>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="#home">Home</a></li>
    </ul>
  </nav>
  <section aria-labelledby="section-title">
    <h2 id="section-title">Section Title</h2>
    <!-- Content -->
  </section>
</main>
```

### ARIA Usage
```html
<!-- Proper ARIA implementation -->
<button aria-label="Close dialog" aria-describedby="close-help">
  ×
</button>
<div id="close-help">Closes the current dialog</div>

<!-- Live regions for dynamic content -->
<div aria-live="polite" id="status-updates">
  <!-- Dynamic content appears here -->
</div>
```

### JavaScript Accessibility
```javascript
// Focus management
function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  modal.focus();
  
  // Trap focus within modal
  trapFocus(modal);
}

// Screen reader announcements
function announceToScreenReader(message) {
  const liveRegion = document.getElementById('announcements');
  liveRegion.textContent = message;
}
```

## Common Patterns

### Accessible Buttons
```html
<button 
  aria-label="Play audio pronunciation"
  aria-describedby="audio-help"
  onclick="playAudio()">
  🔊
</button>
<div id="audio-help">Plays the pronunciation of the current word</div>
```

### Accessible Forms
```html
<form>
  <label for="user-answer">Your answer:</label>
  <input 
    type="text" 
    id="user-answer" 
    aria-required="true"
    aria-describedby="answer-help"
    required>
  <div id="answer-help">Type your answer in Spanish</div>
</form>
```

### Accessible Navigation
```html
<nav aria-label="Lesson navigation">
  <ul>
    <li><a href="#lesson-1" aria-current="page">Lesson 1</a></li>
    <li><a href="#lesson-2">Lesson 2</a></li>
  </ul>
</nav>
```

## Resources

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

### Testing Resources
- [Screen Reader Testing Guide](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Testing Guide](https://webaim.org/techniques/keyboard/)
- [Mobile Accessibility Testing](https://webaim.org/articles/mobile/)

## Getting Help

If you need assistance with accessibility implementation:
1. Check the [Contributing Guidelines](CONTRIBUTING.md)
2. Review existing code for patterns
3. Ask questions in GitHub Issues
4. Test with actual screen readers
5. Consult the WCAG guidelines

Remember: **Accessibility is not a feature, it's a requirement.**
