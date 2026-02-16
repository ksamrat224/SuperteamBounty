import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useState } from "react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Vote as VoteIcon, Coins, Send } from "lucide-react";

const Vote = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [proposalId, setProposalId] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");

  // Convert tokens to raw amount (6 decimals)
  const tokensToRaw = (tokens) => {
    return Math.floor(Number(tokens) * 1_000_000);
  };

  const vote = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet");
      return;
    }
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);

    let [proposalCounterPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEEDS.PROPOSAL_COUNTER)],
      program.programId,
    );

    let [proposalAccountPda] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode(SEEDS.PROPOSAL),
        Buffer.from([Number(proposalId)]),
      ],
      program.programId,
    );

    let [xMintPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEEDS.X_MINT)],
      program.programId,
    );

    let [treasuryConfigPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEEDS.TREASURY_CONFIG)],
      program.programId,
    );

    // Fetch treasury config to get the treasury token account
    const treasuryConfig =
      await program.account.treasuryConfig.fetch(treasuryConfigPda);

    const voterTokenAccount = await getAssociatedTokenAddress(
      xMintPda,
      provider.wallet.publicKey,
    );

    const stakeRaw = tokensToRaw(stakeAmount);

    const tx = await program.methods
      .proposalToVote(Number(proposalId), new anchor.BN(stakeRaw))
      .accountsPartial({
        proposalCounter: proposalCounterPda,
        proposalAccount: proposalAccountPda,
        signer: provider.wallet.publicKey,
        xMint: xMintPda,
        voterTokenAccount: voterTokenAccount,
        treasuryTokenAccount: treasuryConfig.treasuryTokenAccount,
      })
      .rpc();
    console.log("Transaction successful", tx);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/25">
          <VoteIcon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Cast Vote
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          vote();
        }}
        className="space-y-4"
      >
        <div>
          <label className="input-label flex items-center gap-2">
            <VoteIcon className="w-3.5 h-3.5" />
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

        <div>
          <label className="input-label flex items-center gap-2">
            <Coins className="w-3.5 h-3.5" />
            Token Amount to Stake
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 10"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="input"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          <Send className="w-4 h-4" />
          Cast Vote
        </button>
      </form>
    </div>
  );
};

export default Vote;
