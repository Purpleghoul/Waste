import { useState, useEffect } from 'react'
import './style.css'

const steps = [
  { label: 'Postcode', enabled: true },
  { label: 'Waste Type', enabled: true },
  { label: 'Select Skip', enabled: true },
  { label: 'Permit Check', enabled: false },
  { label: 'Choose Date', enabled: false },
  { label: 'Payment', enabled: false },
]

const skipImages: Record<number, string> = {
  4: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/4-yarder-skip.jpg',
  5: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/5-yarder-skip.jpg',
  6: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/6-yarder-skip.jpg',
  8: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/8-yarder-skip.jpg',
  10: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/10-yarder-skip.jpg',
  12: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/12-yarder-skip.jpg',
  14: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/14-yarder-skip.jpg',
  16: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/16-yarder-skip.jpg',
  20: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/20-yarder-skip.jpg',
  40: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/40-yarder-skip.jpg',
}

function SkipIcon() {
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="10" width="44" height="16" rx="3" fill="#26A69A"/>
      <rect x="8" y="6" width="32" height="8" rx="2" fill="#B2DFDB"/>
      <rect x="14" y="2" width="20" height="6" rx="1.5" fill="#26A69A"/>
    </svg>
  )
}

export default function App() {
  const [step, setStep] = useState(2)
  const [skips, setSkips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [sizeFilter, setSizeFilter] = useState('')
  const [roadFilter, setRoadFilter] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 600px)').matches)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft')
      .then(r => r.json())
      .then(data => setSkips(data))
      .finally(() => setLoading(false))
  }, [])

  const uniqueSizes = Array.from(new Set(skips.map(s => s.size))).sort((a, b) => a - b)
  const filteredSkips = skips.filter(skip => {
    const sizeMatch = sizeFilter ? skip.size === Number(sizeFilter) : true
    const roadMatch = roadFilter ? (roadFilter === 'yes' ? skip.allowed_on_road : !skip.allowed_on_road) : true
    return sizeMatch && roadMatch
  })

  return (
    <div className="app-flex">
      {!isMobile && (
        <aside className="sidebar-stepper">
          <div className="stepper-vertical">
            {steps.map((s, i) => (
              <div key={s.label} className={`stepper-circle${i === step ? ' active' : ''}${!s.enabled ? ' disabled' : ''}${s.enabled && i < step ? ' completed' : ''}`}> 
                <span className="circle-num">{i + 1}</span>
                <span className="circle-label">{s.label}</span>
              </div>
            ))}
          </div>
        </aside>
      )}
      <main className="main-content-list">
        <header className="header-gradient">
          <h2 className="skip-title poppins">Choose Your Skip Size</h2>
          <p className="skip-desc poppins">Select the skip size that best suits your needs</p>
          <div className="skip-filter-bar">
            <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)} className="skip-filter-select">
              <option value="">All Sizes</option>
              {uniqueSizes.map(size => (
                <option key={size} value={size}>{size} Yards</option>
              ))}
            </select>
            <select value={roadFilter} onChange={e => setRoadFilter(e.target.value)} className="skip-filter-select">
              <option value="">All Locations</option>
              <option value="yes">Allowed on Road</option>
              <option value="no">Not Allowed on Road</option>
            </select>
          </div>
        </header>
        {loading ? (
          <div className="skip-loading">Loading skips...</div>
        ) : (
          <ul className="skip-list" role="listbox" aria-label="Skip container list">
            {filteredSkips.map((skip, idx) => (
              <li
                key={skip.id || skip.size}
                className={`skip-list-item${selected.includes(idx) ? ' selected' : ''}`}
                aria-selected={selected.includes(idx)}
              >
                <div className="skip-list-row">
                  <span className="skip-list-icon">
                    <img
                      src={skipImages[skip.size] || ''}
                      alt={skip.size + ' yard skip'}
                      width={72}
                      height={48}
                      style={{ borderRadius: 10, objectFit: 'cover', background: '#e0f7fa' }}
                    />
                  </span>
                  <button
                    className="skip-list-main"
                    aria-expanded={expanded === idx}
                    aria-controls={`skip-details-${idx}`}
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                  >
                    <span className="skip-list-info">
                      <span className="skip-list-size poppins">{skip.size} Yard Skip</span>
                      <span className="skip-list-period">{skip.hire_period_days} days hire period</span>
                      <span className="skip-list-price">£{skip.price_before_vat}</span>
                    </span>
                    <span className="skip-list-expand" aria-label="Expand details">{expanded === idx ? '▲' : '▼'}</span>
                  </button>
                  <button
                    className="skip-list-select"
                    aria-label={`Select or deselect ${skip.size} yard skip`}
                    onClick={() => {
                      setSelected(selected =>
                        selected.includes(idx)
                          ? selected.filter(i => i !== idx)
                          : [...selected, idx]
                      )
                    }}
                  >
                    {selected.includes(idx) ? <span className="skip-list-check">✔</span> : 'Select'}
                  </button>
                </div>
                {expanded === idx && (
                  <div className="skip-list-details" id={`skip-details-${idx}`}>
                    <div className="skip-list-detail-row">
                      <span className="skip-list-detail-label">Allowed on Road:</span>
                      <span>{skip.allowed_on_road ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="skip-list-detail-row">
                      <span className="skip-list-detail-label">Eco-Friendly:</span>
                      <span>Recyclable Materials Supported</span>
                    </div>
                    <div className="skip-list-detail-row">
                      <span className="skip-list-detail-label">VAT:</span>
                      <span>{skip.vat}%</span>
                    </div>
                    <div className="skip-list-detail-row">
                      <span className="skip-list-detail-label">Postcode:</span>
                      <span>{skip.postcode}</span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <aside className="summary-panel">
        {selected.length > 0 && (
          <div className="summary-box">
            <div className="summary-box-inner">
              <div className="summary-title poppins">Selected Skips</div>
              {selected.map(selIdx => (
                filteredSkips[selIdx] && (
                  <div key={selIdx} style={{marginBottom: 12}}>
                    <div className="summary-row"><span>Size:</span> <span>{filteredSkips[selIdx].size} Yards</span></div>
                    <div className="summary-row"><span>Hire Period:</span> <span>{filteredSkips[selIdx].hire_period_days} days</span></div>
                    <div className="summary-row"><span>Price:</span> <span>£{filteredSkips[selIdx].price_before_vat}</span></div>
                    <div className="summary-row"><span>Eco:</span> <span>Recyclable Materials Supported</span></div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  )
} 