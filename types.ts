export interface Trend {
  id: string;
  category: string;
  title: string;
  snippet: string;
  viralityScore: number;
}

export interface GeneratedTweet {
  text: string;
  hashtags: string[];
  confidenceScore: number;
  tone: string;
}

export interface SuccessItem {
  id: string;
  timestamp: Date;
  topicTitle: string;
  tweetPreview: string;
  stats: {
    likes: number; // Estimated
    retweets: number; // Estimated
  };
  graphicType: 'rocket' | 'pulse' | 'crown';
}

export type Tone = 'Viral' | 'Witty' | 'Professional';