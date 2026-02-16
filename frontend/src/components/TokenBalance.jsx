import React from "react";
import { SEEDS } from "../constants/constants";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useState, useEffect } from "react";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { Gem, RefreshCw } from "lucide-react";

const DECIMALS = 6;

const TokenBalance = ({
  walletAddress,
  idlWithAddress,
  getProvider,
  connection,
}) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!walletAddress) {
      return;
    }
    setLoading(true);
    const provider = getProvider();
    const program = new anchor.Program(idlWithAddress, provider);

    let [xMintPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEEDS.X_MINT)],
      program.programId,
    );

    const buyerTokenAccount = await getAssociatedTokenAddress(
      xMintPda,
      provider.wallet.publicKey,
    );

    try {
      const accountInfo = await getAccount(connection, buyerTokenAccount);
      setBalance(Number(accountInfo.amount));
    } catch (err) {
      console.log("Token account not found or no balance");
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [walletAddress]);

  const displayBalance = (balance / Math.pow(10, DECIMALS)).toFixed(2);

  return (
    <div className="card relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-3xl -z-10" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/25">
            <Gem className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Token Balance
          </h2>
        </div>
        <button
          onClick={fetchBalance}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          <RefreshCw
            className={`w-4 h-4 text-slate-500 dark:text-slate-400 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="text-center py-6">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium mb-2">
          Your Voting Tokens
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-accent-500 to-primary-400 bg-clip-text text-transparent">
            {loading ? "..." : displayBalance}
          </span>
          <span className="text-lg font-medium text-slate-500 dark:text-slate-400">
            VOTE
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Use tokens to vote on proposals and register new ones
        </p>
      </div>
    </div>
  );
};

export default TokenBalance;
