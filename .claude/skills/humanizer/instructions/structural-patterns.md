# Structural and Concreteness Patterns

These patterns come from Dan Shipper's AI Style Guide (every.to). They address higher-level writing issues not covered by the word-level patterns in other files.

---

## 25. Meandering Intros / Throat-Clearing

**Problem:** AI opens with context or history instead of the point.

**Before:**
> In today's rapidly changing business environment, companies are increasingly turning to artificial intelligence to streamline their operations. This trend has been accelerating since the early 2020s. In this article, we'll explore how one company made the transition.

**After:**
> Three months after deploying their first AI agent, the ops team realized nobody had logged into the dashboard since January.

**Rule:** If stakes aren't clear by paragraph one, rewrite the opening. Open with friction (failure, doubt, surprise, anxiety), not context.

---

## 26. Summary Endings That Recap

**Problem:** AI wraps up by restating what was already said.

**Before:**
> In conclusion, we've seen how the new architecture improves performance, reduces costs, and simplifies maintenance. These three benefits make it a compelling choice for teams looking to modernize their infrastructure.

**After:**
> The real question isn't whether to migrate. It's what your team will build once they stop fighting the old system.

**Rule:** Endings must extend or reframe, never summarize. Ask: "Does this ending preserve energy or collapse it?"

---

## 27. Theory Before Practice

**Problem:** Abstract explanation comes before the concrete example.

**Before:**
> Retrieval-augmented generation (RAG) combines the strengths of information retrieval systems with generative language models. By grounding the model's outputs in retrieved documents... [3 paragraphs of theory] Here's how we used it:

**After:**
> We needed the bot to stop hallucinating pricing. So we pointed it at our actual rate cards. Here's the setup: [concrete steps first, theory woven in naturally after]

**Rule:** If theory comes before a practical application, reverse the order.

---

## 28. Abstractions Instead of Concrete Nouns

**Problem:** Vague descriptions where specific numbers, names, or examples would work.

**Before:**
> The solution proved to be cost-effective, delivering significant savings while improving operational efficiency.

**After:**
> The solution costs $400/month, replacing a process that required 2 FTEs at $180k/year total.

**Rule:** Replace every abstraction with a concrete noun, verb, or number. "Cost-effective" → actual dollars. "Scaling issues" → "Gmail rate limits blocked 2,000 operations."

---

## 29. Vague Workflow Descriptions

**Problem:** Jargon-heavy process descriptions with no actual steps.

**Before:**
> We spun up a retrieval pipeline with subagents, chunked the corpus, hydrated the cache, and deployed the orchestration layer.

**After:**
> We split the documents into 500-token chunks, stored them in Pinecone, and wrote a Python script that queries the top 5 matches before each API call. The whole thing runs in a single Lambda function.

**Rule:** If a workflow description has no clicks, inputs, file names, or real steps, it's AI filler. Add the actual steps.

---

## 30. Rhetorical Questions as Filler

**Problem:** AI uses rhetorical questions to pad transitions.

**Before:**
> But what does this mean for the average developer? How will these changes impact day-to-day workflows? Let's dive in.

**After:**
> For most developers, the main change is [specific impact].

**Rule:** Cut rhetorical questions or convert to direct statements. "Let's dive in" is always deletable.

---

## 31. Overly Symmetrical Constructions

**Problem:** Sentences that are too balanced, too pleased with their own structure.

**Before:**
> Where the old system was rigid, the new one is flexible. Where it was slow, this one is fast. Where it failed, this one succeeds.

**After:**
> The new system handles the edge cases that used to require manual intervention.

**Rule:** If a sentence sounds too smooth or too clever, it probably is. The test: "Would a tired person at 11pm write it this way?"
