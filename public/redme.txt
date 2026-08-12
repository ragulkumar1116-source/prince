# CaptureFlex Software Store & Download Portal (Production Account Setup)

A production-ready **CaptureFlex-style software store and link-based download management portal** built with HTML5, CSS3, JavaScript, Bootstrap 5, and **Firebase Realtime Database & Authentication**.

---

## 🔒 Dedicated Hidden Admin Authentication Portal

Admins can log in or register new administrator credentials through the dedicated hidden admin authentication page:
`admin/admin-auth.html`

- **URL**: `https://your-domain.com/admin/admin-auth.html` (or `http://localhost:8080/admin/admin-auth.html`)
- Allows instant **Admin Login** and **Admin Registration** with auto-assigned `admin` permissions in Firebase Realtime Database.

---

## ⚡ Connecting Your Real Firebase Account

Follow these quick steps to hook up your live production Firebase project:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and enter your project name.
3. Enable **Firebase Authentication**:
   - Go to **Build -> Authentication**.
   - Click **Get Started** and enable **Email/Password** sign-in method.
4. Enable **Firebase Realtime Database**:
   - Go to **Build -> Realtime Database**.
   - Click **Create Database** (choose default location).

### Step 2: Paste Your Credentials into `assets/js/firebase-config.js`
Open [`assets/js/firebase-config.js`](file:///C:/Users/aitse/.gemini/antigravity/scratch/captureflex-clone/assets/js/firebase-config.js) and replace the configuration block:

```javascript
window.firebaseConfig = {
  apiKey: "YOUR_ACTUAL_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Apply Database Security Rules
In Firebase Console, go to **Realtime Database -> Rules** and paste the content of [`database.rules.json`](file:///C:/Users/aitse/.gemini/antigravity/scratch/captureflex-clone/database.rules.json):

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
      }
    },
    "products": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "files": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "licenses": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "support": {
      "$ticketId": {
        ".read": "auth != null && (data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null"
      }
    },
    "settings": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

---

## 🔑 Creating Your First Admin Account

1. Open `admin/admin-auth.html` in your browser.
2. Click **Register Admin**, enter your name, email, and password.
3. Your admin account will be registered directly in Firebase Authentication and granted full `admin` access in Realtime Database.
