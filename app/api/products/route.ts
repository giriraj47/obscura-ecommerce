import clientPromise from "@/app/lib/mongodb";
import { Product } from "@/types/product";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("ecommerce");

  const products = await db
    .collection<Product>("products")
    .find({})
    .toArray();

  return Response.json(products);
}

export async function POST(req: Request) {
  const body: Product = await req.json();

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const result = await db.collection<Product>("products").insertOne({
    ...body,
    createdAt: new Date(),
  });

  return Response.json({ insertedId: result.insertedId });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, _id, ...updateData } = body;
    
    const targetId = _id || id;
    if (!targetId) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const { ObjectId } = require("mongodb");
    
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(targetId) },
      { $set: updateData }
    );

    return Response.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return Response.json({ error: "Product ID is required. Pass it like ?id=123" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const { ObjectId } = require("mongodb");
    
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    return Response.json({ success: true, deletedCount: result.deletedCount });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}