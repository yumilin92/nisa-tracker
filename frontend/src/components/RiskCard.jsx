import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://nisa-tracker.onrender.com"

export default function RiskCard({ positions }) {
  const [risk, setRisk]       = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!positions || positions.length === 0) return
    setLoading(true)
    axios.post(`${API}/risk`, positions)
      .then(res => setRisk(res.data))
      .finally(() => setLoading(false))
  }, [positions])

  if (!positions || positions.length === 0) return null
  if (loading) return <div className="risk-card"><p>Analyzing risk...</p></div>
  if (!risk) return null

  return (
    <div className="risk-card">
      <div className="risk-header">
        <h3>Portfolio Risk Analysis</h3>
        <span
          className="risk-badge"
          style={{ background: risk.portfolio_color }}
        >
          {risk.portfolio_label} Risk
        </span>
      </div>

      {/* Overall volatility */}
      <div className="risk-vol">
        <span className="risk-vol-number" style={{ color: risk.portfolio_color }}>
          {risk.portfolio_vol_pct}%
        </span>
        <span className="risk-vol-label">annualized volatility</span>
      </div>

      {/* Interpretation */}
      <p className="risk-interpretation">{risk.interpretation}</p>

      {/* Per-asset breakdown */}
      <div className="risk-assets">
        {risk.assets.map((asset, i) => (
          <div key={i} className="risk-asset-row">
            <span className="risk-asset-name">
              {asset.fund === "emaxis_sp500" ? "eMAXIS Slim S&P500" : "eMAXIS Slim All Country"}
            </span>
            <div className="risk-asset-right">
              <span className="risk-asset-vol">{asset.volatility_pct}% vol</span>
              <span
                className="risk-asset-badge"
                style={{ color: asset.risk_color }}
              >
                {asset.risk_label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}