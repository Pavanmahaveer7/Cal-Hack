import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us">
      <div className="about-container">
        <h1 className="about-title">About Braillience</h1>
        <p className="about-subtitle">Making Learning Accessible for Everyone</p>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Braillience is dedicated to breaking down barriers in education by providing 
            accessible learning tools specifically designed for blind and visually impaired 
            college students. We believe that everyone deserves equal access to quality 
            education, regardless of their abilities.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Do</h2>
          <p>
            Our platform transforms traditional study methods into accessible, voice-driven 
            learning experiences:
          </p>
          <ul>
            <li><strong>Smart Flashcard Generation:</strong> Convert PDFs and text into accessible flashcards using AI</li>
            <li><strong>Voice Navigation:</strong> Complete hands-free operation through voice commands</li>
            <li><strong>Screen Reader Optimization:</strong> Designed specifically for screen reader compatibility</li>
            <li><strong>Adaptive Learning:</strong> Personalized study modes that adapt to your learning style</li>
            <li><strong>Multi-Modal Learning:</strong> Visual, auditory, and tactile learning support</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Braillience was born from a simple observation: traditional study tools like 
            Quizlet, while powerful, often fall short when it comes to accessibility. 
            As college students ourselves, we witnessed friends and classmates struggle 
            with inaccessible learning platforms.
          </p>
          <p>
            We decided to change that. Our team of developers, designers, and accessibility 
            experts came together to create a platform that doesn't just accommodate 
            different abilities—it celebrates them.
          </p>
        </section>

        <section className="about-section">
          <h2>Accessibility First</h2>
          <p>
            Every feature in Braillience is built with accessibility at its core:
          </p>
          <ul>
            <li>WCAG 2.1 AA compliance across all interfaces</li>
            <li>Full keyboard navigation support</li>
            <li>High contrast and customizable display options</li>
            <li>Voice command integration for hands-free operation</li>
            <li>Screen reader optimization with proper ARIA labels</li>
            <li>Multiple input methods (voice, keyboard, touch)</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Team</h2>
          <p>
            Braillience is developed by a diverse team that includes:
          </p>
          <ul>
            <li>Blind and visually impaired developers who understand the challenges firsthand</li>
            <li>Accessibility experts with years of experience in inclusive design</li>
            <li>AI and machine learning specialists focused on educational technology</li>
            <li>User experience designers committed to universal design principles</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Community Impact</h2>
          <p>
            Since our launch, Braillience has helped hundreds of students:
          </p>
          <ul>
            <li>Study more effectively with accessible tools</li>
            <li>Gain confidence in their academic pursuits</li>
            <li>Connect with a supportive learning community</li>
            <li>Achieve better academic outcomes</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Get Involved</h2>
          <p>
            We're always looking for ways to improve and expand our impact:
          </p>
          <ul>
            <li><strong>Feedback:</strong> Share your experiences and suggestions</li>
            <li><strong>Testing:</strong> Help us test new features and improvements</li>
            <li><strong>Advocacy:</strong> Spread the word about accessible learning tools</li>
            <li><strong>Development:</strong> Contribute to our open-source codebase</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Contact Us</h2>
          <p>
            We'd love to hear from you! Whether you have questions, feedback, or just 
            want to say hello:
          </p>
          <div className="contact-info">
            <p><strong>General Inquiries:</strong> hello@braillience.com</p>
            <p><strong>Technical Support:</strong> support@braillience.com</p>
            <p><strong>Accessibility Support:</strong> accessibility@braillience.com</p>
            <p><strong>Partnerships:</strong> partnerships@braillience.com</p>
          </div>
        </section>

        <div className="about-footer">
          <p>
            <strong>Braillience</strong> - Where accessibility meets education, 
            and learning knows no boundaries.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
