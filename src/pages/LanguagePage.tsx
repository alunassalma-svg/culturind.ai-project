import { KilaMascot } from '@/components/KilaMascot';
import { StoryArt, artSubject } from '@/components/StoryArt';
import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button } from '@/components/ui';
import { content, t } from '@/data/content';
import { useTTS } from '@/hooks/useTTS';
import type { Language } from '@/types';
import {
  MessageCircle, Volume2, Pause, Play, RotateCcw,
  Check, X, Star, Award, Sparkles, Repeat,
} from 'lucide-react';

export function LanguagePage() {
  const { language, learningStyle, addPoints, addBadge, profile, progress, updateProgress } = useApp();
  const { speak, stop, speaking } = useTTS();
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Matching game state
  const [matchSelected, setMatchSelected] = useState<{ type: 'word' | 'match'; id: number } | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set(Object.keys(progress.languageProgress).filter(k=>k.startsWith("match:")&&progress.languageProgress[k]).map(k=>Number(k.slice(6)))));
  const [matchWrong, setMatchWrong] = useState(false);
  const [sorting,setSorting]=useState<Record<string,string>>({});

  const wordOfDay = content.wordsOfDay[new Date().getDate() % content.wordsOfDay.length];

  const currentQuiz = content.quizzes[quizIdx];

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
    if (idx === currentQuiz.answer) {
      setQuizCorrect((c) => c + 1);
      if (!progress.languageProgress[`quiz:${quizIdx}`]) { addPoints(5); updateProgress({languageProgress:{...progress.languageProgress,[`quiz:${quizIdx}`]:true}}); }
    }
  };

  const nextQuiz = () => {
    if (quizIdx + 1 < content.quizzes.length) {
      setQuizIdx(quizIdx + 1);
      setQuizAnswer(null);
    } else {
      setQuizDone(true);
      updateProgress({quizScores:{...progress.quizScores,slang:Math.max(progress.quizScores.slang??0,quizCorrect)}});
      if (quizCorrect >= 3) addBadge('quiz-master');
    }
  };

  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizAnswer(null);
    setQuizCorrect(0);
    setQuizDone(false);
  };

  // Matching game logic
  const shuffledMatches = useMemo(() => {
    const items=[...content.matchItems];
    for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
    return items;
  }, []);

  const handleMatchClick = (type: 'word' | 'match', id: number) => {
    if (matched.has(id) || matchWrong) return;
    if (!matchSelected) {
      setMatchSelected({ type, id });
      return;
    }
    if (matchSelected.type === type) {
      // Switch selection
      setMatchSelected({ type, id });
      return;
    }
    // Check match
    if (matchSelected.id === id) {
      const newMatched = new Set(matched);
      newMatched.add(id);
      setMatched(newMatched);
      setMatchSelected(null);
      if(!progress.languageProgress[`match:${id}`]) addPoints(5);
      updateProgress({languageProgress:{...progress.languageProgress,[`match:${id}`]:true}});
    } else {
      setMatchWrong(true);
      setTimeout(() => {
        setMatchWrong(false);
        setMatchSelected(null);
      }, 600);
    }
  };

  const handlePronounce = (text: string, slow: boolean) => {
    if (speaking) {
      stop();
      return;
    }
    speak(text, 'id-ID', slow ? 0.65 : 1);
    // Note: Web Speech API rate is set in the hook. For slow mode, we'd need a custom utterance.
  };

  const allMatched = matched.size === content.matchItems.length;

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-ink-50 flex items-center gap-2">
          <MessageCircle className="text-neon-green" />
          {language === 'EN' ? 'Language Center' : 'Pusat Bahasa'}
        </h1>
        <p className="text-ink-400 mt-1">
          {language === 'EN'
            ? 'Learn Indonesian and regional languages through games, quizzes, and pronunciation.'
            : 'Belajar bahasa Indonesia dan bahasa daerah melalui permainan, kuis, dan pelafalan.'}
        </p>
      </div>

      {/* Word of the Day */}
      <Card className="mb-6 border-l-4 border-l-neon-yellow">
        <div className="flex items-center gap-4">
          <StoryArt subject={artSubject(wordOfDay.emoji)} size={80} className="mx-auto" />
          <div className="flex-1">
            <div className="text-xs text-neon-yellow font-bold uppercase tracking-wider mb-1">
              {language === 'EN' ? 'Word of the Day' : 'Kata Hari Ini'}
            </div>
            <h3 className="text-2xl font-display font-bold text-ink-50">{wordOfDay.word}</h3>
            <p className="text-ink-300 text-sm">{t(wordOfDay.meaning, language)}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-ink-700 text-ink-400">
              {wordOfDay.lang}
            </span>
          </div>
          {learningStyle === 'Auditory' && (
            <Button
              size="sm"
              variant="neon-green"
              onClick={() => handlePronounce(wordOfDay.word, false)}
              aria-label="Pronounce word"
            >
              {speaking ? <Pause size={16} /> : <Volume2 size={16} />}
            </Button>
          )}
        </div>
      </Card>

      {/* Pronunciation audio (Auditory mode) */}
      {learningStyle === 'Auditory' && (
        <Card className="mb-6 border-l-4 border-l-neon-green">
          <h3 className="text-lg font-display font-bold text-ink-50 mb-3 flex items-center gap-2">
            <Volume2 size={18} className="text-neon-green" />
            {language === 'EN' ? 'Pronunciation' : 'Pelafalan'}
          </h3>
          <div className="space-y-3">
            {content.wordsOfDay.slice(0, 4).map((w) => (
              <div key={w.word} className="flex items-center justify-between p-3 bg-ink-800 rounded-lg">
                <div>
                  <span className="font-medium text-ink-50">{w.word}</span>
                  <span className="text-xs text-ink-400 ml-2">{t(w.meaning, language)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePronounce(w.word, false)}
                    className="px-2 py-1 rounded-lg bg-neon-green/20 text-neon-green text-xs font-medium flex items-center gap-1"
                    aria-label={`Pronounce ${w.word} normal speed`}
                  >
                    <Play size={12} /> {language === 'EN' ? 'Normal' : 'Normal'}
                  </button>
                  <button
                    onClick={() => handlePronounce(w.word, true)}
                    className="px-2 py-1 rounded-lg bg-ink-700 text-ink-300 text-xs font-medium flex items-center gap-1"
                    aria-label={`Pronounce ${w.word} slow speed`}
                  >
                    <Play size={12} /> {language === 'EN' ? 'Slow' : 'Lambat'}
                  </button>
                  <button
                    onClick={() => handlePronounce(w.word, false)}
                    className="px-2 py-1 rounded-lg bg-ink-700 text-ink-300 text-xs font-medium"
                    aria-label="Repeat"
                  >
                    <Repeat size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-500 mt-3">
            {language === 'EN'
              ? 'Uses browser text-to-speech. Real version would have native-speaker recordings.'
              : 'Menggunakan text-to-speech browser. Versi nyata akan memiliki rekaman penutur asli.'}
          </p>
        </Card>
      )}

      {/* Quiz section */}
      <Card className="mb-6">
        <h3 className="text-lg font-display font-bold text-ink-50 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-neon-pink" />
          {language === 'EN' ? 'Slang vs Proper Quiz' : 'Kuis Bahasa Gaul vs Baku'}
        </h3>

        {!quizDone ? (
          <div>
            <div className="text-xs text-ink-500 mb-2">
              {language === 'EN' ? `Question ${quizIdx + 1} of ${content.quizzes.length}` : `Pertanyaan ${quizIdx + 1} dari ${content.quizzes.length}`}
            </div>
            <p className="text-lg text-ink-50 mb-4">{t(currentQuiz.question, language)}</p>
            <div className="space-y-2">
              {currentQuiz.options.map((opt, i) => {
                const isAnswered = quizAnswer !== null;
                const isCorrect = i === currentQuiz.answer;
                const isSelected = i === quizAnswer;
                return (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i)}
                    disabled={isAnswered}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      !isAnswered
                        ? 'border-ink-600 hover:border-neon-blue text-ink-50'
                        : isCorrect
                        ? 'border-neon-green bg-neon-green/10 text-neon-green'
                        : isSelected
                        ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                        : 'border-ink-700 text-ink-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <Check size={18} />}
                      {isAnswered && isSelected && !isCorrect && <X size={18} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {quizAnswer !== null && (
              <div className="mt-4">
                <p className="text-sm text-ink-300 mb-3 p-3 bg-ink-800 rounded-lg">
                  {t(currentQuiz.explain, language)}
                </p>
                <Button onClick={nextQuiz} size="sm">
                  {quizIdx + 1 < content.quizzes.length
                    ? language === 'EN' ? 'Next' : 'Berikutnya'
                    : language === 'EN' ? 'See Results' : 'Lihat Hasil'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <KilaMascot size={90} className="mx-auto mb-3"/>
            <p className="text-xl font-display font-bold text-ink-50 mb-2">
              {quizCorrect} / {content.quizzes.length} {language === 'EN' ? 'correct' : 'benar'}
            </p>
            {quizCorrect >= 3 && (
              <p className="text-neon-yellow flex items-center justify-center gap-1 mb-4">
                <Award size={16} /> {language === 'EN' ? 'Quiz Master badge earned!' : 'Lencana Juara Kuis didapat!'}
              </p>
            )}
            <Button onClick={resetQuiz} variant="ghost" size="sm">
              <RotateCcw size={14} /> {language === 'EN' ? 'Try again' : 'Coba lagi'}
            </Button>
          </div>
        )}
      </Card>

      {/* Matching game (Kinesthetic mode or always visible) */}
      <Card className="mb-6">
        <h3 className="text-lg font-display font-bold text-ink-50 mb-4 flex items-center gap-2">
          <Star size={18} className="text-neon-blue" />
          {language === 'EN' ? 'Matching Game' : 'Permainan Mencocokkan'}
        </h3>

        {allMatched ? (
          <div className="text-center py-6">
            <KilaMascot size={80} className="mx-auto" decorative />
            <p className="text-lg font-display font-bold text-ink-50 mb-2">
              {language === 'EN' ? 'You matched them all!' : 'Kamu cocokkan semuanya!'}
            </p>
            <Button onClick={() => setMatched(new Set())} variant="ghost" size="sm">
              <RotateCcw size={14} /> {language === 'EN' ? 'Play again' : 'Main lagi'}
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-ink-400 mb-4">
              {language === 'EN'
                ? 'Match each Indonesian word with its translation. Tap a word, then tap its match!'
                : 'Cocokkan setiap kata Indonesia dengan terjemahannya. Ketuk kata, lalu ketuk pasangannya!'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Words */}
              <div className="space-y-2">
                <p className="text-xs text-ink-500 font-bold uppercase">Indonesian</p>
                {content.matchItems.map((item) => {
                  const isMatched = matched.has(item.id);
                  const isSelected = matchSelected?.type === 'word' && matchSelected?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMatchClick('word', item.id)}
                      disabled={isMatched}
                      className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all flex items-center gap-2 ${
                        isMatched
                          ? 'border-neon-green/30 bg-neon-green/5 text-ink-500 opacity-50'
                          : isSelected
                          ? 'border-neon-blue bg-neon-blue/10 text-ink-50'
                          : matchWrong && matchSelected?.type === 'word' && matchSelected?.id === item.id
                          ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                          : 'border-ink-600 text-ink-50 hover:border-neon-blue/50'
                      }`}
                    >
                      <StoryArt subject={artSubject(item.emoji)} size={42} className="mx-auto" />
                      <span className="font-medium">{t(item.word, language)}</span>
                      {isMatched && <Check size={16} className="ml-auto text-neon-green" />}
                    </button>
                  );
                })}
              </div>
              {/* Matches (shuffled) */}
              <div className="space-y-2">
                <p className="text-xs text-ink-500 font-bold uppercase">{language === 'EN' ? 'English' : 'Inggris'}</p>
                {shuffledMatches.map((item) => {
                  const isMatched = matched.has(item.id);
                  const isSelected = matchSelected?.type === 'match' && matchSelected?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMatchClick('match', item.id)}
                      disabled={isMatched}
                      className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                        isMatched
                          ? 'border-neon-green/30 bg-neon-green/5 text-ink-500 opacity-50'
                          : isSelected
                          ? 'border-neon-blue bg-neon-blue/10 text-ink-50'
                          : matchWrong && matchSelected?.type === 'match' && matchSelected?.id === item.id
                          ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                          : 'border-ink-600 text-ink-50 hover:border-neon-blue/50'
                      }`}
                    >
                      {item.match.EN}
                      {isMatched && <Check size={14} className="inline ml-2 text-neon-green" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div role="status" className="mt-4 text-sm text-ink-400">
              {matchWrong && <p>Those are different words. Try another pair.</p>}
              {language === 'EN' ? 'Matched' : 'Dicocokkan'}: {matched.size} / {content.matchItems.length}
            </div>
          </div>
        )}
      </Card>

      {learningStyle==='Kinesthetic'&&<Card><h3 className="text-xl font-bold mb-3">{language==='EN'?'Sort the words':'Kelompokkan kata'}</h3><p className="text-sm text-ink-300 mb-4">Choose whether each word is standard Indonesian or informal. No dragging needed.</p>{[{word:'tidak',answer:'Proper'},{word:'nggak',answer:'Slang'},{word:'sudah',answer:'Proper'},{word:'udah',answer:'Slang'}].map(item=><div key={item.word} className="flex flex-wrap items-center gap-3 p-3 border-b border-ink-600"><strong className="mr-auto">{item.word}</strong>{['Proper','Slang'].map(category=><Button key={category} size="sm" variant={sorting[item.word]===category?'primary':'secondary'} onClick={()=>setSorting({...sorting,[item.word]:category})}>{category}</Button>)}{sorting[item.word]&&<span role="status" className="text-sm">{sorting[item.word]===item.answer?'Correct!':`Try again. This is ${item.answer.toLowerCase()}.`}</span>}</div>)}<Button className="mt-4" variant="ghost" onClick={()=>setSorting({})}>Start again</Button></Card>}
    </div>
  );
}
