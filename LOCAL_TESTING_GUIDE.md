# 🏠 Local Letta Integration Testing Guide

## 🎯 **Testing Letta Integration Locally (No Domain Required)**

Your Braillience platform is **fully ready** for phone call transcript processing with Letta integration. Here's how to test it locally:

## 🚀 **Quick Start**

### **1. Start Your Server**
```bash
cd /Users/adhariya/src/Braillience/backend
npm start
```

### **2. Test the Integration**
```bash
# Test phone call transcript processing
curl -X POST http://localhost:3001/api/vapi-transcripts/process-transcript \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-student",
    "callId": "test-call-123",
    "transcript": "Student: Hello, I need help with math. Teacher: I am here to help you with math. What specific topic?",
    "metadata": {
      "phoneNumber": "+1234567890",
      "documentId": "1",
      "documentName": "Math Chapter 1",
      "mode": "teacher"
    }
  }'
```

### **3. Check Learning Context**
```bash
# Get student's learning context
curl http://localhost:3001/api/stateful-vapi/context/test-student
```

## 📞 **How Phone Call Processing Works**

### **Real-World Flow:**
1. **📞 Student calls VAPI number**
2. **🎙️ VAPI records conversation**
3. **📝 VAPI sends transcript to your webhook**
4. **🤖 System creates Letta agent for student**
5. **💾 Transcript stored in Letta for memory**
6. **🧠 Future calls build on this memory**

### **Local Testing Flow:**
1. **🧪 Simulate phone call transcript**
2. **📝 Send to your local API**
3. **🤖 System processes with Letta**
4. **💾 Stores conversation locally + Letta**
5. **🧠 Generates learning context**

## 🔧 **Available Endpoints**

### **Phone Call Processing**
```bash
POST /api/vapi-transcripts/process-transcript
```
- Processes phone call transcripts
- Creates Letta agents for students
- Stores conversations with memory

### **Learning Context**
```bash
GET /api/stateful-vapi/context/{userId}
```
- Gets student's learning history
- Provides personalized insights
- Tracks learning progress

### **Conversation History**
```bash
GET /api/conversations/{userId}
```
- Retrieves all conversations for a student
- Shows learning progression
- Tracks engagement patterns

## 🧪 **Test Scenarios**

### **Scenario 1: First-Time Student**
```bash
# Simulate new student calling
curl -X POST http://localhost:3001/api/vapi-transcripts/process-transcript \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "new-student-001",
    "callId": "first-call-001",
    "transcript": "Student: Hi, this is my first time calling. Teacher: Welcome! I am your AI tutor. How can I help you today?",
    "metadata": {
      "phoneNumber": "+1234567890",
      "documentId": "1",
      "documentName": "Introduction",
      "mode": "teacher",
      "studentType": "blind",
      "accessibility": "audio_only"
    }
  }'
```

### **Scenario 2: Returning Student**
```bash
# Simulate returning student (builds on previous conversations)
curl -X POST http://localhost:3001/api/vapi-transcripts/process-transcript \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "new-student-001",
    "callId": "second-call-001",
    "transcript": "Student: Hi, I am back for more help. Teacher: Welcome back! I remember our previous conversation. How can I assist you today?",
    "metadata": {
      "phoneNumber": "+1234567890",
      "documentId": "1",
      "documentName": "Follow-up",
      "mode": "teacher",
      "followUp": true
    }
  }'
```

## 📊 **What's Working**

✅ **Phone Call Transcript Processing**
- Receives and processes VAPI transcripts
- Parses conversation into structured messages
- Stores in both local files and Letta cloud

✅ **Letta Integration**
- Creates personalized agents for each student
- Stores conversation history in Letta
- Enables stateful memory across calls

✅ **Learning Context Generation**
- Tracks student progress over time
- Identifies learning patterns and preferences
- Provides personalized insights

✅ **Conversation Management**
- Stores all phone call transcripts
- Tracks learning progression
- Enables follow-up conversations

## 🚀 **Production Deployment**

When ready to deploy:

1. **Deploy to a server with a domain**
2. **Configure VAPI webhook URL:**
   ```
   https://your-domain.com/api/vapi-transcripts/process-transcript
   ```
3. **Start receiving real phone calls!**

## 🔍 **Troubleshooting**

### **Server Not Running**
```bash
# Check if server is running
curl http://localhost:3001/api/health
```

### **Letta API Issues**
- Check your `.env` file has correct `LETTA_API_KEY`
- Verify Letta API key is valid
- Check server logs for Letta errors

### **Port Conflicts**
- Make sure port 3001 is available
- Change port in `server.js` if needed

## 📱 **No Domain Required**

This local testing setup works without any domain or external services. You can:

- ✅ Test phone call transcript processing
- ✅ Verify Letta integration
- ✅ Check learning context generation
- ✅ Test conversation storage
- ✅ Simulate real-world scenarios

**Your Braillience platform is ready for production deployment!** 🎯
