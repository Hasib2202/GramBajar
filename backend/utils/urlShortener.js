// utils/urlShortener.js
import axios from 'axios';

export const shortenUrl = async (longUrl) => {
  try {
    const response = await axios.post(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`,
      {
        dynamicLinkInfo: {
          domainUriPrefix: "https://grambajar.page.link",
          link: longUrl
        }
      }
    );
    return response.data.shortLink;
  } catch (error) {
    console.error('URL shortening failed, using original URL');
    return longUrl;
  }
};