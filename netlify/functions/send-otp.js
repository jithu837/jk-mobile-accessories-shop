exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  try {
    const { phone, otp } = JSON.parse(event.body);

    if (!phone || !otp) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Phone and OTP are required.' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    }

    // Get API key from Netlify environment variables
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: 'SMS API key not configured.' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    }

    // Call Fast2SMS API
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variables_values: otp,
        route: 'otp',
        numbers: phone,
      }),
    });

    const data = await response.json();

    if (data.return) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'OTP sent successfully.' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    } else {
      console.error('Fast2SMS error:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: data.message || 'Failed to send OTP via SMS.' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    }
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal server error.' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }
};

