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
        rank: '#7/15', 
        pipeline: '64%',
        chartBars: [45, 55, 50, 42, 38, 35] // Declining trend
      });
      charts.updateChart('revenue', { 
        pipelineTotal: '$2.1M',
        quickWins: '5',
        avgTimeline: '14d',
        opportunities: [
          { hotel: 'Four Seasons Miami', location: 'Brickell', value: '$680K', confidence: '95%', priority: 'Critical' },
          { hotel: 'W South Beach', location: 'South Beach', value: '$520K', confidence: '89%', priority: 'Critical' },
          { hotel: 'Edition Miami Beach', location: 'Mid-Beach', value: '$340K', confidence: '91%', priority: 'High' }
        ]
      });
    }
    
    // Storyline 2: "Show me South Beach performance trends" - Seasonal Success
    else if (queryLower.includes('south beach') && queryLower.includes('trends')) {
      console.log('🏖️ Triggering South Beach Success storyline');
      charts.updateChart('territory', { 
        revenue: '$5.8M', 
        growth: '+31.4%', 
        rank: '#1/15', 
        pipeline: '94%',
        chartBars: [65, 72, 68, 85, 92, 98] // Strong upward trend
      });
      charts.updateChart('revenue', { 
        pipelineTotal: '$1.9M',
        quickWins: '2',
        avgTimeline: '21d',
        opportunities: [
          { hotel: 'Fontainebleau Miami', location: 'South Beach', value: '$890K', confidence: '97%', priority: 'High' },
          { hotel: 'SLS South Beach', location: 'South Beach', value: '$650K', confidence: '93%', priority: 'Medium' },
          { hotel: 'The Setai Miami Beach', location: 'South Beach', value: '$380K', confidence: '88%', priority: 'Medium' }
        ]
      });
    }
    
    // Storyline 3: "Revenue optimization opportunities" - Growth Focus
    else if (queryLower.includes('revenue') && queryLower.includes('optimization')) {
      console.log('📈 Triggering Revenue Optimization storyline');
      charts.updateChart('territory', { 
        revenue: '$4.6M', 
        growth: '+24.1%', 
        rank: '#2/15', 
        pipeline: '91%',
        chartBars: [45, 52, 61, 68, 78, 85] // Steady growth
      });
      charts.updateChart('revenue', { 
        pipelineTotal: '$3.2M',
        quickWins: '7',
        avgTimeline: '28d',
        opportunities: [
          { hotel: 'Marriott Marquis Miami', location: 'Downtown', value: '$1.2M', confidence: '92%', priority: 'Critical' },
          { hotel: 'InterContinental Miami', location: 'Downtown', value: '$890K', confidence: '88%', priority: 'High' },
          { hotel: 'Conrad Miami', location: 'Brickell', value: '$760K', confidence: '85%', priority: 'High' }
        ]
      });
    }
    
    // Storyline 4: "Competitive analysis vs. Marriott" - Market Position
    else if (queryLower.includes('competitive') || queryLower.includes('marriott')) {
      console.log('🥊 Triggering Competitive Analysis storyline');
      charts.updateChart('territory', { 
        revenue: '$4.1M', 
        growth: '+19.3%', 
        rank: '#4/15', 
        pipeline: '83%',
        chartBars: [45, 55, 50, 58, 62, 66] // Moderate growth
      });
      charts.updateChart('revenue', { 
        pipelineTotal: '$1.4M',
        quickWins: '4',
        avgTimeline: '45d',
        opportunities: [
          { hotel: 'JW Marriott Miami', location: 'Brickell', value: '$580K', confidence: '84%', priority: 'High' },
          { hotel: 'W Miami', location: 'Brickell', value: '$420K', confidence: '79%', priority: 'Medium' },
          { hotel: 'AC Hotel Miami Beach', location: 'South Beach', value: '$290K', confidence: '86%', priority: 'Medium' }
        ]
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
        const newPipeline = Math.random() > 0.5 ? '$1.8M' : '$1.2M';
        const newQuickWins = Math.floor(Math.random() * 3) + 2;
        charts.updateChart('revenue', { pipelineTotal: newPipeline, quickWins: newQuickWins.toString() });
      }
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
      <div style="height: 220px; padding: 12px; background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);">
        <!-- Summary Stats -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(253,126,20,0.08);">
          <div style="text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: #28a745; margin-bottom: 2px;">${this.data.pipelineTotal}</div>
            <div style="font-size: 11px; color: #666; font-weight: 500;">Total Pipeline</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: #fd7e14; margin-bottom: 2px;">${this.data.quickWins}</div>
            <div style="font-size: 11px; color: #666; font-weight: 500;">Quick Wins</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: #003580; margin-bottom: 2px;">${this.data.avgTimeline}</div>
            <div style="font-size: 11px; color: #666; font-weight: 500;">Avg Timeline</div>
          </div>
        </div>
        
        <!-- Opportunities List -->
        <div style="background: white; border-radius: 8px; padding: 10px; box-shadow: 0 2px 8px rgba(253,126,20,0.08); height: 140px; overflow-y: auto;">
          <div style="font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px;">Top Revenue Opportunities</div>
          
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${this.data.opportunities.map((opp, i) => {
              const borderColor = opp.priority === 'Critical' ? '#dc3545' : '#fd7e14';
              const valueColor = opp.priority === 'Critical' ? '#dc3545' : '#fd7e14';
              return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px; background: #f8f9fa; border-radius: 4px; border-left: 3px solid ${borderColor};">
                  <div>
                    <div style="font-weight: 600; color: #333; font-size: 11px;">${opp.hotel}</div>
                    <div style="color: #666; font-size: 9px;">${opp.location} • ${opp.priority} Priority</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: 700; color: ${valueColor}; font-size: 12px;">${opp.value}</div>
                    <div style="color: #666; font-size: 9px;">${opp.confidence} confidence</div>
                  </div>
                </div>
              `;
            }).join('')}
            <!-- Add another opportunity for demo -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px; background: #f8f9fa; border-radius: 4px; border-left: 3px solid #ffc107;">
              <div>
                <div style="font-weight: 600; color: #333; font-size: 11px;">Conrad Miami</div>
                <div style="color: #666; font-size: 9px;">Brickell • Medium Priority</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 700; color: #ffc107; font-size: 12px;">$220K</div>
                <div style="color: #666; font-size: 9px;">85% confidence</div>
              </div>
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
        
        <!-- External Data Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; height: 120px;">
          <!-- Events & Weather -->
          <div style="padding: 10px; border: 1px solid rgba(102,51,153,0.1); border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(102,51,153,0.05);">
            <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #333;">🌊 Market Events</h4>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 10px;">
              <div style="padding: 3px 0; border-bottom: 1px solid rgba(0,0,0,0.03);">
                <span style="font-weight: 600; color: #dc3545;">🎨 Art Basel Dec 6-8</span>
                <span style="color: #666; margin-left: 6px;">+340% demand surge expected</span>
              </div>
              <div style="padding: 3px 0; border-bottom: 1px solid rgba(0,0,0,0.03);">
                <span style="font-weight: 600; color: #28a745;">🏃 Miami Marathon Jan 28</span>
                <span style="color: #666; margin-left: 6px;">+180% revenue lift</span>
              </div>
              <div style="padding: 3px 0;">
                <span style="font-weight: 600; color: #fd7e14;">🌤️ Weather: 78°F Sunny</span>
                <span style="color: #666; margin-left: 6px;">Perfect beach conditions</span>
              </div>
            </div>
          </div>
          
          <!-- Social & News Feeds -->
          <div style="padding: 10px; border: 1px solid rgba(102,51,153,0.1); border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(102,51,153,0.05);">
            <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #333;">📱 Social Buzz</h4>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 10px;">
              <div style="padding: 3px 0; border-bottom: 1px solid rgba(0,0,0,0.03);">
                <span style="font-weight: 600; color: #1DA1F2;">📱 Twitter: #MiamiBeach trending</span>
                <span style="color: #666; margin-left: 6px;">+45% mentions vs last week</span>
              </div>
              <div style="padding: 3px 0; border-bottom: 1px solid rgba(0,0,0,0.03);">
                <span style="font-weight: 600; color: #E1306C;">📸 Instagram: 2.3M #Miami posts</span>
                <span style="color: #666; margin-left: 6px;">High engagement rates</span>
              </div>
              <div style="padding: 3px 0;">
                <span style="font-weight: 600; color: #FF6B35;">📰 News: "Miami tourism rebounds"</span>
                <span style="color: #666; margin-left: 6px;">Positive sentiment +12%</span>
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
      <div style="height: 220px; padding: 12px; background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <!-- Performance Overview -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <!-- Manager Score -->
          <div style="text-align: center; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(40,167,69,0.08);">
            <div style="width: 60px; height: 60px; margin: 0 auto; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 50%; color: white; font-size: 24px; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 2px solid rgba(255,255,255,0.3);">
              A
            </div>
            <div style="margin-top: 8px;">
              <div style="font-size: 16px; font-weight: 700; color: #333; margin-bottom: 2px;">87/100</div>
              <div style="font-size: 11px; color: #666; font-weight: 500;">Overall Performance</div>
              <div style="font-size: 10px; color: #28a745; font-weight: 600; margin-top: 2px;">#3 of 15 territories</div>
            </div>
          </div>
          
          <!-- KPI Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px;">
            <div style="padding: 6px; border: 1px solid rgba(0,0,0,0.05); border-radius: 6px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: center;">
              <div style="font-weight: 700; color: #28a745; font-size: 14px; margin-bottom: 1px;">94%</div>
              <div style="color: #666; font-size: 9px; font-weight: 500;">Revenue ↗️</div>
              <div style="color: #666; font-size: 8px; margin-top: 1px;">Target: 100%</div>
            </div>
            <div style="padding: 6px; border: 1px solid rgba(0,0,0,0.05); border-radius: 6px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: center;">
              <div style="font-weight: 700; color: #28a745; font-size: 14px; margin-bottom: 1px;">89%</div>
              <div style="color: #666; font-size: 9px; font-weight: 500;">Occupancy ↗️</div>
              <div style="color: #666; font-size: 8px; margin-top: 1px;">Target: 85%</div>
            </div>
          </div>
        </div>
        
        <!-- Coaching & Development -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <!-- Focus Areas -->
          <div style="padding: 10px; border: 1px solid rgba(0,53,128,0.1); border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,53,128,0.05);">
            <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #333;">🎯 Development Focus</h4>
            <div style="margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; margin-bottom: 2px;">
                <span style="font-weight: 500;">Group Sales Strategy</span>
                <span style="color: #dc3545; font-weight: bold;">65%</span>
              </div>
              <div style="width: 100%; height: 3px; background: rgba(0,0,0,0.1); border-radius: 1px;">
                <div style="width: 65%; height: 100%; background: #dc3545; border-radius: 1px;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; margin-bottom: 2px;">
                <span style="font-weight: 500;">Digital Marketing ROI</span>
                <span style="color: #28a745; font-weight: bold;">82%</span>
              </div>
              <div style="width: 100%; height: 3px; background: rgba(0,0,0,0.1); border-radius: 1px;">
                <div style="width: 82%; height: 100%; background: #28a745; border-radius: 1px;"></div>
              </div>
            </div>
          </div>
          
          <!-- Recent Achievements -->
          <div style="padding: 10px; border: 1px solid rgba(40,167,69,0.1); border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(40,167,69,0.05); flex: 1;">
            <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #333;">🏆 Recent Wins</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 3px;">
              <span style="font-size: 9px; padding: 2px 4px; background: rgba(40,167,69,0.1); color: #28a745; border-radius: 6px; font-weight: 500;">🏆 Q3 Leader</span>
              <span style="font-size: 9px; padding: 2px 4px; background: rgba(40,167,69,0.1); color: #28a745; border-radius: 6px; font-weight: 500;">📈 +18% YTD</span>
              <span style="font-size: 9px; padding: 2px 4px; background: rgba(40,167,69,0.1); color: #28a745; border-radius: 6px; font-weight: 500;">⭐ Guest Sat</span>
              <span style="font-size: 9px; padding: 2px 4px; background: rgba(40,167,69,0.1); color: #28a745; border-radius: 6px; font-weight: 500;">🎯 Market Share</span>
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