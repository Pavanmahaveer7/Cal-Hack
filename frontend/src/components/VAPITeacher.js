import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPhone, FiPhoneOff, FiVolume2, FiBookOpen } from 'react-icons/fi';
import './VAPITeacher.css';

function VAPITeacher() {
  const navigate = useNavigate();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callId, setCallId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userPhone, setUserPhone] = useState('');
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchAvailableDocuments();
  }, []);

  const fetchAvailableDocuments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/upload/pdfs/demo-user');
      const result = await response.json();
      
      if (result.success) {
        setAvailableDocuments(result.data);
        if (result.data.length > 0) {
          setSelectedDocument(result.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const startVAPICall = async () => {
    if (!userPhone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!selectedDocument) {
      setError('Please select a document to study');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/voice-learning/start-teacher-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          phoneNumber: userPhone,
          documentId: selectedDocument,
          mode: 'teacher'
        })
      });

      const result = await response.json();

      if (result.success) {
        setCallId(result.data.callId);
        setIsCallActive(true);
        console.log('🎤 VAPI teacher call started:', result.data);
      } else {
        setError(result.error || 'Failed to start teacher call');
      }
    } catch (err) {
      console.error('Error starting teacher call:', err);
      setError('Failed to start teacher call');
    } finally {
      setLoading(false);
    }
  };

  const endVAPICall = async () => {
    if (!callId) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/voice-learning/end-teacher-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callId: callId
        })
      });

      const result = await response.json();

      if (result.success) {
        setIsCallActive(false);
        setCallId(null);
        console.log('🛑 VAPI teacher call ended');
      }
    } catch (err) {
      console.error('Error ending teacher call:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vapi-teacher-container">
      <div className="container">
        <div className="teacher-header">
          <h1 className="teacher-title">🎓 AI Teacher Call</h1>
          <p className="teacher-subtitle">
            Get a personal AI teacher to walk through your uploaded PDF content
          </p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="dismiss-button">
              Dismiss
            </button>
          </div>
        )}

        {!isCallActive ? (
          <div className="call-setup">
            <div className="setup-section">
              <h3>📞 Phone Number</h3>
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Enter your phone number (e.g., +1234567890)"
                className="phone-input"
                required
              />
              <p className="help-text">
                Enter your phone number in international format (e.g., +1 for US)
              </p>
            </div>

            <div className="setup-section">
              <h3>📚 Select Document</h3>
              {availableDocuments.length > 0 ? (
                <select
                  value={selectedDocument}
                  onChange={(e) => setSelectedDocument(e.target.value)}
                  className="document-select"
                >
                  {availableDocuments.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.fileName} ({doc.flashcardCount} flashcards)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="no-documents">
                  <p>No documents available. Please upload a PDF first.</p>
                  <button onClick={() => navigate('/upload')} className="upload-button">
                    Upload PDF
                  </button>
                </div>
              )}
            </div>

            <div className="call-actions">
              <button
                onClick={startVAPICall}
                disabled={loading || !userPhone.trim() || !selectedDocument}
                className="start-call-button"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Starting Call...
                  </>
                ) : (
                  <>
                    <FiPhone />
                    Start Teacher Call
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="active-call">
            <div className="call-status">
              <div className="status-indicator">
                <FiVolume2 className="status-icon" />
                <span>Call Active</span>
              </div>
              <p className="call-info">
                Your AI teacher is now calling you to walk through the document content.
                Answer the call to begin your personalized learning session!
              </p>
            </div>

            <div className="call-details">
              <h4>📞 Call Details</h4>
              <p><strong>Phone:</strong> {userPhone}</p>
              <p><strong>Document:</strong> {availableDocuments.find(doc => doc.id === selectedDocument)?.fileName}</p>
              <p><strong>Call ID:</strong> {callId}</p>
            </div>

            <div className="call-actions">
              <button
                onClick={endVAPICall}
                disabled={loading}
                className="end-call-button"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Ending Call...
                  </>
                ) : (
                  <>
                    <FiPhoneOff />
                    End Call
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="teacher-features">
          <h3>🎓 What Your AI Teacher Will Do:</h3>
          <ul>
            <li>📖 Walk through your PDF content step by step</li>
            <li>🎯 Focus on key concepts and important information</li>
            <li>❓ Ask questions to test your understanding</li>
            <li>💡 Provide explanations and examples</li>
            <li>🔄 Adapt to your learning pace</li>
            <li>📝 Help you take notes and remember key points</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VAPITeacher;
