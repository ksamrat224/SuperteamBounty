import React, { useState } from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey, Transaction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  Coins,
  Loader2,
  CheckCircle2,
  XCircle,
  ShoppingCart,
} from "lucide-react";

const BuyTokens = ({
  walletAddress,
  idlWithAddress,
  getProvider,
  connection,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // 'success', 'error', 'loading'

  const buyTokens = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet");
      return;
    }

    setLoading(true);
    setStatus("Preparing transaction...");
    setStatusType("loading");

    try {
      const provider = getProvider();
      const program = new anchor.Program(idlWithAddress, provider);

      let [xMintPda] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode(SEEDS.X_MINT)],
        program.programId,
      );

      const buyerTokenAccount = await getAssociatedTokenAddress(
        xMintPda,
        provider.wallet.publicKey,
      );
      // Build a single transaction with all necessary instructions
      const transaction = new Transaction();

      const [treasuryConfigPda] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode(SEEDS.TREASURY_CONFIG)],
        program.programId,
      );

      const treasuryAccountData =
        await program.account.treasuryConfig.fetch(treasuryConfigPda);

      const accountInfo = await connection.getAccountInfo(buyerTokenAccount);
      // Check if ATA exists, if not add creation instruction
      if (!accountInfo) {
        const createAtaTx = createAssociatedTokenAccountInstruction(
          provider.wallet.publicKey,
          buyerTokenAccount,
          provider.wallet.publicKey,
          xMintPda,
        );
        transaction.add(createAtaTx);
      }
      // Add buy tokens instruction
      setStatus("Waiting for wallet approval...");
      const buyTokenTx = await program.methods
        .buyTokens()
        .accountsPartial({
          buyer: provider.wallet.publicKey,
          buyerTokenAccount: buyerTokenAccount,
          xMint: xMintPda,
          treasuryTokenAccount: treasuryAccountData.treasuryTokenAccount,
        })
        .instruction();

      transaction.add(buyTokenTx);
      // Send single transaction with all instructions
      setStatus("Please approve the transaction...");
      const tx = await provider.sendAndConfirm(transaction);
      console.log("Transaction successful", tx);
      setStatus("Tokens purchased successfully!");
      setStatusType("success");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus("");
        setStatusType("");
      }, 3000);
    } catch (err) {
      console.error("Error buying tokens:", err);
      if (err.message?.includes("User rejected")) {
        setStatus("Transaction cancelled by user");
      } else {
        setStatus(`Error: ${err.message || "Transaction failed"}`);
      }
      setStatusType("error");
      // Clear error message after 5 seconds
      setTimeout(() => {
        setStatus("");
        setStatusType("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30">
          <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Buy Tokens
        </h2>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Purchase voting tokens to participate in proposals. Tokens are required
        to vote and register proposals.
      </p>

      <button
        onClick={buyTokens}
        disabled={loading}
        className=" bg-green-600 w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-all duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Buy Tokens
          </>
        )}
      </button>

      {status && (
        <div
          className={`flex items-center gap-2 mt-4 p-3 rounded-xl text-sm
          ${
            statusType === "success"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
              : statusType === "error"
                ? "bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"
                : "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400"
          }`}
        >
          {statusType === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : statusType === "error" ? (
            <XCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
          )}
          {status}
        </div>
      )}
    </div>
  );
};

export default BuyTokens;
