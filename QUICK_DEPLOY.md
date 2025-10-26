# 🚀 Quick Deploy Guide

## Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED

### Step 1: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: braillience-frontend
# - Directory: ./
# - Override settings? N
```

### Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Braillience repository
5. Add environment variables:
   ```
   LETTA_API_KEY=your_letta_key
   VAPI_API_KEY=your_vapi_key
   VAPI_ASSISTANT_ID=your_assistant_id
   VAPI_PHONE_NUMBER_ID=your_phone_id
   USE_REAL_VAPI=true
   ```

### Step 3: Connect Frontend to Backend

1. Get your Railway backend URL (e.g., `https://braillience-backend.railway.app`)
2. In Vercel dashboard, go to your project settings
3. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app
   ```
4. Redeploy frontend

## Option 2: One-Click Deploy (Railway Full Stack)

1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy!

## Option 3: Render (Full Stack)

1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Set:
   - Build Command: `cd frontend && npm run build`
   - Start Command: `cd backend && node src/server.js`
   - Publish Directory: `frontend/build`
5. Add environment variables
6. Deploy!

## Environment Variables Needed

### Backend
```
LETTA_API_KEY=your_letta_api_key
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=your_vapi_assistant_id
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id
USE_REAL_VAPI=true
```

### Frontend
```
REACT_APP_API_URL=https://your-backend-url.com
```

## Quick Test

```bash
# Test locally first
cd frontend
npm run build
npx serve -s build -l 3000

# In another terminal
cd backend
npm start
```

## Cost

- **Vercel**: Free tier (100GB bandwidth)
- **Railway**: Free tier ($5 credit)
- **Render**: Free tier (750 hours/month)

## Need Help?

1. Check `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Check platform documentation
3. Test locally first with `npm run build`

---

**Ready to deploy?** Choose an option above and follow the steps! 🚀
