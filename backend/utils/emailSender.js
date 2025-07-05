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
      from: `GramBajar <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #F57C00; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset Request</h1>
          </div>

          <div style="padding: 30px;">
            <p>Hello,</p>
            <p>We received a request to reset your GramBajar account password. If you made this request, click the button below:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; 
                        background-color: #EF6C00; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 4px; 
                        font-weight: bold;
                        font-size: 16px;">
                Reset Password
              </a>
            </div>

            <p>This password reset link will expire in 10 minutes.</p>

            <p style="font-size: 14px; color: #777; text-align: center;">
              <strong>Didn’t request a password reset?</strong><br>
              If you didn’t request this, you can safely ignore this email.
            </p>

            <p>Best regards,<br>The GramBajar Team</p>
          </div>

          <div style="background-color: #F2F2F2; padding: 20px; text-align: center; color: #182628; font-size: 12px;">
            <p>© ${new Date().getFullYear()} GramBajar. All rights reserved.</p>
            <p>You are receiving this email because a password reset was requested for your GramBajar account.</p>
            <p><a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #FF9800;">Unsubscribe</a></p>
          </div>
        </div>
      `
    };

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send password reset email to ${email}:`, error);
    throw error;
  }
};

// utils/emailTemplates.js
export const passwordResetTemplate = (resetToken) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #4f46e5;">Password Reset Request</h2>
    <p>We received a request to reset your password. Click the link below to proceed:</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
         style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
    </p>
    <p>If you didn't request this, please ignore this email.</p>
    <p style="margin-top: 30px; font-size: 0.9em; color: #6b7280;">
      This link will expire in 10 minutes.
    </p>
  </div>
`;

export const verificationTemplate = (verificationToken) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #4f46e5;">Verify Your Email</h2>
    <p>Thank you for registering! Please verify your email address to activate your account:</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}" 
         style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a>
    </p>
    <p style="margin-top: 30px; font-size: 0.9em; color: #6b7280;">
      This link will expire in 24 hours.
    </p>
  </div>
`;

// Order confirmation email
export const sendOrderConfirmationEmail = async (email, order) => {
  try {
    // Calculate subtotal and total discount
    let subtotal = 0;
    let totalDiscount = 0;
    
    const itemsHtml = order.products.map(item => {
      const price = Number(item.price);
      const originalPrice = Number(item.originalPrice);
      const discount = item.discount || 0;
      const itemTotal = price * item.quantity;
      const itemDiscount = (originalPrice - price) * item.quantity;
      
      // Add to totals
      subtotal += originalPrice * item.quantity;
      totalDiscount += itemDiscount;

      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            ${item.productId.title}
            ${discount > 0 ? `
              <br><span style="color: #e53935; font-size: 12px;">
                ${discount}% OFF
              </span>
            ` : ''}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
            ${discount > 0 ? `
              <div style="text-decoration: line-through; color: #999; font-size: 12px;">
                ৳${originalPrice.toFixed(2)}
              </div>
            ` : ''}
            <div>৳${price.toFixed(2)}</div>
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
            ৳${itemTotal.toFixed(2)}
          </td>
        </tr>
      `;
    }).join('');

    const totalAmount = Number(order.totalAmount);

    const mailOptions = {
      from: `GramBajar <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your GramBajar Order Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
          <div style="background-color: #3B945E; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
            <p style="color: white; opacity: 0.8; margin: 5px 0 0;">
              Order #${order._id.toString().slice(-8).toUpperCase()}
            </p>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <p>Hello ${order.consumerId.name},</p>
            <p>Thank you for your order! We're preparing your items for shipment.</p>
            
            <h3 style="color: #182628; margin-top: 30px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
              Order Summary
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; background-color: #eee;">Product</th>
                  <th style="text-align: center; padding: 8px; background-color: #eee;">Qty</th>
                  <th style="text-align: right; padding: 8px; background-color: #eee;">Unit Price</th>
                  <th style="text-align: right; padding: 8px; background-color: #eee;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <span>৳${subtotal.toFixed(2)}</span>
              </div>
              ${totalDiscount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #e53935;">
                  <span>Discount:</span>
                  <span>-৳${totalDiscount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
                <span>Total:</span>
                <span>৳${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <h3 style="color: #182628; margin-top: 30px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
              Delivery Information
            </h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <p><strong>Name:</strong> ${order.consumerId.name}</p>
              <p><strong>Contact:</strong> ${order.contact}</p>
              <p><strong>Address:</strong> ${order.address}</p>
              <p><strong>Status:</strong> 
                <span style="color: ${order.status === 'Paid' ? '#388e3c' : '#f57c00'}">
                  ${order.status}
                </span>
              </p>
            </div>
            
            <p style="margin-top: 20px;">
              We'll notify you when your order ships. You can check the status of your order anytime in your account.
            </p>
            <p>Thank you for shopping with GramBajar!</p>
          </div>
          
          <div style="background-color: #182628; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>© ${new Date().getFullYear()} GramBajar. All rights reserved.</p>
            <p>This email was sent to ${email} because you placed an order on GramBajar.</p>
          </div>
        </div>
      `
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    throw error;
  }
};