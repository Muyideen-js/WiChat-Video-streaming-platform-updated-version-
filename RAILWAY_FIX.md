# Fix Railway Build Error

## Problem
You're seeing: "No start command was found" or "Error creating build plan with Railpack"

## Solution

### Step 1: Set Root Directory in Railway (CRITICAL)

1. **Go to your Railway project dashboard**
2. **Click on your service** (the one that's failing)
3. **Go to the "Settings" tab**
4. **Scroll down to "Root Directory"**
5. **Enter:** `server` (exactly this, no trailing slash)
6. **Click "Save"**

### Step 2: Verify Files Are Created

I've created these files for you:
- ✅ `server/index.js` - Fallback entry point
- ✅ `server/nixpacks.toml` - Explicit start command configuration
- ✅ `server/railway.json` - Railway configuration

### Step 3: Commit and Push Changes

If you haven't already, commit the new files:
```bash
git add server/index.js server/nixpacks.toml server/railway.json
git commit -m "Add Railway deployment configuration"
git push
```

### Step 4: Redeploy

1. **Go to Railway dashboard → "Deployments" tab**
2. **Click "Redeploy"** (or Railway will auto-deploy after git push)
3. **Watch the build logs** - it should now find the start command

### Step 5: Verify Build

The build should now show:
- ✅ Detected Node
- ✅ Using npm package manager
- ✅ Running: `npm install`
- ✅ Starting: `node server.js`

### Alternative: Deploy Server Folder Only

If the above doesn't work, you can:

1. **Create a separate GitHub repo** with just the `server` folder contents
2. **Deploy that repo to Railway** (no root directory needed)
3. **Use that server URL** for your frontend

### Quick Check

Run this in your terminal to verify server structure:
```bash
cd server
ls -la
```

You should see:
- package.json
- server.js
- streamToken.js
- zegoToken.js

### Still Having Issues?

1. **Check Railway logs** - Look for specific error messages
2. **Verify Node.js version** - Add `NODE_VERSION=18` in Railway Variables
3. **Try Render instead** - Sometimes Render is easier for subdirectory deployments

