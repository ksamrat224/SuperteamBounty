import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VoteApp } from "../target/types/vote_app";
import { expect }  from "chai";

import {getOrCreateAssociatedTokenAccount,getAccount} from "@solana/spl-token";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
describe("vote_app", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.voteApp as Program<VoteApp>;

  it("initializes treasury!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initializeTreasury()
      .accounts({
        treasuryConfigAccount,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
