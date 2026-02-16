import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useState } from "react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Building2, Coins, Layers, Rocket } from "lucide-react";

const InitializeTreasury = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [solPrice, setSolPrice] = useState("");
  const [tokensPerPurchase, setTokensPerPurchase] = useState("");

  // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
  const solToLamports = (sol) => {
    return Math.floor(Number(sol) * 1_000_000_000);
  };

  // Convert tokens to raw amount (6 decimals)
  const tokensToRaw = (tokens) => {
    return Math.floor(Number(tokens) * 1_000_000);
  };

  const initializeTreasury = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet");
      return;
    }
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);
    let [treasuryConfigPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEEDS.TREASURY_CONFIG)],
      program.programId,
    );
    let [mintAuthorityPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEEDS.MINT_AUTHORITY)],
      program.programId,
    );
    let [solVaultPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEEDS.SOL_VAULT)],
      program.programId,
    );
    let [xMintPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEEDS.X_MINT)],
      program.programId,
    );
    let [proposalCounterPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEEDS.PROPOSAL_COUNTER)],
      program.programId,
    );
    let treasuryTokenAccount = await getAssociatedTokenAddress(
      xMintPda,
      provider.wallet.publicKey,
    );

    const solLamports = solToLamports(solPrice);
    const tokens = tokensToRaw(tokensPerPurchase);
    const tx = await program.methods
      .initializeTreasury(new anchor.BN(solLamports), new anchor.BN(tokens))
      .accountsPartial({
        authority: provider.wallet.publicKey,
        treasuryConfig: treasuryConfigPda,
        mintAuthority: mintAuthorityPda,
        solVault: solVaultPda,
        xMint: xMintPda,
        treasuryTokenAccount: treasuryTokenAccount,
        proposalCounter: proposalCounterPda,
      })
      .rpc();
    console.log("Transaction successful", tx);
  };

  return (
    <div className="card relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-primary-500/10 rounded-full blur-3xl -z-10" />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-primary-500 shadow-lg shadow-emerald-500/25">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Initialize Treasury
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set up the voting system
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          initializeTreasury();
        }}
        className="space-y-4"
      >
        <div>
          <label className="input-label flex items-center gap-2">
            <Coins className="w-3.5 h-3.5" />
            SOL Price per Purchase
          </label>
          <input
            type="number"
            step="0.001"
            placeholder="e.g., 0.1 SOL"
            value={solPrice}
            onChange={(e) => setSolPrice(e.target.value)}
            className="input"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Amount of SOL required to buy tokens
          </p>
        </div>

        <div>
          <label className="input-label flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            Tokens Per Purchase
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 1000"
            value={tokensPerPurchase}
            onChange={(e) => setTokensPerPurchase(e.target.value)}
            className="input"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Number of tokens minted per purchase
          </p>
        </div>

        <button type="submit" className="btn-primary w-full">
          <Rocket className="w-4 h-4" />
          Initialize Treasury
        </button>
      </form>
    </div>
  );
};

export default InitializeTreasury;
