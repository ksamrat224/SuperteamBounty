import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useState } from "react";
import {
  Search,
  Users,
  Calendar,
  User,
  AlertCircle,
  FileText,
} from "lucide-react";

const ProposalInfo = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [proposalId, setProposalId] = useState("");
  const [proposalData, setProposalData] = useState(null);
  const [error, setError] = useState("");

  const fetchProposal = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet");
      return;
    }
    if (!proposalId) {
      alert("Please enter a proposal ID");
      return;
    }
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);

    let [proposalPda] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode(SEEDS.PROPOSAL),
        Buffer.from([Number(proposalId)]),
      ],
      program.programId,
    );

    try {
      const proposalAccountdata =
        await program.account.proposal.fetch(proposalPda);
      setProposalData(proposalAccountdata);
      setError("");
    } catch (err) {
      console.log("Proposal not found", err);
      setProposalData(null);
      setError("Proposal not found");
    }
  };

  const formatDeadline = (timestamp) => {
    const date = new Date(timestamp.toNumber() * 1000);
    return date.toLocaleString();
  };

  const isActive = proposalData
    ? proposalData.deadline.toNumber() * 1000 > Date.now()
    : false;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/30">
          <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Proposal Info
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchProposal();
        }}
        className="space-y-4"
      >
        <div>
          <label className="input-label">Proposal ID</label>
          <input
            type="number"
            placeholder="Enter proposal ID"
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          <Search className="w-4 h-4" />
          Fetch Proposal
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {proposalData && (
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              #{proposalData.proposalId}
            </span>
            <span
              className={`badge ${isActive ? "badge-success" : "badge-neutral"}`}
            >
              {isActive ? "Active" : "Ended"}
            </span>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium mb-1">
                Description
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                {proposalData.proposalInfo}
              </p>
            </div>
          </div>

          {/* Votes */}
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                Votes
              </p>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {proposalData.numberOfVotes}
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                Deadline
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                {formatDeadline(proposalData.deadline)}
              </p>
            </div>
          </div>

          {/* Authority */}
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                Authority
              </p>
              <p className="text-sm font-mono text-slate-600 dark:text-slate-400">
                {proposalData.authority.toBase58().slice(0, 20)}...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalInfo;
