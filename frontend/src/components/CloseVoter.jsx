import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { UserMinus, AlertTriangle } from "lucide-react";

const CloseVoter = ({ walletAddress, idlWithAddress, getProvider }) => {
  const closeVoter = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet");
      return;
    }
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);

    const tx = await program.methods
      .closeVoter()
      .accountsPartial({
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Transaction successful", tx);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/30">
          <UserMinus className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Close Voter Account
        </h2>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          This action will remove your voter registration and return any rent to
          your wallet.
        </p>
      </div>

      <button onClick={closeVoter} className="btn-danger w-full">
        <UserMinus className="w-4 h-4" />
        Close Voter Account
      </button>
    </div>
  );
};

export default CloseVoter;
