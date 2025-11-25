import React, { useState, useEffect, useCallback } from 'react';
import { Trend, GeneratedTweet, SuccessItem, Tone } from './types';
import { generateTweetFromTrend } from './services/geminiService';
import { TrendSelector } from './components/TrendSelector';
import { GeneratedTweetCard } from './components/GeneratedTweetCard';
import { SuccessFeed } from './components/SuccessFeed';
import { FireIcon, LayoutIcon, HashIcon, SettingsIcon, N8nIcon } from './components/CustomIcons';

// Expanded Data Pool for Rotation
const TREND_POOL: Trend[] = [
  // Tech & AI
  { 
    id: '1', 
    category: 'Tech Drama',
    title: 'OpenAI vs The World', 
    snippet: "Rumors are swirling about a secret 'Q*' model that just cracked encryption. Is AGI actually here, or is it just hype?", 
    viralityScore: 98 
  },
  { 
    id: '6', 
    category: 'Tech Drama',
    title: 'Apple Vision Pro Returns', 
    snippet: "Users are returning Vision Pros in droves citing headaches. Is spatial computing dead on arrival or just growing pains?", 
    viralityScore: 88 
  },
  {
    id: '10',
    category: 'Tech Drama',
    title: 'Sora 2.0 Leaks',
    snippet: "Leaked internal demos show video generation that is indistinguishable from reality. Hollywood unions are calling for an emergency meeting.",
    viralityScore: 99
  },
  {
    id: '11',
    category: 'Tech Drama',
    title: 'Devin AI Backlash',
    snippet: "The 'first AI software engineer' is facing scrutiny over staged demos. Developers are debating if AI coding tools are overhyped.",
    viralityScore: 94
  },

  // Pop Culture
  { 
    id: '2', 
    category: 'Pop Culture',
    title: 'The Taylor Swift Effect', 
    snippet: "She just boosted the NFL's viewership by 20% in a single weekend. Economists are literally studying this phenomenon.", 
    viralityScore: 92 
  },
  {
    id: '12',
    category: 'Pop Culture',
    title: 'Met Gala Theme Leak',
    snippet: "Insiders claim the next theme is 'Digital Dystopia'. Fashion twitter is already arguing about what Zendaya will wear.",
    viralityScore: 87
  },
  {
    id: '13',
    category: 'Pop Culture',
    title: 'YouTuber Boxing Chaos',
    snippet: "The latest influencer fight ended in a mass brawl. Is this the end of creator boxing or just the beginning?",
    viralityScore: 90
  },

  // Crypto
  { 
    id: '3', 
    category: 'Crypto',
    title: 'Bitcoin is acting weird', 
    snippet: "ETF approval happened, but the price tanked? The whales are playing games and retail traders are confused.", 
    viralityScore: 85 
  },
  {
    id: '14',
    category: 'Crypto',
    title: 'Solana Network Outage',
    snippet: "The network is down for the 5th time this year. DeFi degens are screaming but the price is barely moving.",
    viralityScore: 93
  },
  {
    id: '15',
    category: 'Crypto',
    title: 'Meme Coin Mania',
    snippet: "A coin based on a ham sandwich just hit $1B market cap. Are we in a supercycle or a bubble?",
    viralityScore: 96
  },

  // Gaming
  { 
    id: '4', 
    category: 'Gaming',
    title: 'GTA VI Map Leaks', 
    snippet: "Rockstar is hunting down leakers. The map size is reportedly 3x bigger than V. Gamers are losing their minds.", 
    viralityScore: 95 
  },
  {
    id: '16',
    category: 'Gaming',
    title: 'Switch 2 Delayed',
    snippet: "Nintendo reportedly pushing the next console to 2025. Stock price dips as gamers prepare for another year of waiting.",
    viralityScore: 89
  },

  // Wellness
  { 
    id: '5', 
    category: 'Wellness',
    title: 'The Ozempic Craze', 
    snippet: "Hollywood is shrinking overnight. Doctors are warning about 'Ozempic face'. Is it a miracle drug or a ticking time bomb?", 
    viralityScore: 78 
  },
  {
    id: '17',
    category: 'Wellness',
    title: 'Sleep Tourism',
    snippet: "Hotels are pivoting to 'sleep sanctuaries'. People are paying $1k/night just to get a good night's rest.",
    viralityScore: 82
  },

  // Business
  {
    id: '7',
    category: 'Business',
    title: 'Remote Work Dead?',
    snippet: "Big tech is mandating return to office. Employees are threatening to quit. The future of work is at a tipping point.",
    viralityScore: 89
  },
  {
    id: '18',
    category: 'Business',
    title: 'Nvidia Earnings Shock',
    snippet: "They just beat expectations by double digits again. Is the AI gold rush actually sustainable?",
    viralityScore: 97
  },

  // Design
  {
    id: '8',
    category: 'Design',
    title: 'Minimalism is Over',
    snippet: "Maximalism and brutalism are taking over web design. Clean lines are out, chaotic energy is in.",
    viralityScore: 75
  },
  {
    id: '19',
    category: 'Design',
    title: 'Spatial UI Standards',
    snippet: "With Vision Pro out, designers are scrambling to define 3D interface rules. Flat design is officially dead.",
    viralityScore: 84
  },

  // Marketing
  {
    id: '9',
    category: 'Marketing',
    title: 'Authenticity > Polish',
    snippet: "Gen Z is rejecting polished ads. Low-fi, shot-on-iPhone content is converting 3x better than studio productions.",
    viralityScore: 91
  },
  {
    id: '20',
    category: 'Marketing',
    title: 'TikTok Ban panic',
    snippet: "Marketers are diversifying spend as legislation looms. Where does the ad budget go if TikTok disappears?",
    viralityScore: 95
  }
];

const N8N_WEBHOOK_URL = 'https://aditya007.app.n8n.cloud/webhook-test/b632dba7-b736-4bf7-82f5-a94c440ef421';
const REFRESH_INTERVAL_SECONDS = 300; // 5 minutes

// Menu Items for Sidebar
const GENRES = [
  { id: 'all', label: 'Inspiration', icon: FireIcon },
  { id: 'Tech Drama', label: 'Tech & AI', icon: LayoutIcon },
  { id: 'Crypto', label: 'Crypto', icon: HashIcon },
  { id: 'Pop Culture', label: 'Media', icon: LayoutIcon },
  { id: 'Business', label: 'Business', icon: LayoutIcon },
  { id: 'Design', label: 'Design', icon: LayoutIcon },
  { id: 'Marketing', label: 'Marketing', icon: LayoutIcon },
];

export default function App() {
  const [activeGenre, setActiveGenre] = useState('all');
  const [currentTrends, setCurrentTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend>(TREND_POOL[0]);
  const [generatedTweet, setGeneratedTweet] = useState<GeneratedTweet | null>(null);
  const [isGeneratingId, setIsGeneratingId] = useState<string | null>(null);
  const [successHistory, setSuccessHistory] = useState<SuccessItem[]>([]);
  const [tone, setTone] = useState<Tone>('Viral');
  const [timeRemaining, setTimeRemaining] = useState(REFRESH_INTERVAL_SECONDS);

  // Function to refresh trends (pick random subset)
  const refreshTrends = useCallback(() => {
    // Shuffle array and pick first 9 items
    const shuffled = [...TREND_POOL].sort(() => 0.5 - Math.random());
    setCurrentTrends(shuffled.slice(0, 9));
    setTimeRemaining(REFRESH_INTERVAL_SECONDS);
  }, []);

  // Initial load
  useEffect(() => {
    refreshTrends();
  }, [refreshTrends]);

  // Timer Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          refreshTrends();
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshTrends]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter trends based on selected genre AND current visible trends
  const filteredTrends = activeGenre === 'all' 
    ? currentTrends 
    : currentTrends.filter(t => t.category === activeGenre || (activeGenre === 'Media' && t.category === 'Pop Culture'));

  // If filtered list is empty (bad luck with RNG), force at least one from pool to show
  const displayTrends = filteredTrends.length > 0 
    ? filteredTrends 
    : TREND_POOL.filter(t => t.category === activeGenre).slice(0, 3);

  // Trigger n8n webhook
  const triggerWebhook = async (trend: Trend, tweet: GeneratedTweet) => {
    try {
      const payload = new URLSearchParams({
        trendId: trend.id,
        title: trend.title,
        category: trend.category,
        tweet: tweet.text,
        hashtags: tweet.hashtags.join(', '),
        timestamp: new Date().toISOString()
      });

      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload
      });
      console.log('Webhook triggered successfully');
    } catch (error) {
      console.error('Webhook failed', error);
    }
  };

  const handleAutoJack = async (trendToJack?: Trend) => {
    const targetTrend = trendToJack || selectedTrend;
    
    setIsGeneratingId(targetTrend.id);
    setGeneratedTweet(null); 

    try {
      const result = await generateTweetFromTrend(targetTrend.title, targetTrend.snippet, tone);
      setGeneratedTweet(result);

      triggerWebhook(targetTrend, result);

      setTimeout(() => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.text)}`;
        window.open(url, '_blank');
      }, 800); 

      const newItem: SuccessItem = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        topicTitle: targetTrend.title,
        tweetPreview: result.text,
        stats: {
          likes: Math.floor(Math.random() * 500) + 100,
          retweets: Math.floor(Math.random() * 200) + 20,
        },
        graphicType: 'rocket'
      };
      setSuccessHistory(prev => [newItem, ...prev]);

    } catch (e) {
      console.error("Failed to jack trend", e);
    } finally {
      setIsGeneratingId(null);
    }
  };

  const handleTrendClick = (trend: Trend) => {
    setSelectedTrend(trend);
    handleAutoJack(trend);
  };

  const handleOpenTwitter = () => {
    if (!generatedTweet) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(generatedTweet.text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex h-screen bg-superx-bg text-superx-text font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-superx-border flex flex-col bg-superx-bg z-20">
        <div className="p-6 flex items-center gap-2">
           <FireIcon className="w-6 h-6 text-superx-orange" />
           <span className="font-extrabold text-xl tracking-tight">SuperX</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <div className="text-xs font-bold text-superx-muted uppercase tracking-wider px-3 mb-2">Genres</div>
          {GENRES.map((item) => {
             const Icon = item.icon;
             const isActive = activeGenre === item.id;
             return (
               <button
                 key={item.id}
                 onClick={() => setActiveGenre(item.id)}
                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                   isActive 
                    ? 'bg-superx-cardHover text-white' 
                    : 'text-superx-muted hover:text-white hover:bg-superx-card'
                 }`}
               >
                 <Icon className={`w-4 h-4 ${isActive ? 'text-superx-orange' : ''}`} />
                 {item.label}
               </button>
             );
          })}
        </nav>

        <div className="p-4 border-t border-superx-border mt-auto">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-superx-muted hover:text-white transition-colors">
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto p-8">
          
          {/* Header Area */}
          <header className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Inspiration</h1>
              <p className="text-superx-muted">Discover trending topics and instantly draft viral content.</p>
            </div>
            {/* Removed header stats */}
          </header>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Inspiration Grid (Trends) */}
            <div className="lg:col-span-8">
               <TrendSelector 
                 trends={displayTrends} 
                 selectedId={selectedTrend.id} 
                 onSelect={handleTrendClick} 
                 isGeneratingId={isGeneratingId}
               />
            </div>

            {/* Right Panel: Action & Preview */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Timer & Refresh Control - Moved to Sidebar */}
              <div className="flex items-center justify-between bg-superx-card border border-superx-border rounded-xl px-4 py-3">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-superx-orange animate-pulse"></div>
                    <span className="text-xs font-bold text-superx-muted uppercase tracking-wider">Next Refresh</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white tabular-nums">
                       {formatTime(timeRemaining)}
                    </span>
                    <button 
                      onClick={refreshTrends}
                      className="p-1.5 hover:bg-superx-cardHover rounded-md text-superx-orange transition-colors"
                      title="Refresh Now"
                    >
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                 </div>
              </div>

              {/* Auto-Jack Card */}
              <div className="bg-superx-card border border-superx-border rounded-2xl p-6 sticky top-8">
                 <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-superx-orange animate-pulse"></span>
                   AI Tweet Writer
                 </h2>
                 
                 <p className="text-sm text-superx-muted mb-6">
                   Selected Topic: <span className="text-white font-medium">{selectedTrend.title}</span>
                 </p>

                 {/* Tone Selector */}
                 <div className="mb-6">
                   <label className="text-xs text-superx-muted uppercase font-bold mb-2 block">Tone</label>
                   <div className="grid grid-cols-3 gap-2">
                     {(['Viral', 'Witty', 'Professional'] as Tone[]).map((t) => (
                       <button
                         key={t}
                         onClick={() => setTone(t)}
                         className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                           tone === t 
                           ? 'border-superx-orange bg-superx-orange/10 text-superx-orange' 
                           : 'border-superx-border bg-superx-bg text-superx-muted hover:border-superx-muted'
                         }`}
                       >
                         {t}
                       </button>
                     ))}
                   </div>
                 </div>

                 <button
                    onClick={() => handleAutoJack()}
                    disabled={!!isGeneratingId}
                    className="w-full py-3.5 bg-gradient-fire rounded-xl font-bold text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingId ? (
                      <span className="animate-pulse">Generating...</span>
                    ) : (
                      <>
                        <N8nIcon className="w-4 h-4" />
                        Auto-Jack This Trend
                      </>
                    )}
                  </button>

                  {/* Generated Result */}
                  {generatedTweet && (
                    <div className="mt-6 animate-in slide-in-from-bottom-4">
                      <GeneratedTweetCard 
                        tweet={generatedTweet} 
                        trend={selectedTrend}
                        onOpenTwitter={handleOpenTwitter}
                      />
                    </div>
                  )}
              </div>

              {/* History/Success Feed */}
              <SuccessFeed items={successHistory} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}