import { useState, useEffect } from "react"
import axios from "axios"
import PriceCard from "./components/PriceCard"
import PortfolioForm from "./components/PortfolioForm"
import PortfolioSummary from "./components/PortfolioSummary"
import HistoryChart from "./components/HistoryChart"
import RiskCard from "./components/RiskCard"

const API = "http://localhost:8000"

export default function App() {
  const [prices, setPrices] = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [positions, setPositions] = useState([])

  // Fetch current prices on mount
  useEffect(() => {
    axios.get(`${API}/prices`).then(res => setPrices(res.data))
  }, [])

  // Recalculate portfolio whenever positions change
  useEffect(() => {
    if (positions.length === 0) return
    axios.post(`${API}/portfolio`, positions).then(res => setPortfolio(res.data))
  }, [positions])

  const addPosition = (pos) => {
    setPositions(prev => [...prev, pos])
  }

  const removePosition = (index) => {
    setPositions(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="app">
      <header>
        <h1>🇯🇵 NISA Tracker</h1>
        <p className="subtitle">Track your Japanese NISA portfolio in real time</p>
      </header>

      <section className="prices-section">
        <h2>Live Prices</h2>
        <div className="price-cards">
          {prices ? (
            <>
              <PriceCard label="eMAXIS Slim S&P500" value={prices.emaxis_sp500} unit="¥" />
              <PriceCard label="eMAXIS Slim All Country" value={prices.emaxis_allcountry} unit="¥" />
              <PriceCard label="USD / JPY" value={prices.usdjpy} unit="¥" decimals={2} />
            </>
          ) : (
            <p>Loading prices...</p>
          )}
        </div>
      </section>

      <section className="portfolio-section">
        <h2>My Portfolio</h2>
        <PortfolioForm onAdd={addPosition} />
        {portfolio && <PortfolioSummary portfolio={portfolio} onRemove={removePosition} />}
      </section>

      <section className="risk-section">
        <h2>Risk Analysis</h2>
        <RiskCard positions={positions} />
      </section>

      <section className="chart-section">
        <h2>Price History</h2>
        <HistoryChart />
      </section>
    </div>
  )
}