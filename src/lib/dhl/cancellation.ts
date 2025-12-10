import { dhlClient } from "./client";

export const cancelShipment = async (shipmentId: string) => {
  return await dhlClient.cancelShipment(shipmentId);
};

