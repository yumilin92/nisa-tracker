import yfinance as yf

TICKERS = {
    "emaxis_sp500":      "2558.T",
    "emaxis_allcountry": "2559.T",
    "usdjpy":            "JPY=X",
}

def get_current_price(ticker: str) -> float:
    """Fetch the latest price for a given ticker symbol."""
    data = yf.Ticker(ticker)
    return data.fast_info["last_price"]

def get_all_prices() -> dict:
    """Fetch current prices for all tracked funds and the USD/JPY rate."""
    result = {}
    for name, ticker in TICKERS.items():
        result[name] = get_current_price(ticker)
    return result

def get_price_history(ticker: str, period: str = "1y") -> list:
    """
    Fetch historical closing prices for a given ticker.
    period options: 1mo, 3mo, 6mo, 1y, 2y
    """
    data = yf.Ticker(ticker).history(period=period)
    return [
        {"date": str(idx.date()), "price": round(row["Close"], 2)}
        for idx, row in data.iterrows()
    ]
