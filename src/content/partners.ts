import type { StaticImageData } from 'next/image';
import bsi from '@/assets/partners/bsi.svg';
import nec from '@/assets/partners/nec.svg';
import tvtc from '@/assets/partners/tvtc.svg';

export type PartnerId = 'bsi' | 'nec' | 'tvtc';

// The partner's name (also the logo's alt text) lives in Partners.items.<id>.
export const partners: readonly { id: PartnerId; logo: StaticImageData }[] = [
  { id: 'bsi', logo: bsi },
  { id: 'nec', logo: nec },
  { id: 'tvtc', logo: tvtc },
];
