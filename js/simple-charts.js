// Simple, reliable chart system - no complex SVG or data processing
class SimpleCharts {
  constructor() {
    // Initialize with default data - simplified for clear storytelling
    this.data = {
      revenue: '$4.2M',
      growth: '+18.7%', 
      trend: 'Strong upward trajectory',
      chartBars: [45, 52, 58, 65, 72, 80], // Heights for Jan-Jun, showing steady growth
      biggestWin: '$890K',
      topHotel: 'Fontainebleau Miami',
      pipeline: '87%'
    };
    
    this.initializeCharts();
    this.setupChatIntegration();
  }

  initializeCharts() {
    this.renderTerritoryChart();
    this.renderRevenueChart();
    this.renderMarketChart();
    this.renderCoachChart();
  }

  generateChartBars() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return this.data.chartBars.map((height, i) => {
      const isHighlight = i === months.length - 1; // June is current
      const barHeight = Math.max(height * 0.6, 25); // Business-sized bars
      const color = isHighlight ? 'linear-gradient(to top, #28a745, #34ce57)' : 'linear-gradient(to top, #003580, #0066cc)';
      const shadow = isHighlight ? 'box-shadow: 0 2px 6px rgba(40,167,69,0.3);' : '';
      const textColor = isHighlight ? '#28a745' : '#666';
      const fontWeight = isHighlight ? '600' : '500';
      
      return `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          <div style="width: 26px; height: ${barHeight}px; background: ${color}; border-radius: 3px; ${shadow}"></div>
          <span style="font-size: 10px; font-weight: ${fontWeight}; color: ${textColor}; line-height: 1;">${months[i]}</span>
        </div>
      `;
    }).join('');
  }

  setupChatIntegration() {
    // Listen for chat messages to update charts
    document.addEventListener('chartUpdate', (event) => {
      const { type, data } = event.detail;
      this.updateChart(type, data);
    });
  }

  updateChart(type, newData) {
    console.log(`🔄 Updating ${type} chart with data:`, newData);
    // Update data and re-render specific chart
    Object.assign(this.data, newData);
    
    switch (type) {
      case 'territory':
        console.log('📊 Rendering territory chart');
        this.renderTerritoryChart();
        break;
      case 'revenue':
        console.log('💰 Rendering revenue chart');
        this.renderRevenueChart();
        break;
      case 'market':
        console.log('🌍 Rendering market chart');
        this.renderMarketChart();
        break;
      case 'coach':
        console.log('🏆 Rendering coach chart');
        this.renderCoachChart();
        break;
    }
  }

  // Method to trigger updates from chat queries with compelling storylines
  static updateFromQuery(query) {
    console.log('🏪 SimpleCharts.updateFromQuery called with:', query);
    const charts = window.simpleCharts;
    if (!charts) {
      console.warn('⚠️ window.simpleCharts not found');
      return;
    }

    const queryLower = query.toLowerCase();
    console.log('🔍 Processing query lowercase:', queryLower);
    console.log('🔍 Query includes "revenue"?', queryLower.includes('revenue'));
    console.log('🔍 Query includes "optimization"?', queryLower.includes('optimization'));
    
    // Storyline 1: "Which hotels need attention this week?" - Crisis Management
    if (queryLower.includes('hotels') && queryLower.includes('attention')) {
      console.log('😨 Triggering Crisis Management storyline');
      charts.updateChart('territory', { 
        revenue: '$3.1M', 
        growth: '+8.2%', 
        trend: 'Declining performance needs attention',
        chartBars: [45, 55, 50, 42, 38, 35] // Declining trend
      });
      charts.updateChart('revenue', { 
        biggestWin: '$680K',
        topHotel: 'Four Seasons Miami'
      });
    }
    
    // Storyline 2: "Show me South Beach performance trends" - Seasonal Success
    else if (queryLower.includes('south beach') && queryLower.includes('trends')) {
      console.log('🏖️ Triggering South Beach Success storyline');
      charts.updateChart('territory', { 
        revenue: '$5.8M', 
        growth: '+31.4%', 
        trend: 'Exceptional South Beach momentum',
        chartBars: [65, 72, 68, 85, 92, 98] // Strong upward trend
      });
      charts.updateChart('revenue', { 
        biggestWin: '$890K',
        topHotel: 'Fontainebleau Miami'
      });
    }
    
    // Storyline 3: "Revenue optimization opportunities" - Growth Focus
    else if (queryLower.includes('revenue') && queryLower.includes('optimization')) {
      console.log('📈 Triggering Revenue Optimization storyline');
      charts.updateChart('territory', { 
        revenue: '$4.6M', 
        growth: '+24.1%', 
        trend: 'Strong optimization potential',
        chartBars: [45, 52, 61, 68, 78, 85] // Steady growth
      });
      charts.updateChart('revenue', { 
        biggestWin: '$1.2M',
        topHotel: 'Marriott Marquis Miami'
      });
    }
    
    // Storyline 4: "Competitive analysis vs. Marriott" - Market Position
    else if (queryLower.includes('competitive') || queryLower.includes('marriott')) {
      console.log('🥊 Triggering Competitive Analysis storyline');
      charts.updateChart('territory', { 
        revenue: '$4.1M', 
        growth: '+19.3%', 
        trend: 'Solid position vs competitors',
        chartBars: [45, 55, 50, 58, 62, 66] // Moderate growth
      });
      charts.updateChart('revenue', { 
        biggestWin: '$580K',
        topHotel: 'JW Marriott Miami'
      });
    }
    
    // Default updates for other queries
    else {
      // Territory performance updates
      if (queryLower.includes('revenue') || queryLower.includes('performance')) {
        const newRevenue = Math.random() > 0.5 ? '$4.8M' : '$3.9M';
        const newGrowth = Math.random() > 0.5 ? '+22.1%' : '+15.3%';
        charts.updateChart('territory', { revenue: newRevenue, growth: newGrowth });
      }
      
      // Revenue opportunities updates
      if (queryLower.includes('opportunity') || queryLower.includes('pipeline')) {
        const newWin = Math.random() > 0.5 ? '$890K' : '$650K';
        charts.updateChart('revenue', { biggestWin: newWin });
      }
    }
  }

  renderTerritoryChart() {
    const container = document.getElementById('territory-performance');
    if (!container) return;

    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    // STORY: Business-strength revenue focus with clear trend
    chartContent.innerHTML = `
      <div style="height: 200px; padding: 12px; background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
        <!-- Hero Metric -->
        <div style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,53,128,0.1); flex-shrink: 0;">
          <div style="font-size: 38px; font-weight: 700; color: #28a745; line-height: 1; margin-bottom: 4px;">${this.data.revenue}</div>
          <div style="font-size: 14px; color: #666; font-weight: 500;">June Revenue</div>
          <div style="font-size: 16px; color: #28a745; font-weight: 600; margin-top: 2px;">${this.data.growth} YTD Growth</div>
        </div>
        
        <!-- Business Chart -->
        <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 6px rgba(0,53,128,0.1); flex: 1; display: flex; flex-direction: column; min-height: 0;">
          <div style="font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px; text-align: center;">Monthly Performance</div>
          <div style="display: flex; align-items: end; justify-content: space-between; height: 55px; margin-bottom: 8px; padding: 0 8px;">
            ${this.generateChartBars()}
          </div>
          <div style="font-size: 11px; color: #666; text-align: center;">Strong upward trajectory</div>
        </div>
      </div>
    `;
  }

  renderRevenueChart() {
    const container = document.getElementById('revenue-opportunities');
    if (!container) return;

    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    // STORY: Actionable opportunity with clear steps
    chartContent.innerHTML = `
      <div style="height: 220px; padding: 12px; background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%); overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
        <!-- Hero Opportunity -->
        <div style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(253,126,20,0.1); flex-shrink: 0;">
          <div style="font-size: 38px; font-weight: 700; color: #fd7e14; line-height: 1; margin-bottom: 4px;">${this.data.biggestWin}</div>
          <div style="font-size: 14px; color: #666; font-weight: 500;">Top Revenue Opportunity</div>
          <div style="font-size: 16px; color: #003580; font-weight: 600; margin-top: 2px;">${this.data.topHotel}</div>
        </div>
        
        <!-- Action Steps -->
        <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 6px rgba(253,126,20,0.1); flex: 1;">
          <div style="font-size: 13px; font-weight: 600; color: #333; margin-bottom: 10px;">Next Steps to Capture</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #28a745;">
              <div style="background: #28a745; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0;">1</div>
              <div style="font-size: 13px; color: #333; font-weight: 500;">Summer rate optimization</div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #fd7e14;">
              <div style="background: #fd7e14; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0;">2</div>
              <div style="font-size: 13px; color: #333; font-weight: 500;">Q3 group sales push</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMarketChart() {
    const container = document.getElementById('market-intelligence');
    if (!container) return;

    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    // STORY: Market momentum with context
    chartContent.innerHTML = `
      <div style="height: 200px; padding: 12px; background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%); overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
        <!-- Hero Market Signal -->
        <div style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(102,51,153,0.1); flex-shrink: 0;">
          <div style="font-size: 38px; font-weight: 700; color: #fd7e14; line-height: 1; margin-bottom: 4px;">+85%</div>
          <div style="font-size: 14px; color: #666; font-weight: 500;">Tourism Demand Surge</div>
          <div style="font-size: 16px; color: #6633cc; font-weight: 600; margin-top: 2px;">🌞 Summer Peak Season</div>
        </div>
        
        <!-- Market Drivers -->
        <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 6px rgba(102,51,153,0.1); flex: 1;">
          <div style="font-size: 13px; font-weight: 600; color: #333; margin-bottom: 10px;">Perfect Conditions Aligned</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #fd7e14;">
              <div style="font-size: 18px;">🌤️</div>
              <div>
                <div style="font-size: 13px; color: #333; font-weight: 500;">Perfect Beach Weather</div>
                <div style="font-size: 11px; color: #666;">82°F with clear skies</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #28a745;">
              <div style="font-size: 18px;">🎉</div>
              <div>
                <div style="font-size: 13px; color: #333; font-weight: 500;">Festival Season</div>
                <div style="font-size: 11px; color: #666;">Summer events driving bookings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCoachChart() {
    const container = document.getElementById('performance-coach');
    if (!container) return;

    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    // STORY: Performance assessment with clear development focus
    chartContent.innerHTML = `
      <div style="height: 220px; padding: 12px; background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
        <!-- Performance Grade -->
        <div style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(40,167,69,0.1); flex-shrink: 0;">
          <div style="font-size: 38px; font-weight: 700; color: #28a745; line-height: 1; margin-bottom: 4px;">A-</div>
          <div style="font-size: 14px; color: #666; font-weight: 500;">Performance Grade</div>
          <div style="font-size: 16px; color: #003580; font-weight: 600; margin-top: 2px;">#3 of 15 territories</div>
        </div>
        
        <!-- Development Focus -->
        <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 6px rgba(40,167,69,0.1); flex: 1;">
          <div style="font-size: 13px; font-weight: 600; color: #333; margin-bottom: 10px;">🎯 Development Focus</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #dc3545;">
              <div style="background: #dc3545; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0;">!</div>
              <div>
                <div style="font-size: 13px; color: #333; font-weight: 500;">Group Sales Strategy</div>
                <div style="font-size: 11px; color: #666;">65% of target - needs improvement</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #28a745;">
              <div style="background: #28a745; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0;">✓</div>
              <div>
                <div style="font-size: 13px; color: #333; font-weight: 500;">Revenue Growth</div>
                <div style="font-size: 11px; color: #666;">+18.7% YTD - exceeding target</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.simpleCharts = new SimpleCharts();
  window.SimpleCharts = SimpleCharts; // Make class available globally
  console.log('✅ SimpleCharts initialized and available globally');
});