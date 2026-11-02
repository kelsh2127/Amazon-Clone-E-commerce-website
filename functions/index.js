const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { body, param, validationResult } = require('express-validator');
const fetch = require('node-fetch');

setGlobalOptions({ maxInstances: 10 });
dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());




// Helper function to get the correct callback URL based on environment
const getCallbackUrl = () => {
  // If running in Firebase emulator
  if (process.env.FUNCTIONS_EMULATOR === 'true') {
    return process.env.CHAPA_CALLBACK_URL || 'http://localhost:5010/clone-8e87a/us-central1/api/payment/chapa/callback';
  }
  
  // For production - use the environment variable
  if (process.env.CHAPA_CALLBACK_URL) {
    const url = process.env.CHAPA_CALLBACK_URL;
    // If it's a localhost URL (shouldn't happen in production, but just in case)
    if (url.includes('localhost')) {
      return url;
    }
    // Ensure HTTPS for production
    return url.replace('http://', 'https://');
  }
  
  // If no callback URL is set in production, throw an error
  throw new Error('CHAPA_CALLBACK_URL must be set in production');
};




// Test endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Chapa Payment API is running!",
    endpoints: {
      initialize: "POST /payment/chapa/initialize",
      verify: "GET /payment/chapa/verify/:txRef",
      callback: "POST /payment/chapa/callback"
    }
  });
});

// Initialize Chapa payment
app.post("/payment/chapa/initialize",
  body('amount').isFloat({ min: 0.01 }),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }),
  body('email').isEmail(),
  body('firstName').isString(),
  body('lastName').isString(),
  body('txRef').optional().isString(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: result.array() });
    }

    const secretKey = String(process.env.CHAPA_SECRET_KEY || '').trim();
    if (!secretKey) {
      return res.status(500).json({ error: 'CHAPA_SECRET_KEY is not set' });
    }
    
    const amount = Number(req.body.amount).toFixed(2);
    const currency = String(req.body.currency ?? 'ETB').toUpperCase();
    const email = String(req.body.email).toLowerCase().trim();
    const first_name = String(req.body.firstName).trim();
    const last_name = String(req.body.lastName).trim();
    const tx_ref = String(req.body.txRef || `tx-${Date.now()}`);

    const return_url = process.env.CHAPA_RETURN_URL || 'http://localhost:5173/payment-success';
    const callback_url = getCallbackUrl();

    // Log the URLs being used (helpful for debugging)
    console.log('Using callback URL:', callback_url);
    console.log('Using return URL:', return_url);
    console.log('Environment:', process.env.FUNCTIONS_EMULATOR === 'true' ? 'emulator' : 'production');

    const payload = {
      amount: amount,
      currency: currency,
      email: email,
      first_name: first_name,
      last_name: last_name,
      tx_ref: tx_ref,
      return_url: return_url,
      callback_url: callback_url,
      "customization[title]": "Payment",
      "customization[description]": "Order payment"
    };

    try {
      console.log('Sending to Chapa:', JSON.stringify(payload, null, 2));
      
      const chapaResponse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await chapaResponse.json();
      console.log('Chapa response:', data);

      if (!chapaResponse.ok) {
        return res.status(chapaResponse.status).json({ 
          error: 'Chapa initialization failed', 
          details: data 
        });
      }

      const checkoutUrl = data.data?.checkout_url;
      if (!checkoutUrl) {
        return res.status(502).json({ 
          error: 'No checkout_url returned from Chapa', 
          details: data 
        });
      }

      return res.json({ 
        success: true,
        txRef: tx_ref, 
        checkoutUrl 
      });

    } catch (error) {
      console.error('Chapa initialization error:', error);
      return res.status(502).json({ 
        error: error.message || 'Chapa initialization failed' 
      });
    }
  }
);

// Verify payment
app.get("/payment/chapa/verify/:txRef", async (req, res) => {
  try {
    const secretKey = String(process.env.CHAPA_SECRET_KEY || '').trim();
    const txRef = String(req.params.txRef).replace(/"/g, '').trim();
    
    console.log('=== VERIFY ENDPOINT CALLED ===');
    console.log('Verifying txRef:', txRef);

    if (!secretKey) {
      return res.status(500).json({ error: 'CHAPA_SECRET_KEY is not set' });
    }
    
    const chapaResponse = await fetch(`https://api.chapa.co/v1/transaction/verify/${encodeURIComponent(txRef)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if response is OK
    if (!chapaResponse.ok) {
      console.error('Chapa API error:', chapaResponse.status, chapaResponse.statusText);
      return res.status(chapaResponse.status).json({ 
        error: 'Chapa API error', 
        status: chapaResponse.status 
      });
    }

    // IMPORTANT: Add AWAIT here!
    const data = await chapaResponse.json();
    console.log('Full Chapa response:', JSON.stringify(data, null, 2));
    
    let paid = false;
    
    if (data.status === 'success' && data.data) {
      const transactionStatus = data.data.status?.toLowerCase();
      if (transactionStatus === 'success' || transactionStatus === 'completed' || transactionStatus === 'paid') {
        paid = true;
      }
    }
    
    return res.json({ 
      success: true,
      paid: paid, 
      txRef: txRef, 
      details: data 
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(502).json({ 
      error: error.message || 'Verification failed' 
    });
  }
});



// Callback endpoint for Chapa
app.post("/payment/chapa/callback", async (req, res) => {
  console.log('Chapa callback received:', req.body);
  
  try {
    const { tx_ref, status, amount, currency } = req.body;
    
    if (tx_ref && status) {
      console.log(`Payment ${tx_ref} for ${amount} ${currency} is ${status}`);
      
      // Here you can update your database, send notifications, etc.
      // Example: await updateOrderStatus(tx_ref, status);
    }
    
    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Callback processing error:', error);
    // Still return 200 to prevent Chapa from retrying
    res.status(200).json({ received: true, error: error.message });
  }
});

// Create order endpoint
app.post("/orders/create", async (req, res) => {
  try {
    const { items, total, address } = req.body;
    const orderId = Date.now();
    console.log('Order created:', { orderId, total, itemsCount: items?.length || 0 });
    
    res.json({ 
      success: true,
      orderId, 
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Export the API function
exports.api = onRequest(app);