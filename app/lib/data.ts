import clientPromise from "./mongodb";
import { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const client = await clientPromise;
  const db = client.db("ecommerce");
  const products = await db.collection("products").find({}).toArray();
  
  return products.map((p) => ({
    id: p.id ? String(p.id) : p._id.toString(),
    name: p.name,
    price: p.price,
    image: (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : (p.image || "https://i.pinimg.com/1200x/b0/90/09/b09009577b8a6e6b9e06b1afed851811.jpg"),
    description: p.description,
    createdAt: p.createdAt,
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const client = await clientPromise;
  const db = client.db("ecommerce");
  
  // Try to find by custom 'id' field first, then fallback to _id
  let product = await db.collection("products").findOne({ id });
  
  if (!product) {
    try {
      const { ObjectId } = require("mongodb");
      product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    } catch (e) {
      // Invalid ObjectId
    }
  }

  if (!product) return null;

  return {
    id: product.id ? String(product.id) : product._id.toString(),
    name: product.name,
    price: product.price,
    image: (Array.isArray(product.images) && product.images.length > 0) ? product.images[0] : (product.image || "https://i.pinimg.com/1200x/b0/90/09/b09009577b8a6e6b9e06b1afed851811.jpg"),
    description: product.description,
    createdAt: product.createdAt,
  };
}