import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { UserPlus } from "lucide-react";

const RegisterVoter = ({ walletAddress, idlWithAddress, getProvider }) => {
  const registerVoter = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet");
      return;
    }
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);

    const tx = await program.methods
      .registerVoter()
      .accountsPartial({
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Transaction successful", tx);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Register as Voter
        </h2>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Register your wallet to participate in voting on proposals. You need to
        be registered before casting any votes.
      </p>

      <button onClick={registerVoter} className="w-full bg-green-600 rounded-lg py-2.5 flex items-center justify-center gap-2 transition-all duration-200">
        <UserPlus className="w-4 h-4" />
        Register Voter
      </button>
    </div>
  );
};

export default RegisterVoter;
