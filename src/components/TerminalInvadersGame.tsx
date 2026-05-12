import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Shield, Zap, Target } from 'lucide-react';

interface TerminalInvadersGameProps {
  onClose: () => void;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Enemy extends GameObject {
  type: number;
  alive: boolean;
}

interface Bullet extends GameObject {
  active: boolean;
}

const TerminalInvadersGame: React.FC<TerminalInvadersGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('terminal_invaders_highscore') || '0');
  });

  const playerRef = useRef({
    x: 185,
    y: 530,
    width: 30,
    height: 20,
    vx: 0,
    speed: 5
  });

  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const enemyBulletsRef = useRef<Bullet[]>([]);
  const enemyDirectionRef = useRef(1);
  const enemyStepDownRef = useRef(false);
  const lastShotRef = useRef(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const initGame = () => {
    playerRef.current = {
      x: 185,
      y: 530,
      width: 30,
      height: 20,
      vx: 0,
      speed: 5
    };
    
    const enemies: Enemy[] = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        enemies.push({
          x: 40 + col * 40,
          y: 60 + row * 35,
          width: 25,
          height: 20,
          type: row,
          alive: true
        });
      }
    }
    enemiesRef.current = enemies;
    bulletsRef.current = [];
    enemyBulletsRef.current = [];
    enemyDirectionRef.current = 1;
    enemyStepDownRef.current = false;
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
    let frameCount = 0;

    const update = () => {
      const player = playerRef.current;
      frameCount++;

      // Player Movement
      if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) player.x -= player.speed;
      if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) player.x += player.speed;
      
      // Keep player in bounds
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

      // Shooting
      if ((keysRef.current['Space'] || keysRef.current['ArrowUp'] || keysRef.current['KeyW']) && Date.now() - lastShotRef.current > 400) {
        bulletsRef.current.push({
          x: player.x + player.width / 2 - 2,
          y: player.y - 10,
          width: 4,
          height: 10,
          active: true
        });
        lastShotRef.current = Date.now();
      }

      // Update Bullets
      bulletsRef.current.forEach(bullet => {
        bullet.y -= 7;
        if (bullet.y < 0) bullet.active = false;
      });
      bulletsRef.current = bulletsRef.current.filter(b => b.active);

      // Update Enemy Bullets
      enemyBulletsRef.current.forEach(bullet => {
        bullet.y += 4;
        if (bullet.y > canvas.height) bullet.active = false;
        
        // Player Collision
        if (
          bullet.x < player.x + player.width &&
          bullet.x + bullet.width > player.x &&
          bullet.y < player.y + player.height &&
          bullet.y + bullet.height > player.y
        ) {
          setGameState('gameover');
        }
      });
      enemyBulletsRef.current = enemyBulletsRef.current.filter(b => b.active);

      // Enemy Movement
      let moveDown = false;
      const aliveEnemies = enemiesRef.current.filter(e => e.alive);
      
      if (aliveEnemies.length === 0) {
        setGameState('won');
        return;
      }

      if (frameCount % (Math.max(10, aliveEnemies.length)) === 0) {
        aliveEnemies.forEach(enemy => {
          enemy.x += 10 * enemyDirectionRef.current;
          if (enemy.x + enemy.width > canvas.width - 20 || enemy.x < 20) {
            moveDown = true;
          }
        });

        if (moveDown) {
          enemyDirectionRef.current *= -1;
          enemiesRef.current.forEach(enemy => {
            enemy.y += 20;
            if (enemy.y + enemy.height > player.y) {
              setGameState('gameover');
            }
          });
        }
      }

      // Enemy Shooting
      if (frameCount % 60 === 0 && aliveEnemies.length > 0) {
        const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        enemyBulletsRef.current.push({
          x: shooter.x + shooter.width / 2,
          y: shooter.y + shooter.height,
          width: 4,
          height: 10,
          active: true
        });
      }

      // Collisions
      bulletsRef.current.forEach(bullet => {
        enemiesRef.current.forEach(enemy => {
          if (
            enemy.alive &&
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            enemy.alive = false;
            bullet.active = false;
            setScore(s => s + 100);
          }
        });
      });

      render();
      animationFrameId = requestAnimationFrame(update);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const player = playerRef.current;

      // Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix Grid
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Enemies (Code Tags)
      enemiesRef.current.forEach(enemy => {
        if (!enemy.alive) return;
        
        const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
        ctx.fillStyle = colors[enemy.type % colors.length];
        
        ctx.font = 'bold 14px monospace';
        const text = enemy.type === 0 ? '</>' : enemy.type === 1 ? '{ }' : enemy.type === 2 ? '( )' : enemy.type === 3 ? '[ ]' : '=>';
        ctx.fillText(text, enemy.x, enemy.y + 15);
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors[enemy.type % colors.length];
        ctx.fillRect(enemy.x, enemy.y + 20, enemy.width, 2);
        ctx.shadowBlur = 0;
      });

      // Bullets
      ctx.fillStyle = '#00ff00';
      bulletsRef.current.forEach(b => {
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00ff00';
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      // Enemy Bullets
      ctx.fillStyle = '#ff0000';
      enemyBulletsRef.current.forEach(b => {
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff0000';
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      // Player (Terminal Input Line)
      ctx.fillStyle = '#60a5fa';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#60a5fa';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, 2);
      ctx.shadowBlur = 0;
      
      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'gameover' || gameState === 'won') {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('terminal_invaders_highscore', score.toString());
      }
    }
  }, [gameState, score, highScore]);

  const handleStart = () => {
    initGame();
    setGameState('playing');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-3xl overflow-hidden font-sans"
    >
      <div className="relative w-full max-w-[400px] h-[600px] bg-[#050505] border border-blue-500/30 rounded-3xl shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black to-transparent">
          <div>
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Terminal<span className="text-blue-500">.Invaders</span></h2>
            <p className="text-[10px] text-blue-500/60 font-bold uppercase tracking-widest">Protocol: Firewall Defense</p>
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
             <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Bugs Deleted</p>
             <p className="text-3xl font-black text-white italic leading-none">{score}</p>
           </div>
           <div className="text-right space-y-1">
             <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">High Score</p>
             <p className="text-xl font-black text-blue-500 italic leading-none">{highScore}</p>
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
              <div className="w-24 h-24 bg-blue-600 rounded-2xl mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.5)] border-4 border-blue-400">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2 uppercase text-center">Захисти Термінал</h3>
              <p className="text-neutral-500 text-center text-xs font-medium uppercase tracking-widest mb-12">
                Стрілки/AD - рух<br/>Пробіл/W - Стрільба
              </p>
              <button 
                onClick={handleStart}
                className="px-12 py-4 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs skew-x-[-12deg] hover:bg-blue-500 transition-all border border-blue-400"
              >
                Launch Firewall
              </button>
            </motion.div>
          )}

          {(gameState === 'gameover' || gameState === 'won') && (
            <motion.div 
              key="gameover-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-black/80 backdrop-blur-md z-20"
            >
              <h3 className={`text-4xl font-black italic tracking-tighter mb-2 text-center uppercase ${gameState === 'won' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {gameState === 'won' ? 'System Secured' : 'System Breached'}
              </h3>
              <p className="text-neutral-500 text-center text-xs font-medium uppercase tracking-widest mb-12">
                Compiled {score} security points
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleStart}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs skew-x-[-12deg] hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs skew-x-[-12deg] hover:bg-white/10 transition-all font-mono"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_100%,100%_2px,3px_100%] z-30" />
        <div className={`absolute top-0 left-0 w-full h-1 bg-blue-500/10 blur-sm animate-scanline z-40 pointer-events-none`} />
      </div>
    </motion.div>
  );
};

export default TerminalInvadersGame;
