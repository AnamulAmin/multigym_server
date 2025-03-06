import net from "net";
import tls from "tls";
const smtpHost = 'mail.multigympremium.com';
const smtpPort = 587;
const smtpUsername = 'no-reply@multigympremium.com';
const smtpPassword = 'bToYy}A&cAX3Nbp5';

export async function sendPackageEmail({ data }) {
    const {
        member_name,
        branch,
        package_name,
        duration,
        start_date,
        end_date,
        packageFee,
        admissionFee,
        amount,
        discount,
        payment_method,
        receipt_no,
        transaction_date,
        login_name,
        member_email
    } = data;

    const from = smtpUsername;

    const subject = "Your Membership Package Details";

    // Constructing the email message with enhanced styling
    const message = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            h1, h2 {
              color: #f0ba3e;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
              text-align: center;
            }
            h2 {
              font-size: 20px;
              margin-top: 30px;
              margin-bottom: 10px;
              color: black;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              border: 2px solid #f0ba3e;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 12px;
              text-align: left;
              font-size: 16px;
            }
            th {
              background-color: #f8f8f8;
              font-weight: bold;
            }
            td {
              background-color: #ffffff;
            }
            td:nth-child(odd) {
              background-color: #f9f9f9;
            }
            tr:hover td {
              background-color: #f1f1f1;
            }
            footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #888;
            }
            footer strong {
              color: #f0ba3e;
            }
          </style>
        </head>
        <body>
          <h1>Membership Package Confirmation</h1>
          <p>Dear <strong>${member_name}</strong>,</p>
          <p>We are pleased to confirm your membership package at the <strong>${branch} branch</strong>. Below are the details of your membership:</p>
  
          <h2>Package Details</h2>
          <table>
            <tr><td><strong>Package Name:</strong></td><td>${package_name}</td></tr>
            <tr><td><strong>Duration (Days):</strong></td><td>${duration}</td></tr>
            <tr><td><strong>Start Date:</strong></td><td>${start_date}</td></tr>
            <tr><td><strong>End Date:</strong></td><td>${end_date}</td></tr>
          </table>
  
          <h2>Payment Details</h2>
          <table>
            <tr><td><strong>Total Package Fee:</strong></td><td>${packageFee} TK</td></tr>
            <tr><td><strong>Admission Fee:</strong></td><td>${admissionFee} TK</td></tr>
            <tr><td><strong>Total Amount:</strong></td><td>${amount} TK</td></tr>
            <tr><td><strong>Discount:</strong></td><td>${discount} TK</td></tr>
            <tr><td><strong>Payment Method:</strong></td><td>${payment_method}</td></tr>
            <tr><td><strong>Receipt No:</strong></td><td>${receipt_no}</td></tr>
            <tr><td><strong>Transaction Date:</strong></td><td>${transaction_date}</td></tr>
          </table>
  
          <p>If you have any questions or need further assistance, please feel free to reach out to us.</p>
          <p>Thank you for choosing our gym!</p>
  
          <footer>
            <p>Best Regards,</p>
            <p><strong>${login_name}</strong> (Staff)</p>
            <p>MultiGym Premium</p>
          </footer>
        </body>
      </html>
    `;

    let resPromise;

    new Promise((resolve, reject) => {
        const socket = net.createConnection(smtpPort, smtpHost, () => {
            console.log('Connected to SMTP server');
            socket.write(`EHLO ${smtpHost}\r\n`);
        });

        let step = 0;

        socket.on('data', (data) => {
            console.log('Server response:', data.toString());

            if (data.toString().includes('220') && step === 0) {
                step++;
                socket.write(`STARTTLS\r\n`);
            } else if (data.toString().includes('220') && step === 1) {
                const secureSocket = tls.connect(
                    { socket: socket, host: smtpHost, port: smtpPort, rejectUnauthorized: false },
                    () => {
                        console.log('TLS connection established');
                        secureSocket.write(`EHLO ${smtpHost}\r\n`);
                    }
                );

                secureSocket.on('data', (data) => {
                    console.log('TLS Server response:', data.toString());

                    if (data.toString().includes('250-AUTH') && step === 1) {
                        step++;
                        secureSocket.write('AUTH LOGIN\r\n');
                    } else if (data.toString().includes('334') && step === 2) {
                        step++;
                        secureSocket.write(Buffer.from(smtpUsername).toString('base64') + '\r\n');
                    } else if (data.toString().includes('334') && step === 3) {
                        step++;
                        secureSocket.write(Buffer.from(smtpPassword).toString('base64') + '\r\n');
                    } else if (data.toString().includes('235') && step === 4) {
                        step++;
                        secureSocket.write(`MAIL FROM:<${from}>\r\n`);
                    } else if (data.toString().includes('250') && step === 5) {
                        step++;
                        secureSocket.write(`RCPT TO:<${member_email}>\r\n`);
                    } else if (data.toString().includes('250') && step === 6) {
                        step++;
                        secureSocket.write(`DATA\r\n`);
                    } else if (data.toString().includes('354') && step === 7) {
                        secureSocket.write(`Subject: ${subject}\r\n`);
                        secureSocket.write(`From: ${from}\r\n`);
                        secureSocket.write(`To: ${member_email}\r\n`);
                        secureSocket.write(`Content-Type: text/html; charset=UTF-8\r\n`);
                        secureSocket.write(`\r\n${message}\r\n.\r\n`);
                        step++;
                    } else if (data.toString().includes('250') && step === 8) {
                        secureSocket.write('QUIT\r\n');
                        console.log('Email sent successfully!');
                        secureSocket.end();
                        resolve('Email sent successfully');
                    }
                });

                secureSocket.on('error', (err) => {
                    console.error('TLS connection error:', err);
                    reject(err);
                });
            }
        });

        socket.on('error', (err) => {
            console.error('SMTP connection error:', err);
            reject(err);
        });
    })
        .then(() => { resPromise = "Email sent successfully"  })
        // .then(() =>  res.status(200).json({ message: 'Email sent successfully' }))
        .catch((err) => resPromise = "Failed to send email");
        // .catch((err) => res.status(500).json({ message: 'Failed to send email', error: err.message }));

        return resPromise
}

// export async function sendPackageEmail({data}) {
//     // Assuming req.body contains the member data and email details
//     const { member_name, branch, package_name, duration, start_date, end_date, packageFee, admissionFee, amount, discount, payment_method, receipt_no, transaction_date, login_name } = data;

//     // HTML Email Template
//     const emailTemplate = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Membership Package Details</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 background-color: #f4f4f4;
//                 margin: 0;
//                 padding: 0;
//             }
//             .email-container {
//                 background-color: #ffffff;
//                 max-width: 600px;
//                 margin: 20px auto;
//                 padding: 20px;
//                 border-radius: 10px;
//                 box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//             }
//             .header {
//                 background-color: #f0ba3e;
//                 color: white;
//                 padding: 20px;
//                 text-align: center;
//                 border-radius: 10px 10px 0 0;
//             }
//             .content {
//                 padding: 20px;
//             }
//             .content h2 {
//                 color: #333;
//             }
//             .details-table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin: 20px 0;
//             }
//             .details-table th, .details-table td {
//                 text-align: left;
//                 padding: 10px;
//                 border-bottom: 1px solid #ddd;
//             }
//             .details-table th {
//                 background-color: #f8f8f8;
//             }
//             .footer {
//                 text-align: center;
//                 color: #888;
//                 margin-top: 20px;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="email-container">
//             <div class="header">
//                 <h1>Membership Package Confirmation</h1>
//             </div>
//             <div class="content">
//                 <p>Dear <strong>${member_name}</strong>,</p>
//                 <p>We are pleased to confirm your membership package at <strong>${branch} branch</strong>. Below are the details of your membership:</p>

//                 <h2>Package Details</h2>
//                 <table class="details-table">
//                     <tr>
//                         <th>Package Name</th>
//                         <td>${package_name}</td>
//                     </tr>
//                     <tr>
//                         <th>Duration (Days)</th>
//                         <td>${duration}</td>
//                     </tr>
//                     <tr>
//                         <th>Start Date</th>
//                         <td>${start_date}</td>
//                     </tr>
//                     <tr>
//                         <th>End Date</th>
//                         <td>${end_date}</td>
//                     </tr>
//                 </table>

//                 <h2>Payment Details</h2>
//                 <table class="details-table">
//                     <tr>
//                         <th>Total Package Fee</th>
//                         <td>${packageFee} TK</td>
//                     </tr>
//                     <tr>
//                         <th>Admission Fee</th>
//                         <td>${admissionFee} TK</td>
//                     </tr>
//                     <tr>
//                         <th>Total Amount</th>
//                         <td>${amount} TK</td>
//                     </tr>
//                     <tr>
//                         <th>Discount</th>
//                         <td>${discount} TK</td>
//                     </tr>
//                     <tr>
//                         <th>Payment Method</th>
//                         <td>${payment_method}</td>
//                     </tr>
//                     <tr>
//                         <th>Receipt No.</th>
//                         <td>${receipt_no}</td>
//                     </tr>
//                     <tr>
//                         <th>Transaction Date</th>
//                         <td>${transaction_date}</td>
//                     </tr>
//                 </table>

//                 <p>If you have any questions or need further assistance, please feel free to reach out to us.</p>
//                 <p>Thank you for choosing our gym!</p>
//             </div>

//             <div class="footer">
//                 <p>Best Regards,</p>
//                 <p><strong>${login_name}</strong> (Staff)</p>
//                 <p>MultiGym Premium</p>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;

//     try {
//         // Sending the email
//         const response = await axios.post(
//             "https://api.resend.com/emails",
//             {
//                 from: "noreply@multigympremium.com",
//                 to: data.member_email,
//                 subject:"Your Membership Package Details",
//                 html: emailTemplate,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.RESEND_API_KEY_EMAIL}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         // Sending success response back to client
//         // res.status(200).json({ message: "Email sent successfully!" });
//     } catch (err) {
//         console.error("Error sending email:", err);
//         // res.status(500).json({ error: "Failed to send email." });
//     }
// }



// export async function textEmail(req, res) {
//   const { to, subject, message } = req.body;
//   const from = smtpUsername;

//   return new Promise((resolve, reject) => {
//     const socket = net.createConnection(smtpPort, smtpHost, () => {
//       console.log('Connected to SMTP server');
//       socket.write(`EHLO ${smtpHost}\r\n`);
//     });

//     let step = 0;

//     socket.on('data', (data) => {
//       console.log('Server response:', data.toString());

//       if (data.toString().includes('220') && step === 0) {
//         step++;
//         socket.write(`STARTTLS\r\n`);
//       } else if (data.toString().includes('220') && step === 1) {
//         const secureSocket = tls.connect(
//           { socket: socket, host: smtpHost, port: smtpPort, rejectUnauthorized: false },
//           () => {
//             console.log('TLS connection established');
//             secureSocket.write(`EHLO ${smtpHost}\r\n`);
//           }
//         );

//         secureSocket.on('data', (data) => {
//           console.log('TLS Server response:', data.toString());

//           if (data.toString().includes('250-AUTH') && step === 1) {
//             step++;
//             secureSocket.write('AUTH LOGIN\r\n');
//           } else if (data.toString().includes('334') && step === 2) {
//             step++;
//             secureSocket.write(Buffer.from(smtpUsername).toString('base64') + '\r\n');
//           } else if (data.toString().includes('334') && step === 3) {
//             step++;
//             secureSocket.write(Buffer.from(smtpPassword).toString('base64') + '\r\n');
//           } else if (data.toString().includes('235') && step === 4) {
//             step++;
//             secureSocket.write(`MAIL FROM:<${from}>\r\n`);
//           } else if (data.toString().includes('250') && step === 5) {
//             step++;
//             secureSocket.write(`RCPT TO:<${to}>\r\n`);
//           } else if (data.toString().includes('250') && step === 6) {
//             step++;
//             secureSocket.write(`DATA\r\n`);
//           } else if (data.toString().includes('354') && step === 7) {
//             secureSocket.write(`Subject: ${subject}\r\n`);
//             secureSocket.write(`From: ${from}\r\n`);
//             secureSocket.write(`To: ${to}\r\n`);
//             secureSocket.write(`\r\n${message}\r\n.\r\n`);
//             step++;
//           } else if (data.toString().includes('250') && step === 8) {
//             secureSocket.write('QUIT\r\n');
//             console.log('Email sent successfully!');
//             secureSocket.end();
//             resolve('Email sent successfully');
//           }
//         });

//         secureSocket.on('error', (err) => {
//           console.error('TLS connection error:', err);
//           reject(err);
//         });
//       }
//     });

//     socket.on('error', (err) => {
//       console.error('SMTP connection error:', err);
//       reject(err);
//     });
//   })
//     .then(() => res.status(200).json({ message: 'Email sent successfully' }))
//     .catch((err) => res.status(500).json({ message: 'Failed to send email', error: err.message }));
// }
