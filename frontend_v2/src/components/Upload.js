import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiFile, FiCheck, FiX, FiVolume2 } from 'react-icons/fi';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import './Upload.css';

function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleVoiceCommand = useCallback((command) => {
    switch (command.toLowerCase()) {
      case 'go back':
      case 'return home':
        navigate('/');
        break;
      case 'start learning':
      case 'learn':
        navigate('/learn');
        break;
      case 'take test':
      case 'test':
        navigate('/test');
        break;
      default:
        console.log('Command not recognized:', command);
    }
  }, [navigate]);

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: handleVoiceCommand
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      setUploadStatus({ type: 'error', message: 'Please select a PDF file' });
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      // Get the current user ID from localStorage
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : { id: 'demo-user' };
      
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('userId', user.id);

      const response = await fetch('http://localhost:3001/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus({ 
          type: 'success', 
          message: `Successfully processed ${result.data.flashcardCount} flashcards!` 
        });
        // Clear the file after successful upload
        setFile(null);
      } else {
        setUploadStatus({ 
          type: 'error', 
          message: result.error || 'Upload failed' 
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: 'Upload failed. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="upload-container">
      <div className="container">
        <div className="upload-header">
          <h1 className="upload-title">Upload PDF Document</h1>
          <p className="upload-subtitle">
            Upload a PDF to generate AI-powered flashcards for studying
          </p>

          {/* Voice Interface */}
          <div className="voice-interface" role="region" aria-label="Voice Commands">
            <p className="voice-instructions">
              Say "Go Back", "Start Learning", or "Take Test" to navigate
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

        <div className="upload-area">
          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
            role="button"
            tabIndex="0"
            aria-label="Upload PDF file"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                document.getElementById('file-input').click();
              }
            }}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            
            {file ? (
              <div className="file-selected">
                <FiFile className="file-icon" />
                <div className="file-info">
                  <h3>{file.name}</h3>
                  <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setUploadStatus(null);
                  }}
                  className="remove-file"
                  aria-label="Remove file"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div className="drop-zone-content">
                <FiUpload className="upload-icon" />
                <h3>Drop your PDF here or click to browse</h3>
                <p>Supported format: PDF files only</p>
                <button className="browse-button">Choose File</button>
              </div>
            )}
          </div>

          {file && (
            <div className="upload-actions">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="upload-button"
              >
                {uploading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiUpload />
                    Generate Flashcards
                  </>
                )}
              </button>
            </div>
          )}

          {uploadStatus && (
            <div className={`upload-status ${uploadStatus.type}`}>
              {uploadStatus.type === 'success' ? (
                <FiCheck className="status-icon" />
              ) : (
                <FiX className="status-icon" />
              )}
              <span>{uploadStatus.message}</span>
            </div>
          )}
        </div>

        <div className="upload-info">
          <h3>How it works:</h3>
          <ol>
            <li>Upload a PDF document (text-based PDFs work best)</li>
            <li>Our AI analyzes the content and extracts key concepts</li>
            <li>Generate educational flashcards automatically</li>
            <li>Study with voice-guided learning sessions</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Upload;
