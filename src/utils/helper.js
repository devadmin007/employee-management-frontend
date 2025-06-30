export const parseAddress = (address) => {
  const defaultAddress = {
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  };

  if (!address) {
    return defaultAddress;
  }

  // If it's a string, try to parse it as JSON
  if (typeof address === "string") {
    try {
      return JSON.parse(address);
    } catch (error) {
      console.error("Error parsing address JSON:", error);
      return defaultAddress;
    }
  }

  // If it's already an object, return it as is
  if (typeof address === "object" && address !== null) {
    return address;
  }

  // Fallback to empty address
  return defaultAddress;
};