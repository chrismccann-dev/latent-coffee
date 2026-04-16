-- Backfill cultivar behavior fields from brewing spreadsheet Cultivars tab
-- Fields: roast_behavior, resting_behavior, market_context

-- 74110/74112
UPDATE cultivars SET
  roast_behavior = 'Prefers light',
  resting_behavior = 'Needs rest',
  market_context = 'Specialty'
WHERE id = 'fb96e464-397b-447e-b6ae-b2fab4845f52';

-- 74158
UPDATE cultivars SET
  roast_behavior = 'Tends to reward shorter/clean development (preserves florals + fruit); extended development can mute top notes.',
  resting_behavior = 'Often improves with a bit of rest, Ethiopian high-aromatic lots can be volatile very early',
  market_context = 'Specialty premium / competition-adjacent'
WHERE id = '08a53114-31b2-4938-94d8-98fe745d15d2';

-- 74158/74110/74112 blend
UPDATE cultivars SET
  roast_behavior = 'Performs best ultra-light',
  resting_behavior = 'Under-rested tastes grassy',
  market_context = 'Specialty staple'
WHERE id = 'db4fad06-8f72-4aac-bbc5-cbbef4866bf3';

-- Bourbon / Caturra blend
UPDATE cultivars SET
  roast_behavior = 'Handles moderate development well; increased development emphasizes cocoa and sugar browning',
  resting_behavior = 'Stable; performs consistently across rest windows',
  market_context = 'Specialty-commercial bridge; classic Guatemala profile'
WHERE id = '184d38ca-7af2-4402-97e2-f7f5ead828e9';

-- Bourbon Aruzi
UPDATE cultivars SET
  roast_behavior = 'Handles light-medium',
  resting_behavior = 'Stable',
  market_context = 'Estate-focused specialty'
WHERE id = '001c404e-4c35-48f2-a477-24aee3844ab3';

-- Castillo
UPDATE cultivars SET
  roast_behavior = 'Even heat',
  resting_behavior = 'Stable',
  market_context = 'Widely planted'
WHERE id = '677530f4-916f-4115-9e72-1ce21b81806b';

-- Catimor Group
UPDATE cultivars SET
  roast_behavior = 'Tends to tolerate more development than delicate heirloom types, but can flatten quickly',
  resting_behavior = 'Usually stable and not especially volatile',
  market_context = 'Volume-stable, disease-management-driven, commercial-to-specialty depending on selection'
WHERE id = '29817e43-bd4a-4517-92c8-11f3b4c3ffdb';

-- Catuaí
UPDATE cultivars SET
  roast_behavior = 'Handles extended development. Prefers moderate development to build sweetness. Easily mutes if pushed too dark.',
  resting_behavior = 'Fast opener. Stable profile with moderate rest. Does not require extended aging.',
  market_context = 'Volume stable. Widely planted workhorse cultivar. Valued for reliability, yield, and balanced cup profile.'
WHERE id = '73c4bd41-047e-4ee3-b920-9da9f0a81e02';

-- Caturra
UPDATE cultivars SET
  roast_behavior = 'Even',
  resting_behavior = 'Stable',
  market_context = 'Classic cultivar'
WHERE id = 'a9068464-ce15-4aaa-ba56-e5c76ff17de4';

-- Ethiopian landrace population
UPDATE cultivars SET
  roast_behavior = 'Prefers shorter development; extended development mutes florals',
  resting_behavior = 'Often volatile early; improves with moderate rest',
  market_context = 'Specialty premium; foundation of high-end Ethiopian coffee; frequently used in competition coffees'
WHERE id = 'dc73c6cd-b218-4ff6-8bee-ce995fcad105';

-- Garnica
UPDATE cultivars SET
  roast_behavior = 'Accepts more development',
  resting_behavior = 'Stable',
  market_context = 'Commercial-specialty bridge'
WHERE id = 'e1e3b317-f6e5-4ab7-aff7-a433d11702c9';

-- Gesha (Brazilian selection)
UPDATE cultivars SET
  roast_behavior = 'Prefers shorter development; excessive development quickly suppresses florality.',
  resting_behavior = 'Volatile early; benefits from moderate rest before peak expression.',
  market_context = 'Specialty premium; often used to explore Gesha expression outside Panama and Colombia.'
WHERE id = '9db53534-eab7-474a-b92f-74872f32c332';

-- Gesha (Colombian selection)
UPDATE cultivars SET
  roast_behavior = 'Narrow development window',
  resting_behavior = 'Needs sufficient rest',
  market_context = 'High-end specialty'
WHERE id = '1926024c-9bc6-4cf7-bfb7-017fc955e799';

-- Gesha (Panamanian selection)
UPDATE cultivars SET
  roast_behavior = 'Loses florals quickly',
  resting_behavior = 'Improves after 2-3 weeks',
  market_context = 'Ultra-premium'
WHERE id = 'cb1e1af2-49d4-4f6a-913d-7590bba5068d';

-- Gesha 1931
UPDATE cultivars SET
  roast_behavior = 'Prefers short, controlled development; easily mutes with excess heat; small roast changes shift expression significantly',
  resting_behavior = 'Often volatile early; improves with rest (commonly 2-3+ weeks for peak clarity)',
  market_context = 'Ultra-premium; competition-driven; benchmark cultivar for high-end specialty'
WHERE id = '1934018e-81b6-4c95-8f84-ec181862bc58';

-- Java
UPDATE cultivars SET
  roast_behavior = 'Prefers shorter development; easily loses clarity and aromatics with excess heat; roast level strongly impacts profile',
  resting_behavior = 'Often improves with moderate rest; early cups can feel slightly sharp or thin',
  market_context = 'Specialty premium; increasingly used in high-end Central American and Rwandan lots'
WHERE id = '4026df68-4a4f-46d5-9aee-ab2f012e99ac';

-- Laurina
UPDATE cultivars SET
  roast_behavior = 'Light-medium tolerant',
  resting_behavior = 'Stable',
  market_context = 'Boutique novelty'
WHERE id = '71ccda24-813e-498e-b345-c65ab7de924c';

-- Maracaturra
UPDATE cultivars SET
  roast_behavior = 'Handles development better than Gesha; too much heat flattens fruit into cocoa-heavy profile',
  resting_behavior = 'Benefits from rest; tends to stabilize and sweeten after initial degassing',
  market_context = 'Specialty premium (recognizable but variable); used in competitions occasionally'
WHERE id = 'bfd3f87f-be8a-4a66-807d-3136376aec1f';

-- Marsellesa
UPDATE cultivars SET
  roast_behavior = 'Handles extended development better than Gesha; avoid baking which can make hybrids taste woody',
  resting_behavior = 'Typically stable after moderate rest',
  market_context = 'Volume-stable + specialty-capable (workhorse with upside)'
WHERE id = '09e42b01-dff1-48dd-bd1c-731068b96430';

-- Mejorado
UPDATE cultivars SET
  roast_behavior = 'Tends to favor light roast approaches with careful Maillard development; excessive development can flatten florals and mute the refined acidity',
  resting_behavior = 'Often improves with a short rest that allows florals and sweetness to open while maintaining structure; not usually treated as a cultivar that needs unusually long rest by default',
  market_context = 'High-value specialty cultivar with strong competition and auction appeal, often discussed alongside Sidra and Gesha in Ecuadorian quality conversations'
WHERE id = 'e5752a92-78ee-4578-af44-176171295ce1';

-- Mokkita
UPDATE cultivars SET
  roast_behavior = 'Even heat tolerance',
  resting_behavior = 'Stable',
  market_context = 'Emerging specialty'
WHERE id = '2109b2fc-3724-4ce2-b0cd-efb62a8a502b';

-- Pacamara
UPDATE cultivars SET
  roast_behavior = 'Requires careful heat',
  resting_behavior = 'Benefits from rest',
  market_context = 'Recognized but variable'
WHERE id = '8cf189aa-2b25-4abf-8f22-5bc065a49f5c';

-- Pink Bourbon
UPDATE cultivars SET
  roast_behavior = 'Prefers shorter development. Easily mutes under excess heat. Can taste thin if underdeveloped.',
  resting_behavior = 'Volatile early. Improves with moderate rest. Peak window often narrower than Bourbon classic.',
  market_context = 'Specialty premium. Often positioned as a Gesha alternative with stronger fruit character. Popular in competition and high-end Colombian microlots.'
WHERE id = '23ca9d8b-d75b-46ec-9d23-1f504546df40';

-- Purple Caturra
UPDATE cultivars SET
  roast_behavior = 'Too much development can turn fruit into generic caramel; too light can emphasize ferment sharpness',
  resting_behavior = 'Can be volatile early if heavily processed; often stabilizes after moderate rest',
  market_context = 'Experimental / specialty premium micro-lots'
WHERE id = 'ac55be18-24f0-4504-a8a6-ab3f46ea81bc';

-- Red Bourbon
UPDATE cultivars SET
  roast_behavior = 'Handles moderate development; too much development flattens fruit into generic caramel',
  resting_behavior = 'Stable; improves with moderate rest',
  market_context = 'Specialty staple / quality premium (also appears in volume contexts depending on origin)'
WHERE id = 'cda05d83-29b1-4c0a-a12c-c7568ee41e9b';

-- Red Bourbon / Mibirizi blend
UPDATE cultivars SET
  roast_behavior = 'Handles moderate development; too much flattens acidity',
  resting_behavior = 'Improves with rest',
  market_context = 'Specialty staple'
WHERE id = 'ab5e492d-464e-42eb-a363-2ae4e9c507c0';

-- Rosado
UPDATE cultivars SET
  roast_behavior = 'Prefers shorter development; easily mutes with excess heat; can feel thin if underdeveloped',
  resting_behavior = 'Often volatile early; improves with moderate rest',
  market_context = 'Specialty premium / experimental micro-lots'
WHERE id = '1557b09e-d20f-482d-acc5-7252b3620bed';

-- Sidra
UPDATE cultivars SET
  roast_behavior = 'Prefers shorter development to preserve aromatics; heavier development can mute florals.',
  resting_behavior = 'Often improves with rest; early cups may be volatile in aromatic lots.',
  market_context = 'Specialty premium / competition-driven'
WHERE id = 'a4ce33c3-6f4a-4b9e-b5ba-ecbc1be71531';

-- Sudan Rume
UPDATE cultivars SET
  roast_behavior = 'Easily muted if overdeveloped; usually benefits from preserving aromatic lift',
  resting_behavior = 'Often benefits from a careful rest rather than very early opening',
  market_context = 'Specialty premium; rare/competition-adjacent'
WHERE id = '87d2f24a-9720-4a3a-ad70-ef0163a3ee1b';
