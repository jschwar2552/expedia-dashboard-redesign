# Expedia Strategic Advisory Platform

An AI-powered strategic advisory platform for Expedia Market Managers and Hotel Owners, featuring real-time chat with Claude AI and dynamic analytics visualizations.

## 🏨 Features

- **AI Market Advisor**: Chat interface powered by Anthropic Claude API
- **Live Analytics**: 4 dynamic charts that update based on AI conversations
- **Market Intelligence**: Real-time data for territory performance, revenue opportunities, market intelligence, and performance coaching
- **Professional UI/UX**: Expedia-branded design system with responsive layout
- **Real-time Updates**: WebSocket integration for live chart updates

## 📊 Analytics Dashboards

1. **Territory Performance Trends** - Line charts showing revenue, occupancy, and ADR
2. **Revenue Opportunities** - Bar charts identifying optimization potential
3. **External Market Intelligence** - Real-time market data and insights
4. **Manager Performance Coach** - Coaching metrics and peer comparisons

## 🛠 Tech Stack

### Frontend
- HTML5, CSS3 (Custom Design System)
- Vanilla JavaScript
- SVG Charts & Visualizations
- WebSocket Client

### Backend
- Node.js + Express
- Anthropic Claude API
- WebSocket Server
- RESTful API endpoints

### Deployment
- GitHub Pages (Frontend)
- Vercel (Backend API)
- GitHub Actions (CI/CD)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jschwar2552/expedia-dashboard-redesign.git
   cd expedia-dashboard-redesign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Add your Anthropic API key to .env
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Environment Variables

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3000
NODE_ENV=development
```

### GitHub Secrets

For deployment, add these secrets to your GitHub repository:

- `ANTHROPIC_API_KEY`: Your Anthropic Claude API key

## 📁 Project Structure

```
expedia-dashboard-redesign/
├── design-system/          # CSS design system
│   ├── colors.css
│   ├── typography.css
│   ├── layout.css
│   └── components.css
├── mockups/                # HTML mockups
│   ├── 01-dashboard-overview.html
│   └── 02-chat-interface.html
├── js/                     # Frontend JavaScript
│   └── chat-app.js
├── server/                 # Backend Node.js
│   ├── index.js
│   ├── claude-client.js
│   ├── websocket.js
│   └── routes/
│       ├── chat.js
│       └── analytics.js
├── .github/workflows/      # GitHub Actions
│   └── deploy.yml
├── package.json
├── vercel.json
└── README.md
```

## 🎯 API Endpoints

### Chat API
- `POST /api/chat/message` - Send message to Claude AI
- `GET /api/chat/history/:conversationId` - Get conversation history
- `POST /api/chat/quick-query` - Process quick query buttons

### Analytics API
- `POST /api/analytics/generate-chart` - Generate chart data
- `GET /api/analytics/mock-data/:chartType` - Get mock chart data
- `GET /api/analytics/dashboard-summary` - Get dashboard summary

### WebSocket
- `ws://localhost:3000/ws` - Real-time updates

## 🎨 Design System

The platform uses a comprehensive Expedia-branded design system:

- **Colors**: Expedia blue palette with semantic color tokens
- **Typography**: Inter font with responsive scale
- **Layout**: CSS Grid and Flexbox utilities
- **Components**: Reusable UI components with consistent styling

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Automatic Deployment

Push to `main` branch triggers automatic deployment:
- Frontend → GitHub Pages
- Backend → Vercel

### Manual Deployment

```bash
# Deploy frontend to GitHub Pages
npm run deploy

# Deploy backend to Vercel
vercel --prod
```

## 📈 Usage

1. **Open the dashboard**: Navigate to the deployed URL or localhost:3000
2. **Start chatting**: Use the AI Market Advisor to ask questions about hotel performance
3. **Quick queries**: Click suggested query buttons for common analyses
4. **Watch charts update**: Charts automatically update based on AI responses
5. **Real-time data**: Charts show live territory performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://jschwar2552.github.io/expedia-dashboard-redesign/](https://jschwar2552.github.io/expedia-dashboard-redesign/)
- **API Backend**: [https://expedia-platform-api.vercel.app/](https://expedia-platform-api.vercel.app/)
- **Documentation**: [GitHub Repository](https://github.com/jschwar2552/expedia-dashboard-redesign)

## 💬 Support

For questions and support, please open an issue in the GitHub repository.

---

Built with ❤️ for Expedia Market Managers by Jason Schwarz