# Stream Token Authentication Fix

## Issue
The error "JWTAuth error: signature is not valid" means the JWT token signature doesn't match what Stream expects.

## Solution Applied
1. Updated token generation to include `iat` (issued at) timestamp
2. Verified token format matches Stream's requirements

## Important: Restart Your Backend Server!

After updating the token generation code, you **MUST** restart your backend server:

```bash
cd server
# Stop the current server (Ctrl+C)
npm run dev
```

## Verification Steps

1. **Check Backend Logs**: When you request a token, you should see:
   ```
   Generated token for user: [userId] ([userName])
   Token preview: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Test Token Endpoint**: 
   ```bash
   curl -X POST http://localhost:3001/api/stream/token \
     -H "Content-Type: application/json" \
     -d '{"userId":"test123","userName":"Test User"}'
   ```

3. **Verify Secret**: Make sure the secret in `server/streamToken.js` matches your Stream dashboard:  
   - Go to https://getstream.io/dashboard
   - Select your app
   - Check the API Secret matches: `a26sgpcrejaur3vvuetzntnvgtvvtjkvhz34qfp4f4grp6ccdwbahbfx5y5k9aay`

## If Still Not Working

1. **Double-check API Secret**: 
   - Go to Stream dashboard
   - Click on your app
   - Go to "Keys" section
   - Verify the API Secret is exactly: `a26sgpcrejaur3vvuetzntnvgtvvtjkvhz34qfp4f4grp6ccdwbahbfx5y5k9aay`
   - Make sure there are no extra spaces or characters

2. **Verify API Key matches**:
   - API Key should be: `jx3vsau9qzp3`
   - This must match the key in `stream/src/config/streamConfig.js`

3. **Check Server is Running**:
   - Backend must be running on port 3001
   - Check: http://localhost:3001/api/stream/token (should return error without POST data, but should be reachable)

4. **Clear Browser Cache**: Sometimes cached tokens cause issues

## Token Format
The token now includes:
- `user_id`: The user's unique ID
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (1 hour from now)

This matches Stream's JWT requirements.

