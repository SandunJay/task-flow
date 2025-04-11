export interface NavItem {
  icon: string;
  label: string;
}

export interface ProjectItem {
  id: number;
  name: string;
  icon: string;
  color: string;
  selected?: boolean;
  notifications?: number;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '📅', label: 'Calendar' },
  { icon: '📈', label: 'Reports' },
  { icon: '💬', label: 'Messages' },
  { icon: '❓', label: 'Help' }
];

export const SAMPLE_PROJECTS: ProjectItem[] = [
  { id: 1, name: 'Piper Enterprise', icon: '📄', color: '#4d6fff', selected: true, notifications: 3 },
  { id: 2, name: 'Web platform', icon: '🌐', color: '#1ecbe1' },
  { id: 3, name: 'Mobile Loop', icon: '📱', color: '#6c757d', notifications: 1 },
  { id: 4, name: 'Wiro Mobile App', icon: '📱', color: '#800080' }
];
