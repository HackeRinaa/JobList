export interface UserData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  profile: {
    id: string;
    bio: string;
    phone: string;
    preferences: string[];
  } | null;
  rating: number;
  reviewCount: number;
} 