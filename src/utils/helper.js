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

export const extractBankDetails = (data) => {
  if (!data) return { accountNumber: "", ifscCode: "", branchName: "" };

  if (data.bankDetails) {
    return {
      accountNumber: data.bankDetails.accountNumber || "",
      ifscCode: data.bankDetails.ifscCode || "",
      branchName: data.bankDetails.branchName || "",
    };
  }

  if (data["bankDetails[accountNumber]"]) {
    return {
      accountNumber: data["bankDetails[accountNumber]"] || "",
      ifscCode: data["bankDetails[ifscCode]"] || "",
      branchName: data["bankDetails[branchName]"] || "",
    };
  }

  return {
    accountNumber: data.accountNumber || "",
    ifscCode: data.ifscCode || "",
    branchName: data.branchName || "",
  };
};