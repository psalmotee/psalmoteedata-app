export type NetworkId = "mtn" | "airtel" | "glo" | "9mobile";

const networkPrefixes: Record<string, NetworkId> = {
  // MTN
  "0703": "mtn",
  "0704": "mtn",
  "0706": "mtn",
  "0707": "mtn",
  "0803": "mtn",
  "0806": "mtn",
  "0810": "mtn",
  "0813": "mtn",
  "0814": "mtn",
  "0816": "mtn",
  "0903": "mtn",
  "0906": "mtn",
  "0913": "mtn",
  "0916": "mtn",

  // Airtel
  "0701": "airtel",
  "0708": "airtel",
  "0802": "airtel",
  "0808": "airtel",
  "0812": "airtel",
  "0901": "airtel",
  "0902": "airtel",
  "0904": "airtel",
  "0907": "airtel",
  "0911": "airtel",
  "0912": "airtel",

  // Glo
  "0705": "glo",
  "0805": "glo",
  "0807": "glo",
  "0811": "glo",
  "0815": "glo",
  "0905": "glo",
  "0915": "glo",

  // 9mobile
  "0809": "9mobile",
  "0817": "9mobile",
  "0818": "9mobile",
  "0908": "9mobile",
  "0909": "9mobile",
};

export const getOriginalNetwork = (
  phoneNumber: string,
): NetworkId | "unknown" | null => {
  if (!/^0\d{10}$/.test(phoneNumber)) {
    return null;
  }

  return networkPrefixes[phoneNumber.substring(0, 4)] ?? "unknown";
};

export const validateNetworkForPhone = (
  phoneNumber: string,
  selectedNetwork: NetworkId,
  allowNetworkMismatch = false,
) => {
  const originalNetwork = getOriginalNetwork(phoneNumber);

  const isValidPhoneNumber = /^0\d{10}$/.test(phoneNumber);

  const isNetworkMismatch =
    isValidPhoneNumber &&
    originalNetwork !== null &&
    originalNetwork !== selectedNetwork &&
    !allowNetworkMismatch;

  return {
    isValidPhoneNumber,
    originalNetwork,
    isNetworkMismatch,
  };
};
