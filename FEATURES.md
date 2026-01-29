# 📱 Mobile App & Email Features - Quick Reference

## 🎉 New Features Added

### 1️⃣ Automated Email Receipts
- Donation receipts with transaction details
- Petition confirmation emails
- HTML formatted with branding
- Optional opt-in checkbox

### 2️⃣ Progressive Web App (PWA)
- Install as native app on iOS/Android
- No app store required
- Works offline with cached pages
- One-click shortcuts for signing/donating

### 3️⃣ Offline Support
- Service Worker caching
- View last loaded page when offline
- Automatic sync when back online
- Fallback to localStorage

### 4️⃣ Mobile Optimization
- 44px+ touch targets (accessibility standard)
- Larger form inputs on mobile (prevents zoom)
- Improved spacing for finger navigation
- Optimized font sizes for readability

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Configure email (optional)
cp .env.example .env
# Edit .env with your email credentials

# Start the server
npm start

# Server runs on http://localhost:5000
```

---

## 📧 Email Configuration

### Gmail (Free, Easy)
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### SendGrid (Recommended for Production)
1. Create account: https://sendgrid.com
2. Generate API key
3. Add to `.env`:
```
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your_api_key
```

---

## 📱 Mobile App Install

### Android (Chrome)
1. Open site in Chrome
2. Menu → "Install app" or look for install prompt
3. Tap "Install"

### iOS (Safari)
1. Open site in Safari
2. Tap Share → "Add to Home Screen"
3. Tap "Add"

### Benefits
- ✅ Instant launch from home screen
- ✅ Works offline
- ✅ Full-screen experience
- ✅ No app store needed

---

## 📊 Project Files

```
index.html              Main petition page (PWA enabled)
manifest.json           Mobile app configuration
service-worker.js       Offline caching & support
backend-server.js       API with email integration
package.json            Dependencies (includes Nodemailer)
.env.example            Email configuration template
README.md               Full documentation
SETUP.md                Detailed setup guide
```

---

## 🔗 API Endpoints with Email

### Sign Petition
```bash
POST /api/petition/sign
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "United States",
  "certified": true,
  "sendNotifications": true    # NEW: Send email confirmation
}
```

### Track Donation & Send Receipt
```bash
POST /api/donation/track
{
  "email": "donor@example.com",
  "amount": 50,
  "transactionId": "optional",
  "sendReceipt": true          # NEW: Send email receipt
}
```

---

## 💡 Usage Tips

### For Signers
1. Check the email notification checkbox
2. Submit the form
3. Confirmation email arrives in inbox
4. Unsubscribe link in email

### For Donors
1. Donate on PayPal (any amount)
2. Fill "Record Donation" form with your email
3. Check "Send Receipt" checkbox
4. Get professional receipt in email

### For Admins
- View `/api/stats` for campaign overview
- Check `data/signatures.json` for all signatures
- Check `data/donations.json` for all donations
- Backup data regularly

---

## 🔧 Deployment Quick Links

### GitHub Pages (Frontend)
- Settings → Pages → Deploy from branch (main)
- Site: `https://username.github.io/LivePay-Petition-Suppot`

### Heroku (Backend + Email)
```bash
heroku create livepay-petition
git push heroku main
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

---

## ✅ Checklist Before Going Live

- [ ] Configure email in `.env`
- [ ] Test email sending (submit a form)
- [ ] Test mobile app install
- [ ] Test offline mode (disconnect internet)
- [ ] Update PayPal link in HTML (replace `illmedicine`)
- [ ] Create GitHub Pages deployment
- [ ] Deploy backend to Heroku/Railway
- [ ] Test full flow: sign → email → donate → receipt
- [ ] Share on social media
- [ ] Monitor `/api/stats` for activity

---

## 🐛 Common Issues

**Email not sending?**
- Check `.env` file exists with correct credentials
- Verify email provider SMTP settings
- Check backend logs for errors

**App won't install on mobile?**
- Must be HTTPS (localhost works for testing)
- Check manifest.json is present
- Try Chrome on Android or Safari on iOS

**Can't connect to backend?**
- Ensure `npm start` is running
- Check http://localhost:5000 in browser
- Look for CORS errors in console

---

## 📞 Support Resources

- **README.md** — Full feature documentation
- **SETUP.md** — Detailed setup instructions
- **backend-server.js** — API documentation in code
- **index.html** — Form implementation details
- **GitHub Issues** — Report bugs

---

**Everything is ready! 🚀 Deploy and start collecting signatures & donations.**
