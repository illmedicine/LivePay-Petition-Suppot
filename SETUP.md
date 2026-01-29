# LivePay Petition - Setup & Deployment Guide

## ✅ What's Included

- **index.html** — Fully responsive petition page with PayPal integration
- **backend-server.js** — Node.js API server for signature & donation tracking
- **package.json** — Dependencies (Express, CORS, Body-parser)
- **README.md** — Complete documentation
- **data/** — Local JSON storage for signatures and donations

---

## 🚀 Quick Setup

### 1. **Start the Backend Server**

```powershell
cd c:\Users\demar\Documents\GitHub\LivePay-Petition-Suppot
npm start
```

Server runs on: `http://localhost:5000`

### 2. **Open the Frontend**

- Open `index.html` in your browser, or
- Serve it via a local server:
  ```powershell
  # Using Python
  python -m http.server 8000
  
  # Then visit: http://localhost:8000
  ```

### 3. **Test the API**

```powershell
# Check signature count
curl http://localhost:5000/api/petition/signatures/count

# Get stats
curl http://localhost:5000/api/stats

# Get donation total
curl http://localhost:5000/api/donation/total
```

---

## 🌐 Deploy to GitHub Pages

### Static Deployment (Frontend Only)

```bash
git push origin main
```

Then in your GitHub repository:
1. Go to **Settings** → **Pages**
2. Select **Deploy from a branch**
3. Choose **main** branch
4. Save

Your site will be live at: `https://username.github.io/LivePay-Petition-Suppot`

**Note:** Without the backend server, signatures are stored in the browser's localStorage. To persist data, deploy the backend.

---

## 🔧 Backend Deployment Options

### Option A: Heroku (Free tier available)

```bash
# Install Heroku CLI
# Then:
heroku create livepay-petition
git push heroku main
```

### Option B: Railway or Render

Similar to Heroku - just push your git repo and they auto-deploy.

### Option C: Your Own Server (AWS, DigitalOcean, etc.)

```bash
git clone https://github.com/username/LivePay-Petition-Suppot.git
cd LivePay-Petition-Suppot
npm install
npm start
```

---

## 💳 PayPal Integration

All donation buttons link to:
```
https://www.paypal.com/paypalme/illmedicine
```

Quick amounts:
- $25: `https://www.paypal.com/paypalme/illmedicine/25`
- $50: `https://www.paypal.com/paypalme/illmedicine/50`
- $100: `https://www.paypal.com/paypalme/illmedicine/100`

To update the PayPal address:
1. Edit `index.html`
2. Find all instances of `illmedicine`
3. Replace with your PayPal username/email

---

## 📊 API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/petition/sign` | Submit signature |
| GET | `/api/petition/signatures/count` | Get total signatures |
| GET | `/api/petition/signatures` | Get all signatures (admin) |
| POST | `/api/donation/track` | Track donation |
| GET | `/api/donation/total` | Get donation totals |
| GET | `/api/donation/list` | Get all donations (admin) |
| GET | `/api/stats` | Get full campaign stats |

---

## 📁 Project Structure

```
LivePay-Petition-Suppot/
├── index.html              # Main website
├── backend-server.js       # API server
├── package.json            # Dependencies
├── package-lock.json       # Lock file
├── README.md               # Documentation
├── SETUP.md                # This file
├── .gitignore              # Git ignore rules
├── node_modules/           # Installed packages
└── data/                   # Generated at runtime
    ├── signatures.json     # Petition signatures
    └── donations.json      # Donation records
```

---

## 🛡️ Security Checklist for Production

- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Add rate limiting to API endpoints
- [ ] Implement email verification for signatures
- [ ] Add CAPTCHA to prevent bot submissions
- [ ] Use a real database (MongoDB, PostgreSQL)
- [ ] Add API authentication for admin endpoints
- [ ] Set up automated backups
- [ ] Monitor for errors and set up alerts
- [ ] Integrate PayPal IPN for automatic payment confirmation
- [ ] Keep dependencies updated (`npm audit fix`)

---

## ❓ Troubleshooting

**Q: Port 5000 already in use?**
```bash
# Use a different port:
$env:PORT=3000; npm start
```

**Q: "Cannot find module 'express'"**
```bash
npm install
```

**Q: Frontend not connecting to backend?**
- Check if backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- If running on different domains, backend has CORS enabled globally

**Q: Data not saving?**
- Check that `data/` directory exists and is writable
- Check file permissions: `chmod 755 data/`
- Restart the server

---

## 📞 Next Steps

1. **Customize the messaging** — Edit copy in `index.html`
2. **Update PayPal link** — Replace `illmedicine` with your PayPal username
3. **Set up email notifications** — Integrate SendGrid or Mailgun (optional)
4. **Deploy backend** — Choose Heroku, Railway, or your own server
5. **Monitor campaign** — Check `/api/stats` for real-time data

---

## 💡 Tips

- **Share the petition**: Copy the GitHub Pages URL and share via social media
- **Track progress**: Visit `/api/stats` to see real-time signature and donation data
- **Backup data**: The `data/` folder contains all signatures and donations
- **Export data**: The JSON files can be imported into Excel or any analytics tool

---

**You're all set! 🎉 The LivePay Petition Platform is ready to go live.**

Need help? Check the README.md or GitHub Issues.
