# Shared design system

## Visual direction
The baseline is premium, high-contrast, and modern. Two theme modes are available depending on audience and purpose. `frontend-design` should still push toward a distinctive aesthetic within the chosen theme.

## Theme modes

### Dark premium (default)
For innovation decks, tech presentations, internal strategy. High-impact visual.

- background: near-black (#06060A – #0C0C14)
- cards: rgba(255,255,255,0.025) with subtle borders rgba(255,255,255,0.07)
- text primary: #EEEEF2, secondary: #9090A0, muted: #555568
- primary accent: brand gradient (orange → rose → purple → blue for NFQ)
- ambient depth: radial gradient glows, grain overlay, layered backgrounds
- glass-like cards with restraint: backdrop-filter blur on nav, subtle hover states

### Light corporate
For formal proposals, banking/regulatory audiences, client-facing deliverables. Clean and authoritative.

- background: white (#FFFFFF) with alternating sections (#F5F5F5)
- cards: white with soft box-shadow (0 2px 12px rgba(0,0,0,0.05))
- text primary: dark navy (#100D25), secondary: #595959
- accents via left-border colors on cards (brand orange, pink, blue)
- no ambient glows — depth via shadow and spacing only
- dark cover/divider slides for contrast rhythm

### Choosing a theme
- Dark: when the user asks for "premium", "dark", "tech", or the audience is internal/innovation
- Light: when the user asks for "corporate", "formal", "proposal", "client-facing", or the audience is banking C-level
- When unclear: ask, or default to dark premium

## Typography
- **Display/body**: Inter (or Instrument Sans for dark premium)
- **Mono**: JetBrains Mono — for labels, metadata, counters, section numbers
- Use `clamp()` for responsive sizing: `clamp(min, preferred, max)`
- Avoid tired defaults (Arial, Helvetica) and generic AI aesthetics

## NFQ brand colors (reference palette)
```
orange:  #F48B4A / #EC683E
rose:    #E04870 / #D13B5F
purple:  #9B59B6
blue:    #5B7FC7 / #217BEE / #3B82F6
```

## Component library

### KPI row
Grid of metric cards. Each card has: large number (stat), uppercase label, optional sub-text. Use for hero data points.

### Insight cards
Cards with a colored left border (4px). Three variants:
- **default**: brand orange border
- **info**: blue border
- **alert**: pink/red border

Use for grouped feature lists, capabilities, or takeaways.

### Action grid
Numbered items in a 2-column grid. Each item has: large colored number, title (bold), description. Use for listing barriers, steps, or requirements.

### Timeline (horizontal)
Connected dots on a gradient line. Each item has: label (phase/date), title, description. Dots are connected with a horizontal gradient bar. Use for phased plans, roadmaps.

### Vertical timeline
Dots connected by a vertical gradient line on the left. Compact. Use for sequential steps, discovery phases, or process flows within a single slide.

### Flow diagram
Horizontal chain of pill-shaped steps connected by arrow characters (→). Use for pipelines, process flows, or lifecycle stages.

### Callout
Light background box with left border accent. Italic text. Use for important notes, caveats, or conditions.

### Takeaway
Bottom-of-section element with top border separator. Bold text. Use for the key conclusion of a slide.

### Case card / credential card
Card with a gradient top bar (4px). Has: label (client type), title (project name), description, bold highlight stat. Use for references and case studies.

### Section divider
Full-bleed slide with: large number (5rem+), section title, subtitle. Use to break between major sections. Creates rhythm and visual breathing room.

### Partner chips
Small pills with company names, grouped by tier. Use for technology partner displays.

## Common patterns
- glass-like cards with restraint (dark mode only)
- strong hierarchy: section-num → heading → subtitle → body → claim
- motion used in high-impact moments, not everywhere
- alternating backgrounds for rhythm (light mode: white/grey, dark mode: surface-0/surface-1)
- gradient accent lines (top of cards, section dividers, progress bars)

## Visual effects (Radiant library)

For premium backgrounds and ambient effects, consider using shaders from [Radiant](https://github.com/nicholasgasior/radiant) (89 self-contained HTML shaders, 0 dependencies, MIT):

- Embed as `<iframe>` backgrounds with `z-index: -1` and `position: fixed`
- Control color via CSS filters: `hue-rotate()`, `saturate()`, `grayscale()`
- Categories: `fill` (full-canvas textures), `object` (centered elements), `particles` (particle systems)
- Auto-pauses when off-screen (battery friendly), targets 60fps
- Use sparingly — one effect per deck max, only for hero/cover slides or section dividers
- Best for: dark premium theme cover slides, innovation decks, tech demos

**Color scheme overrides via CSS filter:**
| Scheme | Filter |
|--------|--------|
| Amber (default) | none |
| Blue | `hue-rotate(175deg)` |
| Rose | `hue-rotate(300deg) saturate(1.1)` |
| Emerald | `hue-rotate(90deg) saturate(1.2)` |

## Readability rule
If the deck looks clever but makes the user squint, it failed. Test: can you read body text at arm's length on a projected screen?
