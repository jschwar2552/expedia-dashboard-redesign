// Simple, reliable chart system - no complex SVG or data processing
class SimpleCharts {
  constructor() {
    // Initialize with default data
    this.data = {
      revenue: '$4.2M',
      growth: '+18.7%', 
      rank: '#3/15',
      pipeline: '87%',
      chartBars: [45, 55, 50, 65, 70, 80], // Heights for Jul-Dec
      opportunities: [
        { hotel: 'Fontainebleau Miami', location: 'South Beach', value: '$490K', confidence: '92%', priority: 'Critical' },
        { hotel: 'Marriott Biscayne Bay', location: 'Downtown', value: '$480K', confidence: '87%', priority: 'High' }
      ],
      pipelineTotal: '$1.5M',
      quickWins: '3',
      avgTimeline: '52d'
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
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return this.data.chartBars.map((height, i) => {
      const isHighlight = i === months.length - 1;
      const color = isHighlight ? 'linear-gradient(to top, #28a745, #34ce57)' : 'linear-gradient(to top, #003580, #0066cc)';
      const shadow = isHighlight ? 'box-shadow: 0 2px 8px rgba(40,167,69,0.3);' : '';
      const textColor = isHighlight ? '#28a745' : '#666';
      const fontWeight = isHighlight ? '600' : '500';
      
      return `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="width: 30px; height: ${height}px; background: ${color}; border-radius: 3px; margin-bottom: 4px; ${shadow}"></div>
          <span style="font-size: 10px; font-weight: ${fontWeight}; color: ${textColor};">${months[i]}</span>
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
    // Update data and re-render specific chart
    Object.assign(this.data, newData);
    
    switch (type) {
      case 'territory':
        this.renderTerritoryChart();
        break;
      case 'revenue':
        this.renderRevenueChart();
        break;
      case 'market':
        this.renderMarketChart();
        break;
      case 'coach':
        this.renderCoachChart();
        break;
    }
  }

  // Method to trigger updates from chat queries
  static updateFromQuery(query) {
    const charts = window.simpleCharts;
    if (!charts) return;

    const queryLower = query.toLowerCase();
    
    // Territory performance updates
    if (queryLower.includes('revenue') || queryLower.includes('performance')) {
      const newRevenue = Math.random() > 0.5 ? '$4.8M' : '$3.9M';
      const newGrowth = Math.random() > 0.5 ? '+22.1%' : '+15.3%';
      charts.updateChart('territory', { revenue: newRevenue, growth: newGrowth });
    }
    
    // Revenue opportunities updates
    if (queryLower.includes('opportunity') || queryLower.includes('pipeline')) {
      const newPipeline = Math.random() > 0.5 ? '$1.8M' : '$1.2M';
      const newQuickWins = Math.floor(Math.random() * 3) + 2;
      charts.updateChart('revenue', { pipelineTotal: newPipeline, quickWins: newQuickWins.toString() });
    }
    
    // Market intelligence updates
    if (queryLower.includes('market') || queryLower.includes('competition')) {
      // Market data can be updated here
      console.log('Market data updated based on query');
    }
  }

  renderTerritoryChart() {
    const container = document.getElementById('territory-performance');
    if (!container) return;

    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    chartContent.innerHTML = `
      <div style="height: 200px; padding: 12px; background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);">
        <!-- Header Metrics -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,53,128,0.08);">
          <div style="text-align: center;">
            <div class="metric-value" style="font-size: 20px; font-weight: 700; color: #003580; margin-bottom: 2px;">$${this.data.revenue || '4.2M'}</div>
            <div style="font-size: 12px; color: #666; font-weight: 500;">Current Revenue</div>
          </div>
          <div style="text-align: center;">
            <div class="metric-value" style="font-size: 20px; font-weight: 700; color: #28a745; margin-bottom: 2px;">${this.data.growth || '+18.7%'}</div>
            <div style="font-size: 12px; color: #666; font-weight: 500;">YTD Growth</div>
          </div>
          <div style="text-align: center;">
            <div class="metric-value" style="font-size: 20px; font-weight: 700; color: #003580; margin-bottom: 2px;">${this.data.rank || '#3/15'}</div>
            <div style="font-size: 12px; color: #666; font-weight: 500;">Territory Rank</div>
          </div>
          <div style="text-align: center;">
            <div class="metric-value" style="font-size: 20px; font-weight: 700; color: #28a745; margin-bottom: 2px;">${this.data.pipeline || '87%'}</div>
            <div style="font-size: 12px; color: #666; font-weight: 500;">Pipeline Health</div>
          </div>
        </div>
        
        <!-- Simple Chart Representation -->
        <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 8px rgba(0,53,128,0.08); height: 120px;">
          <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;">Performance Trends</div>
          
          <!-- Chart Bars -->
          <div style="display: flex; align-items: end; justify-content: space-between; height: 60px; padding: 0 10px;">
            ${this.generateChartBars()}
          </div>
          
          <!-- Legend -->
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 8px; font-size: 12px;">
            <span style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 2px; background: #003580; border-radius: 1px;"></div>
              Revenue: ${this.data.revenue}
            </span>
            <span style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 2px; background: #28a745; border-radius: 1px;"></div>
              vs Competition: +28%
            </span>
          </div>
        </div>
      </div>
    `;
  }

  renderRevenueChart() {
    const container = document.getElementById('revenue-opportunities');
    if (!container) return;

    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    chartContent.innerHTML = `
      <div style="height: 200px; padding: 12px; background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);">
        <!-- Summary Stats -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(253,126,20,0.08);">
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: 700; color: #28a745; margin-bottom: 2px;">${this.data.pipelineTotal}</div>
            <div style="font-size: 12px; color: #666; font-weight: 500;">Total Pipeline</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: 700; color: #fd7e14; margin-bottom: 2px;">${this.data.quickWins}</div>
            <div style="font-size: 12px; color: #666; font-weight: 500;">Quick Wins</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: 700; color: #003580; margin-bottom: 2px;">${this.data.avgTimeline}</div>
            <div style="font-size: 12px; color: #666; font-weight: 500;">Avg Timeline</div>
          </div>
        </div>
        
        <!-- Opportunities List -->
        <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 8px rgba(253,126,20,0.08); height: 120px;">
          <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;">Top Revenue Opportunities</div>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${this.data.opportunities.map((opp, i) => {
              const borderColor = opp.priority === 'Critical' ? '#dc3545' : '#fd7e14';
              const valueColor = opp.priority === 'Critical' ? '#dc3545' : '#fd7e14';
              return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid ${borderColor};">
                  <div>
                    <div style="font-weight: 600; color: #333; font-size: 12px;">${opp.hotel}</div>
                    <div style="color: #666; font-size: 10px;">${opp.location} • ${opp.priority} Priority</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: 700; color: ${valueColor}; font-size: 14px;">${opp.value}</div>
                    <div style="color: #666; font-size: 10px;">${opp.confidence} confidence</div>
                  </div>
                </div>
              `;
            }).join('')}
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

    chartContent.innerHTML = `
      <div style="height: 200px; padding: 12px; background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%);">
        <!-- Market Overview -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(102,51,153,0.08);">
          <div style="text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: #003580; margin-bottom: 2px;">$298</div>
            <div style="font-size: 11px; color: #666; font-weight: 500;">Market ADR <span style="color: #28a745; font-weight: 600;">+5.2%</span></div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: #003580; margin-bottom: 2px;">84.3%</div>
            <div style="font-size: 11px; color: #666; font-weight: 500;">Market Occ <span style="color: #28a745; font-weight: 600;">+2.1%</span></div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: #003580; margin-bottom: 2px;">$251</div>
            <div style="font-size: 11px; color: #666; font-weight: 500;">Market RevPAR <span style="color: #28a745; font-weight: 600;">+7.8%</span></div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: #fd7e14; margin-bottom: 2px;">127</div>
            <div style="font-size: 11px; color: #666; font-weight: 500;">Pace Index <span style="color: #28a745; font-weight: 600;">+15.3%</span></div>
          </div>
        </div>
        
        <!-- Competitive & Demand Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; height: 100px;">
          <!-- Competitor Performance -->
          <div style="padding: 16px; border: 1px solid rgba(102,51,153,0.1); border-radius: 12px; background: white; box-shadow: 0 2px 4px rgba(102,51,153,0.05);">
            <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #333;">Competitive Position</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <span style="font-weight: 600; color: #333;">Marriott</span>
                <span style="color: #666; font-weight: 500;">86.2% • $315</span>
                <span style="color: #28a745; font-weight: 600;">↗️ 28.5%</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <span style="font-weight: 600; color: #333;">Hilton</span>
                <span style="color: #666; font-weight: 500;">82.4% • $289</span>
                <span style="color: #666; font-weight: 600;">➡️ 24.1%</span>
              </div>
            </div>
          </div>
          
          <!-- Demand Signals -->
          <div style="padding: 16px; border: 1px solid rgba(102,51,153,0.1); border-radius: 12px; background: white; box-shadow: 0 2px 4px rgba(102,51,153,0.05);">
            <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #333;">Demand Signals</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <span style="font-weight: 500; color: #333;">Flight Searches</span>
                <span style="color: #28a745; font-weight: 600;">157K <small style="color: #666;">(+12.4%)</small></span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <span style="font-weight: 500; color: #333;">Hotel Searches</span>
                <span style="color: #28a745; font-weight: 600;">89K <small style="color: #666;">(+8.7%)</small></span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 6px 0;">
                <span style="font-weight: 500; color: #333;">Lead Time</span>
                <span style="color: #666; font-weight: 600;">23.5d <small>(-2.1%)</small></span>
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

    chartContent.innerHTML = `
      <div style="height: 200px; padding: 12px; background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <!-- Performance Overview -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Manager Score -->
          <div style="text-align: center; padding: 16px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(40,167,69,0.08);">
            <div style="width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 50%; color: white; font-size: 28px; font-weight: 700; box-shadow: 0 6px 16px rgba(0,0,0,0.15); border: 3px solid rgba(255,255,255,0.3);">
              A
            </div>
            <div style="margin-top: 12px;">
              <div style="font-size: 20px; font-weight: 700; color: #333; margin-bottom: 2px;">87/100</div>
              <div style="font-size: 13px; color: #666; font-weight: 500;">Overall Performance</div>
              <div style="font-size: 12px; color: #28a745; font-weight: 600; margin-top: 4px;">#3 of 15 territories</div>
            </div>
          </div>
          
          <!-- KPI Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
            <div style="padding: 8px; border: 1px solid rgba(0,0,0,0.05); border-radius: 8px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: center;">
              <div style="font-weight: 700; color: #28a745; font-size: 16px; margin-bottom: 2px;">94%</div>
              <div style="color: #666; font-size: 10px; font-weight: 500;">Revenue Target ↗️</div>
              <div style="color: #666; font-size: 9px; margin-top: 2px;">Target: 100%</div>
            </div>
            <div style="padding: 8px; border: 1px solid rgba(0,0,0,0.05); border-radius: 8px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: center;">
              <div style="font-weight: 700; color: #28a745; font-size: 16px; margin-bottom: 2px;">89%</div>
              <div style="color: #666; font-size: 10px; font-weight: 500;">Occupancy Target ↗️</div>
              <div style="color: #666; font-size: 9px; margin-top: 2px;">Target: 85%</div>
            </div>
          </div>
        </div>
        
        <!-- Coaching & Development -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Focus Areas -->
          <div style="padding: 16px; border: 1px solid rgba(0,53,128,0.1); border-radius: 12px; background: white; box-shadow: 0 2px 4px rgba(0,53,128,0.05);">
            <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #333;">🎯 Development Focus</h4>
            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 500;">Group Sales Strategy</span>
                <span style="color: #dc3545; font-weight: bold;">65%</span>
              </div>
              <div style="width: 100%; height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px;">
                <div style="width: 65%; height: 100%; background: #dc3545; border-radius: 2px;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 500;">Digital Marketing ROI</span>
                <span style="color: #28a745; font-weight: bold;">82%</span>
              </div>
              <div style="width: 100%; height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px;">
                <div style="width: 82%; height: 100%; background: #28a745; border-radius: 2px;"></div>
              </div>
            </div>
          </div>
          
          <!-- Recent Achievements -->
          <div style="padding: 16px; border: 1px solid rgba(40,167,69,0.1); border-radius: 12px; background: white; box-shadow: 0 2px 4px rgba(40,167,69,0.05); flex: 1;">
            <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #333;">🏆 Recent Wins</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              <span style="font-size: 10px; padding: 2px 6px; background: rgba(40,167,69,0.1); color: #28a745; border-radius: 8px; font-weight: 500;">🏆 Q3 Revenue Leader</span>
              <span style="font-size: 10px; padding: 2px 6px; background: rgba(40,167,69,0.1); color: #28a745; border-radius: 8px; font-weight: 500;">📈 +18% YTD Growth</span>
              <span style="font-size: 10px; padding: 2px 6px; background: rgba(40,167,69,0.1); color: #28a745; border-radius: 8px; font-weight: 500;">⭐ Guest Sat Excellence</span>
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
});