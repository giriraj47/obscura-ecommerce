import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import { getProductById, getProducts } from "../../lib/data";
import ProductGallery from "../../components/ProductGallery";
import ProductActions from "../../components/ProductActions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const similar = allProducts.filter((p) => String(p.id) !== String(product.id));

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <main className="flex-1">
        <section className="px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Link
                href="/products"
                className="inline-flex items-center text-xs uppercase tracking-widest text-zinc-500 hover:text-black"
              >
                ← Back to products
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              {/* Left: image area (Carousel Gallery) */}
              <div className="h-full">
                <ProductGallery images={[product.image]} productName={product.name} />
              </div>

              {/* Right: product info */}
              <div className="lg:pl-8">
                <div className="border-b border-zinc-200 pb-6 mb-6">
                  <h1 className="text-xl md:text-2xl font-medium mb-1 serif">
                    {product.name}
                  </h1>
                  <p className="text-sm text-zinc-700 font-medium">
                    {product.price}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Sizes */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                      Sizes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["S", "M", "L", "XL"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="px-4 py-2 text-xs border border-zinc-300 hover:border-zinc-700 hover:text-zinc-900 bg-white rounded-sm"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <a
                        href="#"
                        className="text-[11px] text-zinc-500 hover:text-zinc-900 underline underline-offset-4"
                      >
                        SIZE GUIDE
                      </a>
                    </div>
                  </div>

                  {/* Fabric */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                      Fabric
                    </p>
                    <p className="text-sm text-zinc-900 font-medium mb-2">
                      COTTON
                    </p>
                    <div className="inline-flex items-center px-3 py-2 text-xs border border-zinc-300 rounded-sm">
                      COTTON
                    </div>
                  </div>

                  {/* CTA row */}
                  <ProductActions product={product} />

                  {/* Description */}
                  <div>
                    <p className="text-[12px] leading-6 text-zinc-600">
                      {product.description}
                    </p>
                  </div>

                  {/* Accordions */}
                  <div className="space-y-2">
                    <details className="border-t border-zinc-200 pt-4">
                      <summary className="list-none cursor-pointer flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-zinc-600">
                        <span>Delivery time</span>
                        <span className="text-zinc-900">+</span>
                      </summary>
                      <div className="mt-3 text-sm text-zinc-600">
                        Ships in 1-2 business days. Delivery in 2-5 business
                        days.
                      </div>
                    </details>

                    <details className="border-t border-zinc-200 pt-4">
                      <summary className="list-none cursor-pointer flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-zinc-600">
                        <span>Assistance</span>
                        <span className="text-zinc-900">+</span>
                      </summary>
                      <div className="mt-3 text-sm text-zinc-600">
                        Need help selecting a size or styling? Contact us and we
                        will respond shortly.
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar products */}
            <section className="mt-14">
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-900">
                  Similar products
                </h2>
                <span className="text-xs text-zinc-500">
                  {similar.length} shown
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {similar.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-3/4 overflow-hidden bg-zinc-100 border border-zinc-200 rounded-lg mb-4">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-light tracking-wide text-zinc-900 serif">
                        {p.name}
                      </h3>
                      <p className="text-xs text-accent/80 font-medium tracking-widest">
                        {p.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

