import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useState } from "react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { FileEdit, Calendar, Coins, PlusCircle } from "lucide-react";

const RegisterProposal = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [proposalDescription, setProposalDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");

  // Convert tokens to raw amount (6 decimals)
  const tokensToRaw = (tokens) => {
    return Math.floor(Number(tokens) * 1_000_000);
  };

  const registerProposal = async () => {
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

    const proposalTokenAccount = await getAssociatedTokenAddress(
      xMintPda,
      provider.wallet.publicKey,
    );

    const deadlineTimestamp = new anchor.BN(
      Math.floor(new Date(deadline).getTime() / 1000),
    );
    const stakeRaw = tokensToRaw(stakeAmount);

    // Fetch proposal counter to get the current count for deriving the proposal PDA
    const proposalCounterAccount =
      await program.account.proposalCounter.fetch(proposalCounterPda);

    // Derive the proposal account PDA using the current proposal count
    let [proposalAccountPda] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode(SEEDS.PROPOSAL),
        new Uint8Array([proposalCounterAccount.proposalCount]),
      ],
      program.programId,
    );

    const tx = await program.methods
      .registerProposal(
        proposalDescription,
        deadlineTimestamp,
        new anchor.BN(stakeRaw),
      )
      .accountsPartial({
        proposalCounterAccount: proposalCounterPda,
        signer: provider.wallet.publicKey,
        proposalAccount: proposalAccountPda,
        xMint: xMintPda,
        proposalTokenAccount: proposalTokenAccount,
        treasuryTokenAccount: treasuryConfig.treasuryTokenAccount,
      })
      .rpc();
    console.log("Transaction successful", tx);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/30">
          <FileEdit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Register Proposal
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          registerProposal();
        }}
        className="space-y-4"
      >
        <div>
          <label className="input-label flex items-center gap-2">
            <FileEdit className="w-3.5 h-3.5" />
            Description
          </label>
          <input
            type="text"
            placeholder="Enter proposal description"
            value={proposalDescription}
            onChange={(e) => setProposalDescription(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="input-label flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Deadline
          </label>
          <input
            type="datetime-local"
            placeholder="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="input-label flex items-center gap-2">
            <Coins className="w-3.5 h-3.5" />
            Token Stake Amount
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 100"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="input"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          <PlusCircle className="w-4 h-4" />
          Register Proposal
        </button>
      </form>
    </div>
  );
};

export default RegisterProposal;
