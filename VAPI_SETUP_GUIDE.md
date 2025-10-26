# 📞 VAPI Setup Guide for Real Phone Calls

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Get VAPI Account**
1. Go to https://dashboard.vapi.ai
2. Sign up for a free account
3. Get your API key from Settings → API Keys

### **Step 2: Configure Phone Number**
1. In VAPI dashboard, go to "Phone Numbers"
2. Add a phone number (you can use your own)
3. Copy the Phone Number ID (UUID format)

### **Step 3: Create Assistant**
1. Go to "Assistants" in VAPI dashboard
2. Create a new assistant
3. Copy the Assistant ID

### **Step 4: Update Environment**
Add these to your `backend/.env` file:
```env
VAPI_API_KEY=your-api-key-here
VAPI_ASSISTANT_ID=your-assistant-id-here
VAPI_PHONE_NUMBER_ID=your-phone-number-id-here
USE_REAL_VAPI=true
```

### **Step 5: Restart Server**
```bash
cd /Users/adhariya/src/Braillience/backend
npm start
```

## 🎯 **What Happens Next**

1. **Real Phone Call**: VAPI will call your phone number
2. **AI Teacher**: The assistant will walk through your document
3. **Letta Storage**: Conversation gets stored in Letta for stateful learning
4. **Dashboard**: Check Letta dashboard to see the agent and conversation

## 🔧 **Troubleshooting**

### **If phone call doesn't work:**
- Check VAPI dashboard for call logs
- Verify phone number is correct
- Check API key permissions

### **If Letta errors occur:**
- The system falls back to file storage
- Core functionality still works
- Check Letta API key configuration

## 🎉 **Expected Result**

After setup, when you click "Start Call":
1. **Your phone rings** 📞
2. **AI teacher answers** 🤖
3. **Walks through your document** 📚
4. **Stores conversation in Letta** 🧠
5. **Provides personalized learning** 🎯

**Your system will be fully functional with real phone calls!**