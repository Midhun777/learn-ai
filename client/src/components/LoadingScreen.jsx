import { useState, useEffect } from 'react';
import { Sparkles, Brain } from 'lucide-react';

const quotes = [
    'Initializing Neural Hub...',
    'Architecting Schematics...',
    'Syncing Master Database...',
    'Optimizing Cognitive Paths...',
    'Interface Synchronized.',
];

const LoadingScreen = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % quotes.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10 relative overflow-hidden">
            {/* Fluid Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/5 rounded-full blur-[140px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-secondary/5 rounded-full blur-[120px] [animation-delay:2s] animate-pulse"></div>

            {/* Modern AI Loader */}
            <div className="relative mb-20 w-40 h-40 flex items-center justify-center">
                {/* Orbital Rings */}
                <div className="absolute w-full h-full border-4 border-brand-primary/10 rounded-full animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute w-32 h-32 border-4 border-brand-secondary/20 rounded-full animate-[spin_12s_linear_infinite_reverse] border-t-brand-secondary"></div>

                {/* Center Core */}
                <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[40px] flex items-center justify-center shadow-glow animate-float">
                    <Brain className="w-12 h-12 text-white animate-pulse" />
                </div>
            </div>

            <div className="text-center relative z-10">
                <div className="h-10 mb-10 overflow-hidden">
                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Loading LearnAI...</h2>
                    <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.3em] mb-12">System Initialization</p>
                </div>

                {/* Premium Progress Meter */}
                <div className="flex flex-col items-center">
                    <div className="w-72 h-3 bg-slate-50 border border-slate-100 rounded-pill overflow-hidden shadow-soft mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-1000 ease-in-out shadow-glow"
                            style={{ width: `${((index + 1) / quotes.length) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">LEARN.AI_QUANTUM_CORE</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
