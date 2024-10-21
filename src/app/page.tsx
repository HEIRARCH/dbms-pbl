// /app/page.tsx
import HeroSection from './components/HeroSection';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSectionHeader from './components/HeroSectionHeader';
import LatestQuestions from './components/LatestQuestions';
import TopContributers from './components/TopContributers';


export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <Footer />
    </main>
  );
}
