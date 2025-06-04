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

export default function App() {
  const [step, setStep] = useState(2)
  const [selectedSkip, setSelectedSkip] = useState<number | null>(null)
  const [skips, setSkips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft')
      .then(r => r.json())
      .then(data => {
        setSkips(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="waste-app-light">
      <div className="stepper">
        {steps.map((s, i) => (
          <div key={s.label} className={`step${i === step ? ' active' : ''}${!s.enabled ? ' disabled' : ''}`}> 
            <span className="step-icon">{i + 1}</span>
            <span className="step-label">{s.label}</span>
            {i < steps.length - 1 && <span className="step-divider" />}
          </div>
        ))}
      </div>
      <div className="skip-select-block">
        <h2 className="skip-title">Choose Your Skip Size</h2>
        <p className="skip-desc">Select the skip size that best suits your needs</p>
        {loading ? (
          <div className="skip-loading">Loading skips...</div>
        ) : (
          <div className="skip-grid">
            {skips.map((skip, idx) => (
              <div
                key={skip.id || skip.size}
                className={`skip-card${selectedSkip === idx ? ' selected' : ''}`}
                onClick={() => setSelectedSkip(idx)}
              >
                <div className="skip-img-wrap">
                  <img src={skipImages[skip.size] || skip.imageUrl} alt={skip.name || `${skip.size} Yard Skip`} className="skip-img" />
                  <div className="skip-size-badge">{skip.size} Yards</div>
                  {!skip.allowed_on_road && (
                    <div className="skip-warning">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                      <span>Not Allowed On The Road</span>
                    </div>
                  )}
                </div>
                <div className="skip-info">
                  <div className="skip-name">{skip.name || `${skip.size} Yard Skip`}</div>
                  <div className="skip-period">{skip.hire_period_days} day hire period</div>
                  <div className="skip-price">£{skip.price_before_vat}</div>
                  <button className="skip-btn">Select This Skip</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 