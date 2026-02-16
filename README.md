# 🗳️ Inter College CR Voting dApp

A decentralized voting application built on Solana blockchain for transparent, secure, and tamper-proof college class representative (CR) elections. This dApp implements a token-based voting system where users purchase voting tokens with SOL and cast votes for their preferred candidates.

<div align="center">

![Solana](https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Anchor](https://img.shields.io/badge/Anchor-000000?style=for-the-badge&logo=anchor&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## ✨ Features

### 🔐 Core Functionality
- **Decentralized Voting**: All votes are recorded on Solana blockchain, ensuring transparency and immutability
- **Token-Based System**: Users purchase voting tokens with SOL to participate in elections
- **Multi-Proposal Support**: Create and manage multiple voting proposals simultaneously
- **Time-Bound Voting**: Proposals have deadlines to ensure timely elections
- **Winner Declaration**: Automatic winner selection based on vote counts
- **Voter Registry**: Track registered voters and prevent double voting

### 💼 Treasury Management
- **SOL Vault**: Secure treasury for collecting funds from token purchases
- **Configurable Pricing**: Admin can set SOL price per token purchase
- **Token Distribution**: Automated token minting on purchase
- **Withdrawal System**: Admin can withdraw accumulated SOL from treasury

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Persistent theme toggle with smooth transitions
- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Glassmorphism Effects**: Modern card designs with backdrop blur
- **Real-time Updates**: Live status indicators and loading states
- **Gradient Animations**: Dynamic backgrounds and smooth transitions
- **Lucide Icons**: Modern, crisp icon library throughout the interface

### 🛡️ Security Features
- **Authority Control**: Only admins can initialize treasury and declare winners
- **Account Validation**: Strict PDA (Program Derived Address) verification
- **Deadline Enforcement**: Prevents voting after proposal deadlines
- **Double-Vote Prevention**: Ensures one vote per voter per proposal
- **Error Handling**: Comprehensive error messages for all edge cases

---

## 🏗️ Tech Stack

### **Blockchain Layer**
- **Solana**: High-performance blockchain platform
- **Anchor Framework 0.32.1**: Rust framework for Solana smart contracts
- **Rust**: Systems programming language for on-chain programs
- **SPL Token**: Token standard for Solana

### **Frontend**
- **React 19.2.0**: Modern UI library with latest features
- **Vite 7.3.1**: Next-generation frontend build tool
- **Tailwind CSS 4.x**: Utility-first CSS framework with Vite plugin
- **Lucide React**: Beautiful, consistent icon library
- **@solana/web3.js 1.98.4**: Solana JavaScript API
- **@coral-xyz/anchor 0.32.1**: TypeScript client for Anchor programs

### **Development Tools**
- **TypeScript**: Type-safe JavaScript
- **ESLint**: Code linting and quality assurance
- **Solana CLI**: Command-line tools for Solana development
- **Anchor CLI**: Command-line tools for Anchor framework

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Rust** (latest stable) - [Install](https://www.rust-lang.org/tools/install)
- **Solana CLI** (v1.18+) - [Install Guide](https://docs.solana.com/cli/install-solana-cli-tools)
- **Anchor CLI** (v0.32.1+) - [Install Guide](https://www.anchor-lang.com/docs/installation)
- **Git** - [Download](https://git-scm.com/)
- **Yarn** or **npm** - Package manager

### Verify Installation

```bash
# Check Node.js version
node --version

# Check Rust version
rustc --version

# Check Solana CLI
solana --version

# Check Anchor CLI
anchor --version
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/vote-dapp.git
cd vote-dapp
```

### 2️⃣ Install Dependencies

#### Install Rust Dependencies
```bash
# The workspace will automatically install dependencies for all programs
cargo build-sbf
```

#### Install Frontend Dependencies
```bash
cd frontend
npm install
# or
yarn install
```

### 3️⃣ Configure Solana CLI

```bash
# Set to localhost for development
solana config set --url localhost

# Create a new keypair (if you don't have one)
solana-keygen new

# Check your configuration
solana config get

# Check your wallet address
solana address
```

### 4️⃣ Start Local Validator

Open a new terminal and run:

```bash
# Start Solana test validator
solana-test-validator
```

Keep this terminal running. The validator must be active for development.

### 5️⃣ Build and Deploy Smart Contract

Open a new terminal:

```bash
# Build the Anchor program
anchor build

# Get the program ID
anchor keys list

# Update program ID in Anchor.toml and lib.rs if needed
# Then rebuild
anchor build

# Deploy to local validator
anchor deploy
```

### 6️⃣ Run Tests (Optional)

```bash
# Run Anchor tests
anchor test --skip-local-validator
```

### 7️⃣ Start Frontend Development Server

```bash
cd frontend
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173/` (or another port if 5173 is busy).

---

## 📁 Project Structure

```
vote-dapp/
├── programs/                      # Solana smart contracts
│   └── vote_app/                  # Main voting program
│       ├── src/
│       │   ├── lib.rs            # Program entrypoint & instructions
│       │   ├── contexts.rs       # Account contexts for instructions
│       │   ├── state.rs          # Account state definitions
│       │   ├── errors.rs         # Custom error definitions
│       │   └── events.rs         # Event definitions
│       └── Cargo.toml            # Rust dependencies
│
├── frontend/                      # React frontend application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── AllProposals.jsx         # View all proposals
│   │   │   ├── ProposalInfo.jsx         # Proposal details
│   │   │   ├── RegisterProposal.jsx     # Create new proposal
│   │   │   ├── Vote.jsx                 # Cast vote
│   │   │   ├── BuyTokens.jsx            # Purchase voting tokens
│   │   │   ├── TokenBalance.jsx         # View token balance
│   │   │   ├── VoterInfo.jsx            # Voter registration status
│   │   │   ├── RegisterVoter.jsx        # Register as voter
│   │   │   ├── CloseVoter.jsx           # Close voter account
│   │   │   ├── InitializeTreasury.jsx   # Initialize system (admin)
│   │   │   ├── TreasuryInfo.jsx         # Treasury information
│   │   │   ├── WithdrawSol.jsx          # Withdraw SOL (admin)
│   │   │   ├── PickWinner.jsx           # Declare winner (admin)
│   │   │   ├── CloseProposal.jsx        # Close proposal (admin)
│   │   │   └── ThemeToggle.jsx          # Dark/light mode toggle
│   │   ├── constants/
│   │   │   └── constants.js      # RPC URLs and configuration
│   │   ├── idl/
│   │   │   └── idl.json          # Program IDL (auto-generated)
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   ├── index.css             # Global styles + Tailwind
│   │   └── polyfills.js          # Browser polyfills
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   └── package.json              # Frontend dependencies
│
├── tests/                         # Integration tests
│   └── vote_app.ts               # Anchor tests
│
├── target/                        # Build outputs
│   ├── deploy/                   # Deployed program keypair
│   ├── idl/                      # Generated IDL
│   └── types/                    # TypeScript types
│
├── migrations/                    # Deployment scripts
│   └── deploy.ts
│
├── Anchor.toml                   # Anchor configuration
├── Cargo.toml                    # Workspace configuration
├── package.json                  # Workspace package config
└── README.md                     # This file
```

---

## 🔧 Smart Contract Functions

### Admin Functions

#### `initialize_treasury`
Initializes the voting system with treasury configuration.

**Parameters:**
- `sol_price`: Amount of SOL required per token purchase
- `tokens_per_purchase`: Number of voting tokens received per purchase

**Accounts:**
- Authority (signer)
- Treasury config PDA
- SOL vault PDA
- Token mint
- Treasury token account
- Proposal counter PDA

---

#### `withdraw_sol`
Allows admin to withdraw accumulated SOL from treasury.

**Parameters:**
- `amount`: Amount of SOL to withdraw

**Accounts:**
- Authority (signer)
- SOL vault PDA
- Treasury config
- System program

---

#### `pick_winner`
Declares the winning proposal after voting deadline.

**Parameters:**
- `proposal_id`: ID of the proposal to check

**Accounts:**
- Authority (signer)
- Proposal account
- Winner account PDA
- Proposal counter
- System program

---

#### `close_proposal`
Closes a proposal and reclaims rent (admin only).

**Parameters:**
- `proposal_id`: ID of proposal to close

**Accounts:**
- Authority (signer)
- Proposal account
- Proposal counter
- System program

---

### User Functions

#### `buy_tokens`
Purchase voting tokens with SOL.

**Accounts:**
- Buyer (signer, pays SOL)
- Buyer token account
- SOL vault
- Treasury config
- Token mint
- Mint authority PDA
- Token program
- System program

---

#### `register_voter`
Register as a voter for a specific proposal.

**Parameters:**
- `proposal_id`: ID of proposal to vote in

**Accounts:**
- Voter (signer)
- Voter account PDA
- Proposal account
- System program

---

#### `vote`
Cast a vote for a proposal.

**Parameters:**
- `proposal_id`: ID of proposal to vote for
- `stake_amount`: Number of tokens to stake

**Accounts:**
- Voter (signer)
- Voter account
- Voter token account
- Proposal account
- Treasury token account
- Token mint
- Token program
- Clock sysvar

---

#### `close_voter`
Close voter account and reclaim rent after voting.

**Parameters:**
- `proposal_id`: Proposal ID voter was registered for

**Accounts:**
- Voter (signer)
- Voter account PDA
- Proposal account
- System program

---

### Proposal Management

#### `register_proposal`
Create a new voting proposal.

**Parameters:**
- `proposal_info`: Description of the proposal (max 50 chars)
- `deadline`: Unix timestamp for voting deadline

**Accounts:**
- Registrant (signer)
- Proposal account PDA
- Proposal counter
- System program
- Clock sysvar

---

## 🎮 Usage Guide

### For Voters

1. **Connect Wallet**: Click "Connect" button to connect your Solana wallet
2. **Buy Tokens**: Purchase voting tokens with SOL
3. **View Proposals**: Browse active proposals in the "All Proposals" section
4. **Register to Vote**: Register for a specific proposal
5. **Cast Vote**: Vote on your preferred proposal with your tokens
6. **Check Status**: View your voter information and registration status

### For Admins

1. **Initialize Treasury**: Set up the voting system with SOL price and token distribution
2. **Monitor Treasury**: View treasury information and accumulated funds
3. **Create Proposals**: Register new proposals for voting
4. **Declare Winners**: After deadline, pick the winning proposal
5. **Withdraw Funds**: Extract accumulated SOL from treasury
6. **Manage Proposals**: Close proposals and reclaim rent

---

## 🎨 UI Features

### Theme Toggle
- Switch between dark and light modes
- Preference saved to localStorage
- Smooth transitions and animations

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interface elements

### Component Library
- **Cards**: Glassmorphism effects with hover animations
- **Buttons**: Gradient primary buttons, secondary actions
- **Badges**: Color-coded status indicators (Active, Ended, Success, Warning, etc.)
- **Inputs**: Labeled form fields with focus states
- **Loading States**: Skeleton loaders and spinners

### Color Palette
- **Primary**: Indigo/Violet gradients
- **Neutral**: Slate/Gray tones
- **Success**: Emerald green
- **Warning**: Amber yellow
- **Danger**: Rose red
- **Info**: Cyan blue

---

## 🧪 Testing

### Run Unit Tests
```bash
anchor test
```

### Run Integration Tests
```bash
anchor test --skip-local-validator
```

### Test Frontend Locally
```bash
cd frontend
npm run build  # Build for production
npm run preview  # Preview production build
```

---

## 🌐 Deployment

### Devnet Deployment

1. **Configure for Devnet**
```bash
solana config set --url devnet
```

2. **Airdrop SOL** (if needed)
```bash
solana airdrop 2
```

3. **Build and Deploy**
```bash
anchor build
anchor deploy --provider.cluster devnet
```

4. **Update Frontend**
   - Copy program ID from deployment
   - Update IDL in `frontend/src/idl/idl.json`
   - Update constants in `frontend/src/constants/constants.js`

### Mainnet Deployment

⚠️ **Warning**: Deploying to mainnet requires real SOL and thorough testing.

1. **Audit Your Code**: Get a professional security audit
2. **Test on Devnet**: Thoroughly test all functionality
3. **Configure for Mainnet**
```bash
solana config set --url mainnet-beta
```
4. **Deploy**
```bash
anchor deploy --provider.cluster mainnet
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check if the bug already exists in [Issues](https://github.com/yourusername/vote-dapp/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, Solana version)

### Suggesting Features

1. Open an issue with the tag `enhancement`
2. Describe the feature and its benefits
3. Provide use cases and examples

### Pull Request Process

1. **Fork the Repository**
```bash
git clone https://github.com/yourusername/vote-dapp.git
cd vote-dapp
git checkout -b feature/your-feature-name
```

2. **Make Your Changes**
   - Follow existing code style
   - Write clear commit messages
   - Add tests for new features
   - Update documentation

3. **Test Your Changes**
```bash
anchor test
cd frontend && npm run build
```

4. **Submit Pull Request**
   - Push to your fork
   - Create PR to `main` branch
   - Reference related issues
   - Provide clear description of changes

### Code Style Guidelines

**Rust:**
- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use `cargo fmt` before committing
- Run `cargo clippy` for linting

**JavaScript/React:**
- Use ESLint configuration provided
- Follow React best practices
- Use functional components and hooks
- Keep components small and focused

**Commits:**
- Use conventional commit format: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(voting): add multi-vote support`

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Solana Foundation](https://solana.com/) - For the amazing blockchain platform
- [Anchor Framework](https://www.anchor-lang.com/) - For simplifying Solana development
- [React Team](https://react.dev/) - For the awesome UI library
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - For beautiful, consistent icons

---

## 📞 Support

- **Documentation**: [Solana Docs](https://docs.solana.com/)
- **Anchor Docs**: [Anchor Book](https://book.anchor-lang.com/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/vote-dapp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/vote-dapp/discussions)

---

## 🗺️ Roadmap

- [ ] Multi-signature admin control
- [ ] Proposal categories and filtering
- [ ] Vote delegation system
- [ ] Real-time vote tracking with WebSockets
- [ ] Email/SMS notifications for proposal deadlines
- [ ] Mobile app (React Native)
- [ ] DAO governance integration
- [ ] NFT-based voting rights
- [ ] Quadratic voting mechanism
- [ ] Integration with Solana Name Service

---

<div align="center">

**Built with ❤️ on Solana**

[⭐ Star this repo](https://github.com/yourusername/vote-dapp) | [🐛 Report Bug](https://github.com/yourusername/vote-dapp/issues) | [✨ Request Feature](https://github.com/yourusername/vote-dapp/issues)

</div>
