# Deployment Guide

## Backend
1. Set environment variable:
   ```bash
   export GEMINI_API_KEY=your_actual_api_key_here
   ```
2. Run:
   ```bash
   cd backend
   npm install
   npm start
   ```

## Frontend
1. Deploy `frontend/` on Vercel/Netlify.
2. Make sure `/api/*` requests are proxied to your backend URL.

Now your chatbot will connect to Gemini using your API key.
