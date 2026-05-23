const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  // Use Ethereal if EMAIL_USER and EMAIL_PASS are not provided in .env
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail', // or your preferred service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log('Sending email via Ethereal test account...');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"EcoMarketHub Admin" <noreply@ecomarkethub.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML version
  };

  const info = await transporter.sendMail(mailOptions);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
