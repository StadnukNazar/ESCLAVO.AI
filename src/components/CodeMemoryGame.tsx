import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Brain, Code2, Zap, Terminal } from 'lucide-react';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CODE_PAIRS = [
  'const x = 5;', 'let y = 10;',
  '() => { }', 'function() { }',
  'Array.map()', 'Array.filter()',
  'async / await', 'Promise',
  '=== / !==', '== / !=',
  'import { }', 'export { }',
  'JSON.parse()', 'JSON.stringify()',
  '??', '||'
];

// For memory game, let's pick 8 pairs from these or similar logic symbols
const LOGO_CONTENT = [
  '===', '!==', '&&', '||', '??', '=>', '...', '0 !== 1',
  'ref.current', 'async/await', 'Promise.all', '{ ...obj }', 'import x from', 'export const', '[a, b] =', '() => ({})'
];

interface CodeMemoryGameProps {
  onClose: () => void;
}

const CodeMemoryGame: React.FC<CodeMemoryGameProps> = ({ onClose }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [time, setTime] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let timer: number;
    if (gameState === 'playing') {
      timer = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const initializeGame = () => {
    const selectedContent = [...LOGO_CONTENT].sort(() => 0.5 - Math.random()).slice(0, 8);
    const pairContent = [...selectedContent, ...selectedContent];
    const shuffledContent = pairContent.sort(() => 0.5 - Math.random());
    
    const newCards = shuffledContent.map((content, index) => ({
      id: index,
      content,
      isFlipped: false,
      isMatched: false
    }));
    
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameState('playing');
    setTime(0);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched || gameState === 'won') return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlipped;

      if (cards[firstId].content === cards[secondId].content) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            (card.id === firstId || card.id === secondId) ? { ...card, isMatched: true } : card
          ));
          setMatches(prev => {
            const next = prev + 1;
            if (next === 8) setGameState('won');
            return next;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            (card.id === firstId || card.id === secondId) ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-3xl overflow-hidden font-sans"
    >
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-purple-500/30 rounded-[3rem] p-10 relative overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.15)] flex flex-col max-h-[90vh]">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative z-10 flex justify-between items-start mb-10">
          <div>
             <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Code<span className="text-purple-500">.Memory</span></h2>
             <p className="text-[10px] text-purple-500/60 font-bold uppercase tracking-[0.3em] mt-2">Neural Synchronization Protocol</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-neutral-400 group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="relative z-10 flex gap-12 mb-8 bg-neutral-900/40 p-6 rounded-3xl border border-white/5">
           <div className="space-y-1">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Matches</span>
              <div className="flex items-baseline gap-1">
                 <span className="text-4xl font-black text-white italic">{matches}</span>
                 <span className="text-neutral-600 font-bold uppercase text-[10px]">/ 8</span>
              </div>
           </div>
           <div className="w-px h-12 bg-neutral-800" />
           <div className="space-y-1">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Moves</span>
              <span className="text-4xl font-black text-purple-500 italic block leading-none">{moves}</span>
           </div>
           <div className="w-px h-12 bg-neutral-800" />
           <div className="space-y-1">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Sync Time</span>
              <span className="text-4xl font-black text-white italic block leading-none font-mono">
                {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
              </span>
           </div>
        </div>

        <div className="relative z-10 grid grid-cols-4 gap-4 mb-8 overflow-y-auto pr-2 custom-scrollbar">
          {cards.map((card) => (
            <div 
              key={card.id}
              className="aspect-square perspective-1000"
              onClick={() => handleCardClick(card.id)}
            >
              <motion.div 
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d cursor-pointer"
              >
                {/* Front (Back of card) */}
                <div className="absolute inset-0 backface-hidden bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center p-4 group">
                  <div className="w-full h-full border border-purple-500/10 rounded-xl flex items-center justify-center transition-all group-hover:bg-purple-500/5 group-hover:border-purple-500/30">
                    <Terminal className="w-6 h-6 text-neutral-700 group-hover:text-purple-500/40 transition-colors" />
                  </div>
                </div>

                {/* Back (Content face) */}
                <div className={`absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center p-2 border-2 rotate-y-180 ${
                  card.isMatched ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                }`}>
                  <span className={`text-base font-black italic uppercase tracking-tighter ${card.isMatched ? 'text-emerald-400' : 'text-white'}`}>
                    {card.content}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {gameState === 'won' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-md p-10"
            >
              <div className="text-center space-y-8">
                <div className="w-24 h-24 bg-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.5)] border-4 border-purple-400 rotate-12">
                   <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Memory Optimized</h3>
                  <p className="text-neutral-400 text-xs font-bold uppercase tracking-[0.3em]">Neural connections verified in {time} seconds</p>
                </div>
                <div className="flex gap-4 justify-center">
                   <button 
                    onClick={initializeGame}
                    className="flex items-center gap-3 px-10 py-5 bg-purple-600 text-white font-black uppercase tracking-[0.2em] text-xs skew-x-[-12deg] hover:bg-purple-500 transition-all border border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                   >
                    <RotateCcw className="w-4 h-4" />
                    Restore Cache
                   </button>
                   <button 
                    onClick={onClose}
                    className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs skew-x-[-12deg] hover:bg-white/10 transition-all"
                   >
                    System Out
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style dangerouslySetInnerHTML={{ __html: `
          .perspective-1000 { perspective: 1000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `}} />
      </div>
    </motion.div>
  );
};

export default CodeMemoryGame;
