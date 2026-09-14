#!/usr/bin/env bash
# get-price.sh — Fetch current stock price for a ticker
# Usage: ./get-price.sh AAPL
# Returns JSON: {"ticker":"AAPL","price":234.56,"change_pct":-1.2,"volume":45000000}

set -euo pipefail

TICKER="${1:?Usage: get-price.sh TICKER}"
TICKER=$(echo "$TICKER" | tr '[:lower:]' '[:upper:]')

# Yahoo Finance v8 API (no auth needed)
URL="https://query1.finance.yahoo.com/v8/finance/chart/${TICKER}?interval=1d&range=1d"

response=$(curl -sf -H "User-Agent: Mozilla/5.0" "$URL" 2>/dev/null) || {
  echo "{\"ticker\":\"${TICKER}\",\"error\":\"API request failed\",\"price\":null}"
  exit 1
}

# Parse with python3 (available on macOS)
echo "$response" | python3 -c "
import json, sys
data = json.load(sys.stdin)
result = data.get('chart', {}).get('result', [{}])[0]
meta = result.get('meta', {})
price = meta.get('regularMarketPrice', 0)
prev = meta.get('chartPreviousClose', 0) or meta.get('previousClose', 0)
change_pct = round(((price - prev) / prev) * 100, 2) if prev else 0
volume = meta.get('regularMarketVolume', 0)
print(json.dumps({
    'ticker': '${TICKER}',
    'price': round(price, 2),
    'change_pct': change_pct,
    'volume': volume
}))
" 2>/dev/null || {
  echo "{\"ticker\":\"${TICKER}\",\"error\":\"Parse failed\",\"price\":null}"
  exit 1
}
