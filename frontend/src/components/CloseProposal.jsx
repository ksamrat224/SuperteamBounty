import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useState } from "react";
import { XSquare, Vote, AlertTriangle } from "lucide-react";

const CloseProposal = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [proposalId, setProposalId] = useState("");

  const closeProposal = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet");
      return;
    }
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);

    const tx = await program.methods
      .closeProposal(Number(proposalId))
      .accountsPartial({
        destination: provider.wallet.publicKey,
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Transaction successful", tx);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/30">
          <XSquare className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Close Proposal
        </h2>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Only close proposals after the winner has been picked. Rent will be
          returned to your wallet.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          closeProposal();
        }}
        className="space-y-4"
      >
        <div>
          <label className="input-label flex items-center gap-2">
            <Vote className="w-3.5 h-3.5" />
            Proposal ID
          </label>
          <input
            type="number"
            placeholder="Enter proposal ID"
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)}
            className="input"
          />
        </div>

        <button type="submit" className="btn-danger w-full">
          <XSquare className="w-4 h-4" />
          Close Proposal
        </button>
      </form>
    </div>
  );
};

export default CloseProposal;
