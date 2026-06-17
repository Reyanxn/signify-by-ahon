# SIGNIFY BY AHON - E-Commerce Platform

## Quick Start (2 terminals needed)

### Terminal 1 - Start Backend
```powershell
cd "C:\Users\RASHED~1\AppData\Local\Temp\opencode\signify-ahon\backend"
npm run dev
```

### Terminal 2 - Start Frontend
```powershell
cd "C:\Users\RASHED~1\AppData\Local\Temp\opencode\signify-ahon\frontend"
npm run dev
```

## Access
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:5000

## Default Accounts
| Role     | Email                     | Password   |
|----------|---------------------------|------------|
| Admin    | admin@signifyahon.com     | admin123   |
| Customer | customer@signifyahon.com  | customer123|

## Features
- Product catalog with category, fabric, price filters
- Product detail with sizes, stitching options, quantity
- Shopping cart with guest support
- Checkout with address form (BDT currency)
- User authentication (login/register)
- Admin dashboard with stats
- Product management (CRUD with image upload)
- Category management
- Order management with status updates
- Banner management
- User management
- Site settings (shipping, contact, social links)
- Newsletter signup

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Swiper, React Hot Toast
- **Backend**: Express.js, MongoDB (in-memory for dev), JWT auth
- **Currency**: BDT (Bangladeshi Taka)
- **Brand**: SIGNIFY BY AHON
- **Developer**: MESO Business Solutions TEAM

## Deployment
See `DEPLOY.md` for GitHub + Firebase deployment instructions.
