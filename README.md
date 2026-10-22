# KPS Worldwide Logistics - HR Admin Panel & Website Architecture

Enterprise freight forwarding, customs clearance, and global supply chain portal with Next.js static export frontend, Firebase Authentication & Cloud Firestore admin authorization.

---

## 🏛️ Authentication & Authorization Architecture

```
User (Email + Password)
                 ↓
      Firebase Authentication
                 ↓
     Authenticated Firebase User
                 ↓
              user.uid
                 ↓
   Cloud Firestore `/admins/{user.uid}`
                 │
          ┌──────┴──────┐
          ↓             ↓
    isActive=true   isActive=false or non-admin
    role="admin"        ↓
          ↓         Access Denied (Sign Out)
       /admin           ↓
                   /admin/login
```

- **Frontend**: Next.js 16 (`output: 'export'`), React 19, TailwindCSS, Firebase Web SDK (v12+).
- **Authentication**: Firebase Authentication (Email/Password).
- **Admin Authorization**: Cloud Firestore (`/admins/{firebaseUid}`).
- **Static Compatibility**: Full client-side session hydration and route protection with `onAuthStateChanged()`.

---

## 🔐 Firebase Console Configuration

### 1. Enable Sign-In Providers
1. Navigate to the **[Firebase Console](https://console.firebase.google.com/)**.
2. Select your project: **KPS Website HR Panel**.
3. In the left navigation, go to **Build** → **Authentication**.
4. Click the **Sign-in method** tab.
5. Under **Native providers**:
   - **Email/Password**: Click **Email/Password** → **Enable** → Click **Save**.
6. **Leave `Anonymous` and other authentication providers DISABLED**.

### 2. Configure Cloud Firestore
1. In the left navigation, go to **Build** → **Firestore Database**.
2. If not created yet, click **Create database** (start in production mode).
3. In the **Rules** tab, apply the rules from `firestore.rules`:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Admins Collection: Authenticated users can only read their own authorization doc
       match /admins/{adminUid} {
         allow read: if request.auth != null && request.auth.uid == adminUid;
         allow write: if false;
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

---

## 👤 Admin User Provisioning

To authorize an administrator:

### Step 1: Create Account in Firebase Authentication
1. In Firebase Console, go to **Authentication** → **Users** tab.
2. Click **Add user** (or have the user sign in via Google once).
3. Copy the user's **User UID** (Firebase UID).

### Step 2: Create Admin Record in Cloud Firestore
1. In Firebase Console, go to **Firestore Database** → **Data** tab.
2. Click **Start collection**:
   - **Collection ID**: `admins`
   - **Document ID**: Paste the exact **User UID** copied from Step 1.
3. Add the following fields:

| Field Name | Type | Value | Note |
| :--- | :--- | :--- | :--- |
| `email` | `string` | `user@company.com` | User's registered email |
| `name` | `string` | `Administrator Name` | Display name |
| `role` | `string` | `admin` | Must be `"admin"` (or `"super_admin"`) |
| `isActive` | `boolean` | `true` | Must be `true` |
| `createdAt` | `timestamp` | Current timestamp | Creation date |
| `updatedAt` | `timestamp` | Current timestamp | Last update |

4. Click **Save**. The user can now immediately sign in and access `/admin`.

---

## ⚙️ Environment Variables Reference

### Frontend (`.env.local` / Cloudflare Pages)

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Worker API URL (defaults to `http://localhost:8787` in dev) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID (`kps-website-hr-panel`) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

---

## 🚀 Local Development & Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Production Static Build
```bash
npm run build
```
Deploy the generated `out/` directory to Cloudflare Pages or any static host.

---

## 📬 Contact Us (WhatsApp) and Request a Quote (Google Sheets)

- **Contact Us:** on a valid submit the browser opens WhatsApp (`wa.me`) with the enquiry pre-filled, using the business number
  from `data/company.js` (`companyDetails.contact.whatsappUrl`). Nothing is stored. If the pop-up is blocked the form shows
  the message with an "Open WhatsApp" link and a copy button.
- **Request a Quote:** `LeadForm` → Worker `POST /api/quotes` → Google Apps Script Web App → `Quote Requests` tab of the
  KPS-WEB LEADS sheet. Success is shown only after the script confirms the row. Setup and deployment steps (including the
  one-time Apps Script update) are in [worker/apps-script/README.md](worker/apps-script/README.md).

The Web App URL is a Worker secret only (`npx wrangler secret put APPS_SCRIPT_URL`); it is not in the repo or the browser bundle.
Worker tests: `cd worker && npm test`.
