# QuantEdge Labs 

> Engineering Alpha Through Evolution

Intelligent stock trading strategy optimization for Indian markets using Genetic Algorithm, Particle Swarm Optimization, and Transformer Signal Integration.

## Results

| Model | Sharpe | Return | Max DD |
|-------|--------|--------|--------|
| GA | 0.8772 | 25.95% | -10.59% |
| PSO | 1.4277 | 34.40% | -6.47% |
| GA+Transformer | 1.1875 | 35.68% | -8.86% |
| PSO+Transformer | 1.3956 | 45.82% | -8.23% |

## Tech Stack
- Backend: Python, FastAPI, NumPy, Pandas
- EC: Genetic Algorithm, Particle Swarm Optimization
- ML: Transformer Encoder (pure NumPy)
- Frontend: React, TypeScript, Tailwind CSS, Recharts
- Data: Yahoo Finance (Bank Nifty, Nifty IT, Nifty 50)

## How to Run

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- GA + PSO optimization
- Transformer signal integration
- Multi sector support (5 sectors)
- Custom date range with presets
- Live market signal (BUY/SELL/HOLD)
- Strategy comparison tool
- Paper trading simulator
- 6 chart types