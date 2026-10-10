import hero from '@/assets/celebration-hero.jpg';
import wedding from '@/assets/wedding.jpg';
import birthday from '@/assets/birthday.jpg';
import anniversary from '@/assets/anniversary.jpg';
import baby from '@/assets/baby-shower.jpg';
import devotional from '@/assets/devotional.jpg';

const thumbs = import.meta.glob<string>('/src/assets/categories/*.webp', { eager: true, import: 'default' });
const cat = (n: number): string => thumbs[`/src/assets/categories/category-${String(n).padStart(2, '0')}.webp`] ?? hero;

// Exact order requested by the owner. Replace with real portfolio photos when supplied.
export const heroSlides: { name: string; image: string }[] = [
  { name: 'Birthday', image: birthday },
  { name: 'Baby Shower', image: baby },
  { name: 'Anniversary', image: anniversary },
  { name: 'First Night', image: cat(9) },
  { name: 'Stage Decoration', image: wedding },
  { name: 'Welcome Baby', image: cat(4) },
  { name: 'Naming Ceremony', image: cat(5) },
  { name: 'House Warming', image: cat(12) },
  { name: 'Corporate Events', image: cat(16) },
  { name: 'Car Decoration', image: cat(13) },
  { name: 'Bachelor Party', image: cat(10) },
  { name: 'Wedding', image: hero },
  { name: 'Pet Decoration', image: cat(14) },
  { name: 'Showroom Setup', image: cat(17) },
  { name: 'Grand Opening', image: cat(18) },
  { name: 'Exhibition Stall', image: cat(19) },
  { name: 'Room Surprise', image: cat(8) },
  { name: 'Farewell Party', image: cat(15) },
  { name: 'Annual Day Function', image: cat(20) },
  { name: 'Mundan Ceremony', image: devotional },
];
