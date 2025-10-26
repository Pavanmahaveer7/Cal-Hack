# VAPI Webhook Setup for Real Call Capture

## 🎯 **What This Does**

This sets up a webhook endpoint that VAPI will call to send your **real phone call conversation** to Letta, so you can see your actual conversation instead of fake mock data.

## 🔧 **Setup Steps**

### **Step 1: Get Your Webhook URL**

Your webhook URL is: `http://localhost:3001/api/vapi-webhook/vapi-webhook`

**For production/testing with ngrok:**
```bash
# Install ngrok if you haven't
npm install -g ngrok

# Expose your local server
ngrok http 3001

# Your webhook URL will be something like:
# https://abc123.ngrok.io/api/vapi-webhook/vapi-webhook
```

### **Step 2: Configure VAPI Webhook**

1. **Go to your VAPI dashboard** at https://dashboard.vapi.ai
2. **Go to "Webhooks" section**
3. **Add new webhook:**
   - **URL:** `https://your-ngrok-url.ngrok.io/api/vapi-webhook/vapi-webhook`
   - **Events:** Select "Call Ended" and "Message"
   - **Method:** POST

### **Step 3: Test the Webhook**

Let me test if the webhook is working:

```bash
# Test webhook endpoint
curl -X POST http://localhost:3001/api/vapi-webhook/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "call-ended",
    "call": {
      "id": "test-call-123",
      "customer": {"number": "+16506844796"},
      "duration": 120,
      "status": "completed",
      "startedAt": "2025-01-25T22:00:00Z",
      "endedAt": "2025-01-25T22:02:00Z",
      "metadata": {
        "userId": "demo-user",
        "documentId": 4,
        "documentName": "Accessable Submission.pdf"
      }
    },
    "transcript": "User: Hello, I want to learn about this document.\nAssistant: Great! I'm your AI teacher. Let's start with the first concept..."
  }'
```

## 📱 **How It Works**

1. **You make a phone call** using the VAPI Teacher feature
2. **VAPI captures your real conversation** during the call
3. **When call ends, VAPI sends transcript** to your webhook
4. **Webhook processes transcript** and stores in Letta
5. **You can see your real conversation** in Letta dashboard

## 🔍 **Check Your Real Conversation**

After a call, check:

1. **Letta Dashboard:** https://dashboard.letta.com
2. **Look for your agent** (should have real conversation data)
3. **Check Conversations tab** in your app for transcript history

## 🚨 **Troubleshooting**

### **Webhook Not Receiving Data:**
- Check if ngrok is running: `ngrok http 3001`
- Verify webhook URL in VAPI dashboard
- Check server logs for webhook calls

### **Still Seeing Fake Data:**
- Make sure you're using **real VAPI calls** (not mock calls)
- Check if webhook is properly configured in VAPI
- Verify the webhook endpoint is accessible

### **Letta Not Getting Data:**
- Check server logs for Letta API errors
- Verify `LETTA_API_KEY` is set in `.env`
- Check if agent is being created properly

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ Webhook receives call data (check server logs)
- ✅ Real conversation appears in Letta dashboard
- ✅ No more "fake" mock conversation data
- ✅ Your actual phone conversation is stored

## 📞 **Next Steps**

1. **Set up ngrok** to expose your local server
2. **Configure VAPI webhook** with your ngrok URL
3. **Make a real phone call** using VAPI Teacher
4. **Check Letta dashboard** for your real conversation
5. **Verify in Conversations tab** that real data is stored

Your real phone call conversation will now be captured and stored in Letta! 🎉
