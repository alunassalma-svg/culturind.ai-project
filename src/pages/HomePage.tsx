import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Button, Card } from '@/components/ui';
import { KilaMascot } from '@/components/KilaMascot';
import { StoryArt } from '@/components/StoryArt';
import { content, t } from '@/data/content';
import type { Language, Page } from '@/types';
import { ArrowRight, Compass, BookOpen, MessageCircle, Lightbulb, Leaf, Sparkles } from 'lucide-react';
// "Why CulturInd.ai?" section content in both languages
const whyContent = {
  title: { EN: 'Why CulturInd.ai?', ID: 'Mengapa CulturInd.ai?' },
  intro: {
    EN: 'International culture is now easy to find in our daily lives, especially through social media, the internet, music, movies, and fashion. This makes children and teenagers more familiar with cultures from other countries. As a result, some teenagers become more interested in international cultures than their own Indonesian culture. They may follow foreign trends more often and know less about Indonesian traditions and arts. In my opinion, international culture is not always a bad thing. However, if teenagers do not balance it with learning about Indonesian culture, their interest and appreciation for national culture may slowly decrease.',
    ID: 'Budaya internasional kini mudah ditemukan dalam kehidupan sehari-hari kita, terutama melalui media sosial, internet, musik, film, dan fashion. Hal ini membuat anak-anak dan remaja menjadi lebih akrab dengan budaya dari negara lain. Akibatnya, sebagian remaja menjadi lebih tertarik pada budaya internasional daripada budaya Indonesia mereka sendiri. Mereka mungkin lebih sering mengikuti tren asing dan kurang mengetahui tradisi serta seni Indonesia. Menurut saya, budaya internasional tidak selalu buruk. Namun, jika remaja tidak menyeimbangkannya dengan mempelajari budaya Indonesia, minat dan apresiasi mereka terhadap budaya nasional dapat perlahan menurun.',
  },
  addition: {
    EN: 'In addition, traditional methods of learning culture can sometimes feel less interactive and less relevant to their digital lifestyles. Therefore, Indonesian teenagers should be encouraged to learn and appreciate their own cultural heritage alongside international cultures.',
    ID: 'Selain itu, cara tradisional dalam mempelajari budaya terkadang terasa kurang interaktif dan kurang relevan dengan gaya hidup digital mereka. Oleh karena itu, remaja Indonesia perlu didorong untuk mempelajari dan menghargai warisan budaya mereka sendiri berdampingan dengan budaya internasional.',
  },
  reasonsIntro: {
    EN: 'There are several reasons why international cultures have a negative effect on Indonesian kids\' and teenagers\' interest in national cultures:',
    ID: 'Ada beberapa alasan mengapa budaya internasional berdampak negatif terhadap minat anak-anak dan remaja Indonesia pada budaya nasional:',
  },
  reasons: [
    {
      EN: 'First, foreign culture can make teenagers less interested in Indonesian culture. They often watch foreign movies, listen to foreign music, and follow foreign fashion. Because of this, they may spend less time learning about Indonesian traditions.',
      ID: 'Pertama, budaya asing dapat membuat remaja kurang tertarik pada budaya Indonesia. Mereka sering menonton film asing, mendengarkan musik asing, dan mengikuti fashion asing. Karena itu, mereka mungkin menghabiskan lebih sedikit waktu untuk mempelajari tradisi Indonesia.',
    },
    {
      EN: 'Second, social media makes foreign culture very easy to follow. Teenagers can see many foreign trends every day and sometimes want to copy them. This can make them forget about their own culture.',
      ID: 'Kedua, media sosial membuat budaya asing sangat mudah diikuti. Remaja dapat melihat banyak tren asing setiap hari dan terkadang ingin menirunya. Hal ini dapat membuat mereka melupakan budaya mereka sendiri.',
    },
    {
      EN: 'Third, teenagers need to know and appreciate Indonesian culture. Indonesia has many traditional dances, songs, clothes, and foods. Learning about them can help teenagers stay proud of their own culture.',
      ID: 'Ketiga, remaja perlu mengenal dan menghargai budaya Indonesia. Indonesia memiliki banyak tarian, lagu, pakaian, dan makanan tradisional. Mempelajarinya dapat membantu remaja tetap bangga dengan budaya mereka sendiri.',
    },
    {
      EN: 'Fourth, foreign culture can also affect how teenagers speak and act. Sometimes, today\'s teenagers prefer using slang or language styles from other countries. If this keeps happening, the use of Indonesian language and cultural habits could decrease more and more.',
      ID: 'Keempat, budaya asing juga dapat memengaruhi cara remaja berbicara dan bertindak. Terkadang, remaja zaman sekarang lebih suka menggunakan bahasa gaul atau gaya bahasa dari negara lain. Jika hal ini terus berlanjut, penggunaan bahasa Indonesia dan kebiasaan budaya bisa semakin berkurang.',
    },
  ],
  conclusion: {
    EN: 'In conclusion, foreign culture can affect teenagers and make them less interested in Indonesian culture. However, we should still learn, appreciate, and be proud of our own culture. We can enjoy foreign culture without forgetting Indonesian culture. Therefore, teenagers should be wise in choosing which foreign cultures to follow. We can take the good things from other cultures while keeping our own traditions alive. By doing this, Indonesian culture can continue to be appreciated and preserved by the younger generation.',
    ID: 'Kesimpulannya, budaya asing dapat memengaruhi remaja dan membuat mereka kurang tertarik pada budaya Indonesia. Namun, kita tetap harus belajar, menghargai, dan bangga akan budaya kita sendiri. Kita bisa menikmati budaya asing tanpa melupakan budaya Indonesia. Oleh karena itu, remaja harus bijak dalam memilih budaya asing yang diikuti. Kita dapat mengambil hal-hal baik dari budaya lain sambil tetap menjaga tradisi kita tetap hidup. Dengan begitu, budaya Indonesia dapat terus dihargai dan dilestarikan oleh generasi muda.',
  },
};



function WhySection() {
  const { language, accessibility } = useApp();
  const [localLang, setLocalLang] = useState<Language>(language);
  const [fading, setFading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Keep in sync with global language
  useEffect(() => {
    setLocalLang(language);
  }, [language]);

  const handleTranslate = () => {
    if (fading) return;
    const fadeDuration = accessibility.reduceMotion ? 0 : 300;
    setFading(true);

    setTimeout(() => {
      setLocalLang((prev) => (prev === 'EN' ? 'ID' : 'EN'));
      setFading(false);
    }, fadeDuration);
  };

  const fadeStyle = accessibility.reduceMotion
    ? {}
    : { opacity: fading ? 0 : 1, transition: 'opacity 300ms ease-in-out' };

  const lang = localLang;

  return (
    <section ref={sectionRef} id="why-section" className="py-16 px-4 bg-ink-900 batik-bg">
      <div className="max-w-5xl mx-auto">
        {/* Title + translate button — both fade together */}
        <div style={fadeStyle}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ink-50 flex items-center gap-3">
              <Lightbulb className="text-neon-yellow" size={32} />
              {whyContent.title[lang]}
            </h2>
            <button
              onClick={handleTranslate}
              disabled={fading}
              className="btn-neon flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-batik-400 to-batik-600 text-ink-50 font-display font-bold text-sm disabled:opacity-50"
              aria-label={lang === 'EN' ? 'Translate to Bahasa Indonesia' : 'Translate to English'}
            >
              {lang === 'EN' ? 'Translate to Bahasa Indonesia' : 'Translate to English'}
            </button>
          </div>
        </div>

        <p className="eyebrow mb-3">Analytical Exposition · Original author’s viewpoint</p><p className="text-sm text-ink-300 mb-6">An argument for balancing global influences with learning about local heritage. The text below preserves the original project’s essay.</p>
        <div aria-live="polite" style={fadeStyle} className="space-y-4">
          {/* Intro card */}
          <Card className="border-l-4 border-l-neon-blue">
            <p className="text-ink-200 leading-relaxed">{whyContent.intro[lang]}</p>
          </Card>

          {/* "In addition" card */}
          <Card className="border-l-4 border-l-neon-green">
            <p className="text-ink-200 leading-relaxed">{whyContent.addition[lang]}</p>
          </Card>

          {/* Reasons intro */}
          <p className="text-ink-300 font-display font-medium pl-2">
            {whyContent.reasonsIntro[lang]}
          </p>

          {/* Four reason cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {whyContent.reasons.map((reason, i) => (
              <Card key={i} className="border-l-4 border-l-batik-400">
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{i + 1}</span>
                  <p className="text-ink-200 leading-relaxed text-sm">{reason[lang]}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Conclusion card */}
          <Card className="border-l-4 border-l-neon-pink bg-gradient-to-r from-neon-pink/5 to-transparent">
            <p className="text-ink-200 leading-relaxed font-medium">{whyContent.conclusion[lang]}</p>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
 const {setPage,language,impactCounts,profile}=useApp();const id=language==='ID';
 const picks:[Page,'textile'|'puppet'|'music',string,string,string][]=[['gallery','textile',id?'SENI & KERAJINAN':'ARTS & CRAFTS','A little wax. A world of stories.',id?'Kenali batik dan ragam makna di balik motifnya.':'Meet batik, a living tradition written in wax and color.'],['legends','puppet',id?'CERITA RAKYAT':'FOLKLORE & WONDER',id?'Cerita yang terus hidup.':'Stories that stay with us.',id?'Buka halaman legenda dan temukan pesan di dalamnya.':'From Timun Mas to Malin Kundang, discover stories passed between generations.'],['gallery','music',id?'MUSIK & TRADISI':'MUSIC & TRADITION',id?'Bambu yang bernyanyi.':'A little bamboo. A little harmony.',id?'Temukan angklung dan seni yang menghubungkan kita.':'Discover angklung and the joy of making music together.']];
 const chapters:[Page,typeof Compass,string,string][]=[['gallery',Compass,id?'Jelajahi budaya':'Explore culture',id?'Seni, rasa, dan tradisi':'Arts, flavors & traditions'],['legends',BookOpen,id?'Buka sebuah cerita':'Open a story',id?'Kisah dari generasi ke generasi':'Folklore, passed down'],['language',MessageCircle,id?'Belajar sambil bermain':'Learn through play',id?'Kata baru, penemuan baru':'Little words, big discoveries'],['takeitirl',Leaf,id?'Coba di rumah':'Take it into the world',id?'Belajar bersama keluarga':'Make a family connection']];
 return <div className="home-page">
 <div className="page-container"><section className="home-hero" aria-labelledby="welcome-title"><div>
  <p className="eyebrow flex items-center gap-2"><Sparkles size={14}/>{id?'SELAMAT DATANG, PENJELAJAH KECIL':'FOR THE CURIOUS AT HEART'}</p>
  <h1 id="welcome-title">{id?<>Banyak pulau.<br/>Banyak cerita.<br/><em>Ayo jelajahi.</em></>:<>So many islands.<br/>So many stories.<br/><em>Let’s discover.</em></>}</h1>
  <p className="hero-copy">{id?'Dari cerita nenek hingga irama angklung, temukan budaya Indonesia yang hidup—satu penemuan kecil setiap hari.':'From grandma’s stories to the rhythm of bamboo, discover the living cultures of Indonesia—one little wonder at a time.'}</p>
  <div className="hero-actions"><Button size="lg" onClick={()=>setPage('gallery')}>{id?'Mulai menjelajah':'Start exploring'}<ArrowRight size={18}/></Button><Button size="lg" variant="secondary" onClick={()=>window.dispatchEvent(new CustomEvent('open-kila'))}>{id?'Kenalan dengan Kila':'Meet Kila'}<KilaMascot size={24} decorative/></Button></div>
  <p className="little-note"><span className="w-2 h-2 rounded-full bg-neon-green"/>{id?'Penuh rasa ingin tahu. Bebas menjelajah.':'A little learning. A little play. A lot of belonging.'}</p>
 </div><figure className="hero-scene"><img src="/art/culture-landscape.webp" width="1536" height="1024" alt="A storybook landscape with a Minangkabau rumah gadang, a Javanese joglo, wayang, angklung, and batik" fetchPriority="high"/><KilaMascot size={140} className="hero-kila"/><figcaption className="hero-caption">{id?'Satu kepulauan. Banyak budaya yang terus hidup.':'One archipelago. A thousand ways to feel at home.'}</figcaption></figure></section>
 <nav className="chapter-links" aria-label="Explore by activity">{chapters.map(([page,Icon,title,description])=><button className="chapter-link" key={page} onClick={()=>setPage(page)}><span className="icon-button bg-ink-800"><Icon size={21}/></span><span><strong>{title}</strong><small>{description}</small></span></button>)}</nav>
 <section className="home-section"><div className="section-heading"><div><p className="eyebrow">{id?'HALAMAN BARU UNTUK DIBUKA':'A FEW WONDERS TO BEGIN WITH'}</p><h2>{id?'Ke mana rasa ingin tahumu membawa?':'Where will curiosity take you?'}</h2></div><button className="text-link" onClick={()=>setPage('gallery')}>{id?'Lihat semua':'See all discoveries'}<ArrowRight size={16}/></button></div>
 <div className="discovery-grid">{picks.map(([page,subject,tag,title,description])=><Card key={subject} onClick={()=>setPage(page)} className="discovery-card"><div className="discovery-art"><StoryArt subject={subject} size={160}/></div><div className="discovery-copy"><span className="eyebrow">{tag}</span><h3>{title}</h3><p>{description}</p><span className="text-link mt-3">{id?'Buka halaman':'Turn the page'}<ArrowRight size={15}/></span></div></Card>)}</div></section>
 <section className="kila-banner"><KilaMascot size={110}/><div><p className="eyebrow mb-2">{id?'TEMAN KECIL, RASA INGIN TAHU BESAR':'A LITTLE STAR WITH A BIG CURIOSITY'}</p><h2>{id?'Hai, aku Kila!':'Hi, I’m Kila!'}</h2><p>{id?'Namaku dari kata kilau. Aku menemanimu menjelajah cerita dan budaya. Mau mulai dari mana?':'My name comes from kilau, a little glimmer. I’m here to help you find your next cultural discovery. What shall we explore together?'}</p></div><Button variant="secondary" onClick={()=>window.dispatchEvent(new CustomEvent('open-kila'))}>{id?'Tanya Kila':'Ask Kila'}<MessageCircle size={16}/></Button></section>
 <section className="home-section"><div className="section-heading"><div><p className="eyebrow">{id?'SETIAP LANGKAH BERARTI':'SMALL STEPS, MEANINGFUL CONNECTIONS'}</p><h2>{id?'Perjalanan belajarmu':'Your own little journey'}</h2></div><button className="text-link" onClick={()=>setPage('impact')}>{profile.points} points<ArrowRight size={16}/></button></div><div className="grid sm:grid-cols-3 gap-4">{[[impactCounts.legendsExplored,id?'cerita dijelajahi':'stories explored'],[impactCounts.familyConversations,id?'tantangan keluarga':'family challenges completed'],[impactCounts.danceStepsPracticed,id?'langkah dipelajari':'dance steps reviewed']].map(([value,label])=><Card key={label} className="flex items-center gap-4"><strong className="text-3xl font-display">{value}</strong><span className="text-sm text-ink-300">{label}</span></Card>)}</div></section>
 </div><WhySection/>
 </div>;
}
