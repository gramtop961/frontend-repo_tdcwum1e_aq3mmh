import { useEffect, useMemo, useState, useRef } from 'react';
import { tokens, i18n } from './components/Theme';
import { BottomNav, Button, Card, Chip, LogoAnimated, PDFCard, ContributorsCarousel } from './components/UI';
import { Search as SearchIcon, ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import { useNavigate, Routes, Route, Link, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Document, Page, pdfjs } from 'react-pdf';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.js`;

function useLang() {
  const [lang, setLang] = useState('en');
  useEffect(() => { const saved = localStorage.getItem('lang'); if (saved) setLang(saved); }, []);
  const t = useMemo(() => i18n[lang], [lang]);
  return { lang, setLang: l => { localStorage.setItem('lang', l); setLang(l); }, t };
}

function Header({ title, right }){
  return (
    <header className="px-4 pt-5 flex items-center justify-between">
      <Link to="/" aria-label="Home"><LogoAnimated /></Link>
      <div className="flex items-center gap-3">
        {right}
        <button onClick={() => document.getElementById('lang').showModal()} className="text-sm text-[#8A8F98]">EN/ने</button>
      </div>
    </header>
  );
}

function UploadDialog(){
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title:'', class_level:'', college:'', subject:'', tags:'', pages:'', drive_link:'', contributor_name:'' });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { ...form, tags: form.tags? form.tags.split(',').map(s=>s.trim()).filter(Boolean) : [] , pages: form.pages? Number(form.pages): undefined };
      const r = await fetch(`${API}/api/uploads`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
      const d = await r.json();
      if (r.ok) {
        alert('Thanks — Notes received! Your Knowledge Points will be reviewed.');
        document.getElementById('upload-modal').close();
        setForm({ title:'', class_level:'', college:'', subject:'', tags:'', pages:'', drive_link:'', contributor_name:'' });
      } else {
        alert(d.detail || 'Failed to submit');
      }
    } catch (e) {
      alert('Network error');
    } finally { setLoading(false); }
  };
  return (
    <dialog id="upload-modal" className="rounded-xl p-0 w-[92%] max-w-md">
      <form onSubmit={onSubmit} className="p-4">
        <div className="text-lg font-semibold" style={{ color: tokens.colors.indigo }}>Contribute Notes</div>
        <p className="text-sm text-[#8A8F98] mt-1">Store PDF in Google Drive and paste a view-only link.</p>
        <div className="mt-3 grid gap-3">
          <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Title" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Class (11/12)" value={form.class_level} onChange={e=>setForm({...form,class_level:e.target.value})} />
            <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="College (LBA/Other)" value={form.college} onChange={e=>setForm({...form, college:e.target.value})} />
          </div>
          <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Subject" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} />
          <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Chapters/Tags (comma)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} />
          <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Estimated pages" type="number" value={form.pages} onChange={e=>setForm({...form, pages:e.target.value})} />
          <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Google Drive link (view-only)" required value={form.drive_link} onChange={e=>setForm({...form, drive_link:e.target.value})} />
          <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Your name (optional)" value={form.contributor_name} onChange={e=>setForm({...form, contributor_name:e.target.value})} />
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button type="button" onClick={()=>document.getElementById('upload-modal').close()} className="px-4 py-2">Cancel</button>
          <Button type="submit" disabled={loading}>{loading? 'Submitting...' : 'Submit'}</Button>
        </div>
      </form>
    </dialog>
  );
}

function Home({ t }) {
  const [notes, setNotes] = useState([]);
  const [contributors, setContributors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/notes?limit=12`).then(r => r.json()).then(d => setNotes(d.items || []));
    fetch(`${API}/api/leaderboard`).then(r => r.json()).then(d => setContributors(d.items || []));
  }, []);

  return (
    <div className="pb-28" style={{ background: tokens.colors.cream }}>
      <Helmet>
        <title>NoteBuddy — Share & Discover</title>
        <meta name="description" content="Curated notes for Class 11 & 12. Friendly. Minimal. Fast." />
        <meta property="og:title" content="NoteBuddy — Share & Discover" />
        <meta property="og:description" content="Curated notes for Class 11 & 12." />
      </Helmet>
      <Header right={<button onClick={()=>navigate('/search')} className="text-sm text-[#8A8F98] flex items-center gap-1"><SearchIcon size={16} /> Search</button>} />

      <section className="px-4 mt-4">
        <div className="rounded-2xl p-5" style={{background: 'linear-gradient(180deg,#ffffff, #f3f6f9)'}}>
          <div className="text-[28px] leading-8 font-semibold" style={{ color: tokens.colors.indigo }}>{t.tagline}</div>
          <p className="mt-2 text-[#8A8F98]">Curated notes for Class 11 & 12. Friendly. Minimal. Fast.</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={()=>navigate('/search')}>{t.requestNotes}</Button>
            <Button kind="outline" onClick={()=>document.getElementById('upload-modal').showModal()}>{t.contributeNotes}</Button>
          </div>
        </div>
      </section>

      <section className="px-4 mt-5">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['LBA','Other','11','12'].map((x,i) => <Chip key={i} label={x} active={i===0} />)}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {['Science','Management','Law','Languages'].map((x,i) => <Chip key={i} label={x} />)}
        </div>
      </section>

      <section className="px-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: tokens.colors.indigo }}>{t.featuredContributors}</h3>
        </div>
        <div className="mt-2">
          <ContributorsCarousel items={contributors} />
        </div>
      </section>

      <section className="px-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: tokens.colors.indigo }}>{t.latestUploads}</h3>
          <button onClick={()=>navigate('/search')} className="text-sm text-[#8A8F98] flex items-center gap-1"><SearchIcon size={16} /> Search</button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {notes.map(n => <Link to={`/note/${n.id}`} key={n.id}><PDFCard item={n} /></Link>)}
        </div>
      </section>

      <footer className="px-4 py-10 mt-8 text-center text-sm text-[#8A8F98]">
        <div>Contact: info@mukeshnath.com.np · +977 980-9424862 · Mahendranagar, Nepal</div>
        <div className="mt-2">Developed With 💖 By <a href="https://mukeshnath.com.np/" className="underline">Mukesh Nath</a></div>
        <div className="mt-2"><Link to="/about" className="underline">About & FAQ</Link></div>
      </footer>

      <BottomNav onSelect={(id)=>{ if(id==='upload'){document.getElementById('upload-modal').showModal()} if(id==='contrib'){navigate('/contributions')} if(id==='subjects'){navigate('/search')} if(id==='home'){navigate('/')} if(id==='more'){navigate('/about')} }} />

      <dialog id="lang" className="rounded-xl p-0 w-[90%] max-w-sm">
        <div className="p-4">
          <div className="font-semibold" style={{ color: tokens.colors.indigo }}>Language</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="px-4 py-2 rounded-lg bg-[#EEF4F8]" onClick={()=>{localStorage.setItem('lang','en');location.reload()}}>English</button>
            <button className="px-4 py-2 rounded-lg bg-[#EEF4F8]" onClick={()=>{localStorage.setItem('lang','ne');location.reload()}}>नेपाली</button>
          </div>
        </div>
      </dialog>

      <UploadDialog />
    </div>
  );
}

function SearchPage(){
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const search = async (reset=false) => {
    const nextSkip = reset? 0 : skip;
    const r = await fetch(`${API}/api/notes?q=${encodeURIComponent(query)}&skip=${nextSkip}&limit=12`);
    const d = await r.json();
    const list = d.items || [];
    setItems(prev => reset? list : [...prev, ...list]);
    setSkip(nextSkip + list.length);
    setHasMore(list.length > 0);
  };

  useEffect(()=>{ search(true); }, []);

  return (
    <div className="pb-24" style={{ background: tokens.colors.cream }}>
      <Helmet>
        <title>Search — NoteBuddy</title>
        <meta name="description" content="Search notes, subjects, chapters for Class 11 & 12." />
      </Helmet>
      <Header right={null} />
      <div className="px-4 mt-4">
        <div className="flex gap-2">
          <input aria-label="Search" className="flex-1 h-11 px-4 rounded-lg bg-white" style={{boxShadow: tokens.shadow.card}} placeholder="Search notes, subjects, chapters…" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){setSkip(0); search(true);}}} />
          <Button onClick={()=>{setSkip(0); search(true);}}><SearchIcon size={18} /></Button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {items.map(it => <Link to={`/note/${it.id}`} key={it.id}><PDFCard item={it} /></Link>)}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-4">
            <Button onClick={()=>search(false)}>Load more</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteDetail(){
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async ()=>{
      const r = await fetch(`${API}/api/notes/${id}`);
      if (r.ok){ const d = await r.json(); setNote(d); }
    })();
  }, [id]);

  const onLoadSuccess = ({ numPages }) => { setNumPages(numPages); };

  return (
    <div className="min-h-screen pb-24" style={{ background: tokens.colors.cream }}>
      <Helmet>
        <title>{note? note.title : 'Note'} — NoteBuddy</title>
        <meta name="description" content={note? `${note.subject} · ${note.class_level} · ${note.college}` : 'Note detail'} />
      </Helmet>
      <div className="px-4 pt-4 flex items-center gap-2">
        <Link to="/" aria-label="Back" className="p-2 rounded-lg bg-white" style={{boxShadow: tokens.shadow.card}}><ArrowLeft /></Link>
        <div className="font-semibold" style={{ color: tokens.colors.indigo }}>{note? note.title : 'Loading…'}</div>
      </div>
      {note && (
        <div className="px-4 mt-3">
          <div className="flex items-center gap-2 text-xs text-[#8A8F98]">
            <span className="px-2 py-0.5 bg-[#EEF4F8] rounded-full">{note.subject}</span>
            <span>{note.class_level}</span>
            <span>•</span>
            <span>{note.college}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={()=>setScale(s=>Math.min(2, s+0.1))} className="p-2 rounded bg-white" style={{boxShadow: tokens.shadow.card}} aria-label="Zoom in"><ZoomIn size={18} /></button>
            <button onClick={()=>setScale(s=>Math.max(0.6, s-0.1))} className="p-2 rounded bg-white" style={{boxShadow: tokens.shadow.card}} aria-label="Zoom out"><ZoomOut size={18} /></button>
            <button onClick={()=>{setScale(1); setPage(1);}} className="p-2 rounded bg-white" style={{boxShadow: tokens.shadow.card}} aria-label="Reset"><RotateCcw size={18} /></button>
            <a href={note.drive_link} target="_blank" rel="noreferrer" className="p-2 rounded bg-white" style={{boxShadow: tokens.shadow.card}} aria-label="Open in Drive"><Download size={18} /></a>
          </div>
          <div className="mt-3 grid place-items-center">
            <div className="bg-white rounded-lg p-2" style={{ boxShadow: tokens.shadow.card }}>
              <Document file={note.drive_link} onLoadSuccess={onLoadSuccess} onLoadError={(e)=>setError(String(e))} loading={<div className="w-[90vw] h-40 bg-[#EEF4F8] animate-pulse rounded" /> }>
                <Page pageNumber={page} scale={scale} width={Math.min(860, typeof window !== 'undefined' ? window.innerWidth - 32 : 360)} />
              </Document>
              {error && (
                <div className="p-3 text-sm text-[#8A8F98]">PDF preview failed (cross-origin). <a href={note.drive_link} target="_blank" className="underline">Open in Google Drive</a>.</div>
              )}
            </div>
            {numPages && (
              <div className="flex items-center gap-2 mt-3">
                <Button kind="outline" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</Button>
                <div className="text-sm text-[#8A8F98]">{page} / {numPages}</div>
                <Button kind="outline" onClick={()=>setPage(p=>Math.min(numPages,p+1))}>Next</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Contributions(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ fetch(`${API}/api/leaderboard`).then(r=>r.json()).then(d=>setItems(d.items||[])) }, []);
  return (
    <div className="min-h-screen pb-24" style={{ background: tokens.colors.cream }}>
      <Helmet><title>Contributions — NoteBuddy</title></Helmet>
      <Header />
      <div className="px-4 mt-4">
        <h2 className="text-xl font-semibold" style={{ color: tokens.colors.indigo }}>Top Contributors</h2>
        <div className="mt-3">
          <ContributorsCarousel items={items} />
        </div>
        <div className="mt-4 grid gap-3">
          {items.map((c,i)=> (
            <Card key={c.id || i}>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EEF4F8]" />
                  <div>
                    <div className="font-semibold" style={{ color: tokens.colors.indigo }}>{c.name}</div>
                    <div className="text-xs text-[#8A8F98]">{c.points} points</div>
                  </div>
                </div>
                <div className="text-sm text-[#8A8F98]">#{i+1}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function About(){
  return (
    <div className="min-h-screen pb-24" style={{ background: tokens.colors.cream }}>
      <Helmet>
        <title>About & FAQ — NoteBuddy</title>
        <meta name="description" content="About NoteBuddy, team, contact and frequently asked questions." />
      </Helmet>
      <Header />
      <div className="px-4 mt-4 grid gap-4">
        <Card>
          <div className="p-4">
            <div className="text-lg font-semibold" style={{ color: tokens.colors.indigo }}>About NoteBuddy</div>
            <p className="text-[#8A8F98] mt-2">Premium, friendly notes for Nepalese +2 students (Class 11–12). No public signups in MVP; all uploads go to admin review. PDFs are hosted on Google Drive.</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-lg font-semibold" style={{ color: tokens.colors.indigo }}>FAQ</div>
            <ul className="mt-2 text-[#23486B] list-disc pl-5">
              <li>How do I contribute? — Tap the Upload button and paste a view-only Drive link.</li>
              <li>How are points awarded? — Admin assigns Knowledge Points on acceptance.</li>
              <li>Can I download PDFs? — Yes, open the note and use the download button.</li>
            </ul>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-lg font-semibold" style={{ color: tokens.colors.indigo }}>Contact</div>
            <div className="text-[#8A8F98] mt-2">info@mukeshnath.com.np · +977 980-9424862 · Mahendranagar, Nepal</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Admin() {
  const [token, setToken] = useState('');
  const [creds, setCreds] = useState({ username: '', password: ''});
  const [uploads, setUploads] = useState([]);

  const authedFetch = (url, options={}) => fetch(url, { ...options, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }});

  const doLogin = async (e) => {
    e.preventDefault();
    const r = await fetch(`${API}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creds)});
    const d = await r.json();
    if (d.token) {
      setToken(d.token);
      const lr = await authedFetch(`${API}/api/admin/uploads?status=pending`);
      const ld = await lr.json();
      setUploads(ld.items || []);
    } else {
      alert('Login failed');
    }
  }

  const accept = async (id) => {
    const points = Number(prompt('Assign Knowledge Points')); if(!points && points!==0) return;
    await authedFetch(`${API}/api/admin/uploads/${id}/accept`, { method: 'POST', body: JSON.stringify({ assigned_points: points })});
    setUploads(u => u.filter(x => x.id !== id));
  }
  const reject = async (id) => {
    const reason = prompt('Reason for rejection?') || '';
    await authedFetch(`${API}/api/admin/uploads/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason })});
    setUploads(u => u.filter(x => x.id !== id));
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: tokens.colors.cream }}>
        <div className="w-[92%] max-w-sm bg-white p-5 rounded-xl" style={{ boxShadow: tokens.shadow.card }}>
          <div className="flex items-center justify-center"><LogoAnimated /></div>
          <div className="mt-3 text-center text-sm text-[#8A8F98]">Admin login</div>
          <form className="mt-4 grid gap-3" onSubmit={doLogin}>
            <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Username" value={creds.username} onChange={e=>setCreds({...creds, username:e.target.value})} />
            <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Password" type="password" value={creds.password} onChange={e=>setCreds({...creds, password:e.target.value})} />
            <Button type="submit" className="w-full">Login</Button>
            <div className="text-xs text-[#8A8F98]">Use buddy / buddy_mukesh123@</div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: tokens.colors.cream }}>
      <header className="px-4 pt-4 flex items-center justify-between">
        <Link to="/" aria-label="Home"><LogoAnimated /></Link>
        <div className="text-sm text-[#8A8F98]">Admin Panel</div>
      </header>
      <div className="px-4 mt-4 grid gap-3">
        {uploads.map(u => (
          <Card key={u.id}>
            <div className="p-4">
              <div className="font-semibold" style={{ color: tokens.colors.indigo }}>{u.title}</div>
              <div className="text-sm text-[#8A8F98]">{u.subject} · {u.class_level} · {u.college}</div>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => accept(u.id)}>Accept</Button>
                <Button kind="outline" onClick={() => reject(u.id)}>Reject</Button>
              </div>
            </div>
          </Card>
        ))}
        {uploads.length===0 && <div className="text-center text-[#8A8F98] mt-10">No pending uploads.</div>}
      </div>
    </div>
  );
}

export default function AppRouter(){
  const { t } = useLang();
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Home t={t} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/note/:id" element={<NoteDetail />} />
        <Route path="/contributions" element={<Contributions />} />
        <Route path="/about" element={<About />} />
        <Route path="/mukesh" element={<Admin />} />
      </Routes>
    </HelmetProvider>
  );
}
