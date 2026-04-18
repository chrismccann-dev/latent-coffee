// Small shared components for the Latent Research UI kit.
// All are written as simple function components returning JSX.

const { useState } = React;

function BrandLockup({ onClick }) {
  return (
    <span className="brand-lockup" onClick={onClick}>
      LATENT<span className="sub">RESEARCH</span>
    </span>
  );
}

function Header({ route, setRoute }) {
  return (
    <header className="header">
      <div className="header__inner">
        <BrandLockup onClick={() => setRoute({ name: 'brews' })} />
        <nav className="nav">
          {window.LC_NAV.map(({ label, route: r }) => (
            <a key={r}
               className={`nav__link ${route.name === r ? 'active' : ''}`}
               onClick={() => setRoute({ name: r })}>
              {label}
            </a>
          ))}
        </nav>
        <button className="btn btn--primary sm" onClick={() => setRoute({ name: 'add' })}>+ ADD</button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__text">LATENT RESEARCH</div>
        <div className="footer__text footer__text--subtle">Personal Coffee Journal</div>
      </div>
    </footer>
  );
}

function StrategyPill({ strategy, short }) {
  if (!strategy) return null;
  const cls = strategy.startsWith('Clarity') ? 'clarity' : strategy.startsWith('Balanced') ? 'balanced' : 'full';
  return <span className={`strategy-pill ${cls}`}>{short || strategy}</span>;
}

function BrewCover({ brew, size }) {
  const big = size === 'hero';
  return (
    <div className="brew-cover" style={{ background: brew.color, width: big ? 112 : undefined, height: big ? 160 : undefined, aspectRatio: big ? 'auto' : '3/4' }}>
      <div className="brew-cover__top">
        <div className="brew-cover__meta">
          {brew.variety && <div className="variety">{brew.variety}</div>}
          {brew.process && <div className="dim">{brew.process}</div>}
          {!big && brew.producer && <div className="dim">{brew.producer}</div>}
          {!big && brew.macro && <div className="dim">{brew.macro}</div>}
          {!big && brew.roaster && <div className="dim">{brew.roaster}</div>}
        </div>
        {!big && <StrategyPill strategy={brew.strategy} short={brew.short} />}
      </div>
      <div>
        {!big && brew.flavors && (
          <div className="brew-cover__flavor">{brew.flavors.slice(0, 4).join(' · ')}</div>
        )}
        <div className="brew-cover__watermark">LATENT</div>
      </div>
    </div>
  );
}

function FilterChips({ active, onChange }) {
  const options = [
    { key: null, label: 'All' },
    { key: 'Clarity-First', label: 'Clarity-First' },
    { key: 'Balanced Intensity', label: 'Balanced Intensity' },
    { key: 'Full Expression', label: 'Full Expression' },
  ];
  return (
    <div className="filter-row">
      <span className="filter-row__label">Strategy</span>
      {options.map(({ key, label }) => {
        const isActive = active === key;
        const isAll = key === null;
        const styleColors = {
          'Clarity-First':      { bg:'#E8F0EA', color:'#2D5E3A', border:'#4A7C59' },
          'Balanced Intensity': { bg:'#F5E8D0', color:'#6B4A10', border:'#8B6914' },
          'Full Expression':    { bg:'#F0DCE1', color:'#722F4B', border:'#8B3B4B' },
        }[key];
        const style = isActive
          ? (isAll ? {} : { background: styleColors.border, color:'#fff', borderColor: styleColors.border })
          : (isAll ? {} : { background: styleColors.bg, color: styleColors.color, borderColor: styleColors.border });
        return (
          <button key={label}
                  className={`filter-chip ${isActive ? 'active' : ''}`}
                  style={style}
                  onClick={() => onChange(key)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { BrandLockup, Header, Footer, StrategyPill, BrewCover, FilterChips });
