import { useEffect, useMemo, useState } from 'react';
import { tokens, i18n } from './components/Theme';
import { BottomNav, Button, Card, Chip, LogoAnimated, PDFCard, ContributorsCarousel } from './components/UI';
import { Search } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function useLang() {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved) setLang(saved);
  }, []);
  const t = useMemo(() => i18n[lang], [lang]);
  return { lang, setLang: l => { localStorage.setItem('lang', l); setLang(l); }, t };
}

function Home({ t }) {
  const [notes, setNotes] = useState([]);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/notes?limit=12`).then(r => r.json()).then(d => setNotes(d.items || []));
    fetch(`${API}/api/leaderboard`).then(r => r.json()).then(d => setContributors(d.items || []));
  }, []);

  return (
    <div className="pb-28" style={{ background: tokens.colors.cream }}>
      <header className="px-4 pt-5 flex items-center justify-between">
        <LogoAnimated />
        <div className="flex items-center gap-2">
          <button onClick={() => document.getElementById('lang').showModal()} className="text-sm text-[#8A8F98]">EN/ने</button>
        </div>
      </header>

      <section className="px-4 mt-4">
        <div className="rounded-2xl p-5" style={{background: 'linear-gradient(180deg,#ffffff, #f3f6f9)'}}>
          <div className="text-[28px] leading-8 font-semibold" style={{ color: tokens.colors.indigo }}>{t.tagline}</div>
          <p className="mt-2 text-[#8A8F98]">Curated notes for Class 11 & 12. Friendly. Minimal. Fast.</p>
          <div className="mt-4 flex gap-2">
            <Button>{t.requestNotes}</Button>
            <Button kind="outline">{t.contributeNotes}</Button>
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
          <button className="text-sm text-[#8A8F98] flex items-center gap-1"><Search size={16} /> Search</button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {notes.map(n => <PDFCard key={n.id} item={n} />)}
        </div>
      </section>

      <footer className="px-4 py-10 mt-8 text-center text-sm text-[#8A8F98]">
        <div>Contact: info@mukeshnath.com.np · +977 980-9424862 · Mahendranagar, Nepal</div>
        <div className="mt-2">Developed With 💖 By <a href="https://mukeshnath.com.np/" className="underline">Mukesh Nath</a></div>
      </footer>

      <BottomNav onSelect={(id)=>{ if(id==='upload'){document.getElementById('upload-modal').showModal()} }} />

      <dialog id="lang" className="rounded-xl p-0 w-[90%] max-w-sm">
        <div className="p-4">
          <div className="font-semibold" style={{ color: tokens.colors.indigo }}>Language</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="px-4 py-2 rounded-lg bg-[#EEF4F8]" onClick={()=>{localStorage.setItem('lang','en');location.reload()}}>English</button>
            <button className="px-4 py-2 rounded-lg bg-[#EEF4F8]" onClick={()=>{localStorage.setItem('lang','ne');location.reload()}}>नेपाली</button>
          </div>
        </div>
      </dialog>

      <dialog id="upload-modal" className="rounded-xl p-0 w-[92%] max-w-md">
        <form method="dialog">
          <div className="p-4">
            <div className="text-lg font-semibold" style={{ color: tokens.colors.indigo }}>{t.contributeNotes}</div>
            <p className="text-sm text-[#8A8F98] mt-1">Store PDF in Google Drive and paste view-only link.</p>
            <div className="mt-3 grid gap-3">
              <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Title" required />
              <div className="grid grid-cols-2 gap-2">
                <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Class (11/12)" />
                <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="College (LBA/Other)" />
              </div>
              <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Subject" />
              <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Chapters/Tags (comma)" />
              <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Estimated pages" type="number" />
              <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Google Drive link (view-only)" required />
              <input className="h-11 px-3 rounded-lg bg-[#F3F5F7]" placeholder="Your name (optional)" />
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button className="px-4 py-2">Cancel</button>
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </dialog>
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
    const points = Number(prompt('Assign Knowledge Points')); if(!points) return;
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
        <LogoAnimated />
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
  const hash = typeof window !== 'undefined' ? window.location.hash : '#/';
  const path = hash.replace('#','') || '/';
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const onHash = () => window.location.reload();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (path.startsWith('/mukesh')) return <Admin />;

  return <Home t={t} />
}
