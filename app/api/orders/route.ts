import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const orders = await db.collection("orders").find({ userId }).sort({ createdAt: -1 }).toArray();

    return Response.json(orders);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { products, totalAmount } = await req.json();

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const newOrder = {
      userId,
      products: products.map((p: any) => ({
        productId: p.productId || p.id,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(newOrder);

    // After order placement, we should clear their active cart
    await db.collection("carts").deleteOne({ userId });

    return Response.json({ success: true, orderId: result.insertedId });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
