use anchor_lang::prelude::*;
mod state;
mod contexts;
use contexts::*;

declare_id!("3jfJ7Kd6hryKHjoCQeTWsrVuoDgoAz5JJ18MbxL45V2c");

#[program]
pub mod vote_app {
    use crate::state::TreasuryConfig;

    use super::*;
    pub fn initialize_treasury(ctx: Context<InitializeTreasury>, sol_price: u64,tokens_per_purchase: u64) -> Result<()> {
       let treasury_config_account: &mut Account<'_, TreasuryConfig> = &mut  ctx.accounts.treasury_config_account;
       treasury_config_account.authority = ctx.accounts.authority.key();
       treasury_config_account.bump = ctx.bumps.sol_vault;
       treasury_config_account.sol_price = sol_price;
       treasury_config_account.x_mint = ctx.accounts.x_mint.key();
       treasury_config_account.tokens_per_purchase = tokens_per_purchase;
       
       Ok(())
    }
}


