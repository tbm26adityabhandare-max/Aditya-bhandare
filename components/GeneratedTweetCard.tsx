import React from 'react';
import { GeneratedTweet, Trend } from '../types';
import { TwitterIcon, N8nIcon } from './CustomIcons';

interface GeneratedTweetCardProps {
  tweet: GeneratedTweet;
  trend: Trend;
  onOpenTwitter: () => void;
}

export const GeneratedTweetCard: React.FC<GeneratedTweetCardProps> = ({ tweet, trend, onOpenTwitter }) => {
  return (
    <div className="bg-superx-bg border border-superx-border rounded-xl p-4 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 text-superx-cardHover opacity-50 pointer-events-none">
         <TwitterIcon className="w-24 h-24" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
             <div className="w-6 h-6 rounded bg-[#1DA1F2] flex items-center justify-center text-white">
                <TwitterIcon className="w-3.5 h-3.5" />
             </div>
             <span className="text-xs font-bold text-superx-muted uppercase">Draft Preview</span>
             <div className="ml-auto text-xs font-mono text-superx-orange">
               {tweet.confidenceScore}% Viral
             </div>
        </div>

        <p className="text-sm leading-relaxed text-white whitespace-pre-wrap font-medium mb-4">
            {tweet.text}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
            {tweet.hashtags.map(tag => (
              <span key={tag} className="text-xs text-superx-orange opacity-80">{tag}</span>
            ))}
        </div>

        <div className="flex gap-2">
          {/* Open on Twitter Button */}
          <button 
            onClick={onOpenTwitter}
            className="flex-1 py-2 bg-superx-card hover:bg-superx-cardHover border border-superx-border rounded-lg text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
          >
            <TwitterIcon className="w-3 h-3 text-[#1DA1F2]" />
            Open
          </button>

          {/* Webhook Status Indicator (Visual only as it fires automatically) */}
          <div className="flex-1 py-2 bg-superx-card/50 border border-superx-border/50 rounded-lg text-xs text-superx-muted flex items-center justify-center gap-2 cursor-default">
            <N8nIcon className="w-3 h-3" />
            Sent
          </div>
        </div>
      </div>
    </div>
  );
};
