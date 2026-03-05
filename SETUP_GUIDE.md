# NutriSync AI - Quick Start Guide

## 🚀 Getting Started with Phase 1

Follow these steps to configure and test the authentication system.

---

## Step 1: Set Up Clerk Account

### 1.1 Create Clerk Application

1. Go to https://clerk.com and sign up
2. Click **"Create Application"**
3. Name it: **"NutriSync AI"**
4. Select authentication methods:
   - ✅ Email
   - ✅ Google (optional)
   - ✅ GitHub (optional)

### 1.2 Get API Keys

1. In Clerk Dashboard, go to **API Keys**
2. Copy the following keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 1.3 Configure Clerk Webhook

1. Go to **Webhooks** in Clerk Dashboard
2. Click **"Add Endpoint"**
3. For local testing:

   ```bash
   # Install ngrok
   npm install -g ngrok

   # Start ngrok (in a separate terminal)
   ngrok http 3000

   # Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
   ```

4. Set webhook URL: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
5. Subscribe to events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
6. Copy the **Webhook Signing Secret** → This is your `CLERK_WEBHOOK_SECRET`

---

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Click **"Connect"** → **"Connect your application"**
4. Copy connection string
5. Replace `<password>` with your database password
6. Add `/nutrisync` before query parameters

Example:

```
mongodb+srv://username:password@cluster.mongodb.net/nutrisync?retryWrites=true&w=majority
```

### Option B: Local MongoDB

```bash
# Install MongoDB
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod

# Connection string
mongodb://localhost:27017/nutrisync
```

---

## Step 3: Get API Keys for External Services

### 3.1 Groq AI (for AI features)

1. Go to https://console.groq.com
2. Sign up and create API key
3. Copy the key starting with `gsk_...`

### 3.2 Nutritionix API (for food database)

1. Go to https://www.nutritionix.com/business/api
2. Create free developer account
3. Get App ID and API Key

### 3.3 Cloudinary (for image uploads - optional for Phase 1)

1. Go to https://cloudinary.com
2. Sign up for free account
3. Get Cloud Name, API Key, and API Secret from dashboard

### 3.4 Gmail App Password (for emails - optional for Phase 1)

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password
4. Copy the 16-character password

---

## Step 4: Configure Environment Variables

### 4.1 Create `.env.local` file

```bash
# In project root
cp .env.example .env.local
```

### 4.2 Fill in the values

```env
# Database
MONGODB_URI=mongodb+srv://your-connection-string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# AI Services (get later if needed)
GROQ_API_KEY=gsk_...

# Email (optional for now)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (optional for now)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Nutrition API (needed for Phase 2)
NUTRITIONIX_APP_ID=...
NUTRITIONIX_API_KEY=...
```

---

## Step 5: Install & Run

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Start Development Server

```bash
npm run dev
```

The app will run on http://localhost:3000

### 5.3 Start Ngrok (for webhooks)

```bash
# In a separate terminal
ngrok http 3000
```

---

## Step 6: Test Authentication Flow

### 6.1 Test Sign-Up

1. Open http://localhost:3000
2. Click **"Sign Up"** or navigate to http://localhost:3000/sign-up
3. Create an account with email
4. You should be redirected to `/dashboard`

### 6.2 Verify Database Sync

1. Open MongoDB Compass or Atlas
2. Check the `users` collection
3. You should see your user with:
   - `clerkId` populated
   - `onboarded: false`
   - `createdAt` timestamp

### 6.3 Test Onboarding API

Open a new terminal and run:

```bash
# Get auth token (sign in first, then check browser dev tools → Application → Cookies)
# Or use Thunder Client/Postman with session cookies

# Complete onboarding
curl -X POST http://localhost:3000/api/user/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "roleType": "student",
    "gender": "male",
    "dob": "2000-01-15",
    "heightCm": 175,
    "weightKg": 70,
    "activityLevel": "moderate",
    "sleepHours": 7,
    "waterIntakeLiters": 2.5,
    "goalType": "maintain",
    "targetWeight": 70
  }'
```

Response should include calculated BMI, BMR, and calorie target.

### 6.4 Test Profile API

```bash
# Get profile
curl http://localhost:3000/api/user/profile

# Update profile
curl -X PATCH http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "dietaryRestrictions": ["vegetarian"],
      "cuisinePreferences": ["indian", "italian"]
    }
  }'
```

---

## Step 7: Test Protected Routes

### 7.1 Test Middleware Protection

1. Sign out from your account
2. Try to access http://localhost:3000/dashboard
3. You should be redirected to `/sign-in`
4. After signing in, you should reach the dashboard

### 7.2 Test API Protection

```bash
# Without authentication, should get 401
curl http://localhost:3000/api/user/profile
```

---

## Common Issues & Solutions

### Issue 1: "Clerk is not configured"

**Solution:** Make sure you've added Clerk keys to `.env.local` and restarted the dev server.

### Issue 2: "Cannot connect to MongoDB"

**Solution:**

- Check MongoDB connection string
- Ensure IP address is whitelisted in Atlas
- Verify network access settings

### Issue 3: "Webhook verification failed"

**Solution:**

- Ensure `CLERK_WEBHOOK_SECRET` matches Clerk dashboard
- Use ngrok HTTPS URL (not HTTP)
- Check ngrok is running

### Issue 4: User not created in MongoDB after sign-up

**Solution:**

- Check webhook is configured correctly
- Look at terminal logs for errors
- Verify ngrok is forwarding to port 3000
- Check Clerk webhook dashboard for delivery attempts

### Issue 5: Module not found errors

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## Development Tools

### Recommended VS Code Extensions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **MongoDB for VS Code** - Database management
- **Thunder Client** - API testing

### API Testing Tools

- **Thunder Client** (VS Code extension)
- **Postman** (Desktop app)
- **Insomnia** (Desktop app)
- **curl** (Command line)

### Database Viewers

- **MongoDB Compass** (GUI)
- **MongoDB for VS Code** (Extension)
- **MongoDB Atlas Web Interface**

---

## Next Steps After Testing

Once Phase 1 is working correctly:

1. ✅ Users can sign up and sign in
2. ✅ User data syncs to MongoDB
3. ✅ Onboarding API calculates health metrics
4. ✅ Profile and goals APIs work

**You're ready for Phase 2: Meals Management! 🎉**

Refer to `IMPLEMENTATION_PLAN.md` for Phase 2 details.

---

## Support & Resources

- **Implementation Plan:** `IMPLEMENTATION_PLAN.md`
- **Progress Report:** `PROGRESS_REPORT.md`
- **Clerk Docs:** https://clerk.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **MongoDB Docs:** https://www.mongodb.com/docs

---

## Checklist ✅

Before moving to Phase 2, verify:

- [ ] Clerk application created
- [ ] MongoDB database connected
- [ ] Environment variables configured
- [ ] npm install completed successfully
- [ ] Dev server runs without errors
- [ ] Can sign up new user
- [ ] User appears in MongoDB
- [ ] Can complete onboarding
- [ ] Protected routes work
- [ ] API endpoints respond correctly

If all checkboxes are ✅, you're ready to proceed! 🚀
