#!/bin/bash

echo "🚀 Setting up VAPI Webhook for Real Call Capture"
echo "================================================"

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "📦 Installing ngrok..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install ngrok/ngrok/ngrok
    else
        # Linux
        curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
        echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
        sudo apt update && sudo apt install ngrok
    fi
else
    echo "✅ ngrok is already installed"
fi

echo ""
echo "🌐 Starting ngrok tunnel..."
echo "This will expose your local server to the internet"
echo ""

# Start ngrok in background
ngrok http 3001 --log=stdout > ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 3

# Get the public URL
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

if [ "$PUBLIC_URL" != "null" ] && [ "$PUBLIC_URL" != "" ]; then
    echo "✅ ngrok tunnel started successfully!"
    echo "🌐 Public URL: $PUBLIC_URL"
    echo ""
    echo "📝 Your VAPI webhook URL is:"
    echo "   $PUBLIC_URL/api/vapi-webhook/vapi-webhook"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Go to https://dashboard.vapi.ai"
    echo "2. Go to 'Webhooks' section"
    echo "3. Add new webhook with URL: $PUBLIC_URL/api/vapi-webhook/vapi-webhook"
    echo "4. Select events: 'Call Ended' and 'Message'"
    echo "5. Make a real phone call using VAPI Teacher"
    echo "6. Check your Letta dashboard for real conversation data!"
    echo ""
    echo "🛑 To stop ngrok, run: kill $NGROK_PID"
    echo "📋 To see ngrok logs: tail -f ngrok.log"
else
    echo "❌ Failed to start ngrok tunnel"
    echo "Check if port 4040 is available and try again"
fi

echo ""
echo "🎉 Webhook setup complete!"
echo "Now your real phone calls will be captured and stored in Letta!"
