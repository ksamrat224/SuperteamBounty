use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct TreasuryConfig {
    pub authority: Pubkey,
    pub x_mint: Pubkey, //tokens it will deal
    pub treasury_token_account: Pubkey, //will hold the tokens
    pub sol_price :u64,
    pub tokens_per_purchase: u64,
    pub bump: u8,
}