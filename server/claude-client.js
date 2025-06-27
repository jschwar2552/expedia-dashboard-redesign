const Anthropic = require('@anthropic-ai/sdk');

class ClaudeClient {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    this.systemPrompt = `You are an AI Market Advisor for Expedia's Strategic Advisory Platform. You help Market Managers analyze hotel performance, identify revenue opportunities, and provide strategic recommendations for their Southeast Florida territory.

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
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // Build conversation context
      const messages = [
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.3,
        system: this.systemPrompt,
        messages: messages
      });

      const content = response.content[0].text;
      
      // Extract chart data if present
      const chartData = this.extractChartData(content);
      
      return {
        response: content,
        chartData: chartData,
        usage: response.usage
      };
      
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  extractChartData(content) {
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

  async generateChartUpdate(chartType, userQuery) {
    const chartPrompts = {
      'territory-performance': 'Generate territory performance trends data for Miami market showing revenue, occupancy, and ADR over the last 4 weeks.',
      'revenue-opportunities': 'Identify top revenue optimization opportunities for hotels in Southeast Florida territory with potential impact and confidence scores.',
      'market-intelligence': 'Provide current market intelligence including competitor data, flight searches, and booking pace for Miami market.',
      'performance-coach': 'Generate performance coaching metrics showing territory growth, peer comparisons, and optimization scores.'
    };

    const prompt = chartPrompts[chartType] || `Generate ${chartType} data based on: ${userQuery}`;
    
    try {
      const result = await this.generateResponse(prompt);
      return result.chartData;
    } catch (error) {
      console.error(`Failed to generate chart data for ${chartType}:`, error);
      return null;
    }
  }
}

module.exports = ClaudeClient;