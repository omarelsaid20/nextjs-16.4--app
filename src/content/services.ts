import {
  MonitorPlay,
  Presentation,
  ScanSearch,
  type LucideIcon,
} from 'lucide-react';
import type { AppPathname } from './site';

export type ServiceId = 'consulting' | 'training' | 'elearning';

// Title and description live in Services.items.<id>.
export const services: readonly {
  id: ServiceId;
  icon: LucideIcon;
  href: AppPathname;
}[] = [
  { id: 'consulting', icon: ScanSearch, href: '/consultations' },
  { id: 'training', icon: Presentation, href: '/training' },
  { id: 'elearning', icon: MonitorPlay, href: '/training' },
];
