const database = require('../config/database');

class DatabaseService {
  constructor() {
    this.db = null;
  }

  getDb() {
    if (!this.db) {
      this.db = database.getConnection();
    }
    return this.db;
  }

  // User operations
  async createUser(userData) {
    const db = this.getDb();
    const stmt = db.prepare(`
      INSERT INTO users (userId, email, name, preferences, stats, accessibility)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userData.userId,
      userData.email,
      userData.name,
      JSON.stringify(userData.preferences || {}),
      JSON.stringify(userData.stats || {}),
      JSON.stringify(userData.accessibility || {})
    );
    
    return { id: result.lastInsertRowid, ...userData };
  }

  async getUser(userId) {
    const db = this.getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE userId = ?');
    const user = stmt.get(userId);
    
    if (user) {
      return {
        ...user,
        preferences: JSON.parse(user.preferences || '{}'),
        stats: JSON.parse(user.stats || '{}'),
        accessibility: JSON.parse(user.accessibility || '{}')
      };
    }
    return null;
  }

  async updateUser(userId, updateData) {
    const db = this.getDb();
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (key === 'preferences' || key === 'stats' || key === 'accessibility') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(updateData[key]));
      } else {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });
    
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(userId);
    
    const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE userId = ?`);
    const result = stmt.run(...values);
    
    return result.changes > 0;
  }

  // Document operations
  async createDocument(documentData) {
    const db = this.getDb();
    const stmt = db.prepare(`
      INSERT INTO documents (userId, fileName, originalName, filePath, fileSize, mimeType, extractedText, textLength, processingStatus, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      documentData.userId,
      documentData.fileName,
      documentData.originalName,
      documentData.filePath,
      documentData.fileSize,
      documentData.mimeType,
      documentData.extractedText,
      documentData.textLength,
      documentData.processingStatus || 'pending',
      JSON.stringify(documentData.metadata || {})
    );
    
    return { id: result.lastInsertRowid, ...documentData };
  }

  async getDocuments(userId) {
    const db = this.getDb();
    const stmt = db.prepare(`
      SELECT d.*, 
             (SELECT COUNT(*) FROM flashcards f WHERE f.documentId = d.id) as flashcardCount
      FROM documents d 
      WHERE d.userId = ? 
      ORDER BY d.createdAt DESC
    `);
    
    const documents = stmt.all(userId);
    return documents.map(doc => ({
      ...doc,
      metadata: JSON.parse(doc.metadata || '{}')
    }));
  }

  async getDocument(documentId, userId) {
    const db = this.getDb();
    const stmt = db.prepare('SELECT * FROM documents WHERE id = ? AND userId = ?');
    const doc = stmt.get(documentId, userId);
    
    if (doc) {
      return {
        ...doc,
        metadata: JSON.parse(doc.metadata || '{}')
      };
    }
    return null;
  }

  async updateDocument(documentId, updateData) {
    const db = this.getDb();
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (key === 'metadata') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(updateData[key]));
      } else {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });
    
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(documentId);
    
    const stmt = db.prepare(`UPDATE documents SET ${fields.join(', ')} WHERE id = ?`);
    const result = stmt.run(...values);
    
    return result.changes > 0;
  }

  // Flashcard operations
  async createFlashcard(flashcardData) {
    const db = this.getDb();
    const stmt = db.prepare(`
      INSERT INTO flashcards (userId, documentId, type, front, back, difficulty, subject, tags, source, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      flashcardData.userId,
      flashcardData.documentId,
      flashcardData.type,
      flashcardData.front,
      flashcardData.back,
      flashcardData.difficulty || 'intermediate',
      flashcardData.subject || 'General',
      JSON.stringify(flashcardData.tags || []),
      flashcardData.source || 'ai_generated',
      JSON.stringify(flashcardData.progress || {})
    );
    
    return { id: result.lastInsertRowid, ...flashcardData };
  }

  async getFlashcards(userId, documentId = null) {
    const db = this.getDb();
    let query = 'SELECT * FROM flashcards WHERE userId = ?';
    let params = [userId];
    
    if (documentId) {
      query += ' AND documentId = ?';
      params.push(documentId);
    }
    
    query += ' ORDER BY createdAt ASC';
    
    const stmt = db.prepare(query);
    const flashcards = stmt.all(...params);
    
    return flashcards.map(card => ({
      ...card,
      tags: JSON.parse(card.tags || '[]'),
      progress: JSON.parse(card.progress || '{}')
    }));
  }

  async updateFlashcardProgress(flashcardId, progressData) {
    const db = this.getDb();
    const stmt = db.prepare(`
      UPDATE flashcards 
      SET progress = ?, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    const result = stmt.run(JSON.stringify(progressData), flashcardId);
    return result.changes > 0;
  }

  async getFlashcardStats(userId) {
    const db = this.getDb();
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as totalCards,
        COUNT(CASE WHEN json_extract(progress, '$.masteryLevel') = 'mastered' THEN 1 END) as masteredCards,
        COUNT(CASE WHEN json_extract(progress, '$.masteryLevel') = 'learning' THEN 1 END) as learningCards,
        COUNT(CASE WHEN json_extract(progress, '$.masteryLevel') = 'new' THEN 1 END) as newCards
      FROM flashcards 
      WHERE userId = ?
    `);
    
    return stmt.get(userId);
  }
}

module.exports = new DatabaseService();
