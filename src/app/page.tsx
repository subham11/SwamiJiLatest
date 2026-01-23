import { Hero } from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import { SacredTeachings, WordsOfWisdom, UpcomingEvents } from "@/components/DeferredSections";

export default function HomePage() {
  return (
    <main id="main-content">
      <NavBar />
      <Hero />
      <SacredTeachings />
      <WordsOfWisdom />
      <UpcomingEvents />
    </main>
  );
}
