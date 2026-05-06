Log this brew via push_brew. Treat all fields as final - no confirmation
before submitting. If you have feedback for Claude Code on the logging path,
mention it so I can relay.

push_brew aggregates ALL validation errors in one response. Fix everything
in a single retry round. For canonical lookups call read_canonical(axis:
"<name>") with one of: cultivars, terroirs, processes, roasters, producers,
brewers, filters, flavors, roast-levels, grinders, extraction-strategies,
modifiers. For genuinely net-new roaster / producer / brewer / filter /
grinder, set the matching *_override: true flag - the override path also
queues the value for canonical promotion via taxonomy_overrides_queue (Phase 3),
and push_brew echoes queued_for_taxonomy_review[] in the response so you can
confirm the queue picked it up. Cultivars and terroirs are strict - no override;
net-new requires either a registry edit OR a propose_canonical_addition call
followed by an arbiter session. Return the brew_id on success.

Here is the completed archive entry:
[paste the formatted archive recipe]
