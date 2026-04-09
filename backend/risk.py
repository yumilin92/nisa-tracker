import numpy as np
import yfinance as yf
from prices import TICKERS

def get_daily_returns(ticker: str, period: str = "1y") -> np.ndarray:
    """Fetch historical closing prices and compute daily percentage returns."""
    data = yf.Ticker(ticker).history(period=period)
    closes = data["Close"].values
    # Daily return = (today - yesterday) / yesterday
    returns = np.diff(closes) / closes[:-1]
    return returns

def annualized_volatility(returns: np.ndarray) -> float:
    """
    Convert daily volatility to annualized volatility.
    252 = number of trading days in a year.
    """
    return float(np.std(returns) * np.sqrt(252))

def risk_label(vol: float) -> str:
    """Classify annualized volatility into a risk tier."""
    if vol < 0.15:
        return "Low"
    elif vol < 0.25:
        return "Medium"
    else:
        return "High"

def risk_color(label: str) -> str:
    """Return a color code for each risk tier."""
    return {"Low": "#16a34a", "Medium": "#d97706", "High": "#dc2626"}[label]

def analyze_portfolio_risk(positions: list[dict]) -> dict:
    """
    Compute risk metrics for a portfolio of positions.

    Args:
        positions: list of dicts with keys: fund_name, units, avg_price

    Returns:
        dict with per-asset volatility and overall portfolio risk score
    """
    results = []
    weighted_vols = []
    total_cost = sum(p["units"] * p["avg_price"] for p in positions)

    for pos in positions:
        ticker = TICKERS.get(pos["fund_name"])
        if not ticker:
            continue

        returns = get_daily_returns(ticker)
        vol     = annualized_volatility(returns)
        label   = risk_label(vol)
        weight  = (pos["units"] * pos["avg_price"]) / total_cost if total_cost > 0 else 0

        weighted_vols.append(vol * weight)

        results.append({
            "fund":           pos["fund_name"],
            "volatility_pct": round(vol * 100, 2),   # e.g. 18.4 means 18.4%
            "risk_label":     label,
            "risk_color":     risk_color(label),
            "weight_pct":     round(weight * 100, 2),
        })

    portfolio_vol   = sum(weighted_vols)
    portfolio_label = risk_label(portfolio_vol)

    return {
        "assets":              results,
        "portfolio_vol_pct":   round(portfolio_vol * 100, 2),
        "portfolio_label":     portfolio_label,
        "portfolio_color":     risk_color(portfolio_label),
        "interpretation":      _interpret(portfolio_label, portfolio_vol),
    }

def _interpret(label: str, vol: float) -> str:
    """Generate a plain-English interpretation of portfolio risk."""
    vol_pct = round(vol * 100, 1)
    if label == "Low":
        return (
            f"Your portfolio has low volatility ({vol_pct}% annualized). "
            "It tends to move steadily with limited swings — suitable for conservative investors."
        )
    elif label == "Medium":
        return (
            f"Your portfolio has moderate volatility ({vol_pct}% annualized). "
            "Expect occasional swings of 10–25%, typical for equity index funds."
        )
    else:
        return (
            f"Your portfolio has high volatility ({vol_pct}% annualized). "
            "Large price swings are likely — make sure you have a long investment horizon."
        )