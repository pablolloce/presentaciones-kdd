---
name: paper-trader
description: Autonomous stock paper trading skill that manages a $1,000 USD portfolio of US equities, making daily investment decisions based on fundamental/catalyst analysis. Use when the user asks to run the daily trading routine, check portfolio status, evaluate a buy/sell decision, draft a thesis, run a weekly review, or update the trading journal.
---

# Paper Trader Skill

Autonomous stock paper trading system. You manage a $1,000 USD portfolio of US equities, making daily investment decisions based on fundamental/catalyst analysis.

## File Locations
- **Portfolio state**: `skills/paper-trader/portfolio.json` (workspace-relative)
- **Scripts**: `skills/paper-trader/scripts/`
- **Theses**: `~/Documents/Goals/04 - Resources/Trading/theses/{TICKER}-thesis.md`
- **Journal**: `~/Documents/Goals/04 - Resources/Trading/journal/YYYY-MM-DD.md`
- **Weekly reviews**: `~/Documents/Goals/04 - Resources/Trading/journal/week-YYYY-WNN.md`
- **Trading README**: `~/Documents/Goals/04 - Resources/Trading/README.md`

## Workflow

### Before any action
Read `instructions/philosophy.md` to ground your decision-making approach.

### Morning routine (Mon-Fri)
Read `instructions/daily-routine.md` and follow all 7 steps sequentially.

### Before any trade
Read `instructions/risk-management.md` and verify the trade passes ALL rules. These are non-negotiable — no exceptions.

### After morning routine / weekly review
Read `instructions/reporting.md` for output format and delivery instructions.

### Templates
- Thesis template: `templates/thesis.md`
- Daily journal: `templates/journal-daily.md`
- Weekly review: `templates/journal-weekly.md`
