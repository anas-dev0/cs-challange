/**
 * ProgressBar Component
 * Animated progress bar for loading states
 */

interface ProgressBarProps {
  isActive: boolean;
}

export default function ProgressBar({ isActive }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div className={`h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 ${isActive ? 'animate-shimmer' : ''}`} style={{ width: '100%' }} />
    </div>
  );
}
