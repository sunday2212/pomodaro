
import React from 'react';
import { TimerSettings } from '../types';
import { X, Settings2, Clock, PlayCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSave: (newSettings: TimerSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState<TimerSettings>(settings);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value) || 1
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-zinc-400" />
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Durations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Intervals (Minutes)</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Focus', name: 'focusTime' },
                { label: 'Short', name: 'shortBreakTime' },
                { label: 'Long', name: 'longBreakTime' }
              ].map(item => (
                <div key={item.name} className="space-y-2">
                  <label className="text-xs text-zinc-500 block">{item.label}</label>
                  <input
                    type="number"
                    name={item.name}
                    value={(localSettings as any)[item.name]}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Behavior */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 uppercase tracking-wider">
              <PlayCircle className="w-4 h-4" />
              <span>Automation</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Auto-start Breaks', name: 'autoStartBreaks' },
                { label: 'Auto-start Focus', name: 'autoStartFocus' }
              ].map(item => (
                <label key={item.name} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-zinc-300 group-hover:text-zinc-100 transition-colors">{item.label}</span>
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={(localSettings as any)[item.name]}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 bg-zinc-800/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(localSettings)}
            className="px-6 py-2 bg-zinc-100 text-zinc-950 rounded-lg text-sm font-bold hover:bg-white transition-all transform active:scale-95 shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
