# LivePay Petition Support Platform

A modern, fully-featured petition and donation platform for the **Data Ownership & Fair Revenue Act**.

## Features

✅ **Sign the Petition** — Collect verified signatures with location tracking  
✅ **PayPal Donations** — Accept donations via PayPal integration  
✅ **Real-time Counts** — Live signature and donation tracking  
✅ **Responsive Design** — Mobile-first, works on all devices  
✅ **Backend API** — Node.js server for data persistence  
✅ **Analytics** — View signatures by location, donations totals  
✅ **GitHub Pages Ready** — Deploy static HTML or with backend

---

## Quick Start

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
  "certified": true
}
```

**GET** `/api/petition/signatures/count`  
Get total number of signatures

**GET** `/api/petition/signatures`  
Get all signatures (admin access)

### Donations

**POST** `/api/donation/track`  
Track a PayPal donation

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
For production, upgrade to a real database like MongoDB, PostgreSQL, or Firebase.

---

## PayPal Integration

The platform accepts donations via:
- **PayPal.me Link**: https://www.paypal.com/paypalme/illmedicine

### Preset Amounts
- $25 — Fuel outreach + signature growth
- $50 — Support policy + legal engagement
- $100 — Build infrastructure + credibility

---

## Deployment

### GitHub Pages (Static)
```bash
git push origin main
# Enable Pages in Settings → Deploy from branch (main)
```

### Heroku (with Backend)
```bash
heroku create livepay-petition
git push heroku main
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

---

## Development

```bash
npm install
npm start
```

---

## Security Notes

⚠️ **Production Recommendations:**
1. Add email verification
2. Implement rate limiting
3. Use a proper database (MongoDB, PostgreSQL)
4. Add authentication for admin endpoints
5. Integrate PayPal IPN for automatic tracking
6. Add CAPTCHA to prevent bot submissions
7. HTTPS only
8. Regular backups

---

**Made with ❤️ for data ownership and fair revenue.**