// Displays portfolio breakdown and totals
export default function PortfolioSummary({ portfolio, onRemove }) {
  const { positions, total_cost, total_value, total_gain_jpy, total_gain_pct, nisa_used, nisa_remaining } = portfolio
  const isPositive = total_gain_jpy >= 0

  return (
    <div className="portfolio-summary">

      {/* Per-position table */}
      <table>
        <thead>
          <tr>
            <th>Fund</th>
            <th>Units</th>
            <th>Avg Price</th>
            <th>Current Price</th>
            <th>Cost</th>
            <th>Value</th>
            <th>Gain</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, i) => (
            <tr key={i}>
              <td>{pos.fund === "emaxis_sp500" ? "eMAXIS Slim S&P500" : "eMAXIS Slim All Country"}</td>
              <td>{pos.units}</td>
              <td>¥{pos.avg_price.toLocaleString()}</td>
              <td>¥{pos.current_price.toLocaleString()}</td>
              <td>¥{pos.cost.toLocaleString()}</td>
              <td>¥{pos.current_value.toLocaleString()}</td>
              <td className={pos.gain_jpy >= 0 ? "positive" : "negative"}>
                {pos.gain_jpy >= 0 ? "+" : ""}¥{pos.gain_jpy.toLocaleString()} ({pos.gain_pct}%)
              </td>
              <td>
                <button className="remove-btn" onClick={() => onRemove(i)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Portfolio totals */}
      <div className="totals">
        <div className="total-item">
          <span>Total Invested</span>
          <strong>¥{total_cost.toLocaleString()}</strong>
        </div>
        <div className="total-item">
          <span>Current Value</span>
          <strong>¥{total_value.toLocaleString()}</strong>
        </div>
        <div className={`total-item gain ${isPositive ? "positive" : "negative"}`}>
          <span>Total Gain</span>
          <strong>{isPositive ? "+" : ""}¥{total_gain_jpy.toLocaleString()} ({total_gain_pct}%)</strong>
        </div>
      </div>

      {/* NISA limit tracker */}
      <div className="nisa-limits">
        <h3>NISA Growth Limit</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min((nisa_used / 1_200_000) * 100, 100)}%` }}
          />
        </div>
        <p>¥{nisa_used.toLocaleString()} used · ¥{nisa_remaining.toLocaleString()} remaining</p>
      </div>

    </div>
  )
}