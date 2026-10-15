import { Readex_Pro } from 'next/font/google';

// One variable family for Arabic and Latin, self-hosted by next/font at build time.
export const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  variable: '--font-readex-pro',
  display: 'swap',
});
