import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipmentData } = body;

    const response = await axios.post(
      `${process.env.DHL_API_BASE_URL}/shipments`,
      shipmentData,
      {
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
      { error: error.response?.data?.message || "Failed to create shipment" },
      { status: 500 }
    );
  }
}

