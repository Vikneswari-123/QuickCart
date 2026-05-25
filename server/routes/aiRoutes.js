import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/generate-description', async (req, res) => {
  try {
    const { productName, category, price } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      messages: [
        {
          role: 'system',
          content: `You are a product copywriter for an e-commerce store.
          Write compelling, concise product descriptions in 2-3 sentences.
          Focus on benefits. Respond with only the description, nothing else.`
        },
        {
          role: 'user',
          content: `Write a product description for:
          Name: ${productName}
          Category: ${category || 'General'}
          Price: ${price || 'Not specified'}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const description = response.choices[0].message.content;
    res.json({ description });

  } catch (error) {
    console.error('Groq error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate description',
      details: error.message 
    });
  }
});

export default router;