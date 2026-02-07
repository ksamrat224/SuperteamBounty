use anchor_lang::prelude::*;
mod state;
mod contexts;
use contexts::*;

declare_id!("3jfJ7Kd6hryKHjoCQeTWsrVuoDgoAz5JJ18MbxL45V2c");

#[program]
pub mod vote_app {
    use super::*;
    pub fn initialize_treasury(ctx: Context<InitializeTreasury>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}


