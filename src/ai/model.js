const { OpenAI } = require('openai');
const logger = require('../utils/logger');
const botConfig = require('../config/botConfig');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateResponse(message) {
  try {
    logger.info('Starting OpenAI request with message:', JSON.stringify(message));
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const completion = await openai.chat.completions.create({
      model: botConfig.ai.model.name,
      messages: [
        { role: "system", content: botConfig.ai.model.systemPrompt },
        { role: "user", content: message }
      ],
      temperature: botConfig.ai.model.temperature,
      max_tokens: botConfig.ai.model.maxTokens
    });

    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      logger.error('Invalid response structure from OpenAI:', JSON.stringify(completion));
      throw new Error('Invalid response from OpenAI');
    }

    logger.info('Successfully received OpenAI response');
    return completion.choices[0].message.content;
  } catch (error) {
    logger.error('Error in OpenAI request:', error);
    logger.error('Error details:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { generateResponse };