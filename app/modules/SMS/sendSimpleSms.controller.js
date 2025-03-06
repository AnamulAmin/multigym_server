import fetch from 'node-fetch';
import { validationResult } from 'express-validator';

export const sendSimpleSms = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobile, message } = req.body;

  try {
    const userName = process.env.SMS_USERNAME;
    const apikey = process.env.SMS_APIKEY;

    const requestBody = {
      UserName: userName,
      Apikey: apikey,
      MobileNumber: mobile,
      CampaignId: "null",
      SenderName: "8809601010328",
      TransactionType: "T",
      Message: message,
    };

    const response = await fetch('https://api.mimsms.com/api/SmsSending/SMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('Response from SMS API:', data);

    // Custom status handling based on your need
    if (data.statusCode === '401') {
      return res.status(401).json(data);
    }

    // Send response based on whether the request was successful or not
    return res.status(response.ok ? 200 : 400).json(data);
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ message: 'Failed to send SMS', error });
  }
};