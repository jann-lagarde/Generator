import React, { useState, useEffect } from 'react'
import './App.css'
import TemplateGallery from './TemplateGallery'
import Preview from './Preview'

// 1. Array precisely synced with your folders and asset screenshots
const TEMPLATES = [
  { id: 'construction', name: 'Build Core', description: 'Premium construction timeline, estimator, and portfolio layout', thumbnail: '/templates/construction/screenshot.png', path: '/templates/construction/index.html', niche: 'Construction' },
  { id: 'lending', name: 'Lending Pro', description: 'Interactive loan calculator & structural financial funnel', thumbnail: '/templates/lending/screenshot.png', path: '/templates/lending/index.html', niche: 'Lending' },
  { id: 'cosmetics', name: 'Cosmetics Lab', description: 'Toll manufacturer product showcase & lab gallery grid', thumbnail: '/templates/cosmetics/screenshot.png', path: '/templates/cosmetics/index.html', niche: 'Cosmetics' },
  { id: 'clinics', name: 'Clinic Care', description: 'Medical service grids and interactive embed map views', thumbnail: '/templates/clinics/screenshot.png', path: '/templates/clinics/index.html', niche: 'Clinics' },
  { id: 'apparel', name: 'Apparel Store', description: 'Sleek product listings with direct order routing guides', thumbnail: '/templates/apparel/screenshot.png', path: '/templates/apparel/index.html', niche: 'Apparel' },
  { id: 'carrental', name: 'Car Rental', description: 'Interactive vehicle showcase layout with sliding pricing tiers', thumbnail: '/templates/car-rental/screenshot.png', path: '/templates/car-rental/index.html', niche: 'Car Rental' },
  { id: 'pestcontrol', name: 'Pest Control', description: 'Instant service quote estimator with emergency guidelines', thumbnail: '/templates/pest-control/screenshot.png', path: '/templates/pest-control/index.html', niche: 'Pest Control' }
]

// Global parameters shared across all wireframes
const GLOBAL_FIELDS = [
  { name: 'siteTitle', label: 'Site Title (Hero Branding)', required: true, type: 'text', placeholder: 'e.g., Apex Ventures' },
  { name: 'companyDetails', label: 'Company Overview / About Us text', type: 'textarea', placeholder: 'Describe your core expertise here...' },
  { name: 'reviews', label: 'Client Testimonial Quote Text', type: 'textarea', placeholder: '"Excellent execution from concept to delivery!"' },
  { name: 'contactEmail', label: 'Destination Email for Funnel Forms', required: true, type: 'text', placeholder: 'leads@domain.com' }
]

// Parameter keys parsed dynamically into structured UI fields
const NICHE_FIELDS = {
  'Construction': [
    ...GLOBAL_FIELDS,
    { name: 'construct_p1_name', label: 'Showcase Project Name', type: 'text', placeholder: 'e.g., Metropolitan Tower Phase 2' },
    { name: 'construct_p1_desc', label: 'Project Scope Summary', type: 'text', placeholder: 'e.g., Structural framing and concrete core engineering.' },
    { name: 'construct_p1_photo', label: 'Project Showcase Photo (.jpg/.png)', type: 'file' },
    { name: 'buildServices', label: 'Core Construction Services List', type: 'textarea', placeholder: 'e.g., General Contracting • Pre-Construction Engineering • Interior Fit-outs' }
  ],
  'Lending': [
    ...GLOBAL_FIELDS,
    { name: 'loan_p1_name', label: 'Primary Loan Product Offered', type: 'text', placeholder: 'e.g., Express SMB Capital' },
    { name: 'loan_p1_desc', label: 'Product Terms Overview', type: 'text', placeholder: 'e.g., Same-day collateral-free operational funding lines.' },
    { name: 'calculatorRates', label: 'Calculator Base Interest Annual Rate (%)', type: 'text', placeholder: '5.5' }
  ],
  'Cosmetics': [
    ...GLOBAL_FIELDS,
    { name: 'cosmetic_p1_name', label: 'Featured Formulation Product Name', type: 'text', placeholder: 'e.g., Organic Hydrating Serum base' },
    { name: 'cosmetic_p1_desc', label: 'Product Key Specification', type: 'text', placeholder: 'e.g., Formulated with active botanical extracts.' },
    { name: 'cosmetic_p1_photo', label: 'Product Display Photo Asset (.jpg/.png)', type: 'file' },
    { name: 'teamLabView', label: 'R&D Laboratory Hub Photo (.jpg/.png)', type: 'file' }
  ],
  'Clinics': [
    ...GLOBAL_FIELDS,
    { name: 'clinic_srv_name', label: 'Specialized Treatment Package Title', type: 'text', placeholder: 'e.g., Advanced Diagnostic Screening' },
    { name: 'services', label: 'Clinical Care Highlights Overview', type: 'textarea', placeholder: 'List specific treatments and procedural disciplines...' },
    { name: 'mapEmbedUrl', label: 'Google Maps Native Embed URL Src String', type: 'text', placeholder: 'https://www.google.com/maps/embed?...' }
  ],
  'Apparel': [
    ...GLOBAL_FIELDS,
    { name: 'apparel_p1_name', label: 'Product 1 Name', type: 'text', placeholder: 'e.g., Heavyweight Box Fit Tee' },
    { name: 'apparel_p1_desc', label: 'Product 1 Description', type: 'text', placeholder: 'e.g., 300gsm luxury combed organic cotton.' },
    { name: 'apparel_p1_price', label: 'Product 1 Retail Price', type: 'text', placeholder: 'e.g., $45.00' },
    { name: 'apparel_p1_photo', label: 'Product 1 Photo File (.jpg/.png)', type: 'file' },
    { name: 'orderGuide', label: 'Step-by-Step Purchase Guidelines', type: 'textarea', placeholder: 'Describe direct checkout or shipping workflows...' }
  ],
  'Car Rental': [
    ...GLOBAL_FIELDS,
    { name: 'car_name', label: 'Featured Showroom Vehicle Name', type: 'text', placeholder: 'e.g., Executive Class Sedan' },
    { name: 'showroom', label: 'Vehicle Class Specifications Fleet Text', type: 'textarea', placeholder: 'Detail vehicle specifications and tiered features...' }
  ],
  'Pest Control': [
    ...GLOBAL_FIELDS,
    { name: 'pestServices', label: 'Extermination Treatments Offered', type: 'textarea', placeholder: 'e.g., Residential Thermal Treatment & Barrier Shielding' },
    { name: 'estimatorRates', label: 'Base Rate Calculation Factor for Quote Engine ($)', type: 'text', placeholder: '120' }
  ]
}

function App() {
  // --- PASTE YOUR HIGH-FIDELITY APPS SCRIPT /EXEC URL HERE ---
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzc4hu7efu5MJhKJXkybCOvN8rjcD3NkSbWTPqGJuMfvhLNVJ7Tc1CImeFb3Mtb8BM-jA/exec'

  // --- CORE AUTHENTICATION STATE PROPS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  // --- ENGINE WORKSPACE STATES ---
  const [selected, setSelected] = useState(null)
  const [data, setData] = useState({})
  const [srcDoc, setSrcDoc] = useState('')

  useEffect(() => {
    if (selected) {
      triggerBasePreview(selected.path)
    } else {
      setSrcDoc('')
    }
  }, [selected])

  async function triggerBasePreview(templatePath) {
    try {
      const res = await fetch(templatePath)
      if (!res.ok) throw new Error()
      const html = await res.text()
      setSrcDoc(html)
    } catch (err) {
      setSrcDoc('<div style="color:red;padding:24px;">Failed to initialize template content framework.</div>')
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain' 
        },
        body: JSON.stringify({
          action: 'login',
          email: email.trim(),
          password: password.trim()
        })
      })

      const result = await response.json()

      if (result.success) {
        setIsAuthenticated(true)
        setCurrentUser({ name: result.name, role: result.role })
        setLoginError('')
      } else {
        setLoginError(result.error || 'Invalid account login credentials.')
      }
    } catch (err) {
      console.error(err)
      setLoginError('Server connection timeout or invalid Web App endpoint URL mapping configuration.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setEmail('')
    setPassword('')
    setSelected(null)
    setData({})
    setSrcDoc('')
  }

  function handleSelect(t) {
    setSelected(t)
    const initial = {}
    const fields = NICHE_FIELDS[t.niche] || []
    fields.forEach(f => initial[f.name] = '')
    setData(initial)
  }

  function handleInputChange(name, value) {
    setData(prev => ({ ...prev, [name]: value }))
  }

  function handleImageUpload(e, fieldName) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setData(prev => ({ ...prev, [fieldName]: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  function escapeHtml(str) {
    if (!str) return ''
    return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"')
  }

  async function generateFinalHtml() {
    if (!selected) return ''
    const res = await fetch(selected.path)
    let html = await res.text()

    html = html.replace(/%%SITE_TITLE%%/g, escapeHtml(data.siteTitle || selected.name))
    html = html.replace(/%%COMPANY_DETAILS%%/g, escapeHtml(data.companyDetails || ''))
    html = html.replace(/%%CONTACT_EMAIL%%/g, escapeHtml(data.contactEmail || 'hello@domain.com'))

    const reviewMarkup = data.reviews ? `
      <div class="review-wrapper" style="padding:24px; background:#18181b; border:1px solid #27272a; border-radius:12px; max-width:600px; margin:0 auto;">
        <p style="color:#d4d4d8; font-style:italic; margin:0;">"${escapeHtml(data.reviews)}"</p>
        <div style="color:#f59e0b; font-weight:bold; font-size:0.85rem; margin-top:12px;">Verified Platform Client</div>
      </div>
    ` : ''
    html = html.replace(/%%REVIEWS%%/g, reviewMarkup)

    const footerHtml = `
      <footer style="padding: 40px 20px; text-align: center; background: #09090b; color: #a1a1aa; font-family: sans-serif; border-top: 1px solid #27272a;">
        Site built and maintained by <a href="https://core-xperts.com" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 600;">Core-xperts</a>
      </footer>
    `
    html = html.includes('%%FOOTER%%') ? html.replace(/%%FOOTER%%/g, footerHtml) : html.replace('</body>', `${footerHtml}</body>`)

    if (selected.id === 'construction') {
      const activePhoto = data.construct_p1_photo || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'
      const portfolioBlock = `
        <div class="project-card" style="background:#111; border:1px solid #222; border-radius:16px; overflow:hidden;">
          <img src="${activePhoto}" style="width:100%; height:260px; object-fit:cover;" />
          <div style="padding:20px;">
            <h3 style="color:#fff; margin:0 0 8px 0;">${escapeHtml(data.construct_p1_name || 'Commercial Infrastructure Project')}</h3>
            <p style="color:#a1a1aa; font-size:0.9rem; margin:0;">${escapeHtml(data.construct_p1_desc || 'High-fidelity workspace asset construction.')}</p>
          </div>
        </div>
      `
      html = html.replace(/%%PROJECT_PORTFOLIO%%/g, portfolioBlock)
      html = html.replace(/%%BUILD_SERVICES%%/g, `<div style="color:#e4e4e7;">${escapeHtml(data.buildServices || '')}</div>`)
    }

    if (selected.id === 'apparel') {
      const apparelPhoto = data.apparel_p1_photo || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80'
      const catalogBlock = `
        <div class="product-grid-item" style="background:#14141b; border:1px solid #262633; padding:16px; border-radius:16px;">
          <img src="${apparelPhoto}" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px;" />
          <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h4 style="color:#fff; margin:0; font-size:1.1rem;">${escapeHtml(data.apparel_p1_name || 'Minimalist Apparel Silhouette')}</h4>
              <p style="color:#a1a1aa; margin:4px 0 0 0; font-size:0.85rem;">${escapeHtml(data.apparel_p1_desc || 'Premium limited-run garment release.')}</p>
            </div>
            <span style="color:#f59e0b; font-weight:bold; background:rgba(245,158,11,0.1); padding:6px 12px; border-radius:6px;">${escapeHtml(data.apparel_p1_price || '$49.00')}</span>
          </div>
        </div>
      `
      html = html.replace(/%%FEATURED_LISTINGS%%/g, catalogBlock)
      html = html.replace(/%%ORDER_GUIDE%%/g, escapeHtml(data.orderGuide || ''))
    }

    if (selected.id === 'cosmetics') {
      const prodPhoto = data.cosmetic_p1_photo || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
      const labPhoto = data.teamLabView || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80'
      const cosmeticBlock = `
        <div style="background:#111; padding:20px; border-radius:12px; border:1px solid #222;">
          <img src="${prodPhoto}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;" />
          <h4 style="color:#fff; margin:12px 0 4px 0;">${escapeHtml(data.cosmetic_p1_name || 'Advanced Clinical Formulation')}</h4>
          <p style="color:#888; font-size:0.85rem; margin:0;">${escapeHtml(data.cosmetic_p1_desc || 'Toll manufacturing certified skin solutions.')}</p>
        </div>
      `
      html = html.replace(/%%SAMPLE_PRODUCTS%%/g, cosmeticBlock)
      html = html.replace(/%%TEAM_LAB_VIEW%%/g, `<img src="${labPhoto}" style="width:100%; border-radius:16px; border:1px solid #262633;" />`)
    }

    html = html.replace(/%%LOAN_PRODUCTS%%/g, `<div style="color:#fff; font-weight:bold;">${escapeHtml(data.loan_p1_name || 'Active Loan Solutions')} - ${escapeHtml(data.loan_p1_desc || '')}</div>`)
    html = html.replace(/%%CALCULATOR_RATES%%/g, escapeHtml(data.calculatorRates || '5.0'))
    html = html.replace(/%%SERVICES%%/g, `<div style="color:#fff;"><h4>${escapeHtml(data.clinic_srv_name || 'Clinical Care')}</h4>${escapeHtml(data.services || '')}</div>`)
    html = html.replace(/%%MAP_EMBED%%/g, data.mapEmbedUrl || '')
    html = html.replace(/%%SHOWROOM%%/g, `<div style="color:#fff;"><h4>${escapeHtml(data.car_name || 'Premium Class Inventory')}</h4>${escapeHtml(data.showroom || '')}</div>`)
    html = html.replace(/%%PEST_SERVICES%%/g, escapeHtml(data.pestServices || ''))
    html = html.replace(/%%ESTIMATOR_RATES%%/g, escapeHtml(data.estimatorRates || '100'))

    return html
  }

  async function handleCompilePreview() {
    const finishedOutput = await generateFinalHtml()
    setSrcDoc(finishedOutput)
  }

  // --- RECORDING TEASER HANDLER PIPELINE ---
  async function handleExportVideoTeaser() {
    if (!selected) return;
    
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" }, 
        audio: false
      });

      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp9' 
      });
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = videoURL;
        link.download = `${(data.siteTitle || selected.id).toLowerCase().replace(/\s+/g, '-')}-pitch-teaser.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(videoURL);
      };

      // --- AUTOMATION TRICK: Target the inner iframe directly for a perfect full-screen layout ---
      const container = document.getElementById('render-viewport');
      const targetIframe = container ? container.querySelector('iframe') : null;
      
      if (targetIframe) {
        try {
          await targetIframe.requestFullscreen();
        } catch (fErr) {
          console.warn("Iframe fullscreen initialization bypassed, falling back:", fErr);
          if (container) await container.requestFullscreen();
        }
      } else if (container) {
        try {
          await container.requestFullscreen();
        } catch (fErr) {
          console.warn("Fullscreen initialization bypassed:", fErr);
        }
      }

      mediaRecorder.start();

      const currentHtml = await generateFinalHtml();
      setSrcDoc(''); 
      setTimeout(() => {
        setSrcDoc(currentHtml); 
      }, 150); 

      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop()); 

        if (document.fullscreenElement) {
          document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
        }
      }, 8000);

    } catch (err) {
      console.error("System Diagnostics Log:", err);
      if (err.name === 'SecurityError') {
        alert("Security Violation: Screen capture is blocked inside this preview frame.");
      } else if (err.name === 'NotAllowedError') {
        alert("Capture cancelled. You must select a tab/window and click 'Share' to export the teaser video.");
      } else {
        alert(`Capture system error (${err.name}): ${err.message}`);
      }
    }
  }

  // --- 1. RENDER GATEWAY AUTH FORM IF DE-AUTHENTICATED ---
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#09090b', fontFamily: 'system-ui, sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: '#14141b', padding: '40px', borderRadius: '16px', border: '1px solid #262633', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: 800 }}>
            X <span style={{ color: '#f59e0b' }}>Sparks</span>
          </h2>
          <p style={{ color: '#a1a1aa', margin: '0 0 24px 0', fontSize: '0.9rem' }}>Authenticate credentials to launch the layout workspace</p>
          
          {loginError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'left' }}>
              ⚠️ {loginError}
            </div>
          )}

          <div style={{ textAlign: 'left', marginBottom: '14px' }}>
            <label style={{ color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Agent Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com" 
              style={{ width: '100%', boxSizing: 'border-box', background: '#0c0c10', border: '1px solid #262633', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
              required
              disabled={isLoggingIn}
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={{ color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Account Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              style={{ width: '100%', boxSizing: 'border-box', background: '#0c0c10', border: '1px solid #262633', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
              required
              disabled={isLoggingIn}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoggingIn}
            style={{ width: '100%', background: isLoggingIn ? '#3f3f46' : '#f59e0b', color: isLoggingIn ? '#a1a1aa' : '#000', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: isLoggingIn ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {isLoggingIn ? 'Verifying Gateway Identity...' : 'Access Engine Workspace'}
          </button>
        </form>
      </div>
    )
  }

  // --- 2. RENDER MAIN APPLICATION DASHBOARD IF AUTHENTICATED ---
  return (
    <div style={{ padding: '40px 20px', maxWidth: 1500, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: 32, borderBottom: '1px solid #262633', paddingBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 6px 0', color: '#fff', fontWeight: 800 }}>
            X-Sparks Site Engine <span style={{ color: '#f59e0b' }}>Core-Xperts</span>
          </h1>
          <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.95rem' }}>Map structural metadata variables onto reactive layout frameworks fluidly.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {currentUser && (
            <div style={{ background: '#14141b', border: '1px solid #262633', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#a1a1aa' }}>
              Agent: <strong style={{ color: '#fff' }}>{currentUser.name}</strong> <span style={{ color: '#f59e0b', marginLeft: '6px', fontSize: '0.75rem', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>{currentUser.role}</span>
            </div>
          )}

          {selected && (
            <button onClick={() => setSelected(null)} style={{ background: '#262633', color: '#f4f4f5', border: '1px solid #3f3f46', padding: '10px 18px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
              ← Back to Blueprints
            </button>
          )}

          <button 
            onClick={handleLogout} 
            style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 18px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.08)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            Log Out
          </button>
        </div>
      </header>

      <main>
        {!selected ? (
          <div className="fade-in" style={{ background: '#14141b', border: '1px solid #262633', borderRadius: 16, padding: 28 }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '1.3rem', color: '#fff' }}>Select Active Design Workspace</h2>
            <TemplateGallery templates={TEMPLATES} selected={selected} onSelect={handleSelect} />
          </div>
        ) : (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '450px 1fr', gap: 32, alignItems: 'start' }}>
            
            <div style={{ background: '#14141b', border: '1px solid #262633', borderRadius: 16, padding: 24, maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '1.15rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {selected.name} Configuration
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(NICHE_FIELDS[selected.niche] || []).map(field => (
                  <div key={field.name} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>
                      {field.label} {field.required && <span style={{ color: '#f59e0b' }}>*</span>}
                    </label>

                    {field.type === 'file' ? (
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        onChange={(e) => handleImageUpload(e, field.name)}
                        style={{ background: '#0c0c10', border: '1px solid #262633', color: '#a1a1aa', padding: '8px 10px', borderRadius: 6, fontSize: '0.85rem' }}
                      />
                    ) : field.type === 'textarea' ? (
                      <textarea 
                        rows={3}
                        placeholder={field.placeholder}
                        value={data[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        style={{ background: '#0c0c10', border: '1px solid #262633', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                      />
                    ) : (
                      <input 
                        type="text"
                        placeholder={field.placeholder}
                        value={data[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        style={{ background: '#0c0c10', border: '1px solid #262633', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#14141b', border: '1px solid #262633', borderRadius: 16, padding: 24, height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>Live Interactive Canvas View</h2>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={handleCompilePreview} style={{ background: '#262633', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' }}>
                    Update Preview
                  </button>
                  <button onClick={handleExportVideoTeaser} style={{ background: '#f59e0b', color: '#000', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/></svg>
                    Export HD Video Teaser
                  </button>
                </div>
              </div>
              <div id="render-viewport" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#14141b' }}>
                <Preview srcDoc={srcDoc} />
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default App