
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Settings, Play, Pause, RotateCcw, Coffee, Brain, Info, Volume2, VolumeX } from 'lucide-react';
import { TimerMode, TimerSettings, MODE_COLORS } from './types';
import SettingsModal from './components/SettingsModal';
import { fetchMotivationalTip } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [settings, setSettings] = useState<TimerSettings>({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartFocus: false
  });
  
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiTip, setAiTip] = useState("Your productivity sanctuary awaits.");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Refs
  // Use any for timerRef to avoid NodeJS namespace issues in browser environment.
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Constants
  const currentModeColor = MODE_COLORS[mode];

  // Logic: Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    refreshTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Logic: Refresh Tip
  const refreshTip = async () => {
    const tip = await fetchMotivationalTip(mode);
    setAiTip(tip);
  };

  // Logic: Timer Tick
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft]);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio error:', e));
    }

    if (mode === 'focus') {
      const newSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(newSessionCount);
      
      const nextMode = newSessionCount % 4 === 0 ? 'longBreak' : 'shortBreak';
      switchMode(nextMode, settings.autoStartBreaks);
    } else {
      switchMode('focus', settings.autoStartFocus);
    }
    refreshTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sessionsCompleted, settings, isMuted]);

  const switchMode = (newMode: TimerMode, autoStart: boolean = false) => {
    setMode(newMode);
    let minutes = settings.focusTime;
    if (newMode === 'shortBreak') minutes = settings.shortBreakTime;
    if (newMode === 'longBreak') minutes = settings.longBreakTime;
    
    setTimeLeft(minutes * 60);
    setIsActive(autoStart);
    if (!autoStart) refreshTip();
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    let minutes = settings.focusTime;
    if (mode === 'shortBreak') minutes = settings.shortBreakTime;
    if (mode === 'longBreak') minutes = settings.longBreakTime;
    setTimeLeft(minutes * 60);
  };

  const handleSaveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
    
    // Update current time if timer is not running
    if (!isActive) {
      let minutes = newSettings.focusTime;
      if (mode === 'shortBreak') minutes = newSettings.shortBreakTime;
      if (mode === 'longBreak') minutes = newSettings.longBreakTime;
      setTimeLeft(minutes * 60);
    }
  };

  // Formatting
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress Circle Calc
  const totalSeconds = (mode === 'focus' ? settings.focusTime : (mode === 'shortBreak' ? settings.shortBreakTime : settings.longBreakTime)) * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`min-h-screen transition-colors duration-700 flex flex-col items-center justify-center p-6 ${currentModeColor.bg}`}>
      
      {/* Header Info */}
      <div className="absolute top-8 w-full max-w-lg flex justify-between items-center px-4">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.open('https://en.wikipedia.org/wiki/Pomodoro_Technique', '_blank')}>
          <Info className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300" />
          <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest">ZenTime v1.0</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Controller */}
      <div className="w-full max-w-md bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 blur-[80px] opacity-20 transition-colors duration-700 ${currentModeColor.text.replace('text', 'bg')}`}></div>
        
        {/* Tab Switcher */}
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl mb-12 relative z-10">
          {[
            { id: 'focus', icon: Brain, label: 'Focus' },
            { id: 'shortBreak', icon: Coffee, label: 'Short Break' },
            { id: 'longBreak', icon: Coffee, label: 'Long Break' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => switchMode(tab.id as TimerMode)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                mode === tab.id 
                  ? `${currentModeColor.button} text-white shadow-lg shadow-${currentModeColor.accent}/20` 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative flex justify-center items-center mb-12 select-none">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-zinc-900"
            />
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              style={{ strokeDashoffset: offset }}
              className={`${currentModeColor.text} transition-all duration-300 ease-out progress-ring`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-6xl font-bold mono tracking-tighter ${currentModeColor.text}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] mt-2">
              {isActive ? 'Session Active' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6 relative z-10">
          <button 
            onClick={resetTimer}
            className="p-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-2xl transition-all transform active:scale-95 group"
            title="Reset Timer"
          >
            <RotateCcw className="w-6 h-6 group-hover:rotate-[-45deg] transition-transform" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 flex items-center justify-center rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-xl ${currentModeColor.button}`}
          >
            {isActive ? (
              <Pause className="w-10 h-10 text-white fill-white" />
            ) : (
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            )}
          </button>

          <div className="p-4 bg-zinc-900 text-zinc-400 rounded-2xl flex flex-col items-center justify-center min-w-[72px]">
            <span className="text-[10px] font-bold uppercase text-zinc-600 mb-1">Focus</span>
            <span className={`text-xl font-bold mono ${currentModeColor.text}`}>{sessionsCompleted}</span>
          </div>
        </div>
      </div>

      {/* AI Quote Section */}
      <div className="mt-12 w-full max-w-lg px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-block px-3 py-1 bg-zinc-900/50 border border-white/5 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
          AI Productivity Insight
        </div>
        <p className="text-xl font-medium text-zinc-300 leading-relaxed italic">
          "{aiTip}"
        </p>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto pb-8 text-zinc-600 text-sm font-medium">
        Designed for Deep Focus & Clarity
      </div>

      {/* Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default App;
