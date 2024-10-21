import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";
import Footer from "./components/Footer";

const Page = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative">
                    <HeroSection />
                </section>

                {/* Latest Questions Section */}
                <section className="py-10 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-6">Latest Questions</h2>
                        <LatestQuestions />
                    </div>
                </section>

                {/* Top Contributors Section */}
                <section className="py-10 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-6">Top Contributors</h2>
                        <TopContributers />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Page;
