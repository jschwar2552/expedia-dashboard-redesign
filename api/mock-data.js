export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { chartType } = req.query;
  
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
}