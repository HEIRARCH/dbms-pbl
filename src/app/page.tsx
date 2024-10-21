// /app/page.tsx
import HeroSection from './components/HeroSection'; // Assuming you have uploaded this
import Footer from './components/Footer'; // Assuming you have uploaded this
import Header from './components/Header';

export default function Home() {
  return (
    <main>
      {/* Hero Section - This is usually the first section of the homepage */}
      <Header />
      <HeroSection />
      

      <Footer />
    </main>
  );
}
