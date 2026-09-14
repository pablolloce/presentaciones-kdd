#!/usr/bin/env bash
# portfolio.sh — Paper trading portfolio manager
# Usage: ./portfolio.sh {status|buy|sell|check-stops|benchmark|report}

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
PORTFOLIO="$SKILL_DIR/portfolio.json"
GET_PRICE="$SCRIPT_DIR/get-price.sh"

if [ ! -f "$PORTFOLIO" ]; then
  echo "Error: portfolio.json not found at $PORTFOLIO"
  exit 1
fi

cmd_status() {
  python3 -c "
import json
with open('$PORTFOLIO') as f:
    p = json.load(f)
print('=' * 50)
print('PAPER TRADING PORTFOLIO')
print('=' * 50)
print(f\"Cash:          \${p['cash']:,.2f}\")
print(f\"Positions:     {len(p['positions'])}/5\")
print()
if p['positions']:
    print(f\"{'Ticker':<8} {'Shares':>7} {'Avg':>9} {'Current':>9} {'P&L':>10} {'P&L%':>7}\")
    print('-' * 50)
    for pos in p['positions']:
        pnl = (pos['current_price'] - pos['avg_price']) * pos['shares']
        pnl_pct = ((pos['current_price'] / pos['avg_price']) - 1) * 100
        print(f\"{pos['ticker']:<8} {pos['shares']:>7.2f} \${pos['avg_price']:>8.2f} \${pos['current_price']:>8.2f} \${pnl:>9.2f} {pnl_pct:>6.1f}%\")
    print('-' * 50)
print(f\"Total Value:   \${p['total_value']:,.2f}\")
print(f\"Total Return:  {p['performance']['total_return_pct']:.2f}%\")
print(f\"SPY Return:    {p['performance']['benchmark_return_pct']:.2f}%\")
print(f\"Trades:        {p['stats']['total_trades']} (W:{p['stats']['winning_trades']} L:{p['stats']['losing_trades']})\")
print(f\"Realized P&L:  \${p['stats']['total_realized_pnl']:,.2f}\")
print('=' * 50)
"
}

cmd_buy() {
  local ticker="$1" shares="$2" price="$3" reason="$4"
  python3 -c "
import json, sys
from datetime import datetime, timezone

ticker = '$ticker'.upper()
shares = float('$shares')
price = float('$price')
reason = '''$reason'''

with open('$PORTFOLIO') as f:
    p = json.load(f)

cost = shares * price

# Validations
if len(p['positions']) >= 5:
    has_ticker = any(pos['ticker'] == ticker for pos in p['positions'])
    if not has_ticker:
        print('ERROR: Max 5 positions reached'); sys.exit(1)

if cost > p['cash']:
    print(f'ERROR: Insufficient cash. Need \${cost:.2f}, have \${p[\"cash\"]:.2f}'); sys.exit(1)

max_position = p['total_value'] * 0.15
existing = next((pos for pos in p['positions'] if pos['ticker'] == ticker), None)
existing_value = (existing['shares'] * existing['current_price']) if existing else 0
if existing_value + cost > max_position:
    print(f'ERROR: Would exceed 15% max position size (\${max_position:.2f})'); sys.exit(1)

# Execute
p['cash'] -= cost
if existing:
    total_shares = existing['shares'] + shares
    existing['avg_price'] = round(((existing['avg_price'] * existing['shares']) + cost) / total_shares, 2)
    existing['shares'] = total_shares
    existing['current_price'] = price
else:
    p['positions'].append({
        'ticker': ticker, 'shares': shares,
        'avg_price': price, 'current_price': price
    })

p['total_value'] = round(p['cash'] + sum(pos['shares'] * pos['current_price'] for pos in p['positions']), 2)
p['performance']['total_return_pct'] = round(((p['total_value'] / p['starting_capital']) - 1) * 100, 2)

p['transactions'].append({
    'timestamp': datetime.now(timezone.utc).isoformat(),
    'action': 'BUY', 'ticker': ticker,
    'shares': shares, 'price': price,
    'cost': round(cost, 2), 'reason': reason
})
p['stats']['total_trades'] += 1

with open('$PORTFOLIO', 'w') as f:
    json.dump(p, f, indent=2)

print(f'BUY {shares} {ticker} @ \${price:.2f} = \${cost:.2f}')
print(f'Cash remaining: \${p[\"cash\"]:.2f}')
"
}

cmd_sell() {
  local ticker="$1" shares="$2" price="$3" reason="$4"
  python3 -c "
import json, sys
from datetime import datetime, timezone

ticker = '$ticker'.upper()
shares = float('$shares')
price = float('$price')
reason = '''$reason'''

with open('$PORTFOLIO') as f:
    p = json.load(f)

pos = next((x for x in p['positions'] if x['ticker'] == ticker), None)
if not pos:
    print(f'ERROR: No position in {ticker}'); sys.exit(1)
if shares > pos['shares']:
    print(f'ERROR: Only hold {pos[\"shares\"]} shares of {ticker}'); sys.exit(1)

proceeds = shares * price
pnl = (price - pos['avg_price']) * shares

p['cash'] += proceeds
if shares >= pos['shares']:
    p['positions'] = [x for x in p['positions'] if x['ticker'] != ticker]
else:
    pos['shares'] -= shares
    pos['current_price'] = price

p['total_value'] = round(p['cash'] + sum(x['shares'] * x['current_price'] for x in p['positions']), 2)
p['performance']['total_return_pct'] = round(((p['total_value'] / p['starting_capital']) - 1) * 100, 2)
p['stats']['total_realized_pnl'] = round(p['stats']['total_realized_pnl'] + pnl, 2)
if pnl >= 0: p['stats']['winning_trades'] += 1
else: p['stats']['losing_trades'] += 1

p['transactions'].append({
    'timestamp': datetime.now(timezone.utc).isoformat(),
    'action': 'SELL', 'ticker': ticker,
    'shares': shares, 'price': price,
    'proceeds': round(proceeds, 2), 'pnl': round(pnl, 2), 'reason': reason
})
p['stats']['total_trades'] += 1

with open('$PORTFOLIO', 'w') as f:
    json.dump(p, f, indent=2)

print(f'SELL {shares} {ticker} @ \${price:.2f} = \${proceeds:.2f} (P&L: \${pnl:+.2f})')
print(f'Cash: \${p[\"cash\"]:.2f}')
"
}

cmd_check_stops() {
  python3 -c "
import json
with open('$PORTFOLIO') as f:
    p = json.load(f)

if not p['positions']:
    print('No positions to check.')
else:
    for pos in p['positions']:
        change_pct = ((pos['current_price'] / pos['avg_price']) - 1) * 100
        status = ''
        if change_pct <= -10:
            status = '🔴 STOP-LOSS TRIGGERED — SELL IMMEDIATELY'
        elif change_pct <= -7:
            status = '🟡 WARNING — approaching stop-loss'
        elif change_pct >= 20:
            status = '🟢 TAKE-PROFIT REVIEW — re-evaluate thesis'
        else:
            status = '✅ OK'
        print(f'{pos[\"ticker\"]}: {change_pct:+.1f}% — {status}')
"
}

cmd_benchmark() {
  python3 -c "
import json
with open('$PORTFOLIO') as f:
    p = json.load(f)
b = p['benchmark']
port_ret = p['performance']['total_return_pct']
bench_ret = p['performance']['benchmark_return_pct']
alpha = round(port_ret - bench_ret, 2)
print(f'Portfolio:  {port_ret:+.2f}% (\${p[\"total_value\"]:,.2f})')
print(f'SPY:        {bench_ret:+.2f}% (from \${b[\"start_price\"]:.2f} to \${b[\"current_price\"]:.2f})')
print(f'Alpha:      {alpha:+.2f}%')
"
}

cmd_report() {
  python3 -c "
import json
from datetime import datetime
with open('$PORTFOLIO') as f:
    p = json.load(f)

total = p['stats']['total_trades']
wins = p['stats']['winning_trades']
losses = p['stats']['losing_trades']
win_rate = (wins / max(total, 1)) * 100

print('WEEKLY PERFORMANCE REPORT')
print('=' * 40)
print(f'Portfolio Value: \${p[\"total_value\"]:,.2f}')
print(f'Cash: \${p[\"cash\"]:,.2f}')
print(f'Positions: {len(p[\"positions\"])}/5')
print(f'Total Return: {p[\"performance\"][\"total_return_pct\"]:+.2f}%')
print(f'SPY Return: {p[\"performance\"][\"benchmark_return_pct\"]:+.2f}%')
print(f'Alpha: {p[\"performance\"][\"total_return_pct\"] - p[\"performance\"][\"benchmark_return_pct\"]:+.2f}%')
print(f'Trades: {total} (W:{wins} L:{losses})')
print(f'Win Rate: {win_rate:.0f}%')
print(f'Realized P&L: \${p[\"stats\"][\"total_realized_pnl\"]:+,.2f}')
print()
print('Recent Transactions:')
for tx in p['transactions'][-10:]:
    print(f'  {tx[\"timestamp\"][:10]} {tx[\"action\"]} {tx.get(\"shares\",\"\")} {tx[\"ticker\"]} @ \${tx[\"price\"]:.2f} — {tx[\"reason\"][:60]}')
"
}

# Main dispatcher
case "${1:-help}" in
  status)      cmd_status ;;
  buy)         cmd_buy "${2:?ticker}" "${3:?shares}" "${4:?price}" "${5:?reason}" ;;
  sell)        cmd_sell "${2:?ticker}" "${3:?shares}" "${4:?price}" "${5:?reason}" ;;
  check-stops) cmd_check_stops ;;
  benchmark)   cmd_benchmark ;;
  report)      cmd_report ;;
  *)
    echo "Usage: portfolio.sh {status|buy|sell|check-stops|benchmark|report}"
    echo "  buy  TICKER SHARES PRICE \"REASON\""
    echo "  sell TICKER SHARES PRICE \"REASON\""
    ;;
esac
