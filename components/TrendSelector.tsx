import React from 'react';
import { Trend } from '../types';
import { FireIcon } from './CustomIcons';

interface TrendSelectorProps {
  trends: Trend[];
  selectedId: string;
  onSelect: (trend: Trend) => void;
  isGeneratingId: string | null;
}

export const TrendSelector: React.FC<TrendSelectorProps> = ({ trends, selectedId, onSelect, isGeneratingId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {trends.map((trend) => {
        const isSelected = selectedId === trend.id;
        const isGenerating = isGeneratingId === trend.id;

        return (
          <button
            key={trend.id}
            onClick={() => onSelect(trend)}
            disabled={!!isGeneratingId}
            className={`group text-left rounded-2xl p-6 border transition-all duration-200 relative overflow-hidden flex flex-col h-64 cursor-pointer disabled:cursor-wait ${
              isSelected 
                ? 'bg-superx-cardHover border-superx-orange ring-1 ring-superx-orange/50' 
                : 'bg-superx-card border-superx-border hover:border-superx-muted hover:bg-superx-cardHover'
            }`}
          >
            {/* Generating Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-superx-card/90 z-50 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                   <div className="w-6 h-6 border-2 border-superx-orange border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-xs font-bold text-superx-orange uppercase tracking-wider">Auto-Jacking...</span>
                </div>
              </div>
            )}

            {/* Hover Action Overlay (only when not generating) */}
            {!isGenerating && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-40 backdrop-blur-[2px]">
                <span className="bg-superx-orange text-black font-bold px-4 py-2 rounded-full text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                   Click to Auto-Jack 🚀
                </span>
              </div>
            )}

            {/* Top Tag & Score */}
            <div className="flex justify-between items-start mb-auto z-10 relative">
              <span className="bg-superx-bg border border-superx-border rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-superx-muted group-hover:text-white transition-colors">
                {trend.category}
              </span>
              <div className={`flex items-center gap-1 text-xs font-mono font-bold ${
                isSelected ? 'text-superx-orange' : 'text-superx-muted'
              }`}>
                <FireIcon className="w-3 h-3" />
                {trend.viralityScore}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 mt-4">
              <h3 className={`text-xl font-bold leading-tight mb-3 line-clamp-2 ${
                isSelected ? 'text-white' : 'text-white'
              }`}>
                {trend.title}
              </h3>
              <p className="text-sm text-superx-muted line-clamp-3 leading-relaxed">
                {trend.snippet}
              </p>
            </div>

            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-tr from-superx-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isSelected ? 'opacity-100' : ''}`} />
          </button>
        );
      })}
    </div>
  );
};