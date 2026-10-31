import {createContext,useContext,useState,useEffect,useCallback,type ReactNode} from 'react';
import type {AppState,AgeGroup,Mode,LearningStyle,Language,TextSize,Page,UserProgressData} from '@/types';
import {useAuth} from './AuthContext';
export const pages:Page[]=['home','legends','gallery','language','community','dance','outfit','takeitirl','clubs','why','impact','moderator'];
const emptyProgress:UserProgressData={completedLegends:[],quizScores:{},completedIrl:[],languageProgress:{},danceProgress:{}};
const defaults:AppState={ageGroup:null,mode:'Explorer',learningStyle:'Visual',language:'EN',accessibility:{textSize:'medium',highContrast:false,reduceMotion:false,dyslexiaFont:false},profile:{nickname:'Explorer',avatarSeed:'default',avatarPattern:'batik-parang',avatarColor:'#abc399',points:0,streak:0,badges:[],favoriteClub:null},impactCounts:{familyConversations:0,legendsExplored:0,danceStepsPracticed:0},progress:emptyProgress};
function readState(key:string):AppState {
  try {const saved=JSON.parse(localStorage.getItem(key)??'null');if(saved)return merge(defaults,saved);}catch{/* Storage can be unavailable in private browsing. */}
  return {...defaults,accessibility:{...defaults.accessibility,reduceMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches}};
}
function merge(base:AppState,saved:Partial<AppState>):AppState {return {...base,...saved,profile:{...base.profile,...saved.profile},accessibility:{...base.accessibility,...saved.accessibility},impactCounts:{...base.impactCounts,...saved.impactCounts},progress:{...base.progress,...saved.progress}};}
function route():Page {const value=location.hash.replace(/^#\//,'');return pages.includes(value as Page)?value as Page:'home';}
interface Value extends AppState {
 currentPage:Page;restoring:boolean;routeMissing:boolean;localSaveError:boolean;
 setPage:(page:Page)=>void;setAgeGroup:(group:AgeGroup)=>void;setMode:(mode:Mode)=>void;setLearningStyle:(style:LearningStyle)=>void;setLanguage:(language:Language)=>void;setTextSize:(size:TextSize)=>void;toggleHighContrast:()=>void;toggleReduceMotion:()=>void;toggleDyslexiaFont:()=>void;addPoints:(n:number)=>void;addBadge:(badge:string)=>void;setProfile:(profile:Partial<AppState['profile']>)=>void;incrementImpact:(key:keyof AppState['impactCounts'],n?:number)=>void;updateProgress:(update:Partial<UserProgressData>)=>void;
 canPost:boolean;canComment:boolean;canUseCamera:boolean;isCreator:boolean;
}
const Context=createContext<Value|null>(null);
export function AppProvider({children}:{children:ReactNode}) {
 const {user,loadState,saveState}=useAuth();
 const key=`culturind-v2:${user?.id??'guest'}`;
 const [state,setState]=useState(()=>readState('culturind-v2:guest'));
 const [loadedKey,setLoadedKey]=useState('culturind-v2:guest');
 const [restoring,setRestoring]=useState(false);
 const [localSaveError,setLocalSaveError]=useState(false);
 const [canSync,setCanSync]=useState(false);
 const [currentPage,setCurrentPage]=useState<Page>(route);
 const [routeMissing,setRouteMissing]=useState(location.hash.startsWith('#/')&&!pages.includes(location.hash.slice(2) as Page));
 useEffect(()=>{let active=true;setCanSync(false);setLoadedKey('');setState(readState(key));if(!user){setLoadedKey(key);setRestoring(false);return;}
   setRestoring(true);const timeout=window.setTimeout(()=>{if(active){active=false;setRestoring(false);setLoadedKey(key);}},7000);
   loadState(user).then(remote=>{if(active){if(remote)setState(previous=>merge(previous,remote));setCanSync(true);}}).catch(()=>{/* Keep the per-user cache on network failure. */}).finally(()=>{if(active){setRestoring(false);setLoadedKey(key);}clearTimeout(timeout);});
   return()=>{active=false;clearTimeout(timeout);};
 },[key,user,loadState]);
 useEffect(()=>{if(loadedKey!==key||restoring)return;try{localStorage.setItem(key,JSON.stringify(state));setLocalSaveError(false);}catch{setLocalSaveError(true);}if(user&&canSync)saveState(state);},[state,key,loadedKey,restoring,user,canSync,saveState]);
 useEffect(()=>{const handler=()=>{setCurrentPage(route());setRouteMissing(location.hash.startsWith('#/')&&!pages.includes(location.hash.slice(2) as Page));};window.addEventListener('hashchange',handler);return()=>window.removeEventListener('hashchange',handler);},[]);
 useEffect(()=>{const root=document.documentElement;root.classList.remove('text-sm-base','text-md-base','text-lg-base','text-xl-base','hc-mode','reduce-motion','dyslexia-font');root.classList.add(({small:'text-sm-base',medium:'text-md-base',large:'text-lg-base',xlarge:'text-xl-base'} as const)[state.accessibility.textSize]);if(state.accessibility.highContrast)root.classList.add('hc-mode');if(state.accessibility.reduceMotion)root.classList.add('reduce-motion');if(state.accessibility.dyslexiaFont)root.classList.add('dyslexia-font');root.lang=state.language==='EN'?'en':'id';},[state.accessibility,state.language]);
 const setPage=useCallback((page:Page)=>{setCurrentPage(page);setRouteMissing(false);location.hash=`/${page}`;window.scrollTo({top:0,behavior:'auto'});window.setTimeout(()=>document.getElementById('main-content')?.focus({preventScroll:true}),0);},[]);
 const addPoints=useCallback((n:number)=>setState(p=>({...p,profile:{...p.profile,points:p.profile.points+n}})),[]);
 const addBadge=useCallback((badge:string)=>setState(p=>({...p,profile:{...p.profile,badges:p.profile.badges.includes(badge)?p.profile.badges:[...p.profile.badges,badge]}})),[]);
 const incrementImpact=useCallback((name:keyof AppState['impactCounts'],n=1)=>setState(p=>({...p,impactCounts:{...p.impactCounts,[name]:p.impactCounts[name]+n}})),[]);
 const updateProgress=useCallback((update:Partial<UserProgressData>)=>setState(p=>({...p,progress:{...p.progress,...update}})),[]);
 const creator=state.mode==='Creator'&&(state.ageGroup==='teen'||state.ageGroup==='adult');
 const value:Value={...state,currentPage,routeMissing,localSaveError,restoring:restoring||loadedKey!==key,setPage,addPoints,addBadge,incrementImpact,updateProgress,
 setAgeGroup:ageGroup=>setState(p=>({...p,ageGroup})),setMode:mode=>setState(p=>({...p,mode:(mode==='Creator'&&(p.ageGroup!=='teen'&&p.ageGroup!=='adult'))?'Explorer':mode})),setLearningStyle:learningStyle=>setState(p=>({...p,learningStyle})),setLanguage:language=>setState(p=>({...p,language})),setTextSize:textSize=>setState(p=>({...p,accessibility:{...p.accessibility,textSize}})),toggleHighContrast:()=>setState(p=>({...p,accessibility:{...p.accessibility,highContrast:!p.accessibility.highContrast}})),toggleReduceMotion:()=>setState(p=>({...p,accessibility:{...p.accessibility,reduceMotion:!p.accessibility.reduceMotion}})),toggleDyslexiaFont:()=>setState(p=>({...p,accessibility:{...p.accessibility,dyslexiaFont:!p.accessibility.dyslexiaFont}})),setProfile:profile=>setState(p=>({...p,profile:{...p.profile,...profile}})),canPost:creator,canComment:creator,canUseCamera:!!user&&state.ageGroup!=='under7',isCreator:creator};
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp(){const value=useContext(Context);if(!value)throw new Error('useApp requires AppProvider');return value;}
