Log this brew via push_brew. Treat all fields as final - no confirmation
before submitting. If you have feedback for Claude Code on the logging path,
mention it so I can relay.

push_brew aggregates ALL validation errors in one response. Fix everything
in a single retry round. For canonical lookups call read_canonical(axis:
"<name>") with one of: cultivars, terroirs, processes, roasters, producers,
brewers, filters, flavors, roast-levels, grinders, extraction-strategies,
modifiers. For genuinely net-new roaster / producer / brewer / filter /
grinder, set the matching *_override: true flag. Cultivars and terroirs
are strict - no override; net-new requires a registry edit. Return the
brew_id on success.

Here is the completed archive entry:
[paste the formatted archive recipe]
