import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const trackingNumber = searchParams.get("trackingNumber");

    if (!trackingNumber) {
      return NextResponse.json({ error: "Tracking number is required" }, { status: 400 });
    }

    const response = await axios.get(
      `${process.env.DHL_TRACKING_API_URL}/shipments`,
      {
        params: {
          trackingNumber,
        },
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: process.env.DHL_API_KEY || "",
          password: process.env.DHL_API_SECRET || "",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to track shipment" },
      { status: 500 }
    );
  }
}

