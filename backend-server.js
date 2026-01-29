/**
 * LivePay Petition Backend Server
 * Handles signature collection, validation, PayPal donation tracking, and email receipts
 * Run: node backend-server.js
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email Configuration (Configure these environment variables)
const EMAIL_USER = process.env.EMAIL_USER || 'noreply@livepay.org';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'support@livepay.org';

let transporter = null;

// Initialize email transporter
try {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
  console.log('✉️ Email service initialized');
} catch (err) {
  console.log('⚠️ Email service not configured. Donations will not send receipts.');
}

// Data storage (production: use a database like MongoDB)
const dataDir = path.join(__dirname, 'data');
const signaturesFile = path.join(dataDir, 'signatures.json');
const donationsFile = path.join(dataDir, 'donations.json');

// Initialize data directory and files
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

if (!fs.existsSync(signaturesFile)) {
  fs.writeFileSync(signaturesFile, JSON.stringify([]), 'utf8');
}

if (!fs.existsSync(donationsFile)) {
  fs.writeFileSync(donationsFile, JSON.stringify([]), 'utf8');
}

// Helper functions
const readSignatures = () => {
  try {
    return JSON.parse(fs.readFileSync(signaturesFile, 'utf8'));
  } catch {
    return [];
  }
};

const writeSignatures = (signatures) => {
  fs.writeFileSync(signaturesFile, JSON.stringify(signatures, null, 2), 'utf8');
};

const readDonations = () => {
  try {
    return JSON.parse(fs.readFileSync(donationsFile, 'utf8'));
  } catch {
    return [];
  }
};

const writeDonations = (donations) => {
  fs.writeFileSync(donationsFile, JSON.stringify(donations, null, 2), 'utf8');
};

// Validation functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidZIP = (zip) => {
  return /^\d{5}(-\d{4})?$/.test(zip);
};

// Email Templates
const getReceiptTemplate = (donation) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; background: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(90deg, #4fd1ff, #7c5cff); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
          .amount { font-size: 32px; font-weight: bold; margin: 20px 0; text-align: center; color: #4fd1ff; }
          .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .label { color: #666; font-size: 12px; text-transform: uppercase; margin-top: 10px; }
          .value { font-weight: bold; font-size: 14px; color: #333; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
          .badge { display: inline-block; background: #4fd1ff; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Donation Receipt</h1>
            <p>Thank you for supporting the LivePay movement!</p>
          </div>
          
          <p>Hi ${donation.email},</p>
          
          <p>We've received your generous donation to the Data Ownership & Fair Revenue Act petition campaign. Your support helps us:</p>
          <ul>
            <li>Collect verified signatures from advocates like you</li>
            <li>Develop infrastructure for transparent, fair data markets</li>
            <li>Launch policy advocacy and congressional outreach</li>
            <li>Build a movement for data ownership and digital fairness</li>
          </ul>
          
          <div class="details">
            <div class="label">Amount Donated</div>
            <div class="amount">$${donation.amount.toFixed(2)}</div>
            
            <div class="label">Transaction ID</div>
            <div class="value">${donation.transactionId || 'Pending'}</div>
            
            <div class="label">Date</div>
            <div class="value">${new Date(donation.timestamp).toLocaleString()}</div>
            
            <div class="label">Status</div>
            <div><span class="badge">✓ Received</span></div>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ol>
            <li>Your donation is processed securely through PayPal</li>
            <li>You'll receive a PayPal confirmation email</li>
            <li>Updates on campaign progress will be sent to this email</li>
          </ol>
          
          <p><strong>Share the petition:</strong> Help us reach 10,000+ signatures by sharing the link: https://livepay-petition.github.io</p>
          
          <div class="footer">
            <p>Made with ❤️ for data ownership and fair revenue.</p>
            <p>LivePay Movement | support@livepay.org</p>
            <p>© 2026 Data Ownership Initiative. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const getSignatureTemplate = (signature) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; background: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(90deg, #4fd1ff, #7c5cff); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
          .badge { display: inline-block; background: #4fd1ff; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin: 10px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Signature Confirmed</h1>
            <p>You're now part of the movement</p>
          </div>
          
          <p>Thank you for signing the petition for the <strong>Data Ownership & Fair Revenue Act</strong>!</p>
          
          <p>Your signature has been recorded and will be included in our official submission to Congress.</p>
          
          <div class="badge">Signature #${signature.id}</div>
          
          <p><strong>Next steps:</strong></p>
          <ul>
            <li>Share the petition link with your network</li>
            <li>Follow us on social media for campaign updates</li>
            <li>Consider donating to accelerate advocacy efforts</li>
          </ul>
          
          <p>Questions? Reply to this email or visit our website.</p>
          
          <div class="footer">
            <p>Made with ❤️ for data ownership and fair revenue.</p>
            <p>LivePay Movement | support@livepay.org</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Email sending function
const sendEmail = async (to, subject, htmlContent) => {
  if (!transporter || !EMAIL_PASSWORD) {
    console.log(`⏭️ Email skipped (not configured): ${subject}`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: SENDER_EMAIL,
      to: to,
      subject: subject,
      html: htmlContent,
    });
    console.log(`✉️ Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error(`❌ Email error for ${to}:`, error.message);
    return false;
  }
};

// Routes

/**
 * POST /api/petition/sign
 * Submit a new petition signature
 */
app.post('/api/petition/sign', async (req, res) => {
  const { fullName, email, city, state, zip, country, certified, sendNotifications } = req.body;

  // Validation
  if (!fullName || !email || !city || !state || !zip || !country) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!isValidZIP(zip)) {
    return res.status(400).json({ error: 'Invalid ZIP code' });
  }

  if (!certified) {
    return res.status(400).json({ error: 'Must certify identity' });
  }

  const signatures = readSignatures();

  // Check for duplicate email
  if (signatures.some((sig) => sig.email === email)) {
    return res.status(409).json({ error: 'Email already signed' });
  }

  // Add new signature
  const newSignature = {
    id: Date.now().toString(),
    fullName,
    email,
    city,
    state,
    zip,
    country,
    timestamp: new Date().toISOString(),
    notificationsSent: false,
  };

  signatures.push(newSignature);
  writeSignatures(signatures);

  // Send confirmation email if requested
  if (sendNotifications) {
    const confirmationHtml = getSignatureTemplate(newSignature);
    const emailSent = await sendEmail(
      email,
      '✅ Your Petition Signature Has Been Recorded',
      confirmationHtml
    );
    newSignature.notificationsSent = emailSent;
  }

  res.status(201).json({
    success: true,
    message: 'Signature recorded successfully' + (newSignature.notificationsSent ? ' and confirmation sent' : ''),
    signature: newSignature,
    totalSignatures: signatures.length,
  });
});

/**
 * GET /api/petition/signatures/count
 * Get total signature count
 */
app.get('/api/petition/signatures/count', (req, res) => {
  const signatures = readSignatures();
  res.json({ count: signatures.length });
});

/**
 * GET /api/petition/signatures
 * Get all signatures (admin only - in production, add authentication)
 */
app.get('/api/petition/signatures', (req, res) => {
  const signatures = readSignatures();
  res.json({ signatures, total: signatures.length });
});

/**
 * POST /api/donation/track
 * Track a PayPal donation
 */
app.post('/api/donation/track', async (req, res) => {
  const { email, amount, transactionId, paypalEmail, sendReceipt } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const donations = readDonations();

  const newDonation = {
    id: Date.now().toString(),
    email,
    amount: parseFloat(amount),
    transactionId: transactionId || null,
    paypalEmail: paypalEmail || null,
    timestamp: new Date().toISOString(),
    receiptSent: false,
  };

  donations.push(newDonation);
  writeDonations(donations);

  // Send email receipt if requested
  if (sendReceipt) {
    const receiptHtml = getReceiptTemplate(newDonation);
    const emailSent = await sendEmail(
      email,
      `LivePay Donation Receipt - $${newDonation.amount.toFixed(2)}`,
      receiptHtml
    );
    newDonation.receiptSent = emailSent;
  }

  res.status(201).json({
    success: true,
    message: 'Donation tracked' + (newDonation.receiptSent ? ' and receipt sent' : ''),
    donation: newDonation,
    totalDonations: donations.length,
  });
});

/**
 * GET /api/donation/total
 * Get total donations
 */
app.get('/api/donation/total', (req, res) => {
  const donations = readDonations();
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  res.json({
    total: totalAmount,
    count: donations.length,
    average: donations.length > 0 ? (totalAmount / donations.length).toFixed(2) : 0,
  });
});

/**
 * GET /api/donation/list
 * Get all donations (admin only)
 */
app.get('/api/donation/list', (req, res) => {
  const donations = readDonations();
  const total = donations.reduce((sum, d) => sum + d.amount, 0);
  res.json({
    donations,
    total,
    count: donations.length,
  });
});

/**
 * GET /api/stats
 * Get campaign statistics
 */
app.get('/api/stats', (req, res) => {
  const signatures = readSignatures();
  const donations = readDonations();
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  res.json({
    signatures: {
      count: signatures.length,
      byCountry: signatures.reduce((acc, sig) => {
        acc[sig.country] = (acc[sig.country] || 0) + 1;
        return acc;
      }, {}),
      byState: signatures.reduce((acc, sig) => {
        if (sig.country === 'United States') {
          acc[sig.state] = (acc[sig.state] || 0) + 1;
        }
        return acc;
      }, {}),
    },
    donations: {
      total: totalDonations,
      count: donations.length,
      average: donations.length > 0 ? (totalDonations / donations.length).toFixed(2) : 0,
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LivePay Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Signatures endpoint: GET http://localhost:${PORT}/api/petition/signatures/count`);
  console.log(`💰 Donations endpoint: GET http://localhost:${PORT}/api/donation/total`);
  console.log(`📈 Stats endpoint: GET http://localhost:${PORT}/api/stats`);
});
