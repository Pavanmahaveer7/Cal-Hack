# 📞 Phone Testing Setup Guide

## 🚀 **Option 1: Using ngrok (Recommended for Local Testing)**

### **Step 1: Install ngrok**
```bash
# Install ngrok
brew install ngrok
# OR download from https://ngrok.com/download
```

### **Step 2: Start Your Server**
```bash
cd /Users/adhariya/src/Braillience/backend
npm start
```

### **Step 3: Expose Your Local Server**
```bash
# In a new terminal
ngrok http 3001
```

This will give you a public URL like: `https://abc123.ngrok.io`

### **Step 4: Configure VAPI Webhook**
1. Go to https://dashboard.vapi.ai
2. Create a new assistant
3. Set webhook URL to: `https://abc123.ngrok.io/api/vapi-transcripts/process-transcript`
4. Save and test!

## 🌐 **Option 2: Deploy to Production**

### **Deploy to Railway (Free)**
1. Go to https://railway.app
2. Connect your GitHub repo
3. Deploy your backend
4. Get your production URL
5. Configure VAPI webhook to your production URL

### **Deploy to Heroku (Free)**
1. Go to https://heroku.com
2. Create new app
3. Connect GitHub repo
4. Deploy
5. Configure VAPI webhook

## 🧪 **Option 3: Test with Mock Calls**

### **Simulate Phone Call**
```bash
curl -X POST http://localhost:3001/api/vapi-transcripts/process-transcript \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "real-test-user",
    "callId": "real-call-123",
    "transcript": "Student: Hello, I am calling for help with my homework. Teacher: Hi! I am your AI tutor. How can I help you today?",
    "metadata": {
      "phoneNumber": "+1234567890",
      "documentId": "1",
      "documentName": "Test Document",
      "mode": "teacher"
    }
  }'
```

## 📊 **Letta Dashboard Testing**

### **Step 1: Go to Letta Dashboard**
1. Visit: https://dashboard.letta.com
2. Sign in with your Letta account
3. Go to "Agents" section

### **Step 2: Find Your Agents**
- Look for agents with names like: `agent-xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- These are the agents created for your test users

### **Step 3: Test Agent Conversations**
1. Click on an agent
2. Go to "Messages" tab
3. Send a test message: "Hello, can you help me with my homework?"
4. See the agent's response

### **Step 4: Check Agent Memory**
1. Go to "Memory" tab
2. See the stored conversation data
3. Check learning patterns and insights

## 🔍 **What to Look For**

### **In Letta Dashboard:**
- ✅ **Agents Created**: Should see agents for each test user
- ✅ **Messages Stored**: Conversations should appear in agent messages
- ✅ **Memory Blocks**: Learning patterns should be stored
- ✅ **Context**: Previous conversations should be remembered

### **In Your Server Logs:**
- ✅ **Agent Creation**: "🤖 Created Letta agent for user: [userId]"
- ✅ **Message Storage**: "💾 Stored conversation: [conversationId]"
- ✅ **Context Generation**: "🧠 Generated context for stateful agent"

## 🚨 **Troubleshooting**

### **If ngrok doesn't work:**
1. Use Railway or Heroku for free deployment
2. Or use VAPI's test mode with local webhook

### **If Letta agents aren't showing:**
1. Check your `.env` file has correct `LETTA_API_KEY`
2. Verify the API key is valid
3. Check server logs for Letta errors

### **If phone calls aren't working:**
1. Make sure your server is running
2. Check webhook URL is correct
3. Verify VAPI configuration

## 🎯 **Expected Results**

After testing, you should see:

1. **📞 Phone calls** → **🤖 Letta agents created**
2. **💬 Conversations** → **📚 Stored in Letta memory**
3. **🧠 Learning context** → **🎯 Personalized responses**
4. **📈 Progress tracking** → **📊 Analytics in Letta dashboard**

**Your system will be fully functional for real phone calls!** 🎉
