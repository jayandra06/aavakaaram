import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shipmentId = searchParams.get("shipmentId");

    if (!shipmentId) {
      return NextResponse.json({ error: "Shipment ID is required" }, { status: 400 });
    }

    await axios.delete(`${process.env.DHL_API_BASE_URL}/shipments/${shipmentId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: process.env.DHL_API_KEY || "",
        password: process.env.DHL_API_SECRET || "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to cancel shipment" },
      { status: 500 }
    );
  }
}

