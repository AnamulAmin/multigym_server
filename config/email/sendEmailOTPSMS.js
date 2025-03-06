async function sendEmailOTP_SMS(recipients, otp) {
  const profileData = await Branch.findOne({ branch: data.branch });

  console.log(profileData, "profileData", data, "data");
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Multigympremium</title>
  </head>
  
  <body style="width: 100%; height: 100%; background: #f2f2f2; margin: 0; overflow-x: hidden; font-size: 16px;">
      <div style="width: 100%; height: 100%; background: #f2f2f2; margin: 0; overflow-x: hidden; font-size: 16px;">
                <h2 style="font-size: 20px; color: #333333; font-weight: bold; margin-bottom: 10px;">${profileData?.name}</h2>
                <p style="font-size: 16px; color: #333333; margin-bottom: 10px;">${profileData?.address}</p>
                <p style="font-size: 16px; color: #333333; margin-bottom: 10px;">${profileData?.address}</p>mobile}</p>
                <p style="font-size: 16px; color: #333333; margin-bottom: 10px;">${profileData?.address}</p>email}</p>
                <hr className="my-2" />
            </div>
  <h2 style="font-size: 20px; color: #333333; font-weight: bold; margin-bottom: 10px;">OTP</h2>
      <p style="font-size: 16px; color: #333333; margin-bottom: 10px;">Your OTP code is ${otp}. It will expire in 5 minutes.</p>
  </body>
  
  </html>`;

  await sendEmailWithResend(
    recipients,
    `${profileData?.name} - Invoice`,
    template
  );
}

export default sendEmailOTP_SMS;
