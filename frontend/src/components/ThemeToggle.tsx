import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:shadow-md"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
          theme === 'light'
            ? 'bg-white translate-x-0'
            : 'bg-yellow-400 translate-x-8'
        }`}
      >
        {theme === 'light' ? (
          <Moon className="w-3 h-3 text-gray-600" />
        ) : (
          <Sun className="w-3 h-3 text-white" />
        )}
      </div>
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <Moon className={`w-3 h-3 ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`} />
        <Sun className={`w-3 h-3 ${theme === 'light' ? 'text-yellow-500' : 'text-yellow-400'}`} />
      </div>
    </button>
  );
}