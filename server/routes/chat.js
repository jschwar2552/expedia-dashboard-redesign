const express = require('express');
const ClaudeClient = require('../claude-client');
const { broadcastToClients } = require('../websocket');

const router = express.Router();
const claude = new ClaudeClient();

// Store conversation history (in production, use Redis or database)
const conversations = new Map();

// Send message to Claude and get response
router.post('/message', async (req, res) => {
  try {
    const { message, conversationId = 'default', userId = 'anonymous' } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Get or initialize conversation history
    const conversationKey = `${userId}_${conversationId}`;
    if (!conversations.has(conversationKey)) {
      conversations.set(conversationKey, []);
    }
    const history = conversations.get(conversationKey);

    // Add user message to history
    history.push({ role: 'user', content: message });

    // Generate Claude response
    const result = await claude.generateResponse(message, history);
    
    // Add Claude response to history
    history.push({ role: 'assistant', content: result.response });

    // Keep history manageable (last 20 messages)
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    // Prepare response
    const response = {
      id: Date.now().toString(),
      message: result.response,
      chartData: result.chartData,
      timestamp: new Date().toISOString(),
      usage: result.usage
    };

    // Broadcast to WebSocket clients for real-time updates
    broadcastToClients(JSON.stringify({
      type: 'chat_response',
      data: response
    }));

    res.json(response);
    
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get conversation history
router.get('/history/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId = 'anonymous' } = req.query;
    
    const conversationKey = `${userId}_${conversationId}`;
    const history = conversations.get(conversationKey) || [];
    
    res.json({
      conversationId,
      messages: history,
      messageCount: history.length
    });
    
  } catch (error) {
    console.error('History API Error:', error);
    res.status(500).json({ error: 'Failed to retrieve conversation history' });
  }
});

// Clear conversation history
router.delete('/history/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId = 'anonymous' } = req.query;
    
    const conversationKey = `${userId}_${conversationId}`;
    conversations.delete(conversationKey);
    
    res.json({ message: 'Conversation history cleared' });
    
  } catch (error) {
    console.error('Clear History API Error:', error);
    res.status(500).json({ error: 'Failed to clear conversation history' });
  }
});

// Quick query endpoints for suggested queries
router.post('/quick-query', async (req, res) => {
  try {
    const { queryType } = req.body;
    
    const quickQueries = {
      'hotels-attention': 'Which hotels in my Southeast Florida territory need immediate attention this week based on performance metrics?',
      'revenue-optimization': 'Show me the top 3 revenue optimization opportunities for Miami Beach hotels with highest potential impact.',
      'south-beach-trends': 'Analyze South Beach performance trends over the last 4 weeks and identify any concerning patterns.',
      'competitive-analysis': 'How is my territory performing compared to Orlando and Tampa markets? What can we learn from their strategies?'
    };
    
    const query = quickQueries[queryType];
    if (!query) {
      return res.status(400).json({ error: 'Invalid query type' });
    }
    
    // Process the quick query
    const result = await claude.generateResponse(query);
    
    const response = {
      id: Date.now().toString(),
      query: query,
      message: result.response,
      chartData: result.chartData,
      timestamp: new Date().toISOString(),
      type: 'quick_query'
    };
    
    // Broadcast to WebSocket clients
    broadcastToClients(JSON.stringify({
      type: 'quick_query_response',
      data: response
    }));
    
    res.json(response);
    
  } catch (error) {
    console.error('Quick Query API Error:', error);
    res.status(500).json({ error: 'Failed to process quick query' });
  }
});

module.exports = router;