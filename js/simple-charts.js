// Simple, reliable chart system - no complex SVG or data processing
class SimpleCharts {
  constructor() {
    this.initializeCharts();
  }

  initializeCharts() {
    this.renderTerritoryChart();
    this.renderRevenueChart();
    this.renderMarketChart();
    this.renderCoachChart();
  }

  renderTerritoryChart() {
    const container = document.getElementById('territory-performance');
    if (!container) return;

    const chartContent = container.querySelector('.chart-content');
    if (!chartContent) return;

    chartContent.innerHTML = `
      <div style="height: 240px; padding: 20px; background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);">
        <!-- Header Metrics -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 16px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,53,128,0.08);">
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #003580; margin-bottom: 4px;">$4.2M</div>
            <div style="font-size: 14px; color: #666; font-weight: 500;">Current Revenue</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #28a745; margin-bottom: 4px;">+18.7%</div>
            <div style="font-size: 14px; color: #666; font-weight: 500;">YTD Growth</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #003580; margin-bottom: 4px;">#3/15</div>
            <div style="font-size: 14px; color: #666; font-weight: 500;">Territory Rank</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #28a745; margin-bottom: 4px;">87%</div>
            <div style="font-size: 14px; color: #666; font-weight: 500;">Pipeline Health</div>
          </div>
        </div>
        
        <!-- Simple Chart Representation -->
        <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,53,128,0.08); height: 140px;">
          <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 16px;">Performance Trends</div>
          
          <!-- Chart Bars -->
          <div style="display: flex; align-items: end; justify-content: space-between; height: 80px; padding: 0 20px;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 40px; height: 45px; background: linear-gradient(to top, #003580, #0066cc); border-radius: 4px; margin-bottom: 8px;"></div>
              <span style="font-size: 12px; font-weight: 500; color: #666;">Jul</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 40px; height: 55px; background: linear-gradient(to top, #003580, #0066cc); border-radius: 4px; margin-bottom: 8px;"></div>
              <span style="font-size: 12px; font-weight: 500; color: #666;">Aug</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 40px; height: 50px; background: linear-gradient(to top, #003580, #0066cc); border-radius: 4px; margin-bottom: 8px;"></div>
              <span style="font-size: 12px; font-weight: 500; color: #666;">Sep</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 40px; height: 65px; background: linear-gradient(to top, #003580, #0066cc); border-radius: 4px; margin-bottom: 8px;"></div>
              <span style="font-size: 12px; font-weight: 500; color: #666;">Oct</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 40px; height: 70px; background: linear-gradient(to top, #003580, #0066cc); border-radius: 4px; margin-bottom: 8px;"></div>
              <span style="font-size: 12px; font-weight: 500; color: #666;">Nov</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 40px; height: 80px; background: linear-gradient(to top, #28a745, #34ce57); border-radius: 4px; margin-bottom: 8px; box-shadow: 0 2px 8px rgba(40,167,69,0.3);"></div>
              <span style="font-size: 12px; font-weight: 600; color: #28a745;">Dec</span>
            </div>
          </div>
          
          <!-- Legend -->
          <div style="display: flex; justify-content: center; gap: 30px; margin-top: 12px; font-size: 14px;">
            <span style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 16px; height: 3px; background: #003580; border-radius: 2px;"></div>
              Revenue: $4.2M
            </span>
            <span style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 16px; height: 3px; background: #28a745; border-radius: 2px;"></div>
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
      <div style="height: 240px; padding: 20px; background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);">
        <!-- Summary Stats -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 16px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(253,126,20,0.08);">
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #28a745; margin-bottom: 4px;">$1.5M</div>
            <div style="font-size: 14px; color: #666; font-weight: 500;">Total Pipeline</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #fd7e14; margin-bottom: 4px;">3</div>
            <div style="font-size: 14px; color: #666; font-weight: 500;">Quick Wins</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #003580; margin-bottom: 4px;">52d</div>
            <div style="font-size: 14px; color: #666; font-weight: 500;">Avg Timeline</div>
          </div>
        </div>
        
        <!-- Opportunities List -->
        <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(253,126,20,0.08); height: 140px;">
          <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 16px;">Top Revenue Opportunities</div>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #dc3545;">
              <div>
                <div style="font-weight: 600; color: #333; font-size: 14px;">Fontainebleau Miami</div>
                <div style="color: #666; font-size: 12px;">South Beach • Critical Priority</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 700; color: #dc3545; font-size: 16px;">$490K</div>
                <div style="color: #666; font-size: 12px;">92% confidence</div>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #fd7e14;">
              <div>
                <div style="font-weight: 600; color: #333; font-size: 14px;">Marriott Biscayne Bay</div>
                <div style="color: #666; font-size: 12px;">Downtown • High Priority</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 700; color: #fd7e14; font-size: 16px;">$480K</div>
                <div style="color: #666; font-size: 12px;">87% confidence</div>
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
      <div style="height: 240px; padding: 20px; background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%);">
        <!-- Market Overview -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 16px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(102,51,153,0.08);">
          <div style="text-align: center;">
            <div style="font-size: 22px; font-weight: 700; color: #003580; margin-bottom: 4px;">$298</div>
            <div style="font-size: 13px; color: #666; font-weight: 500;">Market ADR <span style="color: #28a745; font-weight: 600;">+5.2%</span></div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 22px; font-weight: 700; color: #003580; margin-bottom: 4px;">84.3%</div>
            <div style="font-size: 13px; color: #666; font-weight: 500;">Market Occ <span style="color: #28a745; font-weight: 600;">+2.1%</span></div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 22px; font-weight: 700; color: #003580; margin-bottom: 4px;">$251</div>
            <div style="font-size: 13px; color: #666; font-weight: 500;">Market RevPAR <span style="color: #28a745; font-weight: 600;">+7.8%</span></div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 22px; font-weight: 700; color: #fd7e14; margin-bottom: 4px;">127</div>
            <div style="font-size: 13px; color: #666; font-weight: 500;">Pace Index <span style="color: #28a745; font-weight: 600;">+15.3%</span></div>
          </div>
        </div>
        
        <!-- Competitive & Demand Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 120px;">
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
      <div style="height: 240px; padding: 20px; background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
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