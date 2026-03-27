import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ items: [] }); // return empty cart if not authed
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const cart = await db.collection("carts").findOne({ userId });
    
    if (!cart) {
      return Response.json({ items: [] });
    }

    return Response.json(cart);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const cartData = {
      userId,
      items: items.map((item: any) => ({
        productId: item.productId || item.id, // map depending on frontend format
        quantity: item.quantity,
        // we can store full item data for simpler frontend rendering, matching their cart state context
        name: item.name,
        price: item.price,
        image: item.image,
      })),
      updatedAt: new Date(),
    };

    await db.collection("carts").updateOne(
      { userId },
      { $set: cartData },
      { upsert: true }
    );

    return Response.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
