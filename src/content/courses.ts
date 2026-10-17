import type { StaticImageData } from 'next/image';
import course from '@/assets/images/course.png';

export type CourseId =
  | 'esgRisk'
  | 'dataAnalysis'
  | 'teamLeadership'
  | 'financeForNonFinancial'
  | 'communication'
  | 'timeManagement';

// Text lives in Courses.items.<id>.
export const courses: readonly { id: CourseId; image: StaticImageData }[] = [
  { id: 'esgRisk', image: course },
  { id: 'dataAnalysis', image: course },
  { id: 'teamLeadership', image: course },
  { id: 'financeForNonFinancial', image: course },
  { id: 'communication', image: course },
  { id: 'timeManagement', image: course },
];
