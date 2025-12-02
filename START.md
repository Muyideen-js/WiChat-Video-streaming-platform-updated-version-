# Starting the Application

## Quick Start

You need **TWO terminal windows** running:

### Terminal 1 - Backend Server (with nodemon)
```bash
cd server
npm run dev
```
✅ Server will run on `http://localhost:3001` and auto-restart on file changes

### Terminal 2 - Frontend Client
```bash
cd stream
npm run dev
```
✅ Frontend will run on `http://localhost:5173`

## Troubleshooting

**If Vite seems stuck:**
- Wait a few seconds - Vite might be compiling
- Check if port 5173 is already in use
- Try `Ctrl+C` to stop and run `npm run dev` again
- Check the terminal for any error messages

**If you see connection errors:**
- Make sure the backend server is running first
- Check that both are running on correct ports:
  - Backend: `http://localhost:3001`
  - Frontend: `http://localhost:5173`

**Nodemon not restarting?**
- Make sure you're using `npm run dev` (not `npm start`)
- Check `server/nodemon.json` is present

## Expected Output

**Backend should show:**
```
Server running on port 3001
[nodemon] watching...
```

**Frontend should show:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---
Once both are running, open `http://localhost:5173` in your browser!

