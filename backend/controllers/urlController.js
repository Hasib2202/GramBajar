// controllers/urlController.js
import Url from '../models/Url.js';
import crypto from 'crypto';

export const shortenUrl = async (longUrl) => {
  // Create a 6-character short ID
  const shortId = crypto.randomBytes(3).toString('hex');
  
  await Url.create({
    longUrl,
    shortId
  });
  
  return `${process.env.BACKEND_URL}/r/${shortId}`;
};

export const redirectUrl = async (req, res) => {
  const { shortId } = req.params;
  
  try {
    const url = await Url.findOne({ shortId });
    if (!url) return res.status(404).send('URL not found');
    
    res.redirect(url.longUrl);
  } catch (error) {
    res.status(500).send('Server error');
  }
};