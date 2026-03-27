import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import { getProducts } from "../lib/data";

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <main className="flex-1">
        <section className="px-8 py-16 bg-[#0a0a0a] text-zinc-100">
          <div className="flex items-end justify-between mb-10">
            <h1 className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-300">
              Products
            </h1>
            <span className="text-xs text-zinc-500">
              {products.length} items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-12">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group cursor-pointer product-card block"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-zinc-900 mb-6 vintage-border rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-102"
                  />
                </div>

                <div className="space-y-2">
                  <h2 className="text-sm font-light tracking-wide text-zinc-300 serif">
                    {product.name}
                  </h2>
                  <p className="text-xs text-accent/80 font-medium tracking-widest">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

