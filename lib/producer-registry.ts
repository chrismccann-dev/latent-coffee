// Canonical registry of producer names. Sourced from brews.producer post
// migration 018. Adding a new entry is a deliberate decision, not drift —
// same discipline as macro-terroir / cultivar / flavor / roaster registries.
//
// Note on "Person, Farm" convention: the dominant shape across the corpus is
// "<person>, <farm>" (Carlos Morera, El Diamante / Jeferson Motta, Motta Farm
// / Lamastus Family, El Burro). Keep new entries consistent so a future
// producer_name + farm_name column split is a clean parse.

import { makeCanonicalLookup } from './canonical-registry'

export const PRODUCER_REGISTRY = [
  'Abel Dominguez, Blooms Coffee',
  'Aime Gahizi, Gitesi Washing Station',
  'Alo Coffee',
  'Alo Village',
  'Aurelio del Cerro',
  'Buncho, Daye Bensa',
  'Cafe Granja la Esperanza',
  'Carlos Morera, El Diamante',
  'Carmen Estate',
  'Crispilliano Contreras',
  'Daterra Farm',
  'Dinesh Kumar, Importer: Marcus Duran (Adaura Coffee)',
  'Direct with Kotowa',
  'Don Eduardo',
  'El Socorro',
  'Elida Estate',
  'Emilio Entzín',
  'Ernedis Rodriguez',
  'Finca El Jardín',
  'Finca El Paraiso',
  'Finca Faith',
  'Finca La Reserva',
  'Finca Santa Monica',
  'Gesha Village Coffee Estate',
  'Henry Bonilla',
  'Hunter Tedman',
  'Jamison Savage, Direct with Savage Coffees',
  'Jeferson Motta, Motta Farm',
  "Jorge 'Pikudo' Andrade",
  'Julio Madrid, La Riviera',
  'Koko',
  'Lamastus Family, El Burro',
  'Letty Bermudez',
  'Local producers surrounding Ninga washing station',
  'Mama Cata Estate / Garrido Specialty Coffee',
  "Miguel Estela, El Morito Producer's Association",
  'Momokiemo Producers',
  'Nguisse Nare and Murago Outgrowers',
  'Nordic Approach',
  'Pepe Jijon, Finca Soledad',
  'Project One',
  'Rio Cristal - Kotowa',
  'Rodrigo Sanchez, El Eden',
  'Sebastian Ramirez',
  'Tagel Alemayehu, Olkai Coffee',
  'The Holguin Family',
  'The Peterson Family',
  'Yessica and Diego Parra, El Mirador',
  'Yusuf',
] as const

export const PRODUCER_LOOKUP = makeCanonicalLookup(PRODUCER_REGISTRY)
export const isCanonicalProducer = PRODUCER_LOOKUP.isCanonical
export const findClosestProducer = PRODUCER_LOOKUP.findClosest
