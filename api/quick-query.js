// Quick query endpoint for Expedia Strategic Advisory Platform
const systemPrompt = `You are Sarah's AI Market Advisor for Expedia's Strategic Advisory Platform. Keep responses concise, clear, and actionable.

RESPONSE FORMAT (3-4 sentences max):

**🔍 Key Insight:** [One clear finding]
**📊 What to Notice:** [Point to specific chart elements]
**🎯 Action Required:** [1-2 specific next steps]

GUIDELINES:
- Be conversational and direct
- Bold important metrics and actions
- NO technical jargon or JSON data
- Reference chart updates happening automatically
- Focus on business impact

EXAMPLE RESPONSE:
**🔍 Key Insight:** Your territory dropped to **7th place** with concerning performance declines.
**📊 What to Notice:** Check the red declining bars in your performance chart and the **5 critical opportunities** now highlighted.
**🎯 Action Required:** Prioritize **Four Seasons Miami** (\$680K opportunity, 95% confidence) and **W South Beach** - both need immediate rate optimization.

Keep it short, bold the important stuff, and drive action.`;

const quickQueries = {
  'hotels-attention': 'Which hotels in my Southeast Florida territory need immediate attention this week based on performance metrics?',
  'south-beach-trends': 'Show me South Beach performance trends and market opportunities for the next 30 days',
  'revenue-optimization': 'What are the top revenue optimization opportunities across my hotel portfolio right now?',
  'competitive-analysis': 'Provide competitive analysis comparing my territory performance vs. Marriott and Hilton properties'
};

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
    const { queryType } = req.body;
    
    if (!queryType || !quickQueries[queryType]) {
      return res.status(400).json({ error: 'Invalid query type' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Anthropic API key not configured' });
    }

    const query = quickQueries[queryType];

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
            content: query
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
      query: query,
      message: content,
      chartData: chartData,
      timestamp: new Date().toISOString(),
      usage: data.usage
    };

    res.json(result);
    
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process quick query',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      errorType: error.name || 'Unknown'
    });
  }
}