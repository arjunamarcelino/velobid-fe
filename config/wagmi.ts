import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  sepolia,
  polygon,
  optimism,
  arbitrum,
  base,
} from "wagmi/chains";

const educhainTestnet = {
  id: 656476,
  name: "EduChain Testnet",
  iconUrl: "https://opencampus.xyz/favicon.ico",
  iconBackground: "#fff",
  nativeCurrency: {
    name: "EduToken",
    symbol: "EDU",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.open-campus-codex.gelato.digital"],
    },
    public: {
      http: ["https://rpc.open-campus-codex.gelato.digital"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://opencampus-codex.blockscout.com/",
    },
  },
  testnet: true,
} as const satisfies Chain;

export const wagmiConfig = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "4f48723d8327495fccfe00d1dca96bab",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
    educhainTestnet,
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
