// Displays a single live price tile
export default function PriceCard({ label, value, unit, decimals = 0 }) {
  const formatted = value?.toLocaleString("ja-JP", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <div className="price-card">
      <span className="price-label">{label}</span>
      <span className="price-value">{unit}{formatted}</span>
    </div>
  )
}