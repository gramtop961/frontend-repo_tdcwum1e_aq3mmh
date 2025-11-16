import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from './Theme';
import { Home, UploadCloud, BookOpen, Trophy, MoreHorizontal, Search, Download, Heart, Bookmark, Share2, Crown } from 'lucide-react';

export const LogoAnimated = ({ size = 48 }) => {
  const radius = size/2 - 3;
  return (
    <div className="flex items-center gap-2 select-none" aria-label="NoteBuddy Logo">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <motion.circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={tokens.colors.primary} strokeWidth="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: 'easeInOut' }} />
        <motion.circle cx={size/2} cy={size/2} r={4} fill={tokens.colors.accentOrange}
          initial={{ y: -2 }} animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, delay: 0.85 }} />
      </svg>
      <div className="font-semibold" style={{ color: tokens.colors.indigo }}>NoteBuddy</div>
    </div>
  );
};

export const Button = ({ kind='primary', children, className='', ...props }) => {
  const base = 'inline-flex items-center justify-center h-11 px-5 rounded-full transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const kinds = {
    primary: `bg-[${tokens.colors.primary}] text-white shadow-sm hover:brightness-95`,
    outline: `bg-white border border-[${tokens.colors.primary}] text-[${tokens.colors.primary}]`,
    accent: `bg-[${tokens.colors.accentOrange}] text-white`,
    disabled: 'bg-[#F0F2F4] text-[#8A8F98] cursor-not-allowed'
  };
  const style = kinds[kind] || kinds.primary;
  return <button className={`${base} ${style} ${className}`} {...props}>{children}</button>
}

export const Card = ({ children, className='' }) => (
  <div className={`bg-white rounded-xl`} style={{ boxShadow: tokens.shadow.card }}>{children}</div>
);

export const Chip = ({ label, active }) => (
  <button className={`px-4 h-9 rounded-full text-sm ${active ? 'text-white' : ''}`} style={{ background: active ? tokens.colors.primary : '#EEF4F8', color: active ? 'white' : tokens.colors.indigo }}>{label}</button>
);

export const BottomNav = ({ onSelect, active='home' }) => {
  const Item = ({ id, icon:Icon, label }) => (
    <button onClick={() => onSelect(id)} className={`flex flex-col items-center justify-center text-xs`} aria-label={label}>
      <Icon size={22} />
      <span className="mt-1">{label}</span>
    </button>
  );
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] md:hidden" style={{ zIndex: 50 }}>
      <div className="mx-auto flex items-center justify-between px-4 py-2 bg-white rounded-3xl" style={{ boxShadow: tokens.shadow.card }}>
        <Item id="home" icon={Home} label="Home" />
        <Item id="subjects" icon={BookOpen} label="Subjects" />
        <motion.button onClick={() => onSelect('upload')} className="-mt-8 rounded-full p-4 text-white" aria-label="Upload"
          style={{ background: `linear-gradient(135deg, ${tokens.colors.accentGreen}, ${tokens.colors.primary})`, boxShadow: tokens.shadow.card }}
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.2, repeat: Infinity }}>
          <UploadCloud size={26} />
        </motion.button>
        <Item id="contrib" icon={Trophy} label="Points" />
        <Item id="more" icon={MoreHorizontal} label="More" />
      </div>
    </div>
  );
};

export const PDFCard = ({ item }) => (
  <Card className="overflow-hidden">
    <div className="aspect-[4/3] bg-[#EEF4F8]" />
    <div className="p-3">
      <div className="flex items-center gap-2 text-xs text-[#8A8F98]">
        <span className="px-2 py-0.5 bg-[#EEF4F8] rounded-full">{item.subject}</span>
        <span>{item.class_level}</span>
        <span>•</span>
        <span>{item.college}</span>
      </div>
      <div className="mt-1 text-[15px] font-semibold" style={{ color: tokens.colors.indigo }}>{item.title}</div>
      <div className="mt-2 flex items-center justify-between text-[#8A8F98]">
        <div className="flex items-center gap-3">
          <button aria-label="Like"><Heart size={18} /></button>
          <button aria-label="Save"><Bookmark size={18} /></button>
          <button aria-label="Share"><Share2 size={18} /></button>
        </div>
        <button aria-label="Download"><Download size={18} /></button>
      </div>
    </div>
  </Card>
);

export const ContributorsCarousel = ({ items=[] }) => (
  <div className="flex gap-3 overflow-x-auto py-1">
    {items.map((c,i) => (
      <div key={c.id || i} className="min-w-[180px] p-3 bg-white rounded-xl flex items-center gap-3" style={{ boxShadow: tokens.shadow.card }}>
        <div className="w-10 h-10 rounded-full bg-[#EEF4F8]" />
        <div>
          <div className="flex items-center gap-1 font-semibold" style={{ color: tokens.colors.indigo }}>
            {i===0 && <Crown size={16} color="#F6A33D" />} {c.name || 'Contributor'}
          </div>
          <div className="text-xs text-[#8A8F98]">{c.points || 0} pts</div>
        </div>
      </div>
    ))}
  </div>
);
