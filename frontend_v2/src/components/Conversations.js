import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiClock, FiUser, FiBookOpen, FiPhone, FiTrendingUp, FiFileText, FiEye, FiDownload } from 'react-icons/fi';
import './Conversations.css';

function Conversations() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [transcriptView, setTranscriptView] = useState('list');

  useEffect(() => {
    fetchConversations();
    fetchAnalytics();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/conversations/demo-user');
      const result = await response.json();
      
      if (result.success) {
        setConversations(result.data.conversations || []);
      } else {
        setError(result.error || 'Failed to fetch conversations');
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/conversations/demo-user/analytics');
      const result = await response.json();
      
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const fetchConversationDetails = async (conversationId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/conversations/conversation/${conversationId}`);
      const result = await response.json();
      
      if (result.success) {
        setSelectedConversation(result.data);
      }
    } catch (err) {
      console.error('Error fetching conversation details:', err);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return 'status-unknown';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'teacher': return <FiBookOpen />;
      case 'learning': return <FiMessageCircle />;
      case 'test': return <FiTrendingUp />;
      default: return <FiMessageCircle />;
    }
  };

  const exportTranscript = (conversation) => {
    const transcript = conversation.messages?.map(msg => 
      `${msg.type.toUpperCase()}: ${msg.content}`
    ).join('\n\n') || 'No transcript available';
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${conversation.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTranscript = (messages) => {
    if (!messages || messages.length === 0) return 'No transcript available';
    
    return messages.map((message, index) => (
      <div key={index} className={`transcript-message ${message.type}`}>
        <div className="transcript-speaker">
          {message.type === 'user' ? '👤 Student' : '🤖 Teacher'}
        </div>
        <div className="transcript-content">
          {message.content}
        </div>
        <div className="transcript-timestamp">
          {formatDate(message.timestamp)}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="conversations-container">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="conversations-container">
      <div className="container">
        <div className="conversations-header">
          <h1 className="conversations-title">Conversation History</h1>
          <p className="conversations-subtitle">
            View and analyze your VAPI learning sessions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="conversations-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiTrendingUp />
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'transcripts' ? 'active' : ''}`}
            onClick={() => setActiveTab('transcripts')}
          >
            <FiFileText />
            Transcripts
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="dismiss-button">
              Dismiss
            </button>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Analytics Overview */}
            {analytics && (
              <div className="analytics-section">
                <h2>Learning Analytics</h2>
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h3>{analytics.totalConversations}</h3>
                    <p>Total Sessions</p>
                  </div>
                  <div className="analytics-card">
                    <h3>{formatDuration(analytics.averageDuration)}</h3>
                    <p>Avg Duration</p>
                  </div>
                  <div className="analytics-card">
                    <h3>{analytics.modeBreakdown.teacher || 0}</h3>
                    <p>Teacher Calls</p>
                  </div>
                  <div className="analytics-card">
                    <h3>{analytics.modeBreakdown.learning || 0}</h3>
                    <p>Learning Sessions</p>
                  </div>
                </div>
              </div>
            )}

            {/* Conversations List */}
            <div className="conversations-section">
              <h2>Recent Conversations</h2>
              {conversations.length === 0 ? (
                <div className="no-conversations">
                  <FiMessageCircle className="no-conversations-icon" />
                  <h3>No conversations yet</h3>
                  <p>Start a learning session to see your conversation history here.</p>
                  <button onClick={() => navigate('/voice-learning')} className="start-learning-button">
                    Start Learning
                  </button>
                </div>
              ) : (
                <div className="conversations-list">
                  {conversations.map((conversation) => (
                    <div key={conversation.id} className="conversation-card">
                      <div className="conversation-header">
                        <div className="conversation-info">
                          <div className="conversation-mode">
                            {getModeIcon(conversation.mode)}
                            <span>{conversation.mode}</span>
                          </div>
                          <div className={`conversation-status ${getStatusColor(conversation.status)}`}>
                            {conversation.status}
                          </div>
                        </div>
                        <div className="conversation-meta">
                          <span className="conversation-date">
                            <FiClock />
                            {formatDate(conversation.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="conversation-content">
                        <h3>{conversation.documentName || 'Learning Session'}</h3>
                        <p className="conversation-details">
                          <FiPhone /> {conversation.phoneNumber} • 
                          <FiBookOpen /> {conversation.flashcardCount || 0} flashcards
                        </p>
                        {conversation.duration && (
                          <p className="conversation-duration">
                            Duration: {formatDuration(conversation.duration)}
                          </p>
                        )}
                      </div>

                      <div className="conversation-actions">
                        <button 
                          onClick={() => fetchConversationDetails(conversation.id)}
                          className="view-details-button"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => navigate('/voice-learning')}
                          className="start-similar-button"
                        >
                          Start Similar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Transcripts Tab */}
        {activeTab === 'transcripts' && (
          <div className="transcripts-section">
            <div className="transcripts-header">
              <h2>Call Transcripts</h2>
              <div className="transcript-controls">
                <button 
                  className={`view-toggle ${transcriptView === 'list' ? 'active' : ''}`}
                  onClick={() => setTranscriptView('list')}
                >
                  <FiEye />
                  List View
                </button>
                <button 
                  className={`view-toggle ${transcriptView === 'detailed' ? 'active' : ''}`}
                  onClick={() => setTranscriptView('detailed')}
                >
                  <FiFileText />
                  Detailed View
                </button>
              </div>
            </div>

            {conversations.length === 0 ? (
              <div className="no-transcripts">
                <FiFileText className="no-transcripts-icon" />
                <h3>No transcripts available</h3>
                <p>Start a VAPI call to see conversation transcripts here.</p>
                <button onClick={() => navigate('/vapi-teacher')} className="start-call-button">
                  Start VAPI Call
                </button>
              </div>
            ) : (
              <div className="transcripts-list">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="transcript-card">
                    <div className="transcript-header">
                      <div className="transcript-info">
                        <h3>{conversation.documentName || 'Learning Session'}</h3>
                        <div className="transcript-meta">
                          <span className="transcript-mode">
                            {getModeIcon(conversation.mode)}
                            {conversation.mode}
                          </span>
                          <span className="transcript-date">
                            <FiClock />
                            {formatDate(conversation.createdAt)}
                          </span>
                          <span className="transcript-phone">
                            <FiPhone />
                            {conversation.phoneNumber}
                          </span>
                        </div>
                      </div>
                      <div className="transcript-actions">
                        <button 
                          onClick={() => fetchConversationDetails(conversation.id)}
                          className="view-transcript-button"
                        >
                          <FiEye />
                          View Full Transcript
                        </button>
                        <button 
                          onClick={() => exportTranscript(conversation)}
                          className="export-transcript-button"
                        >
                          <FiDownload />
                          Export
                        </button>
                      </div>
                    </div>

                    {transcriptView === 'detailed' && conversation.messages && conversation.messages.length > 0 && (
                      <div className="transcript-preview">
                        <h4>Transcript Preview</h4>
                        <div className="transcript-messages">
                          {conversation.messages.slice(0, 3).map((message, index) => (
                            <div key={index} className={`transcript-message ${message.type}`}>
                              <div className="transcript-speaker">
                                {message.type === 'user' ? '👤 Student' : '🤖 Teacher'}
                              </div>
                              <div className="transcript-content">
                                {message.content.length > 100 
                                  ? `${message.content.substring(0, 100)}...` 
                                  : message.content
                                }
                              </div>
                            </div>
                          ))}
                          {conversation.messages.length > 3 && (
                            <div className="transcript-more">
                              ... and {conversation.messages.length - 3} more messages
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conversation Details Modal */}
        {selectedConversation && (
          <div className="conversation-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Conversation Details</h3>
                <button 
                  onClick={() => setSelectedConversation(null)}
                  className="close-button"
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="conversation-details">
                  <h4>{selectedConversation.documentName}</h4>
                  <p><strong>Mode:</strong> {selectedConversation.mode}</p>
                  <p><strong>Status:</strong> {selectedConversation.status}</p>
                  <p><strong>Phone:</strong> {selectedConversation.phoneNumber}</p>
                  <p><strong>Flashcards:</strong> {selectedConversation.flashcardCount}</p>
                  <p><strong>Started:</strong> {formatDate(selectedConversation.startTime)}</p>
                  {selectedConversation.endTime && (
                    <p><strong>Ended:</strong> {formatDate(selectedConversation.endTime)}</p>
                  )}
                  {selectedConversation.duration && (
                    <p><strong>Duration:</strong> {formatDuration(selectedConversation.duration)}</p>
                  )}
                </div>

                {selectedConversation.messages && selectedConversation.messages.length > 0 && (
                  <div className="conversation-messages">
                    <div className="messages-header">
                      <h4>Full Transcript</h4>
                      <button 
                        onClick={() => exportTranscript(selectedConversation)}
                        className="export-full-transcript-button"
                      >
                        <FiDownload />
                        Export Full Transcript
                      </button>
                    </div>
                    <div className="messages-list">
                      {formatTranscript(selectedConversation.messages)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversations;
