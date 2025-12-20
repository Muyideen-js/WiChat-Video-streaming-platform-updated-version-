# Quick Fix: Railway "No start command found"

## The Problem
Railway can't find your start command because it's looking in the wrong directory.

## The Fix (3 Steps)

### 1. Set Root Directory in Railway
- Go to your Railway service → **Settings** tab
- Find **"Root Directory"**
- Set it to: `server`
- **Save**

### 2. Files Already Created
I've added these files to help Railway:
- `server/index.js` ✅
- `server/nixpacks.toml` ✅  
- `server/railway.json` ✅

### 3. Redeploy
- Push your code or click **"Redeploy"** in Railway
- It should work now!

## Still Not Working?

**Option A: Manual Start Command**
1. Go to Railway → Settings → **Variables**
2. Add: `NIXPACKS_START_CMD` = `node server.js`

**Option B: Use Render Instead**
Render handles subdirectories better:
1. Go to [Render.com](https://render.com)
2. New Web Service
3. Root Directory: `server`
4. Build: `npm install`
5. Start: `npm start`

## Verify Your Setup

Your `server` folder should have:
```
server/
  ├── package.json (with "start": "node server.js")
  ├── server.js
  ├── index.js (new)
  ├── nixpacks.toml (new)
  └── railway.json (new)
```

