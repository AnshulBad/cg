document.getElementById('uploadBtn').addEventListener('click', async ()=>{
  const f = document.getElementById('fileInput').files[0];
  if(!f) return alert('Select a file');
  const fd = new FormData(); fd.append('file', f);
  const out = document.getElementById('out'); out.innerText='Uploading...';
  try{
    const resp = await fetch('/api/upload-content',{method:'POST',body:fd});
    const json = await resp.json(); out.innerText = `Generated ${json.generated} scenarios`;
  }catch(e){ out.innerText = 'Upload failed'; }
});
