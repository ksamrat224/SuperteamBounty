import { useState, useEffect } from "react";
import idl from "./idl/idl.json";
import { Connection, PublicKey } from "@solana/web3.js";
import InitializeTreasury from "./components/InitializeTreasury";
import BuyTokens from "./components/BuyTokens";
import RegisterVoter from "./components/RegisterVoter";
import RegisterProposal from "./components/RegisterProposal";
import Vote from "./components/Vote";
import PickWinner from "./components/PickWinner";
import WithdrawSol from "./components/WithdrawSol";
import CloseProposal from "./components/CloseProposal";
import CloseVoter from "./components/CloseVoter";
import TokenBalance from "./components/TokenBalance";
import VoterInfo from "./components/VoterInfo";
import ProposalInfo from "./components/ProposalInfo";
import AllProposals from "./components/AllProposals";
import TreasuryInfo from "./components/TreasuryInfo";
import * as anchor from "@coral-xyz/anchor";
import {
  Vote as VoteIcon,
  Settings,
  Wallet,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Zap,
} from "lucide-react";

const programID = new PublicKey("EjdSNqQr9ZrKzuT7TY6E9zXvMcYNQptJewTZA3B3DWJB");
const idlWithAddress = { ...idl, address: programID.toBase58() };

// Network configuration - switch between local and devnet
// Local: "http://127.0.0.1:8899"
// Devnet: "https://api.devnet.solana.com"

const network = "http://127.0.0.1:8899";
const connection = new Connection(network, "processed");

//getProvider function
const getProvider = () => {
  const provider = new anchor.AnchorProvider(
    connection,
    window.solana,
    anchor.AnchorProvider.defaultOptions(),
  );
  return provider;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState("user"); // 'user' or 'admin'

  // Connect Wallet
  const connectWallet = async () => {
    if (window.solana) {
      try {
        setLoading(true);
        await window.solana.connect();
        const walletAddress = window.solana.publicKey.toString();
        setWalletAddress(walletAddress);
        setError(null);
      } catch (err) {
        console.error("Wallet connection error:", err);
        setError("Failed to connect wallet. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Solana wallet not found");
      setError(
        "Solana wallet not found. Please install a wallet like Phantom.",
      );
    }
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen pb-12 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl  shadow-lg shadow-primary-500/25">
                <VoteIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold ">
                  Inter College CR Voting
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Decentralized Governance on Solana
                </p>
              </div>
            </div>

            {/* Right side: Theme toggle, Network, Wallet */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Network Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <a
                    href="https://walletadapter.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: "auto" }}
                  >
                    {/* You can use an icon here if desired */}
                    Know More?
                  </a>
                </span>
              </div>

              {/* Wallet Connection */}
              <div className="flex items-center gap-2">
                {walletAddress && (
                  <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <Wallet className="w-3.5 h-3.5 text-primary-500" />
                    {shortenAddress(walletAddress)}
                  </span>
                )}
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className={`btn rounded-lg ${walletAddress ? "btn-secondary" : "bg-teal-600"} py-2.5! px-4! text-sm`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Connecting...</span>
                    </>
                  ) : walletAddress ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="hidden sm:inline">Connected</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border-t border-rose-200 dark:border-rose-800 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-16 md:top-20 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            <button
              onClick={() => setCurrentPage("user")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  currentPage === "user"
                    ? "bg-purple-700 text-white shadow-lg shadow-primary-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <VoteIcon className="w-4 h-4" />
              Voting
            </button>
            <button
              onClick={() => setCurrentPage("admin")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  currentPage === "admin"
                    ? "bg-purple-700 text-white shadow-lg shadow-primary-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <Settings className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === "user" ? (
          <div className="space-y-10 animate-fade-in">
            {/* All Proposals Section */}
            <section>
              <h2 className="section-title">
                <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <VoteIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </span>
                All Proposals
              </h2>
              <AllProposals
                walletAddress={walletAddress}
                idlWithAddress={idlWithAddress}
                getProvider={getProvider}
              />
            </section>

            {/* Tokens Section */}
            <section>
              <h2 className="section-title">
                <span className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </span>
                Tokens
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TokenBalance
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                  connection={connection}
                />
                <BuyTokens
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                  connection={connection}
                />
              </div>
            </section>

            {/* Voter Section */}
            <section>
              <h2 className="section-title">
                <span className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                  <Wallet className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </span>
                Voter Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <VoterInfo
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
                <RegisterVoter
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
                <CloseVoter
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
              </div>
            </section>

            {/* Proposal Actions Section */}
            <section>
              <h2 className="section-title">
                <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <Settings className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </span>
                Proposal Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <RegisterProposal
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
                <ProposalInfo
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
                <Vote
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
                <PickWinner
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
                <CloseProposal
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-10 animate-fade-in">
            {/* Admin Controls */}
            <section>
              <h2 className="section-title">
                <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <Settings className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </span>
                Admin Controls
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 -mt-4">
                Initialize and manage the treasury. Only the authority can
                perform these actions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InitializeTreasury
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
                <WithdrawSol
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
              </div>
            </section>

            {/* Treasury Details */}
            <section>
              <h2 className="section-title">
                <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </span>
                Treasury Details
              </h2>
              <TreasuryInfo
                walletAddress={walletAddress}
                idlWithAddress={idlWithAddress}
                getProvider={getProvider}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <VoteIcon className="w-4 h-4" />
              <span>Inter College CR Voting - Powered by Solana</span>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              Built with Anchor Framework
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
