export type ActiveView = 'login' | 'register' | 'forgot' | 'dashboard';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
  current_participants: number;
}