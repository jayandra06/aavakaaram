import axios, { AxiosInstance } from "axios";

class DHLClient {
  private client: AxiosInstance;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.apiKey = process.env.DHL_API_KEY || "";
    this.apiSecret = process.env.DHL_API_SECRET || "";
    
    this.client = axios.create({
      baseURL: process.env.DHL_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: this.apiKey,
        password: this.apiSecret,
      },
    });
  }

  async createShipment(shipmentData: any) {
    try {
      const response = await this.client.post("/shipments", shipmentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create shipment");
    }
  }

  async trackShipment(trackingNumber: string) {
    try {
      const trackingClient = axios.create({
        baseURL: process.env.DHL_TRACKING_API_URL,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: this.apiKey,
          password: this.apiSecret,
        },
      });
      
      const response = await trackingClient.get(`/shipments`, {
        params: {
          trackingNumber,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to track shipment");
    }
  }

  async cancelShipment(shipmentId: string) {
    try {
      await this.client.delete(`/shipments/${shipmentId}`);
      return { success: true };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to cancel shipment");
    }
  }
}

export const dhlClient = new DHLClient();

