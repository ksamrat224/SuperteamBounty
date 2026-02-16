import React, { useState, useEffect } from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  RefreshCw,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Filter,
} from "lucide-react";

const AllProposals = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("active"); // 'active', 'ended', 'all'

  const fetchAllProposals = async () => {
    if (!walletAddress) {
      setError("Please connect your wallet");
      return;
    }

    setLoading(true);
    setError("");
    setProposals([]);

    try {
      const provider = getProvider();
      const program = new anchor.Program(idlWithAddress, provider);

      // Use current time - on devnet/mainnet this is synced with blockchain time
      const currentTime = Math.floor(Date.now() / 1000);

      // First, get the proposal counter to know how many proposals exist
      const [proposalCounterPda] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode(SEEDS.PROPOSAL_COUNTER)],
        program.programId,
      );

      let proposalCount = 0;
      try {
        const counterData =
          await program.account.proposalCounter.fetch(proposalCounterPda);
        proposalCount = counterData.proposalCount;
      } catch (err) {
        setError(
          "Proposal counter not initialized. Initialize treasury first.",
        );
        setLoading(false);
        return;
      }

      if (proposalCount === 0) {
        setError("No proposals registered yet.");
        setLoading(false);
        return;
      }

      // Fetch all proposals
      const fetchedProposals = [];

      for (let i = 0; i < proposalCount; i++) {
        try {
          const [proposalPda] = PublicKey.findProgramAddressSync(
            [new TextEncoder().encode(SEEDS.PROPOSAL), Buffer.from([i])],
            program.programId,
          );

          const proposalData =
            await program.account.proposal.fetch(proposalPda);
          const deadline = proposalData.deadline.toNumber();
          const isActive = deadline > currentTime;

          fetchedProposals.push({
            id: proposalData.proposalId,
            info: proposalData.proposalInfo,
            votes: proposalData.numberOfVotes,
            deadline: deadline,
            authority: proposalData.authority.toBase58(),
            isActive: isActive,
            pda: proposalPda.toBase58(),
          });
        } catch (err) {
          // Proposal might have been closed, skip it
          console.log(`Proposal ${i} not found or closed`);
        }
      }

      setProposals(fetchedProposals);
    } catch (err) {
      console.error("Error fetching proposals:", err);
      setError("Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchAllProposals();
    }
  }, [walletAddress]);

  const formatDeadline = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getTimeRemaining = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = deadline - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    if (minutes > 0) return `${minutes}m ${seconds}s remaining`;
    return `${seconds}s remaining`;
  };

  const filteredProposals = proposals.filter((p) => {
    if (filter === "active") return p.isActive;
    if (filter === "ended") return !p.isActive;
    return true;
  });

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    // Active proposals first, then by deadline
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return b.deadline - a.deadline;
  });

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
            <button
              onClick={() => setFilter("active")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  filter === "active"
                    ? "bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Active
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                {proposals.filter((p) => p.isActive).length}
              </span>
            </button>
            <button
              onClick={() => setFilter("ended")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  filter === "ended"
                    ? "bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
            >
              <XCircle className="w-4 h-4" />
              Ended
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                {proposals.filter((p) => !p.isActive).length}
              </span>
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  filter === "all"
                    ? "bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
            >
              <Filter className="w-4 h-4" />
              All
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                {proposals.length}
              </span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchAllProposals}
            disabled={loading}
            className="btn-secondary !py-2.5 !px-4 text-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>{loading ? "Loading..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
              <div className="flex gap-4">
                <div className="h-12 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedProposals.length === 0 && !error && (
        <div className="card text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Filter className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No {filter !== "all" ? filter : ""} proposals found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filter === "active"
              ? "There are no active proposals at the moment."
              : filter === "ended"
                ? "No ended proposals yet."
                : "No proposals have been registered yet."}
          </p>
        </div>
      )}

      {/* Proposals Grid */}
      {!loading && sortedProposals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProposals.map((proposal, index) => (
            <div
              key={proposal.id}
              className={`card group relative overflow-hidden animate-fade-in
                ${
                  proposal.isActive
                    ? "border-l-4 border-l-emerald-500"
                    : "border-l-4 border-l-slate-400 dark:border-l-slate-600 opacity-80"
                }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Active glow effect */}
              {proposal.isActive && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  #{proposal.id}
                </span>
                <span
                  className={`badge ${proposal.isActive ? "badge-success" : "badge-neutral"}`}
                >
                  {proposal.isActive ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      Ended
                    </>
                  )}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">
                {proposal.info}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                    Votes
                  </span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {proposal.votes}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                    Time
                  </span>
                  <span
                    className={`text-sm font-semibold flex items-center gap-1
                    ${proposal.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    <Clock className="w-4 h-4" />
                    {getTimeRemaining(proposal.deadline)}
                  </span>
                </div>
              </div>

              {/* Deadline */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {formatDeadline(proposal.deadline)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProposals;
