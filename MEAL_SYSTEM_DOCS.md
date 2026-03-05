# Meal Logging System - Implementation Guide

## 🎉 Features Implemented

### 1. **Dynamic Meal Logging**

Users can now log their meals throughout the day with real-time nutrition tracking.

#### Key Features:

- ✅ Search for food items with real-time filtering
- ✅ View detailed nutrient breakdown for any food
- ✅ Add foods to Breakfast, Lunch, Dinner, or Snacks
- ✅ Remove foods from meal logs
- ✅ Real-time calorie and macro tracking
- ✅ User-specific meal data (resets daily)

### 2. **Food Search & Discovery**

- **Intelligent Search**: Type-ahead search with instant results
- **Detailed View**: Eye icon shows complete nutritional breakdown including:
  - Calories, Protein, Carbs, Fat, Fiber, Sugar
  - Minerals (Sodium, Potassium, Calcium, Iron)
  - Vitamins (A, B, C, D, E, K)
- **Food Images**: Visual representation when available

### 3. **Food Request System**

Users can request new foods to be added to the database.

#### Process:

1. User fills out comprehensive form with:
   - Food name and locality
   - Serving size and unit
   - Complete nutritional information
   - Optional food image (uploaded to Cloudinary)
2. Request is sent to all admins via email
3. User receives confirmation email
4. Admin approves/rejects via admin panel
5. User is notified of decision

### 4. **Dynamic Analytics Dashboard**

Real-time, user-specific analytics showing:

- **Daily Summary**:
  - Total calories consumed
  - Progress bar toward daily goal
  - Remaining calories
- **Macronutrients Breakdown**:
  - Protein, Carbs, Fat progress bars
  - Actual vs. Goal comparison
  - Fiber and Sugar tracking

### 5. **Meal History**

Complete history page showing:

- Daily calorie intake vs. expected
- Date-wise breakdown
- Color-coded indicators:
  - 🟢 Green: Met goal
  - 🔴 Red: Exceeded goal
  - 🔵 Blue: Below goal

### 6. **Email Notifications**

Professional email notifications for:

- ✅ Login notifications (welcome back messages)
- ✅ Food request submission confirmation
- ✅ Food request approval/rejection
- ✅ Admin notifications for pending requests

### 7. **Toast Notifications**

Using Sonner for clean UI feedback:

- Login success messages
- Food added/removed confirmations
- Error messages
- Request submission confirmations

---

## 📁 New API Endpoints

### Meal Logging

```
GET  /api/meals/log?date=YYYY-MM-DD
POST /api/meals/log
DELETE /api/meals/log?id={logId}
```

### Food Search

```
GET /api/meals/search?q={query}&limit={number}
```

### Food Requests

```
POST /api/meals/food-request
```

### Admin Operations

```
GET  /api/meals/admin/approve
POST /api/meals/admin/approve
```

### History

```
GET /api/meals/history?days={number}
```

### Authentication

```
POST /api/auth/login-notification
```

---

## 🗄️ Database Updates

### Food Model

Added fields:

- `locality`: Where the food is famous
- `imageUrl`: Cloudinary URL for food image

### MealLog Model

Enhanced with:

- `foodName`: Cached food name
- `servingSize`: Serving information
- `nutritionConsumed`: Complete nutrition breakdown per entry

---

## 🎨 New UI Components

1. **meal-sidebar.jsx** - Interactive meal type selector
2. **meal-log.jsx** - Main food search and logging interface
3. **nutrient-dialog.jsx** - Detailed nutrient breakdown modal
4. **food-request-dialog.jsx** - Comprehensive food request form
5. **daily-summary.jsx** - Real-time calorie dashboard
6. **macros-card.jsx** - Macronutrient progress visualization
7. **auth-notifications.jsx** - Login toast notifications

---

## 🚀 Setup Instructions

### 1. Install Dependencies

Already included in package.json:

- `sonner` - Toast notifications
- `cloudinary` - Image uploads
- `nodemailer` - Email services
- `@tanstack/react-table` - Data tables

### 2. Environment Variables

Ensure these are set in your `.env`:

```env
# Cloudinary (for food images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset

# Email (for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Seed Database with Foods

Run the seed script to populate initial verified foods:

```bash
node scripts/seedVerifiedFoods.js
```

This adds 40+ verified foods including:

- Indian dishes (Biryani, Dal, Paneer, etc.)
- Common foods (Eggs, Bread, Milk, etc.)
- Fruits and Nuts

### 4. Admin Setup

To manage food requests, ensure at least one user has `role: "admin"` in the database.

---

## 📊 User Flow

### Adding a Meal:

1. Navigate to **Meals** page
2. Select meal type (Breakfast/Lunch/Dinner/Snacks) from sidebar
3. Search for food in the search box
4. Click eye icon (👁️) to view nutrients
5. Click plus icon (➕) to add to meal log
6. See real-time updates in analytics

### Requesting a New Food:

1. Click **Request Food** button
2. Fill out the form with food details
3. (Optional) Upload food image
4. Submit request
5. Receive confirmation email
6. Wait for admin approval
7. Receive approval/rejection notification

### Viewing History:

1. Navigate to **History** page
2. View 30-day meal history
3. See daily calorie intake vs. goals
4. Filter and sort data

---

## 🎯 Data Reset Logic

### Daily Reset:

- Meal logs are **date-specific**
- Analytics show **only today's data**
- Each day starts fresh at midnight
- History preserves past days

### How It Works:

```javascript
// Meals API automatically filters by date
const targetDate = new Date();
targetDate.setHours(0, 0, 0, 0);

// Only fetches logs for current day
const mealLogs = await MealLog.find({
  userId: user._id,
  date: { $gte: targetDate, $lt: nextDay },
});
```

---

## 🔐 Security Features

- ✅ Authentication required for all meal operations
- ✅ User can only access their own meal logs
- ✅ Admin-only access for food approval
- ✅ Input validation on all forms
- ✅ Cloudinary secure uploads

---

## 🎨 UI/UX Enhancements

1. **Color-Coded Feedback**:
   - Green: On track
   - Red: Over target
   - Blue: Under target

2. **Real-time Updates**:
   - Instant calorie recalculation
   - Live progress bars
   - Dynamic meal calories in sidebar

3. **Responsive Design**:
   - Mobile-friendly layout
   - Grid-based responsive structure
   - Touch-friendly buttons

4. **Loading States**:
   - Search indicators
   - Button loading states
   - Skeleton screens where needed

---

## 🐛 Error Handling

All operations include comprehensive error handling:

- API errors show user-friendly toast messages
- Failed email sends don't block user flow
- Network issues are gracefully handled
- Validation errors highlight specific fields

---

## 📈 Next Steps

To extend this system:

1. **Exercise Logging** - Similar flow for exercise tracking
2. **Water Tracking** - Implement hydration logging
3. **Meal Planning** - Pre-plan meals for future days
4. **Social Features** - Share meals with friends
5. **AI Suggestions** - Integrate AI meal recommendations
6. **Barcode Scanning** - Add food via barcode
7. **Recipe Management** - Create and log custom recipes

---

## 🎓 Technical Notes

### State Management:

- Using React hooks (`useState`, `useEffect`)
- Props drilling for shared state
- Fetch on mount pattern for data loading

### Performance:

- Debounced search (300ms delay)
- Pagination ready (TanStack Table)
- Lazy loading of images
- Efficient MongoDB queries with indexes

### Accessibility:

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

---

## 🌟 Key Achievements

✅ Fully functional meal logging system  
✅ Complete CRUD operations for meals  
✅ Real-time analytics dashboard  
✅ User-friendly food discovery  
✅ Admin approval workflow  
✅ Professional email notifications  
✅ Toast feedback system  
✅ Responsive design  
✅ Secure and scalable  
✅ Well-documented codebase

---

## 💡 Tips for Users

1. **Daily Logging**: Log meals right after eating for accuracy
2. **Search Tips**: Use common names (e.g., "chicken" not "grilled organic chicken breast")
3. **Request Foods**: Be detailed with nutritional info for faster approval
4. **Track Progress**: Check history weekly to see trends
5. **Set Goals**: Update your calorie goals in profile for accurate tracking

---

## 🛠️ Troubleshooting

**Search not working?**

- Check if foods are seeded in database
- Verify MongoDB connection
- Check browser console for errors

**Emails not sending?**

- Verify EMAIL_USER and EMAIL_PASS in .env
- Check if Gmail allows less secure apps (or use app password)
- Test nodemailer configuration

**Images not uploading?**

- Verify Cloudinary credentials
- Check upload preset is unsigned or matches
- Ensure file size is under limit

**Analytics not updating?**

- Refresh the page
- Check if meal was successfully added (toast confirmation)
- Verify date/timezone settings

---

## 📞 Support

For issues or questions:

1. Check error logs in browser console
2. Verify environment variables
3. Ensure database is properly seeded
4. Check API responses in Network tab

---

**Built with ❤️ for NutriSync AI**
