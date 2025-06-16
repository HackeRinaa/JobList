import { JobCategory } from './prisma';

export interface UserData {
  user: {
    id: string;
    name: string;
    email: string;
    tokens: number;
  };
  profile: {
    id: string;
    bio: string;
    phone: string;
    preferences: JobCategory[];
    imageUrl?: string;
  } | null;
  rating: number;
  reviewCount: number;
} 