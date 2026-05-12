import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw } from 'lucide-react';

interface DoodleJumpGameProps {
  onClose: () => void;
}

const DoodleJumpGame: React.FC<DoodleJumpGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('esclave_game_highscore') || '0');
  });

  const playerRef = useRef({
    x: 175,
    y: 400,
    width: 30,
    height: 30,
    vx: 0,
    vy: 0,
    color: '#3b82f6'
  });

  const platformsRef = useRef<{ x: number, y: number, width: number, height: number }[]>([]);
  const scrollOffsetRef = useRef(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const scoreRef = useRef(0);

  const initGame = () => {
    playerRef.current = {
      x: 175,
      y: 400,
      width: 30,
      height: 30,
      vx: 0,
      vy: -10,
      color: '#3b82f6'
    };
    
    const platforms = [];
    platforms.push({ x: 100, y: 550, width: 200, height: 10 });
    
    for (let i = 0; i < 15; i++) {
      platforms.push({
        x: Math.random() * 300,
        y: 550 - (i * 60),
        width: 60,
        height: 12
      });
    }
    platformsRef.current = platforms;
    scrollOffsetRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current[e.code] = true;
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current[e.code] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const update = () => {
      const player = playerRef.current;
      
      if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) player.vx -= 0.8;
      if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) player.vx += 0.8;
      
      player.vx *= 0.9;
      player.x += player.vx;
      
      if (player.x + player.width < 0) player.x = canvas.width;
      if (player.x > canvas.width) player.x = -player.width;
      
      player.vy += 0.3;
      player.y += player.vy;
      
      if (player.vy > 0) {
        platformsRef.current.forEach(plat => {
          if (
            player.x + player.width > plat.x &&
            player.x < plat.x + plat.width &&
            player.y + player.height > plat.y &&
            player.y + player.height < plat.y + plat.height + player.vy
          ) {
            player.vy = -10;
            player.y = plat.y - player.height;
          }
        });
      }

      if (player.y < 250) {
        const diff = 250 - player.y;
        player.y = 250;
        scrollOffsetRef.current += diff;
        const newScore = Math.floor(scrollOffsetRef.current / 10);
        if (newScore !== scoreRef.current) {
          scoreRef.current = newScore;
          setScore(newScore);
        }
        
        platformsRef.current.forEach(plat => plat.y += diff);
      }

      platformsRef.current = platformsRef.current.filter(plat => plat.y < 600);
      while (platformsRef.current.length < 15) {
        const lastPlat = platformsRef.current[platformsRef.current.length - 1];
        platformsRef.current.push({
          x: Math.random() * (canvas.width - 60),
          y: (lastPlat?.y || 0) - (Math.random() * 50 + 50),
          width: 60,
          height: 12
        });
      }

      if (player.y > canvas.height) {
        setGameState('gameover');
        // Handle high score in state later when gameState changes
        return;
      }

      render();
      animationFrameId = requestAnimationFrame(update);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const player = playerRef.current;

      ctx.fillStyle = '#1a2e05'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      platformsRef.current.forEach(plat => {
        ctx.fillStyle = '#78350f'; 
        ctx.fillRect(plat.x, plat.y + 4, plat.width, 4);
        
        ctx.fillStyle = '#4b5563'; 
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#000';
        ctx.fillRect(plat.x + plat.width * 0.2, plat.y, plat.width * 0.6, plat.height);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#374151';
        for(let j = 0; j < 5; j++) {
           ctx.fillRect(plat.x + (plat.width * 0.2) + (j * (plat.width * 0.12)), plat.y + plat.height - 2, 2, 4);
        }
      });

      ctx.save();
      ctx.translate(player.x + player.width/2, player.y + player.height/2);
      ctx.rotate(player.vx * 0.05);

      ctx.fillStyle = '#166534'; 
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(21, 128, 61, 0.5)';
      
      ctx.beginPath();
      ctx.ellipse(0, 0, player.width/2, player.height * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#15803d';
      for(let k = 0; k < 5; k++) {
         ctx.beginPath();
         ctx.arc(-5 + k * 2, -10 + k * 4, 2, 0, Math.PI * 2);
         ctx.fill();
      }
      
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(-6, -8, 4, 0, Math.PI * 2);
      ctx.arc(6, -8, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(-6, -8, 2, 0, Math.PI * 2);
      ctx.arc(6, -8, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 2, 6, 0, Math.PI);
      ctx.stroke();

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'gameover') {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('esclave_game_highscore', score.toString());
      }
    }
  }, [gameState]);

  const handleStart = () => {
    initGame();
    setGameState('playing');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl overflow-hidden font-sans"
    >
      <div className="relative w-full max-w-[400px] h-[600px] bg-[#050505] border border-neutral-800 rounded-3xl shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black to-transparent">
          <div>
            <h2 className="text-xl font-black text-white italic tracking-tighter">ОГІРОК<span className="text-emerald-500">.STRIBAE</span></h2>
            <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">Protocol: Garden Mastery</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
           <div className="space-y-1">
             <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Зібрано балів</p>
             <p className="text-3xl font-black text-white italic leading-none">{score}</p>
           </div>
           <div className="text-right space-y-1">
             <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Рекорд</p>
             <p className="text-xl font-black text-emerald-500 italic leading-none">{highScore}</p>
           </div>
        </div>

        <canvas 
          ref={canvasRef}
          width={400}
          height={600}
          className="absolute inset-0 w-full h-full"
        />

        <AnimatePresence>
          {gameState === 'start' && (
            <motion.div 
              key="start-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-black/60 backdrop-blur-sm z-20"
            >
              <div className="w-24 h-24 bg-emerald-600 rounded-full mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)] border-4 border-emerald-400">
                <div className="w-12 h-16 bg-emerald-700 rounded-[2rem] border-2 border-emerald-400 flex flex-col items-center justify-center gap-2">
                   <div className="flex gap-2">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <div className="w-2 h-2 bg-white rounded-full" />
                   </div>
                </div>
              </div>
              <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2 uppercase">Готові Стрибати?</h3>
              <p className="text-neutral-500 text-center text-xs font-medium uppercase tracking-widest mb-12">
                Стрілки або A/D для руху
              </p>
              <button 
                onClick={handleStart}
                className="px-12 py-4 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs skew-x-[-12deg] hover:bg-emerald-500 transition-all border border-emerald-400"
              >
                Почати Стрибки
              </button>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div 
              key="gameover-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-black/80 backdrop-blur-md z-20"
            >
              <h3 className="text-5xl font-black text-rose-500 italic tracking-tighter mb-2 shadow-rose-500/50">ГРУ ЗАКІНЧЕНО</h3>
              <p className="text-neutral-500 text-center text-xs font-medium uppercase tracking-widest mb-12">
                Ваш огірок впав на {score} метрів
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleStart}
                  className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs skew-x-[-12deg] hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ще раз
                </button>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs skew-x-[-12deg] hover:bg-white/10 transition-all font-mono"
                >
                  ВИХІД
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_100%,100%_2px,3px_100%] z-30" />
        <div className={`absolute top-0 left-0 w-full h-1 bg-white/5 blur-sm animate-scanline z-40 pointer-events-none`} />
      </div>
    </motion.div>
  );
};

export default DoodleJumpGame;
