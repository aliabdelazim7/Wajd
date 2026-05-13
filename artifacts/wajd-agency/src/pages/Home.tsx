import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import MarqueeTicker from "@/components/MarqueeTicker";
import StoryScene from "@/components/StoryScene";
import Services from "@/components/Services";
import AIExperience from "@/components/AIExperience";
import SimulateBrand from "@/components/SimulateBrand";
import BeforeAfter from "@/components/BeforeAfter";
import Portfolio from "@/components/Portfolio";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      <Navbar />
      <main>
        <section id="hero">
          <Hero />
        </section>

        <StatsBar />
        <MarqueeTicker />

        <section id="story">
          <StoryScene />
        </section>

        <Services />

        <section id="ai-experience">
          <AIExperience />
        </section>
        <section id="before-after">
          <BeforeAfter />
        </section>
        <section id="simulate">
          <SimulateBrand />
        </section>
        <section id="portfolio">
          <Portfolio />
        </section>
        <section id="cta">
          <FinalCTA />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
