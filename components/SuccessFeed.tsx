import React from 'react';
import { SuccessItem } from '../types';
import { RocketIcon, PulseIcon, CrownIcon, N8nIcon } from './CustomIcons';

interface SuccessFeedProps {
  items: SuccessItem[];
}

export const SuccessFeed: React.FC<SuccessFeedProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="mt-8 text-center p-8 border border-dashed border-white/10 rounded-2xl text-muted">
        <p className="text-sm">No viral jacks yet. Start the engine above.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
        <span className="text-neon-green">●</span> Recent Successes
      </h3>
      
      <div className="grid gap-4">
        {items.map((item) => {
          const Graphic = item.graphicType === 'rocket' ? RocketIcon : item.graphicType === 'pulse' ? PulseIcon : CrownIcon;
          
          return (
            <div 
              key={item.id}
              className="group bg-card hover:bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 flex gap-4 transition-all duration-300 hover:border-neon-cyan/30 hover:shadow-lg animate-in slide-in-from-bottom-2"
            >
              {/* Graphic container */}
              <div className="shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[rgba(0,240,255,0.1)] to-[rgba(255,77,224,0.05)] border border-neon-cyan/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Graphic className="w-8 h-8 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-text truncate pr-4">{item.topicTitle}</h4>
                  <span className="text-[10px] text-neon-green font-mono border border-neon-green/30 px-2 py-0.5 rounded bg-neon-green/10 flex items-center gap-1">
                    SUCCESS ✓
                  </span>
                </div>
                
                <p className="text-sm text-muted mt-1 line-clamp-1 italic opacity-80">
                  "{item.tweetPreview}"
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1 text-neon-magenta">
                       ♥ {item.stats.likes}
                    </span>
                    <span className="flex items-center gap-1 text-neon-cyan">
                       ↻ {item.stats.retweets}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-50">
                    <N8nIcon className="w-3 h-3" />
                    <span>Run ID: {item.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
