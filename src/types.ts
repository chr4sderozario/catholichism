export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  streakCount: number;
  lastReadDate?: string; // ISO date
  lastPrayedDate?: string; // ISO date
  totalPrayers: number;
  totalVerses: number;
  points: number;
}

export interface Candle {
  id: string;
  uid: string;
  userName: string;
  intention: string;
  createdAt: number; // timestamp
}

export interface Prayer {
  id: string;
  uid: string;
  userName: string;
  content: string;
  prayedBy: string[]; // array of UIDs
  createdAt: number;
}

export interface Question {
  id: string;
  uid: string;
  userName: string;
  text: string;
  answers: Answer[];
  createdAt: number;
}

export interface Answer {
  id: string;
  uid: string;
  userName: string;
  text: string;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  uid: string;
  content: string;
  type: 'reflection' | 'prayer' | 'confession';
  createdAt: number;
}

export interface CalendarEvent {
  id: string;
  uid: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'reminder' | 'feast' | 'prayer';
  createdAt: number;
}

export interface SupportCircle {
  id: string;
  name: string;
  topic: string;
  description: string;
  members: string[];
}

export interface Message {
  id: string;
  uid: string;
  userName: string;
  text: string;
  createdAt: number;
}

export interface BibleVerse {
  reference: string;
  text: string;
  mood: string[];
}
