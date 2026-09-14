# Humanizer Eval Test Cases

Run these test cases to verify skill output quality. Each case has an input, expected behavior, and pass/fail criteria.

## Test 1: Heavy AI Slop
**Input:**
> Additionally, this groundbreaking initiative serves as a testament to the organization's commitment to fostering innovation. It's not just a project — it's a pivotal moment that highlights the intricate interplay between technology and human potential, showcasing how these elements come together to create a vibrant tapestry of progress. Industry experts believe this will have a lasting impact on the evolving landscape.

**Must fix:** testament (1), fostering (3), groundbreaking (4), intricate interplay/tapestry (7), pivotal (7), showcasing (7), not just...it's (9), em dash (13), Industry experts believe (5), evolving landscape (7)

**Pass criteria:** Output contains zero words from the AI vocabulary list. Specific claims replace vague ones.

---

## Test 2: Subtle Drift (Harder)
**Input:**
> The company has made significant strides in improving its customer experience. By leveraging cutting-edge technology and fostering a culture of continuous improvement, they've managed to enhance satisfaction scores across multiple touchpoints. The future looks bright as they continue on their journey toward excellence.

**Must fix:** significant strides (1), leveraging (7), fostering (7), enhance (7), generic positive conclusion (24)

**Pass criteria:** Output is shorter. Specific metrics replace vague claims. No "journey toward excellence."

---

## Test 3: Style-Only Issues
**Input:**
> The new feature — which was **highly anticipated** — delivers three core benefits: **speed**, **reliability**, and **security**. Here's what you need to know:
> - **Performance:** Load times have been reduced significantly
> - **Stability:** The system now handles edge cases more gracefully
> - **Protection:** End-to-end encryption has been implemented

**Must fix:** Em dashes (13), excessive bold (14), rule of three (10), inline-header list (15)

**Pass criteria:** Prose replaces list. Bold used only for genuine emphasis (max 1 instance). Max 1 em dash.

---

## Test 4: Communication Artifacts
**Input:**
> Great question! Here's a comprehensive overview of the situation. I hope this helps! As of my last update, the company was exploring several options. It's important to note that these findings are based on available information. Would you like me to elaborate on any section?

**Must fix:** Great question (21), Here's a (19), I hope this helps (19), As of my last update (20), It's important to note (22), Would you like (19)

**Pass criteria:** Zero chatbot artifacts. Output reads as authored content, not a response.

---

## Test 5: Voice Preservation
**Input (casual blog post):**
> So we shipped the thing. It was kind of a mess honestly but it works and people seem to like it. The dashboard loads fast, the API doesn't fall over anymore, and we fixed that weird bug where dates showed up in the wrong timezone. Not bad for two weeks of work.

**Must NOT change:** This text is already human. Natural voice, specific details, honest tone.

**Pass criteria:** Output is nearly identical to input. Humanizer recognizes this doesn't need heavy editing.

---

## Scoring

Run all 5 tests. Score each pass/fail. Minimum passing: 4/5.

| Test | Focus | Weight |
|------|-------|--------|
| 1 | Pattern detection (easy) | 1x |
| 2 | Subtle detection (hard) | 2x |
| 3 | Style-only fixes | 1x |
| 4 | Communication cleanup | 1x |
| 5 | False positive avoidance | 2x |

**Weighted pass threshold: 5/7**
