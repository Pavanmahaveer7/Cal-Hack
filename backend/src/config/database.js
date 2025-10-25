const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../../data/braillience.db');
    this.isConnected = false;
  }

  async connect() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Connect to SQLite database
      this.db = new Database(this.dbPath);
      this.isConnected = true;
      
      console.log('✅ Connected to SQLite database');
      
      // Initialize tables
      await this.initializeTables();
      
    } catch (error) {
      console.error('❌ Failed to connect to SQLite:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async initializeTables() {
    try {
      // Users table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          preferences TEXT DEFAULT '{}',
          stats TEXT DEFAULT '{}',
          accessibility TEXT DEFAULT '{}',
          isActive BOOLEAN DEFAULT 1,
          lastLogin DATETIME DEFAULT CURRENT_TIMESTAMP,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Documents table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          fileName TEXT NOT NULL,
          originalName TEXT NOT NULL,
          filePath TEXT NOT NULL,
          fileSize INTEGER NOT NULL,
          mimeType TEXT NOT NULL,
          extractedText TEXT NOT NULL,
          textLength INTEGER NOT NULL,
          processingStatus TEXT DEFAULT 'pending',
          processingError TEXT,
          metadata TEXT DEFAULT '{}',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(userId)
        )
      `);

      // Flashcards table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS flashcards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          documentId INTEGER NOT NULL,
          type TEXT NOT NULL,
          front TEXT NOT NULL,
          back TEXT NOT NULL,
          difficulty TEXT DEFAULT 'intermediate',
          subject TEXT DEFAULT 'General',
          tags TEXT DEFAULT '[]',
          source TEXT DEFAULT 'ai_generated',
          progress TEXT DEFAULT '{}',
          audioUrl TEXT,
          imageUrl TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(userId),
          FOREIGN KEY (documentId) REFERENCES documents(id)
        )
      `);

      // Create indexes for better performance
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_users_userId ON users(userId);
        CREATE INDEX IF NOT EXISTS idx_documents_userId ON documents(userId);
        CREATE INDEX IF NOT EXISTS idx_flashcards_userId ON flashcards(userId);
        CREATE INDEX IF NOT EXISTS idx_flashcards_documentId ON flashcards(documentId);
      `);

      console.log('✅ Database tables initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize tables:', error);
      throw error;
    }
  }

  getConnection() {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    return this.db;
  }

  async disconnect() {
    try {
      if (this.db) {
        this.db.close();
        this.isConnected = false;
        console.log('✅ Disconnected from SQLite database');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from database:', error);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      dbPath: this.dbPath,
      type: 'SQLite'
    };
  }

  // Health check method
  async healthCheck() {
    try {
      if (!this.isConnected) {
        return { status: 'disconnected', message: 'Database not connected' };
      }

      // Simple query to test connection
      const result = this.db.prepare('SELECT 1 as test').get();
      return { 
        status: 'healthy', 
        message: 'Database connection is healthy',
        ...this.getConnectionStatus()
      };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: 'Database health check failed',
        error: error.message 
      };
    }
  }
}

// Create singleton instance
const database = new DatabaseManager();

module.exports = database;