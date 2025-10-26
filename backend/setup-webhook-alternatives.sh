#!/bin/bash

echo "🚀 Webhook Setup Alternatives"
echo "============================="

echo ""
echo "📋 Choose your preferred method:"
echo ""
echo "1. localtunnel (npx - no installation)"
echo "2. serveo (ssh tunnel)"
echo "3. cloudflared (Cloudflare tunnel)"
echo "4. Use local IP (limited)"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🌐 Starting localtunnel..."
        echo "Your webhook URL will be: https://braillience-webhook.loca.lt/api/vapi-webhook/vapi-webhook"
        echo "Press Ctrl+C to stop"
        npx localtunnel --port 3001 --subdomain braillience-webhook
        ;;
    2)
        echo "🌐 Starting serveo tunnel..."
        echo "Your webhook URL will be: https://[random].serveo.net/api/vapi-webhook/vapi-webhook"
        echo "Press Ctrl+C to stop"
        ssh -R 80:localhost:3001 serveo.net
        ;;
    3)
        echo "🌐 Starting cloudflared tunnel..."
        echo "Your webhook URL will be: https://[random].trycloudflare.com/api/vapi-webhook/vapi-webhook"
        echo "Press Ctrl+C to stop"
        cloudflared tunnel --url http://localhost:3001
        ;;
    4)
        echo "🌐 Using local IP..."
        echo "Your webhook URL will be: http://10.72.5.79:3001/api/vapi-webhook/vapi-webhook"
        echo "⚠️  Note: This only works if VAPI can reach your local network"
        echo "Press Ctrl+C to stop"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Webhook setup complete!"
echo "Now configure VAPI webhook with your URL above."
