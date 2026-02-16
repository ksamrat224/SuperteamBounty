import React, { useState, useEffect } from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  Building2,
  RefreshCw,
  Wallet,
  Coins,
  Key,
  Layers,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const TreasuryInfo = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [treasuryInfo, setTreasuryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const fetchTreasuryInfo = async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const provider = getProvider();
      const program = new anchor.Program(idlWithAddress, provider);

      // Only derive PDAs that are NOT stored in the config
      const [treasuryConfigPda] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode(SEEDS.TREASURY_CONFIG)],
        program.programId,
      );

      const [solVaultPda] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode(SEEDS.SOL_VAULT)],
        program.programId,
      );

      // Try to fetch treasury config to check if initialized
      try {
        const treasuryAccountData =
          await program.account.treasuryConfig.fetch(treasuryConfigPda);

        // Use values directly from the config instead of deriving
        setTreasuryInfo({
          treasuryConfig: treasuryConfigPda.toBase58(),
          solVault: solVaultPda.toBase58(),
          xMint: treasuryAccountData.xMint.toBase58(), // Read from config
          treasuryTokenAccount:
            treasuryAccountData.treasuryTokenAccount.toBase58(), // Read from config
          authority: treasuryAccountData.authority.toBase58(),
          solPrice: treasuryAccountData.solPrice.toString(),
          tokensPerPurchase: treasuryAccountData.tokensPerPurchase.toString(),
          isInitialized: true,
        });
      } catch (e) {
        // Treasury not initialized yet - show only the config and vault PDAs
        setTreasuryInfo({
          treasuryConfig: treasuryConfigPda.toBase58(),
          solVault: solVaultPda.toBase58(),
          isInitialized: false,
        });
      }
    } catch (err) {
      console.error("Error fetching treasury info:", err);
      setError("Failed to fetch treasury info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTreasuryInfo();
    }
  }, [walletAddress]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
  const lamportsToSol = (lamports) => {
    return (Number(lamports) / 1_000_000_000).toFixed(4);
  };

  // Convert raw token amount to tokens (6 decimals)
  const rawToTokens = (raw) => {
    return (Number(raw) / 1_000_000).toFixed(2);
  };

  if (!walletAddress) {
    return (
      <div className="card text-center py-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Wallet className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Connect Wallet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Connect your wallet to view treasury information
        </p>
      </div>
    );
  }

  return (
    <div className="card-glass relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-primary-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-accent-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-primary-500 shadow-lg shadow-emerald-500/25">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Treasury Information
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              System configuration & accounts
            </p>
          </div>
        </div>
        <button
          onClick={fetchTreasuryInfo}
          disabled={loading}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200"
        >
          <RefreshCw
            className={`w-5 h-5 text-slate-500 dark:text-slate-400 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {treasuryInfo && !loading && (
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span
              className={`badge text-sm ${treasuryInfo.isInitialized ? "badge-success" : "badge-warning"}`}
            >
              {treasuryInfo.isInitialized ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Treasury Initialized
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Not Initialized
                </>
              )}
            </span>
          </div>

          {/* Account Addresses */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Account Addresses
            </h3>

            <AddressRow
              icon={<Building2 className="w-4 h-4" />}
              label="Treasury Config"
              address={treasuryInfo.treasuryConfig}
              onCopy={() =>
                copyToClipboard(treasuryInfo.treasuryConfig, "config")
              }
              isCopied={copiedField === "config"}
              shortenAddress={shortenAddress}
            />

            <AddressRow
              icon={<Wallet className="w-4 h-4" />}
              label="SOL Vault"
              address={treasuryInfo.solVault}
              onCopy={() => copyToClipboard(treasuryInfo.solVault, "vault")}
              isCopied={copiedField === "vault"}
              shortenAddress={shortenAddress}
            />

            {treasuryInfo.xMint && (
              <AddressRow
                icon={<Coins className="w-4 h-4" />}
                label="Token Mint"
                address={treasuryInfo.xMint}
                onCopy={() => copyToClipboard(treasuryInfo.xMint, "mint")}
                isCopied={copiedField === "mint"}
                shortenAddress={shortenAddress}
              />
            )}

            {treasuryInfo.treasuryTokenAccount && (
              <AddressRow
                icon={<Layers className="w-4 h-4" />}
                label="Treasury Token Account"
                address={treasuryInfo.treasuryTokenAccount}
                onCopy={() =>
                  copyToClipboard(
                    treasuryInfo.treasuryTokenAccount,
                    "tokenAccount",
                  )
                }
                isCopied={copiedField === "tokenAccount"}
                shortenAddress={shortenAddress}
              />
            )}

            {treasuryInfo.authority && (
              <AddressRow
                icon={<Key className="w-4 h-4" />}
                label="Authority"
                address={treasuryInfo.authority}
                onCopy={() =>
                  copyToClipboard(treasuryInfo.authority, "authority")
                }
                isCopied={copiedField === "authority"}
                shortenAddress={shortenAddress}
              />
            )}
          </div>

          {/* Configuration Values */}
          {treasuryInfo.isInitialized && (
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
                Configuration
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium mb-1">
                    SOL Price
                  </p>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {lamportsToSol(treasuryInfo.solPrice)}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                      SOL
                    </span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium mb-1">
                    Tokens Per Purchase
                  </p>
                  <p className="text-xl font-bold text-accent-600 dark:text-accent-400">
                    {rawToTokens(treasuryInfo.tokensPerPurchase)}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                      VOTE
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper component for address rows
const AddressRow = ({
  icon,
  label,
  address,
  onCopy,
  isCopied,
  shortenAddress,
}) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
    <div className="flex items-center gap-3">
      <span className="text-slate-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p
          className="font-mono text-sm text-slate-700 dark:text-slate-300"
          title={address}
        >
          {shortenAddress(address)}
        </p>
      </div>
    </div>
    <button
      onClick={onCopy}
      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
    >
      {isCopied ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : (
        <Copy className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
      )}
    </button>
  </div>
);

export default TreasuryInfo;
