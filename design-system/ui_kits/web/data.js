window.LC_NAV = [
  { label: 'BREWS', route: 'brews' },
  { label: 'TERROIRS', route: 'terroirs' },
  { label: 'CULTIVARS', route: 'cultivars' },
  { label: 'GREEN', route: 'green' },
];

window.LC_BREWS = [
  {
    id: 'b1',
    name: 'Nano Challa',
    roaster: 'Sey',
    producer: 'Nano Challa Cooperative',
    country: 'Ethiopia',
    region: 'Jimma',
    macro: 'Gera Highlands',
    variety: 'Ethiopian Landrace',
    process: 'Washed',
    flavors: ['jasmine','bergamot','white peach','honey'],
    color: '#4A7C59',
    strategy: 'Clarity-First', short: 'CLARITY',
    source: 'purchased',
    aroma: 'Jasmine lifted above warm honey; clean grain in the steam.',
    attack: 'Bright malic, clean citric brightness.',
    body: 'Light, silky — oolong-like texture.',
    finish: 'Clean, quick — jasmine ringing after.',
    peak: 'Rose character only emerges near 40°C — do not evaluate before 50°C.',
    learned: 'This lot confirmed the Clarity-First strategy for washed Ethiopian landraces. The floral layer is downstream of every brew decision; grind coarser than 6.4 and the jasmine collapses into grain.',
    takeaways: [
      'Grind window is tight: 6.2–6.4 on the EG-1.',
      'Do not chase body. The silk IS the point.',
      'Use Sibarist FAST; paper filters dull the finish.',
    ],
    recipe: { brewer:'Orea Glass', filter:'Sibarist FAST', dose:'14g', water:'235g', grind:'6.3', temp:'94°C', bloom:'45g / 0:45', pour:'3 pours, open valve' }
  },
  {
    id: 'b2', name: 'Finca La Reserva', roaster: 'Latent', producer: 'Diego Bermudez',
    country: 'Colombia', region: 'Huila', macro: 'Huila Highlands',
    variety: 'Pink Bourbon', process: 'Anaerobic Natural',
    flavors: ['blackberry','wine','cocoa','strawberry'],
    color: '#722F4B', strategy: 'Full Expression', short: 'FULL',
    source: 'self-roasted',
    aroma:'Blackberry preserve, red wine, faint sulfur.',
    attack:'Tartaric, almost boozy — needs the temp drop.',
    body:'Syrupy mid, dense but not heavy.',
    finish:'Cocoa and dried red fruit.',
    peak:'Hits peak between 45–55°C. Drink fast; it flattens below 40.',
    learned:'Anaerobic naturals over-express below 94°C. Push dose, push grind fine, accept the intensity. Clarity-First was the wrong call here — the coffee wants to be read, not filtered.',
    takeaways:['Roast: drop at 201.4°C, DTR 1:50','Full Expression wins against this process','Wine notes fade fast on rest — drink by day 14'],
    recipe: { brewer:'April Glass', filter:'April paper', dose:'16g', water:'240g', grind:'6.6', temp:'95°C', bloom:'50g / 0:40', pour:'single, valve open' }
  },
  {
    id: 'b3', name: 'Hacienda Sonora', roaster: 'April', producer: 'Diego Robelo',
    country: 'Costa Rica', region: 'Central Valley', macro: 'Costa Rican Central Volcanic Highlands',
    variety: 'SL28', process: 'White Honey',
    flavors: ['apricot','brown sugar','oolong','nectarine'],
    color: '#8B6914', strategy: 'Balanced Intensity', short: 'BALANCED',
    source: 'purchased',
    aroma:'Stone fruit, brown sugar, dry oolong.',
    attack:'Light malic, immediately sweet.',
    body:'Medium, structured — holds shape through cooling.',
    finish:'Long, sweet, gently drying.',
    peak:'Holds across a wide temp band — best case for Balanced Intensity.',
    learned:'White honey SL28 wants bed exposure between pours. Keep dose at 14g, take the contact time long.',
    takeaways:['Honey processes love the SWORKS valve','Don\'t chase malic here; let the sugars lead'],
    recipe: { brewer:'SWORKS Bottomless', filter:'Sibarist FAST', dose:'14g', water:'230g', grind:'6.5', temp:'93°C', bloom:'40g / 0:50', pour:'4 pours, bed exposure' }
  },
  {
    id: 'b4', name: 'Shakiso Gesha', roaster: 'Passenger', producer: 'Faysel Yonis',
    country: 'Ethiopia', region: 'Guji', macro: 'Guji Highlands',
    variety: 'Gesha', process: 'Washed',
    flavors: ['jasmine','bergamot','lychee'],
    color: '#4A7C59', strategy: 'Clarity-First', short: 'CLARITY',
    source: 'purchased',
    peak:'Classic tea-structured Gesha. Nothing to push.',
    recipe: { brewer:'Orea Glass', filter:'Sibarist FAST', dose:'14g', water:'235g', grind:'6.3', temp:'94°C' }
  },
  {
    id: 'b5', name: 'Yusuf Natural', roaster: 'George Howell', producer: 'Yusuf Mohammed',
    country: 'Ethiopia', region: 'Sidama', macro: 'Sidama Highlands',
    variety: 'Ethiopian Landrace', process: 'Natural',
    flavors: ['blueberry','milk chocolate','strawberry'],
    color: '#8B4513', strategy: 'Balanced Intensity', short: 'BALANCED',
    source: 'purchased',
  },
  {
    id: 'b6', name: 'Alo Village 74158', roaster: 'Hydrangea', producer: 'Alo Coffee',
    country: 'Ethiopia', region: 'Bench Sheko', macro: 'Bench Sheko Highlands',
    variety: '74158', process: 'Washed',
    flavors: ['bergamot','honeysuckle','meyer lemon'],
    color: '#3F6F73', strategy: 'Clarity-First', short: 'CLARITY',
    source: 'purchased',
  },
  {
    id: 'b7', name: 'Las Margaritas Gesha', roaster: 'Onyx', producer: 'Arnulfo Leguizamo',
    country: 'Colombia', region: 'Huila', macro: 'Huila Highlands',
    variety: 'Gesha', process: 'Washed',
    flavors: ['jasmine','white grape','bergamot'],
    color: '#4A7C59', strategy: 'Clarity-First', short: 'CLARITY',
    source: 'purchased',
  },
  {
    id: 'b8', name: 'Ninety Plus Level Up', roaster: 'Ninety Plus', producer: 'Ninety Plus',
    country: 'Panama', region: 'Volcán', macro: 'Volcán Barú Highlands',
    variety: 'Gesha', process: 'Anoxic Natural',
    flavors: ['mango','passionfruit','cane sugar'],
    color: '#722F4B', strategy: 'Full Expression', short: 'FULL',
    source: 'purchased',
  },
  {
    id: 'b9', name: 'Monte Cristo', roaster: 'Sey', producer: 'Silvestre',
    country: 'Guatemala', region: 'Huehuetenango', macro: 'Cuchumatanes Highlands',
    variety: 'Bourbon', process: 'Washed',
    flavors: ['red apple','cacao','cane sugar'],
    color: '#5C6570', strategy: 'Balanced Intensity', short: 'BALANCED',
    source: 'purchased',
  },
  {
    id: 'b10', name: 'Finca Deborah Geisha', roaster: 'Proud Mary', producer: 'Jamison Savage',
    country: 'Panama', region: 'Volcán', macro: 'Volcán Barú Highlands',
    variety: 'Gesha', process: 'Washed',
    flavors: ['jasmine','bergamot','mandarin'],
    color: '#4A7C59', strategy: 'Clarity-First', short: 'CLARITY',
    source: 'purchased',
  },
];

window.LC_TERROIRS = [
  { country:'Ethiopia', color:'#6B7B3B', regions:[
    { name:'Guji Highlands', count:5, id:'Guji Highlands' },
    { name:'Sidama Highlands', count:4, id:'Sidama Highlands' },
    { name:'Bench Sheko Highlands', count:2, id:'Bench Sheko Highlands' },
    { name:'Gera Highlands', count:2, id:'Gera Highlands' },
  ]},
  { country:'Colombia', color:'#7A3B4B', regions:[
    { name:'Huila Highlands', count:6, id:'Huila Highlands' },
    { name:'Central Andean Cordillera', count:3, id:'Central Andean Cordillera' },
  ]},
  { country:'Panama', color:'#4A7C59', regions:[
    { name:'Volcán Barú Highlands', count:7, id:'Volcán Barú Highlands' },
  ]},
  { country:'Costa Rica', color:'#2D5E3A', regions:[
    { name:'Costa Rican Central Volcanic Highlands', count:3, id:'Costa Rican Central Volcanic Highlands' },
  ]},
  { country:'Guatemala', color:'#3B5B6B', regions:[
    { name:'Cuchumatanes Highlands', count:2, id:'Cuchumatanes Highlands' },
  ]},
  { country:'Kenya', color:'#8B3B2B', regions:[
    { name:'Nyeri Highlands', count:1, id:'Nyeri Highlands' },
  ]},
];

window.LC_CULTIVARS = [
  { family:'Ethiopian Landrace Families', color:'#4A7C59', lineages:[
    { name:'Ethiopian Landrace', count:8 },
    { name:'74158 / 74110', count:2 },
    { name:'Gesha (Ethiopian)', count:1 },
  ]},
  { family:'Bourbon Family', color:'#3D3D3D', lineages:[
    { name:'Bourbon', count:3 },
    { name:'SL28', count:3 },
    { name:'Pink Bourbon', count:2 },
  ]},
  { family:'Typica × Bourbon Crosses', color:'#3D3D3D', lineages:[
    { name:'Gesha (Panamanian selection)', count:6 },
  ]},
  { family:'Modern Hybrids', color:'#3D3D3D', lineages:[
    { name:'Castillo', count:1 },
  ]},
];

window.LC_GREEN = [
  { id:'g1', name:'Gesha 1931', origin:'Ethiopia · Yirgacheffe', variety:'Gesha', process:'Washed', roasts:6 },
  { id:'g2', name:'Finca La Reserva Pink Bourbon', origin:'Colombia · Huila', variety:'Pink Bourbon', process:'Anaerobic Natural', roasts:9 },
  { id:'g3', name:'Nano Challa 74158', origin:'Ethiopia · Jimma', variety:'74158', process:'Washed', roasts:5 },
  { id:'g4', name:'Monte Cristo Bourbon', origin:'Guatemala · Huehuetenango', variety:'Bourbon', process:'Washed', roasts:4 },
];
