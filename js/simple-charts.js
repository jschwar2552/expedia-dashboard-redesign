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
      const barHeight = Math.max(height * 0.4, 15); // Scale down but keep minimum
      const color = isHighlight ? '#28a745' : '#003580';
      const textColor = isHighlight ? '#28a745' : '#666';
      const fontWeight = isHighlight ? '600' : '500';
      
      return `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <div style="width: 18px; height: ${barHeight}px; background: ${color}; border-radius: 2px;"></div>
          <span style="font-size: 9px; font-weight: ${fontWeight}; color: ${textColor}; line-height: 1;">${months[i]}</span>
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

    // STORY: Ultra-clean revenue focus
    chartContent.innerHTML = `
      <div style="height: 200px; padding: 8px; background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); overflow-y: auto; display: flex; flex-direction: column;">
        <!-- Main Metric - Compact -->
        <div style="text-align: center; margin-bottom: 8px; padding: 12px; background: white; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,53,128,0.08); flex-shrink: 0;">
          <div style="font-size: 28px; font-weight: 700; color: #28a745; line-height: 1; margin-bottom: 2px;">${this.data.revenue}</div>
          <div style="font-size: 12px; color: #666; line-height: 1;">June Revenue • ${this.data.growth} YTD</div>
        </div>
        
        <!-- Chart Only -->
        <div style="background: white; border-radius: 6px; padding: 8px; box-shadow: 0 1px 4px rgba(0,53,128,0.08); flex: 1; display: flex; flex-direction: column; justify-content: center; min-height: 0;">
          <div style="display: flex; align-items: end; justify-content: space-between; height: 35px; margin-bottom: 6px; padding: 0 4px;">
            ${this.generateChartBars()}
          </div>
          <div style="font-size: 10px; color: #666; text-align: center; line-height: 1;">Growth Trajectory</div>
        </div>
      </div>
    `;
  }

  renderRevenueChart() {
    const container = document.getElementById('revenue-opportunities');
    if (!container) return;

    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    // STORY: Clear opportunity focus
    chartContent.innerHTML = `
      <div style="height: 220px; padding: 12px; background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%); overflow-y: auto;">
        <!-- Top Opportunity -->
        <div style="text-align: center; margin-bottom: 12px; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(253,126,20,0.08);">
          <div style="font-size: 32px; font-weight: 700; color: #fd7e14; margin-bottom: 2px;">${this.data.biggestWin}</div>
          <div style="font-size: 13px; color: #666;">Top Opportunity • ${this.data.topHotel}</div>
        </div>
        
        <!-- Actions -->
        <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 8px rgba(253,126,20,0.08);">
          <div style="font-size: 12px; font-weight: 600; color: #333; margin-bottom: 8px;">Action Plan</div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="font-size: 11px; padding: 6px; background: #f8f9fa; border-radius: 3px; border-left: 2px solid #28a745;">
              1. Summer rate optimization
            </div>
            <div style="font-size: 11px; padding: 6px; background: #f8f9fa; border-radius: 3px; border-left: 2px solid #fd7e14;">
              2. Q3 group sales push
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

    // STORY: Market opportunity focus
    chartContent.innerHTML = `
      <div style="height: 200px; padding: 12px; background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%); overflow-y: auto;">
        <!-- Main Market Signal -->
        <div style="text-align: center; margin-bottom: 12px; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(102,51,153,0.08);">
          <div style="font-size: 32px; font-weight: 700; color: #fd7e14; margin-bottom: 2px;">+85%</div>
          <div style="font-size: 13px; color: #666;">Summer Demand Surge</div>
        </div>
        
        <!-- Conditions -->
        <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 8px rgba(102,51,153,0.08);">
          <div style="font-size: 12px; font-weight: 600; color: #333; margin-bottom: 8px;">Market Drivers</div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="font-size: 11px; padding: 6px; background: #f8f9fa; border-radius: 3px; border-left: 2px solid #fd7e14;">
              🌤️ Perfect 82°F weather
            </div>
            <div style="font-size: 11px; padding: 6px; background: #f8f9fa; border-radius: 3px; border-left: 2px solid #28a745;">
              🎉 Summer festival season
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

    // STORY: Performance grade with focus area
    chartContent.innerHTML = `
      <div style="height: 220px; padding: 12px; background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); overflow-y: auto;">
        <!-- Grade -->
        <div style="text-align: center; margin-bottom: 12px; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(40,167,69,0.08);">
          <div style="font-size: 32px; font-weight: 700; color: #28a745; margin-bottom: 2px;">A-</div>
          <div style="font-size: 13px; color: #666;">Performance Grade • #3 of 15</div>
        </div>
        
        <!-- Focus Area -->
        <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 8px rgba(40,167,69,0.08);">
          <div style="font-size: 12px; font-weight: 600; color: #333; margin-bottom: 8px;">🎯 Improvement Focus</div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="font-size: 11px; padding: 6px; background: #f8f9fa; border-radius: 3px; border-left: 2px solid #dc3545;">
              Group Sales: 65% of target
            </div>
            <div style="font-size: 11px; padding: 6px; background: #f8f9fa; border-radius: 3px; border-left: 2px solid #28a745;">
              Revenue: +18.7% (exceeding)
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