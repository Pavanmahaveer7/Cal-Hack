import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiAward, FiTrendingUp, FiClock, FiTarget, FiVolume2 } from 'react-icons/fi';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    currentStreak: 0,
    studyTime: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const handleVoiceCommand = useCallback((command) => {
    switch (command.toLowerCase()) {
      case 'start learning':
      case 'learn':
        navigate('/learn');
        break;
      case 'take test':
      case 'test':
        navigate('/test');
        break;
      case 'upload pdf':
      case 'upload document':
        // For now, just show a message
        alert('PDF upload feature coming soon!');
        break;
      case 'view profile':
      case 'profile':
        // For now, just show a message
        alert('Profile feature coming soon!');
        break;
      case 'help':
        // For now, just show a message
        alert('Help feature coming soon!');
        break;
      default:
        console.log('Command not recognized:', command);
    }
  }, [navigate]);

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: handleVoiceCommand
  });

  useEffect(() => {
    // Simulate loading user data
    setStats({
      totalCards: 156,
      masteredCards: 89,
      currentStreak: 7,
      studyTime: 24
    });

    setRecentActivity([
      { id: 1, type: 'learned', text: 'Mastered 5 new Spanish words', time: '2 hours ago' },
      { id: 2, type: 'test', text: 'Completed French vocabulary test', time: '1 day ago' },
      { id: 3, type: 'learned', text: 'Learned 3 new German phrases', time: '2 days ago' }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Learn New Words',
      description: 'Start learning new vocabulary',
      icon: FiBookOpen,
      link: '/learn',
      color: 'primary'
    },
    {
      title: 'Test Yourself',
      description: 'Practice with flashcards',
      icon: FiAward,
      link: '/test',
      color: 'secondary'
    },
    {
      title: 'Review Progress',
      description: 'Check your learning stats',
      icon: FiTrendingUp,
      link: '/progress',
      color: 'accent'
    }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back!</h1>
          <p className="dashboard-subtitle">
            Ready to continue your learning journey?
          </p>
          
          {/* Voice Interface */}
          <div className="voice-interface" role="region" aria-label="Voice Commands">
            <p className="voice-instructions">
              Say "Start Learning", "Take Test", "Upload PDF", or "Help" to navigate
            </p>
            <div className="voice-controls">
              <button
                onClick={startListening}
                disabled={!isSupported}
                className="voice-button"
                aria-label="Start voice recognition"
              >
                <FiVolume2 className="voice-icon" />
                {isSupported ? 'Start Listening' : 'Voice Not Supported'}
              </button>
              <button
                onClick={stopListening}
                className="voice-button stop"
                aria-label="Stop voice recognition"
              >
                Stop
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <section className="stats-section" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="section-title">Your Progress</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FiBookOpen />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalCards}</div>
                <div className="stat-label">Total Cards</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FiAward />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.masteredCards}</div>
                <div className="stat-label">Mastered</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FiTarget />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.currentStreak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FiClock />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.studyTime}h</div>
                <div className="stat-label">Study Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions-section" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className={`action-card ${action.color}`}
                  aria-describedby={`action-${index}-description`}
                >
                  <div className="action-icon">
                    <IconComponent />
                  </div>
                  <div className="action-content">
                    <h3 className="action-title">{action.title}</h3>
                    <p id={`action-${index}-description`} className="action-description">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="activity-section" aria-labelledby="activity-heading">
          <h2 id="activity-heading" className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'learned' ? <FiBookOpen /> : <FiAward />}
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;