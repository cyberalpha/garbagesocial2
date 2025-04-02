
export type WasteCategory = 
  | 'organic'
  | 'paper'
  | 'glass'
  | 'plastic'
  | 'metal'
  | 'sanitary'
  | 'dump'
  | 'various';

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  category: WasteCategory;
  title: string;
  description: string;
  imageUrl?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: string;
  status: 'available' | 'claimed' | 'collected';
  claimedBy?: string;
  claimedAt?: string;
  rating?: {
    publisher?: 'positive' | 'negative' | 'neutral';
    collector?: 'positive' | 'negative' | 'neutral';
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: 'individual' | 'organization';
  rating: {
    positive: number;
    negative: number;
    neutral: number;
  };
}
