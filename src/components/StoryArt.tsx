type Subject = 'textile' | 'puppet' | 'music' | 'food' | 'book' | 'conversation';
const tiles: Record<Subject, number> = { textile: 0, puppet: 1, music: 2, food: 3, book: 4, conversation: 5 };
/** Shared art sheet, generated together against the original Kila reference. */
export function StoryArt({ subject = 'book', size = 100, className = '', label }: { subject?: Subject; size?: number; className?: string; label?: string }) {
  const tile = tiles[subject];
  return <span className={`story-art ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{ width: size, height: size, backgroundPosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 100}%` }} />;
}
export function artSubject(value: string): Subject {
  if (/textile|batik|tenun|songket|cloth|🧵|🎨|🧶|👕|🧥|👔|🥻/.test(value)) return 'textile';
  if (/wayang|🎭/.test(value)) return 'puppet';
  if (/music|angklung|gamelan|🎵|🎶/.test(value)) return 'music';
  if (/food|rendang|nasi|pisang|🍛|🍚|🍌|🥒/.test(value)) return 'food';
  if (/community|language|💬|🗣|👥/.test(value)) return 'conversation';
  return 'book';
}

const culturalTiles:Record<string,number>={'songket-sumba':0,gamelan:1,rendang:2,'nasi-goreng':3,'tari-saman':4,'tenun-ikat':5,keris:6,borobudur:7,'pisang-goreng':8};
/** Stylized object-specific illustrations; not exact records of particular artifacts. */
export function CulturalArt({id,size=100,className=''}:{id:string;size?:number;className?:string}) {
  const tile=culturalTiles[id];
  if(tile===undefined)return <StoryArt subject={artSubject(id)} size={size} className={className}/>;
  return <span aria-hidden="true" className={className} style={{width:size,height:size,display:'inline-flex',alignItems:'center',justifyContent:'center',verticalAlign:'middle',flexShrink:0}}><span className="story-art" style={{width:size,height:size*2/3,backgroundImage:"url('/art/culture-atlas.webp')",backgroundSize:'300% 300%',backgroundPosition:`${(tile%3)*50}% ${Math.floor(tile/3)*50}%`}}/></span>;
}
