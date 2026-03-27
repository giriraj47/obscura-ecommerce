"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    id: "",
    _id: "",
    name: "",
    price: "",
    description: "",
    images: "", // comma separated
    image: "", // fallback
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error("Failed to fetch products", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (product: any) => {
    setIsEditing(true);
    setFormData({
      id: product.id || "",
      _id: product._id,
      name: product.name || "",
      price: product.price?.toString() || "",
      description: product.description || "",
      images: Array.isArray(product.images) ? product.images.join(", ") : "",
      image: product.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({ id: "", _id: "", name: "", price: "", description: "", images: "", image: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Product deleted");
        fetchProducts(); // Refresh
      } else {
        alert("Failed to delete product");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert comma-separated string to array
    const parsedImages = formData.images
      ? formData.images.split(",").map(url => url.trim()).filter(url => url.length > 0)
      : [];

    const payload: any = {
      name: formData.name,
      price: Number(formData.price) || formData.price, // try number, fallback to string
      description: formData.description,
      images: parsedImages,
      image: formData.image || (parsedImages.length > 0 ? parsedImages[0] : ""),
    };
    
    // Only pass custom string id if filled, else db generates ObjectId
    if (formData.id) payload.id = formData.id;

    try {
      if (isEditing) {
        payload._id = formData._id;
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (res.ok) {
          alert("Product successfully updated!");
          cancelEdit();
          fetchProducts();
        } else {
          alert("Failed to update product");
        }
      } else {
        // Create new
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (res.ok) {
          alert("Product successfully created!");
          cancelEdit(); // Reset form
          fetchProducts();
        } else {
          alert("Failed to create product");
        }
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred preserving the product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
          <h1 className="text-xl font-medium uppercase tracking-[0.3em] text-white">Database Operations</h1>
          <Link href="/" className="text-xs tracking-widest text-zinc-500 hover:text-white transition">
            ← BACK TO STOREFRONT
          </Link>
        </header>

        {/* Product Submission Form */}
        <section className="bg-zinc-900 border border-zinc-800 rounded p-6">
          <h2 className="text-sm uppercase tracking-widest text-zinc-100 mb-6">
            {isEditing ? "Edit Product" : "Create New Product"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Price</label>
                <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Custom String ID (Optional: leave blank for auto-generate)</label>
              <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="e.g. vintage-lace-corset" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Images Array (Comma Separated URLs)</label>
              <input type="text" name="images" value={formData.images} onChange={handleChange} placeholder="https://image1.jpg, https://image2.jpg" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
            </div>

            <div className="flex gap-4 pt-2">
              <button type="submit" className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-zinc-200 transition">
                {isEditing ? "Save Changes" : "Create Product"}
              </button>
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="px-6 py-2 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest rounded hover:bg-zinc-800 transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Product List Table */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm uppercase tracking-widest text-zinc-100">Live Database Items</h2>
            <button onClick={fetchProducts} className="text-xs tracking-widest text-zinc-500 hover:text-white transition">
              REFRESH
            </button>
          </div>

          {isLoading ? (
            <div className="text-xs text-zinc-500 uppercase tracking-widest">Loading database...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-xs uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-4 font-normal">Object _ID</th>
                    <th className="py-4 px-4 font-normal">Name</th>
                    <th className="py-4 px-4 font-normal">Price</th>
                    <th className="py-4 px-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-zinc-900/50 transition">
                      <td className="py-4 px-4 text-zinc-500 font-mono text-xs">{p._id}</td>
                      <td className="py-4 px-4 text-zinc-200">{p.name}</td>
                      <td className="py-4 px-4 text-zinc-400">{p.price}</td>
                      <td className="py-4 px-4 text-right space-x-4">
                        <button onClick={() => handleEdit(p)} className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition">Edit</button>
                        <button onClick={() => handleDelete(p._id)} className="text-xs uppercase tracking-widest text-red-500 hover:text-red-400 transition">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-500 text-xs tracking-widest uppercase">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
