# Deploy to Vercel (Frontend + Backend together)

This project is configured to deploy **both the frontend and backend** on Vercel in a single project.

## Step 1: Get MongoDB Atlas (Free Database)

1. Go to https://mongodb.com/atlas → Sign up
2. Create a **free M0 cluster**
3. Click **"Connect" → "Drivers"**
4. Copy the connection string: `mongodb+srv://<user>:<password>@cluster.xxxxx.mongodb.net/signify-ahon`
5. Replace `<user>` and `<password>` with your database user credentials

## Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Click **"Add New" → "Project"**
3. Import the GitHub repo: `Reyanxn/signify-by-ahon`
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **"Deploy"** (build will fail initially — that's expected)

## Step 3: Add Environment Variables

In your Vercel project dashboard → **Settings** → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A random string (e.g., `mySuperSecretKey123!@#`) |
| `JWT_EXPIRES_IN` | `30d` |

Then go to **Deployments**, find the failed deployment, click **"Redeploy"**.

## Step 4: Done!

- Your site: `https://signify-by-ahon.vercel.app`
- Admin login: **admin@signifyahon.com** / **admin123**
- First deployment auto-seeds sample data (12 products, 7 categories, 4 banners)

## File Uploads (Optional)

For image uploads to work in the admin panel, set up Cloudinary:

1. Free account at https://cloudinary.com
2. Add these env vars on Vercel:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

Without Cloudinary, uploads return base64 data URLs (functional but less efficient).

---

**Your repo is ready**: https://github.com/Reyanxn/signify-by-ahon
