import { dhlClient } from "./client";

export const trackShipment = async (trackingNumber: string) => {
  return await dhlClient.trackShipment(trackingNumber);
};

