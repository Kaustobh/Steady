export type ThemeMode = 'light' | 'dark';

export type ActiveScreen = 
  | 'onboarding-welcome'
  | 'onboarding-roles'
  | 'onboarding-prefs'
  | 'home'
  | 'breakdown'
  | 'focus'
  | 'projects'
  | 'resources'
  | 'review'
  | 'insights';

export type DomainType = string;

export type UserRole = string;

export interface UserPreferences {
  dayPredictability: 'Predictable' | 'Mixed' | 'Unpredictable';
  helpFocusArea: 'Prioritizing' | 'Staying focused' | 'Balancing responsibilities' | 'Tracking progress';
  suggestionStyle: 'Minimal' | 'Balanced' | 'Guided';
}

export interface UserProfile {
  name: string;
  roles: UserRole[];
  domains: DomainType[];
  preferences: UserPreferences;
  onboardingCompleted: boolean;
}

export interface Substep {
  id: string;
  title: string;
  isDone: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'Article' | 'Summary' | 'Book' | 'Video' | 'Clinical Guide' | 'Notes';
  isVerified: boolean;
  url?: string;
  tagBadges: string[];
  linkedProject?: string;
  // Type-specific rich input fields for higher data quality
  contentNote?: string;
  authorSource?: string;
  readingTimeMins?: number;
  timecode?: string;
}

export interface InterruptionLog {
  id: string;
  timestamp: string;
  reason: 'Urgent work' | 'Not enough clarity' | 'Lost focus' | 'External distraction';
}

export interface Task {
  id: string;
  title: string;
  domain: DomainType;
  durationMins: number;
  energyLevel: 'Low' | 'Medium' | 'High';
  priorityScore: number; // 0-100
  status: 'pending' | 'active' | 'deferred' | 'completed';
  whyNow: string;
  substeps: Substep[];
  resources: Resource[];
  interruptions: InterruptionLog[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  domain: DomainType;
  progress: number; // 0 - 100
  nextMilestone: string;
  deadline?: string;
  activeTasksCount: number;
}

export interface DailyReview {
  id: string;
  date: string; // YYYY-MM-DD
  movedForward: string;
  blockedBy: string;
  tomorrowPlan: string;
  stressLevel: number; // 1 to 5
}

export interface WeeklyInsight {
  id: string;
  title: string;
  description: string;
  metric: string;
  recommendation: string;
  actionableCTA?: string;
}

export interface StorageDataExport {
  version: string;
  exportedAt: string;
  user: UserProfile;
  tasks: Task[];
  projects: Project[];
  resources: Resource[];
  dailyReviews: DailyReview[];
}
