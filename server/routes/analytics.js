const express = require('express');
const ClaudeClient = require('../claude-client');

const router = express.Router();
const claude = new ClaudeClient();

// Generate chart data for specific analytics
router.post('/generate-chart', async (req, res) => {
  try {
    const { chartType, userQuery, parameters = {} } = req.body;
    
    if (!chartType) {
      return res.status(400).json({ error: 'chartType is required' });
    }

    const chartData = await claude.generateChartUpdate(chartType, userQuery);
    
    if (!chartData || chartData.length === 0) {
      return res.status(404).json({ error: 'No chart data generated' });
    }

    res.json({
      chartType,
      data: chartData,
      timestamp: new Date().toISOString(),
      parameters
    });
    
  } catch (error) {
    console.error('Chart Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate chart data' });
  }
});

// Get mock data for development/testing
router.get('/mock-data/:chartType', (req, res) => {
  const { chartType } = req.params;
  
  const mockData = {
    'territory-performance': {
      type: 'line_chart',
      data: {
        labels: ['Week 45', 'Week 46', 'Week 47', 'Week 48'],
        revenue: [442000, 520000, 486000, 510000],
        occupancy: [78, 82, 79, 81],
        adr: [245, 260, 255, 258]
      }
    },
    'revenue-opportunities': {
      type: 'bar_chart',
      data: {
        hotels: ['Marriott Miami', 'Hilton Biscayne', 'Four Seasons', 'W South Beach'],
        potential: [15000, 22000, 18000, 25000],
        confidence: [85, 92, 78, 88]
      }
    },
    'market-intelligence': {
      type: 'market_data',
      data: {
        competitor_occupancy: 76,
        market_adr: 248,
        flight_searches: '+12%',
        booking_pace: 'ahead 8%',
        events_impact: 'Art Basel +15%',
        weather_factor: 'optimal'
      }
    },
    'performance-coach': {
      type: 'coaching_metrics',
      data: {
        territory_growth: '+8.5%',
        vs_peer_avg: '+12.7%',
        optimization_score: 87,
        weekly_calls: 15,
        action_items: 3,
        success_rate: '94%'
      }
    }
  };

  const data = mockData[chartType];
  if (!data) {
    return res.status(404).json({ error: 'Chart type not found' });
  }

  res.json({
    chartType,
    data: [data],
    timestamp: new Date().toISOString(),
    isMockData: true
  });
});

// Update specific chart with new data
router.put('/update-chart/:chartId', async (req, res) => {
  try {
    const { chartId } = req.params;
    const { query, parameters = {} } = req.body;
    
    // Generate updated chart data based on query
    const chartData = await claude.generateChartUpdate(chartId, query);
    
    res.json({
      chartId,
      data: chartData,
      timestamp: new Date().toISOString(),
      query,
      parameters
    });
    
  } catch (error) {
    console.error('Chart Update Error:', error);
    res.status(500).json({ error: 'Failed to update chart data' });
  }
});

// Get analytics dashboard summary
router.get('/dashboard-summary', async (req, res) => {
  try {
    // Generate summary insights across all chart types
    const summaryQuery = `Provide a brief dashboard summary for Sarah Chen's Southeast Florida territory including:
    - Overall territory performance status
    - Top priority action item
    - Key metric highlight
    - Market condition summary`;
    
    const result = await claude.generateResponse(summaryQuery);
    
    res.json({
      summary: result.response,
      timestamp: new Date().toISOString(),
      chartData: result.chartData
    });
    
  } catch (error) {
    console.error('Dashboard Summary Error:', error);
    res.status(500).json({ error: 'Failed to generate dashboard summary' });
  }
});

// Analytics health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'analytics',
    timestamp: new Date().toISOString(),
    availableCharts: [
      'territory-performance',
      'revenue-opportunities', 
      'market-intelligence',
      'performance-coach'
    ]
  });
});

module.exports = router;