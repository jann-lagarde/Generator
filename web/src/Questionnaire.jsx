import React from 'react';

export default function Questionnaire({ niche, fields, data, onChange }) {
  if (!niche) return null;

  return (
    <div style={{maxWidth:820,margin:'20px auto',textAlign:'left'}}>
      <h2>{niche} — Site data</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {fields.map(f => (
          <label key={f.name} style={{display:'block'}}>
            <div style={{fontSize:13,color:'var(--text)'}}>{f.label}{f.required? ' *':''}</div>
            {f.type==='textarea' ? (
              <textarea value={data[f.name]||''} onChange={(e)=>onChange(f.name,e.target.value)} style={{width:'100%',padding:8,minHeight:80,borderRadius:8,border:'1px solid var(--border)'}}/>
            ) : (
              <input value={data[f.name]||''} onChange={(e)=>onChange(f.name,e.target.value)} placeholder={f.placeholder||''} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid var(--border)'}}/>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}
