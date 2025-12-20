# Complete Deployment Guide

## Overview

Your video-meet app has **two parts**:
1. **Frontend (React)** - Deploy to Netlify
2. **Backend Server (Node.js)** - Deploy to Railway, Render, or similar

**Yes, you DO need to host the server** because it handles:
- Creating meeting rooms
- Validating meeting IDs
- Socket.io signaling for WebRTC connections

---

## Part 1: Deploy Backend Server

### Option A: Railway (Recommended - Free tier available)

1. **Go to [Railway](https://railway.app) and sign up**

2. **Create a new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or upload the `server` folder)

3. **Configure the project:**
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Port: Railway will auto-detect (uses `process.env.PORT`)

4. **Get your server URL:**
   - After deployment, Railway gives you a URL like: `https://your-app.railway.app`
   - Copy this URL - you'll need it for the frontend

### Option B: Render (Free tier available)

1. **Go to [Render](https://render.com) and sign up**

2. **Create a new Web Service:**
   - Connect your GitHub repo
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment: Node

3. **Get your server URL:**
   - Render gives you a URL like: `https://your-app.onrender.com`

### Option C: Heroku (Paid, but reliable)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login and create app:**
   ```bash
   heroku login
   cd server
   heroku create your-app-name
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Build the Frontend Locally (Optional - to test)

```bash
cd stream
npm install
npm run build
```

The build output will be in `stream/dist/` folder.

### Step 2: Configure Environment Variable

**Important:** You need to set the server URL in Netlify.

#### Method 1: Via Netlify Dashboard (Recommended)

1. **Go to [Netlify](https://app.netlify.com)**

2. **After deploying, go to:**
   - Site settings → Environment variables

3. **Add new variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-server-url.railway.app` (your actual server URL)
   - Scope: All scopes

4. **Redeploy** your site after adding the environment variable

#### Method 2: Via netlify.toml (Alternative)

Edit `netlify.toml` in the root directory:

```toml
[build]
  publish = "stream/dist"
  command = "cd stream && npm install && npm run build"

[build.environment]
  VITE_API_URL = "https://your-server-url.railway.app"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Note:** This hardcodes the URL. Method 1 is better for flexibility.

### Step 3: Deploy to Netlify

#### Option A: Via Netlify Dashboard

1. **Go to [Netlify](https://app.netlify.com)**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect your Git repository** (GitHub, GitLab, or Bitbucket)

4. **Configure build settings:**
   - **Base directory:** Leave empty (or set to root)
   - **Build command:** `cd stream && npm install && npm run build`
   - **Publish directory:** `stream/dist`

5. **Add environment variable:**
   - Go to Site settings → Environment variables
   - Add `VITE_API_URL` = `https://your-server-url.railway.app`

6. **Click "Deploy site"**

#### Option B: Via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Navigate to project root:**
   ```bash
   cd stream
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

   Or for a draft deployment:
   ```bash
   netlify deploy
   ```

---

## Part 3: Update CORS on Server

Make sure your server allows requests from your Netlify domain.

In `server/server.js`, update CORS if needed:

```javascript
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://your-netlify-app.netlify.app",
      "https://your-custom-domain.com"
    ],
    methods: ["GET", "POST"]
  }
});
```

Or for development, you can keep `origin: "*"` but restrict it in production.

---

## Quick Checklist

- [ ] Backend server deployed (Railway/Render/Heroku)
- [ ] Server URL copied
- [ ] Frontend built successfully (`npm run build` in `stream` folder)
- [ ] `VITE_API_URL` environment variable set in Netlify
- [ ] Frontend deployed to Netlify
- [ ] `_redirects` file exists in `stream/public/` (already created)
- [ ] `netlify.toml` exists in root (already created)
- [ ] Test the deployed site - create a meeting and verify it works

---

## Testing Locally with Production Server

To test your frontend locally but use the production server:

1. **Create `stream/.env.local`:**
   ```
   VITE_API_URL=https://your-server-url.railway.app
   ```

2. **Run dev server:**
   ```bash
   cd stream
   npm run dev
   ```

---

## Troubleshooting

### Frontend can't connect to server
- Check `VITE_API_URL` is set correctly in Netlify
- Verify server is running and accessible
- Check browser console for CORS errors

### 404 errors on routes
- Verify `_redirects` file is in `stream/public/` folder
- Check `netlify.toml` redirects are correct

### Server not responding
- Check server logs on Railway/Render dashboard
- Verify server is running (not sleeping on free tier)
- Check server URL is correct

### Build fails
- Check all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Netlify dashboard

---

## Cost Estimate

- **Netlify:** Free tier (100GB bandwidth/month)
- **Railway:** Free tier ($5 credit/month) or $5/month
- **Render:** Free tier (spins down after inactivity) or $7/month

**Total:** Can be completely free for small projects!

---

## Summary

1. **Deploy server first** → Get server URL
2. **Set `VITE_API_URL` in Netlify** → Point to your server
3. **Deploy frontend to Netlify** → Your app is live!

The server is essential - it handles meeting creation and WebRTC signaling. Without it, users can't create or join meetings.

