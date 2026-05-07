New green bean intake or V1 profile design recovery.

Fetch ROASTING.md via read_doc(uri="docs://roasting.md") and follow the New
Coffee Onboarding Protocol (Step 1 intake -> Step 2 the three questions ->
Step 3 anchor profile selection -> Step 4 V1 design output).

Tools for this session (load via tool_search at session start):
read_doc, read_canonical, push_green_bean, push_inventory, get_green_bean,
push_roast_profile.

For canonical lookups call read_canonical(axis: "<name>") with terroirs /
cultivars / processes / producers as needed (or list_canonicals for the full
catalog of 12 axes).

Routing:
- If this is a fresh intake (lot not yet in DB), I'll paste a LOT SPEC block
  below this message with green data + intake hypothesis. Run Steps 1-4 end
  to end.
- If I reference a lot_id that already exists, recover state via
  get_green_bean({lot_id}) and skip ahead to V1 design.

V1 design default - bracket the window, don't narrow on it:
A first V1 should be a wide directional probe (~5°C peak inlet spread across
a/b/c) unless anchor confidence is genuinely high. V1 establishes the window;
V2 narrows on it. Even when the intake doc suggests a tight spread, ask
whether anchor confidence justifies it - different farm, process variant, or
unfamiliar moisture/density all argue for going wider.

Output expectations:
- push_green_bean + push_inventory (with green_bean_id for FK link) if new;
  get_green_bean if recovering.
- Run Steps 1-4 per ROASTING.md.
- Print the full push_roast_profile payload for v1a/b/c BEFORE pushing -
  all bezier arrays in msec, end_condition + value, name.
- After my confirm, push all three with enable_share=true. Return profile_id
  + share_url + tablet-name table for all three.

Intake fields (paste in the LOT SPEC block when fresh):

Green Lot ID:
Coffee Name:
Variety:
Producer:
Region / Origin:
Seller / Importer:
Process:
Moisture %:
Density g/L:
Purchase Date:
Altitude (optional):
Source type / Price per kg (optional):
Producer's tasting notes (REQUIRED, paste verbatim):
Process detail (fermentation length, drying method, anaerobic / thermal
  shock / co-ferment specifics):
Reference roast comparison (peer / competition lot - what did it taste like?):
Learning intent: [find out what this coffee wants | optimize toward specific
  expression]
