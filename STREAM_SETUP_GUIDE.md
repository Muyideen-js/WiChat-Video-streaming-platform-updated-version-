# Complete Stream API Setup Guide

## Step 1: Create Your Stream Account

1. Go to https://getstream.io
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with your email or GitHub account

## Step 2: Create a New App

After logging in, you'll see the app creation form. Here's how to fill it out:

### App Creation Form Settings:

**App Name:**
- Enter: `VideoMeet` (or any name you prefer)
- ⚠️ **Note:** This cannot be changed later, but it's just for your reference

**Chat & Video Data Storage Location:**
- Choose: **US East** (or closest to your users)
- ⚠️ **Note:** This cannot be changed later
- For most users, US East is fine unless you're in Europe/Asia

**Feeds Data Storage Location:**
- Choose: **US Ohio** (or same as above)
- This is for the Feeds feature (we're using Video, but this is required)

**Environment:**
- Choose: **Development** (for now)
- You can create a Production app later when ready to launch
- Development apps are free and perfect for testing

**Click "Create App"**

## Step 3: Get Your API Credentials

After creating the app, you'll be taken to your app dashboard:

1. **Find your API Key:**
   - Look for a section labeled **"API Key"** or **"Keys"**
   - Copy the **API Key** (it looks like: `abc123def456`)

2. **Find your API Secret:**
   - In the same section, you'll see **"API Secret"**
   - Click **"Show"** or **"Reveal"** to see it
   - Copy the **API Secret** (it's longer, like: `abc123def456ghi789jkl012mno345pqr678`)

## Step 4: Configure Your Project

### Frontend Configuration

1. Open `stream/src/config/streamConfig.js`
2. Replace `YOUR_STREAM_API_KEY` with your actual API Key:

```javascript
export const STREAM_API_KEY = 'your_actual_api_key_here';
```

### Backend Configuration

1. Open `server/streamToken.js`
2. Replace `YOUR_STREAM_API_SECRET` with your actual API Secret:

```javascript
const STREAM_API_SECRET = 'your_actual_api_secret_here';
```

**⚠️ IMPORTANT:** Never commit your API Secret to Git! Consider using environment variables.

## Step 5: Using Environment Variables (Recommended)

### Frontend (.env file)

Create a file `stream/.env`:

```env
VITE_STREAM_API_KEY=your_api_key_here
```

Then update `stream/src/config/streamConfig.js`:

```javascript
export const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY || 'YOUR_STREAM_API_KEY';
```

### Backend (.env file)

Create a file `server/.env`:

```env
STREAM_API_SECRET=your_api_secret_here
```

Then update `server/streamToken.js`:

```javascript
const STREAM_API_SECRET = process.env.STREAM_API_SECRET || 'YOUR_STREAM_API_SECRET';
```

## Step 6: Install Dependencies

### Backend
```bash
cd server
npm install jsonwebtoken
```

### Frontend
```bash
cd stream
npm install
```

## Step 7: Test Your Setup

1. Start the backend:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd stream
   npm run dev
   ```

3. Open http://localhost:5173
4. Create a meeting and test!

## Troubleshooting

### "Invalid API Key" Error
- Double-check you copied the API Key correctly
- Make sure there are no extra spaces

### "Invalid Token" Error
- Verify your API Secret is correct
- Check that the backend is running
- Make sure the token endpoint is working

### "Permission Denied" Error
- Make sure you're using the correct API Secret
- Check that your app is in Development mode (not disabled)

## Stream Dashboard Features

Once your app is created, you can:
- **Monitor Usage:** See how many minutes you've used
- **View Logs:** Check for any errors
- **Manage Users:** See who's using your app
- **Settings:** Configure additional features

## Free Tier Limits

- **66,000 minutes/month** of HD video
- Perfect for development and small-scale testing
- Upgrade when you need more

## Next Steps

1. ✅ Create Stream account
2. ✅ Create app with settings above
3. ✅ Copy API Key and Secret
4. ✅ Update config files
5. ✅ Test the application

## Need Help?

- Stream Documentation: https://getstream.io/video/docs/
- Support: support@getstream.io
- Community: https://getstream.io/community

---

**Remember:** Keep your API Secret secure! Never share it publicly or commit it to version control.

