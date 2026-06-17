# Deployment Guide

## Option 1: GitHub + Firebase (Recommended)

### Step 1: Create GitHub Repository
```bash
cd "C:\Users\RASHED~1\AppData\Local\Temp\opencode\signify-ahon"
git init
git add .
git commit -m "Initial commit - SIGNIFY BY AHON e-commerce"
```

Create a repo on GitHub (https://github.com/new), then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/signify-by-ahon.git
git branch -M main
git push -u origin main
```

### Step 2: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Step 3: Deploy Frontend to Firebase Hosting
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Step 4: Deploy Backend
For the backend, you have 3 options:

**A) Firebase Cloud Functions** (serverless):
- Move backend code to `functions/` folder
- Deploy with `firebase deploy --only functions`

**B) VPS/Railway/Render** (recommended for full control):
- Push to GitHub
- Connect to Railway (railway.app) or Render (render.com)
- Set environment variables in dashboard

**C) MongoDB Atlas + Vercel**:
- Create free MongoDB Atlas cluster
- Create free Vercel account
- Connect GitHub repo to Vercel
- Set env vars in Vercel dashboard

### Environment Variables (Backend .env)
```
PORT=5000
MONGODB_URI=mongodb+srv://... (MongoDB Atlas or local)
JWT_SECRET=your_random_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary (for image uploads)
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_key (for payments)
FRONTEND_URL=https://yourdomain.com
```

## Option 2: All-in-One VPS (DigitalOcean, Linode)
```bash
# Install Node.js, MongoDB, PM2
npm install -g pm2
cd backend && pm2 start server.js --name signify-api
cd frontend && npm run build
# Serve frontend/out with Nginx
```

## Update .env for Production
Edit `frontend/next.config.js` - change the rewrite destination:
```js
{ source: '/api/:path*', destination: 'https://your-api.com/api/:path*' }
```

## For Image Uploads in Production
Replace local uploads with Cloudinary:
1. Sign up at cloudinary.com (free)
2. Add Cloudinary URL to `.env`
3. The backend already has Cloudinary config in `routes/upload.js`
