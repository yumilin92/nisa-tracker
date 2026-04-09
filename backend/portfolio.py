from prices import get_current_price, TICKERS

# NISA annual contribution limits (2024 rules)
NISA_LIMITS = {
    "tsumitate": 120_000,   # JPY per year — index funds only
    "growth":  1_200_000,   # JPY per year — stocks, ETFs, active funds
}

def calculate_position(fund_name: str, units: float, avg_price: float) -> dict:
    """
    Calculate current value and return for a single portfolio position.

    Args:
        fund_name:  key from TICKERS dict (e.g. 'emaxis_sp500')
        units:      number of units purchased
        avg_price:  average purchase price per unit in JPY

    Returns:
        dict with cost, current value, gain/loss in JPY and percent
    """
    ticker = TICKERS.get(fund_name)
    if not ticker:
        return {"error": f"Unknown fund: {fund_name}"}

    current_price = get_current_price(ticker)
    cost           = round(units * avg_price, 2)
    current_value  = round(units * current_price, 2)
    gain_jpy       = round(current_value - cost, 2)
    gain_pct       = round((gain_jpy / cost) * 100, 2) if cost > 0 else 0

    return {
        "fund":          fund_name,
        "units":         units,
        "avg_price":     avg_price,
        "current_price": current_price,
        "cost":          cost,
        "current_value": current_value,
        "gain_jpy":      gain_jpy,
        "gain_pct":      gain_pct,
    }

def calculate_portfolio(positions: list[dict]) -> dict:
    """
    Calculate total portfolio summary from a list of positions.

    Args:
        positions: list of dicts with keys: fund_name, units, avg_price

    Returns:
        dict with per-position breakdown and portfolio totals
    """
    results      = []
    total_cost   = 0
    total_value  = 0
    total_contributed = 0  # tracks NISA limit usage

    for pos in positions:
        result = calculate_position(
            pos["fund_name"],
            pos["units"],
            pos["avg_price"],
        )
        results.append(result)
        total_cost  += result.get("cost", 0)
        total_value += result.get("current_value", 0)
        total_contributed += result.get("cost", 0)

    total_gain_jpy = round(total_value - total_cost, 2)
    total_gain_pct = round((total_gain_jpy / total_cost) * 100, 2) if total_cost > 0 else 0

    return {
        "positions":       results,
        "total_cost":      round(total_cost, 2),
        "total_value":     round(total_value, 2),
        "total_gain_jpy":  total_gain_jpy,
        "total_gain_pct":  total_gain_pct,
        "nisa_used":       round(total_contributed, 2),
        "nisa_remaining":  round(NISA_LIMITS["growth"] - total_contributed, 2),
    }
