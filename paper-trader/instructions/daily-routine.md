# Daily Morning Routine (7:30 AM Madrid / CET)

Run this sequence every trading day (Mon-Fri, skip US holidays):

## 1. Check Stops & Update Prices
```bash
bash skills/paper-trader/scripts/portfolio.sh check-stops
```
For each position, use `web_search` to get current/pre-market price. If any position is down ≥10% from avg_price, **auto-sell immediately**. No exceptions.

## 2. Market Scan
Use `web_search` for:
- "stock market news today" — macro overview
- "pre-market movers today" — big moves
- "earnings reports this week" — upcoming catalysts
- "fed interest rate news" / macro events
- Any sector-specific news for current holdings

## 3. Update Existing Theses
For each ACTIVE thesis in `~/Documents/Goals/04 - Resources/Trading/theses/`:
- Search for recent news about the ticker
- Update the thesis file with new data points under `## Updates`
- Re-evaluate: is the thesis still intact? Adjust targets if needed.
- If thesis is invalidated → mark CLOSED, sell position

## 4. Generate New Theses (if < 5 positions)
Look for opportunities from the market scan. A good thesis needs:
- **Clear catalyst** (earnings beat, product launch, regulatory approval, sector rotation)
- **Reasonable valuation** (not buying at ATH without reason)
- **Identifiable risks** (and why they're manageable)
- **Entry/exit targets** with rationale

Create thesis file from template: `skills/paper-trader/templates/thesis.md`

## 5. Execute Trades
For each decision:
```bash
# Get current price
bash skills/paper-trader/scripts/get-price.sh TICKER

# Buy
bash skills/paper-trader/scripts/portfolio.sh buy TICKER SHARES PRICE "reasoning here"

# Sell
bash skills/paper-trader/scripts/portfolio.sh sell TICKER SHARES PRICE "reasoning here"
```

## 6. Write Journal Entry
Create `~/Documents/Goals/04 - Resources/Trading/journal/YYYY-MM-DD.md` from template.
Include: market overview, decisions made (and WHY), trades executed, thesis updates, lessons.

## 7. Update Trading README
Update `~/Documents/Goals/04 - Resources/Trading/README.md` with current performance snapshot.
