# LivePay Petition Support Platform

A modern, fully-featured petition and donation platform for the **Data Ownership & Fair Revenue Act**.

## ✨ Features

✅ **Sign the Petition** — Collect verified signatures with location tracking  
✅ **PayPal Donations** — Accept donations via PayPal integration  
✅ **Real-time Counts** — Live signature and donation tracking  
✅ **Automated Email Receipts** — Send donation receipts and notifications  
✅ **Mobile App** — PWA support for iOS/Android installation  
✅ **Offline Support** — Works even when internet is unavailable  
✅ **Responsive Design** — Mobile-first, works on all devices  
✅ **Backend API** — Node.js server for data persistence  
✅ **Analytics** — View signatures by location, donations totals  
✅ **GitHub Pages Ready** — Deploy static HTML or with backend

---

## 🚀 Quick Start

### 1. **Frontend Only (GitHub Pages)**

Deploy the static HTML directly to GitHub Pages:

```bash
# Already committed and ready to deploy
# Just enable GitHub Pages in repository Settings
# Your site will be at: https://username.github.io/LivePay-Petition-Suppot
```

### 2. **Frontend + Backend (Local Development)**

#### Install Dependencies
```bash
npm install
```

#### Configure Email (Optional)

Copy `.env.example` to `.env` and fill in your email settings:

```bash
cp .env.example .env
```

Then edit `.env` with your email provider (Gmail, SendGrid, etc.)

#### Start the Backend Server
```bash
npm start
```
The server will run on `http://localhost:5000`

#### Test the API

```bash
# Check signature count
curl http://localhost:5000/api/petition/signatures/count

# Get campaign stats
curl http://localhost:5000/api/stats

# Get total donations
curl http://localhost:5000/api/donation/total
```

---

## 📱 Mobile App Install

The platform is a Progressive Web App (PWA) that can be installed on mobile devices:

### iOS
1. Open the petition in Safari
2. Tap the Share button → Add to Home Screen
3. Tap "Add" and it installs as an app

### Android
1. Open the petition in Chrome
2. Menu → "Install app" or look for install prompt
3. Tap "Install" and it adds to your home screen

**Features:**
- Install without app stores
- Works offline (reads from cache)
- Native app-like experience
- Shortcuts for signing and donating

---

## 📧 Email Receipts & Notifications

The platform sends automated emails for:

### Petition Signatures
- Confirmation when someone signs
- Includes petition goals and next steps
- Optional: Campaign update emails

### Donations
- Receipt for every donation
- Transaction details and timestamp
- Thank you message and campaign impact
- Optional: Donation updates

### Setup Email Service

**Option 1: Gmail**
1. Enable 2FA on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

**Option 2: SendGrid (Recommended for Production)**
1. Create a SendGrid account: https://sendgrid.com
2. Generate an API key
3. Add to `.env`:
```
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your_api_key_here
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
```

**Other SMTP Providers:** Configure using their SMTP settings

---

## API Endpoints

### Petition Signatures

**POST** `/api/petition/sign`  
Submit a new petition signature
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "United States",
  "certified": true,
  "sendNotifications": true
}
```

**GET** `/api/petition/signatures/count`  
Get total number of signatures

**GET** `/api/petition/signatures`  
Get all signatures (admin access)

### Donations

**POST** `/api/donation/track`  
Track a PayPal donation
```json
{
  "email": "donor@example.com",
  "amount": 50,
  "transactionId": "optional-txn-id",
  "paypalEmail": "paypal@example.com",
  "sendReceipt": true
}
```

**GET** `/api/donation/total`  
Get donation totals

**GET** `/api/donation/list`  
Get all donations (admin access)

### Analytics

**GET** `/api/stats`  
Get comprehensive campaign statistics

---

## Data Storage

### Local Development
- **Signatures**: `data/signatures.json`
- **Donations**: `data/donations.json`

### Production Deployment
For production, upgrade to a real database:
- **MongoDB** (recommended)
- **PostgreSQL**
- **Supabase**
- **Firebase Firestore**

---

## PayPal Integration

The platform accepts donations via:
- **PayPal.me Link**: https://www.paypal.com/paypalme/illmedicine

### Preset Amounts
- $25 — Fuel outreach + signature growth
- $50 — Support policy + legal engagement
- $100 — Build infrastructure + credibility
- Custom amount — Use main PayPal link

---

## Deployment Options

### Option 1: GitHub Pages (Static)
```bash
git push origin main
# Enable Pages in Settings → Pages → Deploy from branch (main)
# Site available at: https://username.github.io/LivePay-Petition-Suppot
```

### Option 2: Heroku (with Backend)
```bash
heroku create livepay-petition
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
```

### Option 3: Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

---

## Development

### Run in Development Mode
```bash
npm run dev
```
This uses `nodemon` to auto-restart on file changes.

### Project Structure
```
.
├── index.html              # Main petition page (PWA)
├── manifest.json           # PWA app manifest
├── service-worker.js       # Offline support
├── backend-server.js       # Node.js API server
├── package.json            # Dependencies
├── .env.example            # Email config template
└── data/                   # Local JSON storage
    ├── signatures.json
    └── donations.json
```

---

## Security Notes

⚠️ **Current Implementation:**
- Uses local JSON file storage (suitable for demo/small scale)
- Email passwords stored in .env (keep secret!)
- No authentication on admin endpoints (add in production)
- No rate limiting (add for production)

✅ **Production Recommendations:**
1. Use a real database (MongoDB, PostgreSQL)
2. Add authentication for admin endpoints
3. Implement rate limiting on API endpoints
4. Add email verification (OTP)
5. Use HTTPS only
6. Keep .env file secret
7. Regular backups
8. Monitor for suspicious activity

---

## Troubleshooting

### Backend not starting?
```bash
rm -r node_modules package-lock.json
npm install
npm start
```

### Emails not sending?
- Check `.env` file exists and is configured
- Test email credentials: `npm run test:email` (if configured)
- Check provider's SMTP settings
- Verify firewall allows SMTP port (usually 587)

### Service Worker not registering?
- Check browser console for errors
- Ensure HTTPS in production (localhost works for dev)
- Clear browser cache and hard refresh

### Donation form not showing?
- Check browser console for errors
- Ensure backend is running
- Try localhost:5000 in browser to verify

---

## Contributing

To improve the platform:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push
5. Open a Pull Request

---

## License

MIT License - See LICENSE file for details

---

**Made with ❤️ for data ownership and fair revenue.**