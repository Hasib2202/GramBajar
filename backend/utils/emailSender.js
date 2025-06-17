// utils/emailSender.js
import nodemailer from 'nodemailer';
import { shortenUrl } from '../controllers/urlController.js';
// utils/emailSender.js
const getTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Use port 587 for TLS
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Only for development
    },
    logger: true,
    debug: true
  });
};

// utils/emailSender.js
export const sendVerificationEmail = async (email, token) => {
  try {
    const longUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const shortUrl = await shortenUrl(longUrl);
    
    const mailOptions = {
      from: `GramBajar <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your GramBajar Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #3B945E; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to GramBajar!</h1>
          </div>
          
          <div style="padding: 30px;">
            <p>Hello,</p>
            <p>Thank you for creating an account with GramBajar. Please verify your email address to get started:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${shortUrl}" 
                 style="display: inline-block; 
                        background-color: #57BA98; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 4px; 
                        font-weight: bold;
                        font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p>This verification link will expire in 24 hours.</p>
            
            <p style="font-size: 14px; color: #777; text-align: center;">
              <strong>Why are we asking you to verify?</strong><br>
              This helps us ensure your account security and prevents spam.
            </p>
            
            <p>If you didn't create a GramBajar account, please ignore this email.</p>
            
            <p>Best regards,<br>The GramBajar Team</p>
          </div>
          
          <div style="background-color: #F2F2F2; padding: 20px; text-align: center; color: #182628; font-size: 12px;">
            <p>© ${new Date().getFullYear()} GramBajar. All rights reserved.</p>
            <p>You're receiving this email because you signed up for a GramBajar account.</p>
            <p><a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #65CCB8;">Unsubscribe</a></p>
          </div>
        </div>
      `
    };

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);
    throw error;
  }
};

// Password reset
export const sendPasswordResetEmail = async (email, token) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"GramBajar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset for your GramBajar account.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password</p>
        <p>This link will expire in 10 minutes.</p>
      `
    };

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send password reset email to ${email}:`, error);
    throw error;
  }
};