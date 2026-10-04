export interface AgendaSession {
  id: string;
  time: string;
  title: string;
  description: string;
  period: 'morning' | 'afternoon';
  category: 'opening' | 'keynote' | 'panel' | 'break' | 'implementation' | 'action' | 'closing' | 'networking';
  tag: string;
  strategicTrack?: string;
  speakerHint?: string;
}

export interface SpeakerProfile {
  id: string;
  name: string;
  role: string;
  organization: string;
  topic: string;
  category: 'keynote' | 'government' | 'technology' | 'startup' | 'creator';
  bio: string;
  avatarGradient: string;
}

export interface TrackTopic {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  colSpan: string; // for bento grid
  iconName: string;
  accent: 'blue' | 'magenta' | 'gradient';
}

export interface StrategicProblem {
  id: string;
  title: string;
  description: string;
}

export interface DeliverableItem {
  id: number;
  title: string;
  description: string;
}

export interface WhoIsInTheRoomGroup {
  category: 'Decision-Makers' | 'Builders';
  stakeholders: string[];
}

export interface PartnershipTier {
  tier: string;
  included: string;
  availability: 'By invitation' | 'Limited' | 'Open';
}

export interface DelegatePassTier {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
}

export interface CongressInsight {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
}

export interface PartnerLogo {
  name: string;
  tier: string;
  category: string;
}
