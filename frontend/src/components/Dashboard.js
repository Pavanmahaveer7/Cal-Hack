import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiAward, FiTrendingUp, FiClock, FiTarget, FiVolume2 } from 'react-icons/fi';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    currentStreak: 0,
    studyTime: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

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
        </div>

        {/* Stats Overview */}
        <section className="stats-section" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="section-title">Your Progress</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FiBookOpen aria-hidden="true" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalCards}</div>
                <div className="stat-label">Total Cards</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FiTarget aria-hidden="true" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.masteredCards}</div>
                <div className="stat-label">Mastered</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FiClock aria-hidden="true" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.currentStreak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FiTrendingUp aria-hidden="true" />
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
                  className={`action-card action-card--${action.color}`}
                  aria-describedby={`action-${index}-desc`}
                >
                  <div className="action-icon">
                    <IconComponent aria-hidden="true" />
                  </div>
                  <div className="action-content">
                    <h3 className="action-title">{action.title}</h3>
                    <p id={`action-${index}-desc`} className="action-description">
                      {action.description}
                    </p>
                  </div>
                  <div className="action-arrow" aria-hidden="true">
                    →
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
                <div className="activity-icon">
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

        {/* Audio Settings */}
        <section className="settings-section" aria-labelledby="settings-heading">
          <h2 id="settings-heading" className="section-title">Audio Settings</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-content">
                <FiVolume2 className="setting-icon" aria-hidden="true" />
                <div>
                  <h3 className="setting-title">Audio Feedback</h3>
                  <p className="setting-description">
                    Enable sound effects and voice narration
                  </p>
                </div>
              </div>
              <button className="toggle-button" aria-pressed="true">
                <span className="toggle-slider"></span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
