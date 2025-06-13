# 🚀 H1BConnect Production Deployment Guide

## 📋 Pre-Deployment Checklist

- [x] ✅ **Backend build successful** (`server/dist/` created)
- [x] ✅ **Frontend build successful** (`client/dist/` created)
- [x] ✅ **All API endpoints tested** and working
- [x] ✅ **Production configuration files** created
- [x] ✅ **Environment variables** documented

## 🎯 Deployment Options

### Option 1: Railway (Recommended) 🚂

**Why Railway?**
- Automatic deployments from Git
- Built-in PostgreSQL database
- Environment variable management
- Zero-config deployment
- Excellent for full-stack apps

#### Step 1: Setup Railway Project

1. **Create Railway Account**: [railway.app](https://railway.app)
2. **Connect GitHub Repository**:
   ```bash
   railway login
   railway link
   ```

#### Step 2: Deploy Backend

1. **Create Backend Service**:
   - Source: `./server` directory
   - Build Command: `npm run build`
   - Start Command: `npm start`

2. **Set Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secure-jwt-secret-here
   FRONTEND_URL=https://your-frontend-domain.railway.app
   
   # Database (Auto-provided by Railway)
   DATABASE_URL=${{ Railway.DATABASE_URL }}
   DATABASE_PUBLIC_URL=${{ Railway.DATABASE_PUBLIC_URL }}
   
   # Optional: Email, Stripe, AWS configs
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   STRIPE_SECRET_KEY=sk_live_...
   ```

#### Step 3: Deploy Frontend

1. **Create Frontend Service**:
   - Source: `./client` directory  
   - Build Command: `npm run build`
   - Start Command: `npm run preview`

2. **Set Environment Variables**:
   ```env
   NODE_ENV=production
   VITE_API_URL=https://your-backend-domain.railway.app/api
   VITE_APP_NAME=H1BConnect
   VITE_APP_VERSION=1.0.0
   ```

#### Step 4: Deploy Database

1. **Add PostgreSQL Service**:
   ```bash
   railway add postgresql
   ```
   
2. **Database URLs will be auto-generated**:
   - Internal: `postgresql://...@postgres.railway.internal:5432/railway`
   - Public: `postgresql://...@mainline.proxy.rlwy.net:PORT/railway`

### Option 2: Vercel + Railway 🔗

**Frontend on Vercel, Backend on Railway**

#### Deploy Backend to Railway (Same as above)

#### Deploy Frontend to Vercel:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd client
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   ```env
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_APP_NAME=H1BConnect
   VITE_APP_VERSION=1.0.0
   ```

### Option 3: Heroku + Vercel 🟪

#### Deploy Backend to Heroku:

1. **Create Heroku App**:
   ```bash
   heroku create h1bconnect-backend
   ```

2. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Deploy**:
   ```bash
   git subtree push --prefix=server heroku main
   ```

## 🔧 Environment Variables Setup

### Backend Environment Variables

```env
# Required
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-secret
FRONTEND_URL=https://your-frontend-domain.com

# Database (provided by hosting service)
DATABASE_URL=postgresql://...
DATABASE_PUBLIC_URL=postgresql://...

# Optional: Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@h1bconnect.com

# Optional: Stripe (for payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=h1bconnect-documents
```

### Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=H1BConnect
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production

# Optional
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_SENTRY_DSN=https://...
```

## 🚀 Quick Deploy Script

Run our automated deployment script:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

This script will:
- ✅ Install all dependencies
- ✅ Build backend and frontend
- ✅ Run health checks
- ✅ Provide deployment instructions

## 🧪 Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-backend-domain.com/health
```

Expected response:
```json
{
  "status": "OK",
  "environment": "production",
  "mode": "Production Mode",
  "version": "1.0.0"
}
```

### 2. API Endpoints Test
```bash
# Test compliance API
curl https://your-backend-domain.com/api/compliance/overview

# Test advisors API  
curl https://your-backend-domain.com/api/advisors

# Test payments API
curl https://your-backend-domain.com/api/payments/overview
```

### 3. Frontend Test
1. Visit your frontend URL
2. Test user registration/login
3. Navigate through all pages
4. Test calculator functionality
5. Test advisor booking flow
6. Verify all API calls work

## 🔗 Domain Setup

### Custom Domain (Optional)

#### For Railway:
1. Go to Railway Dashboard → Settings → Domains
2. Add custom domain: `app.h1bconnect.com`
3. Update DNS CNAME: `app.h1bconnect.com` → `your-app.railway.app`

#### For Vercel:
1. Go to Vercel Dashboard → Domains
2. Add domain: `h1bconnect.com`
3. Follow DNS configuration instructions

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          npm install
          cd server && npm install
          cd ../client && npm install
          
      - name: Build backend
        run: cd server && npm run build
        
      - name: Build frontend
        run: cd client && npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          
      - name: Deploy to Railway
        run: railway deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 🛠️ Monitoring & Maintenance

### 1. Health Monitoring
Set up monitoring for:
- `/health` endpoint (should return 200 OK)
- Database connectivity
- API response times
- Frontend loading times

### 2. Log Monitoring
- Railway: Check deployment logs in dashboard
- Vercel: Monitor function logs
- Set up error tracking (Sentry recommended)

### 3. Database Backups
- Railway: Automatic daily backups
- Heroku: Enable automatic backups
- Manual backup: `pg_dump DATABASE_URL > backup.sql`

## 🔒 Security Checklist

- [x] ✅ **HTTPS enforced** on all domains
- [x] ✅ **Environment variables** secured
- [x] ✅ **CORS configured** properly
- [x] ✅ **Rate limiting** enabled
- [x] ✅ **Helmet security** headers
- [x] ✅ **JWT secrets** are strong and unique

## 🆘 Troubleshooting

### Common Issues:

#### 1. Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Environment Variable Issues
- Verify all required variables are set
- Check for typos in variable names
- Ensure values don't have trailing spaces

#### 3. CORS Errors
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check for `http` vs `https` mismatches

#### 4. Database Connection Issues
- Verify `DATABASE_URL` format
- Check database service status
- Test connection with `psql` command

#### 5. API Not Found (404)
- Verify backend deployment succeeded
- Check API base URL configuration
- Test with direct curl commands

## 📞 Support

Need help? Check:
1. **Deployment logs** in your hosting dashboard
2. **Browser console** for frontend errors  
3. **Server logs** for backend errors
4. **GitHub Issues** for known problems

---

## 🎉 Success! 

Your H1BConnect platform is now live in production! 

**URLs to update:**
- Update `capitalrecruiters.net` menu link
- Share production URLs with stakeholders
- Update documentation with live URLs

**Next Steps:**
- Set up monitoring and alerts
- Configure backups
- Plan scaling strategy
- Gather user feedback 