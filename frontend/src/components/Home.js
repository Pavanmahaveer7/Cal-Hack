import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiPhone, FiTarget, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Braillience</h1>
            <p className="hero-subtitle">
              Empowering educators to create accessible, voice-first learning experiences for blind and visually impaired students.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="cta-button primary">
                Get Started as Professor
                <FiArrowRight className="button-icon" />
              </Link>
              <Link to="/login" className="cta-button secondary">
                Sign In
              </Link>
            </div>
            <blockquote className="hero-quote">
              "Access to communication in the widest sense is access to knowledge, and that is vitally important for us."
            </blockquote>
            <cite className="hero-quote-attribution">— Louis Braille</cite>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span className="feature-number">1</span>
              </div>
              <h3>Upload Course Materials</h3>
              <p>Professors upload PDFs, lecture notes, and assignments to create accessible learning content.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span className="feature-number">2</span>
              </div>
              <h3>AI Phone Tutoring</h3>
              <p>Students receive personalized phone calls from AI tutors based on your course materials.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span className="feature-number">3</span>
              </div>
              <h3>Track Progress</h3>
              <p>Monitor student engagement, completion rates, and learning outcomes in your dashboard.</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2 className="section-title">Why Choose Braillience?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <FiCheckCircle className="benefit-icon" />
              <div className="benefit-content">
                <h3>Accessibility First</h3>
                <p>Designed specifically for blind and visually impaired learners with full screen reader support.</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <FiCheckCircle className="benefit-icon" />
              <div className="benefit-content">
                <h3>Easy Setup</h3>
                <p>Upload your existing course materials and let our AI handle the rest.</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <FiCheckCircle className="benefit-icon" />
              <div className="benefit-content">
                <h3>Real-time Analytics</h3>
                <p>Track student progress and engagement through detailed analytics and conversation transcripts.</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <FiCheckCircle className="benefit-icon" />
              <div className="benefit-content">
                <h3>Inclusive Learning</h3>
                <p>Create truly inclusive educational experiences that work for all students.</p>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Make Your Courses More Accessible?</h2>
            <p>Join educators who are creating inclusive learning environments for all students.</p>
            <div className="cta-actions">
              <Link to="/register" className="cta-button primary">
                Create Professor Account
                <FiArrowRight className="button-icon" />
              </Link>
              <Link to="/about" className="cta-button secondary">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
