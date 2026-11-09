# RepTrack

> **Track Your Reps. Own Your Progress.**

RepTrack is a decentralized, Web3 workout-tracking application that allows athletes and fitness enthusiasts to connect their wallets, record workout sessions, track exercise details, and maintain an immutable workout history directly on the **Botchain Testnet** blockchain.

---

## 🏋️ Features

- **100% On-Chain Storage**: Every workout session (exercise name, sets, repetitions, weight in kg, category, author address, and timestamp) is saved directly into the `RepTrack.sol` smart contract on Botchain Testnet.
- **Single-Page Application**: Focused, responsive, fitness-dashboard interface with zero page refreshes or external routes.
- **Self-Sovereign History**: Only the author of a workout record has cryptographic permission to delete their own records.
- **Live Blockchain Statistics**: Real-time aggregation of total global workouts, your personal workout count, and your latest workout date directly from the smart contract.
- **MetaMask & Botchain Integration**: Seamless wallet connection, automatic chain detection (Chain ID: `968`), wrong-network detection with one-click switching to Botchain Testnet.
- **Fitness-First Aesthetics**: High-contrast, dark-mode theme (`#0D1412` background, `#19231F` cards, and `#A3E635` lime-green accents).

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Web3 / Blockchain Client**: wagmi v2, viem v2, TanStack React Query v5
- **Smart Contract**: Solidity `^0.8.20`
- **Development & Testing Harness**: Hardhat, Ethers.js v6, Mocha, Chai
- **Target Network**: Botchain Testnet (Chain ID `968`, RPC `https://rpc.bohr.life`, Explorer `https://scan.bohr.life`)

---

## 🌐 Botchain Testnet Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Currency Symbol** | `BOHR` / `BOT` |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |

---

## 📦 Project Structure

```text
RepTrack/
├── app/
│   ├── globals.css         # Fitness dashboard color tokens & styling
│   ├── layout.tsx          # Root layout with Wagmi & React Query providers
│   └── page.tsx            # Exactly ONE webpage combining all sections
├── components/
│   ├── Providers.tsx       # WagmiProvider + QueryClientProvider setup
│   ├── Navbar.tsx          # Navigation, brand, and wallet status
│   ├── Hero.tsx            # Headline and quick action anchors
│   ├── Stats.tsx           # Contract-derived metrics (Total, User, Date)
│   ├── WorkoutForm.tsx     # Form for logging sets, reps, weight, category
│   ├── WorkoutCard.tsx     # Workout record display card with author delete
│   ├── WorkoutHistory.tsx  # Workouts grid with All/My filter tabs
│   ├── WalletConnect.tsx   # MetaMask connect, switch-to-Botchain, dropdown
│   └── Footer.tsx          # Brand, network status, BohrScan link
├── contracts/
│   └── RepTrack.sol        # Solidity smart contract
├── test/
│   └── RepTrack.test.ts    # Comprehensive Hardhat unit tests
├── scripts/
│   └── deploy.ts           # Hardhat deployment script for Botchain Testnet
├── lib/
│   ├── wagmi.ts            # Botchain custom chain & wagmi client setup
│   └── contract.ts         # Contract address & complete ABI definitions
├── hardhat.config.ts       # Hardhat network & compiler configuration
├── tailwind.config.ts      # Tailwind configuration with RepTrack colors
├── .env.example            # Environment variables template
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **MetaMask**: Browser extension installed

### 2. Installation

Clone or open the repository directory and install dependencies:

```bash
npm install
```

### 3. Environment Setup

Copy `.env.example` to create `.env.local` for the frontend and `.env` for Hardhat:

```bash
cp .env.example .env.local
cp .env.example .env
```

Edit `.env` (or `.env.local`):

```env
BOTCHAIN_RPC_URL=https://rpc.bohr.life
PRIVATE_KEY=your_deployer_private_key_here
NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

> ⚠️ **Security Warning**: Never commit your real private key to version control.

---

## 🧪 Smart Contract Compilation & Testing

Compile the smart contract:

```bash
npm run compile
```

Run the comprehensive unit test suite:

```bash
npm test
```

The test suite validates:
- Initial deployment and zero count state.
- Successful workout recording with input validation.
- Rejection of empty exercise names.
- Rejection of zero sets and zero repetitions.
- Rejection of empty categories.
- Bodyweight exercises (0 kg).
- Global workout count retrieval.
- User-specific workout counts and individual user workout history.
- Authorization check: only the original author can remove a workout.
- Rejection of removing already removed or non-existent workout IDs.
- Accurate emission of `WorkoutRecorded` and `WorkoutRemoved` events.

---

## 🛰️ Deploying to Botchain Testnet

1. Ensure your deployer account has native testnet tokens on Botchain Testnet (`https://rpc.bohr.life`).
2. Run the deployment script:

```bash
npm run deploy:botchain
```

3. Copy the outputted contract address:
```text
====================================================
 RepTrack successfully deployed!
 Contract Address: 0x...
====================================================
```

4. Paste the address into `.env.local`:
```env
NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS=0xYourDeployedAddressHere
```
*(You can also set it directly as the fallback in `lib/contract.ts`)*

---

## 💻 Running the Frontend

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:

```bash
npm run build
npm run start
```

---

## 🦊 How to Connect MetaMask to Botchain Testnet

### Automatic Switching
When you click **Connect Wallet** on the RepTrack website, if your wallet is connected to a different network, a **"Switch to Botchain"** button appears. Clicking it prompts MetaMask to switch or add Botchain Testnet.

### Manual Network Configuration (if needed)
- **Network Name**: `Botchain Testnet`
- **New RPC URL**: `https://rpc.bohr.life`
- **Chain ID**: `968`
- **Currency Symbol**: `BOHR`
- **Block Explorer URL**: `https://scan.bohr.life`

---

## 🔒 Security & On-Chain Integrity

- **Access Control**: Author verification via `msg.sender == workout.author` guarantees that no other address can delete or modify another user's workout.
- **Strict Input Validation**: Solidity requires non-empty exercise names, categories, sets > 0, and reps > 0.
- **Active Record Tracking**: Deletions use active-status flags and swap-and-pop index management so that array queries return only active workouts.
- **No Mock Data**: All statistics, history cards, and user counts query the live blockchain via viem contract reads.

---

## 📄 License

MIT © RepTrack

