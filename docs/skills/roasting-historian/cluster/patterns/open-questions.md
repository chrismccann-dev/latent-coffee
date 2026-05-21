# Open Questions

*Coffee Research · Latent · Roasting Historian cluster · patterns*

Things to test on future roast sessions. **Maintenance rule:** when a question resolves, delete it (don't strikethrough). Resolved-with-strikethrough creates clutter at scale; the resolution lives in [cross-coffee-insights.md](./cross-coffee-insights.md) (if a generalizable pattern emerged) and the commit history.

- Does FC temperature anchor at 204-206°C across all naturals in counterflow regardless of cultivar / density / moisture / drying method? Two lots replicate so far (see [cross-coffee-insights.md § FC-Temp Architectural Constraint on Naturals](./cross-coffee-insights.md#fc-temp-architectural-constraint-on-naturals---working-hypothesis)) — need a 3rd natural lot to promote.

- Is COS-HIG-BOR-2026 v1c (251°C peak, silent FC, drop 208°C) cleanly reproducible? V2a at identical inlet produced audible FC and drop 210.9°C. Watch for repeat on V3 / next-lot replication attempts.

- Audible FC threshold on heavy anaerobic naturals: 251-253°C peak unlocks audible FC; 255°C suppresses again to silent (COS-HIG-BOR-2026 V2 only). Validate on next heavy-anaerobic lot before treating as a generalizable window.

- Does Day 7 pourover consistently reverse the cupping-table verdict on heavy anaerobic Gesha? Confirmed once on CGLE-GESHA-CLOUDS-2026 V1 (#162 won at pourover, #163 won at cupping table). Need 1-2 more heavy-anaerobic-Gesha lots before promoting.

- xbloom evaluation gate false-positive lactic on anaerobic naturals: COS-HIG-BOR-2026 V1 #158 read as defective at xbloom but cleanly resolved at Balanced Intensity pourover. Watch for repeat on Mandela XO retro / next anaerobic natural / co-ferment lot before generalizing "for heavy-ferment lots, run optimized brew on top 2 candidates before declaring underdevelopment."

- Does dev-time outweigh peak inlet for Agtron WB at the low-energy end of a peak-inlet spread? Observed once on RWA-NOVA-NAT21-RB-2026 V1 (Agtron 75 / 82.5 / 81.4 inverted from peak ordering — see [cross-coffee-insights.md § Dev-Time Outweighs Peak Inlet](./cross-coffee-insights.md#dev-time-outweighs-peak-inlet-for-agtron-wb-at-low-energy-spread-end-rwa-nova-nat21-rb-2026-v1-observed-2026-05)). Validate on next V1 with a low-energy floor batch.

- Does session-position acceleration on a high-peak third batch need profile-end-condition (bean temp) to keep drop on target? RWA-NOVA-NAT21-RB-2026 v1c produced a 1.7°C ceiling breach (see [cross-coffee-insights.md § Session-Position Acceleration vs Drop Ceiling](./cross-coffee-insights.md#session-position-acceleration-vs-drop-ceiling-on-high-peak-third-batch-rwa-nova-nat21-rb-2026-v1-observed-2026-05)). Test mitigation (bean-temp 207°C end condition) on next V1 with a high-peak third batch.

- For washed Gesha in counterflow, does 48s dev-time floor hold across new lots? Confirmed once on GV-OMA-25-035 (3 underdeveloped batches at 24-40s dev). Use shaped fan from the start on future Gesha lots. Promote when next washed Gesha lot exhibits the same below-48s underdevelopment.

- One-shot calibrations where density is unmeasured: is altitude alone a reliable proxy for energy direction? ECU-TD24-RANCHOTIO-TM-WASHED Batch 179 (1,300m, -2°C peak inlet hedge applied) underdeveloped. Default until 2+ more one-shot data points: full anchor energy, no altitude-based downward hedge, 125°C hopper pre-load.

- Does the SR Natural V3/V4 low-energy slow-bake template generalize to other naturals as a recovery move when peak-inlet sweep fails? Reserved as architectural follow-up if the FC-Temp Architectural Constraint hypothesis promotes to confirmed.

- Does the Gesha Clouds v2a-vs-#162 divergence reflect green aging? V2a at strict replication produced Agtron WB 6 points lighter on what was meant to be reproduction. Watch the next strict-replication attempt on a 2+-week-aged green to see whether this is bean-specific or a general aging effect.

- Does bean-temp end condition (replacing dev-time end condition) hold up across more heavy-anaerobic lots? Working on Mandela XO V4 + CGLE-GESHA-CLOUDS-2026 V2. Promote to default for all heavy-anaerobic experiments; dev-time only as a true safety-net layered on top.
