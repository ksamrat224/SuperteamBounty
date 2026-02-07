use anchor_lang::prelude::*;

declare_id!("3jfJ7Kd6hryKHjoCQeTWsrVuoDgoAz5JJ18MbxL45V2c");

#[program]
pub mod vote_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
