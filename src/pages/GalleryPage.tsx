import { KilaMascot } from '@/components/KilaMascot';
import { StoryArt, artSubject, CulturalArt } from '@/components/StoryArt';
import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, AIBadge, Modal } from '@/components/ui';
import { content, t } from '@/data/content';
import { useTTS } from '@/hooks/useTTS';
import {
  Frame, Search, Volume2, Pause, Play, MapPin, X,
  ChevronLeft, BookOpen,
} from 'lucide-react';

const categories = ['all', 'textile', 'art', 'music', 'dance', 'food', 'craft'];
const categoryLabels: Record<string, { EN: string; ID: string }> = {
  all: { EN: 'All', ID: 'Semua' },
  textile: { EN: 'Textiles', ID: 'Tekstil' },
  art: { EN: 'Art', ID: 'Seni' },
  music: { EN: 'Music', ID: 'Musik' },
  dance: { EN: 'Dance', ID: 'Tari' },
  food: { EN: 'Food', ID: 'Makanan' },
  craft: { EN: 'Crafts', ID: 'Kerajinan' },
};

export function GalleryPage() {
  const { language, learningStyle } = useApp();
  const { speak, stop, speaking } = useTTS();
  const [search, setSearch] = useState('');
  const [zoom,setZoom]=useState(false);
  const [rate,setRate]=useState(1);
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<typeof content.gallery[0] | null>(null);

  const filtered = useMemo(() => {
    return content.gallery.filter((item) => {
      const matchCategory = category === 'all' || item.category === category;
      const name = t(item.name, language).toLowerCase();
      const matchSearch = !search.trim() || `${name} ${t(item.region,language)} ${t(item.desc,language)}`.toLowerCase().includes(search.trim().toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, category, language]);

  const handleListen = (text: string) => {
    if (speaking) {
      stop();
    } else {
      speak(text, language === 'EN' ? 'en-US' : 'id-ID',rate);
    }
  };

  // Detail view
  if (selected) {
    const item = selected;
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-ink-400 hover:text-ink-50 mb-6"
        >
          <ChevronLeft size={20} /> {language === 'EN' ? 'Back to gallery' : 'Kembali ke galeri'}
        </button>

        <div className="text-center mb-8">
          <CulturalArt id={item.id} size={140} className="mx-auto" />
          <h1 className="text-4xl font-display font-black text-ink-50 mb-2">{t(item.name, language)}</h1>
          <div className="flex items-center justify-center gap-2 text-ink-400">
            <MapPin size={16} /> {t(item.region, language)}
          </div>
        </div>

        <Card className="mb-6 text-center"><button onClick={()=>setZoom(true)} aria-label="Enlarge decorative category illustration" className="w-full bg-ink-800 rounded-2xl p-4"><CulturalArt id={item.id} size={180}/><p className="text-xs text-ink-300">Storybook illustration · Tap to enlarge</p></button></Card><Modal open={zoom} onClose={()=>setZoom(false)} title="Illustration detail"><div className="text-center"><CulturalArt id={item.id} size={280}/><p className="text-sm text-ink-300">A stylized illustration, not an exact record of a particular artifact, costume or recipe.</p></div></Modal>
        {/* Description */}
        <Card className="mb-6">
          <h3 className="text-lg font-display font-bold text-ink-50 flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-batik-700" />
            {language === 'EN' ? 'About' : 'Tentang'}
          </h3>
          <p className="text-ink-200 leading-relaxed">{t(item.desc, language)}</p>
        </Card>

        {/* Auditory: podcast-style audio explanation */}
        {learningStyle === 'Auditory' && (
          <Card className="mb-6 border-l-4 border-l-neon-green">
            <h3 className="text-lg font-display font-bold text-ink-50 flex items-center gap-2 mb-3">
              <Volume2 size={18} className="text-neon-green" />
              {language === 'EN' ? 'Read-aloud description' : 'Bacakan deskripsi'}
            </h3>
            <p className="text-sm text-ink-400 mb-4">
              {language === 'EN'
                ? 'Listen to this description with your browser’s speech voice.'
                : 'Dengarkan deskripsi dengan suara text-to-speech browser.'}
            </p>
            <div className="flex gap-3 flex-wrap items-center"><Button onClick={()=>handleListen(t(item.desc,language))}><Volume2 size={18}/>{speaking?'Stop reading':'Read description aloud'}</Button><label className="text-sm">Speed <select value={rate} onChange={e=>{setRate(Number(e.target.value));stop();}} className="border border-ink-600 p-2 rounded-lg">{[0.5,1,1.5,2].map(value=><option key={value} value={value}>{value}×</option>)}</select></label></div>
            <p className="text-xs text-ink-500 mt-2">
              {language === 'EN'
                ? 'Uses browser text-to-speech. Real version would have professional recordings.'
                : 'Menggunakan text-to-speech browser. Versi nyata akan memiliki rekaman profesional.'}
            </p>
          </Card>
        )}

        {/* Visual: tap to zoom hint */}
        {learningStyle === 'Visual' && (
          <Card className="mb-6 border-l-4 border-l-neon-blue">
            <p className="text-ink-300 text-sm">
              {language === 'EN'
                ? '🖼️ Visual mode: Picture-first browsing. Tap any image to zoom in for detail.'
                : '🖼️ Mode Visual: Penjelajahan gambar-di-depan. Ketuk gambar untuk perbesar detail.'}
            </p>
          </Card>
        )}

        {/* Kinesthetic: Try it activity */}
        {learningStyle === 'Kinesthetic' && (
          <Card className="mb-6 border-l-4 border-l-neon-pink">
            <h3 className="text-lg font-display font-bold text-ink-50 mb-2">
              {language === 'EN' ? 'Try It!' : 'Coba!'}
            </h3>
            <p className="text-ink-300 text-sm mb-3">
              {item.category === 'textile'
                ? language === 'EN'
                  ? 'Sketch a batik-inspired pattern on paper. Discuss how your design differs from traditional wax-resist batik.'
                  : 'Gambar pola terinspirasi batik di kertas. Bahas perbedaannya dengan teknik batik menggunakan lilin.'
                : language === 'EN'
                ? 'Draw this on paper and show it to a friend!'
                : 'Gambar ini di kertas dan tunjukkan ke teman!'}
            </p>

          </Card>
        )}

        <a className="text-link underline mb-4" href={item.id==='borobudur'?'https://whc.unesco.org/en/list/592/':item.id==='songket-sumba'?'https://referensi.data.kemdikbud.go.id/budayakita/wbtb/objek/AA000222':'https://ich.unesco.org/en/state/indonesia-ID'} target="_blank" rel="noreferrer">Institutional source · {item.id==='songket-sumba'?'Kemendikbud':'UNESCO'}</a>
        {/* Source */}
        <div className="text-xs text-ink-500 flex items-center gap-2">
          <span>📚</span>
          {language === 'EN'
            ? 'Original project summary; see linked institutional documentation where available. Other entries still need a full source review.'
            : 'Ringkasan proyek awal; sumber institusi ditautkan jika tersedia. Entri lain masih memerlukan kajian sumber.'}
        </div>
      </div>
    );
  }

  // Gallery grid
  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-ink-50 flex items-center gap-2">
          <Frame className="text-neon-pink" /> {language === 'EN' ? 'Art & Culture Gallery' : 'Galeri Seni & Budaya'}
        </h1>
        <p className="text-ink-400 mt-1">
          {language === 'EN'
            ? 'Explore Indonesian art, textiles, music, dance, food, and crafts.'
            : 'Jelajahi seni, tekstil, musik, tari, makanan, dan kerajinan Indonesia.'}
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="search"
            aria-label="Search culture by name, region or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'EN' ? 'Search gallery...' : 'Cari galeri...'}
            className="w-full bg-ink-800 border border-ink-600 rounded-xl pl-10 pr-4 py-2.5 text-ink-50 outline-none focus:border-neon-pink"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-50"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/40'
                  : 'bg-ink-800 text-ink-400 border border-ink-700 hover:text-ink-50'
              }`}
            >
              {t(categoryLabels[cat], language)}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-500">
          <KilaMascot size={80} className="mx-auto" decorative />
          <p>{language === 'EN' ? 'No results found. Try a different search!' : 'Tidak ada hasil. Coba pencarian lain!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((item) => (
            <Card key={item.id} onClick={() => setSelected(item)} className="text-center group">
              <CulturalArt id={item.id} size={80} className="mx-auto" />
              <h3 className="text-sm font-display font-bold text-ink-50">{t(item.name, language)}</h3>
              <p className="text-xs text-ink-500 mt-1">{t(item.region, language)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
