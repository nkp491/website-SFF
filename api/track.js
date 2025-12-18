const crypto = require('crypto');

// Hash function for user data (SHA-256, lowercase)
function hashData(data) {
  if (!data) return null;
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

// Get client IP from various headers
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         '';
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      event_name,
      event_id,
      event_source_url,
      action_source = 'website',
      custom_data = {},
      user_data = {}
    } = req.body;

    // Validate required fields
    if (!event_name || !event_id) {
      return res.status(400).json({ error: 'Missing required fields: event_name, event_id' });
    }

    // Get environment variables
    const PIXEL_ID = process.env.META_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      console.error('Missing Meta credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Prepare user data with hashing
    const hashedUserData = {
      client_ip_address: getClientIP(req),
      client_user_agent: req.headers['user-agent'] || '',
    };

    // Add fbc/fbp cookies if provided
    if (user_data.fbc) hashedUserData.fbc = user_data.fbc;
    if (user_data.fbp) hashedUserData.fbp = user_data.fbp;

    // Hash any PII if provided
    if (user_data.email) {
      hashedUserData.em = hashData(user_data.email);
    }
    if (user_data.phone) {
      const normalizedPhone = user_data.phone.replace(/[\s\-\(\)]/g, '');
      hashedUserData.ph = hashData(normalizedPhone);
    }
    if (user_data.first_name) {
      hashedUserData.fn = hashData(user_data.first_name);
    }
    if (user_data.last_name) {
      hashedUserData.ln = hashData(user_data.last_name);
    }
    if (user_data.city) {
      hashedUserData.ct = hashData(user_data.city);
    }
    if (user_data.state) {
      hashedUserData.st = hashData(user_data.state);
    }
    if (user_data.zip) {
      hashedUserData.zp = hashData(user_data.zip);
    }
    if (user_data.country) {
      hashedUserData.country = hashData(user_data.country);
    }

    // Build the event payload
    const eventPayload = {
      data: [{
        event_name: event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id,
        event_source_url: event_source_url,
        action_source: action_source,
        user_data: hashedUserData,
        custom_data: custom_data
      }]
    };

    // Send to Meta Conversions API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI Error:', result);
      return res.status(response.status).json({
        error: 'CAPI request failed',
        details: result
      });
    }

    return res.status(200).json({
      success: true,
      events_received: result.events_received,
      fbtrace_id: result.fbtrace_id
    });

  } catch (error) {
    console.error('Track API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
