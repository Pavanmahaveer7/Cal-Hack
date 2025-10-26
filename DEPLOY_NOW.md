# 🚀 Deploy Braillience NOW!

## Method 1: Railway (Easiest - Full Stack)

### Step 1: Prepare Your Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Braillience repository
5. Railway will automatically detect it's a Node.js app

### Step 3: Add Environment Variables
In Railway dashboard, go to your project → Variables tab:

```
LETTA_API_KEY=your_letta_api_key_here
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id_here
USE_REAL_VAPI=true
NODE_ENV=production
```

### Step 4: Deploy!
Railway will automatically:
- Install dependencies
- Run the build script
- Start the server
- Give you a live URL!

---

## Method 2: Render (Alternative)

### Step 1: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository

### Step 2: Configure Settings
- **Build Command**: `./build.sh`
- **Start Command**: `cd backend && node src/server.js`
- **Environment**: Node

### Step 3: Add Environment Variables
Same as Railway above.

---

## Method 3: Vercel + Railway (Separate)

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel

# Add environment variable in Vercel dashboard:
# REACT_APP_API_URL=https://your-railway-backend-url.railway.app
```

### Backend (Railway)
Follow Method 1 steps 2-4 above.

---

## Quick Deploy Commands

### Test Locally First
```bash
# Build and test locally
./build.sh

# Start the server
cd backend && node src/server.js

# Visit http://localhost:3001
```

### Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

## Environment Variables You Need

### Get Your API Keys:

**Letta API Key:**
1. Go to [app.letta.com](https://app.letta.com)
2. Sign up/login
3. Go to Settings → API Keys
4. Copy your API key

**VAPI API Key:**
1. Go to [vapi.ai](https://vapi.ai)
2. Sign up/login
3. Go to Dashboard → API Keys
4. Copy your API key

**VAPI Assistant ID:**
1. In VAPI dashboard, create an assistant
2. Copy the assistant ID

**VAPI Phone Number ID:**
1. In VAPI dashboard, go to Phone Numbers
2. Add a phone number
3. Copy the phone number ID

---

## After Deployment

### Test Your App
1. Visit your deployed URL
2. Try uploading a PDF
3. Test the AI Teacher call feature
4. Check if everything works

### Custom Domain (Optional)
1. Buy a domain from Namecheap/GoDaddy
2. In Railway/Render, add custom domain
3. Update DNS records
4. SSL certificate will be auto-generated

---

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version (use 18+)
2. **API errors**: Verify environment variables
3. **CORS errors**: Check CORS settings in server.js
4. **Database errors**: SQLite will be created automatically

### Debug Commands:
```bash
# Check build
npm run build

# Test API
curl https://your-app-url.com/api/test

# Check logs in Railway/Render dashboard
```

---

## Cost
- **Railway**: Free tier ($5 credit)
- **Render**: Free tier (750 hours/month)
- **Vercel**: Free tier (100GB bandwidth)

---

## Ready to Deploy?

**Choose Method 1 (Railway)** - it's the easiest!

1. Push your code to GitHub
2. Go to railway.app
3. Deploy from GitHub
4. Add environment variables
5. Done! 🎉

Your app will be live at: `https://your-app-name.railway.app`
