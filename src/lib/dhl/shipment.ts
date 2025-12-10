import { dhlClient } from "./client";
import { Address, Order } from "@/types";

export interface ShipmentRequest {
  plannedShippingDateAndTime: {
    plannedShippingDate: string;
  };
  pickup: {
    isRequested: boolean;
  };
  productCode: string;
  accounts: Array<{
    number: string;
  }>;
  valueAddedServices?: Array<{
    serviceCode: string;
  }>;
  customerDetails: {
    shipperDetails: {
      postalAddress: {
        postalCode: string;
        cityName: string;
        countryCode: string;
        addressLine1: string;
        addressLine2?: string;
        stateOrProvinceCode?: string;
      };
      contactInformation: {
        phone: string;
        companyName: string;
        fullName: string;
      };
    };
    receiverDetails: {
      postalAddress: {
        postalCode: string;
        cityName: string;
        countryCode: string;
        addressLine1: string;
        addressLine2?: string;
        stateOrProvinceCode?: string;
      };
      contactInformation: {
        phone: string;
        companyName?: string;
        fullName: string;
      };
    };
  };
  content: {
    packages: Array<{
      weight: number;
      dimensions?: {
        length: number;
        width: number;
        height: number;
      };
    }>;
  };
}

export const createShipment = async (
  order: Order,
  shipperAddress: Address,
  receiverAddress: Address
) => {
  const shipmentData: ShipmentRequest = {
    plannedShippingDateAndTime: {
      plannedShippingDate: new Date().toISOString().split("T")[0],
    },
    pickup: {
      isRequested: false,
    },
    productCode: receiverAddress.country === "IN" ? "N" : "P", // N for domestic, P for international
    accounts: [],
    customerDetails: {
      shipperDetails: {
        postalAddress: {
          postalCode: shipperAddress.pincode,
          cityName: shipperAddress.city,
          countryCode: shipperAddress.country === "India" ? "IN" : shipperAddress.country,
          addressLine1: shipperAddress.addressLine1,
          addressLine2: shipperAddress.addressLine2,
          stateOrProvinceCode: shipperAddress.state,
        },
        contactInformation: {
          phone: shipperAddress.phone,
          companyName: "AavaKaaram",
          fullName: shipperAddress.name,
        },
      },
      receiverDetails: {
        postalAddress: {
          postalCode: receiverAddress.pincode,
          cityName: receiverAddress.city,
          countryCode: receiverAddress.country === "India" ? "IN" : receiverAddress.country,
          addressLine1: receiverAddress.addressLine1,
          addressLine2: receiverAddress.addressLine2,
          stateOrProvinceCode: receiverAddress.state,
        },
        contactInformation: {
          phone: receiverAddress.phone,
          fullName: receiverAddress.name,
        },
      },
    },
    content: {
      packages: [
        {
          weight: Math.max(1, Math.ceil(order.items.length * 0.5)), // Estimate weight
          dimensions: {
            length: 20,
            width: 15,
            height: 10,
          },
        },
      ],
    },
  };

  return await dhlClient.createShipment(shipmentData);
};

