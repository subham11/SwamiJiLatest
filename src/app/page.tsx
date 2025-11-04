'use client';

import { Hero } from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import { SacredTeachings } from "@/components/SacredTeachings";
import { WordsOfWisdom } from "@/components/WordsOfWisdom";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <Hero />
      <SacredTeachings />
      <WordsOfWisdom />
      <UpcomingEvents />
      <Footer />
    </main>
  );
}
