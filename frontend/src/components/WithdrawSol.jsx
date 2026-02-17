import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useState } from "react";
import { ArrowDownToLine, Coins, AlertTriangle } from "lucide-react";

const WithdrawSol = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [amount, setAmount] = useState("");

  // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
  const solToLamports = (sol) => {
    return Math.floor(Number(sol) * 1_000_000_000);
  };

  const withdrawSol = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet");
      return;
    }
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);

    const amountLamports = solToLamports(amount);

    const tx = await program.methods
      .withdrawSol(new anchor.BN(amountLamports))
      .accountsPartial({
        authority: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Transaction successful", tx);
  };

  return (
    <div className="card relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-500/10 to-amber-500/10 rounded-full blur-3xl -z-10" />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 shadow-lg shadow-rose-500/25">
          <ArrowDownToLine className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Withdraw SOL
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Authority only
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start  p-3 mb-4 rounded-xl ">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Only the treasury authority can withdraw SOL from the vault.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          withdrawSol();
        }}
        className="space-y-4"
      >
        <div>
          <label className="input-label flex items-center gap-2">
            Amount in SOL
          </label>
          <input
            type="number"
            step="0.001"
            placeholder="e.g., 1.5"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />
        </div>

        <button
          type="submit"
          className="btn-danger w-full flex items-center justify-center gap-2 py-2.5 transition-all duration-200 hover:bg-red-700 rounded-lg"
        >
          <ArrowDownToLine className="w-4 h-4" />
          Withdraw SOL
        </button>
      </form>
    </div>
  );
};

export default WithdrawSol;
