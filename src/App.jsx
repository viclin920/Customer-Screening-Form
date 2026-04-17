import { useEffect, useMemo, useState } from 'react'

const scoreOptions = [1, 2, 3, 4, 5]

const tierConfig = {
  tier1: {
    label: 'Tier 1｜優先投入',
    badge: 'High Priority',
    desc: '高商業價值 + 技術可行 + 客戶有動機，建議啟動 FAE support / POC planning。',
  },
  tier2: {
    label: 'Tier 2｜持續追蹤',
    badge: 'Monitor',
    desc: '有機會，但資訊尚不足或時機未成熟，建議補齊資訊並持續追蹤。',
  },
  tier3: {
    label: 'Tier 3｜暫不投入',
    badge: 'Low Priority',
    desc: '目前投入產出比不佳，建議先不配置原廠 FAE migration resource。',
  },
}

const painPointOptions = [
  'Cost down pressure',
  'Supply / lead time risk',
  'Performance limitation',
  'Lack of vendor support',
  'Need new features',
  'Need 2nd source / dual source',
]

const techNeedOptions = [
  'UART / SPI / I2C',
  'CAN / LIN',
  'USB',
  'Ethernet',
  'ADC / PWM',
  'LCD / Touch',
  'Low power',
  'Security / Crypto',
]

const emptyForm = {
  customer: '',
  application: '',
  currentSupplier: '',
  currentPN: '',
  stage: '',
  volume: '',
  sop: '',
  owner: '',
  decisionMaker: '',
  coreRequirement: '',
  keyDrivers: '',
  riskPoints: '',
  willingPOC: '',
  shareInfo: '',
  notes: '',
}

const defaultScores = {
  revenue: 3,
  strategic: 3,
  pain: 3,
  fit: 3,
  effort: 3,
  commitment: 3,
}

function ScoreSelector({ label, helper, value, onChange }) {
  return (
    <div className="score-card">
      <div className="score-title">{label}</div>
      <div className="score-helper">{helper}</div>
      <div className="score-options">
        {scoreOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={value === option ? 'score-btn active' : 'score-btn'}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function CheckboxGroup({ title, items, selected, onToggle }) {
  return (
    <div className="checkbox-card">
      <div className="section-subtitle">{title}</div>
      <div className="checkbox-grid">
        {items.map((item) => (
          <label key={item} className="checkbox-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function TextField({ label, value, onChange, placeholder = '' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  )
}

function TextAreaField({ label, value, onChange, rows = 4 }) {
  return (
    <label className="field field-full">
      <span>{label}</span>
      <textarea rows={rows} value={value} onChange={onChange} />
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={onChange}>
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function App() {
  const [form, setForm] = useState(emptyForm)
  const [painPoints, setPainPoints] = useState([])
  const [techNeeds, setTechNeeds] = useState([])
  const [scores, setScores] = useState(defaultScores)

  useEffect(() => {
    document.title = 'Platform Migration Screening Form'
  }, [])

  const totalScore = useMemo(() => Object.values(scores).reduce((a, b) => a + b, 0), [scores])
  const scorePercent = Math.round((totalScore / 30) * 100)

  const tier = useMemo(() => {
    if (totalScore >= 24) return 'tier1'
    if (totalScore >= 18) return 'tier2'
    return 'tier3'
  }, [totalScore])

  const suggestedAction = useMemo(() => {
    if (tier === 'tier1') {
      return [
        '建議啟動原廠 FAE support 評估',
        '定義 POC scope、success criteria、owner 與 timeline',
        '安排 customer technical discussion / migration workshop',
      ]
    }
    if (tier === 'tier2') {
      return [
        '先補齊 current platform、關鍵 driver、SOP 與 volume 資訊',
        '確認客戶是否願意投入工程資源配合 POC',
        '由 sales / rep 持續追蹤專案時程與切換動機',
      ]
    }
    return [
      '暫不建議投入原廠 migration resource',
      '先由業務維持關係並追蹤是否出現新案、cost down 或供應風險',
      '待客戶需求更明確後再重新評估',
    ]
  }, [tier])

  const riskFlags = useMemo(() => {
    const flags = []
    if (!form.owner.trim()) flags.push('尚未確認 technical owner')
    if (!form.decisionMaker.trim()) flags.push('尚未確認 decision maker')
    if (form.willingPOC === 'no') flags.push('客戶目前不願意投入 POC')
    if (form.shareInfo === 'no') flags.push('客戶不願分享足夠技術資訊')
    if (scores.fit <= 2) flags.push('新唐方案匹配度偏低')
    if (scores.effort <= 2) flags.push('migration effort 偏高')
    return flags
  }, [form, scores])

  const toggleItem = (selected, setter, item) => {
    setter(selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item])
  }

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const resetForm = () => {
    setForm(emptyForm)
    setPainPoints([])
    setTechNeeds([])
    setScores(defaultScores)
  }

  const handlePrint = () => window.print()

  return (
    <div className="page">
      <div className="container">
        <header className="hero no-print">
          <div>
            <div className="pill">Cross-Region FAE Support for Platform Migration</div>
            <h1>Customer Screening Form</h1>
            <p>
              讓 sales / reps 勾選與填寫資訊後，自動產出總分、Tier 分類與建議行動，用來評估是否投入原廠 FAE migration resource。
              列印時會自動切換為較乾淨的 A4 版面，可直接另存為 PDF。
            </p>
          </div>
          <div className="hero-actions">
            <button type="button" className="btn secondary" onClick={handlePrint}>
              Export to PDF / Print
            </button>
            <button type="button" className="btn secondary" onClick={resetForm}>
              Reset
            </button>
          </div>
        </header>

        <div className="layout">
          <main className="main-column">
            <section className="card print-card">
              <h2>1. Basic Information</h2>
              <div className="form-grid">
                <TextField label="Customer" value={form.customer} onChange={(e) => updateForm('customer', e.target.value)} />
                <TextField label="Application" value={form.application} onChange={(e) => updateForm('application', e.target.value)} />
                <TextField label="Current MCU Supplier" value={form.currentSupplier} onChange={(e) => updateForm('currentSupplier', e.target.value)} />
                <TextField label="Current MCU PN" value={form.currentPN} onChange={(e) => updateForm('currentPN', e.target.value)} />
                <TextField label="Project Stage" value={form.stage} onChange={(e) => updateForm('stage', e.target.value)} placeholder="New project / redesign / cost down / 2nd source" />
                <TextField label="Estimated Annual Volume" value={form.volume} onChange={(e) => updateForm('volume', e.target.value)} />
                <TextField label="Target SOP / Ramp-up" value={form.sop} onChange={(e) => updateForm('sop', e.target.value)} />
                <TextField label="Technical Owner" value={form.owner} onChange={(e) => updateForm('owner', e.target.value)} />
                <div className="field field-full">
                  <span>Decision Maker</span>
                  <input value={form.decisionMaker} onChange={(e) => updateForm('decisionMaker', e.target.value)} />
                </div>
              </div>
            </section>

            <section className="card print-card">
              <h2>2. Pain Points & Technical Needs</h2>
              <div className="dual-grid">
                <CheckboxGroup
                  title="Customer Pain Points"
                  items={painPointOptions}
                  selected={painPoints}
                  onToggle={(item) => toggleItem(painPoints, setPainPoints, item)}
                />
                <CheckboxGroup
                  title="Key Technical Requirements"
                  items={techNeedOptions}
                  selected={techNeeds}
                  onToggle={(item) => toggleItem(techNeeds, setTechNeeds, item)}
                />
              </div>
              <div className="form-grid top-gap">
                <TextAreaField label="Core / Peripheral Requirement" value={form.coreRequirement} onChange={(e) => updateForm('coreRequirement', e.target.value)} rows={3} />
                <TextAreaField label="Key Drivers / Middleware to Port" value={form.keyDrivers} onChange={(e) => updateForm('keyDrivers', e.target.value)} rows={4} />
                <TextAreaField label="Major Risk Points" value={form.riskPoints} onChange={(e) => updateForm('riskPoints', e.target.value)} rows={4} />
              </div>
            </section>

            <section className="card print-card">
              <h2>3. Customer Readiness</h2>
              <div className="form-grid">
                <SelectField
                  label="Willing to run POC?"
                  value={form.willingPOC}
                  onChange={(e) => updateForm('willingPOC', e.target.value)}
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                    { label: 'Unknown', value: 'unknown' },
                  ]}
                />
                <SelectField
                  label="Can share architecture / code / technical info?"
                  value={form.shareInfo}
                  onChange={(e) => updateForm('shareInfo', e.target.value)}
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                    { label: 'Partial', value: 'partial' },
                    { label: 'Unknown', value: 'unknown' },
                  ]}
                />
                <TextAreaField label="Additional Notes" value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} rows={4} />
              </div>
            </section>

            <section className="card print-card">
              <h2>4. Scoring</h2>
              <div className="score-grid">
                <ScoreSelector
                  label="Revenue Potential"
                  helper="年用量、可延伸專案數量、量產潛力"
                  value={scores.revenue}
                  onChange={(value) => setScores((prev) => ({ ...prev, revenue: value }))}
                />
                <ScoreSelector
                  label="Strategic Value"
                  helper="是否為指標客戶 / 新市場 / 新應用切入點"
                  value={scores.strategic}
                  onChange={(value) => setScores((prev) => ({ ...prev, strategic: value }))}
                />
                <ScoreSelector
                  label="Pain Level"
                  helper="客戶切換動機是否強烈"
                  value={scores.pain}
                  onChange={(value) => setScores((prev) => ({ ...prev, pain: value }))}
                />
                <ScoreSelector
                  label="Technical Fit"
                  helper="新唐方案與需求匹配程度"
                  value={scores.fit}
                  onChange={(value) => setScores((prev) => ({ ...prev, fit: value }))}
                />
                <ScoreSelector
                  label="Migration Effort"
                  helper="分數越高代表 migration 難度越可控"
                  value={scores.effort}
                  onChange={(value) => setScores((prev) => ({ ...prev, effort: value }))}
                />
                <ScoreSelector
                  label="Customer Commitment"
                  helper="客戶願意投入資源與配合度"
                  value={scores.commitment}
                  onChange={(value) => setScores((prev) => ({ ...prev, commitment: value }))}
                />
              </div>
            </section>
          </main>

          <aside className="side-column card print-card">
            <h2>Evaluation Result</h2>

            <div className="result-box">
              <div className="result-top">
                <div>
                  <div className="muted">Total Score</div>
                  <div className="total-score">{totalScore}<span>/ 30</span></div>
                </div>
                <div className="badge">{tierConfig[tier].badge}</div>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${scorePercent}%` }} />
              </div>
              <div className="muted small">{scorePercent}% of maximum score</div>
            </div>

            <div className="summary-box">
              <div className="summary-title">{tierConfig[tier].label}</div>
              <div className="summary-text">{tierConfig[tier].desc}</div>
            </div>

            <div className="summary-box">
              <div className="summary-title">Suggested Actions</div>
              <ul className="bullet-list">
                {suggestedAction.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-box">
              <div className="summary-title">Risk Flags</div>
              {riskFlags.length === 0 ? (
                <div className="summary-text">No major risk flags identified from current inputs.</div>
              ) : (
                <ul className="warning-list">
                  {riskFlags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="summary-box tier-rule">
              <div><strong>Tier 1:</strong> 24–30</div>
              <div><strong>Tier 2:</strong> 18–23</div>
              <div><strong>Tier 3:</strong> 6–17</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
