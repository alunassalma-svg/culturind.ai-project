import { useState,useEffect,useRef } from 'react';
import {useApp} from '@/context/AppContext';
import {KilaMascot} from './KilaMascot';
import {useTTS} from '@/hooks/useTTS';
import {Send,X,Volume2,RotateCcw} from 'lucide-react';
interface Message {role:'user'|'guide';text:string;source?:string}
const facts=[
 {keys:['batik'],EN:'Batik uses wax to protect parts of cloth during dyeing. Techniques and designs vary across communities. Motif meanings depend on their local context.',ID:'Batik menggunakan lilin untuk melindungi bagian kain saat pewarnaan. Teknik, motif, dan maknanya beragam sesuai masyarakat dan konteksnya.',source:'https://ich.unesco.org/en/RL/indonesianbatik-00170'},
 {keys:['saman','tari'],EN:'Saman belongs to the heritage of the Gayo people of Aceh. Performers sit close together in a row, using coordinated movements and rhythmic singing. Learn from a teacher for the full tradition.',ID:'Saman merupakan warisan masyarakat Gayo di Aceh. Penari duduk berbaris rapat, menggerakkan tubuh secara serempak sambil melantunkan syair. Belajar bersama guru untuk memahami tradisinya lebih utuh.',source:'https://ich.unesco.org/en/lists?USL=00509'},
 {keys:['angklung','music','musik','gamelan','wayang'],EN:'Indonesia has many distinct music and performance traditions. Try the Gallery for angklung, gamelan and wayang. UNESCO’s Indonesia collection offers documentation and videos about these living traditions.',ID:'Indonesia memiliki ragam tradisi musik dan pertunjukan. Buka Galeri untuk mengenal angklung, gamelan, dan wayang. Koleksi UNESCO tentang Indonesia memuat dokumentasi tradisi tersebut.',source:'https://ich.unesco.org/en/state/indonesia-ID'},
 {keys:['roro','prambanan'],EN:'Roro Jonggrang is associated with Prambanan, near the border of Yogyakarta and Central Java. Its story is folklore, which should be distinguished from the site’s archaeological history.',ID:'Roro Jonggrang dikaitkan dengan Prambanan, di sekitar perbatasan Yogyakarta dan Jawa Tengah. Kisahnya merupakan cerita rakyat, berbeda dari sejarah arkeologi candinya.',source:'https://whc.unesco.org/en/list/642/'},
];
export function AIAssistant(){
 const {language,learningStyle,setPage}=useApp();const id=language==='ID';const {speak,stop,speaking,supported}=useTTS();
 const [open,setOpen]=useState(false),[input,setInput]=useState(''),[messages,setMessages]=useState<Message[]>([]);
 const inputRef=useRef<HTMLInputElement>(null),end=useRef<HTMLDivElement>(null),launcher=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const show=()=>setOpen(true);window.addEventListener('open-kila',show);return()=>window.removeEventListener('open-kila',show);},[]);
 useEffect(()=>{if(open)inputRef.current?.focus();},[open]);
 useEffect(()=>{if(open)end.current?.scrollIntoView({block:'nearest'});},[messages,open]);
 const close=()=>{setOpen(false);stop();launcher.current?.focus();};
 const reply=(question:string)=>{
  const text=question.toLowerCase();let result:Message={role:'guide',text:id?'Aku belum punya catatan tentang itu. Coba tanyakan batik, Saman, angklung, atau Roro Jonggrang. Untuk pertanyaan lainnya, tanya guru atau sumber komunitas.':'I don’t have a note on that yet. Try batik, Saman, angklung, or Roro Jonggrang. A teacher or community source can help with other questions.'};
  if(/\S+@\S+\.\S+|\d{9,}|my address|alamat saya/.test(text)){result.text=id?'Simpan informasi pribadi untuk dirimu sendiri. Ayo lanjut dengan pertanyaan budaya.':'Keep personal information private. Let’s continue with a question about culture.';}
  else if(/where|find|buka|cari/.test(text)&&/game|permainan|language|bahasa/.test(text)){setPage('language');result.text=id?'Ayo ke Bahasa & Permainan!':'Let’s visit Language & Games!';}
  else {const fact=facts.find(f=>f.keys.some(key=>text.includes(key)));if(fact)result={role:'guide',text:fact[language],source:fact.source};}
  setMessages(previous=>[...previous,{role:'user',text:question},result]);setInput('');
 };
 if(!open)return <button ref={launcher} onClick={()=>setOpen(true)} className="assistant-launch" aria-label="Ask Kila"><KilaMascot size={48} decorative/>{id?'Tanya Kila':'Ask Kila'}</button>;
 return <section className="assistant-panel" aria-label="Kila cultural guide" onKeyDown={e=>{if(e.key==='Escape')close();}}>
  <header className="assistant-heading"><div className="flex items-center gap-2"><KilaMascot size={44} decorative/><div><strong>Kila</strong><p className="text-xs text-ink-300">{id?'Teman jelajah budayamu':'Your cultural companion'}</p></div></div><div className="flex"><button className="icon-button" aria-label="Clear conversation" onClick={()=>{setMessages([]);stop();inputRef.current?.focus();}}><RotateCcw size={16}/></button><button className="icon-button" aria-label="Close Kila" onClick={close}><X size={18}/></button></div></header>
  <div className="px-4 pt-3 text-xs text-ink-300">{id?'Panduan lokal dari catatan terpilih. AI langsung belum terhubung. Percakapan tidak dikirim ke server.':'A local guide using selected notes. Live AI is not connected. This conversation stays in this page.'}</div>
  <div className="assistant-messages" role="log" aria-live="polite"><div className="message">{id?'Hai! Aku Kila. Mau mengenal batik, Saman, atau angklung?':'Hi! I’m Kila. Shall we discover batik, Saman, or angklung together?'}</div>{messages.map((message,index)=><div key={index} className={`message ${message.role==='user'?'message-user':''}`}><span className="sr-only">{message.role==='user'?'You: ':'Kila: '}</span><p>{message.text}</p>{message.source&&<a className="underline block mt-2 text-xs" href={message.source} target="_blank" rel="noreferrer">Read the source · UNESCO</a>}{message.role==='guide'&&learningStyle==='Auditory'&&supported&&<button className="text-link text-xs mt-1" onClick={()=>speaking?stop():speak(message.text,id?'id-ID':'en-US')}><Volume2 size={14}/>{speaking?'Stop':'Listen'}</button>}</div>)}<div ref={end}/></div>
  {!messages.length&&<div className="px-4 pb-2 flex flex-wrap gap-2">{['Batik','Saman','Angklung'].map(topic=><button key={topic} onClick={()=>reply(topic)} className="story-button button-secondary button-sm">{topic}</button>)}</div>}
  <form className="assistant-form" onSubmit={e=>{e.preventDefault();if(input.trim())reply(input.trim());}}><input ref={inputRef} value={input} maxLength={800} onChange={e=>setInput(e.target.value)} aria-label={id?'Pertanyaan untuk Kila':'Question for Kila'} placeholder={id?'Apa yang ingin kamu tahu?':'What are you curious about?'}/><button className="icon-button bg-batik-400" aria-label="Send message" disabled={!input.trim()}><Send size={18}/></button></form>
 </section>;
}
