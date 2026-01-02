
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
}

export interface Quote {
  text: string;
  author: string;
}

export const MODE_COLORS = {
  focus: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    accent: 'rose-500',
    button: 'bg-rose-500 hover:bg-rose-600'
  },
  shortBreak: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    accent: 'emerald-500',
    button: 'bg-emerald-500 hover:bg-emerald-600'
  },
  longBreak: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    text: 'text-sky-400',
    accent: 'sky-500',
    button: 'bg-sky-500 hover:bg-sky-600'
  }
};
