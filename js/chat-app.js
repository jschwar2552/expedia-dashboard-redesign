class ExpediaChat {
  constructor() {
    // Use local API when available, otherwise Vercel backend
    this.apiBase = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api' 
      : 'https://expedia-strategic-advisory-platform-g7veowjpo.vercel.app/api';
    
    this.wsUrl = null; // WebSocket not supported in serverless
    this.demoMode = false;
    
    this.conversationId = 'miami-market-' + Date.now();
    this.userId = 'sarah-chen';
    this.ws = null;
    this.charts = {};
    
    this.initializeApp();
  }

  async initializeApp() {
    this.setupEventListeners();
    if (this.wsUrl) {
      this.initializeWebSocket();
    }
    await this.loadInitialChartData();
    // Welcome message already exists in HTML, don't duplicate
  }

  setupEventListeners() {
    // Chat form submission
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
          this.sendMessage(message);
          chatInput.value = '';
        }
      });
    }

    // Quick query buttons
    document.querySelectorAll('.query-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const queryType = btn.dataset.query;
        this.handleQuickQuery(queryType);
      });
    });

    // Enter key handling
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          chatForm.dispatchEvent(new Event('submit'));
        }
      });
    }
  }

  initializeWebSocket() {
    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log('🔌 Connected to WebSocket');
        this.updateConnectionStatus(true);
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      };
      
      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.updateConnectionStatus(false);
        // Attempt reconnection after 5 seconds
        setTimeout(() => this.initializeWebSocket(), 5000);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateConnectionStatus(false);
      };
      
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.updateConnectionStatus(false);
    }
  }

  async sendMessage(message) {
    try {
      this.addMessageToChat('user', message);
      this.showTypingIndicator();

      const response = await fetch(`${this.apiBase}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId: this.conversationId,
          userId: this.userId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.hideTypingIndicator();
      this.addMessageToChat('assistant', data.message);
      
      // Update charts if data is provided
      if (data.chartData && data.chartData.length > 0) {
        this.updateChartsFromData(data.chartData);
      } else {
        // Generate contextual chart updates based on message content
        const contextualCharts = this.extractChartDataFromMessage(data.message);
        if (contextualCharts.length > 0) {
          this.updateChartsFromData(contextualCharts);
        }
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      this.hideTypingIndicator();
      this.addMessageToChat('system', `Error: ${error.message || 'Unknown error occurred'}`);
    }
  }

  async handleQuickQuery(queryType) {
    try {
      this.showTypingIndicator();

      // Temporarily use the chat endpoint until quick-query deploys
      const quickQueries = {
        'hotels-attention': 'Which hotels in my Southeast Florida territory need immediate attention this week based on performance metrics?',
        'south-beach-trends': 'Show me South Beach performance trends and market opportunities for the next 30 days',
        'revenue-optimization': 'What are the top revenue optimization opportunities across my hotel portfolio right now?',
        'competitive-analysis': 'Provide competitive analysis comparing my territory performance vs. Marriott and Hilton properties'
      };

      const query = quickQueries[queryType] || 'Please provide market analysis for Southeast Florida territory.';

      const response = await fetch(`${this.apiBase}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          conversationId: this.conversationId,
          userId: this.userId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.hideTypingIndicator();
      
      this.addMessageToChat('user', query);
      this.addMessageToChat('assistant', data.message);
      
      if (data.chartData && data.chartData.length > 0) {
        this.updateChartsFromData(data.chartData);
      } else {
        // Generate contextual chart updates for quick queries
        const contextualCharts = this.extractChartDataFromMessage(data.message);
        if (contextualCharts.length > 0) {
          this.updateChartsFromData(contextualCharts);
        }
      }
      
    } catch (error) {
      console.error('Error handling quick query:', error);
      this.hideTypingIndicator();
      this.addMessageToChat('system', `Error processing query: ${error.message || 'Unknown error occurred'}`);
    }
  }

  async loadInitialChartData() {
    const chartTypes = ['territory-performance', 'revenue-opportunities', 'market-intelligence', 'performance-coach'];
    
    for (const chartType of chartTypes) {
      try {
        const response = await fetch(`${this.apiBase}/analytics/mock-data/${chartType}`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          this.updateChart(chartType, data.data[0]);
        }
      } catch (error) {
        console.error(`Failed to load ${chartType} data:`, error);
      }
    }
  }

  updateChartsFromData(chartDataArray) {
    console.log('🔄 Updating charts with new data:', chartDataArray);
    
    chartDataArray.forEach(chartData => {
      const chartType = this.getChartTypeFromData(chartData);
      if (chartType) {
        // Add visual update indicator
        this.showChartUpdateIndicator(chartType);
        
        // Update chart with new data
        this.updateChart(chartType, chartData);
        
        // Log the update for debugging
        console.log(`📊 Updated ${chartType} chart with:`, chartData);
      }
    });
  }

  getChartTypeFromData(chartData) {
    // Map chart data types to chart containers
    const typeMap = {
      'line_chart': 'territory-performance',
      'bar_chart': 'revenue-opportunities', 
      'market_data': 'market-intelligence',
      'coaching_metrics': 'performance-coach'
    };
    
    return typeMap[chartData.type];
  }

  updateChart(chartType, data) {
    const container = document.getElementById(chartType);
    if (!container) {
      console.warn(`⚠️ Chart container not found: ${chartType}`);
      return;
    }

    // Store chart data
    this.charts[chartType] = data;
    
    // Add loading state
    const chartContent = container.querySelector('.chart-content');
    if (chartContent) {
      chartContent.style.opacity = '0.5';
      chartContent.style.transition = 'opacity 0.3s ease';
    }
    
    // Update based on chart type with slight delay for smooth transition
    setTimeout(() => {
      switch (chartType) {
        case 'territory-performance':
          this.renderLineChart(container, data);
          break;
        case 'revenue-opportunities':
          this.renderBarChart(container, data);
          break;
        case 'market-intelligence':
          this.renderMarketData(container, data);
          break;
        case 'performance-coach':
          this.renderCoachingMetrics(container, data);
          break;
      }
      
      // Restore opacity
      if (chartContent) {
        chartContent.style.opacity = '1';
      }
    }, 150);
  }

  renderLineChart(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    // Comprehensive Territory Performance Data Structure
    const territoryData = data.data || {
      timeframes: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      revenue: [2850000, 3120000, 2980000, 3450000, 3780000, 4200000],
      occupancy: [78, 82, 79, 86, 89, 92],
      adr: [285, 295, 298, 310, 325, 340],
      revpar: [222, 242, 235, 267, 289, 313],
      market_share: [23.5, 24.1, 23.8, 25.2, 26.1, 27.3],
      competitor_gap: [+12, +15, +8, +18, +22, +28],
      forecasted_next: [4650000, 4980000],
      territory_rank: 3, // out of 15 territories
      ytd_growth: 18.7,
      pipeline_health: 87
    };

    const { timeframes, revenue, occupancy, adr, revpar, market_share, competitor_gap, forecasted_next, territory_rank, ytd_growth, pipeline_health } = territoryData;
    
    const maxRevenue = Math.max(...revenue, ...forecasted_next);
    const maxOccupancy = Math.max(...occupancy);
    const maxADR = Math.max(...adr);
    
    // Generate comprehensive chart with multiple metrics
    const revenuePoints = this.generateLinePath(revenue, maxRevenue, 400, 120, '#003580', false, 3);
    const occupancyPoints = this.generateLinePath(occupancy.map(x => x * (maxRevenue/100)), maxRevenue, 400, 120, '#0066cc', true, 2);
    const revparPoints = this.generateLinePath(revpar.map(x => x * (maxRevenue/350)), maxRevenue, 400, 120, '#ff6b35', false, 2);
    
    // Forecast projection
    const forecastStart = revenue[revenue.length - 1];
    const forecastPoints = this.generateLinePath([forecastStart, ...forecasted_next], maxRevenue, 200, 120, '#28a745', true, 2);
    
    chartContent.innerHTML = `
      <div class="territory-dashboard" style="height: 240px; padding: var(--space-md);">
        <!-- Header Metrics -->
        <div class="metrics-header" style="display: flex; justify-content: space-between; margin-bottom: var(--space-md); padding: var(--space-sm); background: linear-gradient(135deg, rgba(0,53,128,0.05) 0%, rgba(0,53,128,0.02) 100%); border-radius: var(--radius-md);">
          <div class="metric-card">
            <div class="metric-value" style="font-size: 18px; font-weight: bold; color: var(--expedia-blue);">$${(revenue[revenue.length-1]/1000000).toFixed(1)}M</div>
            <div class="metric-label" style="font-size: 11px; color: var(--text-secondary);">Current Revenue</div>
          </div>
          <div class="metric-card">
            <div class="metric-value" style="font-size: 18px; font-weight: bold; color: var(--success-green);">+${ytd_growth}%</div>
            <div class="metric-label" style="font-size: 11px; color: var(--text-secondary);">YTD Growth</div>
          </div>
          <div class="metric-card">
            <div class="metric-value" style="font-size: 18px; font-weight: bold; color: var(--expedia-blue);">#${territory_rank}/15</div>
            <div class="metric-label" style="font-size: 11px; color: var(--text-secondary);">Territory Rank</div>
          </div>
          <div class="metric-card">
            <div class="metric-value" style="font-size: 18px; font-weight: bold; color: ${pipeline_health > 85 ? 'var(--success-green)' : 'var(--warning-orange)'}">${pipeline_health}%</div>
            <div class="metric-label" style="font-size: 11px; color: var(--text-secondary);">Pipeline Health</div>
          </div>
        </div>
        
        <!-- Multi-metric Chart -->
        <div class="chart-container" style="height: 140px; position: relative;">
          <svg class="territory-chart" viewBox="0 0 500 140" style="width: 100%; height: 100%; border: 1px solid rgba(0,53,128,0.1); border-radius: var(--radius-md); background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,249,250,0.8) 100%);">
            <!-- Grid lines -->
            <defs>
              <pattern id="grid" width="50" height="20" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 20" fill="none" stroke="rgba(0,53,128,0.1)" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>
            
            <!-- Chart lines -->
            <g transform="translate(50, 10)">
              ${revenuePoints}
              ${occupancyPoints}
              ${revparPoints}
              <g transform="translate(334, 0)">
                ${forecastPoints}
              </g>
            </g>
            
            <!-- Data points -->
            ${revenue.map((val, i) => {
              const x = 50 + (i / (revenue.length - 1)) * 400;
              const y = 130 - (val / maxRevenue) * 120;
              return `<circle cx="${x}" cy="${y}" r="3" fill="var(--expedia-blue)" stroke="white" stroke-width="2"/>`;
            }).join('')}
            
            <!-- Month labels -->
            ${timeframes.map((month, i) => {
              const x = 50 + (i / (timeframes.length - 1)) * 400;
              return `<text x="${x}" y="135" text-anchor="middle" font-size="10" fill="var(--text-secondary)">${month}</text>`;
            }).join('')}
          </svg>
        </div>
        
        <!-- Advanced Legend -->
        <div class="chart-legend" style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-sm); padding: var(--space-sm); font-size: 11px;">
          <div class="legend-section" style="display: flex; gap: var(--space-lg);">
            <span class="legend-item" style="display: flex; align-items: center; gap: var(--space-xs);"><div style="width: 12px; height: 2px; background: #003580;"></div> Revenue: $${(revenue[revenue.length-1]/1000000).toFixed(1)}M</span>
            <span class="legend-item" style="display: flex; align-items: center; gap: var(--space-xs);"><div style="width: 12px; height: 2px; background: #0066cc; border-top: 1px dashed #0066cc;"></div> Occupancy: ${occupancy[occupancy.length-1]}%</span>
            <span class="legend-item" style="display: flex; align-items: center; gap: var(--space-xs);"><div style="width: 12px; height: 2px; background: #ff6b35;"></div> RevPAR: $${revpar[revpar.length-1]}</span>
            <span class="legend-item" style="display: flex; align-items: center; gap: var(--space-xs); color: var(--success-green);"><div style="width: 12px; height: 2px; background: #28a745; border-top: 1px dashed #28a745;"></div> Forecast</span>
          </div>
          <div class="performance-indicator" style="display: flex; align-items: center; gap: var(--space-xs); font-weight: bold; color: ${competitor_gap[competitor_gap.length-1] > 0 ? 'var(--success-green)' : 'var(--error-red)'};">vs Competition: ${competitor_gap[competitor_gap.length-1] > 0 ? '+' : ''}${competitor_gap[competitor_gap.length-1]}%</div>
        </div>
      </div>
    `;
  }

  renderBarChart(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    // Comprehensive Revenue Opportunities Data
    const revenueData = data.data || {
      opportunities: [
        {
          hotel: 'Fontainebleau Miami',
          location: 'South Beach',
          current_revenue: 1850000,
          potential_revenue: 2340000,
          opportunity_value: 490000,
          confidence: 92,
          priority: 'Critical',
          action_items: ['Optimize weekend rates', 'Increase group bookings'],
          timeline: '30 days',
          risk_factors: ['Hurricane season', 'Art Basel competition']
        },
        {
          hotel: 'Marriott Biscayne Bay',
          location: 'Downtown',
          current_revenue: 1200000,
          potential_revenue: 1680000,
          opportunity_value: 480000,
          confidence: 87,
          priority: 'High',
          action_items: ['Corporate rate strategy', 'Event partnerships'],
          timeline: '45 days',
          risk_factors: ['Business travel recovery']
        },
        {
          hotel: 'Kimpton EPIC',
          location: 'Brickell',
          current_revenue: 980000,
          potential_revenue: 1290000,
          opportunity_value: 310000,
          confidence: 78,
          priority: 'Medium',
          action_items: ['Leisure package deals', 'Social media push'],
          timeline: '60 days',
          risk_factors: ['Market saturation']
        },
        {
          hotel: 'Conrad Miami',
          location: 'Brickell',
          current_revenue: 1100000,
          potential_revenue: 1320000,
          opportunity_value: 220000,
          confidence: 85,
          priority: 'Medium',
          action_items: ['Loyalty program optimization'],
          timeline: '90 days',
          risk_factors: ['Limited inventory']
        }
      ],
      total_pipeline: 1500000,
      quick_wins: 3,
      avg_implementation_time: 52
    };

    const { opportunities, total_pipeline, quick_wins, avg_implementation_time } = revenueData;
    const maxOpportunity = Math.max(...opportunities.map(o => o.opportunity_value));
    
    // Create priority color mapping
    const priorityColors = {
      'Critical': '#dc3545',
      'High': '#fd7e14', 
      'Medium': '#ffc107',
      'Low': '#28a745'
    };
    
    chartContent.innerHTML = `
      <div class="revenue-opportunities" style="height: 240px; padding: var(--space-md);">
        <!-- Summary Stats -->
        <div class="opportunity-summary" style="display: flex; justify-content: space-between; margin-bottom: var(--space-md); padding: var(--space-sm); background: linear-gradient(135deg, rgba(253,126,20,0.05) 0%, rgba(253,126,20,0.02) 100%); border-radius: var(--radius-md);">
          <div class="summary-stat">
            <div class="stat-value" style="font-size: 18px; font-weight: bold; color: var(--success-green);">$${(total_pipeline/1000000).toFixed(1)}M</div>
            <div class="stat-label" style="font-size: 11px; color: var(--text-secondary);">Total Pipeline</div>
          </div>
          <div class="summary-stat">
            <div class="stat-value" style="font-size: 18px; font-weight: bold; color: var(--warning-orange);">${quick_wins}</div>
            <div class="stat-label" style="font-size: 11px; color: var(--text-secondary);">Quick Wins</div>
          </div>
          <div class="summary-stat">
            <div class="stat-value" style="font-size: 18px; font-weight: bold; color: var(--expedia-blue);">${avg_implementation_time}d</div>
            <div class="stat-label" style="font-size: 11px; color: var(--text-secondary);">Avg Timeline</div>
          </div>
        </div>
        
        <!-- Opportunities Chart -->
        <div class="opportunities-chart" style="height: 120px; position: relative;">
          <svg viewBox="0 0 500 120" style="width: 100%; height: 100%; border: 1px solid rgba(253,126,20,0.1); border-radius: var(--radius-md); background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(254,248,240,0.9) 100%);">
            <!-- Chart bars with detailed info -->
            ${opportunities.map((opp, i) => {
              const barHeight = (opp.opportunity_value / maxOpportunity) * 80;
              const x = i * 110 + 40;
              const y = 100 - barHeight;
              const color = priorityColors[opp.priority];
              
              return `
                <g class="opportunity-bar" data-hotel="${opp.hotel}">
                  <!-- Bar -->
                  <rect x="${x}" y="${y}" width="70" height="${barHeight}" 
                        fill="${color}" opacity="0.8" rx="6" 
                        stroke="${color}" stroke-width="1"/>
                  <!-- Value label -->
                  <text x="${x + 35}" y="${y - 5}" text-anchor="middle" 
                        font-size="10" font-weight="bold" fill="${color}">$${(opp.opportunity_value/1000).toFixed(0)}K</text>
                  <!-- Confidence indicator -->
                  <circle cx="${x + 60}" cy="${y + 10}" r="8" 
                          fill="white" stroke="${color}" stroke-width="2"/>
                  <text x="${x + 60}" y="${y + 14}" text-anchor="middle" 
                        font-size="8" font-weight="bold" fill="${color}">${opp.confidence}</text>
                  <!-- Hotel name -->
                  <text x="${x + 35}" y="115" text-anchor="middle" 
                        font-size="9" fill="var(--text-secondary)">${opp.hotel.split(' ')[0]}</text>
                </g>
              `;
            }).join('')}
            
            <!-- Priority Legend -->
            <g transform="translate(400, 20)">
              <text x="0" y="0" font-size="10" font-weight="bold" fill="var(--text-primary)">Priority</text>
              ${Object.entries(priorityColors).map(([priority, color], i) => `
                <g transform="translate(0, ${15 + i * 12})">
                  <circle cx="0" cy="0" r="4" fill="${color}"/>
                  <text x="10" y="3" font-size="9" fill="var(--text-secondary)">${priority}</text>
                </g>
              `).join('')}
            </g>
          </svg>
        </div>
        
        <!-- Action Items Summary -->
        <div class="action-summary" style="margin-top: var(--space-sm); display: flex; flex-wrap: wrap; gap: var(--space-xs); font-size: 10px;">
          <div class="action-tag" style="background: rgba(220,53,69,0.1); color: #dc3545; padding: 2px 6px; border-radius: 10px; font-weight: 500;">Rate Optimization</div>
          <div class="action-tag" style="background: rgba(253,126,20,0.1); color: #fd7e14; padding: 2px 6px; border-radius: 10px; font-weight: 500;">Group Sales</div>
          <div class="action-tag" style="background: rgba(255,193,7,0.1); color: #ffc107; padding: 2px 6px; border-radius: 10px; font-weight: 500;">Corporate Strategy</div>
          <div class="action-tag" style="background: rgba(40,167,69,0.1); color: #28a745; padding: 2px 6px; border-radius: 10px; font-weight: 500;">Digital Marketing</div>
        </div>
      </div>
    `;
  }

  renderMarketData(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    // Comprehensive Market Intelligence Data
    const marketData = data.data || {
      market_overview: {
        market_adr: 298,
        market_adr_trend: +5.2,
        market_occupancy: 84.3,
        market_occupancy_trend: +2.1,
        market_revpar: 251,
        market_revpar_trend: +7.8,
        total_inventory: 45820,
        new_supply: 1240
      },
      competitive_analysis: {
        marriott: { occupancy: 86.2, adr: 315, market_share: 28.5, trend: 'up' },
        hilton: { occupancy: 82.4, adr: 289, market_share: 24.1, trend: 'stable' },
        hyatt: { occupancy: 81.7, adr: 342, market_share: 18.3, trend: 'up' },
        independent: { occupancy: 79.1, adr: 275, market_share: 29.1, trend: 'down' }
      },
      demand_indicators: {
        flight_searches: 156780,
        flight_searches_trend: +12.4,
        hotel_searches: 89320,
        hotel_searches_trend: +8.7,
        booking_pace: 127, // index vs last year
        booking_pace_trend: +15.3,
        lead_time: 23.5, // days
        lead_time_trend: -2.1
      },
      events_calendar: [
        { name: 'Art Basel Miami', impact: 'Very High', dates: 'Dec 6-8', revenue_lift: '+340%' },
        { name: 'Miami Marathon', impact: 'High', dates: 'Jan 28', revenue_lift: '+180%' },
        { name: 'Miami Open Tennis', impact: 'High', dates: 'Mar 19-31', revenue_lift: '+220%' }
      ],
      market_alerts: [
        { type: 'opportunity', message: 'Marriott inventory constraints in South Beach', urgency: 'high' },
        { type: 'threat', message: 'New luxury hotel opening Q2 2025', urgency: 'medium' },
        { type: 'trend', message: 'Extended stay demand up 25%', urgency: 'low' }
      ]
    };

    const { market_overview, competitive_analysis, demand_indicators, events_calendar, market_alerts } = marketData;
    
    // Calculate market position
    const competitorData = Object.entries(competitive_analysis);
    const avgCompetitorOccupancy = competitorData.reduce((sum, [_, data]) => sum + data.occupancy, 0) / competitorData.length;
    const avgCompetitorADR = competitorData.reduce((sum, [_, data]) => sum + data.adr, 0) / competitorData.length;
    
    chartContent.innerHTML = `
      <div class="market-intelligence" style="height: 240px; padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm);">
        <!-- Market Overview Header -->
        <div class="market-header" style="display: flex; justify-content: space-between; padding: var(--space-sm); background: linear-gradient(135deg, rgba(102,51,153,0.05) 0%, rgba(102,51,153,0.02) 100%); border-radius: var(--radius-md);">
          <div class="market-metric">
            <div class="metric-value" style="font-size: 16px; font-weight: bold; color: var(--expedia-blue);">$${market_overview.market_adr}</div>
            <div class="metric-label" style="font-size: 10px; color: var(--text-secondary);">Market ADR <span style="color: var(--success-green);">+${market_overview.market_adr_trend}%</span></div>
          </div>
          <div class="market-metric">
            <div class="metric-value" style="font-size: 16px; font-weight: bold; color: var(--expedia-blue);">${market_overview.market_occupancy}%</div>
            <div class="metric-label" style="font-size: 10px; color: var(--text-secondary);">Market Occ <span style="color: var(--success-green);">+${market_overview.market_occupancy_trend}%</span></div>
          </div>
          <div class="market-metric">
            <div class="metric-value" style="font-size: 16px; font-weight: bold; color: var(--expedia-blue);">$${market_overview.market_revpar}</div>
            <div class="metric-label" style="font-size: 10px; color: var(--text-secondary);">Market RevPAR <span style="color: var(--success-green);">+${market_overview.market_revpar_trend}%</span></div>
          </div>
          <div class="market-metric">
            <div class="metric-value" style="font-size: 16px; font-weight: bold; color: var(--warning-orange);">${(demand_indicators.booking_pace)}</div>
            <div class="metric-label" style="font-size: 10px; color: var(--text-secondary);">Pace Index <span style="color: var(--success-green);">+${demand_indicators.booking_pace_trend}%</span></div>
          </div>
        </div>
        
        <!-- Competitive Landscape -->
        <div class="competitive-grid" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
          <!-- Competitor Performance -->
          <div class="competitor-panel" style="padding: var(--space-sm); border: 1px solid rgba(102,51,153,0.1); border-radius: var(--radius-md); background: rgba(255,255,255,0.7);">
            <h4 style="margin: 0 0 var(--space-xs) 0; font-size: 11px; font-weight: bold; color: var(--text-primary);">Competitive Position</h4>
            <div class="competitor-list" style="display: flex; flex-direction: column; gap: 2px;">
              ${competitorData.map(([brand, data]) => {
                const trendIcon = data.trend === 'up' ? '↗️' : data.trend === 'down' ? '↘️' : '➡️';
                const trendColor = data.trend === 'up' ? 'var(--success-green)' : data.trend === 'down' ? 'var(--error-red)' : 'var(--text-secondary)';
                return `
                  <div class="competitor-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1px 0; font-size: 9px;">
                    <span style="font-weight: 500; text-transform: capitalize;">${brand}</span>
                    <span style="color: var(--text-secondary);">${data.occupancy}% • $${data.adr}</span>
                    <span style="color: ${trendColor}; font-size: 8px;">${trendIcon} ${data.market_share}%</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          <!-- Demand Signals -->
          <div class="demand-panel" style="padding: var(--space-sm); border: 1px solid rgba(102,51,153,0.1); border-radius: var(--radius-md); background: rgba(255,255,255,0.7);">
            <h4 style="margin: 0 0 var(--space-xs) 0; font-size: 11px; font-weight: bold; color: var(--text-primary);">Demand Signals</h4>
            <div class="demand-metrics" style="display: flex; flex-direction: column; gap: 2px; font-size: 9px;">
              <div style="display: flex; justify-content: space-between;">
                <span>Flight Searches</span>
                <span style="color: var(--success-green); font-weight: bold;">${(demand_indicators.flight_searches/1000).toFixed(0)}K <small>(+${demand_indicators.flight_searches_trend}%)</small></span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Hotel Searches</span>
                <span style="color: var(--success-green); font-weight: bold;">${(demand_indicators.hotel_searches/1000).toFixed(0)}K <small>(+${demand_indicators.hotel_searches_trend}%)</small></span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Lead Time</span>
                <span style="color: var(--text-secondary); font-weight: bold;">${demand_indicators.lead_time}d <small>(${demand_indicators.lead_time_trend}%)</small></span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Market Alerts & Events -->
        <div class="alerts-events" style="display: flex; gap: var(--space-sm); font-size: 9px;">
          <div class="market-alerts" style="flex: 1;">
            <h5 style="margin: 0 0 2px 0; font-size: 10px; font-weight: bold; color: var(--text-primary);">📊 Market Alerts</h5>
            ${market_alerts.slice(0, 2).map(alert => {
              const alertColor = alert.type === 'opportunity' ? 'var(--success-green)' : alert.type === 'threat' ? 'var(--error-red)' : 'var(--warning-orange)';
              return `<div style="padding: 1px 0; color: ${alertColor}; font-weight: 500;">• ${alert.message}</div>`;
            }).join('')}
          </div>
          <div class="upcoming-events" style="flex: 1;">
            <h5 style="margin: 0 0 2px 0; font-size: 10px; font-weight: bold; color: var(--text-primary);">🎯 Key Events</h5>
            ${events_calendar.slice(0, 2).map(event => `
              <div style="padding: 1px 0; color: var(--text-secondary);">• ${event.name} <span style="color: var(--success-green); font-weight: bold;">${event.revenue_lift}</span></div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderCoachingMetrics(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    // Comprehensive Performance Coach Data
    const coachingData = data.data || {
      manager_profile: {
        name: 'Sarah Chen',
        territory: 'Southeast Florida',
        tenure: '2.3 years',
        certification_level: 'Expert',
        next_promotion_timeline: '8 months'
      },
      performance_scores: {
        overall_performance: 87,
        revenue_achievement: 94,
        market_share_growth: 82,
        guest_satisfaction: 91,
        team_development: 85,
        strategic_planning: 88
      },
      kpi_tracking: {
        revenue_target: { current: 94, target: 100, trend: 'up' },
        occupancy_target: { current: 89, target: 85, trend: 'up' },
        market_penetration: { current: 76, target: 80, trend: 'stable' },
        cost_efficiency: { current: 92, target: 90, trend: 'up' }
      },
      coaching_focus_areas: [
        { area: 'Group Sales Strategy', priority: 'high', progress: 65, target_date: 'Dec 2024' },
        { area: 'Digital Marketing ROI', priority: 'medium', progress: 82, target_date: 'Jan 2025' },
        { area: 'Revenue Management', priority: 'low', progress: 91, target_date: 'Ongoing' }
      ],
      peer_benchmarks: {
        territory_rank: 3,
        total_territories: 15,
        percentile: 85,
        peer_average_performance: 78,
        top_performer_score: 96
      },
      recent_achievements: [
        '🏆 Q3 Revenue Leader',
        '📈 +18% YTD Growth',
        '⭐ Guest Sat Excellence',
        '🎯 Market Share Gain'
      ],
      action_items: [
        { task: 'Complete Advanced Revenue Management Course', due: '2 weeks', priority: 'high' },
        { task: 'Develop Q1 Group Sales Strategy', due: '3 weeks', priority: 'medium' },
        { task: 'Mentor New Territory Manager', due: 'Ongoing', priority: 'low' }
      ]
    };

    const { manager_profile, performance_scores, kpi_tracking, coaching_focus_areas, peer_benchmarks, recent_achievements, action_items } = coachingData;
    
    // Calculate overall performance grade
    const getPerformanceGrade = (score) => {
      if (score >= 90) return { grade: 'A+', color: '#28a745' };
      if (score >= 85) return { grade: 'A', color: '#28a745' };
      if (score >= 80) return { grade: 'B+', color: '#ffc107' };
      if (score >= 75) return { grade: 'B', color: '#ffc107' };
      return { grade: 'C', color: '#dc3545' };
    };
    
    const performanceGrade = getPerformanceGrade(performance_scores.overall_performance);
    
    chartContent.innerHTML = `
      <div class="performance-coach" style="height: 240px; padding: var(--space-md); display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
        <!-- Performance Overview -->
        <div class="performance-overview" style="display: flex; flex-direction: column; gap: var(--space-sm);">
          <!-- Manager Score Circle -->
          <div class="manager-score" style="text-align: center; padding: var(--space-sm); background: linear-gradient(135deg, rgba(40,167,69,0.05) 0%, rgba(40,167,69,0.02) 100%); border-radius: var(--radius-md);">
            <div class="score-circle" style="width: 60px; height: 60px; margin: 0 auto; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ${performanceGrade.color} 0%, ${performanceGrade.color}cc 100%); border-radius: 50%; color: white; font-size: 20px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              ${performanceGrade.grade}
            </div>
            <div class="score-details" style="margin-top: var(--space-xs);">
              <div style="font-size: 16px; font-weight: bold; color: var(--text-primary);">${performance_scores.overall_performance}/100</div>
              <div style="font-size: 10px; color: var(--text-secondary);">Overall Performance</div>
              <div style="font-size: 9px; color: ${performanceGrade.color}; font-weight: 500;">#${peer_benchmarks.territory_rank} of ${peer_benchmarks.total_territories} territories</div>
            </div>
          </div>
          
          <!-- Key Performance Indicators -->
          <div class="kpi-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 9px;">
            ${Object.entries(kpi_tracking).map(([kpi, data]) => {
              const trendIcon = data.trend === 'up' ? '↗️' : data.trend === 'down' ? '↘️' : '➡️';
              const statusColor = data.current >= data.target ? 'var(--success-green)' : data.current >= data.target * 0.9 ? 'var(--warning-orange)' : 'var(--error-red)';
              return `
                <div class="kpi-card" style="padding: 4px; border: 1px solid rgba(0,0,0,0.05); border-radius: 4px; background: rgba(255,255,255,0.8);">
                  <div style="font-weight: bold; color: ${statusColor};">${data.current}%</div>
                  <div style="color: var(--text-secondary); font-size: 8px;">${kpi.replace('_', ' ')} ${trendIcon}</div>
                  <div style="color: var(--text-secondary); font-size: 7px;">Target: ${data.target}%</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- Coaching & Development -->
        <div class="coaching-development" style="display: flex; flex-direction: column; gap: var(--space-sm);">
          <!-- Focus Areas Progress -->
          <div class="focus-areas" style="padding: var(--space-sm); border: 1px solid rgba(0,53,128,0.1); border-radius: var(--radius-md); background: rgba(255,255,255,0.7);">
            <h4 style="margin: 0 0 var(--space-xs) 0; font-size: 11px; font-weight: bold; color: var(--text-primary);">🎯 Development Focus</h4>
            ${coaching_focus_areas.map(area => {
              const priorityColor = area.priority === 'high' ? '#dc3545' : area.priority === 'medium' ? '#ffc107' : '#28a745';
              return `
                <div class="focus-item" style="margin-bottom: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px;">
                    <span style="font-weight: 500;">${area.area}</span>
                    <span style="color: ${priorityColor}; font-weight: bold;">${area.progress}%</span>
                  </div>
                  <div style="width: 100%; height: 3px; background: rgba(0,0,0,0.1); border-radius: 2px; margin-top: 2px;">
                    <div style="width: ${area.progress}%; height: 100%; background: ${priorityColor}; border-radius: 2px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <!-- Recent Achievements -->
          <div class="achievements" style="padding: var(--space-sm); border: 1px solid rgba(40,167,69,0.1); border-radius: var(--radius-md); background: rgba(255,255,255,0.7);">
            <h4 style="margin: 0 0 var(--space-xs) 0; font-size: 11px; font-weight: bold; color: var(--text-primary);">🏆 Recent Wins</h4>
            <div class="achievement-list" style="display: flex; flex-wrap: wrap; gap: 2px;">
              ${recent_achievements.map(achievement => `
                <span style="font-size: 8px; padding: 1px 4px; background: rgba(40,167,69,0.1); color: var(--success-green); border-radius: 8px; font-weight: 500;">${achievement}</span>
              `).join('')}
            </div>
          </div>
          
          <!-- Action Items -->
          <div class="action-items" style="padding: var(--space-sm); border: 1px solid rgba(255,193,7,0.1); border-radius: var(--radius-md); background: rgba(255,255,255,0.7); flex: 1;">
            <h4 style="margin: 0 0 var(--space-xs) 0; font-size: 11px; font-weight: bold; color: var(--text-primary);">📋 Next Actions</h4>
            ${action_items.slice(0, 2).map(item => {
              const priorityColor = item.priority === 'high' ? '#dc3545' : item.priority === 'medium' ? '#ffc107' : '#28a745';
              return `
                <div style="margin-bottom: 4px; padding: 2px 0; font-size: 8px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                  <div style="font-weight: 500; color: var(--text-primary);">${item.task}</div>
                  <div style="color: ${priorityColor}; font-weight: bold;">Due: ${item.due}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  generateLinePath(data, max, width, height, color, isDashed = false, strokeWidth = 1.5) {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (value / max) * height;
      return `${x},${y}`;
    }).join(' ');
    
    const strokeDasharray = isDashed ? 'stroke-dasharray="4,4"' : '';
    
    return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" ${strokeDasharray}/>`;
  }

  addMessageToChat(role, content) {
    const chatHistory = document.getElementById('chat-history');
    if (!chatHistory) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const avatar = role === 'user' ? '👤' : (role === 'assistant' ? '🤖' : 'ℹ️');
    const timestamp = new Date().toLocaleTimeString();
    
    messageDiv.innerHTML = `
      <div class="message-header">
        <span class="message-avatar">${avatar}</span>
        <span class="message-time">${timestamp}</span>
      </div>
      <div class="message-content">${this.formatMessage(content)}</div>
    `;
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  formatMessage(content) {
    // Remove JSON chart data from display
    const cleanContent = this.removeChartDataFromContent(content);
    
    // Basic markdown-like formatting
    return cleanContent
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  removeChartDataFromContent(content) {
    // Remove JSON chart objects from content
    const jsonRegex = /\{[\s\S]*?"type":\s*"(line_chart|bar_chart|market_data|coaching_metrics)"[\s\S]*?\}/g;
    return content.replace(jsonRegex, '').trim();
  }

  showTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.style.display = 'block';
    }
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  updateConnectionStatus(connected) {
    // Connection status indicator removed - no longer needed
  }

  // Chart update visual indicators
  showChartUpdateIndicator(chartType) {
    const container = document.getElementById(chartType);
    if (!container) return;
    
    // Add a subtle flash effect to indicate update
    const header = container.querySelector('.chart-header');
    if (header) {
      header.style.background = 'rgba(0, 53, 128, 0.1)';
      header.style.transition = 'background-color 0.5s ease';
      
      setTimeout(() => {
        header.style.background = '';
      }, 1000);
    }
  }
  
  // Enhanced chart data extraction to handle more scenarios
  extractChartDataFromMessage(content) {
    const chartData = [];
    
    // Look for specific data patterns that should trigger chart updates
    const patterns = {
      revenue: /revenue.*\$([0-9,]+)/gi,
      occupancy: /occupancy.*([0-9]+)%/gi,
      performance: /performance.*([0-9]+)/gi,
      growth: /growth.*([0-9.+-]+)%/gi
    };
    
    // Check if message contains data that should update charts
    const hasRevenueData = patterns.revenue.test(content);
    const hasOccupancyData = patterns.occupancy.test(content);
    const hasPerformanceData = patterns.performance.test(content);
    const hasGrowthData = patterns.growth.test(content);
    
    // Generate contextual chart updates based on message content
    if (hasRevenueData && hasOccupancyData) {
      // Territory performance update
      chartData.push({
        type: 'line_chart',
        data: this.generateContextualTerritoryData(content)
      });
    }
    
    if (content.toLowerCase().includes('opportunity') || content.toLowerCase().includes('potential')) {
      // Revenue opportunities update  
      chartData.push({
        type: 'bar_chart',
        data: this.generateContextualOpportunityData(content)
      });
    }
    
    if (hasPerformanceData) {
      // Performance coach update
      chartData.push({
        type: 'coaching_metrics',
        data: this.generateContextualCoachingData(content)
      });
    }
    
    return chartData;
  }
  
  generateContextualTerritoryData(content) {
    // Generate realistic data based on conversation context
    const baseData = this.charts['territory-performance']?.data || {};
    const currentTime = new Date();
    const month = currentTime.toLocaleDateString('en-US', { month: 'short' });
    
    return {
      timeframes: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', month],
      revenue: [2850000, 3120000, 2980000, 3450000, 3780000, 4200000 + Math.random() * 500000],
      occupancy: [78, 82, 79, 86, 89, 88 + Math.random() * 8],
      adr: [285, 295, 298, 310, 325, 330 + Math.random() * 20],
      ytd_growth: 18.7 + (Math.random() - 0.5) * 4,
      territory_rank: Math.floor(Math.random() * 3) + 2, // 2-4
      pipeline_health: 85 + Math.random() * 10
    };
  }
  
  generateContextualOpportunityData(content) {
    // Generate opportunity data based on conversation
    const opportunities = [
      {
        hotel: 'Fontainebleau Miami',
        location: 'South Beach',
        opportunity_value: 450000 + Math.random() * 100000,
        confidence: 88 + Math.random() * 8,
        priority: 'Critical'
      },
      {
        hotel: 'Marriott Biscayne Bay', 
        location: 'Downtown',
        opportunity_value: 420000 + Math.random() * 80000,
        confidence: 82 + Math.random() * 10,
        priority: 'High'
      }
    ];
    
    return {
      opportunities,
      total_pipeline: opportunities.reduce((sum, opp) => sum + opp.opportunity_value, 0),
      quick_wins: Math.floor(Math.random() * 3) + 2
    };
  }
  
  generateContextualCoachingData(content) {
    // Generate coaching data based on performance discussion
    return {
      performance_scores: {
        overall_performance: 85 + Math.random() * 10,
        revenue_achievement: 90 + Math.random() * 8,
        market_share_growth: 80 + Math.random() * 15
      },
      kpi_tracking: {
        revenue_target: { current: 92 + Math.random() * 6, target: 100, trend: 'up' },
        occupancy_target: { current: 87 + Math.random() * 5, target: 85, trend: 'up' }
      }
    };
  }
  
  // Welcome message removed - using HTML version only

  handleWebSocketMessage(data) {
    console.log('WebSocket message:', data);
    
    switch (data.type) {
      case 'chat_response':
        // Real-time chat response received
        if (data.data.chartData) {
          this.updateChartsFromData(data.data.chartData);
        }
        break;
      case 'chart_update':
        // Direct chart update
        this.updateChart(data.chartType, data.data);
        break;
      case 'connection':
        console.log('WebSocket connection established');
        break;
    }
  }
}

// Initialize the chat app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.expediachat = new ExpediaChat();
});

// Export for use in other scripts
window.ExpediaChat = ExpediaChat;