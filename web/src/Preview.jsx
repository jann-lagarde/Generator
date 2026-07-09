import React, {useEffect, useRef} from 'react';

export default function Preview({ srcDoc }) {
  const iframeRef = useRef(null);

  useEffect(()=>{
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc || '<h3 style="padding:24px">Select a template and fill data to preview</h3>';
    }
  },[srcDoc]);

  return (
    <div style={{border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',width:'100%',maxWidth:1126,margin:'20px auto'}}>
      <iframe ref={iframeRef} title="template-preview" style={{width:'100%',height:560,border:0}} />
    </div>
  )
}
