/**
 * LivePay Petition Backend Server
 * Handles signature collection, validation, and PayPal donation tracking
 * Run: node backend-server.js
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Routes

/**
 * POST /api/petition/sign
 * Submit a new petition signature
 */
app.post('/api/petition/sign', (req, res) => {
  const { fullName, email, city, state, zip, country, certified } = req.body;

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
  };

  signatures.push(newSignature);
  writeSignatures(signatures);

  res.status(201).json({
    success: true,
    message: 'Signature recorded successfully',
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
app.post('/api/donation/track', (req, res) => {
  const { email, amount, transactionId, paypalEmail } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const donations = readDonations();

  const newDonation = {
    id: Date.now().toString(),
    email,
    amount: parseFloat(amount),
    transactionId: transactionId || null,
    paypalEmail: paypalEmail || null,
    timestamp: new Date().toISOString(),
  };

  donations.push(newDonation);
  writeDonations(donations);

  res.status(201).json({
    success: true,
    message: 'Donation tracked',
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
