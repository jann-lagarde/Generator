import React, {useEffect, useRef} from 'react';
import { gsap } from 'gsap';

export default function TemplateGallery({ templates, selected, onSelect }) {
  const containerRef = useRef(null)

  useEffect(()=>{
    // subtle entrance animation for thumbnails
    const el = containerRef.current
    if (!el) return
    gsap.fromTo(el.children, {y:18, opacity:0}, {y:0, opacity:1, duration:0.6, stagger:0.06, ease:'power3.out'})
  },[])

  useEffect(()=>{
    // highlight selected with a scale pulse
    if (!selected) return
    const btn = containerRef.current.querySelector(`button[data-id="${selected.id}"]`)
    if (!btn) return
    gsap.fromTo(btn, {scale:0.98}, {scale:1.02, duration:0.28, yoyo:true, repeat:1, ease:'power1.inOut'})
  },[selected])

  return (
    <div ref={containerRef} className="template-gallery" style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
      {templates.map(t => (
        <button data-id={t.id} key={t.id} onClick={()=>onSelect(t)} style={{width:220,border:selected?.id===t.id? '2px solid var(--accent)': '1px solid var(--border)',borderRadius:12,overflow:'hidden',background:'var(--bg)',boxShadow:'var(--shadow)',cursor:'pointer'}}>
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
