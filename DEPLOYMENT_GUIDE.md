# 🚀 Braillience Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - Frontend Only)

**For Frontend:**
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

**For Backend (Separate):**
- Use Railway, Render, or Heroku for the backend
- Update frontend API URLs to point to backend URL

### Option 2: Railway (Full Stack - Recommended)

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   ```
   LETTA_API_KEY=your_letta_key
   VAPI_API_KEY=your_vapi_key
   VAPI_ASSISTANT_ID=your_assistant_id
   VAPI_PHONE_NUMBER_ID=your_phone_id
   USE_REAL_VAPI=true
   ```
4. Deploy both frontend and backend

### Option 3: Render (Full Stack)

**Steps:**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `cd frontend && npm run build`
5. Set start command: `cd backend && node src/server.js`
6. Add environment variables

### Option 4: Netlify + Railway (Hybrid)

**Frontend (Netlify):**
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/build`

**Backend (Railway):**
1. Deploy backend to Railway
2. Update frontend API URLs

## Environment Variables Needed

### Backend (.env)
```
LETTA_API_KEY=your_letta_api_key
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=your_vapi_assistant_id
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id
USE_REAL_VAPI=true
PORT=3001
```

### Frontend (Environment Variables)
```
REACT_APP_API_URL=https://your-backend-url.com
```

## Pre-Deployment Checklist

### 1. Update API URLs
Update frontend to use production backend URL:

```javascript
// In frontend/src/components/Upload.js and other components
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

### 2. Build Frontend
```bash
cd frontend
npm run build
```

### 3. Test Production Build
```bash
cd frontend
npx serve -s build -l 3000
```

### 4. Database Setup
- SQLite file will be created automatically
- For production, consider PostgreSQL

## Quick Start Commands

### Local Production Test
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run build
npx serve -s build -l 3000
```

### Deploy to Vercel (Frontend Only)
```bash
cd frontend
vercel --prod
```

### Deploy to Railway (Full Stack)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## Domain Setup

### Custom Domain on Railway
1. **Buy domain** from Namecheap, GoDaddy, Cloudflare, etc.
2. **Add domain to Railway**:
   - Go to Railway dashboard → Settings → Domains
   - Click "Custom Domain"
   - Enter your domain (e.g., `braillience.com`)
3. **Update DNS records** at your domain provider:
   ```
   Type: CNAME
   Name: @ (or subdomain like app)
   Value: [your-railway-app].railway.app
   TTL: 300
   ```
4. **SSL certificate** is automatically provisioned by Railway
5. **Add environment variable** in Railway:
   ```
   REACT_APP_API_URL=https://your-custom-domain.com
   ```

### Subdomain Examples
- `braillience.vercel.app` (Vercel)
- `braillience.railway.app` (Railway)
- `braillience.netlify.app` (Netlify)
- `braillience.com` (Custom domain)
- `app.braillience.com` (Custom subdomain)

## Monitoring & Analytics

### Add Analytics
```bash
# Google Analytics
npm install gtag

# Add to frontend/src/index.js
import { gtag } from 'gtag';
```

### Error Monitoring
```bash
# Sentry
npm install @sentry/react @sentry/tracing
```

## Security Checklist

- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation

## Troubleshooting

### Common Issues
1. **CORS errors**: Update backend CORS settings
2. **API not found**: Check API URL configuration
3. **Build fails**: Check Node.js version compatibility
4. **Database errors**: Verify database connection

### Debug Commands
```bash
# Check build
npm run build

# Test API
curl https://your-api-url.com/api/test

# Check logs
railway logs
vercel logs
```

## Cost Estimates

### Vercel (Frontend)
- Free tier: 100GB bandwidth
- Pro: $20/month

### Railway (Backend)
- Free tier: $5 credit
- Pro: $5/month per service

### Render (Full Stack)
- Free tier: 750 hours/month
- Starter: $7/month

## Recommended Setup

**For MVP/Testing:**
- Frontend: Vercel (Free)
- Backend: Railway (Free tier)

**For Production:**
- Frontend: Vercel Pro
- Backend: Railway Pro
- Database: Railway PostgreSQL
- CDN: Cloudflare (Free)

## Next Steps

1. Choose deployment option
2. Set up environment variables
3. Deploy backend first
4. Deploy frontend
5. Test all functionality
6. Set up custom domain
7. Add monitoring
8. Configure SSL

---

**Need help?** Check the platform-specific documentation or contact support.
