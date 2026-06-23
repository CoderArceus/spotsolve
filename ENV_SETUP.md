# 🔧 Spot&Solve — Environment Setup Guide

## Required Environment Variables

Your app needs these variables in `.env.local` to work properly:

### 1. **Gemini API (Required for AI Analysis)**

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**How to get it:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Select or create a Google Cloud project
4. Copy the API key
5. Paste into `.env.local`

### 2. **Firebase Configuration (Required for Database)**

```env
# Client-side Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=spotsolve
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=spotsolve.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server-side Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=spotsolve
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@spotsolve.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**How to get them:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project **`spotsolve`**
3. **Project Settings** → **General** tab:
   - Copy your Web API Key
   - Copy Auth Domain, Project ID, Storage Bucket, etc.
4. **Project Settings** → **Service Accounts** tab:
   - Click **"Generate New Private Key"**
   - Copy the JSON and extract values

---

## ✅ Quick Setup Checklist

### Step 1: Get Gemini API Key (5 min)
- [ ] Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Click "Create API Key"
- [ ] Copy key to `.env.local`
- [ ] Test: Try uploading an image to `/report`

### Step 2: Get Firebase Keys (10 min)
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Select `spotsolve` project
- [ ] Get Web config (public keys)
- [ ] Get Admin SDK key (private key)
- [ ] Paste all into `.env.local`
- [ ] Test: Dashboard should load without Firestore errors

### Step 3: Verify Both Work (5 min)
- [ ] Open `/report` page
- [ ] Upload a test image
- [ ] Should see AI analysis (not 500 error)
- [ ] Should see ticket on dashboard
- [ ] Done! ✅

---

## 🚨 Troubleshooting

### "GEMINI_API_KEY missing" error
**Problem:** API returns 500 with this error  
**Solution:** Check `.env.local` has `GEMINI_API_KEY` set correctly

### "PERMISSION_DENIED" error
**Problem:** Gemini API rejects the key  
**Solution:** 
- Verify key is correct (copy/paste again)
- Check API is enabled in Google Cloud Console
- Generate a new key if needed

### "Firestore not initialized yet"
**Problem:** Dashboard shows "No issues" even after submissions  
**Solution:**
- Go to [Firebase Console](https://console.firebase.google.com)
- Click **Firestore Database**
- Click **Create database**
- Choose location and security mode
- Click **Create**

### "Firebase Admin SDK error"
**Problem:** Can't authenticate server-side  
**Solution:**
- Verify all Firebase Admin env vars are set
- Check PRIVATE_KEY has escaped newlines (`\n`)
- Generate a fresh service account key

---

## 📝 Example `.env.local`

```env
# Gemini AI
GEMINI_API_KEY=AIzaSyDx...

# Firebase Web Config (public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=spotsolve.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=spotsolve
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=spotsolve.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin SDK (private - keep secret!)
FIREBASE_ADMIN_PROJECT_ID=spotsolve
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-ab1cd@spotsolve.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCx...\n-----END PRIVATE KEY-----\n"
```

---

## 🔒 Security Notes

- **Never commit `.env.local`** to git (it's in `.gitignore`)
- **FIREBASE_ADMIN_PRIVATE_KEY** is secret - keep it safe
- **GEMINI_API_KEY** should be restricted to your domain
- In production, use secure secret management (Vercel Secrets, AWS Secrets Manager)

---

## ✨ Testing

Once configured, you can test:

### Test Gemini API
```bash
# Try uploading an image on /report page
# Should see AI analysis within seconds
```

### Test Firebase
```bash
# Dashboard should load without errors
# Submitted tickets should appear
# Check can scroll and load more
```

---

## 🆘 Still Having Issues?

1. **Check Console Tab** (F12) for specific error message
2. **Check Network Tab** (F12) → Click failed request → See response
3. **Check Server Logs** if running locally: `npm run dev`
4. **Verify all env vars** are set: No typos, no missing quotes
5. **Restart dev server** after changing `.env.local`

---

**Status:** Once you set these up, your app will be fully functional! 🚀
