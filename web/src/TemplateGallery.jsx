import React from 'react';

export default function TemplateGallery({ templates, selected, onSelect }) {
  return (
    <div className="template-gallery" style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
      {templates.map(t => (
        <button key={t.id} onClick={()=>onSelect(t)} style={{width:220,border:selected?.id===t.id? '2px solid var(--accent)': '1px solid var(--border)',borderRadius:12,overflow:'hidden',background:'var(--bg)',boxShadow:'var(--shadow)',cursor:'pointer'}}>
          <img src={t.thumbnail} alt={`${t.name} thumbnail`} style={{width:'100%',height:120,objectFit:'cover',display:'block'}}/>
          <div style={{padding:12,textAlign:'left'}}>
            <h3 style={{margin:0,fontSize:16,color:'var(--text-h)'}}>{t.name}</h3>
            <p style={{margin:'6px 0 0',fontSize:13,color:'var(--text)'}}>{t.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
