# Reporting

## Weekly Review (Fridays or weekends)
Generate `week-YYYY-WNN.md`:
```bash
bash skills/paper-trader/scripts/portfolio.sh report
```
Include: portfolio performance vs SPY, trade summary, win rate, lessons learned, plan for next week.

## Price Sources
Primary: `scripts/get-price.sh` (Yahoo Finance API)
Fallback: `web_search "TICKER stock price"` and parse result
Always use most recent available price. Pre-market prices are fine for morning analysis.

## Reporting to Gregor
After the morning routine, send a brief Telegram summary:
- Portfolio value & daily change
- Any trades executed with 1-line reasoning
- Key market observations
- Keep it concise (5-10 lines max)
