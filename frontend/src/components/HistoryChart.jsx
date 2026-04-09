import { useState, useEffect } from "react"
import axios from "axios"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

const API = "http://localhost:8000"

const FUNDS = [
  { value: "emaxis_sp500",      label: "eMAXIS Slim S&P500" },
  { value: "emaxis_allcountry", label: "eMAXIS Slim All Country" },
]

const PERIODS = [
  { value: "1mo", label: "1M" },
  { value: "3mo", label: "3M" },
  { value: "6mo", label: "6M" },
  { value: "1y",  label: "1Y" },
  { value: "2y",  label: "2Y" },
]

// Format date string for display on X axis
function formatDate(dateStr, period) {
  const date = new Date(dateStr)
  if (period === "1mo" || period === "3mo") {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }
  return date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
}

// Custom tooltip shown on hover
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-date">{label}</p>
      <p className="tooltip-price">¥{payload[0].value.toLocaleString()}</p>
    </div>
  )
}

export default function HistoryChart() {
  const [fund, setFund]     = useState("emaxis_sp500")
  const [period, setPeriod] = useState("1y")
  const [data, setData]     = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`${API}/history/${fund}?period=${period}`)
      .then(res => {
        // Add formatted date label for X axis
        const formatted = res.data.map(d => ({
          ...d,
          label: formatDate(d.date, period),
        }))
        setData(formatted)
      })
      .finally(() => setLoading(false))
  }, [fund, period])

  // Calculate price change over the selected period
  const change = data.length >= 2
    ? data[data.length - 1].price - data[0].price
    : 0
  const changePct = data.length >= 2
    ? ((change / data[0].price) * 100).toFixed(2)
    : 0
  const isPositive = change >= 0

  return (
    <div className="history-chart">

      {/* Controls */}
      <div className="chart-controls">
        <div className="chart-fund-tabs">
          {FUNDS.map(f => (
            <button
              key={f.value}
              className={`tab-btn ${fund === f.value ? "active" : ""}`}
              onClick={() => setFund(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="chart-period-tabs">
          {PERIODS.map(p => (
            <button
              key={p.value}
              className={`period-btn ${period === p.value ? "active" : ""}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Period return badge */}
      {data.length > 0 && (
        <div className="chart-meta">
          <span className="chart-latest">¥{data[data.length - 1]?.price.toLocaleString()}</span>
          <span className={`chart-change ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? "▲" : "▼"} {isPositive ? "+" : ""}{change.toFixed(0).toLocaleString()} ({changePct}%)
          </span>
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <div className="chart-loading">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#aaa" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#aaa" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `¥${(v / 1000).toFixed(0)}k`}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#4f46e5" : "#dc2626"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}