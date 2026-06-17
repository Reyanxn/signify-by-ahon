# Deployed on Vercel

## ✅ Already Deployed

| Project | URL | Status |
|---------|-----|--------|
| **Frontend** | https://frontend-silk-phi-74.vercel.app | LIVE |
| **Backend API** | https://signify-by-ahon-api.vercel.app | Needs MongoDB |

## Step 1: Get MongoDB Atlas (Free)

1. Go to https://mongodb.com/atlas → **Try Free** (no credit card)
2. Create a free **M0 cluster** (choose AWS, any region)
3. Create a database user (username + password) — save these
4. Under **Network Access**, add `0.0.0.0/0` (allow all — required for Vercel)
5. Click **Connect → Drivers** → copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster.xxxxx.mongodb.net/signify-ahon
   ```
   Replace `<user>` and `<password>` with your database user credentials.

## Step 2: Add MongoDB URI to Backend on Vercel

1. Go to: https://vercel.com/reyanxns-projects/signify-by-ahon-api/settings/environment-variables
2. Add:
   - **Name**: `MONGODB_URI`
   - **Value**: your MongoDB Atlas connection string
   - **Environment**: Production
3. Click **Save**

## Step 3: Redeploy Backend

1. Go to: https://vercel.com/reyanxns-projects/signify-by-ahon-api/deployments
2. Find the latest deployment → click **"..."** → **Redeploy**

## Step 4: Done!

Visit https://frontend-silk-phi-74.vercel.app — the site will load and fetch data from the API.

## Admin Login

- **Email**: admin@signifyahon.com
- **Password**: admin123

The database auto-seeds with 12 products, 7 categories, 4 banners on first connection.

## Optional: Custom Domain

1. Go to frontend project settings → **Domains**
2. Add your custom domain (e.g., signifyahon.com)
3. Update the DNS records as instructed by Vercel
