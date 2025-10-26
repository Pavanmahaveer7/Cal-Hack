import React from 'react';
import { FiUsers, FiTarget, FiAward, FiBarChart2, FiBookOpen, FiVolume2, FiTrendingUp, FiClock, FiHeart, FiMic, FiRefreshCw, FiGithub, FiMail, FiCode, FiDatabase } from 'react-icons/fi';
import './About.css';

function About() {
  const team = [
    {
      name: "Bilal",
      icon: FiHeart,
    },
    {
      name: "Pavan", 
      icon: FiCode,
    },
    {
      name: "Arnav",
      icon: FiAward,
    },
    {
      name: "Ragavan",
      icon: FiDatabase,
    },
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Meet the Team Behind <span className="text-primary">Braillience</span></h1>
          <p className="hero-subtitle">
            We're a team of technologists, educators, and accessibility advocates united by a 
            common goal: making education accessible to everyone, everywhere.
          </p>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="story-card">
            <h2 className="story-title">Our Story</h2>
            <div className="story-content">
              <p>
                Braillience was born from a simple observation: while AI is revolutionizing education, 
                blind and visually impaired students are often left behind by the very technologies 
                meant to help them learn.
              </p>
              <p>
                We asked ourselves: what if we could use AI not to replace human interaction, but to make 
                educational content more accessible? What if every PDF, every lecture slide, every textbook 
                could be instantly transformed into an interactive, voice-guided learning experience?
              </p>
              <p>
                Our team built the foundation for Braillience—a platform that combines 
                artificial intelligence, voice technology, and accessible design to create a seamless 
                learning experience for blind students. But this is just the beginning of our journey.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="team-header">
            <h2 className="section-title">The Team</h2>
            <p className="team-subtitle">
              Diverse backgrounds, shared passion for accessible technology
            </p>
          </div>

          <div className="team-grid">
            {team.map((member, index) => {
              const Icon = member.icon;
              return (
                <div key={index} className="team-card">
                  <div className="team-icon">
                    <Icon className="team-icon-svg" />
                  </div>
                  <h3 className="team-name">{member.name}</h3>
                  <div className="team-links">
                    <a href="#" className="team-link" aria-label={`${member.name} on LinkedIn`}>
                      <FiUsers className="team-link-icon" />
                    </a>
                    <a href="#" className="team-link" aria-label={`${member.name} on GitHub`}>
                      <FiGithub className="team-link-icon" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mission Values */}
        <section className="values-section">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FiHeart className="value-icon-svg" />
              </div>
              <h3>Accessibility First</h3>
              <p>We believe education should be available to everyone, regardless of ability.</p>
              <ul className="value-details">
                <li>WCAG 2.1 AAA compliance ensures the highest accessibility standards</li>
                <li>Every feature designed with screen readers and voice navigation in mind</li>
                <li>Continuous testing with blind and visually impaired users</li>
                <li>Committed to removing barriers in educational technology</li>
              </ul>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FiAward className="value-icon-svg" />
              </div>
              <h3>AI Innovation</h3>
              <p>Leveraging cutting-edge AI to transform any content into accessible learning materials.</p>
              <ul className="value-details">
                <li>Advanced natural language processing for content analysis</li>
                <li>Intelligent flashcard generation from complex documents</li>
                <li>Adaptive learning algorithms that personalize the experience</li>
                <li>Continuous improvement through machine learning</li>
              </ul>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FiMic className="value-icon-svg" />
              </div>
              <h3>Voice Empowerment</h3>
              <p>Making learning natural and hands-free through advanced voice technology.</p>
              <ul className="value-details">
                <li>State-of-the-art speech recognition for seamless interaction</li>
                <li>Natural-sounding text-to-speech across all content</li>
                <li>Voice commands for intuitive navigation</li>
                <li>Scheduled phone calls for convenient learning access</li>
              </ul>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FiTrendingUp className="value-icon-svg" />
              </div>
              <h3>Student Success</h3>
              <p>Measuring our success by the achievements of the students we serve.</p>
              <ul className="value-details">
                <li>Comprehensive progress tracking and analytics</li>
                <li>Adaptive testing to challenge and support learners</li>
                <li>Real-time feedback for continuous improvement</li>
                <li>Celebrating every milestone and achievement</li>
              </ul>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FiRefreshCw className="value-icon-svg" />
              </div>
              <h3>Continuous Improvement</h3>
              <p>Always listening, learning, and adapting to serve our community better.</p>
              <ul className="value-details">
                <li>Regular user feedback sessions with students and educators</li>
                <li>Rapid iteration based on real-world usage</li>
                <li>Transparent development roadmap</li>
                <li>Community-driven feature prioritization</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-subtitle">
            We'd love to hear your feedback, answer your questions, or discuss collaboration opportunities.
          </p>
          <div className="contact-actions">
            <a href="mailto:braillienceai@gmail.com" className="contact-button primary">
              <FiMail className="button-icon" />
              Email Us
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-button secondary">
              <FiGithub className="button-icon" />
              View on GitHub
            </a>
          </div>
          <p className="contact-footer">
            Join our community to connect with other users and contributors
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;