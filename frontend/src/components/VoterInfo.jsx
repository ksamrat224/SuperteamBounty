import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useState, useEffect } from "react";
import {
  UserCheck,
  RefreshCw,
  User,
  Vote,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const VoterInfo = ({ walletAddress, idlWithAddress, getProvider }) => {
  const [voterData, setVoterData] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchVoterInfo = async () => {
    if (!walletAddress) {
      return;
    }
    setLoading(true);
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);

    let [voterPda] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode(SEEDS.VOTER),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId,
    );

    try {
      const data = await program.account.voter.fetch(voterPda);
      setVoterData(data);
      setIsRegistered(true);
    } catch (err) {
      console.log("Voter not registered");
      setVoterData(null);
      setIsRegistered(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoterInfo();
  }, [walletAddress]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/30">
            <UserCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Voter Info
          </h2>
        </div>
        <button
          onClick={fetchVoterInfo}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          <RefreshCw
            className={`w-4 h-4 text-slate-500 dark:text-slate-400 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="flex justify-center mb-4">
        <span
          className={`badge ${isRegistered ? "badge-success" : "badge-warning"}`}
        >
          {isRegistered ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Registered
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" />
              Not Registered
            </>
          )}
        </span>
      </div>

      {isRegistered && voterData && (
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Voter ID
              </p>
              <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
                {voterData.voterId.toBase58().slice(0, 20)}...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Vote className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proposal Voted
              </p>
              <p className="font-semibold text-primary-600 dark:text-primary-400">
                {voterData.proposalVoted === 0
                  ? "Not voted yet"
                  : `Proposal #${voterData.proposalVoted}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isRegistered && (
        <p className="text-sm text-center text-slate-500 dark:text-slate-400">
          Register as a voter to participate in proposals
        </p>
      )}
    </div>
  );
};

export default VoterInfo;
