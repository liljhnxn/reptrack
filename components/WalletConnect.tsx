"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/lib/wagmi";
import { useState, useEffect } from "react";
import { Wallet, AlertTriangle, LogOut, Check, Copy, ExternalLink, ChevronDown } from "lucide-react";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-36 rounded-lg bg-card/60 animate-pulse border border-borderGreen" />
    );
  }

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    const metaMaskConnector =
      connectors.find((c) => c.id === "metaMask") ||
      connectors.find((c) => c.name.toLowerCase().includes("metamask")) ||
      connectors[0];

    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-background font-semibold hover:bg-accent-hover transition-all duration-200 active:scale-95 disabled:opacity-50 text-sm shadow-sm"
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
      </button>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => switchChain({ chainId: botchainTestnet.id })}
          disabled={isSwitching}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 font-medium hover:bg-amber-500/25 transition-all text-sm"
          title="Switch to Botchain Testnet"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{isSwitching ? "Switching..." : "Switch to Botchain"}</span>
        </button>
        <button
          onClick={() => disconnect()}
          className="p-2 rounded-lg bg-card border border-borderGreen text-secondaryText hover:text-red-400 hover:border-red-900/50 transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const truncatedAddress = `${address?.slice(0, 6)}...${address?.slice(-4)}`;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Network Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-borderGreen/60 border border-borderGreen text-xs text-secondaryText">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Botchain</span>
        </div>

        {/* Address pill & dropdown trigger */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-borderGreen hover:border-accent/40 text-primaryText transition-colors text-sm font-mono font-medium shadow-sm"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span>{truncatedAddress}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-secondaryText transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-borderGreen p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-borderGreen/60 mb-1">
              <p className="text-xs text-secondaryText font-medium">Connected as</p>
              <p className="text-xs font-mono text-primaryText truncate mt-0.5" title={address}>
                {address}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-primaryText hover:bg-card-hover transition-colors"
            >
              <span className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-secondaryText" />
                <span>{copied ? "Copied!" : "Copy Address"}</span>
              </span>
              {copied && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>

            <a
              href={`https://scan.bohr.life/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-primaryText hover:bg-card-hover transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-secondaryText" />
                <span>View on BohrScan</span>
              </span>
            </a>

            <div className="border-t border-borderGreen/60 mt-1 pt-1">
              <button
                onClick={() => {
                  disconnect();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

