import { Outfit, Readex_Pro } from 'next/font/google';

export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const readexPro = Readex_Pro({
  subsets: ['arabic'],
  variable: '--font-readex-pro',
  display: 'swap',
});
