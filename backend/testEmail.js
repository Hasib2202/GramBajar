// backend/testEmail.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const testEmail = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"GramBajar" <${process.env.EMAIL_USER}>`,
      to: 'gpacerp04@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email from GramBajar'
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

testEmail();