import FeatureGrid from "./components/FeatureGrid";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import MatrixBackground from "./components/MatrixBackground";
import ToasterMessage from "./components/ToasterMessage";

export default function Home() {
  return (
    <div className="w-full min-w-full relative min-h-screen bg-black text-white transition-all duration-300">
      <MatrixBackground />
      <div className="relative z-10 flex flex-col w-full min-h-screen items-center justify-center pt-6">
        <header className="flex w-full items-center justify-center">
          <nav className="flex w-full items-center justify-center">
            <Header />
          </nav>
        </header>
        <main className="flex-1 flex flex-col w-full items-center justify-center py-2 px-4">
          <MainContent />
        </main>
        <FeatureGrid />
        <footer className="flex w-full items-center justify-center">
          <Footer />
        </footer>
      </div>
      <ToasterMessage />
    </div>
  );
}
