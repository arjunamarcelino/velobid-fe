import { ethers } from "ethers";
import { abi } from "./abi";

declare let window: any;

export const getProvider = () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  const signer = await provider.getSigner();

  return signer;
};

export const getContract = async () => {
  const signer = await getSigner();
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!address) {
    throw new Error(
      "Contract address is not defined in environment variables."
    );
  }

  const contract = new ethers.Contract(address, abi, signer);

  return contract;
};
