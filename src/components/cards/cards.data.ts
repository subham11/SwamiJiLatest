const images = [
  "/images/inspo/ins-1.svg",
  "/images/inspo/ins-2.svg",
  "/images/inspo/ins-3.svg",
  "/images/inspo/ins-4.svg",
  "/images/inspo/ins-5.svg",
  "/images/inspo/ins-6.svg",
  "/images/inspo/ins-7.svg",
  "/images/inspo/ins-8.svg",
];

export const cards = Array.from({length: 8}).map((_,i)=> ({
  id: i+1,
  title: `Inspiration #${i+1}`,
  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae.",
  // stable pick to avoid SSR/CSR flicker; ensures card 2 => ins-2, card 3 => ins-3
  image: images[i % images.length]
}));
