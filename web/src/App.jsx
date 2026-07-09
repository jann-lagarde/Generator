import React, {useState} from 'react'
import './App.css'
import TemplateGallery from './TemplateGallery'
import Questionnaire from './Questionnaire'
import Preview from './Preview'

const TEMPLATES = [
  { id: 'lending', name: 'Lending Pro', description: 'Micro-lending focused, includes loan calculator (required)', thumbnail: '/templates/lending/thumbnail.svg', path: '/templates/lending/index.html', niche: 'Lending' },
  { id: 'travel', name: 'Travel Luxe', description: 'Travel agency template with itineraries (required)', thumbnail: '/templates/travel/thumbnail.svg', path: '/templates/travel/index.html', niche: 'Travel' },
  { id: 'cosmetics', name: 'Cosmetics Lab', description: 'Product-first design for manufacturers', thumbnail: '/templates/cosmetics/thumbnail.svg', path: '/templates/cosmetics/index.html', niche: 'Cosmetics' }
]

const NICHE_FIELDS = {
  Lending: [
    { name: 'siteTitle', label: 'Site title', required: true },
    { name: 'tagline', label: 'Tagline', required: false },
    { name: 'description', label: 'Company description', type: 'textarea', required: true }
  ],
  Travel: [
    { name: 'siteTitle', label: 'Site title', required: true },
    { name: 'tagline', label: 'Tagline', required: false },
    { name: 'itineraries', label: 'Itineraries (HTML)', type: 'textarea', placeholder: '<ul><li>Day 1: ...</li></ul>', required: true },
    { name: 'contact', label: 'Contact details', required: false }
  ],
  Cosmetics: [
    { name: 'siteTitle', label: 'Site title', required: true },
    { name: 'tagline', label: 'Tagline', required: false },
    { name: 'products', label: 'Products (HTML)', type: 'textarea', placeholder: '<div class="card">Product A</div>', required: true }
  ]
}

function App(){
  const [selected, setSelected] = useState(null)
  const [data, setData] = useState({})
  const [srcDoc, setSrcDoc] = useState('')

  function handleSelect(t){
    setSelected(t)
    // reset data with default empty fields for niche
    const fields = NICHE_FIELDS[t.niche] || []
    const initial = {}
    fields.forEach(f=> initial[f.name] = data[f.name] || '')
    setData(initial)
    setSrcDoc('')
  }

  function handleChange(name, value){
    setData(prev=> ({...prev, [name]: value}))
  }

  async function handlePreview(){
    if (!selected) return
    // fetch template HTML
    const res = await fetch(selected.path)
    let html = await res.text()
    // replace placeholders
    html = html.replace(/%%SITE_TITLE%%/g, escapeHtml(data.siteTitle || ''))
    html = html.replace(/%%TAGLINE%%/g, escapeHtml(data.tagline || ''))
    html = html.replace(/%%DESCRIPTION%%/g, escapeHtml(data.description || ''))
    html = html.replace(/%%ITINERARIES%%/g, data.itineraries || '<p>No itineraries provided</p>')
    html = html.replace(/%%CONTACT%%/g, escapeHtml(data.contact || ''))
    html = html.replace(/%%PRODUCTS%%/g, data.products || '<div>No products yet</div>')

    setSrcDoc(html)
  }

  function escapeHtml(str){
    if (!str) return ''
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
  }

  async function handleDownload(){
    if (!selected) return
    // build final HTML like preview
    const res = await fetch(selected.path)
    let html = await res.text()
    html = html.replace(/%%SITE_TITLE%%/g, escapeHtml(data.siteTitle || ''))
    html = html.replace(/%%TAGLINE%%/g, escapeHtml(data.tagline || ''))
    html = html.replace(/%%DESCRIPTION%%/g, escapeHtml(data.description || ''))
    html = html.replace(/%%ITINERARIES%%/g, data.itineraries || '')
    html = html.replace(/%%CONTACT%%/g, escapeHtml(data.contact || ''))
    html = html.replace(/%%PRODUCTS%%/g, data.products || '')

    // create ZIP client-side
    const JSZip = (await import('jszip')).default
    const { saveAs } = await import('file-saver')
    const zip = new JSZip()
    zip.file('index.html', html)
    // include a small README
    zip.file('README.txt', `Generated from template ${selected.name}\nGenerated on ${new Date().toISOString()}`)
    const content = await zip.generateAsync({type:'blob'})
    saveAs(content, `${(data.siteTitle||selected.id).replace(/\s+/g,'-')}.zip`)
  }

  return (
    <div style={{padding:20}}>
      <header style={{maxWidth:1126,margin:'0 auto 16px'}}>
        <h1>Site Generator — Cloudflare Pages-ready (MVP)</h1>
        <p style={{color:'var(--text)'}}>Select a niche & template, fill the required data, preview and download a ready-to-serve static package.</p>
      </header>

      <main style={{maxWidth:1126,margin:'0 auto'}}>
        <section>
          <h2>Templates</h2>
          <TemplateGallery templates={TEMPLATES} selected={selected} onSelect={handleSelect} />
        </section>

        <section>
          <Questionnaire niche={selected?.niche} fields={selected? (NICHE_FIELDS[selected.niche]||[]) : []} data={data} onChange={handleChange} />
        </section>

        <section style={{display:'flex',gap:16,alignItems:'flex-start',flexDirection:'column'}}>
          <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:8}}>
            <button onClick={handlePreview} style={{padding:'10px 16px',borderRadius:8,border:'none',background:'var(--accent)',color:'#fff',cursor:'pointer'}}>Preview</button>
            <button onClick={handleDownload} style={{padding:'10px 16px',borderRadius:8,border:'1px solid var(--border)',background:'transparent',cursor:'pointer'}}>Download ZIP</button>
          </div>

          <Preview srcDoc={srcDoc} />
        </section>
      </main>
    </div>
  )
}

export default App
