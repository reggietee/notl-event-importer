export interface EventData {
  eventName: string;
  date: string;
  time: string;
  location: string;
  description: string;
  host: string;
  isFree: boolean;
  price: string | null;
  imageUrl: string | null;
}

export interface ScrapeResponse {
  success: boolean;
  data?: EventData;
  error?: string;
}

export interface WordPressPostResponse {
  success: boolean;
  postId?: number;
  postUrl?: string;
  error?: string;
}
