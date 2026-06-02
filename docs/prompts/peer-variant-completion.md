Use when a finished brew is a PEER-ROASTED VARIANT: an external roaster's
version of a green-bean lot I either already hold or may roast myself later
(the ~25-30%+ of lots where I buy the roasted version from the same source as
a calibration anchor for the roasting side - CGLE Sudan Rume Natural / Wush
Wush / every Untold Coffee Lab lot pattern). A peer variant is a PURCHASED
brew, so it does NOT trip the self-roasted gate - it gets a full push_brew like
any purchased coffee, AND it emits a Peer-Variant Handoff for the roasting
thread. The handoff is the point: a raw get_brew hands the roasting thread
roast-contaminated cup notes with no guidance on how to discount them, and the
single most valuable judgment - how much of the cup is the bean vs their roast -
can only be made brewing-side, at completion, with the Agtron in hand.

The operator knows up front this is a peer variant; the brew DESIGN + iteration
ran through start-brew.md (Steps 1-3) like any brew. This prompt is the
COMPLETION. It is a superset of bundled-brewing-completion.md: do everything
that prompt does, then add the peer-specific ending.

I will give you at the top:
- Latent green lot: <green_bean_id or lot_id, or "none yet">
- (the peer brew's own brew_id is captured from STEP A's push_brew response)

STEP A - standard purchased-brew completion. Run the FULL
bundled-brewing-completion.md flow: fetch it with
read_doc(uri="docs://prompts/bundled-brewing-completion.md") and follow it
end to end - push_brew (STEP 1) then propose_doc_changes for the brewing
lessons (STEP 2). A peer variant is a real brewing session with real brewing
lessons (the Intensity-Clarity Split confirmations, the dark-roast-override
reads); those lessons belong in the brewing-historian cluster exactly like any
other brew, so do NOT skip the propose_doc_changes pass. The self-roasted HARD
GATE in that prompt will pass cleanly because a peer variant is purchased.
Capture the brew_id from the push_brew success response - the handoff and the
FK link both need it.

STEP B - emit the Peer-Variant Handoff. Plain markdown I can copy out and
carry to the roasting thread. Do NOT write the handoff into any roasting-side
cluster doc from here - that crosses the project boundary; emit it as a
saveable artifact and let the roasting side file it. Open with the roast-level
read, then the 5 fields, in this exact shape:

ROAST-LEVEL READ (the dial - weights everything below). Whole-bean Agtron WB +
visual (oily? color? past second crack?), stated as a distance from my
light/ultra-light window (the archive light/ultra-light norm clusters ~75-90+
Agtron WB). If I did not measure Agtron, estimate from color/oil and label it
an estimate. This single line sets how hard to discount everything that
follows.

1. PAIRING + PROVENANCE. Peer roaster; their roast level (Agtron WB + visual);
   process / variety / origin. Same-lot confirmation is GRADED, not binary -
   state the level you can actually confirm: "exact crop lot confirmed" vs
   "confirmed at producer / farm / variety / process; exact crop lot pending a
   roaster check." Then the link line:
   - Green lot exists -> set the FK now: patch_green_bean(green_bean_id:
     <the lot>, peer_reference_brew_id: <brew_id from STEP A>). Resolve the
     green_bean_id via get_green_bean({lot_id}) if I only gave a lot_id.
     Confirm in the handoff which lot + brew the link connects.
   - No green lot yet -> mark the link DEFERRED and record the brew_id here so
     start-lot.md sets peer_reference_brew_id when it creates the green lot. Do
     NOT create a skeleton green-bean row (it buys nothing and costs a dedup
     hazard + a phantom in_inventory lot).

2. INFORMATION-VALUE RATING: High / Medium / Low + a one-line reason, anchored
   on how far their roast level sits from my light/ultra-light philosophy. An
   edge qualifier is allowed ("Low, upper edge near Low/Medium"). Rubric:
   - High - same lot, roast near my window: most of the cup is bean, lots to
     transfer.
   - Medium - roast somewhat off my window: real but partial signal; discount
     the roast-developed register.
   - Low - roast overtakes everything (variety / origin / process stop
     mattering): near-zero transfer, mostly a discount list.
   This is the dial for everything below; state it plainly.

3. CUP READ - bean-attributable vs roast-attributable vs entangled. This split
   is the whole point of the handoff. Three labeled buckets, and tag each note
   with a confidence scaled to the info-value rating (Low -> lean skeptical,
   weak tags; High -> firmer):
   - Bean-attributable: notes that are the green showing through.
   - Roast-attributable: notes that are their roast development, not the lot.
   - Entangled (flag, do NOT transfer): notes that are partly bean, partly
     roast and cannot be cleanly separated from this single data point (e.g.
     "deep sweetness" - partly low-elevation bean density, partly roast
     development; "light brown sugar" - partly variety, partly caramelization).
     Name them explicitly rather than forcing them into one bucket.

4. ROAST-DESIGN TAKEAWAY FOR MY ROAST. The actionable line(s) for how I should
   roast this green, hypothesis-flagged at Medium/Low. If transfer is minimal,
   say so plainly and do NOT manufacture takeaways. Two required elements:
   - A "what I'm NOT taking from this peer cup" line that names the roast
     parameters the peer cannot inform - drop temp, dev time, RoR shape,
     Maillard %, end-condition selection. The peer brew says nothing about
     those at the roaster's machine; naming them guards against inventing
     transfers the data does not support.
   - Hypothesis confirm / contradict: if the peer cup confirms or contradicts a
     hypothesis I already hold about this green ("Untold roasts this medium,
     bias lighter"), call it out - a confirmation is high-value even at Medium.
     When there is no prior hypothesis (first peer brew on this green), frame
     the peer cup as a BASELINE FLOOR instead: "at <their Agtron> the green is
     already this expressive; at my lighter target it should be more so."

5. DISCOUNT LIST - the roast-contaminated notes that must NOT drive my roast
   design. The failure-mode test: "if my own roast produces this, I overshot."
   Pull the clearly roast-attributable register (ashiness / smokiness / dark
   black-tea body / buried-sweetness profile / easy-cooling-integration) out of
   field 3 into a flat do-not-chase list.

End with: if the link was deferred, a one-line reminder to paste this into the
green lot's start-lot.md thread; if the green lot exists, a one-line note of
the lot + brew the peer_reference_brew_id link now connects.

Coffee URL:
Latent green lot (green_bean_id / lot_id, or "none yet"):
