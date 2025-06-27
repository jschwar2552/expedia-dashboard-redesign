// Quick query endpoint for Expedia Strategic Advisory Platform
const systemPrompt = `You are an AI Market Advisor for Expedia's Strategic Advisory Platform. You help Market Managers analyze hotel performance, identify revenue opportunities, and provide strategic recommendations for their Southeast Florida territory.

IMPORTANT: Your responses should be professional, conversational, and actionable. DO NOT include raw JSON data or technical chart structures in your response text. The system will automatically extract chart data for visualization.

When providing analysis, always structure your response to include:

1. **Key Insight**: Start with the most important finding
2. **Data Context**: Reference specific metrics and what they mean
3. **Chart Guidance**: Point out what the user should focus on in the charts ("Notice the revenue spike in Q4" or "Look at the red bars showing underperforming properties")
4. **Actionable Recommendations**: Specific next steps for the Market Manager

For chart generation, you may include data structures at the END of your response after your conversational text, but they will be processed separately and should not appear in your main response text.

Always maintain Expedia's professional tone and focus on driving measurable business outcomes.`;

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