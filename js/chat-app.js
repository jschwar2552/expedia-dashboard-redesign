// Chart upgrades deployed - version 2.0
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
        // Update simple charts based on query content
        if (window.SimpleCharts) {
          window.SimpleCharts.updateFromQuery(message);
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
        // Update simple charts based on quick query
        if (window.SimpleCharts) {
          window.SimpleCharts.updateFromQuery(query);
        }
      }
      
    } catch (error) {
      console.error('Error handling quick query:', error);
      this.hideTypingIndicator();
      this.addMessageToChat('system', `Error processing query: ${error.message || 'Unknown error occurred'}`);
    }
  }

  async loadInitialChartData() {
    // Simple charts system handles initial rendering
    console.log('📊 Using simple chart system - no complex data loading needed');
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
    
    // Update based on chart type immediately - no opacity effects
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
  }

  renderLineChart(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    try {
      // Comprehensive Territory Performance Data Structure
      const territoryData = (data && data.data) ? data.data : {
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

    const { 
      timeframes = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 
      revenue = [2850000, 3120000, 2980000, 3450000, 3780000, 4200000], 
      occupancy = [78, 82, 79, 86, 89, 92], 
      adr = [285, 295, 298, 310, 325, 340], 
      revpar = [222, 242, 235, 267, 289, 313], 
      market_share = [23.5, 24.1, 23.8, 25.2, 26.1, 27.3], 
      competitor_gap = [+12, +15, +8, +18, +22, +28], 
      forecasted_next = [4650000, 4980000], 
      territory_rank = 3, 
      ytd_growth = 18.7, 
      pipeline_health = 87 
    } = territoryData;
    
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
      <div class="territory-dashboard" style="height: 240px; padding: var(--space-lg); background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);">
        <!-- Header Metrics -->
        <div class="metrics-header" style="display: flex; justify-content: space-between; margin-bottom: var(--space-lg); padding: var(--space-md); background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,53,128,0.08); border: 1px solid rgba(0,53,128,0.05);">
          <div class="metric-card" style="text-align: center;">
            <div class="metric-value" style="font-size: 24px; font-weight: 700; color: var(--expedia-blue); margin-bottom: 4px;">$${(revenue[revenue.length-1]/1000000).toFixed(1)}M</div>
            <div class="metric-label" style="font-size: 14px; color: var(--text-secondary); font-weight: 500;">Current Revenue</div>
          </div>
          <div class="metric-card" style="text-align: center;">
            <div class="metric-value" style="font-size: 24px; font-weight: 700; color: var(--success-green); margin-bottom: 4px;">+${ytd_growth.toFixed(1)}%</div>
            <div class="metric-label" style="font-size: 14px; color: var(--text-secondary); font-weight: 500;">YTD Growth</div>
          </div>
          <div class="metric-card" style="text-align: center;">
            <div class="metric-value" style="font-size: 24px; font-weight: 700; color: var(--expedia-blue); margin-bottom: 4px;">#${territory_rank}/15</div>
            <div class="metric-label" style="font-size: 14px; color: var(--text-secondary); font-weight: 500;">Territory Rank</div>
          </div>
          <div class="metric-card" style="text-align: center;">
            <div class="metric-value" style="font-size: 24px; font-weight: 700; color: ${pipeline_health > 85 ? 'var(--success-green)' : 'var(--warning-orange)'}; margin-bottom: 4px;">${pipeline_health.toFixed(0)}%</div>
            <div class="metric-label" style="font-size: 14px; color: var(--text-secondary); font-weight: 500;">Pipeline Health</div>
          </div>
        </div>
        
        <!-- Multi-metric Chart -->
        <div class="chart-container" style="height: 120px; position: relative; background: white; border-radius: 12px; padding: var(--space-md); box-shadow: 0 2px 8px rgba(0,53,128,0.08); border: 1px solid rgba(0,53,128,0.05);">
          <div class="chart-title" style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-sm);">Performance Trends</div>
          <svg class="territory-chart" viewBox="0 0 600 80" style="width: 100%; height: 80px;">
            <!-- Clean grid -->
            <defs>
              <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#003580;stop-opacity:0.3"/>
                <stop offset="100%" style="stop-color:#003580;stop-opacity:0.05"/>
              </linearGradient>
            </defs>
            
            <!-- Chart area background -->
            <rect x="40" y="10" width="520" height="60" fill="rgba(248,249,250,0.5)" rx="4"/>
            
            <!-- Chart lines with improved styling -->
            <g transform="translate(40, 10)">
              ${this.generateSmoothPath(revenue, maxRevenue, 520, 60, '#003580', 3)}
              ${this.generateSmoothPath(occupancy.map(x => x * (maxRevenue/100)), maxRevenue, 520, 60, '#0066cc', 2, true)}
              ${this.generateSmoothPath(revpar.map(x => x * (maxRevenue/350)), maxRevenue, 520, 60, '#ff6b35', 2)}
            </g>
            
            <!-- Enhanced data points -->
            ${revenue.map((val, i) => {
              const x = 40 + (i / (revenue.length - 1)) * 520;
              const y = 70 - (val / maxRevenue) * 60;
              return `
                <circle cx="${x}" cy="${y}" r="4" fill="var(--expedia-blue)" stroke="white" stroke-width="2" style="filter: drop-shadow(0 2px 4px rgba(0,53,128,0.2));"/>
                <text x="${x}" y="${y - 8}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--expedia-blue)">$${(val/1000000).toFixed(1)}M</text>
              `;
            }).join('')}
            
            <!-- Month labels with better styling -->
            ${timeframes.map((month, i) => {
              const x = 40 + (i / (timeframes.length - 1)) * 520;
              return `<text x="${x}" y="85" text-anchor="middle" font-size="14" font-weight="500" fill="var(--text-secondary)">${month}</text>`;
            }).join('')}
          </svg>
        </div>
        
        <!-- Advanced Legend -->
        <div class="chart-legend" style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-md); padding: var(--space-md); background: white; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,53,128,0.05);">
          <div class="legend-section" style="display: flex; gap: var(--space-xl);">
            <span class="legend-item" style="display: flex; align-items: center; gap: var(--space-sm); font-size: 14px; font-weight: 500;"><div style="width: 16px; height: 3px; background: #003580; border-radius: 2px;"></div> Revenue: $${(revenue[revenue.length-1]/1000000).toFixed(1)}M</span>
            <span class="legend-item" style="display: flex; align-items: center; gap: var(--space-sm); font-size: 14px; font-weight: 500;"><div style="width: 16px; height: 3px; background: #0066cc; border-radius: 2px; border-top: 1px dashed #0066cc;"></div> Occupancy: ${occupancy[occupancy.length-1]}%</span>
            <span class="legend-item" style="display: flex; align-items: center; gap: var(--space-sm); font-size: 14px; font-weight: 500;"><div style="width: 16px; height: 3px; background: #ff6b35; border-radius: 2px;"></div> RevPAR: $${revpar[revpar.length-1]}</span>
          </div>
          <div class="performance-indicator" style="display: flex; align-items: center; gap: var(--space-sm); font-weight: 600; font-size: 16px; color: ${competitor_gap[competitor_gap.length-1] > 0 ? 'var(--success-green)' : 'var(--error-red)'}; padding: var(--space-sm) var(--space-md); background: ${competitor_gap[competitor_gap.length-1] > 0 ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)'}; border-radius: 6px;">vs Competition: ${competitor_gap[competitor_gap.length-1] > 0 ? '+' : ''}${competitor_gap[competitor_gap.length-1]}%</div>
        </div>
      </div>
    `;
    } catch (error) {
      console.error('Error rendering line chart:', error);
      chartContent.innerHTML = `<div style="padding: var(--space-lg); text-align: center; color: var(--text-secondary);">Loading chart data...</div>`;
    }
  }

  renderBarChart(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    try {
      // Comprehensive Revenue Opportunities Data
      const revenueData = (data && data.data) ? data.data : {
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

    const { 
      opportunities = [
        {
          hotel: 'Fontainebleau Miami',
          location: 'South Beach',
          current_revenue: 1850000,
          potential_revenue: 2340000,
          opportunity_value: 490000,
          confidence: 92,
          priority: 'Critical'
        },
        {
          hotel: 'Marriott Biscayne Bay',
          location: 'Downtown', 
          current_revenue: 1200000,
          potential_revenue: 1680000,
          opportunity_value: 480000,
          confidence: 87,
          priority: 'High'
        }
      ],
      total_pipeline = 1500000, 
      quick_wins = 3, 
      avg_implementation_time = 52 
    } = revenueData;
    const maxOpportunity = Math.max(...opportunities.map(o => o.opportunity_value));
    
    // Create priority color mapping
    const priorityColors = {
      'Critical': '#dc3545',
      'High': '#fd7e14', 
      'Medium': '#ffc107',
      'Low': '#28a745'
    };
    
    chartContent.innerHTML = `
      <div class="revenue-opportunities" style="height: 240px; padding: var(--space-lg); background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);">
        <!-- Summary Stats -->
        <div class="opportunity-summary" style="display: flex; justify-content: space-between; margin-bottom: var(--space-lg); padding: var(--space-md); background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(253,126,20,0.08); border: 1px solid rgba(253,126,20,0.05);">
          <div class="summary-stat" style="text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: 700; color: var(--success-green); margin-bottom: 4px;">$${(total_pipeline/1000000).toFixed(1)}M</div>
            <div class="stat-label" style="font-size: 14px; color: var(--text-secondary); font-weight: 500;">Total Pipeline</div>
          </div>
          <div class="summary-stat" style="text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: 700; color: var(--warning-orange); margin-bottom: 4px;">${quick_wins}</div>
            <div class="stat-label" style="font-size: 14px; color: var(--text-secondary); font-weight: 500;">Quick Wins</div>
          </div>
          <div class="summary-stat" style="text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: 700; color: var(--expedia-blue); margin-bottom: 4px;">${avg_implementation_time}d</div>
            <div class="stat-label" style="font-size: 14px; color: var(--text-secondary); font-weight: 500;">Avg Timeline</div>
          </div>
        </div>
        
        <!-- Opportunities Chart -->
        <div class="opportunities-chart" style="height: 120px; position: relative; background: white; border-radius: 12px; padding: var(--space-md); box-shadow: 0 2px 8px rgba(253,126,20,0.08); border: 1px solid rgba(253,126,20,0.05);">
          <div class="chart-title" style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-sm);">Revenue Opportunities</div>
          <svg viewBox="0 0 600 80" style="width: 100%; height: 80px;">
            <!-- Chart bars with detailed info -->
            ${opportunities.map((opp, i) => {
              const barHeight = (opp.opportunity_value / maxOpportunity) * 50;
              const x = i * 140 + 60;
              const y = 60 - barHeight;
              const color = priorityColors[opp.priority];
              
              return `
                <g class="opportunity-bar" data-hotel="${opp.hotel}">
                  <!-- Bar with gradient -->
                  <defs>
                    <linearGradient id="barGradient${i}" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:${color};stop-opacity:0.9"/>
                      <stop offset="100%" style="stop-color:${color};stop-opacity:0.6"/>
                    </linearGradient>
                  </defs>
                  <rect x="${x}" y="${y}" width="80" height="${barHeight}" 
                        fill="url(#barGradient${i})" rx="8" 
                        stroke="${color}" stroke-width="1" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));"/>
                  <!-- Value label -->
                  <text x="${x + 40}" y="${y - 8}" text-anchor="middle" 
                        font-size="14" font-weight="700" fill="${color}">$${(opp.opportunity_value/1000).toFixed(0)}K</text>
                  <!-- Confidence indicator -->
                  <circle cx="${x + 65}" cy="${y + 12}" r="10" 
                          fill="white" stroke="${color}" stroke-width="2" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));"/>
                  <text x="${x + 65}" y="${y + 16}" text-anchor="middle" 
                        font-size="10" font-weight="bold" fill="${color}">${opp.confidence}</text>
                  <!-- Hotel name -->
                  <text x="${x + 40}" y="75" text-anchor="middle" 
                        font-size="12" font-weight="500" fill="var(--text-secondary)">${opp.hotel.split(' ')[0]}</text>
                </g>
              `;
            }).join('')}
            
            <!-- Priority Legend -->
            <g transform="translate(480, 15)">
              <text x="0" y="0" font-size="12" font-weight="600" fill="var(--text-primary)">Priority</text>
              ${Object.entries(priorityColors).slice(0, 3).map(([priority, color], i) => `
                <g transform="translate(0, ${18 + i * 15})">
                  <circle cx="0" cy="0" r="5" fill="${color}" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));"/>
                  <text x="12" y="4" font-size="11" font-weight="500" fill="var(--text-secondary)">${priority}</text>
                </g>
              `).join('')}
            </g>
          </svg>
        </div>
        
        <!-- Action Items Summary -->
        <div class="action-summary" style="margin-top: var(--space-md); display: flex; flex-wrap: wrap; gap: var(--space-sm); font-size: 12px;">
          <div class="action-tag" style="background: rgba(220,53,69,0.1); color: #dc3545; padding: var(--space-xs) var(--space-sm); border-radius: 16px; font-weight: 500; border: 1px solid rgba(220,53,69,0.2);">Rate Optimization</div>
          <div class="action-tag" style="background: rgba(253,126,20,0.1); color: #fd7e14; padding: var(--space-xs) var(--space-sm); border-radius: 16px; font-weight: 500; border: 1px solid rgba(253,126,20,0.2);">Group Sales</div>
          <div class="action-tag" style="background: rgba(255,193,7,0.1); color: #ffc107; padding: var(--space-xs) var(--space-sm); border-radius: 16px; font-weight: 500; border: 1px solid rgba(255,193,7,0.2);">Corporate Strategy</div>
          <div class="action-tag" style="background: rgba(40,167,69,0.1); color: #28a745; padding: var(--space-xs) var(--space-sm); border-radius: 16px; font-weight: 500; border: 1px solid rgba(40,167,69,0.2);">Digital Marketing</div>
        </div>
      </div>
    `;
    } catch (error) {
      console.error('Error rendering chart:', error);
      chartContent.innerHTML = `<div style="padding: var(--space-lg); text-align: center; color: var(--text-secondary);">Loading chart data...</div>`;
    }
  }

  renderMarketData(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    try {
      // Comprehensive Market Intelligence Data
      const marketData = (data && data.data) ? data.data : {
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

    const { 
      market_overview = {
        market_adr: 298,
        market_adr_trend: 5.2,
        market_occupancy: 84.3,
        market_occupancy_trend: 2.1,
        market_revpar: 251,
        market_revpar_trend: 7.8
      },
      competitive_analysis = {
        marriott: { occupancy: 86.2, adr: 315, market_share: 28.5, trend: 'up' },
        hilton: { occupancy: 82.4, adr: 289, market_share: 24.1, trend: 'stable' }
      },
      demand_indicators = {
        flight_searches: 156780,
        flight_searches_trend: 12.4,
        hotel_searches: 89320,
        hotel_searches_trend: 8.7,
        booking_pace: 127,
        booking_pace_trend: 15.3
      },
      events_calendar = [],
      market_alerts = []
    } = marketData;
    
    // Calculate market position
    const competitorData = Object.entries(competitive_analysis);
    const avgCompetitorOccupancy = competitorData.reduce((sum, [_, data]) => sum + data.occupancy, 0) / competitorData.length;
    const avgCompetitorADR = competitorData.reduce((sum, [_, data]) => sum + data.adr, 0) / competitorData.length;
    
    chartContent.innerHTML = `
      <div class="market-intelligence" style="height: 240px; padding: var(--space-lg); background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%);">
        <!-- Market Overview Header -->
        <div class="market-header" style="display: flex; justify-content: space-between; margin-bottom: var(--space-lg); padding: var(--space-md); background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(102,51,153,0.08); border: 1px solid rgba(102,51,153,0.05);">
          <div class="market-metric" style="text-align: center;">
            <div class="metric-value" style="font-size: 22px; font-weight: 700; color: var(--expedia-blue); margin-bottom: 4px;">$${market_overview.market_adr}</div>
            <div class="metric-label" style="font-size: 13px; color: var(--text-secondary); font-weight: 500;">Market ADR <span style="color: var(--success-green); font-weight: 600;">+${market_overview.market_adr_trend}%</span></div>
          </div>
          <div class="market-metric" style="text-align: center;">
            <div class="metric-value" style="font-size: 22px; font-weight: 700; color: var(--expedia-blue); margin-bottom: 4px;">${market_overview.market_occupancy}%</div>
            <div class="metric-label" style="font-size: 13px; color: var(--text-secondary); font-weight: 500;">Market Occ <span style="color: var(--success-green); font-weight: 600;">+${market_overview.market_occupancy_trend}%</span></div>
          </div>
          <div class="market-metric" style="text-align: center;">
            <div class="metric-value" style="font-size: 22px; font-weight: 700; color: var(--expedia-blue); margin-bottom: 4px;">$${market_overview.market_revpar}</div>
            <div class="metric-label" style="font-size: 13px; color: var(--text-secondary); font-weight: 500;">Market RevPAR <span style="color: var(--success-green); font-weight: 600;">+${market_overview.market_revpar_trend}%</span></div>
          </div>
          <div class="market-metric" style="text-align: center;">
            <div class="metric-value" style="font-size: 22px; font-weight: 700; color: var(--warning-orange); margin-bottom: 4px;">${(demand_indicators.booking_pace)}</div>
            <div class="metric-label" style="font-size: 13px; color: var(--text-secondary); font-weight: 500;">Pace Index <span style="color: var(--success-green); font-weight: 600;">+${demand_indicators.booking_pace_trend}%</span></div>
          </div>
        </div>
        
        <!-- Competitive Landscape -->
        <div class="competitive-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); height: 100px;">
          <!-- Competitor Performance -->
          <div class="competitor-panel" style="padding: var(--space-md); border: 1px solid rgba(102,51,153,0.1); border-radius: 12px; background: white; box-shadow: 0 2px 4px rgba(102,51,153,0.05);">
            <h4 style="margin: 0 0 var(--space-sm) 0; font-size: 14px; font-weight: 600; color: var(--text-primary);">Competitive Position</h4>
            <div class="competitor-list" style="display: flex; flex-direction: column; gap: var(--space-xs);">
              ${competitorData.map(([brand, data]) => {
                const trendIcon = data.trend === 'up' ? '↗️' : data.trend === 'down' ? '↘️' : '➡️';
                const trendColor = data.trend === 'up' ? 'var(--success-green)' : data.trend === 'down' ? 'var(--error-red)' : 'var(--text-secondary)';
                return `
                  <div class="competitor-item" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-xs) 0; font-size: 12px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                    <span style="font-weight: 600; text-transform: capitalize; color: var(--text-primary);">${brand}</span>
                    <span style="color: var(--text-secondary); font-weight: 500;">${data.occupancy}% • $${data.adr}</span>
                    <span style="color: ${trendColor}; font-size: 11px; font-weight: 600;">${trendIcon} ${data.market_share}%</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          <!-- Demand Signals -->
          <div class="demand-panel" style="padding: var(--space-md); border: 1px solid rgba(102,51,153,0.1); border-radius: 12px; background: white; box-shadow: 0 2px 4px rgba(102,51,153,0.05);">
            <h4 style="margin: 0 0 var(--space-sm) 0; font-size: 14px; font-weight: 600; color: var(--text-primary);">Demand Signals</h4>
            <div class="demand-metrics" style="display: flex; flex-direction: column; gap: var(--space-xs); font-size: 12px;">
              <div style="display: flex; justify-content: space-between; padding: var(--space-xs) 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <span style="font-weight: 500; color: var(--text-primary);">Flight Searches</span>
                <span style="color: var(--success-green); font-weight: 600;">${(demand_indicators.flight_searches/1000).toFixed(0)}K <small style="color: var(--text-secondary);">(+${demand_indicators.flight_searches_trend}%)</small></span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: var(--space-xs) 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <span style="font-weight: 500; color: var(--text-primary);">Hotel Searches</span>
                <span style="color: var(--success-green); font-weight: 600;">${(demand_indicators.hotel_searches/1000).toFixed(0)}K <small style="color: var(--text-secondary);">(+${demand_indicators.hotel_searches_trend}%)</small></span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: var(--space-xs) 0;">
                <span style="font-weight: 500; color: var(--text-primary);">Lead Time</span>
                <span style="color: var(--text-secondary); font-weight: 600;">${demand_indicators.lead_time}d <small>(${demand_indicators.lead_time_trend}%)</small></span>
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
    } catch (error) {
      console.error('Error rendering chart:', error);
      chartContent.innerHTML = `<div style="padding: var(--space-lg); text-align: center; color: var(--text-secondary);">Loading chart data...</div>`;
    }
  }

  renderCoachingMetrics(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    try {
      // Comprehensive Performance Coach Data
      const coachingData = (data && data.data) ? data.data : {
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

    const { 
      manager_profile = {},
      performance_scores = {
        overall_performance: 87,
        revenue_achievement: 94,
        market_share_growth: 82
      },
      kpi_tracking = {
        revenue_target: { current: 94, target: 100, trend: 'up' },
        occupancy_target: { current: 89, target: 85, trend: 'up' },
        market_penetration: { current: 76, target: 80, trend: 'stable' },
        cost_efficiency: { current: 92, target: 90, trend: 'up' }
      },
      coaching_focus_areas = [],
      peer_benchmarks = {
        territory_rank: 3,
        total_territories: 15,
        percentile: 85
      },
      recent_achievements = [],
      action_items = []
    } = coachingData;
    
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
      <div class="performance-coach" style="height: 240px; padding: var(--space-lg); background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
        <!-- Performance Overview -->
        <div class="performance-overview" style="display: flex; flex-direction: column; gap: var(--space-md);">
          <!-- Manager Score Circle -->
          <div class="manager-score" style="text-align: center; padding: var(--space-md); background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(40,167,69,0.08); border: 1px solid rgba(40,167,69,0.05);">
            <div class="score-circle" style="width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ${performanceGrade.color} 0%, ${performanceGrade.color}cc 100%); border-radius: 50%; color: white; font-size: 28px; font-weight: 700; box-shadow: 0 6px 16px rgba(0,0,0,0.15); border: 3px solid rgba(255,255,255,0.3);">
              ${performanceGrade.grade}
            </div>
            <div class="score-details" style="margin-top: var(--space-sm);">
              <div style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px;">${performance_scores.overall_performance}/100</div>
              <div style="font-size: 13px; color: var(--text-secondary); font-weight: 500;">Overall Performance</div>
              <div style="font-size: 12px; color: ${performanceGrade.color}; font-weight: 600; margin-top: 4px;">#${peer_benchmarks.territory_rank} of ${peer_benchmarks.total_territories} territories</div>
            </div>
          </div>
          
          <!-- Key Performance Indicators -->
          <div class="kpi-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); font-size: 11px;">
            ${Object.entries(kpi_tracking).map(([kpi, data]) => {
              const trendIcon = data.trend === 'up' ? '↗️' : data.trend === 'down' ? '↘️' : '➡️';
              const statusColor = data.current >= data.target ? 'var(--success-green)' : data.current >= data.target * 0.9 ? 'var(--warning-orange)' : 'var(--error-red)';
              return `
                <div class="kpi-card" style="padding: var(--space-sm); border: 1px solid rgba(0,0,0,0.05); border-radius: 8px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: center;">
                  <div style="font-weight: 700; color: ${statusColor}; font-size: 16px; margin-bottom: 2px;">${data.current}%</div>
                  <div style="color: var(--text-secondary); font-size: 10px; font-weight: 500; text-transform: capitalize;">${kpi.replace('_', ' ')} ${trendIcon}</div>
                  <div style="color: var(--text-secondary); font-size: 9px; margin-top: 2px;">Target: ${data.target}%</div>
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
    } catch (error) {
      console.error('Error rendering chart:', error);
      chartContent.innerHTML = `<div style="padding: var(--space-lg); text-align: center; color: var(--text-secondary);">Loading chart data...</div>`;
    }
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
  
  generateSmoothPath(data, max, width, height, color, strokeWidth = 2, isDashed = false) {
    if (data.length < 2) return '';
    
    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * width,
      y: height - (value / max) * height
    }));
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) * 0.3;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * 0.3;
      const cp2y = curr.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    
    const strokeDasharray = isDashed ? 'stroke-dasharray="6,4"' : '';
    return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${strokeDasharray} style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));"/>`;
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
      revenue: [2850000, 3120000, 2980000, 3450000, 3780000, Math.round(4200000 + Math.random() * 500000)],
      occupancy: [78, 82, 79, 86, 89, Math.round(88 + Math.random() * 8)],
      adr: [285, 295, 298, 310, 325, Math.round(330 + Math.random() * 20)],
      ytd_growth: Math.round((18.7 + (Math.random() - 0.5) * 4) * 10) / 10,
      territory_rank: Math.floor(Math.random() * 3) + 2, // 2-4
      pipeline_health: Math.round(85 + Math.random() * 10)
    };
  }
  
  generateContextualOpportunityData(content) {
    // Generate opportunity data based on conversation
    const opportunities = [
      {
        hotel: 'Fontainebleau Miami',
        location: 'South Beach',
        opportunity_value: Math.round(450000 + Math.random() * 100000),
        confidence: Math.round(88 + Math.random() * 8),
        priority: 'Critical'
      },
      {
        hotel: 'Marriott Biscayne Bay', 
        location: 'Downtown',
        opportunity_value: Math.round(420000 + Math.random() * 80000),
        confidence: Math.round(82 + Math.random() * 10),
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
        overall_performance: Math.round(85 + Math.random() * 10),
        revenue_achievement: Math.round(90 + Math.random() * 8),
        market_share_growth: Math.round(80 + Math.random() * 15)
      },
      kpi_tracking: {
        revenue_target: { current: Math.round(92 + Math.random() * 6), target: 100, trend: 'up' },
        occupancy_target: { current: Math.round(87 + Math.random() * 5), target: 85, trend: 'up' }
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