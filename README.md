# 🚀 SmartCycle AI - Secure Authentication System

Welcome to the **SmartCycle AI** Authentication Backend & Frontend repository! This project provides a robust, secure, and production-ready authentication system built for modern full-stack web applications and IoT dashboards (like our Smart Bin waste monitoring system).

---

## ✨ Key Features

1. **Multiple Login Credentials:**
   - **Email & Password:** Secure registration and login with encrypted passwords (using bcrypt).
   - **Google OAuth:** One-click "Continue with Google" sign-in integration.
2. **Email Verification:** Users must verify their email address via a secure token link sent to their inbox before full access is granted.
3. **Forgot Password Flow:** Secure password reset mechanism via email token verification.
4. **JWT (JSON Web Tokens):** Secure session management using Access Tokens and Refresh Tokens to keep user data protected.
5. **Smart Bin Dashboard Security:** Protects administrative and municipal officer dashboards for the SmartCycle AI IoT waste monitoring platform.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (React), Tailwind CSS, Axios (Hosted on Vercel)
* **Backend:** Node.js, Express.js (Hosted on Render)
* **Database:** MongoDB Atlas (NoSQL)
* **Authentication:** Passport.js (Google OAuth), JWT, Nodemailer (Email service)

---

## 📊 Backend Architecture & Flow Chart

Here is how data flows cleanly through our backend when a user logs in or registers:

```mermaid
graph TD
    A[User on Frontend (Vercel)] -->|1. Sends Login Request| B[Express Backend (Render)]
    B -->|2. Check Database| C[(MongoDB Atlas)]
    C -->|3. Verify Credentials/Google OAuth| B
    B -->|4. Generate JWT Token| B
    B -->|5. Send Response & Cookies| A
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
🔄 Authentication Flow Summary
Sign Up: User enters details 
→ Password gets hashed 
→ Verification email is triggered via Nodemailer.

Email Verification: User clicks the link in email 
→ Backend updates account status to verified.

Login: User enters credentials 
→ Backend validates and issues a JWT Token 
→ User is redirected to the protected SmartCycle AI Dashboard.

Google Login: User clicks Google button 
→ Redirects to Google Auth 
→ Backend receives profile, creates/logs in user, and generates JWT session.

⚙️ Environment Variables
Backend (.env)
Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_super_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret_key
FRONTEND_URL=[https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
Frontend (.env.local)
Code snippet
NEXT_PUBLIC_BACKEND_URL=[https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)
🚀 Running Locally
Clone the repository:

Bash
git clone [https://github.com/Abhiranjan-123/Authentication_system.git](https://github.com/Abhiranjan-123/Authentication_system.git)
Setup Backend:

Navigate to backend, install dependencies: npm install

Create .env file with the keys shown above.

Run server: npm start

Setup Frontend:

Navigate to frontend folder, install dependencies: npm install

Run development server: npm run dev
