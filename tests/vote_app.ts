import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VoteApp } from "../target/types/vote_app";
import { expect } from "chai";

import {
  getOrCreateAssociatedTokenAccount,
  getAccount,
} from "@solana/spl-token";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

const SEEDS = {
  SOL_VAULT: "sol_vault",
  TREASURY_CONFIG: "treasury_config",
  MINT_AUTHORITY: "mint_authority",
  X_MINT: "x_mint",
} as const;

const findPda = (
  programId: anchor.web3.PublicKey,
  seeds: (Buffer | Uint8Array)[],
): anchor.web3.PublicKey => {
  const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    seeds,
    programId,
  );
  return pda;
};
const airDropSol = async (
  connection: anchor.web3.Connection,
  publicKey: anchor.web3.PublicKey,
  sol: number,
) => {
  const signature = await connection.requestAirdrop(publicKey, sol);
  await connection.confirmTransaction(signature, "confirmed");
};

describe("1.Initialization", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.voteApp as Program<VoteApp>;

  const adminWallet = (provider.wallet as NodeWallet).payer;
  let proposalCreatorWallet = new anchor.web3.Keypair();
  let proposalCreatorTokenAccount: anchor.web3.PublicKey;
  let treasuryConfigPda: anchor.web3.PublicKey;
  let xMintPda: anchor.web3.PublicKey;
  let solVaultPda: anchor.web3.PublicKey;
  let mintAuthorityPda: anchor.web3.PublicKey;
  let treasuryTokenAccount: anchor.web3.PublicKey;

  beforeEach(async () => {
    treasuryConfigPda = findPda(program.programId, [
      anchor.utils.bytes.utf8.encode(SEEDS.TREASURY_CONFIG),
    ]);
    solVaultPda = findPda(program.programId, [
      anchor.utils.bytes.utf8.encode(SEEDS.SOL_VAULT),
    ]);
    mintAuthorityPda = findPda(program.programId, [
      anchor.utils.bytes.utf8.encode(SEEDS.MINT_AUTHORITY),
    ]);
    xMintPda = findPda(program.programId, [
      anchor.utils.bytes.utf8.encode(SEEDS.X_MINT),
    ]);
    console.log("Transferring sol tokens");

    await airDropSol(
      connection,
      proposalCreatorWallet.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL,
    );
    console.log("Airdropped 10 SOL to proposal creator");
  });
  const createTokenAccounts = async () => {
    console.log("Initializing token accounts...");
    treasuryTokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        adminWallet,
        xMintPda,
        adminWallet.publicKey,
      )
    ).address;
    proposalCreatorTokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        proposalCreatorWallet,
        xMintPda,
        proposalCreatorWallet.publicKey,
      )
    ).address;
  };
  describe("Testing the voting app", () => {
    it("initializes treasury!", async () => {
      // Add your test here.
      const solPrice = new anchor.BN(1000_000_000); // $1 in 8 decimals
      const tokensPerPurchase = new anchor.BN(1000_000_000); // 100 tokens per $1
      console.log("treasuryConfigPda", treasuryConfigPda);
      await program.methods
        .initializeTreasury(solPrice, tokensPerPurchase)
        .accounts({
          authority: adminWallet.publicKey,
        })
        .rpc();
      const treasuryAccountData = await program.account.treasuryConfig.fetch(
        treasuryConfigPda,
      );

      expect(treasuryAccountData.solPrice.toNumber()).to.equal(
        solPrice.toNumber(),
      );

      expect(treasuryAccountData.tokensPerPurchase.toNumber()).to.equal(
        tokensPerPurchase.toNumber(),
      );

      expect(treasuryAccountData.authority.toBase58()).to.equal(
        adminWallet.publicKey.toBase58(),
      );

      expect(treasuryAccountData.xMint.toBase58()).to.equal(
        xMintPda.toBase58(),
      );
      await createTokenAccounts();
    });
  });

  describe("2. Buy Tokens", () => {
    it("2.1 buys tokens!", async () => {
      const tokenBalanceBefore = (
        await getAccount(connection, proposalCreatorTokenAccount)
      ).amount;
      await program.methods
        .buyTokens()
        .accounts({
          buyer: proposalCreatorWallet.publicKey,
          treasuryTokenAccount: treasuryTokenAccount,
          buyerTokenAccount: proposalCreatorTokenAccount,
          xMint: xMintPda,
        })
        .signers([proposalCreatorWallet])
        .rpc();
      const tokenBalanceAfter = (
        await getAccount(connection, proposalCreatorTokenAccount)
      ).amount;
      expect(tokenBalanceAfter - tokenBalanceBefore).to.equal(BigInt(1000_000_000) /* tokensPerPurchase */);
    });
  });
});
