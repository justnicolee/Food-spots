import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, RotateCw, Trophy, X, Pizza, Coffee, Store } from 'lucide-react';

const FOOD_SPOTS = [
  { name: 'Jaja', color: '#FFADAD' },
  { name: 'New Hall Amala', color: '#FFD6A5' },
  { name: 'Korede Spaghetti', color: '#FDFFB6' },
  { name: 'Faculty of Arts', color: '#9BF6FF' },
  { name: 'Cook Indomie', color: '#BDB2FF' },
];

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const numSlices = FOOD_SPOTS.length;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowWinner(false);
    setWinner(null);

    // Calculate a random rotation
    // Add multiple full spins (5-10) for drama
    const fullSpins = 5 + Math.floor(Math.random() * 5);
    const randomOffset = Math.floor(Math.random() * 360);
    const newRotation = rotation + (fullSpins * 360) + randomOffset;
    
    setRotation(newRotation);

    // After the animation duration (e.g., 5s), calculate result
    setTimeout(() => {
      setIsSpinning(false);
      
      // Calculate which slice it landed on
      // The arrow points at the top (270 degrees in SVG coordinate space if Jaja starts at 0)
      // Actually, easier to think relative to the rotation.
      // Final rotation % 360 tells us where we are.
      // The indicator is at the top (0 degrees or 360).
      // If result is 0, the very first slice (Jaja) is at the top.
      // But SVG rotation goes clockwise. 
      // If we rotate the wheel by R, the item that was at -R (or 360-R) is now at the top.
      const actualRotation = newRotation % 360;
      const winningIndex = Math.floor((360 - actualRotation) / sliceAngle) % numSlices;
      
      setWinner(FOOD_SPOTS[winningIndex].name);
      setShowWinner(true);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 font-sans text-slate-900 overflow-hidden">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 border-r-2 border-b-2 border-slate-900 -translate-x-12 -translate-y-12 rotate-12" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border-l-2 border-t-2 border-slate-900 translate-x-24 translate-y-24 -rotate-12" />
      </div>

      <header className="mb-8 text-center z-10">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-widest uppercase mb-4"
        >
          <Utensils size={14} />
          UNILAG Dining Router
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase"
        >
          Sp<span className="text-emerald-500">i</span>n the Wheel
        </motion.h1>
      </header>

      <main className="relative flex flex-col items-center justify-center w-full max-w-2xl px-4 z-10">
        {/* The Wheel Container */}
        <div className="relative mb-12 group">
          {/* Static Pointer */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
            <motion.div 
              animate={isSpinning ? { y: [0, -4, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-slate-900 drop-shadow-lg"
            />
          </div>

          {/* Wheel Shadow */}
          <div className="absolute inset-0 translate-y-4 bg-slate-900/10 rounded-full blur-xl" />

          {/* Actual Rotating Wheel */}
          <motion.div
            ref={wheelRef}
            animate={{ rotate: rotation }}
            transition={{
              duration: 5,
              ease: [0.2, 0, 0.1, 1], // Custom realistic deceleration
            }}
            className="w-[320px] h-[320px] md:w-[450px] md:h-[450px] rounded-full border-8 border-slate-900 bg-white relative overflow-hidden shadow-2xl flex items-center justify-center pointer-events-none"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {FOOD_SPOTS.map((spot, i) => {
                const startAngle = (i * 360) / numSlices;
                const endAngle = ((i + 1) * 360) / numSlices;
                
                // SVG Path for slice
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                
                return (
                  <g key={spot.name}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={spot.color}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    {/* Text logic */}
                    <text
                      x="75"
                      y="50"
                      fill="#0f172a"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${startAngle + sliceAngle / 2}, 50, 50)`}
                      className="drop-shadow-sm select-none"
                    >
                      {spot.name}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Center Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white border-4 border-slate-900 rounded-full z-10 shadow-lg flex items-center justify-center">
                <Utensils size={24} className="text-slate-900" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Spin Button */}
        <motion.button
          id="spin-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSpin}
          disabled={isSpinning}
          className={`
            relative z-10 px-12 py-6 rounded-full font-black text-2xl uppercase tracking-wider shadow-xl transition-all
            ${isSpinning 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none translate-y-1' 
              : 'bg-emerald-500 text-white hover:bg-emerald-400 active:translate-y-1 border-b-8 border-emerald-700 hover:border-emerald-600'}
          `}
        >
          <div className="flex items-center gap-3">
            <RotateCw className={isSpinning ? 'animate-spin' : ''} size={28} />
            {isSpinning ? 'Spinning...' : 'Spin'}
          </div>
        </motion.button>
      </main>

      {/* Results Modal */}
      <AnimatePresence>
        {showWinner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50, rotate: -5 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full relative overflow-hidden shadow-2xl border-2 border-slate-100"
            >
              {/* Confetti decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
              
              <button 
                onClick={() => setShowWinner(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mb-6 text-amber-500">
                  <Trophy size={48} />
                </div>
                
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">Today's Choice</p>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                  {winner}!
                </h2>

                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => setShowWinner(false)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                  >
                    Nice! Let's Go
                  </button>
                  <button 
                    onClick={handleSpin}
                    className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCw size={18} />
                    Spin Again
                  </button>
                </div>
              </div>

              {/* Decorative background icon */}
              <Utensils className="absolute -bottom-8 -right-8 w-32 h-32 text-slate-50 opacity-50 -rotate-12 pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-12 text-slate-400 text-xs font-medium tracking-wide uppercase">
        Built for UNILAG Warriors 🇳🇬
      </footer>
    </div>
  );
}
