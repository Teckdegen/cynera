import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { LogoRow } from "@/components/logo-row";
import { Stats } from "@/components/stats";
import { Story } from "@/components/story";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero />
        <LogoRow />
        <Story />
        <Stats />
      </main>
      <Footer />
    </div>
  );
}
