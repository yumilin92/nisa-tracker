import { useState } from "react"

const FUND_OPTIONS = [
  { value: "emaxis_sp500",      label: "eMAXIS Slim S&P500" },
  { value: "emaxis_allcountry", label: "eMAXIS Slim All Country" },
]

export default function PortfolioForm({ onAdd }) {
  const [fund_name, setFund]     = useState("emaxis_sp500")
  const [units, setUnits]         = useState("")
  const [avg_price, setAvgPrice] = useState("")

  const handleSubmit = () => {
    if (!units || !avg_price) return
    onAdd({
      fund_name,
      units:     parseFloat(units),
      avg_price: parseFloat(avg_price),
    })
    setUnits("")
    setAvgPrice("")
  }

  return (
    <div className="portfolio-form">
      <select value={fund_name} onChange={e => setFund(e.target.value)}>
        {FUND_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Units purchased"
        value={units}
        onChange={e => setUnits(e.target.value)}
      />
      <input
        type="number"
        placeholder="Avg price (¥)"
        value={avg_price}
        onChange={e => setAvgPrice(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Position</button>
    </div>
  )
}