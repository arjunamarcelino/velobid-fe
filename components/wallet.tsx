import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const buttonBaseStyles = "rounded-full hover:rounded-full";

const ChainIcon = ({
  iconUrl,
  name,
  background,
  size = 20,
}: {
  iconUrl?: string;
  name?: string;
  background?: string;
  size?: number;
}) => (
  <div
    style={{
      background,
      width: size,
      height: size,
      borderRadius: 999,
      overflow: "hidden",
      marginRight: 4,
    }}
  >
    {iconUrl && (
      <Image
        alt={`${name ?? "Chain"} icon`}
        src={iconUrl}
        style={{ width: size, height: size }}
      />
    )}
  </div>
);

const CustomButton = ({
  children,
  onClick,
  variant = "flat",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "flat" | "ghost";
}) => (
  <div className="w-fit flex">
    <Button
      onPress={onClick}
      variant={variant}
      className={`${buttonBaseStyles} flex items-center`}
    >
      {children}
    </Button>
  </div>
);

export function WalletComponents() {
  return <ConnectButtonWalletComponents />;
}

export const ConnectButtonWalletComponents = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        if (!mounted) {
          return (
            <div
              aria-hidden="true"
              style={{
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          );
        }

        const connected = account && chain;

        if (!connected) {
          return (
            <CustomButton onClick={openConnectModal} variant="ghost">
              Connect Wallet
            </CustomButton>
          );
        }

        if (chain?.unsupported) {
          return (
            <CustomButton onClick={openChainModal}>Wrong network</CustomButton>
          );
        }

        return (
          <div className="w-fit flex-wrap flex gap-3 z-50">
            <CustomButton onClick={openChainModal}>
              {chain.hasIcon && (
                <ChainIcon
                  iconUrl={chain.iconUrl}
                  name={chain.name}
                  background={chain.iconBackground}
                />
              )}
              {chain.name}
            </CustomButton>

            <CustomButton onClick={openAccountModal}>
              {account.displayName}
              {account.displayBalance && ` (${account.displayBalance})`}
            </CustomButton>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
