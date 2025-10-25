# Contributing to Cal-Hack

Thank you for your interest in contributing to Cal-Hack, the accessible language learning platform for blind users! This guide will help you get started with contributing to our project.

## 🎯 Our Mission

We're building an inclusive language learning platform that works seamlessly with assistive technologies. Every contribution should prioritize accessibility and user experience for visually impaired users.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Git
- A code editor with accessibility features
- Screen reader (for testing accessibility)

### Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Cal-Hack.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes thoroughly
7. Submit a pull request

## 📋 Development Guidelines

### Accessibility First
- **Always test with screen readers** (NVDA, JAWS, VoiceOver)
- **Use semantic HTML** and proper ARIA attributes
- **Ensure keyboard navigation** works for all interactive elements
- **Provide alternative text** for all visual content
- **Test with high contrast modes** and zoom levels up to 200%

### Code Standards
- Follow the existing code style
- Write clear, descriptive commit messages
- Add comments for complex accessibility features
- Test your changes with actual screen readers
- Ensure all new features work without a mouse

### Testing Requirements
- Test with at least one screen reader
- Verify keyboard-only navigation
- Check color contrast ratios (minimum 4.5:1)
- Test with different zoom levels
- Validate HTML and ARIA attributes

## 🎨 UI/UX Guidelines

### Visual Design
- Use high contrast colors
- Provide multiple ways to access content
- Design for different screen sizes and zoom levels
- Avoid relying solely on color to convey information

### Audio Design
- Provide clear audio cues and feedback
- Use consistent audio patterns
- Ensure audio content is properly labeled
- Test with different audio output devices

### Interaction Design
- Make all interactive elements keyboard accessible
- Provide clear focus indicators
- Use logical tab order
- Ensure sufficient touch targets (minimum 44px)

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screen reader and browser information
- Any error messages

## 💡 Feature Requests

For new features, please consider:
- How it improves accessibility
- Impact on screen reader users
- Keyboard navigation requirements
- Audio feedback needs

## 🔄 Pull Request Process

1. **Create a descriptive title** that explains the change
2. **Provide a detailed description** of what was changed and why
3. **Include accessibility testing notes** (which screen readers were tested)
4. **Add screenshots or audio recordings** if applicable
5. **Ensure all tests pass** and accessibility requirements are met

### PR Template
```markdown
## Description
Brief description of changes

## Accessibility Testing
- [ ] Tested with NVDA
- [ ] Tested with JAWS
- [ ] Tested with VoiceOver
- [ ] Keyboard navigation verified
- [ ] Color contrast checked
- [ ] Screen reader announcements verified

## Testing Notes
Describe any specific testing performed

## Screenshots/Audio
If applicable, include recordings or descriptions
```

## 🏷️ Issue Labels

- `accessibility` - Accessibility-related issues
- `audio` - Audio features and feedback
- `ui/ux` - User interface and experience
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on accessibility and user needs
- Provide constructive feedback
- Help others learn about accessibility
- Test thoroughly before submitting

## 📞 Getting Help

- Join our discussions in GitHub Issues
- Ask questions in pull request comments
- Reach out to team members directly
- Check existing documentation first

## 🎉 Recognition

Contributors will be recognized in our README and release notes. We appreciate every contribution that helps make language learning more accessible!

---

**Remember**: Every line of code should consider how it affects users with visual impairments. When in doubt, test with a screen reader!
