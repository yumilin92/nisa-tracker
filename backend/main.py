from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prices import get_all_prices, get_price_history, TICKERS
from portfolio import calculate_portfolio
from risk import analyze_portfolio_risk

app = FastAPI(title="NISA Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/prices")
def prices():
    """Return current prices for all tracked funds."""
    return get_all_prices()

@app.get("/history/{fund_name}")
def history(fund_name: str, period: str = "1y"):
    """Return historical price data for a given fund."""
    ticker = TICKERS.get(fund_name)
    if not ticker:
        return {"error": "Unknown fund"}
    return get_price_history(ticker, period)

@app.post("/portfolio")
def portfolio(positions: list[dict]):
    """
    Calculate portfolio performance.

    Example request body:
    [
      {"fund_name": "emaxis_sp500", "units": 10, "avg_price": 25000},
      {"fund_name": "emaxis_allcountry", "units": 5, "avg_price": 20000}
    ]
    """
    return calculate_portfolio(positions)

@app.post("/risk")
def risk(positions: list[dict]):
    """Analyze portfolio risk based on historical volatility."""
    return analyze_portfolio_risk(positions)
