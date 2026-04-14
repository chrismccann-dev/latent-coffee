-- Latent Coffee Research Database Schema
-- Multi-user ready with Row Level Security

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "uuid-ossp";

-- ============================================================================
-- USERS PROFILE (extends Supabase auth.users)
-- ============================================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- TERROIRS
-- ============================================================================
create table public.terroirs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Hierarchy
  country text not null,
  admin_region text,           -- e.g., "Huehuetenango"
  macro_terroir text,          -- e.g., "Chiapas Highlands"
  meso_terroir text,           -- e.g., "La Libertad Highlands"
  
  -- Details
  elevation_min integer,
  elevation_max integer,
  climate_stress text,         -- e.g., "cool", "temperate", "warm"
  soil text,
  context text,                -- General terroir description
  cup_profile text,            -- How this terroir typically expresses
  why_it_stands_out text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  unique(user_id, country, admin_region, macro_terroir)
);

-- ============================================================================
-- CULTIVARS
-- ============================================================================
create table public.cultivars (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Hierarchy
  species text default 'Arabica',           -- Arabica, Robusta, Liberica
  genetic_family text,                       -- e.g., "Ethiopian Landrace Families"
  lineage text,                              -- e.g., "Gesha lineage"
  cultivar_name text not null,               -- e.g., "Gesha 1931"
  cultivar_raw text,                         -- Original text before normalization
  
  -- Characteristics
  genetic_background text,
  acidity_style text,
  body_style text,
  aromatics text,
  extraction_sensitivity text,
  roast_tolerance text,
  brewing_tendencies text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  unique(user_id, cultivar_name)
);

-- ============================================================================
-- GREEN BEANS (Lots)
-- ============================================================================
create table public.green_beans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Identification
  lot_id text not null,                      -- e.g., "GUA-LIB-ADC-2024"
  name text not null,                        -- e.g., "Guatemala Libertad - Aurelio del Cerro"
  
  -- Source
  producer text,
  origin text,                               -- Country
  region text,
  variety text,                              -- Cultivar name(s)
  process text,
  importer text,
  source_type text,                          -- "Importer", "Roaster", "Farm Direct"
  link text,
  
  -- Purchase info
  purchase_date date,
  price_per_kg decimal(10,2),
  quantity_g integer,                        -- Total purchased in grams
  
  -- Green bean specs
  moisture text,                             -- e.g., "10.20%"
  density text,                              -- e.g., "776 g/L"
  
  -- Foreign keys
  terroir_id uuid references public.terroirs(id),
  cultivar_id uuid references public.cultivars(id),
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  unique(user_id, lot_id)
);

-- ============================================================================
-- ROASTS
-- ============================================================================
create table public.roasts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  green_bean_id uuid references public.green_beans(id) on delete cascade not null,
  
  -- Identification
  batch_id text not null,                    -- e.g., "94"
  roast_date date,
  coffee_name text,                          -- Name at time of roast
  
  -- Roast parameters
  profile_link text,                         -- Roest graph URL
  batch_size_g integer,                      -- Green weight
  roasted_weight_g integer,
  weight_loss_pct decimal(5,2),
  
  -- Color
  agtron decimal(5,1),
  color_description text,                    -- e.g., "Medium-light, even"
  
  -- Timing
  yellowing_time text,                       -- e.g., "4:30"
  fc_start text,                             -- First crack time
  fc_temp decimal(5,1),                      -- First crack bean temp
  drop_time text,
  drop_temp decimal(5,1),
  dev_time_s integer,                        -- Development time in seconds
  dev_ratio text,                            -- e.g., "12.8%"
  
  -- Notes
  what_worked text,
  what_didnt text,
  what_to_change text,
  worth_repeating boolean,
  is_reference boolean default false,
  
  -- Roest-specific
  drum_direction text,                       -- "Counterflow", "Classic"
  charge_temp decimal(5,1),
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  unique(user_id, green_bean_id, batch_id)
);

-- ============================================================================
-- EXPERIMENTS
-- ============================================================================
create table public.experiments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  green_bean_id uuid references public.green_beans(id) on delete cascade not null,
  
  experiment_id text not null,               -- e.g., "LIBERTAD-BOURBON-AIR-01"
  batch_ids text,                            -- Comma-separated batch IDs
  
  -- Setup
  context text,
  primary_question text,
  control_baseline text,
  shared_constants text,
  variable_changed text,
  levels_tested text,
  expected_outcomes text,
  failure_boundary text,
  
  -- Results
  observed_outcome_a text,
  observed_outcome_b text,
  observed_outcome_c text,
  observed_outcome_d text,
  winner text,
  key_insight text,
  what_changes_going_forward text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- CUPPINGS
-- ============================================================================
create table public.cuppings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  roast_id uuid references public.roasts(id) on delete cascade not null,
  
  cupping_date date,
  rest_days integer,
  eval_method text,                          -- "Cupping", "Pourover", etc.
  
  -- Ground coffee
  ground_agtron decimal(5,1),
  ground_color_description text,
  
  -- Scores/notes
  aroma text,
  flavor text,
  acidity text,
  body text,
  finish text,
  overall text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- ROAST LEARNINGS (per green bean - synthesis of all roasts)
-- ============================================================================
create table public.roast_learnings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  green_bean_id uuid references public.green_beans(id) on delete cascade not null,
  
  best_batch_id text,
  why_this_roast_won text,
  
  -- Behavior observations
  aromatic_behavior text,
  structural_behavior text,
  elasticity text,
  roast_window_width text,
  
  -- Levers
  primary_lever text,
  secondary_levers text,
  what_didnt_move_needle text,
  
  -- Signals
  underdevelopment_signal text,
  overdevelopment_signal text,
  
  -- Takeaways
  cultivar_takeaway text,
  general_takeaway text,
  reference_roasts text,
  starting_hypothesis text,
  rest_behavior text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  unique(user_id, green_bean_id)
);

-- ============================================================================
-- BREWS (The main document - ties everything together)
-- ============================================================================
create table public.brews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Source
  source text not null,                      -- "self-roasted" or "purchased"
  green_bean_id uuid references public.green_beans(id),
  roast_id uuid references public.roasts(id),
  terroir_id uuid references public.terroirs(id),
  cultivar_id uuid references public.cultivars(id),
  
  -- Coffee info (denormalized for purchased coffees)
  coffee_name text not null,
  roaster text,                              -- For purchased
  variety text,
  process text,
  roast_level text,
  flavor_notes text[],
  
  -- Recipe
  brewer text,
  filter text,
  dose_g decimal(5,1),
  water_g decimal(5,1),
  ratio text,
  grind text,
  temp_c decimal(4,1),
  bloom text,
  pour_structure text,
  total_time text,
  
  -- Extraction strategy
  extraction_strategy text,
  extraction_confirmed text,
  
  -- Sensory
  aroma text,
  attack text,
  mid_palate text,
  body text,
  finish text,
  temperature_evolution text,
  peak_expression text,
  
  -- Learnings
  key_takeaways text[],
  classification text,
  terroir_connection text,
  cultivar_connection text,
  roast_connection text,
  
  -- Flags
  is_process_dominant boolean default false,
  process_category text,
  process_details text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.terroirs enable row level security;
alter table public.cultivars enable row level security;
alter table public.green_beans enable row level security;
alter table public.roasts enable row level security;
alter table public.experiments enable row level security;
alter table public.cuppings enable row level security;
alter table public.roast_learnings enable row level security;
alter table public.brews enable row level security;

-- Profiles: users can only see/edit their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- All other tables: users can only access their own data
-- Terroirs
create policy "Users can view own terroirs" on public.terroirs
  for select using (auth.uid() = user_id);
create policy "Users can insert own terroirs" on public.terroirs
  for insert with check (auth.uid() = user_id);
create policy "Users can update own terroirs" on public.terroirs
  for update using (auth.uid() = user_id);
create policy "Users can delete own terroirs" on public.terroirs
  for delete using (auth.uid() = user_id);

-- Cultivars
create policy "Users can view own cultivars" on public.cultivars
  for select using (auth.uid() = user_id);
create policy "Users can insert own cultivars" on public.cultivars
  for insert with check (auth.uid() = user_id);
create policy "Users can update own cultivars" on public.cultivars
  for update using (auth.uid() = user_id);
create policy "Users can delete own cultivars" on public.cultivars
  for delete using (auth.uid() = user_id);

-- Green Beans
create policy "Users can view own green_beans" on public.green_beans
  for select using (auth.uid() = user_id);
create policy "Users can insert own green_beans" on public.green_beans
  for insert with check (auth.uid() = user_id);
create policy "Users can update own green_beans" on public.green_beans
  for update using (auth.uid() = user_id);
create policy "Users can delete own green_beans" on public.green_beans
  for delete using (auth.uid() = user_id);

-- Roasts
create policy "Users can view own roasts" on public.roasts
  for select using (auth.uid() = user_id);
create policy "Users can insert own roasts" on public.roasts
  for insert with check (auth.uid() = user_id);
create policy "Users can update own roasts" on public.roasts
  for update using (auth.uid() = user_id);
create policy "Users can delete own roasts" on public.roasts
  for delete using (auth.uid() = user_id);

-- Experiments
create policy "Users can view own experiments" on public.experiments
  for select using (auth.uid() = user_id);
create policy "Users can insert own experiments" on public.experiments
  for insert with check (auth.uid() = user_id);
create policy "Users can update own experiments" on public.experiments
  for update using (auth.uid() = user_id);
create policy "Users can delete own experiments" on public.experiments
  for delete using (auth.uid() = user_id);

-- Cuppings
create policy "Users can view own cuppings" on public.cuppings
  for select using (auth.uid() = user_id);
create policy "Users can insert own cuppings" on public.cuppings
  for insert with check (auth.uid() = user_id);
create policy "Users can update own cuppings" on public.cuppings
  for update using (auth.uid() = user_id);
create policy "Users can delete own cuppings" on public.cuppings
  for delete using (auth.uid() = user_id);

-- Roast Learnings
create policy "Users can view own roast_learnings" on public.roast_learnings
  for select using (auth.uid() = user_id);
create policy "Users can insert own roast_learnings" on public.roast_learnings
  for insert with check (auth.uid() = user_id);
create policy "Users can update own roast_learnings" on public.roast_learnings
  for update using (auth.uid() = user_id);
create policy "Users can delete own roast_learnings" on public.roast_learnings
  for delete using (auth.uid() = user_id);

-- Brews
create policy "Users can view own brews" on public.brews
  for select using (auth.uid() = user_id);
create policy "Users can insert own brews" on public.brews
  for insert with check (auth.uid() = user_id);
create policy "Users can update own brews" on public.brews
  for update using (auth.uid() = user_id);
create policy "Users can delete own brews" on public.brews
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to all tables
create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.terroirs
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.cultivars
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.green_beans
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.roasts
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.experiments
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.cuppings
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.roast_learnings
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.brews
  for each row execute procedure public.handle_updated_at();

-- ============================================================================
-- INDEXES for common queries
-- ============================================================================
create index idx_green_beans_user on public.green_beans(user_id);
create index idx_roasts_green_bean on public.roasts(green_bean_id);
create index idx_roasts_user on public.roasts(user_id);
create index idx_cuppings_roast on public.cuppings(roast_id);
create index idx_brews_user on public.brews(user_id);
create index idx_brews_green_bean on public.brews(green_bean_id);
