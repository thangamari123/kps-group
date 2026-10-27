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

---

## 🗓️ Careers: Apply button and job closing date

- **Candidate Portal form** is hidden on `/career` until **Apply** is clicked on an open job; the form is then bound to that job
  (`jobId`, title, slug). **Cancel** hides it again. The job detail page (`/career/view?slug=…`) behaves the same way.
- **Closing date** is the existing "Application Closing Date" field of the admin job form (stored as before, an ISO date at
  00:00 UTC of the chosen day). A job is **active** when it is `published` **and** its closing date has not passed. It stays
  open **through** the closing date and closes when that day ends in **India Standard Time (UTC+05:30)**, i.e. from
  00:00 IST on the next day. Nothing has to be closed by hand; the stored status is never rewritten, the effective status
  ("Closed / Expired") is derived whenever jobs are read. The rule lives in `lib/job-deadline.ts`.
- **Enforced in four places** (the UI is not the only check): the public pages (no Apply button), `applicationsCms.create`
  (client), the Worker routes `POST /api/careers/resume/upload` and `POST /api/careers/applications`, and the Firestore
  security rule for `applications` creates (`firestore.rules`), which is what stops a direct call to the Firestore API.

**Deploy:** `firebase deploy --only firestore:rules` (the rule is what blocks direct API writes for expired jobs),
`cd worker && npx wrangler deploy`, then redeploy the website.

---

## 🏆 Awards: admin management

- **Admin:** *Content Management → Awards* (`/admin/awards`). Add, edit, publish/unpublish, reorder and delete awards; upload or
  replace the image. Uploads go through the existing Worker route `POST /api/admin/media/upload` (prefix `awards/images`) into the
  existing R2 bucket; the record stores the object key (`imageKey`) and the delivery path `/api/media/<key>`. No credentials are in
  the browser. Replacing or deleting an award removes its R2 file only if no other award, gallery, blog or CSR record uses the key.
- **Existing awards:** the 7 awards that used to be hard-coded in `data/awards.js` are imported with one click (the banner at the top of
  the Awards admin page). Records get fixed ids (`legacy-award-<id>`) and keep pointing at the same `public/images/...` files, so the
  import is atomic and repeatable and never duplicates; the local image files are not moved or deleted.
- **Public page:** `/awards` keeps its design and reads published awards from Firestore. Until the import has run (or if Firestore
  cannot be read) it shows the built-in list as before. After that, nothing published means an empty list, not the built-in one.
  The home page teaser still reads `data/awards.js`.

**One-time steps:** deploy the website, deploy `firestore.rules` (adds the public-readable marker `site_settings/awardsSource`), sign in
to the admin panel and click **Import existing awards**. Without the rules update everything works except that unpublishing or
deleting *every* award would bring the built-in list back.
