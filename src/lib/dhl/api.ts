// Client-side DHL API helpers that call Next.js API routes

export const createShipmentAPI = async (shipmentData: any) => {
  const response = await fetch("/api/dhl/shipment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shipmentData }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create shipment");
  }

  return response.json();
};

export const trackShipmentAPI = async (trackingNumber: string) => {
  const response = await fetch(`/api/dhl/tracking?trackingNumber=${trackingNumber}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to track shipment");
  }

  return response.json();
};

export const cancelShipmentAPI = async (shipmentId: string) => {
  const response = await fetch(`/api/dhl/cancel?shipmentId=${shipmentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to cancel shipment");
  }

  return response.json();
};

