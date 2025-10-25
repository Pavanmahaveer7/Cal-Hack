# 🎤 VAPI Integration Setup Guide

## Overview
This guide will help you set up real VAPI integration for your Braillience app, enabling actual voice calls with AI assistants.

## Step 1: Get VAPI API Key

1. **Sign up at VAPI**: Go to [vapi.ai](https://vapi.ai) and create an account
2. **Navigate to Dashboard**: Log into your VAPI dashboard
3. **Get API Key**: 
   - Go to Settings → API Keys
   - Copy your API key (starts with `vapi_`)

## Step 2: Create an Assistant

1. **Go to Assistants**: In the VAPI dashboard, click "Assistants"
2. **Create New Assistant**: Click "Create Assistant"
3. **Configure Assistant**:
   - **Name**: "Braillience Learning Assistant"
   - **Model**: Choose GPT-4 or GPT-3.5-turbo
   - **Voice**: Choose a clear, accessible voice (recommend "Rachel" or "Sarah")
   - **System Prompt**: Use the one provided below
4. **Save Assistant**: Copy the Assistant ID

## Step 3: Update Environment Variables

Edit your `backend/.env` file:

```bash
# Voice Services
VAPI_API_KEY=vapi_your_actual_api_key_here
VAPI_BASE_URL=https://api.vapi.ai
VAPI_ASSISTANT_ID=your_assistant_id_here
```

## Step 4: Recommended Assistant Configuration

### System Prompt for Learning Mode:
```
You are an accessible learning assistant for Braillience, helping blind college students study flashcards through voice interaction.

LEARNING MODE INSTRUCTIONS:
1. Present flashcards one at a time in a conversational manner
2. Read the question/term clearly and wait for the student's response
3. Provide encouraging feedback whether correct or incorrect
4. If incorrect, provide hints and explanations
5. Ask if they want to continue to the next card
6. Track their progress and provide encouragement
7. Use clear, accessible language suitable for voice interaction
8. Speak at a moderate pace for accessibility
9. Always confirm understanding before moving on

VOICE INTERACTION GUIDELINES:
- Speak clearly and at a moderate pace
- Use conversational, encouraging tone
- Provide immediate feedback
- Ask clarifying questions if needed
- Be patient and supportive
- Use phrases like "That's correct!" or "Not quite, let me explain..."

Remember: This is for blind students, so focus on audio accessibility and clear communication.
```

### Voice Settings:
- **Provider**: ElevenLabs (recommended for clarity)
- **Voice**: Rachel or Sarah (clear, accessible voices)
- **Speed**: 0.9 (slightly slower for accessibility)
- **Stability**: 0.8
- **Clarity**: 0.8

### Call Settings:
- **Max Duration**: 30 minutes
- **Silence Timeout**: 10 seconds
- **Response Delay**: 1 second
- **Interruption Threshold**: 0.5

## Step 5: Test the Integration

1. **Restart your backend**:
   ```bash
   cd backend && npm start
   ```

2. **Test VAPI connection**:
   ```bash
   curl -X POST http://localhost:3001/api/voice-learning/test-vapi \
     -H "Content-Type: application/json" \
     -d '{"userId": "test-user"}'
   ```

3. **Start a voice learning session**:
   ```bash
   curl -X POST http://localhost:3001/api/voice-learning/start \
     -H "Content-Type: application/json" \
     -d '{"userId": "demo-user", "mode": "learning"}'
   ```

## Step 6: Frontend Integration

The frontend is already configured to work with VAPI. When you click "Voice Learning" in the dashboard, it will:

1. Fetch your flashcards from the database
2. Create a VAPI call with your assistant
3. Start a real voice conversation

## Troubleshooting

### Common Issues:

1. **"VAPI API key not configured"**:
   - Check your `.env` file has the correct `VAPI_API_KEY`
   - Restart the backend after updating environment variables

2. **"Assistant not found"**:
   - Verify your `VAPI_ASSISTANT_ID` is correct
   - Check the assistant exists in your VAPI dashboard

3. **Call fails to start**:
   - Check your VAPI account has sufficient credits
   - Verify the assistant configuration is correct

### Debug Mode:
The system will automatically fall back to mock calls if VAPI is not configured, so you can test the full flow even without real VAPI integration.

## Cost Considerations

- **VAPI**: Pay-per-minute for voice calls
- **ElevenLabs**: Pay-per-character for voice synthesis
- **OpenAI**: Pay-per-token for AI responses

For hackathon demos, the mock mode is perfect and costs nothing!

## Next Steps

1. Set up your VAPI account and get API keys
2. Create an assistant with the recommended configuration
3. Update your `.env` file with the real keys
4. Test the integration
5. Enjoy real voice-driven learning! 🎉

## Support

- VAPI Documentation: [docs.vapi.ai](https://docs.vapi.ai)
- VAPI Support: [support.vapi.ai](https://support.vapi.ai)
- ElevenLabs Voices: [elevenlabs.io](https://elevenlabs.io)
