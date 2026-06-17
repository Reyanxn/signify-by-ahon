# Deploy to Vercel (Frontend) + Railway (Backend)

## Step 1: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click **"Add New" → "Project"**
3. Import the GitHub repo: `Reyanxn/signify-by-ahon`
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **"Deploy"**

Vercel will build and deploy the frontend automatically.

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Click **"New Project" → "Deploy from GitHub repo"**
3. Select `Reyanxn/signify-by-ahon`
4. Set root directory to `backend/`
5. Add these environment variables:
   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://...` (get free from https://mongodb.com/atlas)
   - `JWT_SECRET=your_random_secret`
   - `FRONTEND_URL=https://your-app.vercel.app`
6. Railway will give you a URL like `https://signify-backend.up.railway.app`

## Step 3: Connect Frontend to Backend

Update the API proxy URL. You have two options:

**Option A**: Update `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://your-backend.up.railway.app/api/:path*" }
  ]
}
```

**Option B**: Update `frontend/src/lib/api.js` to use the direct backend URL.

## Step 4: Set Vercel Environment Variables

In Vercel dashboard → Project Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` = your Railway backend URL

## Alternative: Deploy Everything on Vercel

You can also deploy the backend as a Vercel Serverless Function:

1. In Vercel project, go to Settings → Functions
2. The `backend/` already has Express routes
3. Vercel will detect `api/` routes automatically

---

**Your repo is ready**: https://github.com/Reyanxn/signify-by-ahon
