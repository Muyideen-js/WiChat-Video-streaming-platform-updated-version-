# Netlify Deployment Guide

## Quick Setup Steps

### 1. Build Your Project Locally (Optional - to test)
```bash
cd stream
npm install
npm run build
```

The build output will be in `stream/dist/` folder.

### 2. Deploy to Netlify

#### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Go to [Netlify](https://app.netlify.com) and sign in**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect your Git repository** (GitHub, GitLab, or Bitbucket)

4. **Configure build settings:**
   - **Base directory:** Leave empty (or set to root)
   - **Build command:** `cd stream && npm install && npm run build`
   - **Publish directory:** `stream/dist`

5. **Click "Deploy site"**

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Navigate to your project root:**
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

## Important Files Created

1. **`netlify.toml`** - Netlify configuration file (in root directory)
   - Sets build command and publish directory
   - Configures redirects for SPA routing

2. **`stream/public/_redirects`** - Netlify redirects file
   - Ensures all routes redirect to `index.html` (SPA routing)
   - Prevents "404 - Page Not Found" errors on Netlify

3. **BackToTop Component** - Added to bottom right corner
   - Appears when user scrolls down 300px
   - Smooth scroll animation to top

## How It Works

- The `_redirects` file tells Netlify to serve `index.html` for all routes, allowing React Router to handle routing client-side
- The `netlify.toml` file configures the build process and ensures redirects are properly set up
- This prevents the "Cannot find route" error you were experiencing

## Environment Variables (if needed)

If you need to set environment variables:
1. Go to Site settings → Environment variables
2. Add any required variables (e.g., API keys, Firebase config)

## Custom Domain

After deployment:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow Netlify's DNS instructions

## Troubleshooting

- **404 errors on routes:** Make sure `_redirects` file is in `stream/public/` folder
- **Build fails:** Check that all dependencies are in `package.json`
- **Routes not working:** Verify `netlify.toml` redirects are correct

