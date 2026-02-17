import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useState } from "react";
import { Trophy, Vote } from "lucide-react";

const PickWinner = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [proposalId, setProposalId] = useState("");

  const pickWinner = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet");
      return;
    }
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);

    let [proposalAccountPda] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode(SEEDS.PROPOSAL),
        Buffer.from([Number(proposalId)]),
      ],
      program.programId,
    );

    const tx = await program.methods
      .pickWinner(Number(proposalId))
      .accountsPartial({
        proposalAccount: proposalAccountPda,
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Transaction successful", tx);
  };

  return (
    <div className="card relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl -z-10" />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-yellow-100 dark:bg-yellow-900">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Pick Winner
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          pickWinner();
        }}
        className="space-y-4"
      >
        <div>
          <label className="input-label flex items-center gap-2">
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

        <button
          type="submit"
          className=" w-full bg-yellow-600 rounded-lg py-2.5 flex items-center justify-center gap-2 transition-all duration-200"
        >
          <Trophy className="w-4 h-4" />
          Pick Winner
        </button>
      </form>
    </div>
  );
};

export default PickWinner;
