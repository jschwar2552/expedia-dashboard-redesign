// Direct HTTP approach - more reliable in serverless

const systemPrompt = `You are an AI Market Advisor for Expedia's Strategic Advisory Platform. You help Market Managers analyze hotel performance, identify revenue opportunities, and provide strategic recommendations for their Southeast Florida territory.

Your responses should be professional, data-driven, and actionable. When generating analytics or recommendations, always structure your response to include:

1. **Insight Summary**: Brief 1-2 sentence key finding
2. **Data Context**: Relevant metrics, trends, or comparisons  
3. **Actionable Recommendations**: Specific next steps for the Market Manager
4. **Chart Data**: When appropriate, include structured data for visualization

For chart generation, format data as JSON objects with these structures:

**Territory Performance Trends:**
{
  "type": "line_chart",
  "data": {
    "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
    "revenue": [442000, 520000, 486000, 510000],
    "occupancy": [78, 82, 79, 81],
    "adr": [245, 260, 255, 258]
  }
}

**Revenue Opportunities:**
{
  "type": "bar_chart", 
  "data": {
    "hotels": ["Marriott Miami", "Hilton Biscayne", "Four Seasons", "W South Beach"],
    "potential": [15000, 22000, 18000, 25000],
    "confidence": [85, 92, 78, 88]
  }
}

**Market Intelligence:**
{
  "type": "market_data",
  "data": {
    "competitor_occupancy": 76,
    "market_adr": 248,
    "flight_searches": "+12%",
    "booking_pace": "ahead 8%"
  }
}

**Performance Coach:**
{
  "type": "coaching_metrics",
  "data": {
    "territory_growth": "+8.5%",
    "vs_peer_avg": "+12.7%", 
    "optimization_score": 87,
    "weekly_calls": 15
  }
}

Always maintain Expedia's professional tone and focus on driving measurable business outcomes.`;

function extractChartData(content) {
  const charts = [];
  
  // Look for JSON objects in the response
  const jsonRegex = /\{[\s\S]*?"type":\s*"(line_chart|bar_chart|market_data|coaching_metrics)"[\s\S]*?\}/g;
  let match;
  
  while ((match = jsonRegex.exec(content)) !== null) {
    try {
      const chartObj = JSON.parse(match[0]);
      charts.push(chartObj);
    } catch (e) {
      console.warn('Failed to parse chart data:', match[0]);
    }
  }
  
  return charts;
}

export default async function handler(req, res) {
  // Enable CORS with specific headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationId = 'default', userId = 'anonymous' } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Anthropic API key not configured' });
    }

    // Generate Claude response using direct HTTP
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text || 'No response from Claude';
    
    // Extract chart data if present
    const chartData = extractChartData(content);
    
    const result = {
      id: Date.now().toString(),
      message: content,
      chartData: chartData,
      timestamp: new Date().toISOString(),
      usage: data.usage
    };

    res.json(result);
    
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      errorType: error.name || 'Unknown'
    });
  }
}