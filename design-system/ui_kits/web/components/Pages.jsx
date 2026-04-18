// Pages: Brews list, Brew detail, Terroirs, Cultivars, Green, Login, Add wizard

function BrewsPage({ setRoute }) {
  const [strategy, setStrategy] = useState(null);
  const brews = window.LC_BREWS.filter(b => !strategy || b.strategy === strategy);

  return (
    <div className="page page--wide">
      <div className="page__header">
        <h1 className="page__title">BREWS</h1>
        <div className="page__count">{brews.length} {brews.length === 1 ? 'COFFEE' : 'COFFEES'}</div>
      </div>

      <FilterChips active={strategy} onChange={setStrategy} />

      <div className="brew-grid">
        {brews.map(b => (
          <div key={b.id} className="brew-cell" onClick={() => setRoute({ name: 'brew', id: b.id })}>
            <BrewCover brew={b} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BrewDetailPage({ id, setRoute }) {
  const brew = window.LC_BREWS.find(b => b.id === id) || window.LC_BREWS[0];
  return (
    <div className="page">
      <a className="backlink" onClick={() => setRoute({ name: 'brews' })}>← Back to Brews</a>

      <div className="section-card">
        <div className="hero">
          <BrewCover brew={brew} size="hero" />
          <div style={{ flex: 1 }}>
            <div className="hero__title-row">
              <h1 className="hero__name">{brew.name}</h1>
              <span className={`source-badge ${brew.source === 'self-roasted' ? 'roasted' : 'purchased'}`}>
                {brew.source === 'self-roasted' ? 'ROASTED' : 'PURCHASED'}
              </span>
            </div>
            {brew.roaster && <p className="hero__subline">{brew.roaster}</p>}
            {brew.producer && <p className="hero__subline">{brew.producer}</p>}
            <p className="hero__path">{[brew.country, brew.region, brew.macro].filter(Boolean).join(' · ')}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-1)', paddingTop: 20 }}>
          <div className="section-label">COFFEE DETAILS</div>
          <div className="kv-grid">
            <div><strong>Variety:</strong> {brew.variety}</div>
            <div><strong>Process:</strong> {brew.process}</div>
            <div><strong>Roast:</strong> Light</div>
          </div>
          {brew.flavors && (
            <>
              <div className="section-label" style={{ marginTop: 16 }}>FLAVOR NOTES</div>
              <div className="tags">{brew.flavors.map(f => <span key={f} className="tag">{f}</span>)}</div>
            </>
          )}
        </div>
      </div>

      <div className="section-card">
        <div className="section-label">🌍 TERROIR</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, marginBottom: 8 }}>
          <strong>{brew.country}</strong> → {brew.region} → <strong>{brew.macro}</strong>
        </div>
      </div>

      <div className="section-card">
        <div className="section-label">🧬 CULTIVAR</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14 }}>
          <strong>Coffea arabica</strong> → Typica × Bourbon Crosses → <strong>{brew.variety}</strong>
        </div>
      </div>

      {brew.recipe && (
        <div className="section-card">
          <div className="section-label">BEST BREW RECIPE</div>
          <div className="kv-grid">
            <div><strong>Brewer:</strong> {brew.recipe.brewer}</div>
            <div><strong>Filter:</strong> {brew.recipe.filter}</div>
            <div><strong>Dose:</strong> {brew.recipe.dose}</div>
            <div><strong>Water:</strong> {brew.recipe.water}</div>
            <div><strong>Grind:</strong> {brew.recipe.grind}</div>
            <div><strong>Temp:</strong> {brew.recipe.temp}</div>
          </div>
          {brew.recipe.bloom && <div style={{ marginTop: 12, fontSize: 14 }}><strong>Bloom:</strong> {brew.recipe.bloom}</div>}
          {brew.recipe.pour && <div style={{ fontSize: 14 }}><strong>Pour:</strong> {brew.recipe.pour}</div>}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16, paddingTop:16, borderTop:'1px solid var(--border-1)' }}>
            <div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10.4, color:'var(--fg2)', textTransform:'uppercase', marginBottom:4 }}>Extraction Strategy</div>
              <div style={{ fontSize:14 }}>{brew.strategy}</div>
            </div>
          </div>
        </div>
      )}

      {(brew.aroma || brew.attack || brew.body) && (
        <div className="section-card">
          <div className="section-label">SENSORY NOTES</div>
          <div className="sensory">
            {brew.aroma  && <div className="sensory__row"><span className="sensory__label">Aroma:</span>{brew.aroma}</div>}
            {brew.attack && <div className="sensory__row"><span className="sensory__label">Attack:</span>{brew.attack}</div>}
            {brew.body   && <div className="sensory__row"><span className="sensory__label">Body:</span>{brew.body}</div>}
            {brew.finish && <div className="sensory__row"><span className="sensory__label">Finish:</span>{brew.finish}</div>}
          </div>
        </div>
      )}

      {brew.peak && (
        <div className="section-card--dark">
          <div className="section-label">PEAK EXPRESSION</div>
          <p className="peak">{brew.peak}</p>
        </div>
      )}

      {brew.takeaways && (
        <div className="section-card">
          <div className="section-label">KEY TAKEAWAYS</div>
          <ul className="takeaways">{brew.takeaways.map((t,i) => <li key={i}>{t}</li>)}</ul>
        </div>
      )}

      {brew.learned && (
        <div className="section-card--dark">
          <div className="section-label">WHAT I LEARNED</div>
          <p className="learned">{brew.learned}</p>
        </div>
      )}
    </div>
  );
}

function TerroirsPage({ setRoute }) {
  const total = window.LC_TERROIRS.reduce((n,c) => n + c.regions.length, 0);
  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">TERROIRS</h1>
        <div className="page__count">{total} REGIONS</div>
      </div>
      {window.LC_TERROIRS.map(c => (
        <div className="group" key={c.country}>
          <div className="group__header">
            <div className="group__swatch" style={{ background: c.color }}></div>
            <h2 className="group__title">{c.country} ({c.regions.length})</h2>
          </div>
          {c.regions.map(r => (
            <div key={r.name} className="list-row" onClick={() => setRoute({ name:'terroir', id:r.id })}>
              <div className="list-row__swatch" style={{ background: c.color }}></div>
              <div className="list-row__name">{r.name}</div>
              <div className="list-row__count">{r.count} {r.count === 1 ? 'coffee' : 'coffees'}</div>
              <span className="list-row__arrow">→</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TerroirDetailPage({ id, setRoute }) {
  const country = window.LC_TERROIRS.find(c => c.regions.some(r => r.id === id));
  const region = country?.regions.find(r => r.id === id);
  if (!region) return null;
  const brews = window.LC_BREWS.filter(b => b.macro === id);

  return (
    <div className="page">
      <a className="backlink" onClick={() => setRoute({ name:'terroirs' })}>← Back to Terroirs</a>

      <div className="section-card">
        <div className="group__header" style={{ marginBottom: 8 }}>
          <div className="group__swatch" style={{ background: country.color, width: 24, height: 24 }}></div>
          <div className="page__title">{country.country}</div>
        </div>
        <h1 style={{ fontFamily:'var(--font-sans)', fontSize: 24, fontWeight: 600, margin: '0 0 8px' }}>{region.name}</h1>
        <div className="page__count" style={{ marginBottom: 0 }}>{brews.length} coffees archived</div>
      </div>

      <div className="section-card--dark">
        <div className="section-label">SYNTHESIS</div>
        <p className="synthesis">
          The {region.name.toLowerCase()} consistently expresses a tea-structured malic brightness when
          brewed Clarity-First. Across {brews.length} archived coffees, washed processing holds the
          jasmine register through cooling; naturals need a wider temp window to avoid winey drift.
        </p>
      </div>

      <div className="section-card">
        <div className="section-label">FLAVOR NOTES</div>
        <div className="tags">
          {['jasmine','bergamot','malic acidity','white peach','tea-structured','oolong','citric'].map(f => <span className="tag" key={f}>{f}</span>)}
        </div>
      </div>

      <div className="section-card">
        <div className="section-label">COFFEES FROM THIS TERROIR</div>
        {brews.length === 0 ? (
          <div className="page__count">No archived brews yet.</div>
        ) : brews.map(b => (
          <div key={b.id} className="list-row" onClick={() => setRoute({ name:'brew', id:b.id })}>
            <div className="list-row__swatch" style={{ background: b.color }}></div>
            <div className="list-row__name">{b.name}</div>
            <div className="list-row__count">{b.variety} · {b.process}</div>
            <span className="list-row__arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CultivarsPage({ setRoute }) {
  const total = window.LC_CULTIVARS.reduce((n,f) => n + f.lineages.length, 0);
  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">CULTIVARS</h1>
        <div className="page__count">{total} LINEAGES</div>
      </div>
      {window.LC_CULTIVARS.map(f => (
        <div className="group" key={f.family}>
          <div className="group__header">
            <div className="group__swatch" style={{ background: f.color }}></div>
            <h2 className="group__title">{f.family} ({f.lineages.length})</h2>
          </div>
          {f.lineages.map(l => (
            <div key={l.name} className="list-row" onClick={() => setRoute({ name:'brews' })}>
              <div className="list-row__swatch" style={{ background: f.color }}></div>
              <div className="list-row__name">{l.name}</div>
              <div className="list-row__count">{l.count} {l.count === 1 ? 'coffee' : 'coffees'}</div>
              <span className="list-row__arrow">→</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function GreenPage({ setRoute }) {
  const beans = window.LC_GREEN;
  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">GREEN BEANS</h1>
        <div className="page__count">{beans.length} LOTS</div>
      </div>
      {beans.length === 0 ? (
        <div className="empty">
          <div className="empty__avatar">🌱</div>
          <div className="empty__label">NO GREEN BEANS YET</div>
          <button className="btn btn--primary" onClick={() => setRoute({ name:'add' })}>+ ADD YOUR FIRST LOT</button>
        </div>
      ) : beans.map(b => (
        <div key={b.id} className="list-row" onClick={() => setRoute({ name:'green-detail', id:b.id })}>
          <div className="list-row__swatch" style={{ background: '#2C3E2D' }}></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontFamily:'var(--font-mono)', fontSize: 14, fontWeight: 600, margin:'0 0 2px' }}>{b.name}</h3>
            <p style={{ fontFamily:'var(--font-mono)', fontSize: 11.5, color:'var(--fg2)', margin: 0 }}>{b.origin} · {b.variety} · {b.process}</p>
          </div>
          <div className="list-row__count">{b.roasts} roasts</div>
        </div>
      ))}
    </div>
  );
}

function GreenDetailPage({ id, setRoute }) {
  const bean = window.LC_GREEN.find(b => b.id === id);
  if (!bean) return null;
  return (
    <div className="page">
      <a className="backlink" onClick={() => setRoute({ name:'green' })}>← Back to Green Beans</a>
      <div className="section-card">
        <h1 style={{ fontFamily:'var(--font-sans)', fontSize: 24, fontWeight: 600, margin: '0 0 4px' }}>{bean.name}</h1>
        <div className="page__count" style={{ marginBottom: 12 }}>{bean.origin}</div>
        <div className="kv-grid">
          <div><strong>Variety:</strong> {bean.variety}</div>
          <div><strong>Process:</strong> {bean.process}</div>
          <div><strong>Roasts logged:</strong> {bean.roasts}</div>
        </div>
      </div>
      <div className="section-card">
        <div className="section-label">ROAST LOGS</div>
        <table className="data-table">
          <thead><tr><th>Batch</th><th>Drop °C</th><th>DTR</th><th>Total</th><th>Score</th></tr></thead>
          <tbody>
            <tr><td>#23</td><td>202.1</td><td>1:42</td><td>9:20</td><td>82.5</td></tr>
            <tr className="highlight"><td>#25</td><td>201.4</td><td>1:50</td><td>9:34</td><td>86.0</td></tr>
            <tr><td>#26</td><td>200.8</td><td>1:55</td><td>9:41</td><td>84.0</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-card--dark">
        <div className="section-label">ROAST LEARNINGS</div>
        <p className="learned">Batch #25 found the window. Drop at 201.4°C, DTR 1:50. Above 202, the fruit closes; below 200.5, the structure goes tea-thin. Elasticity lives in a 1.5°C band.</p>
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  return (
    <div className="login-page">
      <header className="header"><div className="header__inner"><BrandLockup /></div></header>
      <main className="login-main">
        <div className="login-box">
          <h1 className="login-title">Log in</h1>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" defaultValue="chris@latentcoffee.com" />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" defaultValue="••••••••" />
          </div>
          <button className="btn btn--primary" style={{ width:'100%' }} onClick={onLogin}>Log in</button>
          <p className="login-footer-text">Don't have an account? <a>Sign up</a></p>
        </div>
      </main>
    </div>
  );
}

function AddWizardPage({ setRoute }) {
  const [step, setStep] = useState(0);
  const steps = ['Type','Coffee','Terroir','Cultivar','Recipe','Sensory','Learnings','Strategy','Review'];
  return (
    <div className="wizard">
      <a className="backlink" onClick={() => setRoute({ name:'brews' })}>← Cancel</a>

      <div className="wizard__steps">
        {steps.map((s,i) => (
          <div key={s} className={`wizard__step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}></div>
        ))}
      </div>

      <div className="section-label" style={{ marginBottom: 8 }}>STEP {step+1} OF {steps.length}</div>
      <h2 className="wizard__h">{
        step === 0 ? 'Purchased or self-roasted?' :
        step === 1 ? 'Coffee details' :
        step === 2 ? 'Terroir classification' :
        step === 3 ? 'Cultivar classification' :
        step === 4 ? 'Best brew recipe' :
        step === 5 ? 'Sensory notes' :
        step === 6 ? 'What did you learn?' :
        step === 7 ? 'Extraction strategy' :
        'Review and archive'
      }</h2>
      <p className="wizard__help">{
        step === 0 ? 'Self-roasted uses the 9-step flow. Purchased is a stub today.' :
        step === 7 ? 'Clarity-First is the default for washed light roasts.' :
        'Fill in what you know. Leave blank what you don\'t.'
      }</p>

      {step === 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
          <div className="section-card" style={{ margin: 0, cursor:'pointer' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize: 11, color:'var(--fg2)', letterSpacing:'.1em' }}>PATH 1</div>
            <h3 style={{ fontFamily:'var(--font-sans)', fontSize: 16, fontWeight: 600, margin:'6px 0 8px' }}>Purchased</h3>
            <p style={{ fontSize: 13, color:'var(--fg2)', margin: 0 }}>Roaster sold, you brewed.</p>
          </div>
          <div className="section-card" style={{ margin: 0, cursor:'pointer', borderColor:'var(--fg1)' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize: 11, color:'var(--fg2)', letterSpacing:'.1em' }}>PATH 2</div>
            <h3 style={{ fontFamily:'var(--font-sans)', fontSize: 16, fontWeight: 600, margin:'6px 0 8px' }}>Self-roasted</h3>
            <p style={{ fontSize: 13, color:'var(--fg2)', margin: 0 }}>Green → roast → cup → brew.</p>
          </div>
        </div>
      )}
      {step === 1 && (
        <>
          <div className="form-group"><label className="label">Coffee name</label><input className="input" placeholder="e.g. Nano Challa" /></div>
          <div className="form-group"><label className="label">Roaster</label><input className="input" defaultValue="Latent" /></div>
          <div className="form-group"><label className="label">Producer</label><input className="input" placeholder="e.g. Nano Challa Cooperative" /></div>
        </>
      )}
      {step > 1 && step < 8 && (
        <div className="form-group"><label className="label">Notes</label><textarea className="input" style={{ minHeight: 120 }} /></div>
      )}
      {step === 8 && (
        <div className="section-card" style={{ margin: 0 }}>
          <div className="section-label">SUMMARY</div>
          <div className="kv-grid">
            <div><strong>Type:</strong> Self-roasted</div>
            <div><strong>Strategy:</strong> Clarity-First</div>
            <div><strong>Terroir:</strong> Guji Highlands</div>
            <div><strong>Cultivar:</strong> Ethiopian Landrace</div>
          </div>
        </div>
      )}

      <div className="wizard__actions">
        <button className="btn btn--ghost" onClick={() => step > 0 ? setStep(step-1) : setRoute({ name:'brews' })}>
          {step > 0 ? '← Back' : 'Cancel'}
        </button>
        <button className="btn btn--primary"
                onClick={() => step < steps.length - 1 ? setStep(step + 1) : setRoute({ name:'brews' })}>
          {step < steps.length - 1 ? 'Next →' : 'Archive'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  BrewsPage, BrewDetailPage, TerroirsPage, TerroirDetailPage,
  CultivarsPage, GreenPage, GreenDetailPage, LoginPage, AddWizardPage
});
