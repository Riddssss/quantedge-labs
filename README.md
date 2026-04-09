# QuantEdge Labs 🚀
 
> **Engineering Alpha Through Evolution**
 
[![Python](https://img.shields.io/badge/Python-3.12-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
 
An intelligent stock trading strategy optimization system for the **Indian Banking Sector** combining **Genetic Algorithm (GA)**, **Particle Swarm Optimization (PSO)**, and **Transformer Signal Integration**. Built as a BTech Final Year Project combining Evolutionary Computing and Advanced Topics in Machine Learning.
 
---
 
## 📊 Key Results
 
| Model | Sharpe Ratio | Total Return | Max Drawdown | Trades |
|-------|-------------|--------------|--------------|--------|
| Buy & Hold | — | 41.84% | — | 1 |
| GA | 0.8772 | 25.95% | -10.59% | 2 |
| PSO | **1.4277** | 34.40% | -6.47% | 4 |
| GA + Transformer | 1.1875 | 35.68% | -8.86% | 4 |
| PSO + Transformer | 1.3956 | **45.82%** | -8.23% | 8 |
 
> PSO achieves a Sharpe Ratio of **1.4277**, exceeding the professional benchmark of 1.0.
> PSO + Transformer achieves the highest raw return of **45.82%**, beating Buy & Hold.
 
---
 
## 🎯 Problem Statement
 
Traditional trading strategies rely on manually chosen parameters that often perform poorly across different market conditions. This project proposes an intelligent system that uses Evolutionary Computing to **automatically discover optimal buy/sell rules** for the Bank Nifty Index, enhanced by a Transformer-based directional signal.
 
---
 
## 🏗️ System Architecture
 
```
Yahoo Finance → Data Pipeline → 20 Technical Indicators
                                        ↓
                            Transformer Signal (today's direction)
                                        ↓
                    ┌───────────────────┴───────────────────┐
                    │                                       │
              Genetic Algorithm                  Particle Swarm Optimization
              (evolves chromosome)               (swarm searches parameters)
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        ↓
                                  Backtesting Engine
                                  (Sharpe Ratio fitness)
                                        ↓
                                  FastAPI Backend
                                        ↓
                              QuantEdge Labs Dashboard
```
 
---
 
## ✨ Features
 
### Core Algorithms
- 🧬 **Genetic Algorithm** — selection, crossover, mutation to evolve trading parameters
- 🐦 **Particle Swarm Optimization** — swarm intelligence with inertia decay
- 🤖 **Transformer Encoder** — pure NumPy self-attention for market direction signal
- 📊 **Backtesting Engine** — Sharpe Ratio based fitness evaluation
 
### User Features
- 📈 **5 Sector Support** — Bank Nifty, Nifty IT, Nifty 50, Nifty Pharma, Nifty Auto
- 📅 **Custom Date Range** — with market period presets (COVID Crash, Bull Run, Recent 5Y)
- 📡 **Live Market Signal** — real-time BUY/SELL/HOLD recommendation
- 🔄 **Strategy Comparison** — compare multiple runs side by side
- 💰 **Paper Trading Simulator** — test strategies with custom capital
- 📉 **6 Chart Types** — equity curves, convergence, scatter, heatmap, drawdown, distribution
 
---
 
## 🗂️ Project Structure
 
```
quantedge-labs/
│
├── backend/                    ← Python FastAPI
│   ├── main.py                 ← All API endpoints
│   ├── data.py                 ← Data fetching + 20 indicators
│   ├── ga.py                   ← Genetic Algorithm
│   ├── pso.py                  ← Particle Swarm Optimization
│   ├── transformer.py          ← Transformer signal (pure NumPy)
│   ├── backtest.py             ← Trading simulation engine
│   └── requirements.txt        ← Python dependencies
│
├── frontend/                   ← React TypeScript UI
│   ├── src/
│   │   ├── components/         ← All UI components
│   │   │   ├── tabs/           ← Performance, Config, Analytics, Simulation
│   │   │   ├── LiveSignalCard.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   └── ...charts
│   │   ├── pages/
│   │   │   └── Index.tsx       ← Main app
│   │   └── lib/
│   │       └── api.ts          ← API calls
│   └── package.json
│
├── README.md
└── .gitignore
```
 
---
 
## 🧬 Algorithm Details
 
### Chromosome Representation
```
Without Transformer: [RSI_buy, RSI_sell, MA_short, MA_long, stop_loss, take_profit]
With Transformer:    [RSI_buy, RSI_sell, MA_short, MA_long, stop_loss, take_profit, transformer_weight]
```
 
### Fitness Function
```
Fitness = Sharpe Ratio = (Mean Daily Return / Std Daily Return) × √252
```
 
### GA Parameters
 
| Parameter | Value |
|-----------|-------|
| Population Size | 50 |
| Generations | 40 |
| Crossover Rate | 0.8 |
| Mutation Rate | 0.2 |
| Selection | Tournament (k=5) |
 
### PSO Parameters
 
| Parameter | Value |
|-----------|-------|
| Particles | 50 |
| Iterations | 40 |
| Inertia (W) | 0.7 |
| Cognitive (C1) | 1.5 |
| Social (C2) | 1.5 |
| Inertia Decay | 0.99 |
 
### Transformer Signal
 
| Component | Detail |
|-----------|--------|
| Architecture | Self-attention encoder |
| Input | 60-day window × 20 features |
| Output | P(market UP tomorrow) ∈ [0,1] |
| Implementation | Pure NumPy (no PyTorch/TF) |
 
---
 
## 📦 Dataset
 
| Property | Value |
|----------|-------|
| Source | Yahoo Finance via yfinance |
| Index | Nifty Bank (^NSEBANK) |
| Period | September 2007 to May 2025 |
| Rows | ~4,355 trading days |
| Features | 20 technical indicators |
| Split | 70% Train / 15% Val / 15% Test |
 
### Technical Indicators Used
RSI (7, 14), SMA (10, 20, 50, 200), EMA (10, 20, 50), MACD, MACD Signal,
MACD Histogram, Bollinger Bands (Upper, Lower, Width, Position), ATR Normalized,
Returns (5d, 10d, 20d), 20-day Volatility
 
---
 
## 🚀 How to Run
 
### Prerequisites
- Python 3.12+
- Node.js 18+
 
### Backend
```bash
cd backend
python -m venv venv
 
# Windows
venv\Scripts\activate
 
# Mac/Linux
source venv/bin/activate
 
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
 
API docs available at: `http://localhost:8000/docs`
 
### Frontend
```bash
cd frontend
npm install
npm run dev
```
 
Open: `http://localhost:8080`
 
### Environment Variables
Create `.env` in the frontend folder:
```
VITE_API_URL=http://localhost:8000
```
 
---
 
## 🔌 API Endpoints
 
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/sectors` | Available sectors |
| POST | `/api/optimize` | Run GA + PSO optimization |
| POST | `/api/paper-trade` | Paper trading simulation |
| GET | `/api/live-signal` | Today's market signal |
| POST | `/api/transformer-window` | Update transformer window |
 
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Language | Python 3.12, TypeScript |
| Data | yfinance, pandas, numpy |
| EC Algorithms | Pure Python (numpy) |
| ML | NumPy Transformer |
| Preprocessing | scikit-learn MinMaxScaler |
| API | FastAPI, uvicorn |
| Frontend | React 18, Tailwind CSS |
| Charts | Recharts |
| Deployment | Railway (backend) |
| Version Control | GitHub |
 
---
 
## 🔌 Live Demo
 
- **Backend API**: https://quantedge-backend-production.up.railway.app/docs
- **Frontend**: Run locally using instructions above
 
---
 
## 📄 Research Paper
 
This project is submitted as an IEEE format research paper:
 
**Title:** "Genetic Algorithm and Particle Swarm Optimization Based Trading Strategy System for the Indian Banking Sector with Transformer Signal Integration"
 
**Abstract:** This paper presents an intelligent trading strategy optimization system for the Indian Banking Sector (Bank Nifty Index). A Transformer encoder generates a daily directional signal from 60-day sequential market patterns using self-attention mechanisms. This signal is incorporated as an additional gene in a chromosome representation optimized by both Genetic Algorithm (GA) and Particle Swarm Optimization (PSO) to maximize the Sharpe Ratio. Experimental results on 18 years of Bank Nifty data demonstrate that PSO achieves the highest risk-adjusted return with a Sharpe Ratio of 1.4277, while PSO augmented with Transformer signal achieves the highest raw return of 45.82%.
 
**Keywords:** Genetic Algorithm, Particle Swarm Optimization, Algorithmic Trading, Transformer Encoder, Sharpe Ratio, Bank Nifty, Evolutionary Computing, Financial Machine Learning
 
---
 
## 👩‍💻 Author
 
**Riddhima Shah**  
BTech Final Year Project  
Subjects: Evolutionary Computing + Advanced Topics in Machine Learning  
 
---
 
## 📝 License
 
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.