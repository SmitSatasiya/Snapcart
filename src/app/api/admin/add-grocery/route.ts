import { auth } from "@/src/auth";
import uploadOnCloudinary from "@/src/lib/cloudinary";
import connectDb from "@/src/lib/db";
import Grocery from "@/src/model/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are not Admin" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;
    let imageUrl;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageUrl = await uploadOnCloudinary(buffer);
    }

    const grocery = await Grocery.create({
      name,
      price,
      category,
      unit,
      imag: imageUrl,
    });
    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `add grocery error ${error}` },
      { status: 500 },
    );
  }
}
