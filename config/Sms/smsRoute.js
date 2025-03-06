import express from 'express';
import { validationResult } from 'express-validator';

const createSmsRoute = () => {
  const router = express.Router();

  router.post('/send-sms', async (req, res) => {
    console.log('SMS endpoint hit'); // Log message to indicate API hit

    const fetch = (await import('node-fetch')).default;

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
        CampaignId: 'null',
        SenderName: '8809601010328',
        TransactionType: 'T',
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

      if (data.statusCode === '401') {
        return res.status(401).json(data);
      }

      // Send response based on whether the request was successful or not
      return res.status(response.ok ? 200 : 400).json(data);
    } catch (error) {
      console.error('Error sending SMS:', error);
      return res.status(500).json({ message: 'Failed to send SMS', error });
    }
  });

  return router;
};

export default createSmsRoute;
