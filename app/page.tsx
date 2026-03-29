import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <main className="flex-1">
        <Hero />
        <ProductGrid />
        <Footer />
      </main>
    </div>
  );
}



