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
    chartDataArray.forEach(chartData => {
      const chartType = this.getChartTypeFromData(chartData);
      if (chartType) {
        this.updateChart(chartType, chartData);
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
    if (!container) return;

    // Store chart data
    this.charts[chartType] = data;
    
    // Update based on chart type
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

    const { labels, revenue, occupancy, adr } = data.data;
    const maxRevenue = Math.max(...revenue);
    
    chartContent.innerHTML = `
      <div class="line-chart" style="height: 200px; padding: var(--space-lg);">
        <svg class="chart-svg" viewBox="0 0 500 160" style="width: 100%; height: 180px;">
          ${this.generateLinePath(revenue, maxRevenue, 500, 160, '#003580', false, 3)}
          ${this.generateLinePath(occupancy.map(x => x * 1000), maxRevenue, 500, 160, '#0066cc', true, 3)}
        </svg>
      </div>
      <div class="chart-legend" style="padding: var(--space-md); font-size: 14px; display: flex; justify-content: center; gap: var(--space-xl);">
        <span class="legend-item" style="font-weight: bold;">📈 Revenue: $${revenue[revenue.length-1].toLocaleString()}</span>
        <span class="legend-item" style="font-weight: bold;">🏨 Occupancy: ${occupancy[occupancy.length-1]}%</span>
      </div>
    `;
  }

  renderBarChart(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    const { hotels, potential, confidence } = data.data;
    const maxPotential = Math.max(...potential);
    
    const bars = hotels.map((hotel, i) => {
      const height = (potential[i] / maxPotential) * 130;
      const x = i * 110 + 40;
      return `<rect x="${x}" y="${160-height}" width="80" height="${height}" fill="#003580" opacity="0.9" rx="8"/>`;
    }).join('');
    
    chartContent.innerHTML = `
      <div class="bar-chart" style="height: 200px; padding: var(--space-lg);">
        <svg class="chart-svg" viewBox="0 0 500 160" style="width: 100%; height: 180px;">
          ${bars}
        </svg>
      </div>
      <div class="chart-legend" style="padding: var(--space-md); font-size: 14px; display: flex; justify-content: center; gap: var(--space-xl);">
        <span class="legend-item" style="font-weight: bold;">💰 Top: $${Math.max(...potential).toLocaleString()}</span>
        <span class="legend-item" style="font-weight: bold;">✅ Avg Confidence: ${Math.round(confidence.reduce((a,b) => a+b) / confidence.length)}%</span>
      </div>
    `;
  }

  renderMarketData(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    const { competitor_occupancy, market_adr, flight_searches, booking_pace } = data.data;
    
    chartContent.innerHTML = `
      <div class="market-metrics" style="display: flex; flex-direction: column; gap: var(--space-md); height: 100%;">
        <div class="metric-row" style="padding: var(--space-md); font-size: 14px;">
          <span class="metric-label">Market ADR</span>
          <span class="metric-value" style="font-size: 20px; font-weight: bold;">$${market_adr}</span>
        </div>
        <div class="metric-row" style="padding: var(--space-md); font-size: 14px;">
          <span class="metric-label">Competitor Occ</span>
          <span class="metric-value" style="font-size: 20px; font-weight: bold;">${competitor_occupancy}%</span>
        </div>
        <div class="metric-row" style="padding: var(--space-md); font-size: 14px;">
          <span class="metric-label">Flight Searches</span>
          <span class="metric-value trend-up" style="font-size: 20px; font-weight: bold;">${flight_searches}</span>
        </div>
        <div class="metric-row" style="padding: var(--space-md); font-size: 14px;">
          <span class="metric-label">Booking Pace</span>
          <span class="metric-value trend-up" style="font-size: 20px; font-weight: bold;">${booking_pace}</span>
        </div>
      </div>
    `;
  }

  renderCoachingMetrics(container, data) {
    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    const { territory_growth, vs_peer_avg, optimization_score, weekly_calls } = data.data;
    
    chartContent.innerHTML = `
      <div class="coaching-metrics" style="padding: var(--space-xl); height: 100%; display: flex; flex-direction: column; justify-content: center;">
        <div class="score-display" style="text-align: center; margin-bottom: var(--space-xl);">
          <div class="score-circle" style="width: 80px; height: 80px; font-size: 24px; margin: 0 auto; background: linear-gradient(135deg, var(--expedia-blue) 0%, #004080 100%); border: 3px solid rgba(255,255,255,0.3); box-shadow: 0 8px 16px rgba(0,53,128,0.3);">
            <span class="score-number">${optimization_score}</span>
          </div>
          <div class="score-label" style="font-size: 14px; margin-top: var(--space-md); font-weight: 600;">Optimization Score</div>
        </div>
        <div class="performance-stats" style="display: flex; flex-direction: column; gap: var(--space-xl);">
          <div class="stat-item" style="text-align: center; padding: var(--space-lg); background: linear-gradient(135deg, rgba(0,53,128,0.08) 0%, rgba(0,53,128,0.04) 100%); border-radius: var(--radius-lg); border: 1px solid rgba(0,53,128,0.1);">
            <span class="stat-value trend-up" style="font-size: 22px; font-weight: bold; display: block; color: var(--success-green);">${territory_growth}</span>
            <span class="stat-label" style="font-size: 14px; color: var(--text-secondary); font-weight: 500;">Territory Growth</span>
          </div>
          <div class="stat-item" style="text-align: center; padding: var(--space-lg); background: linear-gradient(135deg, rgba(0,53,128,0.08) 0%, rgba(0,53,128,0.04) 100%); border-radius: var(--radius-lg); border: 1px solid rgba(0,53,128,0.1);">
            <span class="stat-value trend-up" style="font-size: 22px; font-weight: bold; display: block; color: var(--success-green);">${vs_peer_avg}</span>
            <span class="stat-label" style="font-size: 14px; color: var(--text-secondary); font-weight: 500;">vs Peers</span>
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